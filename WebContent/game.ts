import { UserProfile, Keytype } from './user-classes.js';

// LOAD USER DATA HERE ------------------------------------------------
// Maybe from cookies or local storage?
// For now, create a temp user
let userProfile = new UserProfile('TempUserName');
let morseMeta = userProfile.settings;

// Start game ONCE per refresh (See below)

function startGame() {
    // The user has already started keying
    console.log("Game started!");

    let currentText = ""; // User's current text input --> Will be edited by ...
    let textToType = "This is a sample sentence."; // The text the user needs to type

}

export function readCharInput(char: string) {
    if (char.length != 1) {
        throw new Error("readCharInput expects a single character");
    }
    console.log("Character input received: " + char);
}

let gameStarted = false;
export function checkStartGame() {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
    }
}

