let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [Menu, Play]
}

// reserve keyboard vars
let keyF, keyR, keyC, keyLEFT, keyRIGHT, keyUP, keyDOWN;

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let multiPlayer = false;
let currentPlayer = "Player 1";
let flag = true;