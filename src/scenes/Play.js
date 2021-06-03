// global display score box
let scoreConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'left',
    padding: {
        top: 5,
        bottom: 5,
    },
    fixedWidth: 240
}

class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('dropship', './assets/orangeman.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
    }
    create() {
            this.explosionarr = ['sfx_explosion1', 'sfx_explosion2', 'sfx_explosion3', 'sfx_explosion4'];
            let scene = this;
            // place tile sprite
            this.starfield = this.add.tileSprite(0, 0, 1280, 720, 'starfield').setOrigin(0, 0);
            // green UI background
            this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
            // white borders
            this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
            this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
            this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
            this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);

            // add rocket (p1)
            this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

            // add spaceships (x3)
            this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
            this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
            this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
            this.time.delayedCall(game.settings.gameTimer / 2, () => {
                scene.dropship = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'dropship', 0, 50).setOrigin(0, 0);
                scene.dropship.setScale(0.7);
                this.sound.play('sfx_dropship_enter');
            });

            // define keys
            keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
            keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
            keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

            // animation config
            this.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
                frameRate: 10
            });

            // initialize score
            this.p1Score = 0;
            if (multiPlayer === true) this.p2Score = 0;

            this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, currentPlayer + ': ' + (currentPlayer === "Player 1" ? this.p1Score : this.p2Score), scoreConfig);
            this.gameTime = this.add.text(game.config.width / 2, borderUISize + borderPadding * 2, "0", { fontFamily: 'Courier', fontSize: '28px', backgroundColor: '#F3B141', color: '#843605' });
            // GAME OVER flag
            this.gameOver = false;
            this.gameOverTime = game.settings.gameTimer;
            this.startTime = scene.time.now;
            //play clock
            scoreConfig.fixedWidth = 0;
            this.gameTime.setAlpha(1);
            this.clock = this.time.delayedCall(game.settings.gameTimer / 2, () => {
                game.settings.spaceshipSpeed += 0.5;
                game.settings.rocketSpeed += 1;
            }, null, this);
        }
        //swap players, keep scores
    update() {
        this.gameTime.text = Math.floor((this.gameOverTime - (this.time.now - this.startTime)) / 1000);
        if (this.time.now - this.startTime > this.gameOverTime) {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER ' + currentPlayer, scoreConfig).setOrigin(0.5);
            if (multiPlayer === false) this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            else this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (C) to continue, (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.gameTime.setAlpha(0);
            this.gameOverTime = game.settings.gameTimer;
        }
        // check key input for restart
        if (this.gameOver && multiPlayer === true && Phaser.Input.Keyboard.JustDown(keyC)) {
            if (currentPlayer === "Player 1") currentPlayer = "Player 2";
            else currentPlayer = "Player 1";
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {
            this.p1Rocket.update();
            if (this.dropship != undefined) this.dropship.update(); // update spaceships (x3)
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        // check collision
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            let i = this.getRandomIntInclusive(0, 3);
            this.sound.play(this.explosionarr[i]);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            let i = this.getRandomIntInclusive(0, 3);
            this.sound.play(this.explosionarr[i]);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            let i = this.getRandomIntInclusive(0, 3);
            this.sound.play(this.explosionarr[i]);
        }
        if (this.dropship != undefined) {
            if (this.checkCollision(this.p1Rocket, this.dropship)) {
                this.p1Rocket.reset();
                this.shipExplode(this.dropship);
                this.sound.play('sfx_dropship_explosion');
            }
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let X = ship.x;
        let Y = ship.y;
        let boom = this.add.sprite(X, Y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => { // callback after anim completes
            ship.reset(); // reset ship position
            ship.alpha = 1; // make ship visible again
            boom.destroy(); // remove explosion sprite
            this.displayMessage("+1 sec", X, Y);
        });
        //add timer: 1 sec for every hit
        this.gameOverTime += 1000;
        // score add and repaint
        if (currentPlayer === "Player 1") {
            this.p1Score += ship.points;
            this.scoreLeft.text = currentPlayer + ': ' + this.p1Score;
        } else {
            this.p2Score += ship.points;
            this.scoreLeft.text = currentPlayer + ': ' + this.p2Score;
        }

    }

    displayMessage(msg, x, y) {
        let txt = this.add.text(x, y, msg, { fontFamily: 'Courier', fontSize: '18px', backgroundColor: '#F3B141', color: '#843605' });
        this.time.delayedCall(1000, () => {
            txt.destroy();
        });
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}