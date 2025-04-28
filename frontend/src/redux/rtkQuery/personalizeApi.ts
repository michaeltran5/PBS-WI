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
            query: ({ userId, limit = 25 }) => ({
                url: `top-picks/${userId}`,
                params: { limit },
            }),
            transformResponse: (response: any) => response.topPicks || [],
        }),
        
        // Updated getBecauseYouWatched to handle both showId and assetId
        getBecauseYouWatched: builder.query<Show[], { 
            id: string; 
            isShowId?: boolean;
            userId?: string; 
            limit?: number 
        }>({
            query: ({ id, isShowId = false, userId, limit = 25 }) => ({
                url: `because-you-watched/${id}`,
                params: { isShowId, userId, limit },
            }),
            transformResponse: (response: any) => response.becauseYouWatched || [],
        }),
        
        getMoreLike: builder.query<Show[], { itemId: string; limit?: number }>({
            query: ({ itemId, limit = 25 }) => ({
                url: `more-like/${itemId}`,
                params: { limit },
            }),
            transformResponse: (response: any) => response.moreLike || [],
        }),
    }),
});

export const {
    useGetTopPicksQuery,
    useGetBecauseYouWatchedQuery,
    useGetMoreLikeQuery,
} = personalizeApi;