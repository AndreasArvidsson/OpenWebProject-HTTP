import cloneDeep from "lodash.clonedeep";
import _cache from "./cache";
import { Method, Param, Request, Response } from "./types";
import use from "./use";

//1) Update request using interceptor.
export default async ({ requestInterceptor, ...request }: Request) => {
    if (requestInterceptor) {
        request = await Promise.resolve(requestInterceptor(request));
    }
    return evaluateRequest(request);
};

//2) Evaluate request. Check in cache.
async function evaluateRequest(request: Request) {
    const { params, method = "GET" } = request;
    let { url } = request;

    const queryString = params ? calcQueryParmsString(params) : "";
    if (queryString) {
        url = `${url}?${queryString}`;
    }

    let response;
    if (request.cache) {
        const res = await _cache.get(method + url, () =>
            performRequest(url, method, !!queryString, request)
        );
        //Make sure each hit of the cache resturns a unique copy.
        response = cloneDeep(res);
    } else {
        response = await performRequest(url, method, !!queryString, request);
    }

    if (request.download) {
        return doDownload(request, response);
    }

    return evalResponse(request, response);
}

//3) Perform request. Actually perform an external action.
function performRequest(
    url: string,
    method: Method,
    paramsUsed: boolean,
    request: Request
): Promise<Response> {
    if (method === "JSONP") {
        return doJsonp(url, paramsUsed, request);
    }
    return doXhr(url, method, request);
}

//4.1) Perform HTTP request.
function doXhr(
    url: string,
    method: Method,
    { data, json, contentType, responseType, headers, download, stateChangeInterceptor }: Request
): Promise<Response> {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.responseType = download ? "blob" : responseType ?? "";

        xhr.onreadystatechange = () => {
            if (stateChangeInterceptor) {
                stateChangeInterceptor(xhr.readyState);
            }
            if (xhr.readyState === XMLHttpRequest.DONE) {
                resolve(calcFullResponse(xhr));
            }
        };

        xhr.open(method, url, true); //async

        for (const i in headers) {
            if (headers[i] !== undefined && headers[i] != null) {
                xhr.setRequestHeader(i, headers[i]);
            }
        }

        xhr.setRequestHeader("content-type", calcContentType(contentType, json, data));

        xhr.send(calcBody(json, data));
    });
}

//4.2) Perform JsonP request.
function doJsonp(url: string, paramsUsed: boolean, request: Request): Promise<Response> {
    return new Promise((resolve) => {
        const { stateChangeInterceptor } = request;
        const callbackName = `jsonp_${Date.now()}_${Math.round(1000000 * Math.random())}`;
        const script = document.createElement("script");
        script.src = `${url}${paramsUsed ? "&" : "?"}callback=${callbackName}`;

        const done = (ok: boolean, data: unknown) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            delete (window as any)[callbackName];
            document.body.removeChild(script);
            if (stateChangeInterceptor) {
                stateChangeInterceptor(XMLHttpRequest.DONE);
            }
            resolve(calcJsonpFullResponse(ok, url, data));
        };

        //On success callback
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (window as any)[callbackName] = (data: unknown) => {
            done(true, data);
        };

        script.onerror = () => {
            done(false, null);
        };

        if (stateChangeInterceptor) {
            stateChangeInterceptor(XMLHttpRequest.OPENED);
        }

        document.body.appendChild(script);
    });
}

//5.1) Evaluate response. Update with interceptor.
function evalResponse(request: Request, response: Response): unknown {
    //Response based on interceptor.
    if (request.responseInterceptor) {
        return request.responseInterceptor(response);
    }

    //Response based on 'fullResponse'
    if (response.ok) {
        return request.fullResponse ? response : response.data;
    }

    //Rejection always gets the full response.
    throw response;
}

