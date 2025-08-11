import type { HttpParams } from "../types";

export function calcQueryParmsString(
    params: HttpParams | undefined,
): string | undefined {
    if (params == null) {
        return undefined;
    }

    const parts: string[] = [];

    for (const i in params) {
        const key = encodeURIComponent(i);
        const value = params[i];

        //Array of values
        if (Array.isArray(value)) {
            for (const item of value) {
                if (item != null) {
                    parts.push(`${key}=${encodeURIComponent(item)}`);
                }
            }
        }
        //Single value
        else if (value != null) {
            parts.push(`${key}=${encodeURIComponent(value)}`);
        }
    }

    if (parts.length > 0) {
        return parts.join("&");
    }

    return undefined;
}
