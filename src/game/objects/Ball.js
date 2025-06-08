import { Scene } from "phaser";


export class Ball {

    /** @type {SpriteWithDynamicLogic} */
    sprite;

    /** @type {Scene} */
    scene;

    static textureLoaded = false;
    static loadTexture(scene) {
        if (Ball.textureLoaded)
            return;
        const graphics = scene.add.graphics();
        graphics.fillStyle(0xff0000, 1); // Red color
        graphics.fillCircle(20, 20, 20);
        graphics.generateTexture('ballTexture', 40, 40);
        graphics.destroy();
        Ball.textureLoaded = true;
    }

    /**
     * 
     * @param {Scene} scene 
     */
    constructor(scene) {
        Ball.loadTexture();
        this.scene = scene;
        console.log(scene);

        this.sprite = scene.physics.add.sprite(scene.sys.game.config.width / 2, 100, 'ballTexture'); // Start ball a bit higher
        this.sprite.setVelocity(400, 300);
        this.sprite.setCircle(20);
        this.sprite.setBounce(1);
    }

    destroy() {
        // 이 Ball 객체가 관리하는 sprite를 파괴합니다.
        this.sprite.destroy();
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