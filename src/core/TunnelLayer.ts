import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class TunnelLayer {

    private tunnels: boolean[][] = [];
    private rt: Phaser.GameObjects.RenderTexture;
    private circle10: Phaser.GameObjects.Graphics;
    private circle6: Phaser.GameObjects.Graphics;

    constructor (
        private readonly scene: GameScene,
        private readonly width: number,
        private readonly height: number
    ) {
        this.rt = this.scene.add.renderTexture(0, 0, width, height)
        // this.rt = this.scene.add.renderTexture(0, 0, 1000, 1000)
            .setOrigin(0, 0);

        this.rt.setDepth(Depths.TUNNEL);

        this.circle10 = this.scene.make.graphics({ x: 0, y: 0 }).fillStyle(0x000000, 1).fillCircle(0, 0, 10);
        this.circle6 = this.scene.make.graphics({ x: 0, y: 0 }).fillStyle(0x000000, 1).fillCircle(0, 0, 6);
        this.rt.clear();

        // this.initTunnels();
    }

    addTunnelSection (x: number, y: number, circleSize: CircleSize = CircleSize.TEN): void {
        x = Math.floor(x);
        y = Math.floor(y);

        if (this.tunnels[x] === undefined) {
            this.tunnels[x] = [];
        }

        this.tunnels[x][y] = true;

        let circle;
        if (circleSize === CircleSize.TEN) {
            circle = this.circle10;
        } else {
            circle = this.circle6;
        }
        this.rt.draw(circle, x, y);
    }

    addRect (x: number, y: number, width: number, height: number): void {
        this.rt.fill(
            0x000000,
            1,
            x,
            y,
            width,
            height
        );

        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                if (this.tunnels[i] === undefined) {
                    this.tunnels[i] = [];
                }
                this.tunnels[i][j] = true;
            }
        }
    }

    addCircle (x: number, y: number, radius: number): void {
        const circle = this.scene.make.graphics({ x: 0, y: 0 }).fillStyle(0x000000, 1).fillCircle(0, 0, radius);
        this.rt.draw(circle, x, y);

        this.fillCircleCoords(x, y, radius);

        circle.destroy();
    }

    didItCollideWithDirt (x: number, y: number): boolean {
        return !this.isInTheTunnel(x, y, 0, 0, 8);
    }

    isInTheTunnel (x: number, y: number, angle: number = 0, distance: number = 15, circleDetectionSize: number = 8): boolean {
        try {
            x = Math.floor(x);
            y = Math.floor(y);

            // pixel infront of tank
            const x1 = Math.floor(x + distance * Math.cos(angle));
            const y1 = Math.floor(y + distance * Math.sin(angle));

            // check all coordinates around point in 16px radius
            for (let i = -circleDetectionSize/2; i < circleDetectionSize/2; i++) {
                for (let j = -circleDetectionSize/2; j < circleDetectionSize/2; j++) {
                    // check undefined
                    if (this.tunnels[x1 + i] === undefined || this.tunnels[x1 + i][y1 + j] === undefined) {
                        continue;
                    }
                    if (this.tunnels[x1 + i][y1 + j]) {
                        return true;
                    }
                }
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    private fillCircleCoords (x: number, y: number, radius: number): void {
        for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
                // Calculate the distance between the current point (i, j) and the center (x, y)
                const distance = Math.sqrt(Math.pow(i - x, 2) + Math.pow(j - y, 2));

                // If the distance is less than or equal to the radius, consider it within the circle
                if (distance <= radius) {
                    if (this.tunnels[i] === undefined) {
                        this.tunnels[i] = [];
                    }
                    this.tunnels[i][j] = true;
                }
            }
        }
    }
}

export enum CircleSize {
    TEN,
    SIX
}
