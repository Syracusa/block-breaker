import { Scene } from 'phaser';
import { screenDef } from '../../def';
import { createGradientBackground } from '../utils/graphicsUtils';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // this.add.image(512, 384, 'background');
        const randomPalette = { start: 0x8ec5fc, end: 0xe0c3fc };
        createGradientBackground(this, randomPalette.start, randomPalette.end);

        this.add.text(screenDef.width / 2, 300, 'Block Breaker', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(screenDef.width / 2, 460, '아무곳이나 클릭하여 시작', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.sound.play('ui_click');
            this.scene.start('LevelSelect'); // 레벨 선택 씬으로 시작
        });
    }
}
