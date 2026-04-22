import { UserProfile, Keytype, Difficulty, UserSettings } from './user-classes.js';
import { Word, WordList } from './game-classes.js';
import { letterToMorse } from './translation-constants.js';


// LOAD USER DATA HERE ------------------------------------------------
// Maybe from cookies or local storage?
// For now, create a temp user
let userProfile = new UserProfile('TempUserName');
let morseMeta = userProfile.settings;
let difficulty: Difficulty = morseMeta.difficulty;

enum AdvanceState { advanceWord, advancePosition, endOfList, noAdvance, ignoreSpace }
const NA_CHAR = 'N/A';

// LOAD FIRST(?) QUOTE DATA HERE ---------------------------------------
let quote: string = "This is a sample"; // The text the user needs to type

if (!quote) {
    throw new Error("Error: Unable to retrieve quote data");
}

let wordList: WordList = new WordList(quote);

initializeDisplay();

// Start game ONCE per refresh (callback is unbound after first start)

let gameStarted = false;
// Initialize game-state
function startGame() {
    // The user has already started keying
    console.log("Game started!");
    gameStarted = true;
    // Do whatever you need to do to start the game here (Start timer, etc)
    // ------------------------------------------------
}

function endGame() {
    console.log("Game ended!");
    gameStarted = false;
    // Do whatever you need before resetting the game state
    // Or not... since we might just be sending them to another page?
    // --------------------------------
}

function updateAssistDisplay() {
    let assistDisplay = $('#morse-assist');
    let currChar = wordList.getCurrentWord().getCurrentChar().toUpperCase();
    // DO WE WANT VALIDATION TO ENSURE THE CHAR IS IN OUR CONVERSION CHART???
    // Depends on our future inplementation
    // (Maybe we'll strip/skip over invalid char in the quote)
    assistDisplay.html(letterToMorse[currChar]);
}

function initializeDisplay() {
    let currentCharDisplay = $('#current-char');
    let remainingTextDisplay = $('#remaining-text');
    if (!quote) {
        throw new Error("initializeDisplay: quote is null");
    }
    currentCharDisplay.html(quote.substring(0, 1));
    remainingTextDisplay.html(quote.substring(1));

    if (difficulty === Difficulty.easy) {
        updateAssistDisplay();
    }
}

function updateDisplay() {
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

    if (difficulty === Difficulty.easy) {
        updateAssistDisplay();
    }
}

function correctInputDisplay() {
    let currentCharDisplay = $('#current-char');
    if (currentCharDisplay.hasClass('incorrect')) {
        currentCharDisplay.removeClass('incorrect');
    }
}

function incorrectInputDisplay() {
    let currentCharDisplay = $('#current-char');
    if (!currentCharDisplay.hasClass('incorrect')) {
        currentCharDisplay.addClass('incorrect');
        setTimeout(correctInputDisplay, 300);
    }
}

let letterIncorrectFlag = false; // Ignore space when letter is already incorrect
function logCorrectInput() {
    letterIncorrectFlag = false;
    // Log correct data for analytics ---------------------------------
}
function logIncorrectInput(expected: string, actual: string) {
    letterIncorrectFlag = true;
    if (actual === NA_CHAR) {
        logUndefinedInput();
    }
    // Log incorrect data for analytics ---------------------------------
}
function logUndefinedInput() {
    // Log undefined input for analytics ---------------------------------
}

function checkAdvanceText(char: string): AdvanceState {

    const currentWord = wordList.getCurrentWord();
    if (!currentWord) throw new Error("checkAdvanceText: currentWord is null");

    if (char === ' ') {
        if (currentWord.finished) {
            // Handle correct space
            logCorrectInput();
            wordList.advanceToNextWord();
            // Penalize user after a space timeout if no reaction (acts as a second space)
            // ------FILL ME IN---------------------------
            // setTimeout() [DONT FORGET TO IMPORT USER TIMES]
            return AdvanceState.advanceWord;
        }
        if (letterIncorrectFlag) {
            return AdvanceState.ignoreSpace;
        }
    }
    else if (char === currentWord.getCurrentChar()?.toUpperCase()) {
        // Handle correct char
        console.log("Correct char!");
        logCorrectInput();
        correctInputDisplay();
        currentWord.advanceWordPosition();
        if (wordList.finished) {
            return AdvanceState.endOfList;
        }
        return AdvanceState.advancePosition;
    }

    // Catch all mistakes (wrong char, extra char after word finished, etc.)
    // Handle incorrect input
    logIncorrectInput(getExpectedChar(), char);
    incorrectInputDisplay();
    console.log("Incorrect char!");
    console.log(`Expected ${getExpectedChar()} but got ${char}`);
    return AdvanceState.noAdvance;
}

function getExpectedChar() {
    const currentWord = wordList.getCurrentWord();
    if (!currentWord) throw new Error("getExpectedChar: currentWord is null");
    return currentWord.finished ? ' ' : currentWord.getCurrentChar();
}

export function readCharInput(char: string) {
    if (!gameStarted) {
        console.log("Game not started. Ignoring char input.");
        return;
    }

    const advanceState = checkAdvanceText(char);
    updateDisplay();
    if (advanceState === AdvanceState.endOfList) {
        endGame();
        return;
    }
}

export function readUndefinedInput() {
    if (!gameStarted) {
        console.log("Game not started. Ignoring char input.");
        return;
    }
    logIncorrectInput(getExpectedChar(), NA_CHAR);
    incorrectInputDisplay();
}


export function checkStartGame() {
    if (!gameStarted) {
        startGame();
    }
}

