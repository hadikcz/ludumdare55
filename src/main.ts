import 'phaser';

import GameConfig from 'config/GameConfig';
import TvStaticFx from 'effects/TvStaticFx.js';
import BootScene from 'scenes/BootScene';
import GameScene from 'scenes/GameScene';

declare let __DEV__: any;
const config = {
    type: Phaser.WEBGL,
    pixelArt: false,
    roundPixels: false,
    autoRound: false,
    parent: 'content',
    width: GameConfig.PhaserBasicSettings.gameSize.width,
    height: GameConfig.PhaserBasicSettings.gameSize.height,
    backgroundColor: GameConfig.PhaserBasicSettings.backgroundColor,
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    physics: {
        fixedStep: true,
        fps: 60,
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    disableContextMenu: !__DEV__,
    antialias: true,
    scale: {
        width: GameConfig.PhaserBasicSettings.gameSize.width,
        height: GameConfig.PhaserBasicSettings.gameSize.height
    },
    scene: [
        BootScene,
        GameScene
    ],
    pipeline: { TvStaticFx }
};
// @ts-ignore
const game = new Phaser.Game(config);
//
// let stats = new Stats();
// document.body.appendChild(stats.dom);
//
// requestAnimationFrame(function loop () {
//     stats.update();
//     requestAnimationFrame(loop);
// });
