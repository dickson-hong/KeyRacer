
// Soon we'll minimize repeated quotes
async function getRandomLocalQuote() {

    let quotesJson = await fetch('./quotes.json');
    // Get random index btwn 0 and quotesJson.length
    // ---------Check if in last 30 quotes, and insert/proceed if not----------
    // ---------Otherwise repick. After 10 tries, resort to filtern method----------
    // Index and grab item with metadata

}