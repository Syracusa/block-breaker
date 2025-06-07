
export class Paddle {

    
    /** @type {Scene} */
    scene;

    sprite;

    constructor(scene) {
        this.scene = scene;
    
    
        // Texture for the paddle
        const paddleGraphics = scene.add.graphics();
        paddleGraphics.fillStyle(0xffffff, 1); // White paddle
        paddleGraphics.fillRect(0, 0, 200, 20); // Paddle dimensions
        paddleGraphics.generateTexture('paddleTexture', 200, 20);
        paddleGraphics.destroy();



        // --- Paddle Creation ---
        const paddleY = scene.sys.game.config.height - 50;
        this.sprite = scene.physics.add.sprite(scene.sys.game.config.width / 2, paddleY, 'paddleTexture');
        this.sprite.setImmovable(true); // So the ball bounces off and doesn't push the paddle
        this.sprite.setCollideWorldBounds(true); // Prevent paddle from moving out of screen
        // Optional: Reduce bounce effect if ball hits paddle from side (not necessary for immovable)
        // this.paddle.body.setBounce(0);

    }
}