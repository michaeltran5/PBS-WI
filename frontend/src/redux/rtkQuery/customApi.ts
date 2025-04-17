import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset } from '../../types/Asset';
import { Show } from '../../types/Show';
import { PBSGenreSlug } from '../../constants/genres';
import { Episode } from '../../types/Episode';

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
        getTopShows: builder.query<Show[], { params?: Record<string, any> }>({
            query: ({ params }) => ({
                url: 'top-shows',
                params
            }),
            transformResponse: (response: any) => {
                return response?.data || response;
            }
        }),
        getShowsByGenre: builder.query<Show[], { genreSlug: PBSGenreSlug }>({
            query: ({ genreSlug }) => ({
                url: `shows-by-genre/${genreSlug}`,
            })
        })
    }),
});

export const {
    useGetCarouselAssetsQuery,
    useGetTopShowsQuery,
    useGetShowsByGenreQuery,
} = customApi;