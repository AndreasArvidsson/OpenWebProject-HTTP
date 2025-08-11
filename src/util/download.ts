import type { HttpResponse } from "../HttpResponse";

type Downloadjs = (data: Blob, filename?: string, mimeType?: string) => void;

let cached: Downloadjs | null = null;

export async function download(
    response: HttpResponse,
    filename: string | undefined,
): Promise<void> {
    const downloadjs = await getDownloadJs();

    if (response.xhr.responseType !== "blob") {
        throw new Error("Response type must be 'blob' for download().");
    }

    const data = response.xhr.response as Blob;
    const contentType = response.header("content-type") ?? undefined;

    downloadjs(
        data,
        filename || calcFilename(response, contentType),
        contentType,
    );
}

async function getDownloadJs() {
    if (cached == null) {
        try {
            const mod = await import("downloadjs");
            cached = (mod.default ?? (mod as any)) as Downloadjs;
        } catch {
            throw new Error(
                "This feature requires the 'downloadjs' package. Install it with 'npm i downloadjs'.",
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
        const i = disposition.indexOf("filename=") + "filename=".length + 1;
        return disposition.substring(i, disposition.length - 1);
    }

    // Then use last part of url.
    let url = response.url;
    const i = url.indexOf("?");

    if (i > -1) {
        url = url.substring(0, i);
    }

    const parts = url.split("/").filter(Boolean);
    const name = parts.length ? parts[parts.length - 1] : "file";

    // If content type is json make sure it has a json ending.
    const ext =
        contentType?.includes("json") && !name.toLowerCase().endsWith(".json")
            ? ".json"
            : "";

    return name + ext;
}
