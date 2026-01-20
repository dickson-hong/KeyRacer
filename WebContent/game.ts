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


}