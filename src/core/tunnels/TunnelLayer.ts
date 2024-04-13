import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class TunnelLayer {

    private rt: Phaser.GameObjects.RenderTexture;
    private circle: Phaser.GameObjects.Graphics;

    constructor (
        private readonly scene: GameScene
    ) {
        this.rt = this.scene.add.renderTexture(0, 0, 1000, 1000)
            .setOrigin(0, 0);

        this.rt.setDepth(Depths.TUNNEL);

        this.circle = this.scene.make.graphics({ x: 0, y: 0 }).fillStyle(0x000000, 1).fillCircle(0, 0, 10);
        this.rt.clear();
    }

    addTunnelSection (x: number, y: number): void {
        console.log('print');
        this.rt.draw(this.circle, x, y);
    }
}
