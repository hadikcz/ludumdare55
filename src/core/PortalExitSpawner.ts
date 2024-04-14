import PortalExit from 'core/PortalExit';
import { Depths } from 'enums/Depths';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class PortalExitSpawner {

    public exit!: PortalExit;
    public won = false;
    private winText: any;

    constructor (
      public scene: GameScene,
    ) {
        this.spawn();

        // winTet center in the screen
        const textStyle = {
            fontSize: '64px',
            fill: '#fff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        };
        this.winText = this.scene.add.text(1280 / 2, 720 / 2, 'You won!', textStyle).setScrollFactor(0).setDepth(Depths.UI);
        this.winText.setOrigin(0.5);
        this.winText.setAlpha(0);
        this.winText.setVisible(false);
    }

    win (): void {
        if (this.won) return;
        this.won = true;
        console.log('WIN!!');
        this.scene.player.disableControlsDebug();
        this.scene.cameras.main.stopFollow();

        const duration = 10000;
        const cam = this.scene.cameras.main;
        cam.pan(this.scene.physics.world.bounds.centerX, this.scene.physics.world.bounds.centerY, duration);
        cam.zoomTo(0.07, duration);
        this.winText.setVisible(true);
        this.scene.tweens.add({
            targets: this.winText,
            alpha: 1,
            duration: 10000,
        });

        this.scene.events.emit(Events.WIN);
    }

    preUpdate (): void {
        if (this.exit && !this.won && Phaser.Math.Distance.Between(
            this.scene.player.x,
            this.scene.player.y,
            this.exit.x,
            this.exit.y
        ) < 80) {
            this.win();
        }
    }

    private spawn (): void {
        const distanceFromBorder = 300;
        const { x, y } = this.generateExitPosition(this.scene.physics.world.bounds.width, this.scene.physics.world.bounds.height, distanceFromBorder);

        this.exit = new PortalExit(this.scene, x, y);

    }

    private generateExitPosition (mapWidth, mapHeight, distanceFromBorder) {
        const side = Phaser.Math.Between(0, 3);

        let x, y;

        switch (side) {
            case 0: // Top
                x = Phaser.Math.Between(distanceFromBorder, mapWidth - distanceFromBorder);
                y = distanceFromBorder;
                break;
            case 1: // Right
                x = mapWidth - distanceFromBorder; // Adjusted to ensure it's outside the map bounds
                y = Phaser.Math.Between(distanceFromBorder, mapHeight - distanceFromBorder);
                break;
            case 2: // Bottom
                x = Phaser.Math.Between(distanceFromBorder, mapWidth - distanceFromBorder);
                y = mapHeight - distanceFromBorder;
                break;
            case 3: // Left
                x = distanceFromBorder;
                y = Phaser.Math.Between(distanceFromBorder, mapHeight - distanceFromBorder);
                break;
        }

        return { x, y };
    }
}
