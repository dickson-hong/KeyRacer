import { MorseState, MorseAudio } from './morse-classes.js';
import { UserProfile, Keytype } from './user-classes.js';
import { morseToLetter } from './translation-constants.js';

type MorseCode = keyof typeof morseToLetter;
type MorseElement = '.' | '-';

// LOAD USER DATA HERE ------------------------------------------------
let userProfile = new UserProfile('TempUserName');
// FOR SETTINGS (morseMeta)
let morseMeta = userProfile.settings;
let morseState = new MorseState();
let morseAudio = new MorseAudio();

let maxMorseElements = 7; // Max length of Morse code for a single char
let enforceMaxMorseElements = true; // If true, user cannot input more than maxMorseElements without a letter timeout


//document.addEventListener('keydown', interruptTimer);
document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);
document.addEventListener('keypress', handleKeypress);


function handleKeypress(e: KeyboardEvent) {
    if (e.key === morseMeta.controls.example) {
        // Play 'AB C', aka '.- -...  -.-.' as example
    }

}

function handleKeydown(e: KeyboardEvent) {
    checkElementLimit(morseState);

    // Stop timers if they are running
    resetTimers(morseState);

    if (morseMeta.keytype == Keytype.straight &&
        e.key == morseMeta.controls.straight && !e.repeat) {
        if (keyCallback) {
            keyCallback();
        }
        straightDown();
    }
    else if (morseMeta.keytype == Keytype.iambic &&
        (e.key == morseMeta.controls.iambicShort || e.key == morseMeta.controls.iambicLong) && !e.repeat) {
        if (keyCallback) {
            keyCallback();
        }
        iambicDown();
    }

}
function handleKeyup(e: KeyboardEvent) {
    if (morseMeta.keytype == Keytype.straight && e.key == morseMeta.controls.straight) {
        straightUp();
    }
    else if (morseMeta.keytype == Keytype.iambic &&
        (e.key == morseMeta.controls.iambicShort || e.key == morseMeta.controls.iambicLong)) {
        iambicUp();
    }
}

function iambicDown() { }
function iambicUp() { }

function straightDown() {
    morseState.startTime = Date.now();
    morseAudio.startOsc();
}
function straightUp() {
    if (!morseState.startTime) {
        return;
    }
    morseState.endTime = Date.now();
    let pressDuration = Math.min(morseState.endTime - morseState.startTime);
    if (pressDuration < morseMeta.times.dash) {
        // Handle dot
        handleMorseElement('.');

    } else {
        // Handle dash
        handleMorseElement('-');
    }
    morseAudio.stopOsc();
    // Reset startTime: Down-up pair complete
    morseState.startTime = null;

    // Write current letter after timeout (and space later, if needed)
    morseState.letterTimer = setTimeout(letterTimeout, morseMeta.times.letterGap);
    morseState.wordTimer = setTimeout(spaceTimeout, morseMeta.times.wordGap);
}

function handleMorseElement(element: MorseElement) {
    if (morseState.listeningDisabled) {
        return;
    }

    morseState.currLetterMorse += element;

    updateDisplays();
}

// Notifies game.ts of any relevant activity (keypress for current control scheme)
let keyCallback: (() => void) | undefined | null;
export function setKeyCallBack(callback: (() => void) | undefined | null) {
    keyCallback = callback;
}

// Set game's handler function in main.ts
// Notifies game.ts of character input
let charCallback: ((char: string) => void) | undefined | null;
export function setCharCallback(callback: ((char: string) => void) | undefined | null) {
    charCallback = callback;
}

let undefCallback: (() => void) | undefined | null;
export function setUndefCallback(callback: (() => void) | undefined | null) {
    undefCallback = callback;
}

function letterTimeout() {
    let letter: string | undefined = morseToLetter[morseState.currLetterMorse as MorseCode];
    if (letter) {
        // HANDLE LETTER INPUT ---------------------------------------------------------
        if (charCallback) {
            charCallback(letter);
        }
    }
    else {
        if (undefCallback) {
            undefCallback();
        }
    }
    morseState.currLetterMorse = '';
    elementLimitDisplay(false);
}

function spaceTimeout() {
    // HANDLE SPACE INPUT ---------------------------------------------------------
    if (charCallback) {
        charCallback(' ');
    }
}

function resetTimers(morseState: MorseState) {
    if (morseState.letterTimer) {
        clearTimeout(morseState.letterTimer);
        morseState.letterTimer = null;
    }
    if (morseState.wordTimer) {
        clearTimeout(morseState.wordTimer);
        morseState.wordTimer = null;
    }
}

function updateDisplays() {
    let morseDisplay = $('#typed-morse')
    let charDisplay = $('#typed-char');

    morseDisplay.text(morseState.currLetterMorse);
    charDisplay.text(morseToLetter[morseState.currLetterMorse as MorseCode] || '');
}

function checkElementLimit(morseState: MorseState) {
    if (enforceMaxMorseElements && morseState.currLetterMorse.length >= maxMorseElements) {
        morseState.listeningDisabled = true;
        morseAudio.disabled = true;
        elementLimitDisplay(true);
    }
    else {
        morseState.listeningDisabled = false;
        morseAudio.disabled = false;
    }
}

function elementLimitDisplay(maxedOut: boolean) {
    let typerDisplay = $('#typer-display');
    if (maxedOut) {
        if (!typerDisplay.hasClass('display-box-error')) {
            typerDisplay.addClass('display-box-error');
        }
    }
    else {
        if (typerDisplay.hasClass('display-box-error')) {
            typerDisplay.removeClass('display-box-error');
        }
    }
}
