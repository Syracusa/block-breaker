import { Scene } from 'phaser';
import { screenDef } from '../../def';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.add.image(512, 384, 'background');

        this.add.text(screenDef.width / 2, 300, 'Block Breaker', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(screenDef.width / 2, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('LevelSelect'); // 레벨 선택 씬으로 시작
        });
    }
}
