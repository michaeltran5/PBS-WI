export type Season = {
    id: string;
    attributes: {
        ordinal: number;
        episodes: Array<{
            id: string;
        }>;
    }
}