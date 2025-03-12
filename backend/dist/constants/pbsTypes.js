"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PBS_WINDOW_TYPES = exports.PBS_ASSET_TYPES = exports.PBS_PARENT_TYPES = exports.PBS_CHILD_TYPES = exports.PBS_TYPES = void 0;
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
