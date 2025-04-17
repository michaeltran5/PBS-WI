declare namespace NodeJS {
    interface ProcessEnv {
        PBS_API_BASE_URL: string,
        PBS_CLIENT_ID: string,
        PBS_CLIENT_SECRET: string
        GOOGLE_APPLICATION_CREDENTIALS: string
        GA4_PROPERTY_ID: string
        GENRE_TOP_100_FILE_PATH: string
    }
  }