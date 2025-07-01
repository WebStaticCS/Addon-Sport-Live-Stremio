// PORT
const ADDON_PORT = process.env.PORT || 7000;
// URL IMAGE VERCEL:  ==>>  'https://URL.vercel.app/api/generate-image'
const IMAGE_GENERATOR_BASE_URL = process.env.IMAGE_GENERATOR_BASE_URL || '';
// DESTINATION time zone offset in hours (e.g. -3 for UTC-3).
const TIMEZONE_OFFSET_HOURS = parseInt(process.env.TIMEZONE_OFFSET_HOURS || '-3', 10); 









//-------------------------------------------------------------------------------------------------

const PLACEHOLDER_POSTER = 'https://via.placeholder.com/200x300?text=No+Poster';
const PLACEHOLDER_BACKGROUND = 'https://via.placeholder.com/1280x720?text=No+Background';
const EVENTS_JSON_URL = 'https://streamtpglobal.com/eventos.json?nocache=1748748608282';
const SOURCE_TIMEZONE_OFFSET_HOURS = parseInt(process.env.SOURCE_TIMEZONE_OFFSET_HOURS || '-8', 10); 

// Lista de proveedores de stream disponibles
const AVAILABLE_STREAM_PROVIDERS = [
    { id: 'streamtp', name: 'StreamTP' },
    { id: 'la12hd', name: 'La12HD' },
    { id: '1envivo', name: '1EnVivo' },
];

module.exports = {
    ADDON_PORT,
    EVENTS_JSON_URL,
    IMAGE_GENERATOR_BASE_URL,
    SOURCE_TIMEZONE_OFFSET_HOURS, 
    TIMEZONE_OFFSET_HOURS, 
    PLACEHOLDER_POSTER,
    PLACEHOLDER_BACKGROUND,
    AVAILABLE_STREAM_PROVIDERS
};
