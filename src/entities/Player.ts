import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Player extends Phaser.GameObjects.Container {


    private static readonly SPEED: number = 6;
    private static readonly ANGLE_SPEED: number = Player.SPEED / 1.5;
    private sprite: Phaser.GameObjects.Sprite;
    private barel: Phaser.GameObjects.Sprite;
    private cursors: any;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

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
        if (!this.body) {
            return;
        }
        console.log('preUpdate');

        // @ts-ignore
        const body: Phaser.Physics.Arcade.Body = this.body;

        if (this.cursors.left.isDown) {
            this.angle -= Player.ANGLE_SPEED;
        }
        if (this.cursors.right.isDown) {
            this.angle += Player.ANGLE_SPEED;
        }
        if (this.cursors.up.isDown) {
            Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(this.rotation, Player.SPEED * delta, body.velocity);
        } else if (this.cursors.down.isDown) {
            Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(this.rotation, -Player.SPEED * delta, body.velocity);
        } else {
            body.setVelocity(0);
        }
    }
}
