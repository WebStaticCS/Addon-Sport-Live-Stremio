const TITLE_IMAGE_MAP = require('./poster_data');

const { PLACEHOLDER_POSTER, PLACEHOLDER_BACKGROUND, IMAGE_GENERATOR_BASE_URL } = require('./config');

let generatorNotConfiguredLogged = false;

async function initImageMaps() {
    if (!TITLE_IMAGE_MAP) {
        console.error('[ImageManager] Error: El mapa de pósteres no se cargó desde los archivos locales.');
        throw new Error('Mapa de pósteres no disponible.');
    }
    console.log('[ImageManager] Mapa de pósteres locales cargados exitosamente.');

    if (!IMAGE_GENERATOR_BASE_URL || IMAGE_GENERATOR_BASE_URL.trim() === '') {
        console.log('[ImageManager] Advertencia: No se configuró IMAGE_GENERATOR_BASE_URL. Las imágenes no se generarán dinámicamente y se usarán las de poster_data.js.');
        generatorNotConfiguredLogged = true;
    }

    return Promise.resolve();
}

function getPosterImage(title, status) {
    if (!TITLE_IMAGE_MAP) {
        console.warn('[ImageManager] TITLE_IMAGE_MAP no ha sido cargado.');
        return PLACEHOLDER_POSTER;
    }

    const normalizedTitle = title.toLowerCase();
    const normalizedStatus = status ? status.toLowerCase() : '';

    let baseImageUrl = undefined;
    let longestMatchKeyword = '';

    for (const keyword in TITLE_IMAGE_MAP) {
        if (normalizedTitle.includes(keyword.toLowerCase())) {
            if (keyword.length > longestMatchKeyword.length) {
                longestMatchKeyword = keyword;
            }
        }
    }

    if (longestMatchKeyword && TITLE_IMAGE_MAP[longestMatchKeyword]) {
        baseImageUrl = TITLE_IMAGE_MAP[longestMatchKeyword];
    }

    if (!baseImageUrl && TITLE_IMAGE_MAP['default_poster']) {
        baseImageUrl = TITLE_IMAGE_MAP['default_poster'];
    }

    if (!baseImageUrl) {
        return PLACEHOLDER_POSTER;
    }

    if (IMAGE_GENERATOR_BASE_URL && IMAGE_GENERATOR_BASE_URL.trim() !== '') {
        let liveTextParam = '';

        switch (normalizedStatus) {
            case 'en vivo':
                liveTextParam = 'EN VIVO';
                break;
            case 'pronto':
                liveTextParam = 'PROXIMO';
                break;
            case 'finalizado':
                liveTextParam = 'FINALIZADO';
                break;
            default:
                return baseImageUrl;
        }

        const encodedLiveText = encodeURIComponent(liveTextParam);
        const encodedImageUrl = encodeURIComponent(baseImageUrl);

        const generatedImageUrl = `${IMAGE_GENERATOR_BASE_URL}/api/generate-image/?imageUrl=${encodedImageUrl}&liveText=${encodedLiveText}`;

        return generatedImageUrl;
    } else {
        return baseImageUrl;
    }
}

function getBackgroundImage(title) {
    if (!TITLE_IMAGE_MAP) {
        console.warn('[ImageManager] TITLE_IMAGE_MAP no ha sido cargado para el fondo.');
        return PLACEHOLDER_BACKGROUND;
    }

    const normalizedTitle = title.toLowerCase();
    let longestMatchKeyword = '';

    for (const keyword in TITLE_IMAGE_MAP) {
        if (normalizedTitle.includes(keyword.toLowerCase())) {
            if (keyword.length > longestMatchKeyword.length) {
                longestMatchKeyword = keyword;
            }
        }
    }

    let baseImageUrl = undefined;
    if (longestMatchKeyword && TITLE_IMAGE_MAP[longestMatchKeyword]) {
        baseImageUrl = TITLE_IMAGE_MAP[longestMatchKeyword];
    }

    if (!baseImageUrl && TITLE_IMAGE_MAP['default_poster']) {
        baseImageUrl = TITLE_IMAGE_MAP['default_poster'];
    }

    if (!baseImageUrl) {
        return PLACEHOLDER_BACKGROUND;
    }

    return baseImageUrl;
}

module.exports = {
    initImageMaps,
    getPosterImage,
    getBackgroundImage
};