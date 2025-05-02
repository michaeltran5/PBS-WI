# PBS Wisconsin Recommendation Engine

A personalized video streaming platform for PBS Wisconsin that provides recommendations based on user viewing history using AWS Personalize.

![PBS Wisconsin](./frontend/public/transparent_logo.png)

## Overview

This application delivers personalized content recommendations to PBS Wisconsin viewers through a Netflix-style interface. The platform integrates with the PBS API for content delivery and AWS Personalize for recommendation generation, analyzing user viewing behavior to suggest relevant content.

## Features

- **User Authentication**: Email-based login system that tracks viewing preferences
- **Content Discovery**: Browse shows by genre with featured content carousels
- **Personalized Recommendations**: Three recommendation types:
  - "Top Picks" based on user viewing history
  - "Because You Watched" for similar content recommendations
  - "More Like This" for content with similar attributes
- **Video Playback**: Integrated PBS video player with episode details
- **Responsive Design**: Optimized for various screen sizes

## Tech Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit & RTK Query for state management
- Styled Components for component styling
- React Bootstrap for UI components
- React Router for navigation

### Backend
- Node.js with Express
- AWS SDK for Personalize integration
- PBS API integration for content access
- CSV parsing for historical data analysis

### Data Processing
- AWS Personalize for recommendation engine
- Google Analytics 4 integration for viewing metrics

## How It Works

### User Authentication Flow
1. Users log in with their email address
2. The system matches their email to a UID in the user CSV data
3. User information is stored in browser session storage
4. Authenticated users receive personalized content recommendations

### Content Recommendation System
The application leverages AWS Personalize to generate three types of recommendations:

1. **Top Picks**: Personalized recommendations based on the user's viewing history
2. **Because You Watched**: Content similar to a specific show the user has watched
3. **More Like This**: Items with similar attributes to the current content

### Data Flow

1. **User Data Collection**:
   - Historical viewing data is loaded from the WPNE CSV file
   - Real-time viewing events are tracked for future recommendations

2. **API Integration**:
   - PBS API provides access to content metadata and video assets
   - Custom backend routes proxy requests to the PBS API

3. **Recommendation Generation**:
   - AWS Personalize processes user interaction data
   - Backend services map recommendation IDs to content objects

4. **Content Rendering**:
   - Frontend components display recommended content in carousels
   - Video player integrates with PBS's video delivery system

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- AWS account with Personalize set up
- PBS API credentials

### Environment Setup

#### Backend
1. Create a `.env` file in the `backend` directory with:
PBS_API_BASE_URL=https://media.services.pbs.org/api/v1
PBS_CLIENT_ID=your_pbs_client_id
PBS_CLIENT_SECRET=your_pbs_client_secret
AWS_REGION=us-east-1
PERSONALIZE_MORE_LIKE_RECOMMENDER_ARN=arn:aws:personalize:region:account-id/more-like-recommender-id
PERSONALIZE_BECAUSE_YOU_WATCHED_RECOMMENDER_ARN=arn:aws:personalize:region:account-id/because-you-watched-recommender-id
PERSONALIZE_TOP_PICKS_RECOMMENDER_ARN=arn:aws:personalize:region:account-id/top-picks-recommender-id
VIEWING_HISTORY_CSV_PATH=../WPNE_1_Cleaned_Updated.csv

#### Frontend
1. Create a `.env` file in the `frontend` directory with:
VITE_API_BASE_URL=http://localhost:3000/api

### Installation & Running

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/pbs-wisconsin-video-portal.git
cd pbs-wisconsin-video-portal
```
Install backend dependencies:

bash
```
cd backend
npm install
```

Install frontend dependencies:

bash
```
cd ../frontend
npm install
```
Start the backend server:

bash
```cd ../backend
npm run dev
```

Start the frontend development server:

bash
```cd ../frontend
npm run dev
```

The application should be running at http://localhost:5173

Acknowledgments

PBS Wisconsin for the content and API access
AWS for the Personalize recommendation engine
