import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';

dotenv.config();

const analyticsDataClient = new BetaAnalyticsDataClient();

const propertyId = process.env.GA4_PROPERTY_ID;

export const getTopShowTitles = async (startDate = "9daysAgo", city?: string, limit = 10) => {
    try {
        let filters = [
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
            },
        ];

        if (city) {
            filters.push({
                filter: {
                    fieldName: 'city',
                    stringFilter: { matchType: 'EXACT', value: city }
                }
            });
        }

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
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
            limit
        });

        const topShows = response.rows?.map(row => (
            row.dimensionValues?.[0].value
        ));

        return topShows;
    } catch (error) {
        console.error('Error fetching top shows:', error);
        throw error;
    }
};