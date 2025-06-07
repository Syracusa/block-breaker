// ./game/objects/Block.js

// '블록 한 개'를 정의하는 클래스입니다. Phaser의 Sprite 객체를 상속받습니다.
export class Block extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, blockType) {
        // 'blockTexture'는 Game.js에서 미리 만들어 둔 텍스처를 사용합니다.
        super(scene, x, y, 'blockTexture');

        this.blockType = blockType;
        this.health = 1; // 기본 체력

        // blockType에 따라 블록의 속성을 다르게 설정합니다.
        switch (this.blockType) {
            case 1:
                this.setTint(0x00ff00); // 초록색 일반 블록
                this.health = 1;
                break;
            case 2:
                this.setTint(0xff8c00); // 주황색 단단한 블록
                this.health = 2;
                break;
            case 3:
                this.setTint(0x00bfff); // 하늘색 특수 블록
                this.health = 1;
                break;
            // 필요에 따라 더 많은 종류를 추가할 수 있습니다.
            default:
                this.setTint(0x00ff00);
                this.health = 1;
                break;
        }

        // 씬에 이 블록 객체를 추가하고 물리엔진을 활성화합니다.
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // true는 static body로 만듭니다.
    }

    // 블록이 맞았을 때 호출될 메소드
    hit() {
        this.health--;

        if (this.health <= 0) {
            // TODO: 블록 파괴 애니메이션이나 사운드 추가
            this.destroy();
        } else {
            // 체력이 깎였을 때의 시각적 효과 (예: 색상 변경)
            this.setTint(0xff0000); // 체력이 깎이면 빨간색으로
        }
    }
}