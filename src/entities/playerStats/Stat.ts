import { Subject } from 'rxjs';
import GameScene from 'scenes/GameScene';

export default class Stat {

    public readonly value$: Subject<number>;
    public readonly percentValue$: Subject<number>;

    constructor (
        private readonly scene: GameScene,
        private value: number,
        private maxValue: number = value,
        private readonly autoRegen: boolean = false,
        private readonly regenRate: number = 0,
    ) {
        this.value$ = new Subject<number>();
        this.percentValue$ = new Subject<number>();
        this.value$.next(this.value);

        this.value$.subscribe(() => {
            this.percentValue$.next(this.getPercents());
        });

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
            if (this.value > this.maxValue) {
                this.value = this.maxValue;
            }

            this.value$.next(this.value);

            return;
        }

        if (this.value < this.maxValue) {
            this.value += this.regenRate;

            if (this.value > this.maxValue) {
                this.value = this.maxValue;
            }

            this.value$.next(this.value);
        }
    }

    public getValue (): number {
        return this.value;
    }

    public upgrade (addMax: number): void {
        this.maxValue = this.maxValue + addMax;
    }

    public burn (amount: number): void {
        this.value -= amount;
        this.value$.next(this.value);
    }

    public getPercents (): number {
        return (this.value / this.maxValue) * 100;
    }

    public fillUp (): void {
        this.value = this.maxValue;
        this.value$.next(this.value);
    }
}
