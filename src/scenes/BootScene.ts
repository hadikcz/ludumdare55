import 'phaser';

declare let window: any;

export default class BootScene extends Phaser.Scene {
    constructor () {
        super({ key: 'BootScene', plugins: ['Loader'] });
    }

    preload (): void {
        window.bootScene = this;
        this.sys.scale.refresh();

        const progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height as number / 2, this.sys.game.config.width as number * value, 60);
        });

        this.load.on('complete', () => {
            progress.destroy();
            this.startGame();
        }, this);

        // LOAD assets HERE
        this.load.setPath('assets/images');
        this.load.image('tiles16', 'tiles16.png');

        const settings = { frameWidth: 16, frameHeight: 16 };
        this.load.spritesheet('xxx', 'xxx.png', settings);
        this.load.atlas('assets', 'placeholder_assets.png', 'placeholder_assets.json');
    }

    private startGame (): void {
        this.scene.start('GameScene', {});
    }
}
