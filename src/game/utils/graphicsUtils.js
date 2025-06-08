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
    // --- 아래 코드를 추가해주세요 ---
    // 아이템 텍스처 중 하나라도 이미 존재한다면, 모든 텍스처가 이미 생성된 것으로 간주하고 함수를 즉시 종료합니다.
    if (scene.textures.exists('item_PADDLE_WIDER')) {
        return;
    }
    // ----------------------------

    const itemSize = 30;

    const createTexture = (key, bgColor, letter, letterColor) => {
        const rt = scene.add.renderTexture(0, 0, itemSize, itemSize);
        const bg = scene.add.graphics().fillStyle(bgColor).fillRect(0, 0, itemSize, itemSize);
        const text = scene.add.text(0, 0, letter, {
            fontSize: '20px',
            fill: letterColor,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        rt.draw(bg, 0, 0);
        rt.draw(text, itemSize / 2, itemSize / 2);

        rt.saveTexture(key);
        bg.destroy();
        text.destroy();
        rt.destroy();
    };

    createTexture('item_PADDLE_WIDER', 0x0000ff, 'W', '#fff');
    createTexture('item_BALL_FASTER', 0xff0000, 'F', '#fff');
    createTexture('item_EXTRA_SCORE', 0xffff00, '$', '#000');
    createTexture('item_MULTI_BALL', 0x20c20e, 'M', '#fff'); // ◀️ 멀티볼(M) 텍스처 추가

}