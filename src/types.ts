export interface Options {
    requestInterceptor?: (request: Request) => Request | Promise<Request>;
    responseInterceptor?: (response: Response) => Response | Promise<Response>;
    stateChangeInterceptor?: (readyState: number) => void;
    params?: Record<string, string>;
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
    params: Record<string, string>;
    headers: Record<string, string>;
}

export interface Request extends InternalOptions {
    method: Method;
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

export type Method = "GET" | "DELETE" | "HEAD" | "PUT" | "PATCH" | "POST" | "JSONP";
export type Arg = string | number | boolean | Options;
