import type { HttpResponse } from "./HttpResponse";
import { XhrResponse } from "./HttpResponse";
import type { HttpRequest, Json, Method } from "./types";
import { calcQueryParmsString } from "./util/calcQueryParmsString";
import { Headers, MimeTypes } from "./util/constants";

export function execXhr(
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
            resolve(new XhrResponse(xhr));
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
            Headers.contentType,
            calcContentType(contentType, json, data),
        );

        xhr.send(calcBody(json, data));
    });
}

function calcBody(json?: Json, data?: string): string | undefined {
    // null is valid json
    if (json !== undefined) {
        return JSON.stringify(json);
    }

    // Convert object to query param string
    if (data != null && typeof data === "object") {
        return calcQueryParmsString(data);
    }

    // Simple data
    return data;
}

function calcContentType(
    contentType?: string,
    json?: Json,
    data?: string,
): string {
    if (contentType != null) {
        return contentType;
    }

    // null is valid json
    if (json !== undefined) {
        return MimeTypes.json;
    }

    if (data != null) {
        switch (typeof data) {
            case "boolean":
            case "number":
            case "string":
                return MimeTypes.text;
        }
    }

    // Default content type
    return MimeTypes.formUrlEncoded;
}
