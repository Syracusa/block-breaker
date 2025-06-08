// ./game/scenes/Game.js

import { Scene } from 'phaser';
import { Ball } from '../objects/Ball';
import { Walls } from '../objects/Walls';
import { Paddle } from '../objects/Paddle';
import { GRADIENT_PALETTES } from '../data/colorPalettes.js';

// 새로 만든 모듈들을 import 합니다.
import { createGradientBackground } from '../utils/graphicsUtils.js';
import { BlockManager } from '../managers/BlockManager.js';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.walls = null;
        this.ball = null;
        this.paddle = null;
        this.cursors = null;
        this.blocksGroup = null;
        this.selectedLevel = 1;
    }

    init(data) {
        this.selectedLevel = data.level || 1;
    }

    create() {
        console.log(`Starting Level: ${this.selectedLevel}`);
        
        // 1. 배경 생성 (이제 한 줄로 호출 가능)
        const randomPalette = Phaser.Math.RND.pick(GRADIENT_PALETTES);
        createGradientBackground(this, randomPalette.start, randomPalette.end);

        // 2. 핵심 게임 오브젝트 생성
        this.walls = new Walls(this);
        this.ball = new Ball(this);
        this.paddle = new Paddle(this);
        this.cursors = this.input.keyboard.createCursorKeys();

        // 3. 블록 생성 (이제 한 줄로 호출 가능)
        this.blocksGroup = BlockManager.createBlocks(this);

        // 4. 물리 충돌 설정
        this.physics.add.collider(this.ball.sprite, this.walls.wallStaticGroup, this.handleBallWallCollision, null, this);
        this.physics.add.collider(this.ball.sprite, this.blocksGroup, this.hitBlock, null, this);
        this.physics.add.collider(this.ball.sprite, this.paddle.sprite, this.hitPaddle, null, this);
    }

    update() {
        const paddleSpeed = 500;
        if (this.cursors.left.isDown) this.paddle.sprite.setVelocityX(-paddleSpeed);
        else if (this.cursors.right.isDown) this.paddle.sprite.setVelocityX(paddleSpeed);
        else this.paddle.sprite.setVelocityX(0);

        if (this.ball.isFall()) {
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