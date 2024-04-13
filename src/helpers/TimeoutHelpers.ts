export default class TimeoutHelpers {
    static clearTimeouts (timeouts: NodeJS.Timeout[]): void {
        for (const timeout of timeouts) {
            clearTimeout(timeout);
        }
    }
}
