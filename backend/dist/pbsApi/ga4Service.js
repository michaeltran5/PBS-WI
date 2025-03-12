"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop10Shows = exports.getMetadata = void 0;
const data_1 = require("@google-analytics/data");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const analyticsDataClient = new data_1.BetaAnalyticsDataClient();
const propertyId = process.env.GA4_PROPERTY_ID;
const getMetadata = () => __awaiter(void 0, void 0, void 0, function* () {
    const [metadata] = yield analyticsDataClient.getMetadata({
        name: `properties/${propertyId}/metadata`
    });
    console.log('Available Dimensions:', metadata.dimensions);
    console.log('Available Metrics:', metadata.metrics);
});
exports.getMetadata = getMetadata;
const getTop10Shows = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [response] = yield analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '9daysAgo', endDate: 'today' }],
            dimensions: [
                { name: 'customEvent:video_program' },
            ],
            metrics: [{ name: 'eventCount' }],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                fieldName: 'eventName',
                                stringFilter: { matchType: 'EXACT', value: 'video_start' }
                            }
                        },
                        {
                            filter: {
                                fieldName: 'customEvent:video_provider',
                                stringFilter: { matchType: 'FULL_REGEXP', value: 'PBS Partner Player' }
                            }
                        }
                    ]
                }
            },
            orderBys: [
                { metric: { metricName: 'eventCount' }, desc: true }
            ],
            limit: 10
        });
        const topShows = (_a = response.rows) === null || _a === void 0 ? void 0 : _a.map(row => {
            var _a;
            return ((_a = row.dimensionValues) === null || _a === void 0 ? void 0 : _a[0].value);
        });
        console.log(topShows);
        return topShows;
    }
    catch (error) {
        console.error('❌ Error fetching top shows:', error);
        throw error;
    }
});
exports.getTop10Shows = getTop10Shows;
