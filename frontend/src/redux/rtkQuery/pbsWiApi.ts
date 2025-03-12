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
            })
        }),
        getTopShows: builder.query<Show[], { params?: Record<string, any>}>({
            query: ({ params }) => ({
                url: 'top-shows',
                params
            })
        })
    }),
});

export const {
    useGetCarouselAssetsQuery,
    useGetTopShowsQuery
} = pbsWiApi;