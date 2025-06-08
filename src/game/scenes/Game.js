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

    create() {
        this._createBackground();
        this._createCoreObjects();
        this._createGroups();
        this._createUI();
        this._setupPhysics();
    }

    update() {
        this.paddle.update();
        this._checkBallFall();
        this._cleanupItems();
    }

    // --- 내부 초기화 및 생성 함수들 ---

    _initVars() {
        this.walls = null;
        this.ball = null;
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
        this.ball = new Ball(this);
        this.paddle = new Paddle(this);
    }

    _createGroups() {
        this.blocksGroup = BlockManager.createBlocks(this);
        this.itemsGroup = this.physics.add.group();
    }

    _createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
    }

    _setupPhysics() {
        this.physics.add.collider(this.ball.sprite, this.walls.wallStaticGroup, this.handleBallWallCollision, null, this);
        this.physics.add.collider(this.ball.sprite, this.blocksGroup, this.hitBlock, null, this);
        this.physics.add.collider(this.ball.sprite, this.paddle.sprite, this.hitPaddle, null, this);
        this.physics.add.overlap(this.paddle.sprite, this.itemsGroup, this.collectItem, null, this);
    }

    // --- 업데이트 헬퍼 함수들 ---

    _checkBallFall() {
        if (this.ball.isFall()) {
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
        block.hit();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.blocksGroup.countActive(true) === 0) {
            console.log('All blocks cleared! Level Complete!');
            this.scene.start('MainMenu');
        }
    }

    hitPaddle(ball, paddle) {
        // ... 패들 히트 로직 ...
    }

    collectItem(paddle, item) {
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
        const maxAngleChangeDegrees = 20.0;
        const randomAngleOffsetRad = Phaser.Math.DegToRad(Phaser.Math.FloatBetween(-maxAngleChangeDegrees, maxAngleChangeDegrees));
        let newAngleRad = currentAngleRad + randomAngleOffsetRad;

        // PI 값은 Phaser.Math.PI를 사용하는 것이 더 정확합니다.
        this.physics.velocityFromAngle(Phaser.Math.RadToDeg(newAngleRad), speed, ball.body.velocity);
    }
}