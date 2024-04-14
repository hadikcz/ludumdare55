import GameScene from 'scenes/GameScene';
import Container = Phaser.GameObjects.Container;
import { Depths } from 'enums/Depths';

export default class PortalExit extends Container {

    private sprite: Phaser.GameObjects.Image;

    constructor (
      public scene: GameScene,
      x: number,
      y: number,
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCircle(80);
        this.sprite = this.scene.add.image(0, 0, 'assets', 'exit');
        this.add(this.sprite);

        this.setDepth(Depths.EXIT);
    }
}
