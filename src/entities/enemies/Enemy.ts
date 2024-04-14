import { SpawnerLevel } from 'core/spawners/SummoningSpawner';
import Bullet from 'entities/Bullet';
import Player from 'entities/player/Player';
import Stat from 'entities/playerStats/Stat';
import Shooting from 'entities/Shooting';
import { Depths } from 'enums/Depths';
import Phaser from 'phaser';
import GameScene from 'scenes/GameScene';

export default class Enemy extends Phaser.GameObjects.Container {
    private static readonly FOLLOW_DISTANCE = 150;
    private static readonly MOVING_SPEED = 1;

    private sprite: Phaser.GameObjects.Image;
    private shooting: Shooting;
    private initX: number;
    private initY: number;
    private hp: Stat;
    private textHp: Phaser.GameObjects.Text;
    private isDying = false;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private readonly player: Player,
        private readonly spawnDistance: number,
        private readonly initHp = 20,
        private readonly level = SpawnerLevel.FIRST
    ) {
        super(scene, x, y, []);

        this.initX = x;
        this.initY = y;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.sprite = this.scene.add.image(0, 0, 'assets', 'assets/enemy');

        this.add(this.sprite);

        this.setDepth(Depths.ENEMY);

        let fireRate = this.generateFirerate();
        this.shooting = new Shooting(
            this.scene,
            this.scene.worldEnv,
            this.scene.tunnelLayer,
            false,
            fireRate
        );

        this.initHp = this.generateHp(this.level);
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


    preUpdate (time: number, delta: number): void {
        if (this.scene.portalExitSpawner.won) return;
        if (this.hp.getValue() <= 0) {
            // @ts-ignore
            const body: Phaser.Physics.Arcade.Body = this.body;
            if (body) {
                body.setVelocity(0, 0);
            }
            return;
        }

        const distanceToPlayer = this.getDistanceToPlayer();
        if (distanceToPlayer < Enemy.FOLLOW_DISTANCE) {
            this.followPlayer(delta);
        } else {
            this.moveBack(delta);
        }
        if (distanceToPlayer < this.getShootDistance()) {
            let angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            // add some fake recoil into angle
            const recoil = .1;
            angleToPlayer += Phaser.Math.RND.between(-recoil, recoil);
            this.shooting.shoot(this.x, this.y, angleToPlayer, 0);
        }
    }

    applyDamage (damage: number): void {
        this.hp.burn(damage);

        this.textHp.setText(this.hp.getPercents().toString() + '%' );

        if (this.hp.getValue() <= 0) {
            this.die();
        }
    }

    private generateHp (level: SpawnerLevel): number {
        let hp = 20;

        switch (level) {
            case SpawnerLevel.FIRST:
                return hp * 1.5;
            case SpawnerLevel.SECOND:
                return hp * 2;
            case SpawnerLevel.THIRD:
                return hp * 3;
            case SpawnerLevel.FOURTH:
                return hp * 4;
            case SpawnerLevel.FIFTH:
                return hp * 7;
            default:
                return hp * 1;
        }
    }

    private generateFirerate (): number {
        let fireRate = 2;

        switch (this.level) {
            case SpawnerLevel.FIRST:
                return fireRate;
            case SpawnerLevel.SECOND:
                return fireRate * 1.5;
            case SpawnerLevel.THIRD:
                return fireRate * 2;
            case SpawnerLevel.FOURTH:
                return fireRate * 3;
            case SpawnerLevel.FIFTH:
                return fireRate * 4;
            default:
                return fireRate * 1;
        }
    }

    private followPlayer (delta: number): void {
        this.scene.physics.moveTo(this, this.player.x, this.player.y, Enemy.MOVING_SPEED * delta);
    }

    private moveBack (delta: number): void {
        this.scene.physics.moveTo(this, this.initX, this.initY, (Enemy.MOVING_SPEED * 3) * delta);
    }

    private getDistanceToPlayer (): number {
        return Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );
    }

    private getShootDistance (): number {
        return this.spawnDistance - 100;
    }

    private die (): void {
        if (this.isDying) {
            return;
        }
        this.isDying = true;
        const count = Phaser.Math.Between(1, 4);
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
            duration: 1000,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
