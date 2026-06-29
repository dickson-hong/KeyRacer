import * as fs from 'fs';
import { getData } from './api-helpers.js';

function handleResponse(jsonResponse: any[], filename: string): number {
    console.log(jsonResponse);

    const fileContents = fs.readFileSync(filename, 'utf-8');

    let existingData = JSON.parse(fileContents ? fileContents : '[]');

    let quotesSet: Set<string> = new Set();
    for (let i = 0; i < existingData.length; i++) {
        quotesSet.add(JSON.stringify(existingData[i]));
    }

    let numDuplicates = 0;
    let dupeExample;
    for (let i = 0; i < jsonResponse.length; i++) {
        let jsonString = JSON.stringify(jsonResponse[i]);
        if (quotesSet.has(jsonString)) {
            numDuplicates++;
            if (!dupeExample) {
                dupeExample = jsonResponse[i];
            }
        }
        quotesSet.add(jsonString);
    }

    let uniqueQuotesArray = Array.from(quotesSet, (item) => JSON.parse(item));

    fs.writeFile(filename, JSON.stringify(uniqueQuotesArray, null, 2),
        (err) => {
            if (err) {
                console.error("Error writing to file:", err);
            }
        });

    console.log(
        `Num duplicates: ${numDuplicates}\n` +
        `Num items: ${jsonResponse.length}\n` +
        `Dupe rate: ${(numDuplicates / jsonResponse.length) * 100}%\n` +
        `Example duplicate: ${dupeExample ? JSON.stringify(dupeExample) : "None"}`
    );
    return numDuplicates / jsonResponse.length;
}

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function collectQuotes(url: string, filename: string): Promise<number> {
    try {
        const jsonResponse = await getData(url);
        let dupeRate = handleResponse(jsonResponse, filename);
        return dupeRate;
    } catch (error) {
        console.error("Error occurred while collecting quotes:", error);
    }
    return -1;
}


const url = "https://zenquotes.io/api/quotes";
const saveDirectory = "./quotes.json";

let dupeRate;
do {
    dupeRate = await collectQuotes(url, saveDirectory);
    if (dupeRate < 0.6) {
        await sleep(3600000);
    }
} while (dupeRate < 0.6);
