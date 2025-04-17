"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PBS_GENRES = exports.PBS_WINDOW_TYPES = exports.PBS_ASSET_TYPES = exports.PBS_PARENT_TYPES = exports.PBS_CHILD_TYPES = exports.PBS_TYPES = void 0;
exports.PBS_TYPES = {
    ASSET: 'asset',
    EPISODE: 'episode',
    SPECIAL: 'special',
    COLLECTION: 'collection',
    SEASON: 'season',
    SHOW: 'show',
    REMOTE_ASSET: 'remote-asset',
    FRANCHISE: 'franchise',
    STATION: 'station',
    CHANGELOG: 'changelog'
};
exports.PBS_CHILD_TYPES = {
    ASSET: exports.PBS_TYPES.ASSET,
    EPISODE: exports.PBS_TYPES.EPISODE,
    SPECIAL: exports.PBS_TYPES.SPECIAL,
    COLLECTION: exports.PBS_TYPES.COLLECTION,
    SEASON: exports.PBS_TYPES.SEASON,
};
exports.PBS_PARENT_TYPES = {
    FRANCHISE: exports.PBS_TYPES.FRANCHISE,
    SHOW: exports.PBS_TYPES.SHOW,
    SEASON: exports.PBS_TYPES.SEASON,
    COLLECTION: exports.PBS_TYPES.COLLECTION,
    SPECIAL: exports.PBS_TYPES.SPECIAL,
    EPISODE: exports.PBS_TYPES.EPISODE,
};
exports.PBS_ASSET_TYPES = {
    PREVIEW: 'preview',
    CLIP: 'clip',
    EXTRA: 'extra',
    FULL_LENGTH: 'full_length',
    ALL: 'all',
};
exports.PBS_WINDOW_TYPES = {
    PUBLIC: 'public',
    ALL_MEMBERS: 'all_members',
    STATION_MEMBERS: 'station_members',
    UNAVAILABLE: 'unavailable',
    ALL: 'all',
};
exports.PBS_GENRES = {
    FOOD: { name: "Food", slug: 'food' },
    HISTORY: { name: "History", slug: 'history' },
    CULTURE: { name: "Culture", slug: 'culture' },
    NEWS_AND_PUBLIC_AFFAIRS: { name: "News and Public Affairs", slug: 'news-and-public-affairs' },
    ARTS_AND_MUSIC: { name: "Arts and Music", slug: 'arts-and-music' },
    INDIE_FILMS: { name: "Indie Films", slug: 'indie-films' },
    DRAMA: { name: "Drama", slug: 'drama' },
    SCIENCE_AND_NATURE: { name: "Science and Nature", slug: 'science-and-nature' },
    HOME_AND_HOW_TO: { name: "Home and How-to", slug: 'home-and-howto' }
};
