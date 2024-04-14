import Spawner from 'core/spawners/Spawner';
import Player from 'entities/player/Player';
import GameScene from 'scenes/GameScene';

export default class SpawnerManager {

    public readonly group: Phaser.GameObjects.Group;

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

        this.spawn(x + 250, y);
    }

    private spawn (x, y): void {
        const spawner = new Spawner(
            this.scene,
            x,
            y,
            this.player
        );
        this.group.add(spawner);

        this.scene.tunnelLayer.addCircle(x, y, 160);
    }
}
