import NumberHelpers from 'helpers/NumberHelpers';
import { Rect } from 'types/Rect';
import { Vec2 } from 'types/Vec2';

export default class TransformHelpers {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} angle
     * @param {number} distance
     * @return {{x: number, y: number}}
     */
    static calcPivot (x: number, y: number, angle: number, distance: number): Vec2 {
        return {
            x: (x + Math.cos(angle) * distance),
            y: (y + Math.sin(angle) * distance)
        } as Vec2;
    }

    static lerp (fromX: number, fromY: number, toX: number, toY: number, lerp: number): Vec2 {
        return {
            x: fromX + lerp * (toX - fromX),
            y: fromY + lerp * (toY - fromY)
        } as Vec2;
    }

    static getDistanceBetween (x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    }

    static randomPointInRectangle (object: Rect): Vec2 {
        return {
            x: NumberHelpers.randomIntInRange(object.x, object.x + object.width),
            y: NumberHelpers.randomIntInRange(object.y, object.y + object.height)
        } as Vec2;
    }

    static randomPoint (x1: number, y1: number, x2: number, y2: number): Vec2 {
        return {
            x: NumberHelpers.randomIntInRange(x1, x2),
            y: NumberHelpers.randomIntInRange(y1, y2)
        } as Vec2;
    }
}
