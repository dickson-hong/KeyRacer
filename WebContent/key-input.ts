const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.'
};
const Keytype = { iambic: 'Iambic', straight: 'Straight' };

const wpm: number = 15;
let keytype: string = Keytype.straight;
let controls = { 'straight': ' ', 'iambicShort': 'z', 'iambicLong': 'x' };
let times = wpmToMorseTimes(wpm);

let context: AudioContext = new AudioContext();
var osc: OscillatorNode;

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);


function getOsc() {
    var osc: OscillatorNode = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 600;
    osc.connect(context.destination);
    return osc;
}

function handleKeydown(e: KeyboardEvent) {
    console.log(e.key);
    if (keytype == Keytype.straight && e.key == controls.straight && !e.repeat) {
        straightDown();
    }
    else {
        iambicDown();
    }
}

function handleKeyup(e: KeyboardEvent) {
    console.log(wpmToMorseTimes(wpm).dot);
    if (keytype == Keytype.straight && e.key == controls.straight) {
        straightUp();
    }
    else {
        iambicUp();
    }
}

function iambicDown() { }
function iambicUp() { }

function straightDown() {
    osc = getOsc();
    osc.start();
}
function straightUp() {
    osc.stop();
}

function wpmToMorseTimes(wpm: number) {
    if (wpm < 1) wpm = 1
    if (wpm > 200) wpm = 200
    const dotTime = Math.ceil(1200 / wpm)
    return {
        dot: dotTime,
        dash: dotTime * 3,
        elementGap: dotTime,
        letterGap: dotTime * 3,
        wordGap: dotTime * 7
    }
}