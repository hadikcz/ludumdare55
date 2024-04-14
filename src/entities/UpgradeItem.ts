import { SpawnerLevel } from 'core/spawners/SummoningSpawner';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class UpgradeItem extends Phaser.GameObjects.Image {

    constructor (
      public scene: GameScene,
      x: number,
      y: number,
      public readonly type: UpgradeItemEnum,
      private readonly level: SpawnerLevel
    ) {
        super(scene, x, y, 'assets', 'assets/' + type);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setDepth(Depths.UPGRADE_ITEM);
    }

    getType (): UpgradeItemEnum {
        return this.type;
    }

    getLevel (): SpawnerLevel {
        return this.level;
    }
}

export enum UpgradeItemEnum {
  SHIELD = 'shield',
  ENERGY = 'energy',
  CANNON = 'cannon',
}
