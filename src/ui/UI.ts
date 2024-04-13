import $ from 'jquery';
import GameScene from 'scenes/GameScene';
// @ts-ignore
import App from 'ui/svelte/ingame/App.svelte';

export default class UI {

    public static readonly UI_SELECTOR = '.ui';
    public static readonly INGAME_UI_SELECTOR = '.ingame-ui';

    private scene: GameScene;
    private svelteApp: any;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.startSvelte();
    }

    update () {

    }

    show (): void {
        $('.ingame-ui').show();
    }

    hide (): void {
        $('.ingame-ui').hide();
    }

    private startSvelte (): void {
        this.svelteApp = new App({
            target: document.getElementById('svelte-ui'),
            props: {
                scene: this.scene,
            }
        });
    }

    private destroySvelte (): void {
        this.svelteApp.$destroy();
        delete this.svelteApp;
        this.svelteApp = undefined;
    }

    destroy (): void {
        this.destroySvelte();
    }
}
