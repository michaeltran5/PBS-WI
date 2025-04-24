import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset } from '../../types/Asset';
import { Show } from '../../types/Show';
import { Episode } from '../../types/Episode';
import { Season } from '../../types/Season';
import { Pagination } from '../../types/Pagination';

// Define response types to handle the data property
interface BaseResponse {
    data?: unknown;
    meta?: {
        pagination?: Pagination;
    };
    links?: {
        next: string | null;
    };
}

interface AssetResponse extends BaseResponse {
    data: Asset | Asset[];
}

interface ShowResponse extends BaseResponse {
    data: Show;
}

interface SeasonResponse extends BaseResponse {
    data: Season[];
}

interface EpisodeResponse extends BaseResponse {
    data: Episode[];
}

const baseQuery = fetchBaseQuery({
    baseUrl: `http://localhost:3000/api/pbs-api/`,
});

export const pbsWiApi = createApi({
    reducerPath: 'pbsWiApi',
    baseQuery,
    endpoints: (builder) => ({
        getAssetByEpisodeId: builder.query<Asset, { id: string, params?: Record<string, string> }>({
            query: ({ id, params }) => ({
                url: `episodes/${id}/assets`,
                params
            }),
            transformResponse: (response: AssetResponse) => {
                const assets = Array.isArray(response.data) ? response.data : [];
                return assets.find((a) => a.attributes?.object_type === "full_length") as Asset;
            }
        }),
        getAssetById: builder.query<Asset, string | { id: string, params?: Record<string, any> }>({
            query: (arg) => {
                if (typeof arg === 'string') {
                    return {
                        url: `assets/${arg}`
                    };
                } else {
                    return {
                        url: `assets/${arg.id}`,
                        params: arg.params
                    };
                }
            },
            transformResponse: (response: AssetResponse | any) => {
                if (response?.data) {
                    return Array.isArray(response.data) ? response.data[0] : response.data;
                }
                return response;
            }
        }),
        getShowById: builder.query<Show, { id: string, params?: Record<string, string> }>({
            query: ({ id, params }) => ({
                url: `shows/${id}`,
                params
            }),
            transformResponse: (response: ShowResponse) => {
                return response.data;
            }
        }),
        getShowSeasons: builder.query<{ items: Season[], pagination: Pagination }, { id: string, params?: Record<number, string> }>({
            query: ({ id, params }) => ({
                url: `shows/${id}/seasons`,
                params
            }),
            transformResponse: (response: SeasonResponse) => ({
                items: response.data,
                pagination: response.meta?.pagination as Pagination
            }),
        }),
        getSeasonEpisodes: builder.query<{ items: Episode[], pagination: Pagination }, { id: string, params?: Record<string, string> }>({
            query: ({ id, params }) => ({
                url: `seasons/${id}/episodes`,
                params: {
                    ...params,
                    'fetch-related': 'assets',
                    'sort': 'ordinal'
                }
            }),
            transformResponse: (response: EpisodeResponse) => ({
                items: response.data,
                pagination: {
                    ...response.meta?.pagination as Pagination,
                    has_more: response.links?.next !== null
                }
            }),
            merge: (currentCache, newData, { arg }) => {
                if (arg.params?.page === '1') return newData;

                return {
                    ...newData,
                    items: [...currentCache.items, ...newData.items],
                };
            },
            serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs.id}-${queryArgs.params}`,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.params?.page !== previousArg?.params?.page;
            }
        }),
    }),
});

export const {
    useGetAssetByEpisodeIdQuery,
    useGetAssetByIdQuery,
    useGetShowByIdQuery,
    useGetShowSeasonsQuery,
    useGetSeasonEpisodesQuery
} = pbsWiApi;