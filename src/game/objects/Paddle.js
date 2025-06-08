// ./game/objects/Paddle.js

export class Paddle {
    /** @type {Phaser.Scene} */
    scene;
    /** @type {Phaser.Physics.Arcade.Sprite} */
    sprite;
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors;
    /** @type {number} */
    speed;

    constructor(scene) {
        this.scene = scene;

        // Texture for the paddle
        const paddleGraphics = scene.add.graphics();
        paddleGraphics.fillStyle(0xffffff, 1); // White paddle
        paddleGraphics.fillRect(0, 0, 100, 20); // Paddle dimensions (너비를 100으로 조정했습니다)
        paddleGraphics.generateTexture('paddleTexture', 100, 20);
        paddleGraphics.destroy();

        // --- Paddle Creation ---
        const paddleY = scene.sys.game.config.height - 50;
        this.sprite = scene.physics.add.sprite(scene.sys.game.config.width / 2, paddleY, 'paddleTexture');
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);

        // --- 아래 코드를 추가해주세요 ---
        // 1. 패들의 움직임을 위한 키보드 입력(cursors)을 여기서 생성합니다.
        this.cursors = scene.input.keyboard.createCursorKeys();
        // 2. 패들의 속도를 클래스 속성으로 관리합니다.
        this.speed = 500;
    }

    /**
     * 패들의 움직임을 처리하는 업데이트 함수입니다.
     * 이 함수는 Game.js의 update 루프에서 매 프레임 호출됩니다.
     */
    update() {
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(this.speed);
        } else {
            this.sprite.setVelocityX(0);
        }
    }
}