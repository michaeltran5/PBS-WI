import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

interface GenreData {
  Genre: string;
  Views: string;
  Series: string;
}

interface Show {
  id: string;
  attributes: {
    title: string;
    [key: string]: any;
  };
}

class GenrePopularityService {
  private records: GenreData[] = [];
  private isLoaded: boolean = false;
  private static instance: GenrePopularityService;

  private constructor() {}

  // instance getter
  public static getInstance(): GenrePopularityService {
    if (!GenrePopularityService.instance) {
      GenrePopularityService.instance = new GenrePopularityService();
    }
    return GenrePopularityService.instance;
  }

  // load and parse csv data
  public loadData(csvFilePath: string): void {
    if (this.isLoaded) return;

    try {
      if (!fs.existsSync(csvFilePath)) {
        console.error('CSV file not found at path:', csvFilePath);
        return;
      }

      const csvData = fs.readFileSync(csvFilePath, 'utf8');
      this.records = parse(csvData, {
        columns: true,
        skip_empty_lines: true
      });
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Error loading CSV data:', error);
    }
  }

  // sort shows by genre popularity using csv data
  public sortShowsByGenrePopularity(shows: Show[], genreSlug: string): Show[] {
    if (!this.isLoaded || !shows.length) {
      return shows;
    }

    const genreTerms = genreSlug.toLowerCase().split(/[-\s]+/);
    const relevantRecords = this.records.filter(record => 
      genreTerms.some(term => 
        term.length > 3 && record.Genre.toLowerCase().includes(term)
      )
    );
    
    if (relevantRecords.length === 0) {
      return shows;
    }
    
    const titleToViews = new Map<string, number>();
    
    relevantRecords.forEach(record => {
      const title = record.Series;
      const views = parseInt(record.Views.replace(/,/g, ''), 10);
      
      if (titleToViews.has(title)) {
        titleToViews.set(title, titleToViews.get(title)! + views);
      } else {
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
  public getAllGenres(): string[] {
    if (!this.isLoaded) {
      return [];
    }
    
    const genres = new Set<string>();
    this.records.forEach(record => {
      genres.add(record.Genre.trim());
    });
    
    return Array.from(genres);
  }
  
  // get genres sorted by total view count
  public getGenresByPopularity(): string[] {
    if (!this.isLoaded) {
      return [];
    }
    const genreViews = new Map<string, number>();
    
    this.records.forEach(record => {
      const genre = record.Genre.trim();
      const views = parseInt(record.Views.replace(/,/g, ''), 10);
      
      if (genreViews.has(genre)) {
        genreViews.set(genre, genreViews.get(genre)! + views);
      } else {
        genreViews.set(genre, views);
      }
    });
    
    // sort by total views and return just the genre names
    return Array.from(genreViews.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
  }
}

export const serverGenrePopularityService = GenrePopularityService.getInstance();