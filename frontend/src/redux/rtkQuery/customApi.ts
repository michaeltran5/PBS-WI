// Fix for frontend/src/redux/rtkQuery/customApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset } from '../../types/Asset';
import { Show } from '../../types/Show';
import { PBSGenreSlug } from '../../constants/genres';

const baseQuery = fetchBaseQuery({
    baseUrl: `http://localhost:3000/api/`,
});

export const customApi = createApi({
    reducerPath: 'customApi',
    baseQuery,
    endpoints: (builder) => ({
        getCarouselAssets: builder.query<Asset[], void>({
            query: () => ({
                url: 'carousel-assets'
            }),
            transformResponse: (response: Asset[] | { data?: Asset[] }) => {
                // Handle both direct array response and response with data property
                if (Array.isArray(response)) {
                    return response;
                }
                return response?.data || [];
            }
        }),
        getShowsByGenre: builder.query<Show[], { genreSlug: PBSGenreSlug }>({
            query: ({ genreSlug }) => ({
                url: `shows-by-genre/${genreSlug}`,
            })
        }),
        getMostRecentlyWatchedShow: builder.query<{ title: string, itemId: string }, { userId: string }>({
            query: ({ userId }) => ({
                url: `most-recent/${userId}`
            })
        }),
        getPBSAssetById: builder.query<Asset, string>({
            query: (assetId) => ({
                url: `asset/${assetId}`
            }),
            transformResponse: (baseQueryReturnValue: unknown) => {
                const response = baseQueryReturnValue as { data?: Asset };
                return response?.data || (baseQueryReturnValue as Asset);
            }
        }),
        getTopPicksAssets: builder.query<Show[], void>({
            query: () => ({
                url: 'top-picks-assets'
            })
        })
    }),
});

export const {
    useGetCarouselAssetsQuery,
    useGetShowsByGenreQuery,
    useGetMostRecentlyWatchedShowQuery,
    useGetPBSAssetByIdQuery,
    useGetTopPicksAssetsQuery
} = customApi;