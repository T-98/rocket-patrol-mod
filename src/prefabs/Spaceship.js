class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this) // add to existing scene
        this.points = pointValue // store pointvalue

    }

    update() {
        // move spaceship left
        if (this.texture === 'dropship') this.x -= game.settings.spaceshipSpeed + 1;
        else this.x -= game.settings.spaceshipSpeed;

        //wrap around from left edge to right edge
        if (this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    //position reset
    reset() {
        this.x = game.config.width

    }
}