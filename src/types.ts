export interface Options {
    requestInterceptor?: (request: Request) => Request | Promise<Request>;
    responseInterceptor?: (response: Response) => unknown | Promise<unknown>;
    stateChangeInterceptor?: (readyState: number) => void;
    params?: Record<string, Param | Param[]>;
    headers?: Record<string, string>;
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
    data: unknown;
}

type Primary = string | number | boolean;
export type Param = Primary | null;
export type Method = "GET" | "DELETE" | "HEAD" | "PUT" | "PATCH" | "POST" | "JSONP";
export type Arg = Primary | Options;
