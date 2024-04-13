import dayjs from 'dayjs';
import GameScene from 'scenes/GameScene';

export default class PerformanceMeasureExporter {

    private static readonly FPS_MEASUREMENT_DATA = 'fps_measurment_data';
    private scene: GameScene;
    private key: string;
    private time = 0;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.key = dayjs().format();
    }

    start (): void {
        setInterval(() => {
            this.saveFps();
            this.time++;
        }, 1000);
    }

    exportCsv (): string {
        let current = sessionStorage.getItem(PerformanceMeasureExporter.FPS_MEASUREMENT_DATA);
        if (!current) return '';

        current = JSON.parse(current);
        // @ts-ignore
        for (let key in current) {
            let dataSet = current[key];
            console.log(key);
            let csv = 'time;fps';
            for (let row of dataSet) {
                csv += '\n';
                csv += row[0] + ';' + Math.round(row[1]);
            }
            console.log(csv);
        }

        return '';
    }

    private saveFps (): void {
        let current = sessionStorage.getItem(PerformanceMeasureExporter.FPS_MEASUREMENT_DATA);

        let data = {};
        if (current) {
            data = JSON.parse(current);
        }

        if (data[this.key] === undefined) {
            data[this.key] = [];
        }

        data[this.key].push([
            this.time,
            this.scene.game.loop.actualFps,
        ]);

        sessionStorage.setItem(PerformanceMeasureExporter.FPS_MEASUREMENT_DATA, JSON.stringify(data));
    }
}
