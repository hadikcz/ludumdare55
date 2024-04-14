import Spawner from 'core/spawners/Spawner';
import Player from 'entities/player/Player';
import GameScene from 'scenes/GameScene';

export default class SpawnerManager {

    private readonly group: Phaser.GameObjects.Group;

    constructor (
      private readonly scene: GameScene,
      private readonly player: Player
    ) {
        this.group = this.scene.add.group();
        this.init();
    }

    private init (): void {
        const x = this.player.x;
        const y = this.player.y;

        const spawner = new Spawner(this.scene, x + 500, y);
        this.group.add(spawner);
    }
}
