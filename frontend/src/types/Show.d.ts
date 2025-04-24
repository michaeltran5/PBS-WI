// Update frontend/src/types/Show.d.ts

import { PBSGenreName, PBSGenreSlug } from "../constants/genres";

export type Show = {
    id: string;
    attributes: {
        title?: string,
        description_short?: string,
        description_long?: string,
        premiered_on?: string,
        genre?: {
            id: string,
            title: PBSGenreName,
            slug: PBSGenreSlug
        },
        images?: Array<{
            image?: string;
            profile: string;
        }>
        featured_preview?: string;
    },
    seasons_count?: number;
    showId?: string;
    // Added for PBS assets converted to shows
    assetId?: string;
};