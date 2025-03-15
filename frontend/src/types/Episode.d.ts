import { Show } from "./Show";

export type Episode = {
    id: string;
    attributes: {
        title: string;
        description_short: string;
        description_long: string;
        premiered_on: string;
        duration: number;
        ordinal: number;
        images: Array<{
            image: string;
            profile: string;
        }>;
        show: Show;
        parent_tree?: {
            attributes?: {
                ordinal?: number;
                season?: {
                    attributes?: {
                        ordinal?: number;
                    };
                };
            };
        };
    };
};