// ./game/data/itemEffects.js

import { ITEM_TYPES } from './itemTypes.js';
import { Ball } from '../objects/Ball.js'; // Ball 클래스 import

// 각 아이템 타입에 해당하는 효과 함수를 정의합니다.
// 모든 함수는 scene 객체를 인자로 받습니다.
const applyPaddleWider = (scene) => {
    const paddle = scene.paddle.sprite;
    paddle.displayWidth = 150;
    scene.time.delayedCall(3000, () => {
        // 이전에 적용된 효과가 다른 효과로 덮어씌워졌을 수 있으므로,
        // 현재 너비가 150일 때만 원래대로 복구합니다.
        if (paddle.displayWidth === 150) {
            paddle.displayWidth = 100;
        }
    });
};

const applyBallFaster = (scene) => {
    const ball = scene.balls[0].sprite;
    const currentSpeed = ball.body.velocity.length();
    ball.body.velocity.normalize().scale(currentSpeed * 1.5);
};

const applyExtraScore = (scene) => {
    scene.score += 100;
    scene.scoreText.setText('Score: ' + scene.score);
};

const applyMultiBall = (scene) => {
    const currentBalls = scene.balls.getChildren().slice();

    currentBalls.forEach(parentBall => {
        if (!parentBall.active) return;

        for (let i = 0; i < 2; i++) {

            const speed = parentBall.body.velocity.length();
            const angleOffset = Phaser.Math.DegToRad(Phaser.Math.RND.pick([-30, 30])); // 각도를 좀 더 확실하게
            const newAngle = parentBall.body.velocity.angle() + angleOffset;
            const velocity = scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(newAngle), speed);

            // ✅ Game 씬의 헬퍼 함수를 호출하여 공 생성과 설정을 한번에 처리!
            scene._createBall(parentBall.x, parentBall.y, velocity.x, velocity.y);
        }
    });
};

// 아이템 타입을 효과 함수에 매핑하여 export합니다.
export const ITEM_EFFECTS = {
    [ITEM_TYPES.PADDLE_WIDER]: applyPaddleWider,
    [ITEM_TYPES.BALL_FASTER]: applyBallFaster,
    [ITEM_TYPES.EXTRA_SCORE]: applyExtraScore,
    [ITEM_TYPES.MULTI_BALL]: applyMultiBall // ◀️ 멀티볼 효과 매핑 추가

};