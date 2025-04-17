import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { getChildItems, getList, getItem } from '../services/pbsService';
import { PBS_CHILD_TYPES, PBS_PARENT_TYPES, PBS_TYPES } from '../constants/pbsTypes';
import { serverGenrePopularityService } from '../services/sgpService';
import { getUserRecommendations, getMoreLike, getRelatedItems, PersonalizeItem } from '../services/personalizeService';
import { mapPersonalizeItemsToContent } from '../services/contentMappingService';

const router = express.Router();
const csvFilePath = path.join(__dirname, '../../public/genre-top-100-table-data.csv');
serverGenrePopularityService.loadData(csvFilePath);

// ---------------------
// PBS-based Routes
// ---------------------

router.get('/carousel-assets', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const showsResponse = await getList(PBS_TYPES.SHOW, { sort: '-updated_at', 'fetch-related': true });
    const shows = showsResponse.data;

    const episodeAssets = [];

    for (const show of shows) {
      const latestSeason = show.attributes.seasons[0];
      if (!latestSeason) continue;

      const seasonsResponse = await getChildItems(latestSeason.id, PBS_PARENT_TYPES.SEASON, PBS_CHILD_TYPES.EPISODE, { sort: '-updated_at' });
      const latestEpisode = seasonsResponse.data[0];
      if (!latestEpisode) continue;

      const episodeAssetResponse = await getChildItems(latestEpisode.id, PBS_PARENT_TYPES.EPISODE, PBS_CHILD_TYPES.ASSET);
      episodeAssets.push(...episodeAssetResponse.data.slice(0, 3 - episodeAssets.length));

      if (episodeAssets.length >= 3) break;
    }

    res.json(episodeAssets);
  } catch (error) {
    next(error);
  }
});

router.get('/top-shows', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.query;
    const localParams = { ...params, 'audience-scope': 'local', audience: 'wpne' };

    const localShows = await getList(PBS_TYPES.SHOW, localParams);
    const nonLocalShows = await getList(PBS_TYPES.SHOW, params);

    const mixedShows = [
      ...localShows.data.slice(0, 5),
      ...nonLocalShows.data.slice(0, 5),
    ];

    res.json(mixedShows);
  } catch (error) {
    next(error);
  }
});

router.get('/shows-by-genre/:genreSlug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { genreSlug } = req.params;

    const showsResponse = await getList(PBS_TYPES.SHOW, {
      'genre-slug': genreSlug,
      'platform-slug': 'partnerplayer',
    });

    if (showsResponse?.data?.length > 0) {
      showsResponse.data = serverGenrePopularityService.sortShowsByGenrePopularity(
        [...showsResponse.data],
        genreSlug
      );
    }

    res.json(showsResponse);
  } catch (error) {
    next(error);
  }
});

router.get('/assets/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const params: Record<string, any> = {};

    if (req.query['platform-slug']) {
      params['platform-slug'] = req.query['platform-slug'];
    }

    const asset = await getItem(id, PBS_TYPES.ASSET, params);
    res.json(asset);
  } catch (error) {
    next(error);
  }
});

router.get('/shows/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const params: Record<string, any> = {};

    if (req.query['platform-slug']) {
      params['platform-slug'] = req.query['platform-slug'];
    }

    const show = await getItem(id, PBS_TYPES.SHOW, params);
    res.json(show);
  } catch (error) {
    next(error);
  }
});

router.get('/episodes-by-show/:showId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { showId } = req.params;
    const params: Record<string, any> = {
      type: 'full_length',
    };

    if (req.query['platform-slug']) {
      params['platform-slug'] = req.query['platform-slug'];
    }

    const showResult = await getItem(showId, PBS_TYPES.SHOW, params);
    params['show-id'] = showResult.data.id;

    const episodes = await getList(PBS_TYPES.ASSET, params);
    res.json(episodes);
  } catch (error) {
    next(error);
  }
});

// ---------------------
// AWS Personalize Routes
// ---------------------

router.get('/top-picks/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const numResults = parseInt(req.query.limit as string || '10', 10);

    const recommendations = await getUserRecommendations(userId, numResults);
    const itemIds = recommendations.map(item => item.itemId);
    const contentItems = await mapPersonalizeItemsToContent(itemIds);

    res.json({
      topPicks: contentItems
    });
  } catch (error) {
    next(error);
  }
});

router.get('/because-you-watched/:recentItemId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recentItemId } = req.params;
    const userId = req.query.userId as string | undefined;
    const numResults = parseInt(req.query.limit as string || '10', 10);

    const relatedItems = await getRelatedItems(recentItemId, userId, numResults);
    const itemIds = relatedItems.map((item: PersonalizeItem) => item.itemId);
    const contentItems = await mapPersonalizeItemsToContent(itemIds);

    res.json({
      becauseYouWatched: contentItems,
      sourceItem: recentItemId
    });
  } catch (error) {
    next(error);
  }
});

router.get('/more-like/:itemId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.params;
    const numResults = parseInt(req.query.limit as string || '10', 10);

    const similarItems = await getMoreLike(itemId, numResults);
    const itemIds = similarItems.map(item => item.itemId);
    const contentItems = await mapPersonalizeItemsToContent(itemIds);

    res.json({
      moreLike: contentItems,
      sourceItem: itemId
    });
  } catch (error) {
    next(error);
  }
});

export default router;
