import { SpawnerLevel } from 'core/spawners/SummoningSpawner';
import Stat from 'entities/playerStats/Stat';
import { UpgradeItemEnum } from 'entities/UpgradeItem';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class PlayerStats {

    private static readonly IDLE_ENERGY_CONSUPTION: number = 0.03; // 0.3 for one second, 0.03 for 100ms
    private static readonly MOVEMENT_ENERGY_CONSUPTION: number = 0.05;
    private static readonly SHOOT_ENERGY_CONSUPTION: number = 0.3;

    public readonly energy: Stat;
    public readonly shields: Stat;
    private playerMovement: boolean = false;
    private playerInsideSafehouse: boolean = false;

    constructor (
        private readonly scene: GameScene,
    ) {
        const startEnergy = 50;
        const startShields = 40;
        this.energy = new Stat(this.scene, startEnergy, startEnergy);
        this.shields = new Stat(this.scene, startShields, startShields, true, 1);

        this.scene.time.addEvent({
            delay: 100,
            callback: this.update,
            callbackScope: this,
            loop: true,
        });

        this.scene.events.on(Events.PLAYER_SHOOT, () => {
            this.energy.burn(PlayerStats.SHOOT_ENERGY_CONSUPTION);
        });

        this.scene.events.on(Events.WIN, () => {
            this.fillUp();
        });
    }

    public setPlayerMovement (movement: boolean): void {
        this.playerMovement = movement;
    }

    public setPlayerInsideSafehouse (insideSafehouse: boolean): void {
        this.playerInsideSafehouse = insideSafehouse;
    }

    public fillUp (): void {
        this.energy.fillUp();
        this.shields.fillUp();
    }

    public upgrade (type: UpgradeItemEnum, level: SpawnerLevel): number {
        let amount;
        switch (level) {
            case SpawnerLevel.FIRST:
                amount = Phaser.Math.RND.integerInRange(5, 10);
                break;
            case SpawnerLevel.SECOND:
                amount = Phaser.Math.RND.integerInRange(7, 15);
                break;
            case SpawnerLevel.THIRD:
                amount = Phaser.Math.RND.integerInRange(10, 20);
                break;
            case SpawnerLevel.FOURTH:
                amount = Phaser.Math.RND.integerInRange(14, 24);
                break;
            case SpawnerLevel.FIFTH:
                amount = Phaser.Math.RND.integerInRange(15, 30);
                break;
        }

        switch (type) {
            case UpgradeItemEnum.ENERGY:
                this.energy.upgrade(amount);
                break;
            case UpgradeItemEnum.SHIELD:
                this.shields.upgrade(amount);
                break;
        }

        return amount;
    }

    private update (): void {
        if (this.scene.portalExitSpawner.won) return;
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
