import { Scene } from 'phaser';
// BlockManager를 실제 경로에서 임포트합니다. 경로가 다를 경우 수정해주세요.
import { BlockManager } from '../managers/BlockManager.js'; 

export class TestScene extends Scene {
    constructor() {
        super('TestScene');
    }

    create() {
        // --- 공 생성 (그룹 사용) ---
        // 이 부분은 이전 테스트와 동일합니다.
        const graphics = this.add.graphics();
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('ball_texture_minimal', 20, 20);
        graphics.destroy();

        const balls = this.physics.add.group();
        const ball = balls.create(400, 300, 'ball_texture_minimal');
        
        ball.setCircle(10);
        ball.setBounce(1);
        ball.setCollideWorldBounds(true);
        ball.setVelocity(200, 150);


        // --- 블록 생성 (BlockManager 사용) ---

        // 1. BlockManager가 레벨 데이터를 필요로 하므로, 테스트를 위해 임시로 selectedLevel 속성을 추가합니다.
        this.selectedLevel = 1; 

        // 2. 실제 BlockManager를 사용해 블록 그룹을 생성합니다.
        const blocksGroup = BlockManager.createBlocks(this);


        // --- 충돌 설정 (⭐ 이 부분이 수정되었습니다) ---
        this.physics.add.collider(balls, blocksGroup, (collidedBall, collidedBlock) => {
            // 이제 `collidedBlock`은 Block 클래스의 인스턴스입니다.
            console.log('BlockManager의 블록과 충돌!');
            
            // Block 클래스에 내장된 hit() 메소드를 직접 호출합니다.
            // 이 메소드가 체력 감소 및 조건부 파괴를 모두 처리합니다.
            collidedBlock.hit();

        }, null, this);
        
        
        console.log("BlockManager를 사용하는 테스트 씬이 시작되었습니다.");
    }
}