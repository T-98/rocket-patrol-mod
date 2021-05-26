let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [Menu, Play]
}

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;