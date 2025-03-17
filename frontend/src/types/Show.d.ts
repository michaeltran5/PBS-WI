export type Show = {
    id: string;
    attributes: {
        title: string,
        description_short: string,
        description_long: string,
        premiered_on: string,
        genre: {
            id: string,
            title: string
        },
        images?: Array<{
            image?: string;
            profile: string;
        }>;
    }
}