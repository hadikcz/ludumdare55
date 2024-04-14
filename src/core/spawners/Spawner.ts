import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Spawner extends Phaser.GameObjects.Container {
    private sprite: Phaser.GameObjects.Image;
    constructor (
        scene: GameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);

        this.sprite = this.scene.add.image(0, 0, 'assets', 'spawner');
        this.sprite.setScale(.3);
        this.add(this.sprite);

        this.setDepth(Depths.SPAWNER);
    }

}
