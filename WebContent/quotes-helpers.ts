
// Soon we'll minimize repeated quotes
export async function getRandomLocalQuote(): Promise<{ q: string, a: string, c: number, h: string }> {

    let quotesResponse = await fetch('/quotes.json');
    let quotesJson = await quotesResponse.json();
    // Get random index btwn 0 and quotesJson.length
    let quoteIndex = Math.floor(Math.random() * quotesJson.length);
    console.log(`We have chosen quote #${quoteIndex}: ${quotesJson[quoteIndex]}`);
    // ---------Check if in last 30 quotes, and insert/proceed if not----------
    // ---------Otherwise repick. After 10 tries, resort to filtern method----------
    // Index and grab item with metadata

    return quotesJson[quoteIndex];

}
