import Enemy from 'entities/enemies/Enemy';
import Player from 'entities/player/Player';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Spawner extends Phaser.GameObjects.Container {

    private static readonly SPAWN_DISTANCE = 350;
    private readonly sprite: Phaser.GameObjects.Image;
    private isActive = false;
    private readonly enemies: Phaser.GameObjects.Group;
    private readonly maxEnemies = 5;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private readonly player: Player
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);

        this.sprite = this.scene.add.image(0, 0, 'assets', 'spawner');
        this.sprite.setScale(.3);
        this.add(this.sprite);

        this.enemies = this.scene.add.group();

        this.setDepth(Depths.SPAWNER);

        this.scene.time.addEvent({
            callback: this.tick,
            callbackScope: this,
            loop: true,
            delay: 1000
        });
    }

    preUpdate (): void {
        const distanceToPlayer = this.getDistanceToPlayer();
        this.isActive = distanceToPlayer < Spawner.SPAWN_DISTANCE;
    }

    private tick (): void {
        if (!this.isActive) {
            return;
        }

        if (this.enemies.getLength() < this.maxEnemies) {
            this.spawnEnemy();
        }
    }

    private spawnEnemy (): void {
        const range = 100;
        const x = this.x + Phaser.Math.Between(-range, range);
        const y = this.y + Phaser.Math.Between(-range, range);
        const enemy = this.scene.add.existing(
            new Enemy(
                this.scene,
                x,
                y,
                this.player,
                Spawner.SPAWN_DISTANCE
            )
        );
        this.enemies.add(enemy);
    }

    private getDistanceToPlayer (): number {
        return Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );
    }

}
