import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { PersonalizeItem } from '../types/PersonalizeItem';
import { cache, cacheFetch, generateCacheKey } from '../utils/cache';

dotenv.config();

// Configure AWS - use your region
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

// Create a Personalize Runtime client
const personalizeRuntime = new AWS.PersonalizeRuntime();

// Store your recommender ARNs in environment variables
const MORE_LIKE_RECOMMENDER_ARN = process.env.PERSONALIZE_MORE_LIKE_RECOMMENDER_ARN;
const BECAUSE_YOU_WATCHED_RECOMMENDER_ARN = process.env.PERSONALIZE_BECAUSE_YOU_WATCHED_RECOMMENDER_ARN;
const TOP_PICKS_RECOMMENDER_ARN = process.env.PERSONALIZE_TOP_PICKS_RECOMMENDER_ARN;


/**
 * Get top picks personalized recommendations
 * @returns Array of PersonalizeItem objects
 */
export const getUserRecommendations = async (userId: string, numResults = 10): Promise<PersonalizeItem[]> => {
  if (!TOP_PICKS_RECOMMENDER_ARN) {
    throw new Error('TOP_PICKS_RECOMMENDER_ARN environment variable is not configured');
  }

  const cacheKey = generateCacheKey('personalize_top_picks', { userId, numResults });
  
  return cacheFetch(cache, cacheKey, async () => {
    const params = {
      recommenderArn: TOP_PICKS_RECOMMENDER_ARN,
      userId,
      numResults,
    };

    const response = await personalizeRuntime.getRecommendations(params).promise();
    return (response.itemList || []) as PersonalizeItem[];
  });
};

/**
 * Get "because you watched" recommendations
 * Can optionally use userId to further contextualize recommendations
 * @returns Array of PersonalizeItem objects
 */
export const getRelatedItems = async (itemId: string, userId?: string, numResults = 10): Promise<PersonalizeItem[]> => {
  if (!BECAUSE_YOU_WATCHED_RECOMMENDER_ARN) {
    throw new Error('BECAUSE_YOU_WATCHED_RECOMMENDER_ARN environment variable is not configured');
  }

  const cacheKey = generateCacheKey('personalize_related', { itemId, userId, numResults });
  
  return cacheFetch(cache, cacheKey, async () => {
    const params: AWS.PersonalizeRuntime.GetRecommendationsRequest = {
      recommenderArn: BECAUSE_YOU_WATCHED_RECOMMENDER_ARN,
      itemId,
      numResults,
    };

    if (userId) params.userId = userId;

    const response = await personalizeRuntime.getRecommendations(params).promise();
    return (response.itemList || []) as PersonalizeItem[];
  });
};

/**
 * Get "more like this" similar item recommendations
 * @returns Array of PersonalizeItem objects
 */
export const getMoreLike = async (itemId: string, numResults = 10): Promise<PersonalizeItem[]> => {
  if (!MORE_LIKE_RECOMMENDER_ARN) {
    throw new Error('MORE_LIKE_RECOMMENDER_ARN environment variable is not configured');
  }
  
  const cacheKey = generateCacheKey('personalize_more_like', { itemId, numResults });

  return cacheFetch(cache, cacheKey, async () => {
    const params = {
      recommenderArn: MORE_LIKE_RECOMMENDER_ARN,
      itemId,
      numResults,
    };

    const response = await personalizeRuntime.getRecommendations(params).promise();
    return (response.itemList || []) as PersonalizeItem[];
  });
};