import { Scene } from 'phaser';
import { Ball } from '../objects/Ball';
import { Walls } from '../objects/Walls';

export class Game extends Scene {
    constructor() {
        super('Game');

        this.walls = null;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.ball = new Ball(this);
        this.walls = new Walls(this);

        this.physics.add.collider(this.ball.sprite, this.walls.wallStaticGroup, this.handleBallWallCollision, null, this);

        this.input.once('pointerdown', () => {
            console.log('Pointer Down!')
        });

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
