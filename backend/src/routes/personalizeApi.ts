import express, { Request, Response, NextFunction } from 'express';
import { getMoreLike, getRelatedItems, getUserRecommendations } from '../services/personalizeService';
import { mapPersonalizeItemsToContent } from '../services/contentMappingService';
import { PersonalizeItem } from '../types/PersonalizeItem';

const router = express.Router();

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