import Player from 'entities/player/Player';
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
    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private readonly player: Player,
        private readonly spawnDistance: number
    ) {
        super(scene, x, y, []);

        this.initX = x;
        this.initY = y;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.sprite = this.scene.add.image(0, 0, 'assets', 'enemy');
        this.sprite.setScale(.3);

        this.add(this.sprite);

        this.setDepth(Depths.ENEMY);

        this.shooting = new Shooting(
            this.scene,
            this.scene.worldEnv,
            this.scene.tunnelLayer,
            false,
            2
        );
    }


    preUpdate (time: number, delta: number): void {
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
}
