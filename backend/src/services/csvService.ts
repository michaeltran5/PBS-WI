import { parse } from "csv-parse";
import fs from "fs";
import { promisify } from "util";
import { PBSGenreName } from "../constants/pbsTypes";
import { getAssetByTPMediaId } from "./pbsService";

type CSVRecord = {
    Genre: PBSGenreName;
    Views: string;
    Series: string;
};

export const getShowTitlesByGenre = async (genreName: PBSGenreName): Promise<string[]> => {
    const fileContent = await promisify(fs.readFile)(process.env.GENRE_TOP_100_FILE_PATH, "utf8");

    return new Promise<string[]>((resolve, reject) => {
        parse(
            fileContent,
            {
                columns: true,
                trim: true,
                skip_empty_lines: true
            },
            (err, records: CSVRecord[]) => {
                if (err) {
                    reject(err);
                } else {
                    const showTitles = records
                        .filter(record => record.Genre === genreName)
                        .map(record => record.Series);

                    resolve(showTitles);
                }
            }
        );
    });
};

type ViewingHistoryRecord = {
    UID: string;
    Title: string;
    "TP Media ID": string;
    "Date Watched": string;
};

export const getMostRecentlyWatchedShow = async (userUid: string): Promise<{ title: string; itemId: string } | null> => {
    const fileContent = await promisify(fs.readFile)(process.env.VIEWING_HISTORY_CSV_PATH, "utf8");

    return new Promise((resolve, reject) => {
        parse(
            fileContent,
            {
                columns: true,
                trim: true,
                skip_empty_lines: true
            },
            (err, records: ViewingHistoryRecord[]) => {
                if (err) {
                    reject(err);
                } else {
                    const userRecords = records
                        .filter(record => record.UID === userUid && record["Date Watched"])
                        .sort((a, b) => new Date(b["Date Watched"]).getTime() - new Date(a["Date Watched"]).getTime());

                    if (userRecords.length === 0) {
                        resolve(null);
                        return;
                    }

                    const mostRecent = userRecords[0];

                    getAssetByTPMediaId(mostRecent["TP Media ID"])
                        .then(result => {
                            resolve({
                                title: mostRecent.Title,
                                itemId: result?.data?.id
                            });
                        })
                        .catch(error => {
                            reject(error);
                        });
                }
            }
        );
    });
};
