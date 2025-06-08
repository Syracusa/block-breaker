// ./game/data/levelDesigns.js
import { ITEM_TYPES } from './itemTypes.js';


const level1 = [
    [0, 1, { type: 2, item: ITEM_TYPES.PADDLE_WIDER }, 1, { type: 2, item: ITEM_TYPES.BALL_FASTER }, 1, 0],
    [1, 2, 1, { type: 1, item: ITEM_TYPES.EXTRA_SCORE }, 1, 2, 1],
    [1, 1, 2, 1, 2, 1, 1],
    [0, 1, 1, 2, 1, 1, 0],
];

const level2 = [
    [0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3],
    [1, 1, 2, 2, 2, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 3, 3, 3],
    [0, 1, 1, 1, 1, 1, 0, 3, 3, 3],
    [0, 1, 1, 1, 1, 1, 0, 3, 3, 3],
    [0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3],
    [0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 1, 1, 0, 3, 3, 3],
]; 

const level3 = [
    [0, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [0, 1, 0, 0, 0, 1, 0],
];

// 모든 레벨 디자인을 하나의 배열로 묶어서 export 합니다.
// Game.js에서 이 배열을 import하여 사용하게 됩니다.
export const LEVEL_DESIGNS = [
    level1,
    level2,
    level3,
    // 여기에 64개까지의 레벨 디자인을 계속 추가할 수 있습니다.
    // 간단한 복사/붙여넣기를 위해 level1을 몇 개 더 추가해 둡니다.
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
    level1, level2, level3,
];