import TvStaticFx from 'effects/TvStaticFx';
import GameScene from 'scenes/GameScene';

export default class CameraStaticFxEnergyManager {
    private tvStaticFx: Phaser.Renderer.WebGL.Pipelines.PostFXPipeline | Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[];

    constructor (
      private readonly scene: GameScene,
    ) {
        this.scene.player.playerStats.energy.percentValue$.subscribe(this.onEnergyChange.bind(this));

        this.scene.cameras.main.setPostPipeline(TvStaticFx);
        // this.scene.cameras.main.setAlpha(0.5);
        this.tvStaticFx = this.scene.cameras.main.getPostPipeline(TvStaticFx);

        this.tvStaticFx.noiseIntensity = 0;
    }

    private onEnergyChange (energy: number): void {
        //energy it stat raising noise from 0 to 5 which is max, and after 10 it will start making alpha of camera up to 0.6
        // starts at 50% of energy but be faster when energy is lower
        if (energy < 60) {
            // @ts-ignore
            this.tvStaticFx.noiseIntensity = 5 - energy / 10;
            this.scene.cameras.main.setAlpha(0.5 + energy / 100);
        } else {
            // @ts-ignore
            this.tvStaticFx.noiseIntensity = -5;
            this.scene.cameras.main.setAlpha(1);
        }
    }
}
