// ./game/scenes/Game.js

import { Scene } from 'phaser';
import { Ball } from '../objects/Ball';
import { Walls } from '../objects/Walls';
// Block.js에서 Block 클래스를 import 합니다.
import { Block } from '../objects/Block';
import { Paddle } from '../objects/Paddle';

// 이전에 만들었던 레벨 디자인 파일을 import 합니다.
import { LEVEL_DESIGNS } from '../data/levelDesigns.js';

export class Game extends Scene {
    constructor() {
        super('Game');

        this.walls = null;
        this.ball = null;
        this.paddle = null;
        this.cursors = null;

        // 블록들을 담을 그룹을 만듭니다.
        this.blocksGroup = null;

        this.selectedLevel = 1;
    }

    init(data) {
        this.selectedLevel = data.level || 1;
    }

    create() {
        console.log(`Starting Level: ${this.selectedLevel}`);
        this.cameras.main.setBackgroundColor(0x1a1a1a); // 배경색 변경
        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.walls = new Walls(this);
        this.ball = new Ball(this);
        this.paddle = new Paddle(this);
        this.cursors = this.input.keyboard.createCursorKeys();

        // 레벨 디자인에 따라 블록들을 생성합니다.
        this.createBlocksFromLayout();

        // 충돌 설정: ball과 blocksGroup을 연결합니다.
        this.physics.add.collider(this.ball.sprite, this.walls.wallStaticGroup, this.handleBallWallCollision, null, this);
        this.physics.add.collider(this.ball.sprite, this.blocksGroup, this.hitBlock, null, this);
        this.physics.add.collider(this.ball.sprite, this.paddle.sprite, this.hitPaddle, null, this);
    }

    createBlocksFromLayout() {
        this.blocksGroup = this.physics.add.staticGroup();

        const levelLayout = LEVEL_DESIGNS[this.selectedLevel - 1];
        if (!levelLayout) {
            console.error(`Level ${this.selectedLevel} design not found!`);
            this.scene.start('MainMenu');
            return;
        }

        // --- 레이아웃 동적 계산 ---
        // 이 부분에서 블록 크기와 위치를 화면에 맞게 계산합니다.

        const totalHorizontalPadding = 100; // 화면 좌우에 남길 전체 여백
        const spacing = 5; // 블록과 블록 사이의 간격
        const topOffsetY = 100; // 상단 여백

        const numCols = levelLayout[0].length;
        const gameWidth = this.sys.game.config.width;

        // 블록 너비 계산: (전체 게임 너비 - 좌우 여백 - 전체 간격 너비) / 블록 개수
        const availableWidth = gameWidth - totalHorizontalPadding - ((numCols - 1) * spacing);
        const blockWidth = availableWidth / numCols;
        // 블록 높이는 너비의 절반으로 설정 (비율 유지)
        const blockHeight = blockWidth / 2;
        // --------------------------


        // --- 동적 크기로 텍스처 생성 ---
        // 계산된 blockWidth, blockHeight로 텍스처를 '매번' 새로 만듭니다.
        if (this.textures.exists('blockTexture')) {
            this.textures.remove('blockTexture');
        }
        const blockGraphics = this.add.graphics();
        blockGraphics.fillStyle(0xffffff, 1);
        blockGraphics.fillRect(0, 0, blockWidth, blockHeight);
        blockGraphics.generateTexture('blockTexture', blockWidth, blockHeight);
        blockGraphics.destroy();
        // ------------------------------

        // 계산된 위치에 블록 배치
        const startX = totalHorizontalPadding / 2;

        levelLayout.forEach((row, rowIndex) => {
            row.forEach((blockType, colIndex) => {
                if (blockType > 0) {
                    const x = startX + colIndex * (blockWidth + spacing) + blockWidth / 2;
                    const y = topOffsetY + rowIndex * (blockHeight + spacing) + blockHeight / 2;

                    const block = new Block(this, x, y, blockType);
                    this.blocksGroup.add(block);
                }
            });
        });
    }

    update() {
        // ... 기존 update 코드와 동일 ...
        const paddleSpeed = 500; // pixels per second for paddle movement

        // console.log(this.ball.getPosition());

        if (this.cursors.left.isDown) {
            this.paddle.sprite.setVelocityX(-paddleSpeed);
        } else if (this.cursors.right.isDown) {
            this.paddle.sprite.setVelocityX(paddleSpeed);
        } else {
            this.paddle.sprite.setVelocityX(0); // Stop the paddle if no key is pressed
        }

        if (this.ball.isFall()) {
            /* Game over */
            console.log('game over!');
            this.scene.start('GameOver');
        }
    }

    hitBlock(ball, block) {
        // 이제 block은 체력(health)과 hit() 메소드를 가진 Block 객체입니다.
        block.hit();

        // 모든 블록이 파괴되었는지 확인
        if (this.blocksGroup.countActive(true) === 0) {
            console.log('All blocks cleared! Level Complete!');
            // 다음 레벨로 가거나, 승리 화면을 보여줄 수 있습니다.
            this.scene.start('MainMenu'); // 예시로 메인메뉴로 돌아갑니다.
        }
    }

    hitPaddle(ball, paddle) {
        console.log('hitpaddle');
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