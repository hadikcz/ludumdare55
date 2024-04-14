import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

const CHUNK_SIZE = 1280 * 2; // 2 times the game window size

export default class TunnelLayer {

    private tunnels: boolean[][] = [];
    private circle10: Phaser.GameObjects.Graphics;
    private circle6: Phaser.GameObjects.Graphics;
    private rtChunks: Phaser.GameObjects.RenderTexture[] = [];

    constructor (
        private readonly scene: GameScene,
        private readonly width: number,
        private readonly height: number
    ) {
        // this.rt = this.scene.add.renderTexture(0, 0, width, height)
        // // this.rt = this.scene.add.renderTexture(0, 0, 1000, 1000)
        //     .setOrigin(0, 0);
        //
        // this.rt.setDepth(Depths.TUNNEL);

        this.circle10 = this.scene.make.graphics({ x: 0, y: 0 }).fillStyle(0x000000, 1).fillCircle(0, 0, 10);
        this.circle6 = this.scene.make.graphics({ x: 0, y: 0 }).fillStyle(0x000000, 1).fillCircle(0, 0, 6);
        // this.rt.clear();

        this.initChunks();
    }

    private initChunks (): void {
        // Initialize render texture chunks
        for (let x = 0; x < Math.ceil(this.width / CHUNK_SIZE); x++) {
            for (let y = 0; y < Math.ceil(this.height / CHUNK_SIZE); y++) {
                const rtChunk = this.scene.add.renderTexture(x * CHUNK_SIZE, y * CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE)
                    .setOrigin(0, 0)
                    .setDepth(Depths.TUNNEL);
                // fil chunk with random color
                // rtChunk.fill(0x000000, 1);
                rtChunk.fill(Math.floor(Math.random() * 0xFFFFFF));
                this.rtChunks.push(rtChunk);
            }
        }
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

        let [chunkIndexX, chunkIndexY, chunkIndex] = this.getChunkIndex(x, y);
        this.rtChunks[chunkIndex].draw(circle, x - chunkIndexX * CHUNK_SIZE, y - chunkIndexY * CHUNK_SIZE);
    }

    addRect (x: number, y: number, width: number, height: number): void {
        const chunkSize = CHUNK_SIZE;

        // Calculate the range of chunks affected by the rectangle
        const startX = Math.floor(x / chunkSize);
        const endX = Math.floor((x + width) / chunkSize);
        const startY = Math.floor(y / chunkSize);
        const endY = Math.floor((y + height) / chunkSize);

        // Iterate over the affected chunks and draw the rectangle
        for (let chunkX = startX; chunkX <= endX; chunkX++) {
            for (let chunkY = startY; chunkY <= endY; chunkY++) {
                // Determine the coordinates of the rectangle relative to the current chunk
                const localX = Math.max(0, x - chunkX * chunkSize);
                const localY = Math.max(0, y - chunkY * chunkSize);
                const localWidth = Math.min(chunkSize - localX, width);
                const localHeight = Math.min(chunkSize - localY, height);

                // Draw the rectangle on the corresponding render texture chunk
                let [chunkIndexX, chunkIndexY, chunkIndex] = this.getChunkIndex(x, y);
                this.rtChunks[chunkIndex].fill(
                    0x000000,
                    1,
                    localX,
                    localY,
                    localWidth,
                    localHeight
                );

                // Update the tunnel data for the affected area
                for (let i = localX; i < localX + localWidth; i++) {
                    for (let j = localY; j < localY + localHeight; j++) {
                        if (this.tunnels[i + chunkX * chunkSize] === undefined) {
                            this.tunnels[i + chunkX * chunkSize] = [];
                        }
                        this.tunnels[i + chunkX * chunkSize][j + chunkY * chunkSize] = true;
                    }
                }
            }
        }
    }


    addCircle (x: number, y: number, radius: number): void {
        const circle = this.scene.make.graphics({ x: 0, y: 0 }).fillStyle(0x000000, 1).fillCircle(0, 0, radius);
        let [chunkIndexX, chunkIndexY, chunkIndex] = this.getChunkIndex(x, y);
        this.rtChunks[chunkIndex].draw(circle, x - chunkIndexX * CHUNK_SIZE, y - chunkIndexY * CHUNK_SIZE);

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

    private getChunkIndex (x: number, y: number): [number, number, number] {
        const chunkIndexX = Math.floor(x / CHUNK_SIZE);
        const chunkIndexY = Math.floor(y / CHUNK_SIZE);
        return [
            chunkIndexX,
            chunkIndexY,
            chunkIndexX * Math.ceil(this.height / CHUNK_SIZE) + chunkIndexY
        ];
    }
}

export enum CircleSize {
    TEN,
    SIX
}
