import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PBSAssetType, PBSChildType, PBSParentType, PBSType, PBSWindowType } from '../constants/pbsTypes';
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

export const getAssetByTPMediaId = async (tpMediaId: string) => {
  let response = await getRequest('/assets/legacy/', { tp_media_id: tpMediaId });

  if (response.errors?.status === 404) {
    const match = response.errors.data?.url?.match(/\/assets\/(.*?)\//);
    if (match) {
      response = await getRequest(`/assets/${match[1]}/edit/`);
    }
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