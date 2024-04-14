import Spawner from 'core/spawners/Spawner';
import { SpawnerGenerator, SpawnerLevel } from 'core/spawners/SpawnerGenerator';
import Player from 'entities/player/Player';
import { UpgradeItemEnum } from 'entities/UpgradeItem';
import ArrayHelpers from 'helpers/ArrayHelpers';
import GameScene from 'scenes/GameScene';

export default class SpawnerManager {

    public readonly spawners: Phaser.GameObjects.Group;
    private readonly enemies: Phaser.GameObjects.Group;

    constructor (
      private readonly scene: GameScene,
      private readonly player: Player
    ) {
        this.spawners = this.scene.add.group();
        this.enemies = this.scene.add.group();
        // this.init();

        this.spawnAll();
    }

    private init (): void {
        const x = this.player.x;
        const y = this.player.y;

        this.spawn(x + 250, y, SpawnerLevel.FIRST);
    }

    private spawn (x, y, level: SpawnerLevel): void {
        // random from UpgradeItemEnum
        const item = ArrayHelpers.randomEnum<UpgradeItemEnum>(UpgradeItemEnum);

        const spawner = new Spawner(
            this.scene,
            x,
            y,
            this.player,
            item,
            level
        );
        this.spawners.add(spawner);

        this.scene.tunnelLayer.addCircle(x, y, 160);
    }

    private spawnAll (): void {
        const generator = new SpawnerGenerator(
            300,
            200,
            600,
            this.scene.physics.world.bounds
        );

        const spawnCallback = (x: number, y: number, level: SpawnerLevel) => {
            this.spawn(x, y, level);
            console.log(`Spawned object at (${x}, ${y}) with level ${level}`);
        };

        // Call spawnAroundBorder method
        generator.spawnAroundBorder(30, SpawnerLevel.FOURTH, spawnCallback);

        // Call spawnInsideMap method
        generator.spawnInsideMap(35, spawnCallback);

        // const count = 35;
        // for (let i = 0; i < count; i++) {
        //     const x = Phaser.Math.Between(0, this.scene.physics.world.bounds.width);
        //     const y = Phaser.Math.Between(0, this.scene.physics.world.bounds.height);
        //     const level = this.getLevelByDistance(x, y);
        //
        //     this.spawn(x, y, level);
        // }

        // this.spawnBorder();
        // // spawn around border of map 20 of them, and padding like 300 from border
        // const spawnBorder = 30;
        // const padding = 300;
        // const bounds = this.scene.physics.world.bounds;
        // const width = bounds.width;
        // const height = bounds.height;
        //
        // // Top and bottom edges
        // for (let i = 0; i < spawnBorder / 2; i++) {
        //     const x = Phaser.Math.Between(padding, width - padding);
        //     const yTop = padding;
        //     const yBottom = height - padding;
        //
        //     this.spawn(x, yTop, this.getLevelByDistance(x, yTop));
        //     this.spawn(x, yBottom, this.getLevelByDistance(x, yBottom));
        // }
        //
        // // Left and right edges (excluding corners to avoid duplicates)
        // for (let i = 0; i < spawnBorder / 2; i++) {
        //     const y = Phaser.Math.Between(padding, height - padding);
        //     const xLeft = padding;
        //     const xRight = width - padding;
        //
        //     this.spawn(xLeft, y, this.getLevelByDistance(xLeft, y));
        //     this.spawn(xRight, y, this.getLevelByDistance(xRight, y));
        // }

    }



    private getLevelByDistance (x, y): SpawnerLevel {
        const distance = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
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
