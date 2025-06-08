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
 * 게임에 필요한 아이템 텍스처들을 미리 생성합니다. (RenderTexture를 사용한 수정 버전)
 * @param {Phaser.Scene} scene - 텍스처를 추가할 씬 객체
 */
export function createItemTextures(scene) {
    const itemSize = 30;

    // --- RenderTexture를 사용하여 텍스처를 생성하는 헬퍼 함수 ---
    const createTexture = (key, bgColor, letter, letterColor) => {
        // 1. RenderTexture 생성: 임시로 그림을 그릴 보이지 않는 캔버스입니다.
        const rt = scene.add.renderTexture(0, 0, itemSize, itemSize);

        // 2. 배경색 사각형 생성
        const bg = scene.add.graphics().fillStyle(bgColor).fillRect(0, 0, itemSize, itemSize);
        
        // 3. 글자를 원점(0, 0)에 생성합니다. 위치 지정은 draw에서 할 것입니다.
        const text = scene.add.text(0, 0, letter, {
            fontSize: '20px',
            fill: letterColor,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 4. RenderTexture에 배경과 글자를 차례로 그립니다.
        rt.draw(bg, 0, 0);
        rt.draw(text, itemSize / 2, itemSize / 2);

        // 5. 완성된 RenderTexture의 내용을 게임의 텍스처 매니저에 저장합니다.
        rt.saveTexture(key);

        // 6. 임시로 사용했던 객체들은 파괴합니다.
        bg.destroy();
        text.destroy();
        rt.destroy();
    };
    // ----------------------------------------------------

    // 위 헬퍼 함수를 이용해 각 아이템 텍스처를 생성합니다.
    createTexture('item_PADDLE_WIDER', 0x0000ff, 'W', '#fff');
    createTexture('item_BALL_FASTER', 0xff0000, 'F', '#fff');
    createTexture('item_EXTRA_SCORE', 0xffff00, '$', '#000');
}