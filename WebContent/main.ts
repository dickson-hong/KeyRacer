import { setKeyCallBack, setCharCallback } from './key-input.js';
import { checkStartGame, readCharInput } from './game.js';

function handleFirstInput() {
    checkStartGame();
    setKeyCallBack(null);
}

setKeyCallBack(handleFirstInput);
setCharCallback(readCharInput);


