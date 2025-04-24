// Update backend/src/services/contentMappingService.ts

import { getItem } from './pbsService';
import { PBS_TYPES } from '../constants/pbsTypes';
import { PersonalizeItem } from '../types/PersonalizeItem';

/**
 * Map Personalize item IDs to full content objects using PBS API
 * This function now converts assets to their parent shows
 */
export const mapPersonalizeItemsToContent = async (
  itemIds: string[], 
  contentType = PBS_TYPES.ASSET
) => {
  try {
    console.log(`Mapping ${itemIds.length} item IDs to content objects of type ${contentType}`);
    
    // For better performance, use Promise.all to fetch all items in parallel
    const contentPromises = itemIds.map(id => 
      getItem(id, contentType)
        .then(async (response) => {
          if (!response?.data) {
            console.log(`No data in response for item ${id}`);
            return null;
          }
          
          console.log(`Successfully fetched ${contentType} for item ${id}`);
          
          // If this is an asset, we need to convert it to a show
          if (contentType === PBS_TYPES.ASSET) {
            try {
              // Extract the show ID from the asset's parent tree
              const showId = response.data.attributes?.parent_tree?.attributes?.season?.attributes?.show?.id;
              
              if (!showId) {
                console.log(`No show ID found in asset ${id}`);
                
                // Return the asset as is, but format it to look like a show
                return {
                  id: response.data.id,
                  attributes: {
                    title: response.data.attributes.title,
                    description_short: response.data.attributes.description_short,
                    description_long: response.data.attributes.description_long,
                    premiered_on: response.data.attributes.premiered_on,
                    genre: {
                      id: "asset",
                      title: "PBS Content",
                      slug: "pbs-content"
                    },
                    images: response.data.attributes.images
                  },
                  // Store the original asset ID so we can use it for playback
                  assetId: response.data.id
                };
              }
              
              console.log(`Found show ID ${showId} for asset ${id}, fetching show details`);
              
              // Fetch the show using the show ID
              const showResponse = await getItem(showId, PBS_TYPES.SHOW);
              
              if (!showResponse?.data) {
                console.log(`Failed to fetch show ${showId} for asset ${id}`);
                return null;
              }
              
              console.log(`Successfully fetched show ${showId} for asset ${id}`);
              
              // Return the show, but keep the asset ID for reference
              return {
                ...showResponse.data,
                // Store the original asset ID so we can use it for playback
                assetId: response.data.id
              };
            } catch (error) {
              console.error(`Error converting asset ${id} to show:`, error);
              return null;
            }
          }
          
          // If it's already a show, just return it
          return response.data;
        })
        .catch(err => {
          console.error(`Error fetching item ${id}:`, err.message || err);
          return null;
        })
    );
    
    const contentResults = await Promise.all(contentPromises);
    console.log(`Completed fetching ${contentResults.length} items`);
    
    // Filter out any nulls from failed requests
    const validContent = contentResults.filter(item => item !== null);
    console.log(`${validContent.length} valid content items after filtering nulls`);
    
    return validContent;
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
  contentType = PBS_TYPES.ASSET
) => {
  try {
    console.log(`Mapping ${recommendations.length} recommendation items to content objects`);
    const itemIds = recommendations.map(item => item.itemId);
    return mapPersonalizeItemsToContent(itemIds, contentType);
  } catch (error) {
    console.error('Error mapping recommendations to content:', error);
    throw error;
  }
};