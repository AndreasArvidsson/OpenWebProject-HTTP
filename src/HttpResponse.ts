import { download } from "./util/download";
import { getXhrHeaders } from "./util/getXhrHeaders";
import { xhrToJson, xhrToText } from "./util/xhrToData";

export abstract class HttpResponse {
    public readonly ok: boolean;

    constructor(
        public readonly url: string,
        public readonly status: number,
        public readonly statusText: string,
        public readonly responseType: XMLHttpRequestResponseType,
    ) {
        this.ok = (status >= 200 && status < 300) || status === 304;
    }

    abstract header(name: string): string | undefined;
    abstract headers(): Record<string, string>;
    abstract text(): string;
    abstract json<T>(): T;
    abstract blob(): Blob;
    abstract arrayBuffer(): ArrayBuffer;
    abstract download(filename?: string): Promise<void>;
}

export class XhrResponse extends HttpResponse {
    constructor(private readonly xhr: XMLHttpRequest) {
        super(xhr.responseURL, xhr.status, xhr.statusText, xhr.responseType);
    }

    header(name: string) {
        return this.xhr.getResponseHeader(name) ?? undefined;
    }

    headers() {
        return getXhrHeaders(this.xhr);
    }

    text() {
        return xhrToText(this.xhr);
    }

    json<T>() {
        return xhrToJson<T>(this.xhr);
    }

    blob() {
        if (this.xhr.responseType === "blob") {
            return this.xhr.response as Blob;
        }
        throw Error("Response is not Blob");
    }

    arrayBuffer() {
        if (this.xhr.responseType === "arraybuffer") {
            return this.xhr.response as ArrayBuffer;
        }
        throw Error("Response is not ArrayBuffer");
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
        private readonly data: unknown,
    ) {
        super(url, status, statusText, "json");
    }

    header(_name: string) {
        return undefined;
    }

    headers() {
        return {};
    }

    text() {
        return JSON.stringify(this.data);
    }

    json<T>(): T {
        return this.data as T;
    }

    blob(): Blob {
        throw Error("Response is not Blob");
    }

    arrayBuffer(): ArrayBuffer {
        throw Error("Response is not ArrayBuffer");
    }

    download(filename?: string) {
        return download(this, this.data, filename);
    }
}
