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
exports.getAssets = exports.getShowByProgramId = exports.getAssetByTPMediaId = exports.getChangelog = exports.alterPbsImage = exports.extractImage = exports.getImages = exports.getChildItems = exports.getList = exports.getItem = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pbsApiClient_1 = require("../clients/pbsApiClient");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
dotenv_1.default.config();
const apiClient = (0, pbsApiClient_1.getPBSApiClient)();
const getRequest = (endpoint_1, ...args_1) => __awaiter(void 0, [endpoint_1, ...args_1], void 0, function* (endpoint, params = {}) {
    return apiClient.get(endpoint, { params }).then(res => res.data);
});
const getItem = (id_1, type_1, ...args_1) => __awaiter(void 0, [id_1, type_1, ...args_1], void 0, function* (id, type, params = {}) {
    return getRequest(`/${type}s/${id}/`, params);
});
exports.getItem = getItem;
const getList = (type_1, ...args_1) => __awaiter(void 0, [type_1, ...args_1], void 0, function* (type, params = {}) {
    return getRequest(`/${type}s/`, params);
});
exports.getList = getList;
const getChildItems = (parentId_1, parentType_1, childType_1, ...args_1) => __awaiter(void 0, [parentId_1, parentType_1, childType_1, ...args_1], void 0, function* (parentId, parentType, childType, params = {}) {
    return getRequest(`/${parentType}s/${parentId}/${childType}s/`, params);
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
    return getRequest('/changelog/', params);
});
exports.getChangelog = getChangelog;
const getAssetByTPMediaId = (tpMediaId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let response = yield getRequest('/assets/legacy/', { tp_media_id: tpMediaId });
    if (((_a = response.errors) === null || _a === void 0 ? void 0 : _a.status) === 404) {
        const match = (_c = (_b = response.errors.data) === null || _b === void 0 ? void 0 : _b.url) === null || _c === void 0 ? void 0 : _c.match(/\/assets\/(.*?)\//);
        if (match) {
            response = yield getRequest(`/assets/${match[1]}/edit/`);
        }
    }
    return response;
});
exports.getAssetByTPMediaId = getAssetByTPMediaId;
const getShowByProgramId = (programId) => __awaiter(void 0, void 0, void 0, function* () {
    return getRequest('/shows/legacy/', { content_channel_id: programId });
});
exports.getShowByProgramId = getShowByProgramId;
const getAssets = (parentId_1, parentType_1, ...args_1) => __awaiter(void 0, [parentId_1, parentType_1, ...args_1], void 0, function* (parentId, parentType, assetType = 'all', window = 'all', params = {}) {
    const assets = yield (0, exports.getChildItems)(parentId, parentType, 'asset', params);
    return assets.filter((asset) => (assetType === 'all' || assetType === asset.attributes.object_type) &&
        (window === 'all' || window === asset.attributes.mvod_window));
});
exports.getAssets = getAssets;
