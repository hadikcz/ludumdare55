export enum SpawnerLevel {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4
}


export class SpawnerGenerator {
    private padding: number;
    private minDistance: number;
    private noGoZoneRadius: number;
    private bounds: Phaser.Types.Physics.Arcade.ArcadeWorldConfig;
    private width: number;
    private height: number;
    private centerX: number;
    private centerY: number;

    constructor (padding: number, minDistance: number, noGoZoneRadius: number, bounds: Phaser.Types.Physics.Arcade.ArcadeWorldConfig) {
        this.padding = padding;
        this.minDistance = minDistance;
        this.noGoZoneRadius = noGoZoneRadius;
        this.bounds = bounds;
        if (bounds.width === undefined || bounds.height === undefined) {
            throw new Error('Bounds must have width and height');
        }
        this.width = bounds.width;
        this.height = bounds.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    private isTooClose (x: number, y: number, existingPoints: Phaser.Geom.Point[]): boolean {
        for (const point of existingPoints) {
            const distance = Phaser.Math.Distance.Between(x, y, point.x, point.y);
            if (distance < this.minDistance) {
                return true;
            }
        }
        return false;
    }

    private isInNoGoZone (x: number, y: number): boolean {
        const distanceToCenter = Phaser.Math.Distance.Between(x, y, this.centerX, this.centerY);
        return distanceToCenter < this.noGoZoneRadius;
    }

    public spawnAroundBorder (spawnBorder: number, level: SpawnerLevel, spawnCallback: (x: number, y: number, level: SpawnerLevel) => void): void {
        const topAndBottomPoints: Phaser.Geom.Point[] = [];
        const leftAndRightPoints: Phaser.Geom.Point[] = [];

        // Calculate how many spawners per side (top/bottom and left/right)
        const spawnersPerSide = Math.floor(spawnBorder / 4); // Divide by 4 because we have 4 sides

        // Top and bottom edges
        for (let i = 0; i < spawnersPerSide; i++) {
            let x;
            do {
                x = Phaser.Math.Between(this.padding, this.width - this.padding);
            } while (this.isTooClose(x, this.padding, topAndBottomPoints));

            topAndBottomPoints.push(new Phaser.Geom.Point(x, this.padding));
            spawnCallback(x, this.padding, level);

            let y;
            do {
                y = Phaser.Math.Between(this.padding, this.height - this.padding);
            } while (this.isTooClose(x, y, topAndBottomPoints));

            topAndBottomPoints.push(new Phaser.Geom.Point(x, this.height - this.padding));
            spawnCallback(x, this.height - this.padding, level);
        }

        // Left and right edges (excluding corners to avoid duplicates)
        for (let i = 0; i < spawnersPerSide; i++) {
            let y;
            do {
                y = Phaser.Math.Between(this.padding, this.height - this.padding);
            } while (this.isTooClose(this.padding, y, leftAndRightPoints));

            leftAndRightPoints.push(new Phaser.Geom.Point(this.padding, y));
            spawnCallback(this.padding, y, level);

            let x;
            do {
                x = Phaser.Math.Between(this.padding, this.width - this.padding);
            } while (this.isTooClose(x, y, leftAndRightPoints));

            leftAndRightPoints.push(new Phaser.Geom.Point(this.width - this.padding, y));
            spawnCallback(this.width - this.padding, y, level);
        }
    }

    public spawnInsideMap (totalCount: number, spawnCallback: (x: number, y: number, level: SpawnerLevel) => void): void {
        const insideMapPoints: Phaser.Geom.Point[] = [];

        for (let i = 0; i < totalCount; i++) {
            let x, y;
            do {
                x = Phaser.Math.Between(this.padding, this.width - this.padding);
                y = Phaser.Math.Between(this.padding, this.height - this.padding);
            } while (this.isTooClose(x, y, insideMapPoints) || this.isInNoGoZone(x, y));

            insideMapPoints.push(new Phaser.Geom.Point(x, y));
            const level = this.getLevelByDistance(x, y);
            spawnCallback(x, y, level);
        }
    }

    private getLevelByDistance (x, y): SpawnerLevel {
        if (this.bounds.width === undefined || this.bounds.height === undefined) {
            throw new Error('Bounds must have width and height');
        }
        const distance = Phaser.Math.Distance.Between(x, y, this.bounds.width / 2, this.bounds.height / 2);
        if (distance < 2500) {
            return SpawnerLevel.FIRST;
        }
        if (distance < 4500) {
            return SpawnerLevel.SECOND;
        }
        if (distance < 6500) {
            return SpawnerLevel.THIRD;
        }
        return SpawnerLevel.FOURTH;

    }
}
