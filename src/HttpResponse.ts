import { download } from "./util/download";
import { getXhrHeaders } from "./util/getXhrHeaders";
import { xhrToJson } from "./util/xhrToJson";
import { xhrHasText } from "./util/xhrHasText";

export abstract class HttpResponse {
    public readonly ok: boolean;

    constructor(
        public readonly url: string,
        public readonly status: number,
        public readonly statusText: string,
        public readonly text: string | undefined,
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
        const responseText = xhrHasText(xhr) ? xhr.responseText : undefined;
        super(xhr.responseURL, xhr.status, xhr.statusText, responseText);
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
        private readonly data: unknown,
    ) {
        super(url, status, statusText, undefined);
    }

    header(_name: string) {
        return undefined;
    }

    headers() {
        return {};
    }

    json<T>(): T {
        return this.data as T;
    }

    download(filename?: string) {
        return download(this, this.text, filename);
    }
}
