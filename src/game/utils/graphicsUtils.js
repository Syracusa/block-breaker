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