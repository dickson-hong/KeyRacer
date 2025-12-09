export enum Keytype {
    iambic = 'Iambic',
    straight = 'Straight'
}

export class MorseMeta {
    private _wpm: number = 20;
    private _keytype: Keytype = Keytype.straight;
    private _controls = { straight: ' ', iambicShort: 'z', iambicLong: 'x', example: 'r' };
    private _times = wpmToMorseTimes(this._wpm);

    get wpm() {
        return this._wpm;
    }

    get keytype() {
        return this._keytype;
    }

    get controls() {
        return this._controls;
    }

    get times() {
        return this._times;
    }

    set wpm(newWpm: number) {
        this._wpm = newWpm;
        this._times = wpmToMorseTimes(this._wpm);
    }

    set keytype(newKeytype: Keytype) {
        this._keytype = newKeytype;
    }
}

export class MorseState {
    startTime: number | null = null;
    endTime: number | null = null;
    letterTimer: number | null = null;
    wordTimer: number | null = null;

    currLetterMorse: string = '';
}

export class MorseAudio {
    private context: AudioContext = new AudioContext();
    private osc: OscillatorNode | null = null;

    private makeOsc() {
        var osc: OscillatorNode = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 600;
        osc.connect(this.context.destination);
        return osc;
    }
    startOsc() {
        this.osc = this.makeOsc();
        this.osc.start();
    }
    stopOsc() {
        if (this.osc) {
            this.osc.stop();
            this.osc.disconnect();
            this.osc = null;
        }
    }
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