import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS - use your region
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

// Create a Personalize Runtime client
const personalizeRuntime = new AWS.PersonalizeRuntime();

// Define the PersonalizeItem interface
export interface PersonalizeItem {
  itemId: string;
  score?: number;
}

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
  
  const params = {
    recommenderArn: TOP_PICKS_RECOMMENDER_ARN,
    userId: userId,
    numResults: numResults
  };
  
  try {
    const response = await personalizeRuntime.getRecommendations(params).promise();
    // Explicitly cast the response to our PersonalizeItem[] type
    return (response.itemList || []) as PersonalizeItem[];
  } catch (error) {
    console.error('Error getting top picks recommendations:', error);
    throw error;
  }
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
  
  const params: AWS.PersonalizeRuntime.GetRecommendationsRequest = {
    recommenderArn: BECAUSE_YOU_WATCHED_RECOMMENDER_ARN,
    itemId: itemId,
    numResults: numResults
  };
  
  // Optionally add userId if available for context
  if (userId) {
    params.userId = userId;
  }
  
  try {
    const response = await personalizeRuntime.getRecommendations(params).promise();
    // Explicitly cast the response to our PersonalizeItem[] type
    return (response.itemList || []) as PersonalizeItem[];
  } catch (error) {
    console.error('Error getting "because you watched" recommendations:', error);
    throw error;
  }
};

/**
 * Get "more like this" similar item recommendations
 * @returns Array of PersonalizeItem objects
 */
export const getMoreLike = async (itemId: string, numResults = 10): Promise<PersonalizeItem[]> => {
  if (!MORE_LIKE_RECOMMENDER_ARN) {
    throw new Error('MORE_LIKE_RECOMMENDER_ARN environment variable is not configured');
  }
  
  const params = {
    recommenderArn: MORE_LIKE_RECOMMENDER_ARN,
    itemId: itemId,
    numResults: numResults
  };
  
  try {
    const response = await personalizeRuntime.getRecommendations(params).promise();
    // Explicitly cast the response to our PersonalizeItem[] type
    return (response.itemList || []) as PersonalizeItem[];
  } catch (error) {
    console.error('Error getting "more like" recommendations:', error);
    throw error;
  }
};