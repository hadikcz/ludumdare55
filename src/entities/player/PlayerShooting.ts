import WorldEnv from 'core/WorldEnv';
import Bullet from 'entities/Bullet';
import GameScene from 'scenes/GameScene';

export default class PlayerShooting {

    private static readonly FIRERATE_PER_SECOND: number = 2;
    private static readonly WAIT_BETWEEN_SHOOTS: number = 1000 / PlayerShooting.FIRERATE_PER_SECOND;
    private lastShootTime: number = 0;

    constructor (
        private readonly scene: GameScene,
        private readonly worldEnv: WorldEnv
    ) {

    }

    shoot (
        x: number,
        y: number,
        angle: number
    ): void {
        if (!this.canShoot()) {
            return;
        }

        const bullet = new Bullet(
            this.scene,
            x,
            y,
            angle
        );
        this.worldEnv.bullets.add(bullet);
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
