import express from 'express';
import { getChildItems, search, getRequest } from '../services/pbsService';
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

// Get PBS asset by ID
router.get('/asset/:assetId', async (req, res, next) => {
  try {
    const { assetId } = req.params;
    
    // Call PBS API to get the asset
    const response = await getRequest(`/assets/${assetId}/`);
    
    // Return the data
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/top-picks-assets', async (_req, res, next) => {
  try {
    // Define a list of featured asset IDs that you want to display
    // This is our known working asset from the example
    const featuredAssetIds = [
      '0e9060f2-fead-43c5-9dc2-ae99b8613b88',
      // Add more valid asset IDs here if needed
    ];
    
    console.log(`Fetching ${featuredAssetIds.length} PBS assets...`);
    
    // Get all assets in parallel, with error handling
    const assetPromises = featuredAssetIds.map(id => 
      getRequest(`/assets/${id}/`)
        .catch(error => {
          console.log(`Error fetching asset ID ${id}: ${error.message || 'Unknown error'}`);
          return null; // Return null for failed requests
        })
    );
    
    const assetResponses = await Promise.all(assetPromises);
    console.log(`Received ${assetResponses.filter(Boolean).length} successful responses out of ${featuredAssetIds.length} requests`);
    
    // Filter out null responses and format the rest
    const formattedAssets = assetResponses
      .filter(response => response !== null && response.data)
      .map(response => {
        try {
          const asset = response.data;
          const showId = asset.attributes?.parent_tree?.attributes?.season?.attributes?.show?.id;
          
          // Log details for debugging
          console.log(`Processing asset: ${asset.id}, title: ${asset.attributes?.title}`);
          
          return {
            id: asset.id,
            attributes: {
              title: asset.attributes?.title || 'Untitled',
              description_short: asset.attributes?.description_short || '',
              description_long: asset.attributes?.description_long || '',
              premiered_on: asset.attributes?.premiered_on || null,
              genre: {
                id: "custom",
                title: "PBS Featured",
                slug: "pbs-featured"
              },
              images: asset.attributes?.images || [],
              duration: asset.attributes?.duration || 0,
              parent_tree: asset.attributes?.parent_tree || null
            },
            showId: showId || asset.id // Fallback to asset ID if show ID is not available
          };
        } catch (error) {
          console.error('Error formatting asset:', error);
          return null;
        }
      })
      .filter(Boolean); // Filter out null entries from formatting errors
    
    console.log(`Returning ${formattedAssets.length} formatted assets`);
    res.json(formattedAssets);
  } catch (error) {
    console.error('Error in top-picks-assets endpoint:', error);
    // Return an empty array instead of an error to prevent frontend crashes
    res.json([]);
  }
});

export default router;