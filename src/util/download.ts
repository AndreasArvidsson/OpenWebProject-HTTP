import type Downloadjs from "downloadjs";
import type { HttpResponse } from "../HttpResponse";

let cached: typeof Downloadjs | null = null;

export async function download(
    response: HttpResponse,
    filename: string | undefined,
): Promise<void> {
    const downloadjs = await getDownloadJs();
    const contentType = response.header("content-type");

    downloadjs(
        response.xhr.response,
        filename || calcFilename(response, contentType),
        contentType,
    );
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

function calcFilename(
    response: HttpResponse,
    contentType: string | undefined,
): string {
    // First look for content-disposition header.
    const disposition = response.header("content-disposition");

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
    const name = parts.length > 0 ? parts[parts.length - 1] : "download";

    // If content type is json make sure it has a json ending.
    const ext =
        contentType === "application/json" &&
        !name.toLowerCase().endsWith(".json")
            ? ".json"
            : "";

    return name + ext;
}
