import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset } from '../../types/Asset';
import { Show } from '../../types/Show';

const baseQuery = fetchBaseQuery({
    baseUrl: `http://localhost:3000/pbs-api/`,
});

export const pbsWiApi = createApi({
    reducerPath: 'pbsWiApi',
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
        getTopShows: builder.query<Show[], { params?: Record<string, any>}>({
            query: ({ params }) => ({
                url: 'top-shows',
                params
            }),
            transformResponse: (response: any) => {
                return response?.data || response;
            }
        }),
        getAssetById: builder.query({
            query: (id) => ({
                url: `assets/${id}`,
                params: { 'platform-slug': 'partnerplayer' }
            })
        }),
        getShowById: builder.query({
            query: (showId) => ({
                url: `shows/${showId}`,
                params: { 'platform-slug': 'partnerplayer' }
            })
        }),
        getEpisodesByShowId: builder.query({
            query: (showId) => ({
                url: `episodes-by-show/${showId}`,
                params: { 'platform-slug': 'partnerplayer' }
            })
        }),
        getShowsByGenre: builder.query<any, string>({
            query: (genreSlug) => ({
              url: `shows-by-genre/${genreSlug}`,
              params: { 'platform-slug': 'partnerplayer' }
            })
          }),
    }),
});

export const {
    useGetCarouselAssetsQuery,
    useGetTopShowsQuery,
    useGetAssetByIdQuery,
    useGetShowByIdQuery,
    useGetEpisodesByShowIdQuery,
    useGetShowsByGenreQuery
} = pbsWiApi;