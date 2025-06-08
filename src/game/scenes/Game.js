// ./game/scenes/Game.js

import { Scene } from 'phaser';
import { Ball } from '../objects/Ball';
import { Walls } from '../objects/Walls';
import { Paddle } from '../objects/Paddle';
import { GRADIENT_PALETTES } from '../data/colorPalettes.js';
import { ITEM_EFFECTS } from '../data/itemEffects.js';
import { createGradientBackground, createItemTextures } from '../utils/graphicsUtils.js';
import { BlockManager } from '../managers/BlockManager.js';

export class Game extends Scene {
    constructor() {
        super('Game');
        this._initVars();
    }

    init(data) {
        this.selectedLevel = data.level || 1;
        this.score = 0; // 레벨이 시작될 때마다 점수 초기화
    }

    preload() {
        Ball.preload(this);

    }

    create() {
        this._createBackground();
        this._createCoreObjects();
        this._createGroups();
        this._createUI();
        this._setupPhysics();
    }

    // --- ▼▼▼ 공 생성 및 설정 전용 함수 추가 ▼▼▼ ---
    _createBall(x, y, vx, vy) {
        if (this.balls.countActive(true) >= 100) {
            console.log('최대 공 개수(100개)에 도달하여 더 이상 생성되지 않습니다.');
            return null; // 공을 생성하지 않고 함수를 즉시 종료합니다.
        }
        console.log(this.balls.countActive(true));

        // 1. 그룹을 통해 비활성 상태의 공을 가져오거나 생성합니다.
        const ball = this.balls.get(x, y);

        if (ball) {
            // 2. 공을 활성화하고 화면에 보이게 합니다.
            ball.setActive(true);
            ball.setVisible(true);

            // 3. 물리 속성을 여기서 모두 설정합니다.
            ball.setCircle(10);
            ball.setBounce(1);
            // ball.setCollideWorldBounds(true);
            ball.setVelocity(vx, vy);
        }
        return ball;
    }

    update() {
        this.paddle.update();
        this._checkBallFall();
        this._cleanupItems();
    }

    // --- 내부 초기화 및 생성 함수들 ---

    _initVars() {
        this.walls = null;
        this.balls = null;
        this.paddle = null;
        this.cursors = null;
        this.blocksGroup = null;
        this.itemsGroup = null;
        this.score = 0;
        this.scoreText = null;
        this.selectedLevel = 1;
    }

    _createBackground() {
        const randomPalette = Phaser.Math.RND.pick(GRADIENT_PALETTES);
        createGradientBackground(this, randomPalette.start, randomPalette.end);
        createItemTextures(this);
    }

    _createCoreObjects() {
        this.walls = new Walls(this);
        this.paddle = new Paddle(this);

        this.balls = this.physics.add.group({
            classType: Ball
        });

        // 헬퍼 함수를 이용해 첫 번째 공을 생성하고 설정합니다.
        this._createBall(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            400,
            300
        );
    }

    _createGroups() {
        this.blocksGroup = BlockManager.createBlocks(this);
        this.itemsGroup = this.physics.add.group();
    }

    _createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
    }

    _setupPhysics() {
        // --- 충돌 설정 최종 변경 ---
        // 이제 그룹 자체를 충돌 대상으로 지정하면 모든 문제가 해결됩니다.
        // this.physics.add.collider(this.balls, this.walls.wallStaticGroup, this.handleBallWallCollision, null, this);

        this.physics.add.collider(this.balls, this.walls.wallStaticGroup, this.handleBallWallCollision, null, this);
        this.physics.add.collider(this.balls, this.blocksGroup, this.hitBlock, null, this);
        this.physics.add.collider(this.balls, this.paddle.sprite, this.hitPaddle, null, this);
        this.physics.add.overlap(this.paddle.sprite, this.itemsGroup, this.collectItem, null, this);
    }

    _checkBallFall() {
        this.balls.getChildren().forEach(ball => {
            if (ball.y > this.sys.game.config.height) {
                ball.destroy(); // 이제 내장된 destroy 메소드를 호출합니다.
            }
        });

        if (this.balls.countActive(true) === 0) {
            this.scene.start('GameOver', { score: this.score });
        }
    }

    _cleanupItems() {
        this.itemsGroup.getChildren().forEach(item => {
            if (item.y > this.sys.game.config.height) {
                item.destroy();
            }
        });
    }

    // --- 물리 충돌 콜백 함수들 ---

    hitBlock(ball, block) {
        this.sound.play('block_break');

        block.hit();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.blocksGroup.countActive(true) === 0) {
            console.log('All blocks cleared! Level Complete!');
            this.scene.start('MainMenu');
        }
    }

    hitPaddle(ball, paddle) {
        this.sound.play('paddle_hit', { volume: 0.5 });
        // ... 패들 히트 로직 ...
    }

    collectItem(paddle, item) {
        this.sound.play('item_get', { volume: 0.5 });
        const effect = ITEM_EFFECTS[item.itemType];
        if (effect) {
            effect(this);
        }
        item.destroy();
    }

    handleBallWallCollision(ball, wall) {
        console.log('wall collision!')

        const speed = ball.body.velocity.length();
        let currentAngleRad = ball.body.velocity.angle();
        const maxAngleChangeDegrees = 10.0;
        const randomAngleOffsetRad = Phaser.Math.DegToRad(Phaser.Math.FloatBetween(-maxAngleChangeDegrees, maxAngleChangeDegrees));
        let newAngleRad = currentAngleRad + randomAngleOffsetRad;

        // PI 값은 Phaser.Math.PI를 사용하는 것이 더 정확합니다.
        this.physics.velocityFromAngle(Phaser.Math.RadToDeg(newAngleRad), speed, ball.body.velocity);
    }
}