"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstEpisodeAssetId = exports.findShowByAnyId = exports.getAssetByCID = exports.getAssets = exports.getShowByProgramId = exports.getAssetByTPMediaId = exports.getChangelog = exports.alterPbsImage = exports.extractImage = exports.getImages = exports.getChildItems = exports.search = exports.getList = exports.getItem = exports.getRequest = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const pbsTypes_1 = require("../constants/pbsTypes");
const client_1 = require("../client");
dayjs_1.default.extend(utc_1.default);
const getRequest = (endpoint_1, ...args_1) => __awaiter(void 0, [endpoint_1, ...args_1], void 0, function* (endpoint, params = {}) {
    return client_1.pbsApiClient.get(endpoint, { params }).then(res => res.data);
});
exports.getRequest = getRequest;
const getItem = (id_1, type_1, ...args_1) => __awaiter(void 0, [id_1, type_1, ...args_1], void 0, function* (id, type, params = {}) {
    return (0, exports.getRequest)(`/${type}s/${id}/`, params);
});
exports.getItem = getItem;
const getList = (type_1, ...args_1) => __awaiter(void 0, [type_1, ...args_1], void 0, function* (type, params = {}) {
    return (0, exports.getRequest)(`/${type}s/`, params);
});
exports.getList = getList;
const search = (type_1, ...args_1) => __awaiter(void 0, [type_1, ...args_1], void 0, function* (type, params = {}) {
    return (0, exports.getRequest)(`/${type}s/search/`, params);
});
exports.search = search;
const getChildItems = (parentId_1, parentType_1, childType_1, ...args_1) => __awaiter(void 0, [parentId_1, parentType_1, childType_1, ...args_1], void 0, function* (parentId, parentType, childType, params = {}) {
    return (0, exports.getRequest)(`/${parentType}s/${parentId}/${childType}s/`, params);
});
exports.getChildItems = getChildItems;
const getImages = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const item = yield (0, exports.getItem)(id, type);
    return ((_b = (_a = item === null || item === void 0 ? void 0 : item.data) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b.images) || [];
});
exports.getImages = getImages;
const extractImage = (responseObject, imageProfile) => {
    var _a, _b;
    return ((_b = (_a = responseObject === null || responseObject === void 0 ? void 0 : responseObject.attributes) === null || _a === void 0 ? void 0 : _a.images) === null || _b === void 0 ? void 0 : _b.find((image) => image.profile.includes(imageProfile))) || null;
};
exports.extractImage = extractImage;
const alterPbsImage = (imageUrl, operation, width, height, type = '') => {
    const extension = type || imageUrl.split('.').pop();
    return imageUrl.replace(/^http:\/\//, 'https://') + `.${operation}.${width}x${height}.${extension}`;
};
exports.alterPbsImage = alterPbsImage;
const getChangelog = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (params = {}) {
    if (!params.since) {
        params.since = (0, dayjs_1.default)().utc().subtract(24, 'hour').toISOString();
    }
    return (0, exports.getRequest)('/changelog/', params);
});
exports.getChangelog = getChangelog;
const getAssetByTPMediaId = (tpMediaId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const response = yield (0, exports.getRequest)('/assets/legacy/', { tp_media_id: tpMediaId });
    const httpCode = (_b = (_a = response === null || response === void 0 ? void 0 : response.errors) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.http_code;
    const redirectUrl = (_d = (_c = response === null || response === void 0 ? void 0 : response.errors) === null || _c === void 0 ? void 0 : _c.info) === null || _d === void 0 ? void 0 : _d.url;
    if (httpCode === 404 && redirectUrl) {
        const match = redirectUrl.match(/.*?(\/assets\/.*)\/$/);
        if (match && match[1]) {
            const fallbackEndpoint = `${match[1]}/edit/`;
            return yield (0, exports.getRequest)(fallbackEndpoint);
        }
        return null;
    }
    return response;
});
exports.getAssetByTPMediaId = getAssetByTPMediaId;
const getShowByProgramId = (programId) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.getRequest)('/shows/legacy/', { content_channel_id: programId });
});
exports.getShowByProgramId = getShowByProgramId;
const getAssets = (parentId_1, parentType_1, ...args_1) => __awaiter(void 0, [parentId_1, parentType_1, ...args_1], void 0, function* (parentId, parentType, assetType = 'all', window = 'all', params = {}) {
    const assets = yield (0, exports.getChildItems)(parentId, parentType, 'asset', params);
    return assets.filter((asset) => (assetType === 'all' || assetType === asset.attributes.object_type) &&
        (window === 'all' || window === asset.attributes.mvod_window));
});
exports.getAssets = getAssets;
const getAssetByCID = (cid) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://media.services.pbs.org/api/v1/assets/${cid}`;
    const headers = {
        Authorization: `Basic ${Buffer.from(`${process.env.PBS_CLIENT_ID}:${process.env.PBS_CLIENT_SECRET}`).toString('base64')}`,
        Accept: 'application/json'
    };
    try {
        const response = yield fetch(url, { headers });
        if (!response.ok) {
            console.error(`Failed to fetch asset for CID ${cid}`, response.statusText);
            return null;
        }
        return yield response.json();
    }
    catch (err) {
        console.error(`Error fetching asset for CID ${cid}`, err);
        return null;
    }
});
exports.getAssetByCID = getAssetByCID;
const findShowByAnyId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        console.log(`Attempting to find show for ID: ${id}`);
        // First, try searching shows by UUID
        try {
            console.log(`Trying show search by UUID: ${id}`);
            const searchResponse = yield (0, exports.search)('show', { uuid: id });
            if ((_a = searchResponse === null || searchResponse === void 0 ? void 0 : searchResponse.data) === null || _a === void 0 ? void 0 : _a.length) {
                console.log(`Found show by UUID: ${(_b = searchResponse.data[0].attributes) === null || _b === void 0 ? void 0 : _b.title}`);
                return searchResponse.data[0]; // Return the first match
            }
        }
        catch (searchError) {
            console.log(`Show UUID search failed for ID: ${id}`);
        }
        // Try legacy lookup with TP Media ID
        try {
            console.log(`Trying legacy asset lookup for: ${id}`);
            const legacyResponse = yield (0, exports.getAssetByTPMediaId)(id);
            if (legacyResponse === null || legacyResponse === void 0 ? void 0 : legacyResponse.data) {
                const parentTree = (_c = legacyResponse.data.attributes) === null || _c === void 0 ? void 0 : _c.parent_tree;
                const show = (_f = (_e = (_d = parentTree === null || parentTree === void 0 ? void 0 : parentTree.attributes) === null || _d === void 0 ? void 0 : _d.season) === null || _e === void 0 ? void 0 : _e.attributes) === null || _f === void 0 ? void 0 : _f.show;
                if (show === null || show === void 0 ? void 0 : show.id) {
                    console.log(`Found show ID ${show.id} from parent_tree`);
                    const showResponse = yield (0, exports.getItem)(show.id, 'show');
                    if (showResponse === null || showResponse === void 0 ? void 0 : showResponse.data) {
                        console.log(`Successfully retrieved show ${(_g = showResponse.data.attributes) === null || _g === void 0 ? void 0 : _g.title}`);
                        return showResponse.data;
                    }
                }
            }
        }
        catch (legacyError) {
            console.log(`Legacy lookup failed for ID: ${id}`);
        }
        console.log(`Could not resolve show for ID: ${id}`);
        return null;
    }
    catch (error) {
        console.error(`Error in findShowByAnyId for ID ${id}:`, error);
        return null;
    }
});
exports.findShowByAnyId = findShowByAnyId;
/**
 * Gets the first episode asset ID for a show
 * This will be used to get recommendations for a show
 */
