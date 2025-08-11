import { HttpResponse } from "./HttpResponse";
import type { HttpRequest, Method } from "./types";
import { calcQueryParmsString } from "./util/calcQueryParmsString";

export function processXhr(
    url: string,
    method: Method,
    {
        data,
        json,
        contentType,
        responseType,
        headers,
        stateChangeInterceptor,
        progressInterceptor,
    }: HttpRequest,
): Promise<HttpResponse> {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.responseType = responseType ?? "";

        if (stateChangeInterceptor != null) {
            xhr.onreadystatechange = () => {
                stateChangeInterceptor(xhr.readyState);
            };
        }

        if (progressInterceptor != null) {
            xhr.onprogress = (e) => {
                progressInterceptor(e.loaded, e.lengthComputable ? e.total : 0);
            };
        }

        xhr.onloadend = () => {
            resolve(new HttpResponse(xhr));
        };

        // async=true
        xhr.open(method, url, true);

        for (const i in headers) {
            const header = headers[i];
            if (header != null) {
                xhr.setRequestHeader(i, header);
            }
        }

        xhr.setRequestHeader(
            "content-type",
            calcContentType(contentType, json, data),
        );

        xhr.send(calcBody(json, data));
    });
}

function calcBody(json?: object, data?: string): string | undefined {
    if (json) {
        return JSON.stringify(json);
    }

    // Convert object to query param string.
    if (typeof data === "object" && data != null) {
        return calcQueryParmsString(data);
    }

    // Simple data.
    return data;
}

function calcContentType(
    contentType?: string,
    json?: object,
    data?: string,
): string {
    if (contentType != null) {
        return contentType;
    }

    if (json != null) {
        return "application/json";
    }

    if (data != null) {
        switch (typeof data) {
            case "boolean":
            case "number":
            case "string":
                return "text/plain";
        }
    }

    // Default content type.
    return "application/x-www-form-urlencoded; charset=UTF-8";
}
