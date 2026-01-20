export class UserProfile {
    private _username: string;
    private _settings: UserSettings;

    // Only username is required
    constructor(username: string, wpmSetting: number = 20, keytypeSetting: Keytype = Keytype.straight, controls: Controls = new Controls()) {
        this._username = username;
        this._settings = new UserSettings();
        this._settings.wpm = wpmSetting;
        this._settings.keytype = keytypeSetting;
        this._settings.controls = controls;
    }

    get username() {
        return this._username;
    }

    get settings() {
        return this._settings;
    }
}

export enum Keytype {
    iambic = 'Iambic',
    straight = 'Straight'
}

export class UserSettings {
    private _wpm: number = 20;
    private _keytype: Keytype = Keytype.straight;
    private _controls: Controls = new Controls();
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

    set controls(newControls: Controls) {
        this._controls = newControls;
    }
}

class Controls {
    straight: string = ' ';
    iambicShort: string = 'z';
    iambicLong: string = 'x';
    example: string = 'r';
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