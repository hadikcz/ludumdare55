export default class NumberHelpers {

    static randomIntInRange (min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomFloatInRange (min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static formatThousands (inputNumber: number, separator = ' '): string {
        let number = String(inputNumber);

        while (number.length % 3) {
            number = '#' + number;
        }

        let result = number.substr(0, 3);
        result = result.replace(/#/g, '');
        let i;
        let length = number.length;
        for (i = 3; i < length; i += 3) {
            result = result + separator + number.substr(i, 3);
        }

        return result;
    }

    static getRandomFromRange (range: number[]): number {
        return NumberHelpers.randomIntInRange(range[0], range[1]);
    }

    static getRandomFloatFromRange (range: number[]): number {
        return NumberHelpers.randomFloatInRange(range[0], range[1]);
    }

    static randomIntInRangeWithoutZero (min: number, max: number): number {
        let number = NumberHelpers.randomIntInRange(min, max);
        if (number === 0)
            return NumberHelpers.randomIntInRangeWithoutZero(min, max);
        return number;
    }

    static randomHalfAndHalf (): boolean {
        return NumberHelpers.randomIntInRange(0, 1) === 0;
    }
}
