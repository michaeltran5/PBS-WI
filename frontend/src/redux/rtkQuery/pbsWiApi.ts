import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset } from '../../types/Asset';
import { Show } from '../../types/Show';
import { Episode } from '../../types/Episode';
import { Season } from '../../types/Season';
import { Pagination } from '../../types/Pagination';

const baseQuery = fetchBaseQuery({
    baseUrl: `http://localhost:3000/api/pbs-api/`,
});

export const pbsWiApi = createApi({
    reducerPath: 'pbsWiApi',
    baseQuery,
    endpoints: (builder) => ({
        getAssetByEpisodeId: builder.query<Asset, { id: string, params?: Record<string, any> }>({
            query: ({ id, params }) => ({
                url: `episodes/${id}/assets`,
                params
            }),
            transformResponse: (response: any) => {
                const assets = response?.data || [];
                return assets.find((a: any) => a.attributes?.object_type === "full_length");
            }
        }),
        getShowById: builder.query<Show, { id: string, params?: Record<string, any> }>({
            query: ({ id, params }) => ({
                url: `shows/${id}`,
                params
            }),
            transformResponse: (response: any) => {
                return response?.data || response;
            }
        }),
        getShowSeasons: builder.query<{ items: Season[], pagination: Pagination }, { id: string, params?: Record<string, any> }>({
            query: ({ id, params }) => ({
                url: `shows/${id}/seasons`,
                params
            }),
            transformResponse: (response: any) => ({
                items: response?.data,
                pagination: response?.meta?.pagination
            }),
        }),
        getSeasonEpisodes: builder.query<{ items: Episode[], pagination: Pagination }, { id: string, params?: Record<string, any> }>({
            query: ({ id, params }) => ({
                url: `seasons/${id}/episodes`,
                params: {
                    ...params,
                    'fetch-related': 'assets',
                    'sort': 'ordinal'
                }
            }),
            transformResponse: (response: any) => ({
                items: response?.data,
                pagination: {
                    ...response?.meta?.pagination,
                    has_more: response?.links?.next !== null
                }
            }),
            merge: (currentCache, newData, { arg }) => {
                if (arg.params?.page === 1) return newData;

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
    useGetShowByIdQuery,
    useGetShowSeasonsQuery,
    useGetSeasonEpisodesQuery
} = pbsWiApi;