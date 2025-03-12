"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPBSApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pbsApiClient = axios_1.default.create({
    baseURL: process.env.PBS_API_BASE_URL,
    auth: {
        username: process.env.PBS_CLIENT_ID,
        password: process.env.PBS_CLIENT_SECRET,
    },
    headers: {
        'Content-Type': 'application/json'
    }
});
const getPBSApiClient = () => pbsApiClient;
exports.getPBSApiClient = getPBSApiClient;