//5.2) Download response blob.
async function doDownload(request: Request, response: Response): Promise<unknown> {
    if (!use.downloadjs) {
        throw Error("owp.http: Download option requires owp.http-get");
    }

    //First collecct needed data in case the responseInterceptor removes it.
    const blob = response.data;
    const contentType = response.headers["content-type"];
    const filename = request.filename || calcFilename(response, contentType);

    const res = await evalResponse(request, response);

    //Last download in case of responseInterceptor throws exception.
    use.downloadjs(blob, filename, contentType);

    return res;
}

function calcBody(json?: unknown, data?: string): string | undefined {
    if (json) {
        return JSON.stringify(json);
    }
    //Convert object to query param string.
    if (typeof data === "object" && data != null) {
        return calcQueryParmsString(data);
    }
    //Simple data.
    return data;
}

function calcContentType(contentType?: string, json?: unknown, data?: string): string {
    if (contentType) {
        return contentType;
    }
    if (json) {
        return "application/json";
    }
    if (data) {
        switch (typeof data) {
            case "boolean":
            case "number":
            case "string":
                return "text/plain";
        }
    }
    //Default content type.
    return "application/x-www-form-urlencoded; charset=UTF-8";
}

function calcQueryParmsString(params: Record<string, Param | Param[]>): string {
    const parts = [];
    for (const i in params) {
        const key = encodeURIComponent(i);
        const value = params[i];
        //Array of values
        if (Array.isArray(value)) {
            for (const item of value) {
                if (item != null) {
                    parts.push(`${key}=${encodeURIComponent(item)}`);
                }
            }
        }
        //Single value
        else if (value != null) {
            parts.push(`${key}=${encodeURIComponent(value)}`);
        }
    }
    return parts.join("&");
}

function calcFullResponse(xhr: XMLHttpRequest): Response {
    const hasText = xhr.responseType === "" || xhr.responseType === "text";
    const headers = getHeaders(xhr);
    return {
        ok: (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304,
        url: xhr.responseURL,
        status: xhr.status,
        statusText: xhr.statusText,
        headers,
        data: getData(xhr, headers, hasText),
        text: hasText ? xhr.responseText : null
    };
}

function calcJsonpFullResponse(ok: boolean, url: string, data: unknown): Response {
    return {
        ok,
        url,
        status: ok ? 200 : 400,
        statusText: ok ? "OK" : "Bad Request",
        headers: {},
        data,
        text: null
    };
}

function getData(xhr: XMLHttpRequest, headers: Record<string, string>, hasText: boolean): unknown {
    //Already json in response.
    if (xhr.responseType === "json") {
        return xhr.response;
    }
    if (hasText) {
        //Check if text response is json.
        const contentType = headers["content-type"];
        if (contentType && contentType.includes("json")) {
            return JSON.parse(xhr.responseText);
        }
    }
    //Return default response.
    return xhr.response;
}

function getHeaders(xhr: XMLHttpRequest): Record<string, string> {
    const result: Record<string, string> = {};
    const headerStrings = xhr.getAllResponseHeaders().split("\r\n");
    for (const header of headerStrings) {
        if (header) {
            const parts = header.split(": ");
            result[parts[0].toLowerCase()] = parts[1];
        }
    }
    return result;
}

function calcFilename(response: Response, contentType: string): string {
    //First look for content-disposition header.
    const disposition = response.headers["content-disposition"];
    if (disposition) {
        const i = disposition.indexOf("filename=") + "filename=".length + 1;
        return disposition.substring(i, disposition.length - 1);
    }
    //Then use last part of url.
    let url = response.url;
    const i = url.indexOf("?");
    if (i > -1) {
        url = url.substring(0, i);
    }
    const parts = url.split("/").filter(Boolean);
    const name = parts.length ? parts[parts.length - 1] : "file";
    //If content type is json make sure it has a json ending.
    const ext =
        contentType.includes("json") && !name.toLowerCase().endsWith(".json") ? ".json" : "";
    return name + ext;
}
