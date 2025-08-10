import type { Response } from "./types";
const cache: Record<string, Promise<Response>> = {};

export default {
    get: (key: string, callback: () => Promise<Response>) => {
        if (cache[key] == null) {
            //Store in cache immediately so we dont get multiple http reuqest at the same time.
            cache[key] = callback();
            //Don't store failed requests.
            cache[key].catch(() => {
                delete cache[key];
            });
        }
        return cache[key];
    }
};
