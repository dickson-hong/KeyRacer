import { UserProfile, Keytype } from './user-classes.js';
import { Word, WordList } from './game-classes.js';
import { letterToMorse } from './translation-constants.js';


// LOAD USER DATA HERE ------------------------------------------------
// Maybe from cookies or local storage?
// For now, create a temp user
let userProfile = new UserProfile('TempUserName');
let morseMeta = userProfile.settings;

enum AdvanceState { advanceWord, advancePosition, endOfList, noAdvance, ignoreSpace }

// LOAD FIRST(?) QUOTE DATA HERE
let quote: string | null = null;
// Display quote on page here ------------------------------------------------
quote = "This is a sample"; // The text the user needs to type

initializeDisplay();

// Null when game is not active
let wordList: WordList | null = null;

// Start game ONCE per refresh (callback is unbound after first start)

// Initialize game-state
function startGame() {
    // The user has already started keying
    console.log("Game started!");

    if (!quote) {
        throw new Error("startGame: quote is null");
    }
    wordList = new WordList(quote);
    // Do whatever you need to do to start the game here (Start timer, etc)
    // ------------------------------------------------
}

function endGame() {
    console.log("Game ended!");
    gameStarted = false;
    // Do whatever you need before resetting the game state
    // Or not... since we might just be sending them to another page?
    // --------------------------------
    quote = null;
    wordList = null;
}

function initializeDisplay() {
    let currentCharDisplay = $('#current-char');
    let remainingTextDisplay = $('#remaining-text');
    if (!quote) {
        throw new Error("initializeDisplay: quote is null");
    }
    currentCharDisplay.html(quote.substring(0, 1));
    remainingTextDisplay.html(quote.substring(1));


}
// Maybe we take input to determine whether to show correct or incorrect display?
// Or have it as a separate function that we call in **checkAdvanceText()**?
function updateDisplay() {
    if (!wordList) {
        throw new Error("updateDisplay: wordList is null");
    }
    let correctTextDisplay = $('#correct-text');
    let currentCharDisplay = $('#current-char');
    let remainingTextDisplay = $('#remaining-text');
    let finishedWords = "";
    for (let i = 0; i < wordList.currentWordIndex; i++) {
        finishedWords += wordList.words[i].text + ' ';
    }
    const currentWord = wordList.getCurrentWord();
    let finishedCurrWordText = "";
    let currChar = '&nbsp;';
    let remainingText = "";
    if (!currentWord.finished) {
        finishedCurrWordText = currentWord.text.substring(0, currentWord.position);
        currChar = currentWord.getCurrentChar();
        remainingText += currentWord.text.substring(currentWord.position + 1);
    }
    else {
        finishedCurrWordText = currentWord.text;
    }
    correctTextDisplay.html(finishedWords + finishedCurrWordText);
    currentCharDisplay.html(currChar);

    for (let i = wordList.currentWordIndex + 1; i < wordList.words.length; i++) {
        if (currChar != '&nbsp;') {
            remainingText += '&nbsp;';
        }
        else {
            remainingText += ' ';
        }
        remainingText += wordList.words[i].text;
    }
    remainingTextDisplay.html(remainingText);
}

function correctInputDisplay() {
    let currentCharDisplay = $('#current-char');
    if (currentCharDisplay.hasClass('incorrect')) {
        currentCharDisplay.removeClass('incorrect');
    }
}

// Call this when input is incorrect. Question: Where do we want to revert to grey?
function incorrectInputDisplay() {
    let currentCharDisplay = $('#current-char');
    if (!currentCharDisplay.hasClass('incorrect')) {
        currentCharDisplay.addClass('incorrect');
        setTimeout(correctInputDisplay, 300);
    }
}

function handleCorrectInput() {
    letterIncorrectFlag = false;
    // Log correct data for analytics ---------------------------------
}
let letterIncorrectFlag = false; // Ignore when letter is already incorrect
function handleIncorrectInput() {
    letterIncorrectFlag = true;
    // Log incorrect data for analytics ---------------------------------
}

function checkAdvanceText(wordList: WordList, char: string): AdvanceState {

    const currentWord = wordList.getCurrentWord();
    if (!currentWord) throw new Error("checkAdvanceText: currentWord is null");

    if (char === ' ') {
        if (currentWord.finished) {
            // Handle correct space
            handleCorrectInput();
            wordList.advanceToNextWord();
            return AdvanceState.advanceWord;
        }
        if (letterIncorrectFlag) {
            return AdvanceState.ignoreSpace;
        }
    }
    else if (char === currentWord.getCurrentChar()?.toUpperCase()) {
        // Handle correct char
        console.log("Correct char!");
        handleCorrectInput();
        correctInputDisplay();
        currentWord.advanceWordPosition();
        if (wordList.finished) {
            return AdvanceState.endOfList;
        }
        return AdvanceState.advancePosition;
    }

    // Catch all mistakes (wrong char, extra char after word finished, etc.)
    // Handle incorrect input
    handleIncorrectInput();
    incorrectInputDisplay();
    console.log("Incorrect char!");
    console.log(`Expected ${currentWord.finished ? ' ' : currentWord.getCurrentChar()} but got ${char}`);
    return AdvanceState.noAdvance;
}

export function readCharInput(char: string) {

    if (!gameStarted) {
        console.log("Game not started. Ignoring char input.");
        return;
    }

    if (!wordList) throw new Error("readCharInput: wordList not initialized");

    const advanceState = checkAdvanceText(wordList, char);

    updateDisplay();

    if (advanceState === AdvanceState.endOfList) {
        endGame();
        return;
    }

}

let gameStarted = false;
export function checkStartGame() {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
    }
}

