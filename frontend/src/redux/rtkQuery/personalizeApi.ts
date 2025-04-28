// frontend/src/redux/rtkQuery/personalizeApi.ts
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

        getBecauseYouWatched: builder.query<Show[], { 
            id: string; 
            isShowId?: boolean;
            userId?: string; 
            limit?: number 
        }>({
            query: ({ id, isShowId = false, userId, limit = 25 }) => ({
                url: `because-you-watched/${id}`,
                params: { 
                  isShowId, 
                  userId, 
                  limit,
                  // Add timestamp to help with caching
                  _t: Math.floor(Date.now() / 10000) // Change every 10 seconds
                },
            }),
            transformResponse: (response: any) => response.becauseYouWatched || [],
            // Use a more targeted cache key based on the specific show
            serializeQueryArgs: ({ queryArgs }) => {
                return `becauseYouWatched-${queryArgs.id}`;
            },
            // Force refetch when the show ID changes
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.id !== previousArg?.id;
            },
            // Only keep data for 1 second
            keepUnusedDataFor: 1,
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