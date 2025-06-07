import { Scene } from "phaser";


export class Walls {
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    wallStaticGroup;

    /**
     * 
     * @param {Scene} scene 
     */
    constructor(scene) {

        this.wallStaticGroup = scene.physics.add.staticGroup();

        // Top wall
        this.wallStaticGroup
            .create(scene.sys.game.config.width / 2, 20, 'wallTexture')
            .setDisplaySize(scene.sys.game.config.width - 40, 40)
            .refreshBody();
        // Bottom wall
        // this.wallStaticGroup
        //     .create(scene.sys.game.config.width / 2, scene.sys.game.config.height - 20, 'wallTexture')
        //     .setDisplaySize(scene.sys.game.config.width - 40, 40)
        //     .refreshBody();
        // Left wall
        this.wallStaticGroup
            .create(20, scene.sys.game.config.height / 2, 'wallTexture')
            .setDisplaySize(40, scene.sys.game.config.height - 40)
            .refreshBody();
        // Right wall
        this.wallStaticGroup
            .create(scene.sys.game.config.width - 20, scene.sys.game.config.height / 2, 'wallTexture')
            .setDisplaySize(40, scene.sys.game.config.height - 40)
            .refreshBody();

        const wallGraphics = scene.add.graphics();
        wallGraphics.fillStyle(0x0000ff, 1); // Blue color for walls
        wallGraphics.fillRect(0, 0, 10, 10); // A small rectangle, size doesn't really matter here as we'll scale it
        wallGraphics.generateTexture('wallTexture', 10, 10);
        wallGraphics.destroy();
    }
}