import type { HttpResponse } from "./HttpResponse";

const cache: Record<string, Promise<HttpResponse>> = {};

export default {
    get: (key: string, callback: () => Promise<HttpResponse>) => {
        if (cache[key] == null) {
            //Store in cache immediately so we dont get multiple http reuqest at the same time.
            cache[key] = callback();
            //Don't store failed requests.
            cache[key].catch(() => {
                delete cache[key];
            });
        }
        return cache[key];
    },
};
