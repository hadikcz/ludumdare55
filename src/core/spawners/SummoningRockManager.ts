import SummoningRock from 'core/spawners/SummoningRock';
import { SpawnerLevel,SummoningSpawner } from 'core/spawners/SummoningSpawner';
import Player from 'entities/player/Player';
import { UpgradeItemEnum } from 'entities/UpgradeItem';
import ArrayHelpers from 'helpers/ArrayHelpers';
import GameScene from 'scenes/GameScene';

export default class SummoningRockManager {

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

        const rockHp = this.getRockHp(level);
        const maxEnemies = this.getMaxEnemies(level);
        const spawner = new SummoningRock(
            this.scene,
            x,
            y,
            this.player,
            item,
            level,
            maxEnemies,
            rockHp,
        );
        this.spawners.add(spawner);

        this.scene.tunnelLayer.addCircle(x, y, 160);
    }

    private spawnAll (): void {
        const generator = new SummoningSpawner(
            300,
            350,
            600,
            this.scene.physics.world.bounds
        );

        const spawnCallback = (x: number, y: number, level: SpawnerLevel) => {
            this.spawn(x, y, level);
            console.log(`Spawned object at (${x}, ${y}) with level ${level} and distance to center ${Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y)}`);
        };

        generator.spawnAroundBorder(30, SpawnerLevel.FOURTH, spawnCallback);

        generator.spawnInsideMap(35, spawnCallback);
    }

    private getRockHp (level: SpawnerLevel): number {
        switch (level) {
            case SpawnerLevel.FIRST:
                return 100;
            case SpawnerLevel.SECOND:
                return 200;
            case SpawnerLevel.THIRD:
                return 300;
            case SpawnerLevel.FOURTH:
                return 400;
            case SpawnerLevel.FIFTH:
                return 750;
        }
        return 1;
    }

    private getMaxEnemies (level: SpawnerLevel): number {
        switch (level) {
            case SpawnerLevel.FIRST:
                return Phaser.Math.RND.integerInRange(1, 2);
            case SpawnerLevel.SECOND:
                return Phaser.Math.RND.integerInRange(2, 4);
            case SpawnerLevel.THIRD:
                return Phaser.Math.RND.integerInRange(4, 6);
            case SpawnerLevel.FOURTH:
                return Phaser.Math.RND.integerInRange(6, 10);
            case SpawnerLevel.FIFTH:
                return Phaser.Math.RND.integerInRange(10, 15);
        }
    }
}
