import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.ball = null;
        this.walls = null;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.addWalls();
        this.addBall();


        // 4. Add collider between ball and walls
        this.physics.add.collider(this.ball, this.walls, this.handleBallWallCollision, null, this);

        // Optional: If you want the ball to also collide with world bounds (e.g., if walls don't fully enclose)
        this.ball.setCollideWorldBounds(true); // Re-enable if needed, or design walls to fully enclose.
        this.input.once('pointerdown', () => {
            // this.scene.start('GameOver');
            console.log('Pointer Down!')
        });
    }

    handleBallWallCollision(ball, wall) {
        console.log('collision!')
        // The physics engine has already handled the primary reflection (e.g., reversed vx or vy).
        // Now we introduce a slight random angular deflection.

        // Get the current speed of the ball.
        // ball.body.velocity contains the new velocity AFTER the physics engine's bounce.
        const speed = ball.body.velocity.length();

        // Get the current angle of the velocity vector (in radians).
        let currentAngleRad = ball.body.velocity.angle();

        console.log(speed, currentAngleRad * 180 / 3.14);
        // // Define the maximum random change in degrees (+/- 1 degree in this case)
        const maxAngleChangeDegrees = 30.0;

        // // Generate a random angle offset in radians.
        // // Phaser.Math.FloatBetween will give a value between -maxAngleChangeDegrees and +maxAngleChangeDegrees.
        // // Phaser.Math.DegToRad converts this degree value to radians.
        const randomAngleOffsetRad = Phaser.Math.DegToRad(Phaser.Math.FloatBetween(-maxAngleChangeDegrees, maxAngleChangeDegrees));

        // // Apply the random offset to the current angle.
        let newAngleRad = currentAngleRad + randomAngleOffsetRad;

        // // Set the ball's new velocity using the original speed and the new, slightly perturbed angle.
        // // this.physics.velocityFromAngle directly updates ball.body.velocity.x and .y.
        this.physics.velocityFromAngle(newAngleRad * 180 / 3.14, speed, ball.body.velocity);
        // this.physics.velocityFromAngle(180, 100, ball.body.velocity);

        // Optional: Log the changes for debugging
        // console.log(`Collision! Speed: ${speed.toFixed(2)}, Old Angle: ${(Phaser.Math.RadToDeg(currentAngleRad)).toFixed(2)}°, New Angle: ${(Phaser.Math.RadToDeg(newAngleRad)).toFixed(2)}°`);
    }

    addBall() {
        // 1. Create the ball (same as before)
        const graphics = this.add.graphics();
        graphics.fillStyle(0xff0000, 1); // Red color
        graphics.fillCircle(20, 20, 20);
        const texture = graphics.generateTexture('ballTexture', 40, 40);
        graphics.destroy();

        this.ball = this.physics.add.sprite(this.sys.game.config.width / 2, 100, 'ballTexture'); // Start ball a bit higher
        this.ball.setVelocity(200, 150);
        this.ball.setBounce(1);
        // We'll remove world bounds collision if we want it to only collide with our custom walls
        // this.ball.setCollideWorldBounds(true); // Optional: keep if you want both

    }

    addWalls() {
        this.walls = this.physics.add.staticGroup();

        // Top wall
        this.walls
            .create(this.sys.game.config.width / 2, 20, 'wallTexture')
            .setDisplaySize(this.sys.game.config.width - 40, 40)
            .refreshBody();
        // Bottom wall
        this.walls
            .create(this.sys.game.config.width / 2, this.sys.game.config.height - 20, 'wallTexture')
            .setDisplaySize(this.sys.game.config.width - 40, 40)
            .refreshBody();
        // Left wall
        this.walls
            .create(20, this.sys.game.config.height / 2, 'wallTexture')
            .setDisplaySize(40, this.sys.game.config.height - 40)
            .refreshBody();
        // Right wall
        this.walls
            .create(this.sys.game.config.width - 20, this.sys.game.config.height / 2, 'wallTexture')
            .setDisplaySize(40, this.sys.game.config.height - 40)
            .refreshBody();

        const wallGraphics = this.add.graphics();
        wallGraphics.fillStyle(0x0000ff, 1); // Blue color for walls
        wallGraphics.fillRect(0, 0, 10, 10); // A small rectangle, size doesn't really matter here as we'll scale it
        wallGraphics.generateTexture('wallTexture', 10, 10);
        wallGraphics.destroy();
    }
}
