import TunnelLayer from 'core/TunnelLayer';
import WorldEnv from 'core/WorldEnv';
import Bullet from 'entities/Bullet';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class Shooting {

    private lastShootTime: number = 0;
    private waitBetweenShoots: number;

    constructor (
        private readonly scene: GameScene,
        private readonly worldEnv: WorldEnv,
        private readonly tunnelLayer: TunnelLayer,
        private readonly isPlayerOwned = false,
        private readonly fireRatePerSecond = 4,
    ) {
        this.waitBetweenShoots = 1000 / this.fireRatePerSecond;
    }

    shoot (
        x: number,
        y: number,
        angle: number,
        initSpeed: number = 0
    ): void {
        if (!this.canShoot()) {
            return;
        }

        const bullet = new Bullet(
            this.scene,
            x,
            y,
            angle,
            initSpeed,
            this.isPlayerOwned,
            this.tunnelLayer
        );
        this.worldEnv.bullets.add(bullet);

        this.scene.events.emit(Events.PLAYER_SHOOT);
    }

    private canShoot (): boolean {
        const now = Date.now();
        if (now - this.lastShootTime > this.waitBetweenShoots) {
            this.lastShootTime = now;
            return true;
        }
        return false;
    }
}
