// ./game/scenes/Game.js

import { Scene } from 'phaser';
import { Ball } from '../objects/Ball';
import { Walls } from '../objects/Walls';
import { Paddle } from '../objects/Paddle';
import { GRADIENT_PALETTES } from '../data/colorPalettes.js';

// 새로 만든 모듈들을 import 합니다.
import { createGradientBackground } from '../utils/graphicsUtils.js';
import { BlockManager } from '../managers/BlockManager.js';
import { ITEM_TYPES } from '../data/itemTypes.js';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.walls = null;
        this.ball = null;
        this.paddle = null;
        this.cursors = null;
        this.blocksGroup = null;
        this.selectedLevel = 1;

        this.itemsGroup = null; // 아이템 그룹 속성 추가
        this.score = 0; // 점수 속성 추가
        this.scoreText = null; // 점수 텍스트 속성 추가
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

        // 아이템 그룹 생성
        this.itemsGroup = this.physics.add.group();

        // 점수 텍스트 생성
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });


        // 4. 물리 충돌 설정
        this.physics.add.collider(this.ball.sprite, this.walls.wallStaticGroup, this.handleBallWallCollision, null, this);
        this.physics.add.collider(this.ball.sprite, this.blocksGroup, this.hitBlock, null, this);
        this.physics.add.collider(this.ball.sprite, this.paddle.sprite, this.hitPaddle, null, this);
        this.physics.add.overlap(this.paddle.sprite, this.itemsGroup, this.collectItem, null, this);


        // --- 아이템 텍스처 미리 만들기 ---
        const itemSize = 30;
        const itemGraphics = this.add.graphics();
        // PADDLE_WIDER 아이템 (파란색 'W')
        itemGraphics.fillStyle(0x0000ff); itemGraphics.fillRect(0, 0, itemSize, itemSize);
        this.add.text(itemSize / 2, itemSize / 2, 'W', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5).copyPosition(itemGraphics);
        itemGraphics.generateTexture('item_PADDLE_WIDER', itemSize, itemSize);
        // BALL_FASTER 아이템 (빨간색 'F')
        itemGraphics.clear(); itemGraphics.fillStyle(0xff0000); itemGraphics.fillRect(0, 0, itemSize, itemSize);
        this.add.text(itemSize / 2, itemSize / 2, 'F', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5).copyPosition(itemGraphics);
        itemGraphics.generateTexture('item_BALL_FASTER', itemSize, itemSize);
        // EXTRA_SCORE 아이템 (노란색 '$')
        itemGraphics.clear(); itemGraphics.fillStyle(0xffff00); itemGraphics.fillRect(0, 0, itemSize, itemSize);
        this.add.text(itemSize / 2, itemSize / 2, '$', { fontSize: '20px', fill: '#000' }).setOrigin(0.5).copyPosition(itemGraphics);
        itemGraphics.generateTexture('item_EXTRA_SCORE', itemSize, itemSize);
        itemGraphics.destroy();
    }

    update() {
        const paddleSpeed = 500;
        if (this.cursors.left.isDown) this.paddle.sprite.setVelocityX(-paddleSpeed);
        else if (this.cursors.right.isDown) this.paddle.sprite.setVelocityX(paddleSpeed);
        else this.paddle.sprite.setVelocityX(0);

        if (this.ball.isFall()) {
            this.scene.start('GameOver');
        }

        // 화면 밖으로 나간 아이템 제거
        this.itemsGroup.getChildren().forEach(item => {
            if (item.y > this.sys.game.config.height) {
                item.destroy();
            }
        });
    }

    hitBlock(ball, block) {
        // 이제 block은 체력(health)과 hit() 메소드를 가진 Block 객체입니다.
        block.hit();

        // 점수 추가
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

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

    // 아이템을 수집했을 때 호출될 콜백 함수
    collectItem(paddle, item) {
        console.log('collect item!');
        // 아이템의 타입에 따라 다른 효과 적용
        switch (item.itemType) {
            case ITEM_TYPES.PADDLE_WIDER:
                console.log(`Paddle wider item!`);
                paddle.displayWidth = 150; // 패들 너비를 150px로
                // 3초 후에 원래 크기로 돌아오게 설정
                this.time.delayedCall(3000, () => {
                    paddle.displayWidth = 100; // 원래 패들 너비
                });
                break;

            case ITEM_TYPES.BALL_FASTER:
                console.log(`Ball faster item!`);
                const currentSpeed = this.ball.sprite.body.velocity.length();
                this.ball.sprite.body.velocity.normalize().scale(currentSpeed * 1.5);
                break;

            case ITEM_TYPES.EXTRA_SCORE:
                console.log(`Extra score item!`);
                this.score += 100;
                this.scoreText.setText('Score: ' + this.score);
                break;
            
            default:
                console.log(`Unavailable item type: ${item.itemType}`);
                break;
        }

        // 아이템은 효과 적용 후 사라져야 함
        item.destroy();
    }
}