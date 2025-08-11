import type { PathParam, Url } from "../types";

export function parseUrl(url: Url): string {
    return typeof url === "string" ? url : updateUrl(url[0], url.slice(1));
}

export function updateUrl(url: string, params: PathParam[]): string {
    const urlParts = [url];

    for (const param of params) {
        if (param) {
            urlParts.push(encodeURIComponent(param));
        }
    }

    return urlParts.join("/");
}
