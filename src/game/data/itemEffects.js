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

// 멀티볼 효과 함수
const applyMultiBall = (scene) => {
    // 현재 활성화된 모든 공들을 복사할 원본으로 사용합니다.
    const currentBalls = scene.balls.slice(); // .slice()로 배열을 복사하여 안전하게 순회

    currentBalls.forEach(ballObject => {
        // 기존 공 1개당 새로운 공 1개를 추가로 생성합니다. (너무 많으면 어려우니 1개씩만)
        const newBall = new Ball(scene);
        const parentSprite = ballObject.sprite;

        // 새 공의 위치를 원본 공의 위치와 똑같이 설정
        newBall.sprite.setPosition(parentSprite.x, parentSprite.y);

        // 새 공의 속도를 원본 공의 속도와 비슷하지만 약간 다른 각도로 설정
        const speed = parentSprite.body.velocity.length();
        const angleOffset = Phaser.Math.DegToRad(30); // 30도 각도로 틀어줌
        const newAngle = parentSprite.body.velocity.angle() + angleOffset;

        const velocity = scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(newAngle), speed);
        newBall.sprite.setVelocity(velocity.x, velocity.y);

        // 생성된 새 Ball 객체를 Game 씬의 balls 배열에 추가
        scene.balls.push(newBall);

        // ★★★ 가장 중요한 부분 ★★★
        // 새로 생성된 공(newBall.sprite)에 대해서도 똑같은 충돌 규칙을 설정해줍니다.
        scene._addCollidersForBall(newBall.sprite);
    });
};

// 아이템 타입을 효과 함수에 매핑하여 export합니다.
export const ITEM_EFFECTS = {
    [ITEM_TYPES.PADDLE_WIDER]: applyPaddleWider,
    [ITEM_TYPES.BALL_FASTER]: applyBallFaster,
    [ITEM_TYPES.EXTRA_SCORE]: applyExtraScore,
    [ITEM_TYPES.MULTI_BALL]: applyMultiBall // ◀️ 멀티볼 효과 매핑 추가

};