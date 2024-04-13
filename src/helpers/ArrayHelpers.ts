export default class ArrayHelpers {
    static arrayMerge (array1: [], array2: []): never[] {
        let result = [];
        array1.forEach((element) => {
            // @ts-ignore
            result.push(element);
        });
        array2.forEach((element) => {
            // @ts-ignore
            result.push(element);
        });
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static averageArrayObject (object: any): never[] {
        let result = [];
        for (let key in object) {
            // @ts-ignore
            result.push({ id: key, latency: ArrayHelpers.averageArray(object[key]) });
        }

        // @ts-ignore
        result.sort((a, b) => { return a.latency - b.latency; });
        return result;
    }

    static averageArray (array: number[]): number {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            let value = array[i];
            if (isNaN(value)) {
                continue;
            }
            sum += value;
        }
        return sum / array.length;
    }

    static sumArray (array: number[]): number {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum;
    }

    static getRandomFromArray (array: any[]): any {
        return array[Math.floor(Math.random() * array.length)];
    }

    static getRandomFromArrayTyped<T> (array: any[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    static getRandomFromObjectValues (object: never): any {
        let array = ArrayHelpers.objectValuesToArray(object);
        return ArrayHelpers.getRandomFromArray(array);
    }

    static objectValuesToArray (obj: never): any[] {
        return Object.keys(obj).map(function (key) { return obj[key]; });
    }

    static isNumberInRange (from: number, to: number, number: number): boolean {
        return number >= from && number <= to;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static inArray (array: any[], value: any): boolean {
        return array.indexOf(value) !== -1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static inObjectValues (object: any, value: any): boolean {
        let dataArray: [] = [];
        for (let o in object) {
            // @ts-ignore
            dataArray.push(object[o]);
        }
        // @ts-ignore
        return ArrayHelpers.inArray(dataArray, value);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static inObjectValueDeep (object: any, value: any): any {
        let array = [];
        // transform into array
        for (let o in object) {
            // @ts-ignore
            array.push(object[o]);
        }

        return array.find(function (item) {
            if (item === value) {
                return true;
            } else if (ArrayHelpers.isObject(item)) {
                return ArrayHelpers.inObjectValueDeep(item, value);
            }
        });
    }

    private static sortByOrder (a: any, b: any): number {
        if (a.order < b.order) {
            return -1;
        } else if (a.order > b.order) {
            return 1;
        } else {
            return 0;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static isObject (item: any): boolean {
        return (typeof item === 'object' && !Array.isArray(item) && item !== null);
    }

    static shuffle<T> (array: T[], seed?: string|undefined): T[] {
        let seedArray;
        if (seed) {
            seedArray = [seed];
        }
        const random = new Phaser.Math.RandomDataGenerator(seedArray);

        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(random.realInRange(0, 1) * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
        // return array.sort(() => random.realInRange(0, 1) - 0.5);
    }

    static findLowest<T> (items: T[], obtainValueCallback: any): T|null {
        let lowestValue = Infinity;
        let lowestItem: T|null = null;
        for (let item of items) {
            const value = obtainValueCallback(item);
            if (value < lowestValue) {
                lowestValue = value;
                lowestItem = item;
            }
        }

        return lowestItem;
    }

    static findHighest<T> (items: T[], obtainValueCallback: any): T|null {
        let highestValue = -Infinity;
        let highestItem: T|null = null;
        for (let item of items) {
            const value = obtainValueCallback(item);
            if (value > highestValue) {
                highestValue = value;
                highestItem = item;
            }
        }

        return highestItem;
    }
}
