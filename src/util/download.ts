import type Downloadjs from "downloadjs";
import type { HttpResponse } from "../HttpResponse";
import { Headers } from "./constants";

let cached: typeof Downloadjs | null = null;

export async function download(
    response: HttpResponse,
    data: unknown,
    filename: string | undefined,
): Promise<void> {
    const downloadjs = await getDownloadJs();

    downloadjs(data, filename || calcFilename(response));
}

async function getDownloadJs() {
    if (cached == null) {
        try {
            const mod = await import("downloadjs");
            cached = mod.default;
        } catch {
            throw new Error(
                "Download requires the 'downloadjs' package. Install it with 'npm i downloadjs'.",
            );
        }
    }
    return cached;
}

function calcFilename(response: HttpResponse): string {
    // First look for content-disposition header.
    const disposition = response.header(Headers.contentDisposition);

    if (disposition) {
        const i = disposition.indexOf("filename=");
        if (i > -1) {
            return disposition.substring(
                i + "filename=".length + 1,
                disposition.length - 1,
            );
        }
    }

    // Then use last part of url.
    let url = response.url;
    const i = url.indexOf("?");

    if (i > -1) {
        url = url.substring(0, i);
    }

    const parts = url.split("/").filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : "download";
}
