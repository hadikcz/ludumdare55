import GameScene from 'scenes/GameScene';
import Group = Phaser.GameObjects.Group;
import { Depths } from 'enums/Depths';

export default class WorldEnv {

    private rocks: Group = this.scene.add.group();

    constructor (
        private readonly scene: GameScene
    ) {
        // let bg = this.scene.add.image(0, 0, 'background')
        //     .setOrigin(0, 0)
        //     .setDepth(Depths.BG_TEXTURE);
        // bg.setInteractive();
        // bg.on('pointerdown', () => {
        //     if (this.scene.input.activePointer.downElement.localName !== 'canvas') {
        //         return;
        //     }
        //     // this.scene.events.emit(Events.CLOSE_ALL_MODALS);
        // });

        this.generateTileBackgroundTexture();
        this.generateRandomRocks();
    }

    private generateTileBackgroundTexture (): void {
        this.scene.add.tileSprite(
            -this.scene.physics.world.bounds.width,
            -this.scene.physics.world.bounds.height,
            this.scene.physics.world.bounds.width * 2,
            this.scene.physics.world.bounds.height * 2,
            'assets',
            'Environment/dirt'
        )
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE);
    }

    private generateRandomRocks (): void {
        this.rocks = this.scene.add.group();

        for (let i = 0; i < 100; i++) {
            const rock = this.scene.add.image(
                this.scene.physics.world.bounds.width * Math.random(),
                this.scene.physics.world.bounds.height * Math.random(),
                'assets',
                'Smoke/smokeGrey5'
            )
                .setDepth(Depths.ROCKS);
            this.rocks.add(rock);
        }
    }
}
