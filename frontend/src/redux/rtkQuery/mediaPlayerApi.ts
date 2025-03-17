import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset } from '../../types/Asset';
import { Show } from '../../types/Show';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PBS_API_BASE_URL,
    prepareHeaders: (headers) => {
        const username = process.env.PBS_CLIENT_ID;
        const password = process.env.PBS_CLIENT_SECRET;
        const encodedCredentials = btoa(`${username}:${password}`);

        headers.set('Authorization', `Basic ${encodedCredentials}`);
        headers.set('Content-Type', 'application/json');

        return headers;
    }
});

export const mediaPlayerApi = createApi({
    reducerPath: 'mediaPlayerApi',
    baseQuery,
    endpoints: (builder) => ({
        getCarouselAssets: builder.query<Asset[], void>({
            query: () => ({
                url: 'carousel-assets'
            })
        }),
    }),
});

export const {
    useGetCarouselAssetsQuery,
} = mediaPlayerApi;