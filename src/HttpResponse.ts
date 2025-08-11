import { download } from "./util/download";
import { parseXhrHeaders } from "./util/parseXhrHeaders";
import { xhrToJson } from "./util/xhrToJson";

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
        return parseXhrHeaders(this.xhr);
    }

    json<T>(): T {
        return xhrToJson<T>(this.xhr);
    }

    download(filename?: string): Promise<void> {
        return download(this, filename);
    }
}
