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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const pbsService_1 = require("../services/pbsService");
const pbsTypes_1 = require("../constants/pbsTypes");
const sgpService_1 = require("../services/sgpService");
const personalizeService_1 = require("../services/personalizeService");
const contentMappingService_1 = require("../services/contentMappingService");
const router = express_1.default.Router();
const csvFilePath = path_1.default.join(__dirname, '../../public/genre-top-100-table-data.csv');
sgpService_1.serverGenrePopularityService.loadData(csvFilePath);
// ---------------------
// PBS-based Routes
// ---------------------
router.get('/carousel-assets', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showsResponse = yield (0, pbsService_1.getList)(pbsTypes_1.PBS_TYPES.SHOW, { sort: '-updated_at', 'fetch-related': true });
        const shows = showsResponse.data;
        const episodeAssets = [];
        for (const show of shows) {
            const latestSeason = show.attributes.seasons[0];
            if (!latestSeason)
                continue;
            const seasonsResponse = yield (0, pbsService_1.getChildItems)(latestSeason.id, pbsTypes_1.PBS_PARENT_TYPES.SEASON, pbsTypes_1.PBS_CHILD_TYPES.EPISODE, { sort: '-updated_at' });
            const latestEpisode = seasonsResponse.data[0];
            if (!latestEpisode)
                continue;
            const episodeAssetResponse = yield (0, pbsService_1.getChildItems)(latestEpisode.id, pbsTypes_1.PBS_PARENT_TYPES.EPISODE, pbsTypes_1.PBS_CHILD_TYPES.ASSET);
            episodeAssets.push(...episodeAssetResponse.data.slice(0, 3 - episodeAssets.length));
            if (episodeAssets.length >= 3)
                break;
        }
        res.json(episodeAssets);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/top-shows', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const localParams = Object.assign(Object.assign({}, params), { 'audience-scope': 'local', audience: 'wpne' });
        const localShows = yield (0, pbsService_1.getList)(pbsTypes_1.PBS_TYPES.SHOW, localParams);
        const nonLocalShows = yield (0, pbsService_1.getList)(pbsTypes_1.PBS_TYPES.SHOW, params);
        const mixedShows = [
            ...localShows.data.slice(0, 5),
            ...nonLocalShows.data.slice(0, 5),
        ];
        res.json(mixedShows);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/shows-by-genre/:genreSlug', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { genreSlug } = req.params;
        const showsResponse = yield (0, pbsService_1.getList)(pbsTypes_1.PBS_TYPES.SHOW, {
            'genre-slug': genreSlug,
            'platform-slug': 'partnerplayer',
        });
        if (((_a = showsResponse === null || showsResponse === void 0 ? void 0 : showsResponse.data) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            showsResponse.data = sgpService_1.serverGenrePopularityService.sortShowsByGenrePopularity([...showsResponse.data], genreSlug);
        }
        res.json(showsResponse);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/assets/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const params = {};
        if (req.query['platform-slug']) {
            params['platform-slug'] = req.query['platform-slug'];
        }
        const asset = yield (0, pbsService_1.getItem)(id, pbsTypes_1.PBS_TYPES.ASSET, params);
        res.json(asset);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/shows/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const params = {};
        if (req.query['platform-slug']) {
            params['platform-slug'] = req.query['platform-slug'];
        }
        const show = yield (0, pbsService_1.getItem)(id, pbsTypes_1.PBS_TYPES.SHOW, params);
        res.json(show);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/episodes-by-show/:showId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { showId } = req.params;
        const params = {
            type: 'full_length',
        };
        if (req.query['platform-slug']) {
            params['platform-slug'] = req.query['platform-slug'];
        }
        const showResult = yield (0, pbsService_1.getItem)(showId, pbsTypes_1.PBS_TYPES.SHOW, params);
        params['show-id'] = showResult.data.id;
        const episodes = yield (0, pbsService_1.getList)(pbsTypes_1.PBS_TYPES.ASSET, params);
        res.json(episodes);
    }
    catch (error) {
        next(error);
    }
}));
// ---------------------
// AWS Personalize Routes
// ---------------------
router.get('/top-picks/:userId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const numResults = parseInt(req.query.limit || '10', 10);
        const recommendations = yield (0, personalizeService_1.getUserRecommendations)(userId, numResults);
        const itemIds = recommendations.map(item => item.itemId);
        const contentItems = yield (0, contentMappingService_1.mapPersonalizeItemsToContent)(itemIds);
        res.json({
            topPicks: contentItems
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/because-you-watched/:recentItemId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recentItemId } = req.params;
        const userId = req.query.userId;
        const numResults = parseInt(req.query.limit || '10', 10);
        const relatedItems = yield (0, personalizeService_1.getRelatedItems)(recentItemId, userId, numResults);
        const itemIds = relatedItems.map((item) => item.itemId);
        const contentItems = yield (0, contentMappingService_1.mapPersonalizeItemsToContent)(itemIds);
        res.json({
            becauseYouWatched: contentItems,
            sourceItem: recentItemId
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/more-like/:itemId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const numResults = parseInt(req.query.limit || '10', 10);
        const similarItems = yield (0, personalizeService_1.getMoreLike)(itemId, numResults);
        const itemIds = similarItems.map(item => item.itemId);
        const contentItems = yield (0, contentMappingService_1.mapPersonalizeItemsToContent)(itemIds);
        res.json({
            moreLike: contentItems,
            sourceItem: itemId
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
