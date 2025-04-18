import { getItem } from './pbsService';
import { PBS_TYPES } from '../constants/pbsTypes';
import { PersonalizeItem } from '../types/PersonalizeItem';

/**
 * Map Personalize item IDs to full content objects using PBS API
 */
export const mapPersonalizeItemsToContent = async (
  itemIds: string[], 
  contentType = PBS_TYPES.SHOW
) => {
  try {
    // For better performance, use Promise.all to fetch all items in parallel
    const contentPromises = itemIds.map(id => 
      getItem(id, contentType)
        .then(response => response?.data || null)
        .catch(err => {
          console.error(`Error fetching item ${id}:`, err);
          return null;
        })
    );
    
    const contentResults = await Promise.all(contentPromises);
    
    // Filter out any nulls from failed requests
    return contentResults.filter(item => item !== null);
  } catch (error) {
    console.error('Error mapping items to content:', error);
    throw error;
  }
};

/**
 * Map Personalize recommendation objects to full content objects
 */
export const mapRecommendationsToContent = async (
  recommendations: PersonalizeItem[],
  contentType = PBS_TYPES.SHOW
) => {
  const itemIds = recommendations.map(item => item.itemId);
  return mapPersonalizeItemsToContent(itemIds, contentType);
};