import SafeHouse from 'core/SafeHouse';
import TunnelLayer from 'core/TunnelLayer';
import WorldEnv from 'core/WorldEnv';
import Bullet from 'entities/Bullet';
import PlayerStats from 'entities/playerStats/PlayerStats';
import Shooting from 'entities/Shooting';
import UpgradeItem, { UpgradeItemEnum } from 'entities/UpgradeItem';
import { Depths } from 'enums/Depths';
import Phaser from 'phaser';
import GameScene from 'scenes/GameScene';

export default class Player extends Phaser.GameObjects.Container {

    private static readonly SPEED: number = 6;
    private static readonly ANGLE_SPEED: number = Player.SPEED / 1.5;
    private static readonly SPEED_SLOW: number = 2;
    private sprite: Phaser.GameObjects.Sprite;
    private barel: Phaser.GameObjects.Sprite;
    private cursors: any;
    private reverseHeading: boolean = false;
    private playerShooting: Shooting;
    public readonly playerStats: PlayerStats;
    private isDying = false;
    private spawnX: number;
    private spawnY: number;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        private readonly tunnelLayer: TunnelLayer,
        private readonly worldEnv: WorldEnv,
        private readonly safeHouse: SafeHouse
    ) {
        super(scene, x, y, []);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.spawnX = x;
        this.spawnY = y;
        this.playerShooting = new Shooting(
            scene,
            this.worldEnv,
            this.tunnelLayer,
            true,
            3
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

        const body: Phaser.Physics.Arcade.Body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(8, 0, 0);

        this.scene.physics.add.overlap(this, this.scene.upgradeItemsGroup, (player, item) => this.onPickedUpgradeItem(item));
    }

    preUpdate (time: number, delta: number): void {
        if (this.isDying) return;

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

    applyDamage (damage: number): void {
        if (this.isDying) return;
        const isInsideSafehouse = this.safeHouse.isInSafeHouse(this.x, this.y);
        if (isInsideSafehouse) return;
        this.playerStats.shields.burn(damage);
        this.scene.cameras.main.flash();

        if (this.playerStats.shields.getValue() <= 0) {
            this.die();
        }
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

            let shootRotation = this.rotation;
            // const recoil = .1;
            // shootRotation += Phaser.Math.RND.between(-recoil, recoil);

            this.playerShooting.shoot(
                this.x,
                this.y,
                shootRotation,
                (Math.abs(body.velocity.x) + Math.abs(body.velocity.x)) / 2,
                10
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

    private die (): void {
        if (this.isDying) {
            return;
        }
        this.isDying = true;
        const count = Phaser.Math.Between(20, 40);
        for (let i = 0; i < count; i++) {
            const bullet = new Bullet(
                this.scene,
                this.x,
                this.y,
                Phaser.Math.RND.angle(),
                10,
                true,
                this.scene.tunnelLayer,
                1
            );
            this.scene.worldEnv.bullets.add(bullet);
        }

        this.scene.add.tween({
            targets: this,
            alpha: 0,
            duration: 3000,
            onComplete: () => {
                this.respawn();
            }
        });
    }

    private respawn (): void {
        this.x = this.spawnX;
        this.y = this.spawnY;


        this.playerStats.fillUp();


        this.scene.add.tween({
            targets: this,
            alpha: 1,
            duration: 3000,
            onComplete: () => {
                this.isDying = false;
            }
        });
    }

    private onPickedUpgradeItem (item: UpgradeItem): void {
        const type = item.getType();
        item.destroy(true);

        if (type === UpgradeItemEnum.CANNON) {
            let fireRate = this.playerShooting.getFireRate();
            const increase = 0.5;
            this.playerShooting.setFireRate(fireRate + increase);

            this.scene.effectManager.launchFlyText(this.x, this.y, 'Firerate     upgraded!');
            return;
        }

        // captailize type
        const typeText = type.charAt(0).toUpperCase() + type.slice(1);

        const amount = this.playerStats.upgrade(type);
        this.scene.effectManager.launchFlyText(this.x, this.y, typeText + '      upgraded by    ' + amount + '!');
    }
}
