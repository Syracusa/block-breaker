// ./game/scenes/LevelSelect.js

export default class LevelSelect extends Phaser.Scene {
    constructor() {
        super('LevelSelect');

        // --- 설정 값 ---
        this.TOTAL_LEVELS = 64;
        this.LEVELS_PER_PAGE = 16;
        // ----------------

        this.currentPage = 1;
        this.totalPages = Math.ceil(this.TOTAL_LEVELS / this.LEVELS_PER_PAGE);
    }

    create() {
        this.cameras.main.setBackgroundColor('#333');

        // 씬 제목
        this.add.text(this.cameras.main.width / 2, 60, 'Select a Level', {
            fontSize: '48px',
            fill: '#fff'
        }).setOrigin(0.5);

        // 페이지 번호 표시
        this.pageText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 60, `Page ${this.currentPage} / ${this.totalPages}`, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        // 레벨 버튼을 담을 그룹 생성
        this.levelButtons = this.add.group();

        // 페이지네이션 버튼 (이전/다음)
        this.prevButton = this.createNavButton(this.cameras.main.width / 2 - 150, this.cameras.main.height - 60, '< Prev', -1);
        this.nextButton = this.createNavButton(this.cameras.main.width / 2 + 150, this.cameras.main.height - 60, 'Next >', 1);

        // 현재 페이지의 레벨 버튼들 그리기
        this.drawLevelButtons();
        this.updateNavButtons();
    }

    /**
     * 현재 페이지에 맞는 레벨 버튼들을 생성하고 화면에 표시합니다.
     */
    drawLevelButtons() {
        // 기존 버튼들 모두 삭제
        this.levelButtons.clear(true, true);

        const startLevel = (this.currentPage - 1) * this.LEVELS_PER_PAGE + 1;
        const endLevel = this.currentPage * this.LEVELS_PER_PAGE;

        // 4x4 그리드 레이아웃 설정
        const columns = 4;
        const buttonSize = 80;
        const padding = 20;
        const offsetX = (this.cameras.main.width - (columns * buttonSize + (columns - 1) * padding)) / 2;
        const offsetY = 150;

        for (let i = 0; i < this.LEVELS_PER_PAGE; i++) {
            const level = startLevel + i;
            if (level > this.TOTAL_LEVELS) break;

            const col = i % columns;
            const row = Math.floor(i / columns);

            const x = offsetX + col * (buttonSize + padding) + buttonSize / 2;
            const y = offsetY + row * (buttonSize + padding) + buttonSize / 2;

            const button = this.add.text(x, y, level.toString(), {
                fontSize: '32px',
                fill: '#fff',
                backgroundColor: '#555',
                align: 'center',
                fixedWidth: buttonSize,
                fixedHeight: buttonSize,
                padding: { top: 15 }
            }).setOrigin(0.5).setInteractive();

            button.on('pointerover', () => button.setBackgroundColor('#777'));
            button.on('pointerout', () => button.setBackgroundColor('#555'));
            button.on('pointerdown', () => {
                this.scene.start('Game', { level: level });
            });

            this.levelButtons.add(button);
        }
    }

    /**
     * 페이지 이동 버튼을 생성합니다.
     * @param {number} x - 버튼의 x 좌표
     * @param {number} y - 버튼의 y 좌표
     * @param {string} text - 버튼에 표시될 텍스트
     * @param {number} pageChange - 페이지 변경 값 (-1 또는 1)
     * @returns {Phaser.GameObjects.Text} 생성된 버튼 객체
     */
    createNavButton(x, y, text, pageChange) {
        const button = this.add.text(x, y, text, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5).setInteractive();

        button.on('pointerdown', () => {
            this.currentPage += pageChange;
            this.drawLevelButtons();
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