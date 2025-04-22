import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PBSAssetType, PBSChildType, PBSParentType, PBSType, PBSWindowType, PBS_TYPES } from '../constants/pbsTypes';
import { pbsApiClient } from '../client';

dayjs.extend(utc);

export const getRequest = async (endpoint: string, params: Record<string, any> = {}) => {
  return pbsApiClient.get(endpoint, { params }).then(res => res.data);
};

export const getItem = async (id: string, type: PBSType, params: Record<string, any> = {}) => {
  return getRequest(`/${type}s/${id}/`, params);
};

export const getList = async (type: PBSType, params: Record<string, any> = {}) => {
  return getRequest(`/${type}s/`, params);
};

export const search = async (type: PBSType, params: Record<string, any> = {}) => {
  return getRequest(`/${type}s/search/`, params);
};

export const getChildItems = async (parentId: string, parentType: PBSParentType, childType: PBSChildType, params: Record<string, any> = {}) => {
  return getRequest(`/${parentType}s/${parentId}/${childType}s/`, params);
};

export const getImages = async (id: string, type: PBSType) => {
  const item = await getItem(id, type);
  return item?.data?.attributes?.images || [];
};

export const extractImage = (responseObject: any, imageProfile: string) => {
  return responseObject?.attributes?.images?.find((image: any) =>
    image.profile.includes(imageProfile)
  ) || null;
};

export const alterPbsImage = (imageUrl: string, operation: string, width: number, height: number, type = '') => {
  const extension = type || imageUrl.split('.').pop();
  return imageUrl.replace(/^http:\/\//, 'https://') + `.${operation}.${width}x${height}.${extension}`;
};

export const getChangelog = async (params: Record<string, any> = {}) => {
  if (!params.since) {
    params.since = dayjs().utc().subtract(24, 'hour').toISOString();
  }
  return getRequest('/changelog/', params);
};

export const getAssetByTPMediaId = async (tpMediaId: string): Promise<any | null> => {
  const response = await getRequest('/assets/legacy/', { tp_media_id: tpMediaId });

  const httpCode = response?.errors?.info?.http_code;
  const redirectUrl = response?.errors?.info?.url;

  if (httpCode === 404 && redirectUrl) {
    const match = redirectUrl.match(/.*?(\/assets\/.*)\/$/);
    if (match && match[1]) {
      const fallbackEndpoint = `${match[1]}/edit/`;
      return await getRequest(fallbackEndpoint);
    }
    return null;
  }

  return response;
};

export const getShowByProgramId = async (programId: string) => {
  return getRequest('/shows/legacy/', { content_channel_id: programId });
};

export const getAssets = async (parentId: string, parentType: PBSParentType, assetType: PBSAssetType = 'all', window: PBSWindowType = 'all', params: Record<string, any> = {}) => {
  const assets = await getChildItems(parentId, parentType, 'asset', params);
  return assets.filter((asset: any) =>
    (assetType === 'all' || assetType === asset.attributes.object_type) &&
    (window === 'all' || window === asset.attributes.mvod_window)
  );
};

// Add this function to pbsService.js

export const getAssetByCID = async (cid: string) => {
  const url = `https://media.services.pbs.org/api/v1/assets/${cid}`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`${process.env.PBS_CLIENT_ID}:${process.env.PBS_CLIENT_SECRET}`).toString('base64')}`,
    Accept: 'application/json'
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(`Failed to fetch asset for CID ${cid}`, response.statusText);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.error(`Error fetching asset for CID ${cid}`, err);
    return null;
  }
};

export const findShowByAnyId = async (id: string): Promise<any> => {
  try {
    console.log(`Attempting to find show for ID: ${id}`);

    // First, try searching shows by UUID
    try {
      console.log(`Trying show search by UUID: ${id}`);
      const searchResponse = await search('show', { uuid: id });
      if (searchResponse?.data?.length) {
        console.log(`Found show by UUID: ${searchResponse.data[0].attributes?.title}`);
        return searchResponse.data[0]; // Return the first match
      }
    } catch (searchError) {
      console.log(`Show UUID search failed for ID: ${id}`);
    }

    // Try legacy lookup with TP Media ID
    try {
      console.log(`Trying legacy asset lookup for: ${id}`);
      const legacyResponse = await getAssetByTPMediaId(id);
      if (legacyResponse?.data) {
        const parentTree = legacyResponse.data.attributes?.parent_tree;
        const show = parentTree?.attributes?.season?.attributes?.show;

        if (show?.id) {
          console.log(`Found show ID ${show.id} from parent_tree`);
          const showResponse = await getItem(show.id, 'show');
          if (showResponse?.data) {
            console.log(`Successfully retrieved show ${showResponse.data.attributes?.title}`);
            return showResponse.data;
          }
        }
      }
    } catch (legacyError) {
      console.log(`Legacy lookup failed for ID: ${id}`);
    }

    console.log(`Could not resolve show for ID: ${id}`);
    return null;
  } catch (error) {
    console.error(`Error in findShowByAnyId for ID ${id}:`, error);
    return null;
  }
};
