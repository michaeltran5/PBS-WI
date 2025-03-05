import { Show } from "./Show";

export type Episode = {
    id: string;
    attributes: {
        title: string;
        description_short: string;
        description_long: string;
        premiered_on: string;
        duration: number;
        images: Array<{
            image: string;
            profile: string;
        }>;
        show: Show;
    };
};