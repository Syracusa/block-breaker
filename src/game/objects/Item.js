// ./game/objects/Item.js

export class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, itemType) {
        const textureKey = `item_${itemType}`;
        super(scene, x, y, textureKey);

        this.itemType = itemType;

        scene.add.existing(this);
        // scene.physics.add.existing(this);

        scene.itemsGroup.add(this);
        // --- 디버깅 로그 ---
        // 아이템이 생성되는 순간의 물리 상태를 확인합니다.
        
        const debug = false;

        if (debug) {
            console.log('--- 아이템 상태 진단 시작 ---');
            console.log('아이템 객체:', this);
            console.log('물리 Body 객체:', this.body);
            console.log('Body 활성화 여부 (enable):', this.body.enable);
            console.log('정적 객체 여부 (isStatic):', this.body.isStatic);
            console.log('움직이지 않는지 여부 (immovable):', this.body.immovable);
        }

        this.setVelocityY(200); // 속도 설정

        if (debug) {
            console.log('setVelocityY(200) 실행 후 속도:', this.body.velocity);
            console.log('--- 아이템 상태 진단 끝 ---');
        }
        // -------------------

    }
}