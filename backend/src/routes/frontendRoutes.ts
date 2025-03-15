import express, { Request, Response, NextFunction } from 'express';
import { getChildItems, getList, getItem } from '../services/pbsService';
import { PBS_CHILD_TYPES, PBS_PARENT_TYPES, PBS_TYPES } from '../constants/pbsTypes';

const router = express.Router();

router.get('/carousel-assets', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const showsResponse = await getList(PBS_TYPES.SHOW, { sort: '-updated_at', 'fetch-related': true });
    const shows = showsResponse.data;

    const episodeAssets = [];

    for (const show of shows) {
      const latestSeason = show.attributes.seasons[0];
      if(!latestSeason) continue;

      const seasonsResponse = await getChildItems(latestSeason.id, PBS_PARENT_TYPES.SEASON, PBS_CHILD_TYPES.EPISODE, { sort: '-updated_at' });
      
      const latestEpisode = seasonsResponse.data[0];
      if (!latestEpisode) continue;

      const episodeAssetResponse = await getChildItems(latestEpisode.id, PBS_PARENT_TYPES.EPISODE, PBS_CHILD_TYPES.ASSET);

      episodeAssets.push(...episodeAssetResponse.data.slice(0, 3 - episodeAssets.length));

      if (episodeAssets.length >= 3) {
        res.json(episodeAssets);
        return;
      }
    }
    res.json(episodeAssets);
  } catch (error) {
    next(error);
  }
});

router.get('/top-shows', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.query;

    const localParams = { ...params, 'audience-scope': 'local', audience: 'wpne'}

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