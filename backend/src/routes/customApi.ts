import express from 'express';
import { getChildItems, search } from '../services/pbsService';
import { PBS_CHILD_TYPES, PBS_GENRES, PBS_PARENT_TYPES, PBS_TYPES } from '../constants/pbsTypes';
import { getTopShowTitles } from '../services/ga4Service';
import { getMostRecentlyWatchedShow, getShowTitlesByGenre } from '../services/csvService';

const router = express.Router();

router.get('/carousel-assets', async (_req, res, next) => {
  try {
    // get top show titles
    const topShowTitles = await getTopShowTitles("1daysAgo", undefined, 6);
    if (!topShowTitles || topShowTitles.length === 0) {
      res.json([]);
      return;
    }

    // search for each show
    const searchResponses = await Promise.all(topShowTitles.map(title =>
      search(PBS_TYPES.SHOW, { query: title, 'fetch-related': true, limit: 1 })
    ));

    const validShows = searchResponses.map(res => res.data?.[0]).filter(Boolean);

    if (validShows.length === 0) {
      res.json([]);
      return;
    }

    // fetch latest season of each show
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

    // fetch the assets for each latest episode
    const assetResponses = await Promise.all(
      firstEpisodeIds.map(episodeId =>
        getChildItems(episodeId, PBS_PARENT_TYPES.EPISODE, PBS_CHILD_TYPES.ASSET)
      )
    );

    const episodeAssets = assetResponses
      .map(res => res?.data?.[0])
      .filter(Boolean);

    res.json(episodeAssets.slice(0, 3));
  } catch (error) {
    next(error);
  }
});

router.get('/shows-by-genre/:genreSlug', async (req, res, next) => {
  try {
    const { genreSlug } = req.params;

    const genreEntry = Object.values(PBS_GENRES).find(genre => genre.slug === genreSlug);

    if (!genreEntry) {
      res.status(400).json({ error: "Invalid genre slug" });
      return;
    }

    const showTitles = await getShowTitlesByGenre(genreEntry.name);

    const searchResponses = await Promise.all(
      showTitles.map(async (title) => {
        const result = await search(PBS_TYPES.SHOW, { query: title, limit: 1 });
        return result?.data?.[0] || null;
      })
    );

    res.json(searchResponses.filter(Boolean)); 

  } catch (error) {
    next(error);
  }
});

router.get('/most-recent/:uid', async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await getMostRecentlyWatchedShow(uid);

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'No viewing history found for user.' });
    }
  } catch (error) {
    next(error);
  }
});

export default router;