// ./game/managers/UIManager.js

import { Scene } from 'phaser';

export class UIManager {
    /** @type {Scene} */
    scene;
    /** @type {Phaser.GameObjects.Text} */
    scoreText;

    /**
     * @param {Scene} scene - UI를 추가할 씬 객체
     */
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
    }

    /**
     * 점수 텍스트 UI를 생성합니다.
     * @param {number} initialScore - 초기 점수
     */
    createScoreText(initialScore) {
        this.scoreText = this.scene.add.text(16, 16, `Score: ${initialScore}`, { 
            fontSize: '32px', fill: '#FFF', fontStyle: 'bold'
        });
    }

    /**
     * 점수 텍스트를 업데이트합니다.
     * @param {number} score - 새로운 점수
     */
    updateScore(score) {
        this.scoreText.setText('Score: ' + score);
    }

    /**
     * 레벨 클리어 또는 게임오버 UI를 화면에 표시합니다.
     * @param {boolean} isLevelClear - 레벨 클리어 여부
     */
    showEndLevelUI(isLevelClear) {
        const sceneWidth = this.scene.sys.game.config.width;
        const sceneHeight = this.scene.sys.game.config.height;

        // 반투명 검은색 배경 추가
        const overlay = this.scene.add.rectangle(0, 0, sceneWidth, sceneHeight, 0x000000, 0.7).setOrigin(0);
        
        // 메시지 텍스트
        const titleText = isLevelClear ? 'Level Clear!' : 'Game Over';
        this.scene.add.text(sceneWidth / 2, 200, titleText, {
            fontSize: '64px', fill: '#fff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // --- 버튼 생성을 위한 헬퍼 함수 ---
        const createButton = (text, y, onClick) => {
            const button = this.scene.add.text(sceneWidth / 2, y, text, {
                fontSize: '32px', fill: '#0f0', backgroundColor: '#333', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            button.on('pointerover', () => button.setStyle({ fill: '#fff' }));
            button.on('pointerout', () => button.setStyle({ fill: '#0f0' }));
            button.on('pointerdown', onClick);
        };

        if (isLevelClear) {
            createButton('Next Level', 350, () => {
                // Game 씬의 selectedLevel에 접근해야 하므로 this.scene을 사용
                this.scene.scene.start('Game', { level: this.scene.selectedLevel + 1 });
            });
            createButton('Main Menu', 420, () => {
                this.scene.scene.start('MainMenu');
            });
        } else { // 게임오버
            createButton('Retry', 350, () => {
                this.scene.scene.restart();
            });
            createButton('Main Menu', 420, () => {
                this.scene.scene.start('MainMenu');
            });
        }
    }
}