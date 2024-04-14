import Bullet from 'entities/Bullet';
import Enemy from 'entities/enemies/Enemy';
import Player from 'entities/player/Player';
import Stat from 'entities/playerStats/Stat';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Spawner extends Phaser.GameObjects.Container {

    private static readonly SPAWN_DISTANCE = 350;
    private readonly sprite: Phaser.GameObjects.Image;
    private isActive = false;
    private readonly enemies: Phaser.GameObjects.Group;

    private hp: Stat;
    private textHp: Phaser.GameObjects.Text;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private readonly player: Player,
        private readonly maxEnemies: number = 1,
        private readonly initHp = 100
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

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

        this.hp = new Stat(this.scene, this.initHp);

        const textStyle = {
            fontSize: '20px',
            fill: '#fff',
            stroke: '#ff0000',
            strokeThickness: 2,
            align: 'center'
        };
        this.textHp = this.scene.add.text(0, 0, this.hp.getPercents().toString() + '%', textStyle);
        this.add(this.textHp);
    }

    preUpdate (): void {
        const distanceToPlayer = this.getDistanceToPlayer();
        this.isActive = distanceToPlayer < Spawner.SPAWN_DISTANCE;
    }

    getHp (): Stat {
        return this.hp;
    }

    applyDamage (damage: number): void {
        this.hp.burn(damage);

        this.textHp.setText(this.hp.getPercents().toString() + '%' );

        if (this.hp.getValue() <= 0) {
            this.die();
        }
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

    private die (): void {
        const count = Phaser.Math.Between(20, 40);
        for (let i = 0; i < count; i++) {
            const bullet = new Bullet(
                this.scene,
                this.x,
                this.y,
                Phaser.Math.Between(0, Math.PI * 2),
                10,
                false,
                this.scene.tunnelLayer,
                1
            );
            this.scene.worldEnv.bullets.add(bullet);
        }

        this.scene.add.tween({
            targets: this,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
    }

}
