export default class AnimationHelpers {

    static getRange (start, end): number[] {
        let numbers: number[] = [];
        for (let i = start; i <= end; i++) {
            numbers.push(i - 1);
        }
        return numbers;
    }

    static getRangeAnimationObject (start, end): FrameObject {
        return { frames: this.getRange(start, end) };
    }

    static getRangeAnimationObjectByRowAndLength (row: number, length: number): FrameObject {
        row -= 1;
        let frames = this.getRange(
            Math.max(0, row * length + 1),
            (row + 1) * length
        );

        return { frames: frames };
    }
}


interface FrameObject {
    frames: number[];
}
