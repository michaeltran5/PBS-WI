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
const pbsService_1 = require("../services/pbsService");
const pbsTypes_1 = require("../constants/pbsTypes");
const ga4Service_1 = require("../services/ga4Service");
const csvService_1 = require("../services/csvService");
const router = express_1.default.Router();
router.get('/carousel-assets', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get top show titles
        const topShowTitles = yield (0, ga4Service_1.getTopShowTitles)("1daysAgo", undefined, 6);
        if (!topShowTitles || topShowTitles.length === 0) {
            res.json([]);
            return;
        }
        // search for each show
        const searchResponses = yield Promise.all(topShowTitles.map(title => (0, pbsService_1.search)(pbsTypes_1.PBS_TYPES.SHOW, { query: title, 'fetch-related': true, limit: 1 })));
        const validShows = searchResponses.map(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a[0]; }).filter(Boolean);
        if (validShows.length === 0) {
            res.json([]);
            return;
        }
        // fetch first season of each show
        const seasonResponses = yield Promise.all(validShows.map(show => (0, pbsService_1.getChildItems)(show.id, pbsTypes_1.PBS_PARENT_TYPES.SHOW, pbsTypes_1.PBS_CHILD_TYPES.SEASON, { sort: '-ordinal', 'fetch-related': true })));
        const validSeasons = seasonResponses.map(res => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a[0]; }).filter(Boolean);
        if (validSeasons.length === 0) {
            res.json([]);
            return;
        }
        const firstEpisodeIds = validSeasons
            .map(season => { var _a, _b; return (_b = (_a = season === null || season === void 0 ? void 0 : season.attributes) === null || _a === void 0 ? void 0 : _a.episodes) === null || _b === void 0 ? void 0 : _b[0].id; })
            .filter(Boolean);
        if (firstEpisodeIds.length === 0) {
            res.json([]);
            return;
        }
        // fetch the assets for each first episode
        const assetResponses = yield Promise.all(firstEpisodeIds.map(episodeId => (0, pbsService_1.getChildItems)(episodeId, pbsTypes_1.PBS_PARENT_TYPES.EPISODE, pbsTypes_1.PBS_CHILD_TYPES.ASSET)));
        const episodeAssets = assetResponses
            .map(res => { var _a; return (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a[0]; })
            .filter(Boolean);
        res.json(episodeAssets.slice(0, 3));
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
    try {
        const { genreSlug } = req.params;
        const genreEntry = Object.values(pbsTypes_1.PBS_GENRES).find(genre => genre.slug === genreSlug);
        if (!genreEntry) {
            res.status(400).json({ error: "Invalid genre slug" });
            return;
        }
        const showTitles = yield (0, csvService_1.getShowTitlesByGenre)(genreEntry.name);
        const searchResponses = yield Promise.all(showTitles.map((title) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const result = yield (0, pbsService_1.search)(pbsTypes_1.PBS_TYPES.SHOW, { query: title, limit: 1 });
            return ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a[0]) || null;
        })));
        res.json(searchResponses.filter(Boolean));
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
            'type': 'full_length'
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
exports.default = router;
