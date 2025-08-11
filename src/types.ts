import type { HttpResponse } from "./HttpResponse";

export interface HttpOptions {
    readonly params?: HttpParams;
    readonly headers?: HttpHeaders;
    readonly cache?: boolean;
    readonly data?: string;
    readonly json?: object;
    readonly contentType?: string;
    readonly responseType?: XMLHttpRequestResponseType;

    readonly requestInterceptor?: (
        request: HttpRequest,
    ) => HttpRequest | Promise<HttpRequest>;
    readonly responseInterceptor?: (
        response: HttpResponse,
    ) => any | Promise<any>;
    readonly stateChangeInterceptor?: (readyState: number) => void;
    readonly progressInterceptor?: (loaded: number, total: number) => void;
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
export type Method =
    | "GET"
    | "DELETE"
    | "HEAD"
    | "PUT"
    | "PATCH"
    | "POST"
    | "JSONP";
