import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Show } from '../../types/Show';

const baseQuery = fetchBaseQuery({
    baseUrl: `http://localhost:3000/api/`,
});

export const personalizeApi = createApi({
    reducerPath: 'personalizeApi',
    baseQuery,
    endpoints: (builder) => ({
        getTopPicks: builder.query<Show[], { userId: string; limit?: number }>({
            query: ({ userId, limit = 10 }) => ({
                url: `top-picks/${userId}`,
                params: { limit },
            }),
            transformResponse: (response: any) => response.topPicks,
        }),
        getBecauseYouWatched: builder.query<Show[], { recentItemId: string; userId?: string; limit?: number }>({
            query: ({ recentItemId, userId, limit = 10 }) => ({
                url: `because-you-watched/${recentItemId}`,
                params: { userId, limit },
            }),
            transformResponse: (response: any) => response.becauseYouWatched,
        }),
        getMoreLike: builder.query<Show[], { itemId: string; limit?: number }>({
            query: ({ itemId, limit = 10 }) => ({
                url: `more-like/${itemId}`,
                params: { limit },
            }),
            transformResponse: (response: any) => response.moreLike,
        }),
    }),
});

export const {
    useGetTopPicksQuery,
    useGetBecauseYouWatchedQuery,
    useGetMoreLikeQuery,
} = personalizeApi;  