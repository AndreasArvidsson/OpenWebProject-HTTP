export class HttpResponse {
    readonly xhr: XMLHttpRequest;
    readonly url: string;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly text: string;

    constructor(xhr: XMLHttpRequest) {
        this.xhr = xhr;
        this.ok = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304;
        this.url = xhr.responseURL;
        this.status = xhr.status;
        this.statusText = xhr.statusText;
        this.text = xhr.responseText;
    }

    header(name: string): string | null {
        return this.xhr.getResponseHeader(name);
    }

    headers(): Record<string, string> {
        const result: Record<string, string> = {};
        const headerStrings = this.xhr.getAllResponseHeaders().split(/\r?\n/);
        for (const header of headerStrings) {
            if (header) {
                const parts = header.split(":");
                if (parts.length === 2) {
                    const key = parts[0].trim().toLowerCase();
                    result[key] = parts[1].trim();
                }
            }
        }
        return result;
    }

    json<T>(): T {
        if (this.xhr.responseType === "json") {
            return this.xhr.response;
        }
        if (this.text) {
            return JSON.parse(this.text);
        }
        throw new Error("Response is not JSON");
    }
}

//5.2) Download response blob.
// function doDownload(request: HttpRequest, response: HttpResponse): HttpResponse {
//     if (downloadjs == null) {
//         throw Error("owp.http: Download option requires owp.http-get");
//     }

//     //First collecct needed data in case the responseInterceptor removes it.
//     const blob = response.xhr.response as Blob;
//     const contentType = response.header("content-type");
//     const filename = request.filename || calcFilename(response, contentType);

//     const res = evalResponse(request, response);

//     //Last download in case of responseInterceptor throws exception.
//     downloadjs(blob, filename, contentType);

//     return res;
// }

// export type Downloadjs = (blob: Blob, filename: string, contentType: string) => void;

// let downloadjs: Downloadjs;

// export function setDownloadjs(djs: Downloadjs) {
//     downloadjs = djs;
// }

// function calcFilename(response: HttpResponse, contentType: string): string {
//     //First look for content-disposition header.
//     const disposition = response.headers["content-disposition"];
//     if (disposition) {
//         const i = disposition.indexOf("filename=") + "filename=".length + 1;
//         return disposition.substring(i, disposition.length - 1);
//     }
//     //Then use last part of url.
//     let url = response.url;
//     const i = url.indexOf("?");
//     if (i > -1) {
//         url = url.substring(0, i);
//     }
//     const parts = url.split("/").filter(Boolean);
//     const name = parts.length ? parts[parts.length - 1] : "file";
//     //If content type is json make sure it has a json ending.
//     const ext =
//         contentType.includes("json") && !name.toLowerCase().endsWith(".json") ? ".json" : "";
//     return name + ext;
// }
