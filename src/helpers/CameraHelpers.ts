import Phaser, { Scene } from 'phaser';

export default class CameraHelpers {
    /**
     * @param {number} defaultWidth
     * @param {number} defaultHeight
     * @returns {number}
     */
    static calcBaseZoom (defaultWidth: number, defaultHeight: number): number {
        let baseWidth = defaultWidth;
        let baseHeight = defaultHeight;

        let diffWidth = window.innerWidth / baseWidth;
        let diffHeight = window.innerHeight / baseHeight;

        return (diffWidth + diffHeight) / 2;
    }

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    static isNearCamera (scene: Phaser.Scene, x: number, y: number): boolean {
        let cameraPoint = scene.cameras.main.midPoint;
        return Phaser.Math.Distance.Between(cameraPoint.x, cameraPoint.y, x, y) <= scene.cameras.main.displayHeight;
    }

    static insideOfCamera (scene: Scene, x: number, y: number, xOffset: number = 0, yOffset: number = 0): boolean {
        let camera = scene.cameras.main;
        return (camera.worldView.x - xOffset <= x && camera.worldView.x + camera.worldView.width + xOffset >= x && camera.worldView.y - yOffset <= y && camera.worldView.y + yOffset + camera.worldView.height >= y);
    }

}
