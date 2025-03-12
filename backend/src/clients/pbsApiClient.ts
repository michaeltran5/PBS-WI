import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const pbsApiClient = axios.create({
    baseURL: process.env.PBS_API_BASE_URL,
    auth: {
          username: process.env.PBS_CLIENT_ID,
          password: process.env.PBS_CLIENT_SECRET,
    },
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getPBSApiClient = () => pbsApiClient;