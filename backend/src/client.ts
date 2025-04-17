import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const username = process.env.PBS_CLIENT_ID || '';
const password = process.env.PBS_CLIENT_SECRET || '';
const encodedAuth = Buffer.from(`${username}:${password}`).toString('base64');

export const pbsApiClient = axios.create({
    baseURL: process.env.PBS_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuth}`,
      },
});