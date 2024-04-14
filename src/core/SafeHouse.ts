import TunnelLayer from 'core/TunnelLayer';
import GameScene from 'scenes/GameScene';

export default class SafeHouse {
    private bounds: Phaser.Geom.Rectangle;
    constructor (
        private readonly scene: GameScene,
        private readonly tunnelLayer: TunnelLayer,
        private readonly x: number,
        private readonly y: number
    ) {
        const width = 150;
        const height = 150;
        // use addTunelSection which place 10px circle, and x,y is center of that rectangle, and width and height is given, you need to use for loop to place all circles
        // this work perfectly but it is not centered, in fact it is placed in top left corner of the rectangle
        // for (let i = 0; i < width; i += 10) {
        //     for (let j = 0; j < height; j += 10) {
        //         this.tunnelLayer.addTunnelSection(this.x + i, this.y + j, CircleSize.TEN);
        //     }
        // }

        this.tunnelLayer.addRect(
            this.x - width / 2,
            this.y - height / 2,
            width,
            height
        );

        this.bounds = new Phaser.Geom.Rectangle(
            this.x - width / 2,
            this.y - height / 2,
            width,
            height
        );
    }

    isInSafeHouse (x: number, y: number): boolean {
        return this.bounds.contains(x, y);
    }
}
