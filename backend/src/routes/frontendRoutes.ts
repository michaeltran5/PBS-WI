import express, { Request, Response, NextFunction } from 'express';
import { getChildItems, getItem, getList, getItem, search } from '../services/pbsService';
import { PBS_CHILD_TYPES, PBS_PARENT_TYPES, PBS_TYPES } from '../constants/pbsTypes';
import { getTopShowTitles } from '../services/ga4Service';

const router = express.Router();

router.get('/carousel-assets', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // get top show titles
    const topShowTitles = await getTopShowTitles("1daysAgo", undefined, 6);
    if (!topShowTitles || topShowTitles.length === 0) {
      res.json([]);
      return;
    }

    console.log('topshowtitles', topShowTitles);

    // search for each show
    const searchResponses = await Promise.all(topShowTitles.map(title =>
      search(PBS_TYPES.SHOW, { query: title, 'fetch-related': true, limit: 1 })
    ));

    const validShows = searchResponses.map(res => res.data?.[0]).filter(Boolean);

    if (validShows.length === 0) {
      res.json([]);
      return;
    }

    // fetch first season of each show
    const seasonResponses = await Promise.all(
      validShows.map(show =>
        getChildItems(show.id, PBS_PARENT_TYPES.SHOW, PBS_CHILD_TYPES.SEASON, { sort: '-ordinal', 'fetch-related': true })
      )
    );

    const validSeasons = seasonResponses.map(res => res.data?.[0]).filter(Boolean);

    if (validSeasons.length === 0) {
      res.json([]);
      return;
    }

    const firstEpisodeIds = validSeasons
      .map(season => season?.attributes?.episodes?.[0].id)
      .filter(Boolean);

    if (firstEpisodeIds.length === 0) {
      res.json([]);
      return;
    }

    console.log('firstEpisodeIds', firstEpisodeIds);

    // fetch the assets for each first episode
    const assetResponses = await Promise.all(
      firstEpisodeIds.map(episodeId =>
        getChildItems(episodeId, PBS_PARENT_TYPES.EPISODE, PBS_CHILD_TYPES.ASSET)
      )
    );

    console.log('assetResponses', assetResponses);

    const episodeAssets = assetResponses
      .map(res => res?.data?.[0])
      .filter(Boolean);

    res.json(episodeAssets.slice(0, 3));
  } catch (error) {
    next(error);
  }
});

router.get('/top-shows', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.query;

    const localParams = { ...params, 'audience-scope': 'local', audience: 'wpne' }

    const localShows = await getList(PBS_TYPES.SHOW, localParams);
    const nonLocalShows = await getList(PBS_TYPES.SHOW, params);

    const mixedShows = [
      ...localShows.data.slice(0, 5),
      ...nonLocalShows.data.slice(0, 5),
    ];

    console.log(mixedShows);

    res.json(mixedShows);
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
      'type': 'full_length'
    };
    
    if (req.query['platform-slug']) {
      params['platform-slug'] = req.query['platform-slug'];
    }
    
    const showResult = await getItem(showId, PBS_TYPES.SHOW, params);
    const resolvedShowId = showResult.data.id;
    
    params['show-id'] = resolvedShowId;
    const episodes = await getList(PBS_TYPES.ASSET, params);
    
    res.json(episodes);
  } catch (error) {
    next(error);
  }
});



export default router;