import { Scene } from "phaser";


export class Ball {

    /** @type {SpriteWithDynamicLogic} */
    sprite;

    /** @type {Scene} */
    gameScene;

    /**
     * 
     * @param {Scene} gameScene 
     */
    constructor(gameScene) {
        this.gameScene = gameScene;
        console.log(gameScene);
        
        const graphics = gameScene.add.graphics();
        graphics.fillStyle(0xff0000, 1); // Red color
        graphics.fillCircle(20, 20, 20);
        const texture = graphics.generateTexture('ballTexture', 40, 40);
        graphics.destroy();

        this.sprite = gameScene.physics.add.sprite(gameScene.sys.game.config.width / 2, 100, 'ballTexture'); // Start ball a bit higher
        this.sprite.setVelocity(200, 150);
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
}