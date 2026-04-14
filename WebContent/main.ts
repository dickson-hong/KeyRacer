import { setKeyCallBack, setCharCallback, setUndefCallback } from './key-input.js';
import { checkStartGame, readCharInput, handleUndefinedInput } from './game.js';

function handleFirstInput() {
    checkStartGame();
    setKeyCallBack(null);
}

setKeyCallBack(handleFirstInput);
setCharCallback(readCharInput);
setUndefCallback(handleUndefinedInput);


