// ./game/managers/BlockManager.js

import { Block } from '../objects/Block.js';
import { LEVEL_DESIGNS } from '../data/levelDesigns.js';

export class BlockManager {
    /**
     * 씬(Scene) 객체를 받아와 레벨 디자인에 맞는 블록들을 생성하고,
     * 생성된 블록들이 담긴 물리 그룹을 반환합니다.
     * @param {Phaser.Scene} scene - 블록을 추가할 씬 객체
     * @returns {Phaser.Physics.Arcade.StaticGroup} 생성된 블록 그룹
     */
    static createBlocks(scene) {
        const blocksGroup = scene.physics.add.staticGroup();
        const levelLayout = LEVEL_DESIGNS[scene.selectedLevel - 1];

        if (!levelLayout) {
            console.error(`Level ${scene.selectedLevel} design not found!`);
            scene.scene.start('MainMenu');
            return blocksGroup;
        }

        const totalHorizontalPadding = 100;
        const spacing = 5;
        const topOffsetY = 100;

        const numCols = levelLayout[0].length;
        const gameWidth = scene.sys.game.config.width;

        const availableWidth = gameWidth - totalHorizontalPadding - ((numCols - 1) * spacing);
        const blockWidth = availableWidth / numCols;
        const blockHeight = blockWidth / 2;

        if (scene.textures.exists('blockTexture')) {
            scene.textures.remove('blockTexture');
        }
        const blockGraphics = scene.add.graphics();
        blockGraphics.fillStyle(0xffffff, 1);
        blockGraphics.fillRect(0, 0, blockWidth, blockHeight);
        blockGraphics.generateTexture('blockTexture', blockWidth, blockHeight);
        blockGraphics.destroy();

        const startX = totalHorizontalPadding / 2;

        levelLayout.forEach((row, rowIndex) => {
            row.forEach((blockData, colIndex) => {
                // blockData가 0(빈 공간)이 아닐 때
                if (blockData) {
                    const x = startX + colIndex * (blockWidth + spacing) + blockWidth / 2;
                    const y = topOffsetY + rowIndex * (blockHeight + spacing) + blockHeight / 2;

                    let blockType = blockData;
                    let itemToDrop = null;

                    // blockData가 객체 형태이면, 타입과 아이템 정보를 분리
                    if (typeof blockData === 'object') {
                        blockType = blockData.type;
                        itemToDrop = blockData.item;
                    }

                    // Block 생성자에 아이템 정보를 함께 전달
                    const block = new Block(scene, x, y, blockType, itemToDrop);
                    blocksGroup.add(block);
                }
            });
        });

        return blocksGroup;
    }
}