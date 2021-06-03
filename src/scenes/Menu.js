class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_dropship_explosion', './assets/dropship_explosion.wav');
        this.load.audio('sfx_dropship_enter', './assets/dropship_enter.wav');
        this.load.audio('sfx_explosion1', './assets/sfx_explosion1.wav');
        this.load.audio('sfx_explosion2', './assets/sfx_explosion2.wav');
        this.load.audio('sfx_explosion3', './assets/sfx_explosion3.wav');
        this.load.audio('sfx_explosion4', './assets/sfx_explosion4.wav');
    }

    create() {
        let menuConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                    top: 6,
                    bottom: 5,
                },
                fixedWidth: 0
            }
            //show menu text
        this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize -
            borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);

        //adding select # of players option
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = "#000";
        this.add.text(game.config.width / 2, game.config.height / 2.02, 'Press ↑ for 1 Player or ↓ 2 Players',
            menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor = '#F3B141';
        menuConfig.color = "#843605";
        this.add.text(game.config.width / 2, game.config.height / 1.8, 'Use ← → arrows to move & (F) to fire',
            menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = "#000";
        this.add.text(game.config.width / 2, game.config.height / 1.9 + borderUISize +
            borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            multiPlayer = true;
            this.sound.play('sfx_select');
        }
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                rocketSpeed: 2,
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                rocketSpeed: 3,
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}