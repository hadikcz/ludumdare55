import Container = Phaser.GameObjects.Container;
import Spawner from 'core/spawners/Spawner';
import TunnelLayer, { CircleSize } from 'core/TunnelLayer';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class Bullet extends Container {

    private static readonly SPEED_LIMIT: number = 150;

    constructor (
        public scene: GameScene,
        x: number,
        y: number,
        angle: number,
        initSpeed: number = 0,
        private readonly isPlayerOwned: boolean = false,
        private readonly tunnelLayer: TunnelLayer,
        private readonly bulletDamage: number = 1
    ) {
        super(scene, x, y, []);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        const texture = this.scene.add.image(0, 0, 'assets', 'Bullets/bulletRed');
        this.add(texture);

        this.setDepth(Depths.BULLET);

        this.setScale(.5);

        // @ts-ignore
        const body: Phaser.Physics.Arcade.Body = this.body;

        const speed = Bullet.SPEED_LIMIT + initSpeed;
        body.setVelocityX(speed * Math.cos(angle));
        body.setVelocityY(speed * Math.sin(angle));

        this.rotation = angle + Math.PI / 2;

        if (this.isPlayerOwned) {
            this.scene.physics.add.overlap(this, this.scene.spawnerManager.spawners, (object1, object2) => {
                const spawner = object2 as Spawner;
                spawner.applyDamage(bulletDamage);

                this.destroy();
            });
        } else {
            this.scene.physics.add.overlap(this, this.scene.player, (object1, object2) => {
                this.scene.player.applyDamage(bulletDamage);
                this.destroy();
            });
        }
    }

    preUpdate (time: number, delta: number): void {
        const collided = this.tunnelLayer.didItCollideWithDirt(this.x, this.y);
        if (collided) {
            this.tunnelLayer.addTunnelSection(this.x, this.y, CircleSize.SIX);
            this.destroy();
            return;
        }

    }
}
