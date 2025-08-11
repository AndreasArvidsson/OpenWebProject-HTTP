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

        xhr.open(method, url, true); //async

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

//5.1) Evaluate response. Update with interceptor.
function evalResponse(
    request: HttpRequest,
    response: HttpResponse,
): HttpResponse {
    //Response based on interceptor.
    if (request.responseInterceptor != null) {
        return request.responseInterceptor(response);
    }

    //Response based on 'fullResponse'
    if (response.ok) {
        return response;
    }

    //Rejection always gets the full response.
    throw response;
}

function calcBody(json?: object, data?: string): string | undefined {
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

function calcContentType(
    contentType?: string,
    json?: object,
    data?: string,
): string {
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
