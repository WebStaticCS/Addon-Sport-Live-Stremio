const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const { ADDON_PORT, AVAILABLE_STREAM_PROVIDERS } = require('./config'); 
const { initImageMaps } = require('./image_manager');
const { getGroupedEvents, fetchAllEvents } = require('./event_manager');

const streamProviders = require('./servers/stream_providers');

let builder;

function defineCatalogHandler() {
    builder.defineCatalogHandler(async ({ type, id, extra }) => {
        console.log(`[ADDON] defineCatalogHandler called with type=${type}, id=${id}, extra=${JSON.stringify(extra)}`);
        const statusFilter = extra.estado || 'Todos';
        const categoryFilter = extra.categoria || 'Todas';
        console.log(`[ADDON] Filters — status: ${statusFilter}, category: ${categoryFilter}`);

        if (id === 'sportslive_events_direct' && type === 'tv') {
            console.log('[ADDON] Handling sportslive_events_direct catalog request');
            const groupedEvents = await getGroupedEvents(statusFilter, categoryFilter);
            console.log(`[ADDON] Retrieved ${groupedEvents.length} event groups`);

            const metas = groupedEvents.map(eventGroup => ({
                id: `sportslive:${eventGroup.id}`,
                type: 'tv',
                name: eventGroup.title,
                poster: eventGroup.poster,
                description: eventGroup.description,
                posterShape: 'tv',
                background: eventGroup.background,
                releaseInfo: `${eventGroup.time} - ${eventGroup.displayStatus}`,
            }));
            console.log(`[ADDON] Returning ${metas.length} metas`);
            return Promise.resolve({ metas });
        }

        console.log('[ADDON] CatalogHandler fallback, no metas');
        return Promise.resolve({ metas: [] });
    });
}

function defineMetaHandler() {
    builder.defineMetaHandler(async ({ type, id }) => { 
        console.log(`[ADDON] defineMetaHandler called with type=${type}, id=${id}`);
        if (type === 'tv' && id.startsWith('sportslive:')) {
            const eventGroupId = id.replace('sportslive:', '');
            console.log(`[ADDON] Looking up eventGroupId=${eventGroupId}`);

            const groupedEvents = await getGroupedEvents('Todos', 'Todas');
            const eventGroup = groupedEvents.find(group => group.id === eventGroupId);

            if (eventGroup) {
                console.log(`[ADDON] Found event group: ${eventGroup.title}`);
                const meta = {
                    id,
                    type: 'tv',
                    name: eventGroup.title,
                    poster: eventGroup.poster,
                    background: eventGroup.background,
                    description: eventGroup.description,
                    releaseInfo: `${eventGroup.time} - ${eventGroup.displayStatus}`,
                    posterShape: 'tv',
                };
                console.log('[ADDON] Returning meta object');
                return Promise.resolve({ meta });
            }
            console.log('[ADDON] No eventGroup found, returning null meta');
        }
        console.log('[ADDON] MetaHandler fallback, returning null');
        return Promise.resolve({ meta: null });
    });
}

