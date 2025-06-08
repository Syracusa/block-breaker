// ./game/objects/Block.js

import { ITEM_TYPES } from "../data/itemTypes";
import { Item } from "./Item";

// '블록 한 개'를 정의하는 클래스입니다. Phaser의 Sprite 객체를 상속받습니다.
export class Block extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, blockType, itemToDrop = null) {
        // 'blockTexture'는 Game.js에서 미리 만들어 둔 텍스처를 사용합니다.
        super(scene, x, y, 'blockTexture');

        this.blockType = blockType;
        this.health = 1; // 기본 체력

        this.blockType = blockType;
        this.itemToDrop = itemToDrop; // 아이템 정보 저장
        this.health = 1;

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
        // scene.physics.add.existing(this, true); // true는 static body로 만듭니다.
    }

    hit() {
        this.health--;

        if (this.health <= 0) {
            // 파괴되기 직전, 드랍할 아이템이 있는지 확인
            if (this.itemToDrop) {
                // 아이템 생성
                console.log(this.itemToDrop);
                new Item(this.scene, this.x, this.y, this.itemToDrop);
            } else {
                new Item(this.scene, this.x, this.y, ITEM_TYPES.MULTI_BALL);
            }
            this.destroy();
        } else {
            this.setTint(0xff0000);
        }
    }
}