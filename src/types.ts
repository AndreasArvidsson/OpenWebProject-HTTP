export interface Options {
    requestInterceptor?: (request: Request) => Request | Promise<Request>;
    responseInterceptor?: (response: Response) => any | Promise<any>;
    stateChangeInterceptor?: (readyState: number) => void;
    progressInterceptor?: (loaded: number, total: number) => void;
    params?: Params;
    headers?: Headers;
    cache?: boolean;
    download?: boolean;
    data?: string;
    json?: object;
    contentType?: string;
    responseType?: XMLHttpRequestResponseType;
    filename?: string;
    fullResponse?: boolean;
}

export interface InternalOptions extends Options {
    url: string;
}

export interface Request extends InternalOptions {
    method?: Method;
}

export interface Response {
    headers: Record<string, string>;
    url: string;
    ok: boolean;
    status: number;
    statusText: string;
    text: string | null;
    data: any;
}

type Primary = string | number | boolean;
type Param = Primary | null | undefined;

export type Params = Record<string, Param | Param[]>;
export type Headers = Record<string, string | null | undefined>;
export type Method = "GET" | "DELETE" | "HEAD" | "PUT" | "PATCH" | "POST" | "JSONP";
export type Arg = Primary | Options;
export type Downloadjs = (blob: Blob, filename: string, contentType: string) => void;
