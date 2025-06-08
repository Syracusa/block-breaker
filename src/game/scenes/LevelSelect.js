// ./game/scenes/LevelSelect.js

import { progressManager } from '../managers/ProgressManager.js';

export default class LevelSelect extends Phaser.Scene {
    constructor() {
        super('LevelSelect');

        // 이 값들은 progressManager에서 가져와도 좋지만, 일단은 여기에 둡니다.
        this.TOTAL_LEVELS = 64; 
        this.LEVELS_PER_PAGE = 16;
        
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.TOTAL_LEVELS / this.LEVELS_PER_PAGE);
    }

    create() {
        // 1. 저장된 진행 상황을 불러옵니다.
        const highestUnlockedLevel = progressManager.getUnlockedLevel();

        this.cameras.main.setBackgroundColor('#333');

        // 씬 제목
        this.add.text(this.cameras.main.width / 2, 60, 'Select a Level', {
            fontSize: '48px', fill: '#fff', fontStyle: 'bold'
        }).setOrigin(0.5);

        // 페이지 번호 표시용 텍스트 객체
        this.pageText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 60, '', {
            fontSize: '24px', fill: '#fff'
        }).setOrigin(0.5);

        // 레벨 버튼들을 담을 그룹
        this.levelButtons = this.add.group();

        // 페이지 이동 버튼 생성
        this.prevButton = this.createNavButton(this.cameras.main.width / 2 - 150, this.cameras.main.height - 60, '< Prev', -1);
        this.nextButton = this.createNavButton(this.cameras.main.width / 2 + 150, this.cameras.main.height - 60, 'Next >', 1);

        // 2. 불러온 진행 상황을 바탕으로 버튼들을 그립니다.
        this.drawLevelButtons(highestUnlockedLevel);
        this.updateNavButtons();
    }

    /**
     * 현재 페이지에 맞는 레벨 버튼들을 생성하고 화면에 표시합니다.
     * @param {number} highestUnlockedLevel - 해금된 가장 높은 레벨
     */
    drawLevelButtons(highestUnlockedLevel) {
        this.levelButtons.clear(true, true);

        const startLevel = (this.currentPage - 1) * this.LEVELS_PER_PAGE + 1;
        
        // 4x4 그리드 레이아웃 설정
        const columns = 4;
        const buttonSize = 80;
        const padding = 20;
        const offsetX = (this.cameras.main.width - (columns * buttonSize + (columns - 1) * padding)) / 2;
        const offsetY = 150;

        for (let i = 0; i < this.LEVELS_PER_PAGE; i++) {
            const levelNumber = startLevel + i;
            if (levelNumber > this.TOTAL_LEVELS) break;

            // 현재 레벨이 잠겼는지 확인합니다.
            const isLocked = levelNumber > highestUnlockedLevel;

            const col = i % columns;
            const row = Math.floor(i / columns);
            const x = offsetX + col * (buttonSize + padding) + buttonSize / 2;
            const y = offsetY + row * (buttonSize + padding) + buttonSize / 2;

            const buttonText = isLocked ? '🔒' : levelNumber.toString();
            const textColor = isLocked ? '#666' : '#fff';

            const button = this.add.text(x, y, buttonText, {
                fontSize: isLocked ? '48px' : '32px', // 자물쇠 아이콘이 더 잘보이게
                fill: textColor,
                backgroundColor: '#333',
                align: 'center',
                fixedWidth: buttonSize,
                fixedHeight: buttonSize,
                padding: { top: isLocked ? 10 : 15 }
            }).setOrigin(0.5);

            // 잠긴 레벨은 상호작용을 막고, 스타일을 다르게 적용합니다.
            if (isLocked) {
                button.setAlpha(0.6);
            } else {
                button.setInteractive();
                button.setBackgroundColor('#555');
                button.on('pointerover', () => button.setBackgroundColor('#777'));
                button.on('pointerout', () => button.setBackgroundColor('#555'));
                button.on('pointerdown', () => {
                    this.scene.start('Game', { level: levelNumber });
                });
            }
            this.levelButtons.add(button);
        }
    }

    /**
     * 페이지 이동 버튼을 생성합니다.
     */
    createNavButton(x, y, text, pageChange) {
        const button = this.add.text(x, y, text, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive();

        button.on('pointerover', () => button.setStyle({ fill: '#0f0' }));
        button.on('pointerout', () => button.setStyle({ fill: '#fff' }));
        button.on('pointerdown', () => {
            this.currentPage += pageChange;
            // 페이지를 넘길 때도, 저장된 진행 상황을 다시 읽어서 버튼을 그려야 합니다.
            const highestUnlockedLevel = progressManager.getUnlockedLevel();
            this.drawLevelButtons(highestUnlockedLevel);

            this.updateNavButtons();
        });
        return button;
    }

    /**
     * 현재 페이지에 따라 이전/다음 버튼의 활성화 상태를 업데이트합니다.
     */
    updateNavButtons() {
        this.prevButton.setVisible(this.currentPage > 1);
        this.nextButton.setVisible(this.currentPage < this.totalPages);
        this.pageText.setText(`Page ${this.currentPage} / ${this.totalPages}`);
    }
}