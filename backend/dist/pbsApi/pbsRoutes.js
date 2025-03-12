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
const pbsService_1 = require("./pbsService");
const pbsTypes_1 = require("../constants/pbsTypes");
const router = express_1.default.Router();
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
            if (episodeAssets.length >= 3) {
                res.json(episodeAssets);
                return;
            }
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
        console.log('localShows', localShows);
        console.log('nonLocalShows', nonLocalShows);
        const mixedShows = [
            ...localShows.data.slice(0, 5),
            ...nonLocalShows.data.slice(0, 5),
        ];
        console.log(mixedShows);
        res.json(mixedShows);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
