import { Scene } from "phaser";


export class Blocks {

    /** @type {Scene} */
    scene;

    /** @type {} */
    blockStaticGroup;

    constructor(scene) {


        // Texture for the breakable blocks
        const blockGraphics = scene.add.graphics();
        blockGraphics.fillStyle(0x00ff00, 1); // Green color
        blockGraphics.fillRect(0, 0, 50, 20); // Define block size here
        blockGraphics.generateTexture('blockTexture', 50, 20); // Use defined size
        blockGraphics.destroy();

        this.blockStaticGroup = scene.physics.add.staticGroup(); // Static group for blocks

        const blockWidth = 50;  // Must match texture generation if not scaling
        const blockHeight = 20; // Must match texture generation
        const numCols = 10;
        const numRows = 4;
        const colOffset = (scene.sys.game.config.width - (numCols * blockWidth) - ((numCols -1) * 5)) / 2; // Center the block grid
        const rowOffset = 80; // Starting Y position for the blocks

        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                const blockX = colOffset + c * (blockWidth + 5); // 5px spacing between blocks
                const blockY = rowOffset + r * (blockHeight + 5);
                this.blockStaticGroup.create(blockX, blockY, 'blockTexture').setOrigin(0,0).refreshBody(); // Set origin for easier grid placement
            }
        }

    }

}