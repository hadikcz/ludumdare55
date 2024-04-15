<script lang="ts">
    import GameScene from "scenes/GameScene";
	import {onDestroy} from "svelte";
	import './global.css';

    export let scene: GameScene;


	let energy = scene.player.playerStats.energy.getValue();
	scene.player.playerStats.energy.value$.subscribe((value) => {
		energy = value;
	});

	let energyPercent = scene.player.playerStats.energy.getPercents();
	scene.player.playerStats.energy.percentValue$.subscribe((value) => {
		energyPercent = value;
	});

    let shields = scene.player.playerStats.shields.getValue();
    scene.player.playerStats.shields.value$.subscribe((value) => {
        shields = value;
    });

	let shieldsPercent = scene.player.playerStats.shields.getPercents();
	scene.player.playerStats.shields.percentValue$.subscribe((value) => {
		shieldsPercent = value;
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
		<div style="width: 300px; height: 75px; text-align: center; background: rgba(0,0,0,0.49); color: white">
			Energy: {Math.round(energyPercent)}% ({Math.round(energy)})<br>
            Shield: {Math.round(shieldsPercent)}% ({Math.round(shields)})
		</div>
	</div>
</main>
