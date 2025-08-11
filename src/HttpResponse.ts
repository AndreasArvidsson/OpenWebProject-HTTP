import { download } from "./util/download";
import { getXhrHeaders } from "./util/getXhrHeaders";
import { textToJson, xhrToJson } from "./util/responseToJson";

export abstract class HttpResponse {
    public readonly ok: boolean;

    constructor(
        public readonly url: string,
        public readonly status: number,
        public readonly statusText: string,
        public readonly text: string,
    ) {
        this.ok = (status >= 200 && status < 300) || status === 304;
    }

    abstract header(name: string): string | undefined;
    abstract headers(): Record<string, string>;
    abstract json<T>(): T;
    abstract download(filename?: string): Promise<void>;
}

export class XhrResponse extends HttpResponse {
    constructor(private readonly xhr: XMLHttpRequest) {
        super(xhr.responseURL, xhr.status, xhr.statusText, xhr.responseText);
    }

    header(name: string) {
        return this.xhr.getResponseHeader(name) ?? undefined;
    }

    headers() {
        return getXhrHeaders(this.xhr);
    }

    json<T>() {
        return xhrToJson<T>(this.xhr);
    }

    download(filename?: string) {
        return download(this, this.xhr.response, filename);
    }
}

export class JsonpResponse extends HttpResponse {
    constructor(
        readonly url: string,
        readonly status: number,
        readonly statusText: string,
        readonly text: string,
    ) {
        super(url, status, statusText, text);
    }

    header(_name: string) {
        return undefined;
    }

    headers() {
        return {};
    }

    json<T>(): T {
        return textToJson<T>(this.text);
    }

    download(filename?: string) {
        return download(this, this.text, filename);
    }
}
