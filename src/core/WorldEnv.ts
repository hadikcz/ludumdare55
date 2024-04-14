import GameScene from 'scenes/GameScene';
import Group = Phaser.GameObjects.Group;
import { Depths } from 'enums/Depths';

export default class WorldEnv {

    private rocks: Group = this.scene.add.group();
    public bullets: Group = this.scene.add.group();

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
        this.generateBorderTexture();
        this.generateRandomRocks();

        this.scene.physics.collide(this.rocks, this.scene.player);
    }

    private generateTileBackgroundTexture (): void {
        this.scene.add.tileSprite(
            0,
            0,
            this.scene.physics.world.bounds.width,
            this.scene.physics.world.bounds.height,
            'assets',
            'Environment/dirt'
        )
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE);
    }

    private generateBorderTexture (): void {
        // top
        this.scene.add.tileSprite(
            -2000,
            -1000,
            this.scene.physics.world.bounds.width + 4000,
            1000,
            'assets',
            'Environment/sand'
        )
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE_BORDER);

        // bottom
        this.scene.add.tileSprite(
            -2000,
            this.scene.physics.world.bounds.height,
            this.scene.physics.world.bounds.width + 4000,
            1000,
            'assets',
            'Environment/sand'
        )
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE_BORDER);

        // left
        this.scene.add.tileSprite(
            -2000,
            -1000,
            2000,
            this.scene.physics.world.bounds.height + 2000,
            'assets',
            'Environment/sand'
        )
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE_BORDER);

        // right
        this.scene.add.tileSprite(
            this.scene.physics.world.bounds.width,
            -1000,
            2000,
            this.scene.physics.world.bounds.height + 2000,
            'assets',
            'Environment/sand'
        )
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE_BORDER);
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
            this.scene.physics.add.existing(rock);
            this.rocks.add(rock);
        }
    }
}
