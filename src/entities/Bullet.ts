import Container = Phaser.GameObjects.Container;
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Bullet extends Container {

    constructor (
        scene: GameScene,
        x: number,
        y: number,
        angle: number,
        private readonly isPlayerOwned: boolean = false
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        const texture = this.scene.add.image(0, 0, 'assets', 'Bullets/bulletGreen');
        this.add(texture);

        this.setDepth(Depths.BULLET);

        // @ts-ignore
        const body: Phaser.Physics.Arcade.Body = this.body;
        body.setVelocityX(50 * Math.cos(angle));
    }
}
