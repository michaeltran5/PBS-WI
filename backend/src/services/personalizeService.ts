// Update backend/src/services/personalizeService.ts

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
export const getUserRecommendations = async (userId: string, numResults = 25): Promise<PersonalizeItem[]> => {
  if (!TOP_PICKS_RECOMMENDER_ARN) {
    throw new Error('TOP_PICKS_RECOMMENDER_ARN environment variable is not configured');
  }

  const cacheKey = generateCacheKey('personalize_top_picks', { userId, numResults });
  
  return cacheFetch(cache, cacheKey, async () => {
    console.log(`Getting user recommendations for ${userId}, requesting ${numResults} items`);
    
    const params = {
      recommenderArn: TOP_PICKS_RECOMMENDER_ARN,
      userId,
      numResults,
    };

    try {
      const response = await personalizeRuntime.getRecommendations(params).promise();
      console.log(`Received ${response.itemList?.length || 0} recommendations from Personalize`);
      return (response.itemList || []) as PersonalizeItem[];
    } catch (error) {
      console.error('Error getting recommendations from Personalize:', error);
      return [];
    }
  });
};

/**
 * Get "because you watched" recommendations
 * Can optionally use userId to further contextualize recommendations
 * @returns Array of PersonalizeItem objects
 */
export const getRelatedItems = async (itemId: string, userId?: string, numResults = 25): Promise<PersonalizeItem[]> => {
  if (!BECAUSE_YOU_WATCHED_RECOMMENDER_ARN) {
    throw new Error('BECAUSE_YOU_WATCHED_RECOMMENDER_ARN environment variable is not configured');
  }

  const cacheKey = generateCacheKey('personalize_related', { itemId, userId, numResults });
  
  return cacheFetch(cache, cacheKey, async () => {
    console.log(`Getting related items for ${itemId}, requesting ${numResults} items`);
    
    const params: AWS.PersonalizeRuntime.GetRecommendationsRequest = {
      recommenderArn: BECAUSE_YOU_WATCHED_RECOMMENDER_ARN,
      itemId,
      numResults,
    };

    if (userId) params.userId = userId;

    try {
      const response = await personalizeRuntime.getRecommendations(params).promise();
      console.log(`Received ${response.itemList?.length || 0} recommendations from Personalize`);
      return (response.itemList || []) as PersonalizeItem[];
    } catch (error) {
      console.error('Error getting related items from Personalize:', error);
      return [];
    }
  });
};

/**
 * Get "more like this" similar item recommendations
 * @returns Array of PersonalizeItem objects
 */
export const getMoreLike = async (itemId: string, numResults = 25): Promise<PersonalizeItem[]> => {
  if (!MORE_LIKE_RECOMMENDER_ARN) {
    throw new Error('MORE_LIKE_RECOMMENDER_ARN environment variable is not configured');
  }
  
  const cacheKey = generateCacheKey('personalize_more_like', { itemId, numResults });

  return cacheFetch(cache, cacheKey, async () => {
    console.log(`Getting more like items for ${itemId}, requesting ${numResults} items`);
    
    const params = {
      recommenderArn: MORE_LIKE_RECOMMENDER_ARN,
      itemId,
      numResults,
    };

    try {
      const response = await personalizeRuntime.getRecommendations(params).promise();
      console.log(`Received ${response.itemList?.length || 0} recommendations from Personalize`);
      return (response.itemList || []) as PersonalizeItem[];
    } catch (error) {
      console.error('Error getting more like items from Personalize:', error);
      return [];
    }
  });
};