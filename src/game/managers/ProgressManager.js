// ./game/utils/progressManager.js

const SAVE_KEY = 'myGameProgress'; // localStorage에 저장될 때 사용될 키
const TOTAL_LEVELS = 64; // 게임의 전체 레벨 수

export const progressManager = {
    /**
     * 현재 해금된 가장 높은 레벨 번호를 반환합니다.
     * @returns {number} 해금된 가장 높은 레벨. 저장된 값이 없으면 1을 반환.
     */
    getUnlockedLevel() {
        const savedData = localStorage.getItem(SAVE_KEY);
        // 저장된 데이터가 없으면 1번 레벨만 해금된 상태로 시작합니다.
        return savedData ? parseInt(savedData, 10) : 1;
    },

    /**
     * 새로운 레벨을 해금 상태로 저장합니다.
     * @param {number} newUnlockedLevel - 새로 해금된 레벨 번호
     */
    saveProgress(newUnlockedLevel) {
        // 만약 새로 해금된 레벨이 전체 레벨 수보다 크면, 마지막 레벨 번호 + 1로 고정합니다.
        if (newUnlockedLevel > TOTAL_LEVELS) {
            newUnlockedLevel = TOTAL_LEVELS + 1;
        }

        const currentUnlocked = this.getUnlockedLevel();
        // 현재 저장된 값보다 더 높은 레벨일 경우에만 저장합니다.
        if (newUnlockedLevel > currentUnlocked) {
            localStorage.setItem(SAVE_KEY, newUnlockedLevel.toString());
            console.log(`Progress saved! Unlocked up to level ${newUnlockedLevel}`);
        }
    },

    // 테스트용으로 진행 상황을 리셋하는 함수
    resetProgress() {
        console.log('Progress reset!');
        localStorage.removeItem(SAVE_KEY);
    }
};