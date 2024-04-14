import { SpawnerLevel } from 'core/spawners/SummoningSpawner';
import Bullet from 'entities/Bullet';
import Enemy from 'entities/enemies/Enemy';
import Player from 'entities/player/Player';
import Stat from 'entities/playerStats/Stat';
import UpgradeItem, { UpgradeItemEnum } from 'entities/UpgradeItem';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class SummoningRock extends Phaser.GameObjects.Container {

    private static readonly SPAWN_DISTANCE = 350;
    private readonly sprite: Phaser.GameObjects.Image;
    private isActive = false;

    private hp: Stat;
    private textHp: Phaser.GameObjects.Text;
    private enemies: Enemy[] = [];
    private timer: Phaser.Time.TimerEvent;
    private isDying: boolean = false;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private readonly player: Player,
        private readonly itemDrop: UpgradeItemEnum,
        private readonly rockLevel: SpawnerLevel,
        private readonly maxEnemies: number = 1,
        private readonly initHp = 100,
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.sprite = this.scene.add.image(0, 0, 'assets', 'assets/spawner');
        // this.sprite.setScale(.3);
        this.add(this.sprite);

        this.setDepth(Depths.SPAWNER);

        this.timer =this.scene.time.addEvent({
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
        this.textHp.setVisible(false);
        this.add(this.textHp);
    }

    preUpdate (): void {
        const distanceToPlayer = this.getDistanceToPlayer();
        this.isActive = distanceToPlayer < SummoningRock.SPAWN_DISTANCE;
    }

    getHp (): Stat {
        return this.hp;
    }

    applyDamage (damage: number): void {
        this.hp.burn(damage);

        this.textHp.setText(this.hp.getPercents().toString() + '%');
        if (this.hp.getValue() <= 0) {
            this.die();
        }
    }

    private tick (): void {
        if (!this.isActive) {
            return;
        }

        if (this.enemies.length < this.maxEnemies) {
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
                SummoningRock.SPAWN_DISTANCE
            )
        );

        enemy.on('destroy', () => {
            const pos = this.enemies.indexOf(enemy);
            if (pos !== -1) {
                this.enemies.splice(pos, 1);
            }
        });
        this.scene.spawnerManager.spawners.add(enemy);
        this.enemies.push(enemy);
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
        if (this.isDying) {
            return;
        }
        this.isDying = true;
        const count = Phaser.Math.Between(10, 20);
        for (let i = 0; i < count; i++) {
            const bullet = new Bullet(
                this.scene,
                this.x,
                this.y,
                Phaser.Math.RND.angle(),
                10,
                false,
                this.scene.tunnelLayer,
                1
            );
            this.scene.worldEnv.bullets.add(bullet);
        }

        this.textHp.setVisible(false);
        this.scene.add.tween({
            targets: this,
            alpha: 0,
            duration: 3000,
            onComplete: () => {
                this.spawnUpgradeItem();

                this.timer.destroy();
                this.destroy();
            }
        });
    }

    private spawnUpgradeItem (): void {
        const item = new UpgradeItem(this.scene, this.x, this.y, this.itemDrop, this.rockLevel);
        this.scene.upgradeItemsGroup.add(item);
    }

}
