import PortalExitSpawner from 'core/PortalExitSpawner';
import SafeHouse from 'core/SafeHouse';
import SummoningRockManager from 'core/spawners/SummoningRockManager';
import TunnelLayer from 'core/TunnelLayer';
import WorldEnv from 'core/WorldEnv';
import dat, { GUI } from 'dat.gui';
import CameraStaticFxEnergyManager from 'effects/CameraStaticFxEnergyManager';
import EffectManager from 'effects/EffectManager';
import Player from 'entities/player/Player';
import $ from 'jquery';
import Phaser from 'phaser';
import { Subject } from 'rxjs';
import UI from 'ui/UI';

declare let window: any;
declare let __DEV__: any;

export default class GameScene extends Phaser.Scene {

    public effectManager!: EffectManager;
    public ui!: UI;
    private debugGui!: GUI;
    public worldEnv!: WorldEnv;
    private testObject!: Phaser.GameObjects.Image;
    private controls!: Phaser.Cameras.Controls.SmoothedKeyControl;
    public xPos$!: Subject<number>;
    public player!: Player;
    public tunnelLayer!: TunnelLayer;
    public safeHouse!: SafeHouse;
    private cameraStaticFxEnergyManager!: CameraStaticFxEnergyManager;
    public spawnerManager!: SummoningRockManager;
    public upgradeItemsGroup!: Phaser.Physics.Arcade.Group;
    public portalExitSpawner!: PortalExitSpawner;
    private winText!: Phaser.GameObjects.Text;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;

        // set world size
        this.physics.world.setBounds(0, 0, 10000, 10000);

        this.xPos$ = new Subject<number>();

        // this.initDebugUI();
        this.input.setTopOnly(true);

        this.upgradeItemsGroup = this.physics.add.group();

        this.worldEnv = new WorldEnv(this);
        this.tunnelLayer = new TunnelLayer(
            this,
            this.physics.world.bounds.width,
            this.physics.world.bounds.height
        );
        this.safeHouse = new SafeHouse(
            this,
            this.tunnelLayer,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY
        );

        this.effectManager = new EffectManager(this);

        this.player = new Player(
            this,
            this.physics.world.bounds.centerX,
            this.physics.world.bounds.centerY,
            this.tunnelLayer,
            this.worldEnv,
            this.safeHouse
        );


        this.portalExitSpawner = new PortalExitSpawner(this);

        this.initCamera();
        this.spawnerManager = new SummoningRockManager(this, this.player);

        this.ui = new UI(this);
        // const item = new UpgradeItem(this, this.player.x + 100, this.player.y, UpgradeItemEnum.CANNON, SpawnerLevel.FIRST);
        // this.upgradeItemsGroup.add(item);

        // this.startCameraControls();
    }

    update (time, delta): void {
        this.xPos$.next(this.player.x);
        // this.controls.update(delta);
        this.portalExitSpawner.preUpdate();
    }

    disableControlls (): void {
        this.cameras.main.stopFollow();
        this.player.disableControlsDebug();
    }

    private initDebugUI (): void {
        this.debugGui = new dat.GUI({ autoPlace: false });
        $('#datGui').append(this.debugGui.domElement);
        // $('#datGui').hide();

        let camera = this.debugGui.addFolder('Camera');
        camera.add(this.cameras.main, 'zoom').step(1).listen();
        camera.add(this.input.activePointer, 'worldX').step(1).listen();
        camera.add(this.input.activePointer, 'worldY').step(1).listen();
        camera.open();

        this.debugGui.close();
    }

    private startCameraControls (): void {
        if (!this.input.keyboard) {
            return;
        }

        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    private initCamera (): void {
        this.cameras.main.setZoom(1);
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1);

        this.cameraStaticFxEnergyManager = new CameraStaticFxEnergyManager(this);
    }
}
