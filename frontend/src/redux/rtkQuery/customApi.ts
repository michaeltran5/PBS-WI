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
            transformResponse: (response: any) => {
                return response?.data || response;
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
        })
    }),
});

export const {
    useGetCarouselAssetsQuery,
    useGetShowsByGenreQuery,
    useGetMostRecentlyWatchedShowQuery
} = customApi;