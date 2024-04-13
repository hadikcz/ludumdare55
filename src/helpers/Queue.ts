export default class Queue<T> {

    private queue: T[] = [];
    private queueSize: number;

    constructor (queueSize: number) {
        this.queueSize = queueSize;
    }

    canAddIntoQueue (): boolean {
        return this.queue.length < this.queueSize;
    }

    add (entity: T): void {
        this.queue.push(entity);
    }

    remove (entity: T): void {
        let i = this.queue.indexOf(entity);
        this.queue.splice(i, 1);
    }

    get (): T[] {
        return this.queue;
    }

    update (entities: T[]): void {
        this.queue = entities;
    }

    reset (): void {
        this.queue = [];
    }

    isWaitingEntityInQueue (): boolean {
        return this.queue.length > 0;
    }

    getFirst (): T | undefined {
        return this.queue[0];
    }

    /**
     * Get and remove last element
     * @return {T|undefined} Get and remove last element
     */
    pop (): T | undefined {
        return this.queue.pop();
    }

    /**
     * Get and remove first element
     * @return {T|undefined} Get and remove first element
     */
    shift (): T | undefined {
        return this.queue.shift();
    }
}
