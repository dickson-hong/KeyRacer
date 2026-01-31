// List of word objects for the game
export class WordList {
    private words: Word[];

    constructor(quote: string = "") {
        this.words = parseQuoteToWords(quote);
    }
}

export class Word {
    private _text: string;
    private _position: number;

    constructor(text: string, position: number = 0) {
        this._text = text;
        this._position = position;
    }

    getCurrentChar(): string {
        return this._text[this._position];
    }
    advancePosition(): void {
        if (!this.endOfWord()) {
            this._position += 1;
        }
    }
    endOfWord(): boolean {
        if (this._position > this._text.length) {
            throw new Error("endOfWord: Word position exceeded word length");
        }
        else if (this._position == this._text.length) {
            return true;
        }
        else {
            return false;
        }
    }

    get text(): string {
        return this._text;
    }

    get position(): number {
        return this._position;
    }
}

// Parse quote and turn each word into Word objects
// (Should we separate punctuation from words?) --> No, only separate by spaces
export function parseQuoteToWords(quote: string): Word[] {
    return []; // FIX ME!!!!!!!!!!!!!!!!!!!!!!!
}