// List of word objects for the game
export class WordList {
    private _words: Word[];
    private _currentWordIndex: number = 0;

    constructor(quote: string = '') {
        this._words = parseQuoteToWords(quote);
    }

    getCurrentWord(): Word {
        return this._words[this._currentWordIndex];
    }

    advanceToNextWord(): boolean {
        if (this.endOfList()) {
            return false;
        }
        this._currentWordIndex += 1;
        return true;
    }

    // Is the cursor at the end of the list? (Doesn't check if marked finished)
    endOfList(): boolean {
        return this._currentWordIndex === this._words.length - 1;
    }

    get words(): Word[] {
        return this._words;
    }

    get currentWordIndex(): number {
        return this._currentWordIndex;
    }

    get finished(): boolean {
        return this.getCurrentWord().finished && this.endOfList();
    }
}

export class Word {
    private _text: string;
    private _position: number = 0;
    private _finished: boolean = false;

    constructor(text: string) {
        this._text = text;
    }

    getCurrentChar(): string {
        return this._text[this._position];
    }

    // Boolean represents whether a state has changed (position advanced or word marked finished)
    advanceWordPosition(): boolean {
        if (this.endOfWord()) {
            if (!this._finished) {
                this._finished = true;
                return true;
            }
            return false;
        }
        this._position += 1;
        return true;
    }

    // Is the cursor at the end of the word? (Doesn't check if word is marked finished)
    endOfWord(): boolean {
        return this._position === this._text.length - 1;
    }

    get text(): string {
        return this._text;
    }

    get position(): number {
        return this._position;
    }

    get finished(): boolean {
        return this._finished;
    }
}

// Parse quote and turn each word into Word objects
// (Should we separate punctuation from words?) --> No, only separate by spaces
export function parseQuoteToWords(quote: string): Word[] {
    let wordArray: string[] = quote.split(' ');
    let words: Word[] = [];
    for (let i = 0; i < wordArray.length; i++) {
        words[i] = new Word(wordArray[i].trim());
    }
    return words;
}