const getFirstEpisodeAssetId = (showId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        console.log(`Getting first episode asset for show ${showId}`);
        // Step 1: Get the first season
        const seasonsResponse = yield (0, exports.getChildItems)(showId, pbsTypes_1.PBS_PARENT_TYPES.SHOW, pbsTypes_1.PBS_CHILD_TYPES.SEASON, {
            sort: 'ordinal',
            'fetch-related': true
        });
        const firstSeason = (_a = seasonsResponse === null || seasonsResponse === void 0 ? void 0 : seasonsResponse.data) === null || _a === void 0 ? void 0 : _a[0];
        if (!firstSeason) {
            console.log(`No seasons found for show ${showId}`);
            return null;
        }
        console.log(`Found first season ${firstSeason.id} for show ${showId}`);
        // Check if episodes are already included in the season
        if (((_b = firstSeason.attributes) === null || _b === void 0 ? void 0 : _b.episodes) && firstSeason.attributes.episodes.length > 0) {
            const firstEpisodeId = firstSeason.attributes.episodes[0].id;
            console.log(`Found first episode ${firstEpisodeId} for season ${firstSeason.id}`);
            // Step 3: Get the episode's assets
            const assetsResponse = yield (0, exports.getChildItems)(firstEpisodeId, pbsTypes_1.PBS_PARENT_TYPES.EPISODE, pbsTypes_1.PBS_CHILD_TYPES.ASSET);
            const fullLengthAsset = (_c = assetsResponse === null || assetsResponse === void 0 ? void 0 : assetsResponse.data) === null || _c === void 0 ? void 0 : _c.find((asset) => { var _a; return ((_a = asset.attributes) === null || _a === void 0 ? void 0 : _a.object_type) === 'full_length'; });
            if (fullLengthAsset) {
                console.log(`Found full-length asset ${fullLengthAsset.id} for episode ${firstEpisodeId}`);
                return fullLengthAsset.id;
            }
            // If no full-length asset, return the first asset
            if ((_d = assetsResponse === null || assetsResponse === void 0 ? void 0 : assetsResponse.data) === null || _d === void 0 ? void 0 : _d[0]) {
                console.log(`No full-length asset found, using first asset ${assetsResponse.data[0].id}`);
                return assetsResponse.data[0].id;
            }
        }
        else {
            // Step 2: Get the first episode
            const episodesResponse = yield (0, exports.getChildItems)(firstSeason.id, pbsTypes_1.PBS_PARENT_TYPES.SEASON, pbsTypes_1.PBS_CHILD_TYPES.EPISODE, {
                sort: 'ordinal',
                'fetch-related': true
            });
            const firstEpisode = (_e = episodesResponse === null || episodesResponse === void 0 ? void 0 : episodesResponse.data) === null || _e === void 0 ? void 0 : _e[0];
            if (!firstEpisode) {
                console.log(`No episodes found for season ${firstSeason.id}`);
                return null;
            }
            console.log(`Found first episode ${firstEpisode.id} for season ${firstSeason.id}`);
            // Step 3: Get the episode's assets
            const assetsResponse = yield (0, exports.getChildItems)(firstEpisode.id, pbsTypes_1.PBS_PARENT_TYPES.EPISODE, pbsTypes_1.PBS_CHILD_TYPES.ASSET);
            const fullLengthAsset = (_f = assetsResponse === null || assetsResponse === void 0 ? void 0 : assetsResponse.data) === null || _f === void 0 ? void 0 : _f.find((asset) => { var _a; return ((_a = asset.attributes) === null || _a === void 0 ? void 0 : _a.object_type) === 'full_length'; });
            if (fullLengthAsset) {
                console.log(`Found full-length asset ${fullLengthAsset.id} for episode ${firstEpisode.id}`);
                return fullLengthAsset.id;
            }
            // If no full-length asset, return the first asset
            if ((_g = assetsResponse === null || assetsResponse === void 0 ? void 0 : assetsResponse.data) === null || _g === void 0 ? void 0 : _g[0]) {
                console.log(`No full-length asset found, using first asset ${assetsResponse.data[0].id}`);
                return assetsResponse.data[0].id;
            }
        }
        console.log(`No assets found for show ${showId}`);
        return null;
    }
    catch (error) {
        console.error(`Error getting first episode asset for show ${showId}:`, error);
        return null;
    }
});
exports.getFirstEpisodeAssetId = getFirstEpisodeAssetId;