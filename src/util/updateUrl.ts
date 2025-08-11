import type { PathParam } from "../types";

export function updateUrl(url: string, params: PathParam[]): string {
    const urlParts = [url];

    for (const param of params) {
        if (param) {
            urlParts.push(encodeURIComponent(param));
        }
    }

    return urlParts.join("/");
}
