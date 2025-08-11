import type { HttpOptions } from "../types";

export function mergeOptions(
    ...options: (HttpOptions | undefined)[]
): HttpOptions {
    const result: HttpOptions = {};

    for (const option of options) {
        if (option != null) {
            const { headers, params, ...rest } = option;
            Object.assign(result, rest);
            result.headers = { ...result.headers, ...headers };
            result.params = { ...result.params, ...params };
        }
    }

    return result;
}
