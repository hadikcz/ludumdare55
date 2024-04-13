import 'phaser';

import GameConfig from 'config/GameConfig';
import BootScene from 'scenes/BootScene';
import GameScene from 'scenes/GameScene';

declare let __DEV__: any;
const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    roundPixels: true,
    autoRound: true,
    parent: 'content',
    width: GameConfig.PhaserBasicSettings.gameSize.width,
    height: GameConfig.PhaserBasicSettings.gameSize.height,
    backgroundColor: GameConfig.PhaserBasicSettings.backgroundColor,
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    physics: {
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
    ]
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
