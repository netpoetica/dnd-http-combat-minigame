/**
 * @fileoverview This is similar to a function you might see in Unity engine.
 */
export async function waitForMs(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
