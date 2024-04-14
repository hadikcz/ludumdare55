import PortalExit from 'core/PortalExit';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class PortalExitSpawner {

    public exit!: PortalExit;
    public won = false;

    constructor (
      public scene: GameScene,
    ) {
        this.spawn();
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
