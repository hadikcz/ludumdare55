import Spawner from 'core/spawners/Spawner';
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
        this.init();
    }

    private init (): void {
        const x = this.player.x;
        const y = this.player.y;

        this.spawn(x + 250, y);
    }

    private spawn (x, y): void {
        // random from UpgradeItemEnum
        const item = ArrayHelpers.randomEnum<UpgradeItemEnum>(UpgradeItemEnum);

        const spawner = new Spawner(
            this.scene,
            x,
            y,
            this.player,
            item
        );
        this.spawners.add(spawner);

        this.scene.tunnelLayer.addCircle(x, y, 160);
    }
}
