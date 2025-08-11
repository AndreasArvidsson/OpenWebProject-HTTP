import type { HttpResponse } from "./HttpResponse";

export interface HttpOptions {
    readonly params?: HttpParams;
    readonly headers?: HttpHeaders;
    readonly cache?: boolean;
    readonly data?: string;
    readonly json?: Json;
    readonly contentType?: string;
    readonly responseType?: XMLHttpRequestResponseType;

    readonly requestInterceptor?: (
        request: HttpRequest,
    ) => HttpRequest | Promise<HttpRequest>;
    readonly responseInterceptor?: (response: HttpResponse) => HttpResponse;
    readonly stateChangeInterceptor?: (readyState: number) => void;
    readonly progressInterceptor?: (loaded: number, total: number) => void;
}

export interface HttpRequest extends HttpOptions {
    url: string;
    method: Method;
}

type QueryParam = string | number | boolean | null | undefined;
export type Url = string | [string, ...PathParam[]];
export type Json = string | number | boolean | null | object;
export type PathParam = string | number | false | null | undefined;
export type HttpParams = Record<string, QueryParam | QueryParam[]>;
export type HttpHeaders = Record<string, string | null | undefined>;
export type Method =
    | "GET"
    | "DELETE"
    | "HEAD"
    | "PUT"
    | "PATCH"
    | "POST"
    | "JSONP";
