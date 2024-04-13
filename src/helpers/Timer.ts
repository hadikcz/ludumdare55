export default (): any => {
    const time = Date.now();

    return {
        stop (): number {
            return Date.now() - time;
        }
    };
};
