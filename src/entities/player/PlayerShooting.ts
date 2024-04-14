import TunnelLayer from 'core/tunnels/TunnelLayer';
import WorldEnv from 'core/WorldEnv';
import Bullet from 'entities/Bullet';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class PlayerShooting {

    private static readonly FIRERATE_PER_SECOND: number = 4;
    private static readonly WAIT_BETWEEN_SHOOTS: number = 1000 / PlayerShooting.FIRERATE_PER_SECOND;
    private lastShootTime: number = 0;

    constructor (
        private readonly scene: GameScene,
        private readonly worldEnv: WorldEnv,
        private readonly tunnelLayer: TunnelLayer
    ) {

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
            true,
            this.tunnelLayer
        );
        this.worldEnv.bullets.add(bullet);

        this.scene.events.emit(Events.PLAYER_SHOOT);
    }

    private canShoot (): boolean {
        const now = Date.now();
        if (now - this.lastShootTime > PlayerShooting.WAIT_BETWEEN_SHOOTS) {
            this.lastShootTime = now;
            return true;
        }
        return false;
    }
}
