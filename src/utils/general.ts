export const runMain = (main: (...args: any[]) => any, filename: string) => {
    try {
        main();
    } catch (err) {
        console.log(`[${filename}] Failed to run correctly. Check the following error:`);
        console.error(err);
    }
};