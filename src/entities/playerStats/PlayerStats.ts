import Stat from 'entities/playerStats/Stat';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class PlayerStats {

    private static readonly IDLE_ENERGY_CONSUPTION: number = 0.03; // 0.3 for one second, 0.03 for 100ms
    private static readonly MOVEMENT_ENERGY_CONSUPTION: number = 0.05;
    private static readonly SHOOT_ENERGY_CONSUPTION: number = 0.05;

    public readonly energy: Stat;
    public readonly shields: Stat;
    private playerMovement: boolean = false;
    private playerInsideSafehouse: boolean = false;

    constructor (
        private readonly scene: GameScene,
    ) {
        this.energy = new Stat(this.scene, 100, 100);
        this.shields = new Stat(this.scene, 100, 100, true, 1);

        this.scene.time.addEvent({
            delay: 100,
            callback: this.update,
            callbackScope: this,
            loop: true,
        });

        this.scene.events.on(Events.PLAYER_SHOOT, () => {
            this.energy.burn(PlayerStats.SHOOT_ENERGY_CONSUPTION);
        });
    }

    public setPlayerMovement (movement: boolean): void {
        this.playerMovement = movement;
    }

    public setPlayerInsideSafehouse (insideSafehouse: boolean): void {
        this.playerInsideSafehouse = insideSafehouse;
    }

    private update (): void {
        const regenRate = 1; // 10 per second, 1 per 100ms

        if (this.playerInsideSafehouse) {
            this.energy.regen(regenRate);
            this.shields.regen(regenRate);
        } else {
            if (this.playerMovement) {
                console.log('burning energy movement');
                this.energy.burn(PlayerStats.MOVEMENT_ENERGY_CONSUPTION);
            } else {
                console.log('burning energy idle');
                this.energy.burn(PlayerStats.IDLE_ENERGY_CONSUPTION);
            }
        }
    }

}