// ./game/scenes/Game.js

import { Scene } from 'phaser';
import { Ball } from '../objects/Ball';
import { Walls } from '../objects/Walls';
import { Paddle } from '../objects/Paddle';
import { GRADIENT_PALETTES } from '../data/colorPalettes.js';
import { ITEM_EFFECTS } from '../data/itemEffects.js';
import { createGradientBackground, createItemTextures } from '../utils/graphicsUtils.js';
import { BlockManager } from '../managers/BlockManager.js';
import { UIManager } from '../managers/UIManager.js';

export class Game extends Scene {
    walls = null;
    balls = null;
    paddle = null;
    blocksGroup = null;
    itemsGroup = null;
    uiManager = null;

    score = 0;
    selectedLevel = 1;
    gameState = 'playing';

    constructor() {
        super('Game');
    }

    init(data) {
        this.selectedLevel = data.level || 1;
        this.score = 0; // 레벨이 시작될 때마다 점수 초기화
        this.gameState = 'playing'; // ◀️ 씬이 시작될 때마다 'playing'으로 초기화

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
        if (this.gameState !== 'playing') {
            return;
        }

        this.paddle.update();
        this._checkBallFall();
        this._cleanupItems();
    }

    // --- 내부 초기화 및 생성 함수들 ---

    _createUI() {
        // UIManager 인스턴스를 생성하고, 초기 점수 UI를 만듭니다.
        console.log('createUI');
        this.uiManager = new UIManager(this);
        this.uiManager.createScoreText(this.score);
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

    _setupPhysics() {
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

        if (this.balls.countActive(true) === 0 && this.gameState === 'playing') {
            this.gameState = 'gameOver';
            console.log(this.uiManager);
            this.uiManager.showEndLevelUI(false);
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
        this.uiManager.updateScore(this.score);
        if (this.blocksGroup.countActive(true) === 0) {
            console.log('All blocks cleared! Level Complete!');
            this.gameState = 'cleared';
            this.uiManager.showEndLevelUI(true); // ◀️ uiManager를 통해 호출
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
        const speed = ball.body.velocity.length();
        let currentAngleRad = ball.body.velocity.angle();
        const maxAngleChangeDegrees = 10.0;
        const randomAngleOffsetRad = Phaser.Math.DegToRad(Phaser.Math.FloatBetween(-maxAngleChangeDegrees, maxAngleChangeDegrees));
        let newAngleRad = currentAngleRad + randomAngleOffsetRad;

        this.physics.velocityFromAngle(Phaser.Math.RadToDeg(newAngleRad), speed, ball.body.velocity);
    }
}