import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class Stat {

    public readonly value$: Subject<number>;

    constructor (
        private readonly scene: GameScene,
        private value: number,
        private maxValue: number,
        private readonly autoRegen: boolean = false,
        private readonly regenRate: number = 0,
    ) {
        this.value$ = new Subject<number>();
        this.value$.next(this.value);

        if (this.autoRegen) {
            this.scene.time.addEvent({
                delay: 1000,
                callback: this.regen,
                callbackScope: this,
                loop: true,
            });
        }
    }

    public regen (value: number = 0): void {
        if (value && this.value < this.maxValue) {
            this.value += value;

            this.value$.next(this.value);

            return;
        }

        if (this.value < this.maxValue) {
            this.value += this.regenRate;

            this.value$.next(this.value);
        }
    }

    public getValue (): number {
        return this.value;
    }

    public upgrade (newMaxValue: number): void {
        this.maxValue = newMaxValue;
    }

    public burn (amount: number): void {
        this.value -= amount;
        this.value$.next(this.value);
    }
}
