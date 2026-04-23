import { setKeyCallBack, setCharCallback, setUndefCallback } from './key-input.js';
import { checkStartGame, readCharInput, readUndefinedInput, readKeyAction } from './game.js';

function handleFirstInput() {
    checkStartGame();
    setKeyCallBack(readKeyAction);
}

setKeyCallBack(handleFirstInput);
setCharCallback(readCharInput);
setUndefCallback(readUndefinedInput);


