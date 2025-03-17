"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverGenrePopularityService = void 0;
const fs = __importStar(require("fs"));
const sync_1 = require("csv-parse/sync");
class GenrePopularityService {
    constructor() {
        this.records = [];
        this.isLoaded = false;
    }
    // instance getter
    static getInstance() {
        if (!GenrePopularityService.instance) {
            GenrePopularityService.instance = new GenrePopularityService();
        }
        return GenrePopularityService.instance;
    }
    // load and parse csv data
    loadData(csvFilePath) {
        if (this.isLoaded)
            return;
        try {
            if (!fs.existsSync(csvFilePath)) {
                console.error('CSV file not found at path:', csvFilePath);
                return;
            }
            const csvData = fs.readFileSync(csvFilePath, 'utf8');
            this.records = (0, sync_1.parse)(csvData, {
                columns: true,
                skip_empty_lines: true
            });
            this.isLoaded = true;
        }
        catch (error) {
            console.error('Error loading CSV data:', error);
        }
    }
    // sort shows by genre popularity using csv data
    sortShowsByGenrePopularity(shows, genreSlug) {
        if (!this.isLoaded || !shows.length) {
            return shows;
        }
        const genreTerms = genreSlug.toLowerCase().split(/[-\s]+/);
        const relevantRecords = this.records.filter(record => genreTerms.some(term => term.length > 3 && record.Genre.toLowerCase().includes(term)));
        if (relevantRecords.length === 0) {
            return shows;
        }
        const titleToViews = new Map();
        relevantRecords.forEach(record => {
            const title = record.Series;
            const views = parseInt(record.Views.replace(/,/g, ''), 10);
            if (titleToViews.has(title)) {
                titleToViews.set(title, titleToViews.get(title) + views);
            }
            else {
                titleToViews.set(title, views);
            }
        });
        const scoredShows = shows.map(show => {
            const apiTitle = show.attributes.title;
            const views = titleToViews.get(apiTitle) || 0;
            return { show, score: views };
        });
        return scoredShows
            .sort((a, b) => b.score - a.score)
            .map(item => item.show);
    }
    // get all unique genres from the csv
    getAllGenres() {
        if (!this.isLoaded) {
            return [];
        }
        const genres = new Set();
        this.records.forEach(record => {
            genres.add(record.Genre.trim());
        });
        return Array.from(genres);
    }
    // get genres sorted by total view count
    getGenresByPopularity() {
        if (!this.isLoaded) {
            return [];
        }
        const genreViews = new Map();
        this.records.forEach(record => {
            const genre = record.Genre.trim();
            const views = parseInt(record.Views.replace(/,/g, ''), 10);
            if (genreViews.has(genre)) {
                genreViews.set(genre, genreViews.get(genre) + views);
            }
            else {
                genreViews.set(genre, views);
            }
        });
        // sort by total views and return just the genre names
        return Array.from(genreViews.entries())
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
    }
}
exports.serverGenrePopularityService = GenrePopularityService.getInstance();
