export const PBS_GENRES = {
    FOOD: { name: "Food", slug: 'food' },
    HISTORY: { name: "History", slug: 'history' },
    CULTURE: { name: "Culture", slug: 'culture' },
    NEWS_AND_PUBLIC_AFFAIRS: { name: "News and Public Affairs", slug: 'news-and-public-affairs' },
    ARTS_AND_MUSIC: { name: "Arts and Music", slug: 'arts-and-music' },
    INDIE_FILMS: { name: "Indie Films", slug: 'indie-films' },
    DRAMA: { name: "Drama", slug: 'drama' },
    SCIENCE_AND_NATURE: { name: "Science and Nature", slug: 'science-and-nature' },
    HOME_AND_HOW_TO: { name: "Home and How-to", slug: 'home-and-howto' }
}

export type PBSGenre = (typeof PBS_GENRES)[keyof typeof PBS_GENRES];
export type PBSGenreSlug = (typeof PBS_GENRES)[keyof typeof PBS_GENRES]["slug"];
export type PBSGenreName = (typeof PBS_GENRES)[keyof typeof PBS_GENRES]["name"];