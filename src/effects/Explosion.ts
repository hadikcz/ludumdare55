import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Explosion extends Phaser.GameObjects.Arc {

    public scene: GameScene;

    constructor (scene: GameScene) {
        super(scene);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setDepth(Depths.EXPLOSION);
    }

    private async launch (x: number, y: number, radius: number): Promise<void> {
        this.setVisible(true);
        this.setActive(true);
        this.setStartAngle(0);
        this.setEndAngle(360);
        this.setFillStyle(0xFFFFFF, 1);

        this.setPosition(x, y);
        this.setRadius(radius);

        this.setScale(0, 0);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    scaleX: 0,
                    scaleY: 0,
                    duration: 100,
                    onComplete: () => {
                        this.setVisible(false);
                        this.setActive(false);
                    }
                });
            }
        });

    }
}
