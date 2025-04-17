import { parse } from "csv-parse";
import fs from "fs";
import { promisify } from "util";
import { PBSGenreName } from "../constants/pbsTypes";

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