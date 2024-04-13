export default (scene, config: { [key: string]: any }): Promise<void> => {
    return new Promise(resolve => {
        scene.tweens.add({
            ...config,
            onComplete: () => {
                if (config.onComplete) config.onComplete();
                resolve();
            }
        });
    });
};
