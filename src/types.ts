import type { HttpResponse } from "./HttpResponse";

export interface HttpOptions {
    params?: HttpParams;
    headers?: HttpHeaders;
    cache?: boolean;
    data?: string;
    json?: object;
    contentType?: string;
    responseType?: XMLHttpRequestResponseType;

    requestInterceptor?: (request: HttpRequest) => HttpRequest | Promise<HttpRequest>;
    responseInterceptor?: (response: HttpResponse) => any | Promise<any>;
    stateChangeInterceptor?: (readyState: number) => void;
    progressInterceptor?: (loaded: number, total: number) => void;
}

export interface HttpRequest extends HttpOptions {
    url: string;
    method: Method;
}

type Primary = string | number | boolean;
type Param = Primary | null | undefined;

export type PathParam = string | number | false | null | undefined;
export type HttpParams = Record<string, Param | Param[]>;
export type HttpHeaders = Record<string, string | null | undefined>;
export type Method = "GET" | "DELETE" | "HEAD" | "PUT" | "PATCH" | "POST" | "JSONP";
