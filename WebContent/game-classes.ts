// List of word objects for the game
// Should we be popping instead of indexing? (Wordlist, Word)
export class WordList {
    private _words: Word[];
    private _currentWordIndex: number = 0;

    constructor(quote: string = "") {
        this._words = parseQuoteToWords(quote);
    }

    getCurrentWord(): Word {
        return this._words[this._currentWordIndex];
    }

    advanceToNextWord(): void {
        if (!this.endOfList()) {
            this._currentWordIndex += 1;
        }
    }

    endOfList(): boolean {
        if (this._currentWordIndex > this._words.length) {
            throw new Error("endOfList: WordIndex exceeded list length");
        }
        else {
            return this._currentWordIndex == this._words.length ? true : false;
        }
    }

    get words(): Word[] {
        return this._words;
    }

    get currentWordIndex(): number {
        return this._currentWordIndex;
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
        else {
            return this._position == this._text.length ? true : false;
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
    let wordArray: string[] = quote.split(" ");
    let words: Word[] = [];
    for (let i = 0; i < wordArray.length; i++) {
        words[i] = new Word(wordArray[i].trim());
    }
    return words;
}