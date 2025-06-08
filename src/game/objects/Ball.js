// ./game/objects/Ball.js

import { Scene, Physics } from 'phaser';

export class Ball extends Physics.Arcade.Sprite {
    static textureLoaded = false;

    static preload(scene) {
        if (Ball.textureLoaded) return;
        Ball.textureLoaded = true;
        
        const graphics = scene.add.graphics();
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('ballTexture', 20, 20);
        graphics.destroy();
    }

    /**
     * @param {Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y) {
        // 부모 생성자 호출 외에는 아무것도 하지 않습니다.
        super(scene, x, y, 'ballTexture');
    }
}