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
        block.hit();
        if (this.blocksGroup.countActive(true) === 0) {
            console.log('All blocks cleared! Level Complete!');
            this.scene.start('MainMenu');
        }
    }

    hitPaddle(ball, paddle) { /* ... */ }
    handleBallWallCollision(ball, wall) { /* ... */ }
}