function defineStreamHandler() {
    builder.defineStreamHandler(async (args) => {
        console.log(`[ADDON] defineStreamHandler called with type=${args.type}, id=${args.id}, extra=${JSON.stringify(args.extra)}`);
        if (args.type === 'tv' && args.id.startsWith('sportslive:')) {
            const eventGroupId = args.id.replace('sportslive:', '');
            console.log(`[ADDON] Streaming for eventGroupId=${eventGroupId}`);

            const groupedEvents = await getGroupedEvents('Todos', 'Todas');
            const eventGroup = groupedEvents.find(group => group.id === eventGroupId);

            if (!eventGroup) {
                console.log('[ADDON] No eventGroup found, no streams');
                return Promise.resolve({ streams: [] });
            }

            if (eventGroup.displayStatus === 'FINALIZADO') {
                console.log('[ADDON] Event is finalized, no streams');
                return Promise.resolve({ streams: [] });
            }

            const links = eventGroup.links || [];
            console.log(`[ADDON] Found ${links.length} link(s) for streams`);

            if (links.length === 0) {
                console.log('[ADDON] No links available, returning empty streams');
                return Promise.resolve({ streams: [] });
            }

            const userConfig = args.extra.config || {};
            const enabledProviders = userConfig.enabledProviders && userConfig.enabledProviders.length
                ? userConfig.enabledProviders
                : AVAILABLE_STREAM_PROVIDERS.map(p => p.id);
            console.log(`[ADDON] Enabled providers: ${enabledProviders.join(', ')}`);

            let optionCounter = 1;
            const streams = [];
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                console.log(`[ADDON] Processing link #${i + 1}: ${link}`);
                const urlObj = new URL(link);
                let streamNameFromLink = (urlObj.searchParams.get('stream') || 'Canal Desconocido')
                    .replace(/_/g, ' ')
                    .toUpperCase();

                for (const providerId in streamProviders) {
                    if (!enabledProviders.includes(providerId)) continue;
                    console.log(`[ADDON] Attempting provider: ${providerId}`);
                    const getProviderUrl = streamProviders[providerId];
                    try {
                        const decipheredUrl = await getProviderUrl(link);
                        if (decipheredUrl) {
                            const providerName = ({ streamtp: 'StreamTP', la12hd: 'La12HD', '1envivo': '1EnVivo' }[providerId] || providerId);
                            const title = `${streamNameFromLink} (Opción ${optionCounter})\nDesde ${providerName}`;
                            streams.push({ url: decipheredUrl, title });
                            console.log(`[ADDON] Added stream option ${optionCounter}: ${title}`);
                            optionCounter++;
                        }
                    } catch (error) {
                        console.error(`[ADDON] Error with provider=${providerId}, event=${eventGroup.title}, linkIndex=${i + 1}, url=${link}:`, error.message);
                    }
                }
            }

            console.log(`[ADDON] Returning ${streams.length} stream(s)`);
            return Promise.resolve({ streams });
        }

        console.log('[ADDON] StreamHandler fallback, no streams');
        return Promise.resolve({ streams: [] });
    });
}




Promise.all([
    initImageMaps(),
    fetchAllEvents() 
])
.then(([_, allEventsData]) => { 
    const categoriesSet = new Set(allEventsData.map(event => event.category).filter(Boolean));
    uniqueCategories = Array.from(categoriesSet).sort(); 
    
    
    builder = addonBuilder({
        id: 'com.stremio.sports.live.addon',
        version: '1.0.0',
        name: 'Sports Live',
        description: 'Live sporting events',
        logo: 'https://i.imgur.com/eo6sbBO.png',

        types: ['tv'],
        resources: ['catalog', 'meta', 'stream'],
        idPrefixes: ['sportslive:'],

        catalogs: [
            {
                id: 'sportslive_events_direct',
                name: 'Eventos Deportivos',
                type: 'tv',
                extra: [
                    {
                        name: 'estado',
                        options: ['Todos', 'En vivo', 'Pronto', 'Finalizados'],
                        isRequired: false,
                        default: 'Todos'
                    },
                    { 
                        name: 'categoria',
                        options: ['Todas', ...uniqueCategories],
                        isRequired: false,
                        default: 'Todas'
                    }
                ]
            }
        ],

        behaviorHints: {
            configurable: true, 
        },
    });

    defineCatalogHandler();
    defineMetaHandler();
    defineStreamHandler();


    const manifest = builder.getInterface().manifest;

    serveHTTP(builder.getInterface(), {
        port: ADDON_PORT,
        middleware: (req, res, next) => {
            next(); 
        }
    });
})
.catch(err => {
    console.error(`[ADDON] ¡ERROR CRÍTICO! El addon no se pudo iniciar porque no se pudieron cargar todos los mapas de imágenes o el HTML de la homepage.`, err);
    process.exit(1);
});
