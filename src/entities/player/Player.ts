import SafeHouse from 'core/SafeHouse';
import TunnelLayer from 'core/tunnels/TunnelLayer';
import WorldEnv from 'core/WorldEnv';
import PlayerStats from 'entities/playerStats/PlayerStats';
import Shooting from 'entities/Shooting';
import { Depths } from 'enums/Depths';
import Phaser from 'phaser';
import GameScene from 'scenes/GameScene';

export default class Player extends Phaser.GameObjects.Container {


    private static readonly SPEED: number = 6;
    private static readonly ANGLE_SPEED: number = Player.SPEED / 1.5;
    private static readonly SPEED_SLOW: number = 3;
    private sprite: Phaser.GameObjects.Sprite;
    private barel: Phaser.GameObjects.Sprite;
    private cursors: any;
    private reverseHeading: boolean = false;
    private playerShooting: Shooting;
    public readonly playerStats: PlayerStats;

    constructor (
        scene: GameScene,
        x: number,
        y: number,
        private readonly tunnelLayer: TunnelLayer,
        private readonly worldEnv: WorldEnv,
        private readonly safeHouse: SafeHouse
    ) {
        super(scene, x, y, []);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.playerShooting = new Shooting(
            scene,
            this.worldEnv,
            this.tunnelLayer
        );

        this.playerStats = new PlayerStats(scene);

        const scaleOfSprite = .3;
        this.sprite = this.scene.add.sprite(0, 0, 'assets', 'Tanks/tankGreen')
            .setAngle(90)
            .setScale(scaleOfSprite);

        this.add(this.sprite);

        this.barel = this.scene.add.sprite(0, 0, 'assets', 'Tanks/barrelGreen')
            .setAngle(90)
            .setOrigin(0.5 , 1)
            .setScale(scaleOfSprite);
        this.add(this.barel);


        if (!this.scene.input || !this.scene.input.keyboard) {
            throw new Error('Input not found');
        }
        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.setAngle(-90);

        this.setDepth(Depths.PLAYER);

    }

    preUpdate (time: number, delta: number): void {
        const isMoving = this.isMoving();
        this.playerStats.setPlayerMovement(isMoving);
        const isInsideSafehouse = this.safeHouse.isInSafeHouse(this.x, this.y);
        this.playerStats.setPlayerInsideSafehouse(isInsideSafehouse);

        if (!this.body) {
            return;
        }

        // @ts-ignore
        const body: Phaser.Physics.Arcade.Body = this.body;

        if (isMoving) {
            this.tunnelLayer.addTunnelSection(this.x, this.y);
        }

        this.mouseControls(body, delta);
    }

    private isMoving (): boolean {
        if (!this.body) {
            return false;
        }

        // @ts-ignore
        const body: Phaser.Physics.Arcade.Body = this.body;

        return body.velocity.x !== 0 || body.velocity.y !== 0;
    }

    private keyboardControls (body: Phaser.Physics.Arcade.Body, delta: number): void {
        if (this.cursors.left.isDown) {
            this.angle -= Player.ANGLE_SPEED;
        }
        if (this.cursors.right.isDown) {
            this.angle += Player.ANGLE_SPEED;
        }
        if (this.cursors.up.isDown) {
            this.reverseHeading = false;
            Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(this.rotation, this.getSpeed() * delta, body.velocity);
        } else if (this.cursors.down.isDown) {
            this.reverseHeading = true;
            Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(this.rotation, -this.getSpeed() * delta, body.velocity);
        } else {
            this.reverseHeading = false;
            body.setVelocity(0);
        }
    }

    private mouseControls (body: Phaser.Physics.Arcade.Body, delta: number): void {
        const pointer = this.scene.input.activePointer;
        let angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);

        const recoil = .1;
        angle += Phaser.Math.RND.between(-recoil, recoil);

        if (this.cursors.up.isDown) {
            this.reverseHeading = false;
            Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(angle, this.getSpeed() * delta, body.velocity);
        } else if (this.cursors.down.isDown) {
            this.reverseHeading = true;
            Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(angle, -this.getSpeed() * delta, body.velocity);
        } else {
            body.setVelocity(0);
        }

        if (pointer.isDown) {
            this.playerShooting.shoot(
                this.x,
                this.y,
                this.rotation,
                (Math.abs(body.velocity.x) + Math.abs(body.velocity.x)) / 2
            );
        }

        this.rotation = angle;
    }

    private getSpeed (): number {
        const isInTunnel = this.tunnelLayer.isInTheTunnel(
            this.x,
            this.y,
            this.rotation + (this.reverseHeading ? Math.PI : 0)
        );
        return isInTunnel ? Player.SPEED : Player.SPEED_SLOW;
    }
}
