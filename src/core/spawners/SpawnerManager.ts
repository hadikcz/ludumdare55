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
}
