import express, { Request, Response, NextFunction } from 'express';
import { getMoreLike, getRelatedItems, getUserRecommendations } from '../services/personalizeService';
import { mapPersonalizeItemsToContent } from '../services/contentMappingService';
import { PersonalizeItem } from '../types/PersonalizeItem';
import { getFirstEpisodeAssetId } from '../services/pbsService';

const router = express.Router();

router.get('/top-picks/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const numResults = parseInt(req.query.limit as string || '25', 10);

        console.log(`GET /top-picks/${userId} with limit=${numResults}`);
        
        const recommendations = await getUserRecommendations(userId, numResults);
        console.log(`Received ${recommendations.length} recommendations from getUserRecommendations`);
        
        const itemIds = recommendations.map(item => item.itemId);
        console.log(`Mapping recommendations to content for item IDs: ${itemIds.join(', ')}`);
        
        const contentItems = await mapPersonalizeItemsToContent(itemIds);
        console.log(`Successfully mapped ${contentItems.length} content items`);

        res.json({
            topPicks: contentItems
        });
    } catch (error) {
        console.error('Error in /top-picks/:userId endpoint:', error);
        next(error);
    }
});

router.get('/because-you-watched/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params; // This could be either a showId or an assetId
        const isShowId = req.query.isShowId === 'true';
        const userId = req.query.userId as string | undefined;
        const numResults = parseInt(req.query.limit as string || '25', 10);

        console.log(`GET /because-you-watched/${id} with isShowId=${isShowId}, userId=${userId}, limit=${numResults}`);
        
        let itemId = id;
        
        // If this is a showId, get the first episode's assetId
        if (isShowId) {
            console.log(`Converting showId ${id} to assetId for recommendations`);
            const assetId = await getFirstEpisodeAssetId(id);
            
            if (!assetId) {
                console.log(`No asset found for show ${id}`);
                res.json({
                    becauseYouWatched: [],
                    sourceItem: id
                });
                return;
            }
            
            console.log(`Using assetId ${assetId} for recommendations`);
            itemId = assetId;
        }
        
        // Get related items from Personalize
        const relatedItems = await getRelatedItems(itemId, userId, numResults);
        console.log(`Received ${relatedItems.length} related items from getRelatedItems`);
        
        if (relatedItems.length === 0) {
            res.json({
                becauseYouWatched: [],
                sourceItem: id
            });
            return;
        }
        
        // Extract item IDs from the recommendations
        const itemIds = relatedItems.map((item: PersonalizeItem) => item.itemId);
        console.log(`Mapping related items to content for item IDs: ${itemIds.join(', ')}`);
        
        // Map item IDs to content objects
        const contentItems = await mapPersonalizeItemsToContent(itemIds);
        console.log(`Successfully mapped ${contentItems.length} content items`);

        res.json({
            becauseYouWatched: contentItems,
            sourceItem: id
        });
    } catch (error) {
        console.error('Error in /because-you-watched/:id endpoint:', error);
        next(error);
    }
});


router.get('/more-like/:itemId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { itemId } = req.params;
        const numResults = parseInt(req.query.limit as string || '25', 10);

        console.log(`GET /more-like/${itemId} with limit=${numResults}`);
        
        const similarItems = await getMoreLike(itemId, numResults);
        console.log(`Received ${similarItems.length} similar items from getMoreLike`);
        
        const itemIds = similarItems.map(item => item.itemId);
        console.log(`Mapping similar items to content for item IDs: ${itemIds.join(', ')}`);
        
        const contentItems = await mapPersonalizeItemsToContent(itemIds);
        console.log(`Successfully mapped ${contentItems.length} content items`);

        res.json({
            moreLike: contentItems,
            sourceItem: itemId
        });
    } catch (error) {
        console.error('Error in /more-like/:itemId endpoint:', error);
        next(error);
    }
});

export default router;