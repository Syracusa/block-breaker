import { Scene } from "phaser";


export class Ball {

    /** @type {SpriteWithDynamicLogic} */
    sprite;

    /** @type {Scene} */
    scene;

    /**
     * 
     * @param {Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;
        console.log(scene);

        const graphics = scene.add.graphics();
        graphics.fillStyle(0xff0000, 1); // Red color
        graphics.fillCircle(20, 20, 20);
        const texture = graphics.generateTexture('ballTexture', 40, 40);
        graphics.destroy();

        this.sprite = scene.physics.add.sprite(scene.sys.game.config.width / 2, 100, 'ballTexture'); // Start ball a bit higher
        this.sprite.setVelocity(400, 300);
        this.sprite.setCircle(20);
        this.sprite.setBounce(1);

        // const graphics = scene.add.graphics();
        // graphics.fillStyle(0xff0000, 1); // Red color
        // graphics.fillCircle(20, 20, 20);
        // const texture = graphics.generateTexture('ballTexture', 40, 40);
        // graphics.destroy();

        // this.ball = scene.physics.add.sprite(this.sys.game.config.width / 2, 100, 'ballTexture'); // Start ball a bit higher
        // this.ball.setVelocity(200, 150);
        // this.ball.setBounce(1);

    }

    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
    
    isFall() {
        const pos = this.getPosition();
        if (pos.y > this.scene.sys.game.config.height) {
            return true;
        }
        return false;
    }
}