import Container = Phaser.GameObjects.Container;
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Bullet extends Container {

    private static readonly SPEED_LIMIT: number = 150;

    constructor (
        scene: GameScene,
        x: number,
        y: number,
        angle: number,
        initSpeed: number = 0,
        private readonly isPlayerOwned: boolean = false
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        const texture = this.scene.add.image(0, 0, 'assets', 'Bullets/bulletRed');
        this.add(texture);

        this.setDepth(Depths.BULLET);

        this.setScale(.5);

        // @ts-ignore
        const body: Phaser.Physics.Arcade.Body = this.body;

        const speed = Bullet.SPEED_LIMIT + initSpeed;
        body.setVelocityX(speed * Math.cos(angle));
        body.setVelocityY(speed * Math.sin(angle));

        this.rotation = angle + Math.PI / 2;
    }
}
