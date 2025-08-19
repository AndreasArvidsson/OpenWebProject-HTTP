import type { HttpResponse } from "../HttpResponse";
import { Headers } from "./constants";

export function download(
    response: HttpResponse,
    blob: Blob,
    filename: string | undefined,
) {
    downloadBlob(blob, filename ?? calcFilename(response));
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.style.display = "none";
    a.addEventListener("click", (e) => e.stopPropagation(), { once: true });

    document.body.appendChild(a);

    // Defer the click until the next frame so the element is "settled"
    requestAnimationFrame(() => {
        a.click();
        document.body.removeChild(a);

        // Revoke the object URL on the next tick to avoid racing with the download
        setTimeout(() => URL.revokeObjectURL(url), 0);
    });
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
