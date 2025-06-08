// ./game/utils/graphicsUtils.js

import Phaser from 'phaser';

/**
 * 씬(Scene) 객체와 두 색상을 받아와 그라데이션 텍스처를 생성하고 배경으로 설정합니다.
 * @param {Phaser.Scene} scene - 배경을 추가할 씬 객체
 * @param {number} startColor - 시작 색상 (예: 0xff0000)
 * @param {number} endColor - 끝 색상 (예: 0x0000ff)
 */
export function createGradientBackground(scene, startColor, endColor) {
    const textureKey = 'gradientBackground';
    const width = scene.sys.game.config.width;
    const height = scene.sys.game.config.height;

    if (scene.textures.exists(textureKey)) {
        scene.textures.remove(textureKey);
    }

    const graphics = scene.add.graphics();
    const startColorObj = Phaser.Display.Color.ValueToColor(startColor);
    const endColorObj = Phaser.Display.Color.ValueToColor(endColor);

    for (let y = 0; y < height; y++) {
        const interpolatedColor = Phaser.Display.Color.Interpolate.ColorWithColor(startColorObj, endColorObj, height, y);
        graphics.fillStyle(interpolatedColor.color, 1);
        graphics.fillRect(0, y, width, 1);
    }

    graphics.generateTexture(textureKey, width, height);
    graphics.destroy();

    const bg = scene.add.image(width / 2, height / 2, textureKey);
    bg.setDepth(-1);
}


/**
 * 게임에 필요한 아이템 텍스처들을 미리 생성합니다.
 * @param {Phaser.Scene} scene - 텍스처를 추가할 씬 객체
 */
export function createItemTextures(scene) {
    const itemSize = 30;
    const itemGraphics = scene.add.graphics();
    
    // PADDLE_WIDER 아이템 (파란색 'W')
    itemGraphics.fillStyle(0x0000ff);
    itemGraphics.fillRect(0, 0, itemSize, itemSize);
    const textW = scene.add.text(itemSize / 2, itemSize / 2, 'W', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    // generateTexture는 DisplayObject를 직접 받을 수 있습니다.
    itemGraphics.generateTexture('item_PADDLE_WIDER', itemSize, itemSize);
    textW.destroy(); // 텍스트 객체는 텍스처 생성 후 파괴

    // BALL_FASTER 아이템 (빨간색 'F')
    itemGraphics.clear().fillStyle(0xff0000).fillRect(0, 0, itemSize, itemSize);
    const textF = scene.add.text(itemSize / 2, itemSize / 2, 'F', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    itemGraphics.generateTexture('item_BALL_FASTER', itemSize, itemSize);
    textF.destroy();

    // EXTRA_SCORE 아이템 (노란색 '$')
    itemGraphics.clear().fillStyle(0xffff00).fillRect(0, 0, itemSize, itemSize);
    const textS = scene.add.text(itemSize / 2, itemSize / 2, '$', { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
    itemGraphics.generateTexture('item_EXTRA_SCORE', itemSize, itemSize);
    textS.destroy();

    itemGraphics.destroy(); // 그래픽 객체는 모두 사용 후 파괴
}