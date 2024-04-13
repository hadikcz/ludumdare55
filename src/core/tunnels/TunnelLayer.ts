import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class TunnelLayer {

    private tunnels: boolean[][] = [];
    private rt: Phaser.GameObjects.RenderTexture;
    private circle: Phaser.GameObjects.Graphics;

    constructor (
        private readonly scene: GameScene
    ) {
        this.rt = this.scene.add.renderTexture(0, 0, 1000, 1000)
            .setOrigin(0, 0);

        this.rt.setDepth(Depths.TUNNEL);

        this.circle = this.scene.make.graphics({ x: 0, y: 0 }).fillStyle(0x000000, 1).fillCircle(0, 0, 10);
        this.rt.clear();

        // this.initTunnels();
    }

    addTunnelSection (x: number, y: number): void {
        x = Math.floor(x);
        y = Math.floor(y);

        if (this.tunnels[x] === undefined) {
            this.tunnels[x] = [];
        }

        this.tunnels[x][y] = true;
        this.rt.draw(this.circle, x, y);
    }

    isInTheTunnel (x: number, y: number, angle: number = 0, distance: number = 25, circleDetectionSize: number = 8): boolean {
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

    private initTunnels (): void {
        for (let i = 0; i < this.scene.physics.world.bounds.width; i++) {
            this.tunnels[i] = [];
            for (let j = 0; j < this.scene.physics.world.bounds.height; j++) {
                this.tunnels[i][j] = false;
            }
        }
    }
}
