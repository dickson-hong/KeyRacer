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