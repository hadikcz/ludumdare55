<script lang="ts">
    import GameScene from "scenes/GameScene";
	import {onDestroy} from "svelte";
	import './global.css';

    export let scene: GameScene;


    let energy = scene.player.playerStats.energy.getValue();
    scene.player.playerStats.energy.value$.subscribe((value) => {
        energy = value;
    });

    let shields = scene.player.playerStats.shields.getValue();
    scene.player.playerStats.shields.value$.subscribe((value) => {
        shields = value;
    });

	onDestroy(() => {
		console.log('main app svelte DESTYROYD');
	});


</script>

<style lang="scss">
	.top-bar {
		top: 5px;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		font-size: 25px;
		position: absolute;
	}
</style>

<main style="pointer-events: all">
	<div class="top-bar">
		<div style="width: 200px; height: 75px; text-align: center; background: rgba(0,0,0,0.49); color: white">
			Energy: {Math.round(energy)}<br>
            Shield: {Math.round(shields)}
		</div>
	</div>
</main>
