import { Scene } from 'phaser';
import { Ball } from '../objects/Ball';
import { Walls } from '../objects/Walls';
import { Block } from '../objects/Block';

export class Game extends Scene {
    constructor() {
        super('Game');

        this.walls = null;
        this.ball = null;
        this.blocks = null;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.ball = new Ball(this);
        this.walls = new Walls(this);
        this.blocks = new Block(this);

        this.physics.add.collider(this.ball.sprite, this.walls.wallStaticGroup, this.handleBallWallCollision, null, this);
        this.physics.add.collider(this.ball.sprite, this.blocks.blockStaticGroup, this.hitBlock, null, this);

        this.input.once('pointerdown', () => {
            console.log('Pointer Down!')
        });

    }

    hitBlock(ball, block) {
        block.destroy(); // Destroy the block
        // Or use: block.disableBody(true, true); // Disables and hides, can be re-enabled

        // this.score += 10;
        // this.scoreText.setText('Score: ' + this.score);
        // // console.log('Block hit!');

        // // Optional: Play a sound
        // // this.sound.play('blockHitSound');

        // // Optional: Check if all blocks are destroyed
        // if (this.blocks.countActive(true) === 0) {
        //     // All blocks cleared - level complete, new level, or win condition
        //     console.log('All blocks cleared!');
        //     // this.scene.restart(); // Example: restart the scene
        //     this.showWinMessage();
        // }
    }

    handleBallWallCollision(ball, wall) {
        console.log('collision!')
        
        const speed = ball.body.velocity.length();

        let currentAngleRad = ball.body.velocity.angle();

        const maxAngleChangeDegrees = 30.0;
        
        const randomAngleOffsetRad = Phaser.Math.DegToRad(Phaser.Math.FloatBetween(-maxAngleChangeDegrees, maxAngleChangeDegrees));

        let newAngleRad = currentAngleRad + randomAngleOffsetRad;
        
        this.physics.velocityFromAngle(newAngleRad * 180 / 3.14, speed, ball.body.velocity);
    }
}
