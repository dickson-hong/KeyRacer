import { MorseMeta, MorseState, MorseAudio, Keytype } from './morse-classes.js';

const letterToMorse = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.'
};
const morseToLetter = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z', '-----': '0', '.----': '1', '..---': '2', '...--': '3',
    '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8',
    '----.': '9', ".-.-.-": ".", "--..--": ",", "..--..": "?",
};
type MorseCode = keyof typeof morseToLetter;


var morseMeta = new MorseMeta();
var morseState = new MorseState();
var morseAudio = new MorseAudio();

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
    // Stop timers if they are running
    resetTimers(morseState);

    if (morseMeta.keytype == Keytype.straight &&
        e.key == morseMeta.controls.straight && !e.repeat) {
        straightDown();
    }
    else if (morseMeta.keytype == Keytype.iambic &&
        (e.key == morseMeta.controls.iambicShort || e.key == morseMeta.controls.iambicLong) && !e.repeat) {
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
    let display = $('#ditsAndDahs');
    if (pressDuration < morseMeta.times.dash) {
        // Handle dot
        display.text('.');
        morseState.currLetterMorse += '.';
    } else {
        // Handle dash
        display.text('-');
        morseState.currLetterMorse += '-';
    }
    morseAudio.stopOsc();
    // Reset startTime: Down-up pair complete
    morseState.startTime = null;

    // Write current letter
    morseState.letterTimer = setTimeout(letterTimeout, morseMeta.times.letterGap);
    // Write a space
    morseState.wordTimer = setTimeout(spaceTimeout, morseMeta.times.wordGap);
}

function letterTimeout() {
    let display = $('#letters');
    // CONVERT MORSE TO LETTER HERE.
    let letter: string | undefined = morseToLetter[morseState.currLetterMorse as MorseCode];
    if (letter) {
        display.append(letter);
    }
    morseState.currLetterMorse = '';
}

function spaceTimeout() {
    let display = $('#letters');
    display.append(' ');
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


