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
        // --- 1. 키보드 입력 확인 (기존 로직) ---
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(this.speed);

            // --- ▼▼▼ 2. 터치 또는 마우스 입력 확인 (새로 추가된 로직) ▼▼▼ ---
            // 키보드가 눌리지 않았고, 화면이 터치(클릭)되고 있는 경우
        } else if (this.scene.input.activePointer.isDown) {
            const touchX = this.scene.input.activePointer.x;
            const screenCenterX = this.scene.sys.game.config.width / 2;

            // 터치 위치가 화면의 왼쪽 절반이면 왼쪽으로 이동
            if (touchX < screenCenterX) {
                this.sprite.setVelocityX(-this.speed);
            }
            // 터치 위치가 화면의 오른쪽 절반이면 오른쪽으로 이동
            else {
                this.sprite.setVelocityX(this.speed);
            }

            // --- 3. 아무 입력도 없을 때 (기존 로직) ---
        } else {
            this.sprite.setVelocityX(0);
        }
    }
}