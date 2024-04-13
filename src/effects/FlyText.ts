import Phaser from 'phaser';
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
import EffectManager from 'effects/EffectManager';
import { Depths } from 'enums/Depths';

export default class FlyText extends Phaser.GameObjects.Text {
    constructor (scene) {
        super(scene, EffectManager.DEFAULT_POSITION[0], EffectManager.DEFAULT_POSITION[1], '', {
            fontFamily: 'arcadeclassic, Arial',
            fontSize: 48,
            color: '#ffd500'
        } as unknown as TextStyle);

        this.setScale(.5);
        this.scene.add.existing(this);

        this.setStroke('#7b4401', 8);

        this.setDepth(Depths.FLY_TEXT);
        this.setActive(false);
        this.setVisible(false);
    }


    launch (x: number, y: number, text: string, style: object | any): void {
        this.setText(text);
        this.setPosition(x, y);
        this.setVisible(true);
        this.setActive(true);
        this.setAlpha(1);

        if (style !== undefined) {
            this.setStyle(style);
        }

        let range = 20;
        let tweenX = Phaser.Math.RND.realInRange(-range, range);
        let tweenY = -50;
        let duration = Phaser.Math.RND.integerInRange(3000, 4000);

        this.scene.tweens.add({
            targets: this,
            x: this.x + tweenX,
            y: this.y + tweenY,
            alpha: 0,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                this.setActive(false);
                this.setVisible(false);
            }
        });
    }
}
