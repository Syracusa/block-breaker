import { Scene } from 'phaser';
import { screenDef } from '../../def';
import { createGradientBackground } from '../utils/graphicsUtils';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        // this.cameras.main.setBackgroundColor(0xff0000);
        // this.add.image(512, 384, 'background').setAlpha(0.5);

        const randomPalette = { start: 0x8ec5fc, end: 0xe0c3fc };
        createGradientBackground(this, randomPalette.start, randomPalette.end);

        this.add.text(screenDef.width / 2, 384, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
