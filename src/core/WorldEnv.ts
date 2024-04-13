import GameScene from 'scenes/GameScene';

export default class WorldEnv {
    constructor (
        private scene: GameScene
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
    }
}
