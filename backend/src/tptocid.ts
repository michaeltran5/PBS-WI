import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { getAssetByTPMediaId } from './services/pbsService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const inputPath = 'WPNE_1_Cleaned_Updated.csv';
const outputPath = 'aws_personalize_data.csv';

type CsvRow = Record<string, string>;

const headers = [
  'USER_ID',
  'ITEM_ID',
  'TIMESTAMP',
  'EVENT_TYPE',
  'GENRE',
  'DEVICE',
  'TIME_WATCHED'
];

const getTimestamp = (date?: string): number => {
  if (!date) return Math.floor(Date.now() / 1000);
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.unix() : Math.floor(Date.now() / 1000);
};

const main = async () => {
  const inputStream = fs.createReadStream(inputPath);
  const parser = parse({ columns: true, trim: true });
  const outputStream = fs.createWriteStream(outputPath);
  const stringifier = stringify({ header: true, columns: headers });

  stringifier.pipe(outputStream);

  const cache = new Map<string, string>();
  let rowCount = 0;
  let apiCalls = 0;

  for await (const row of inputStream.pipe(parser) as AsyncIterable<CsvRow>) {
    rowCount++;

    const tpMediaId = row['TP Media ID'];
    if (!tpMediaId) {
      console.log(`Skipping row ${rowCount}: No TP Media ID`);
      continue;
    }

    let cid = row['CID'] || cache.get(tpMediaId);
    if (!cid) {
      console.log(`Row ${rowCount}: Calling API for ${tpMediaId}...`);
      const result = await getAssetByTPMediaId(tpMediaId);
      cid = result?.data?.id || null;

      if (cid) {
        cache.set(tpMediaId, cid);
        console.log(`Row ${rowCount}: Got CID ${cid}`);
      } else {
        console.log(`Row ${rowCount}: No CID found`);
        continue;
      }

      apiCalls++;
      if (apiCalls % 10 === 0) {
        console.log(`Throttling...`);
        await new Promise((res) => setTimeout(res, 1000));
      }
    }

    const userId =
      row['UID'] ||
      row['Email'] ||
      `${row['First Name'] || ''}-${row['Last Name'] || ''}`.replace(/\s+/g, '').toLowerCase();

    const event_type = 'WATCH';
    const timestamp = getTimestamp(row['Date Watched']);
    const genre = row['Genre'] || 'Unknown';
    const device = row['Device'] || 'Unknown';
    const timeWatched = parseFloat(row['Time Watched'] || '0');

    stringifier.write([
      userId,
      cid,
      timestamp,
      event_type,
      genre,
      device,
      timeWatched
    ]);

    if (rowCount % 100 === 0) console.log(`Processed ${rowCount} rows...`);
  }

  stringifier.end();
  console.log(`✅ Done! Streamed to ${outputPath}`);
};

main();