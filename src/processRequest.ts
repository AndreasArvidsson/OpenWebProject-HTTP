import cache from "./cache";
import type { HttpResponse } from "./HttpResponse";
import { processJsonp } from "./processJsonp";
import { processXhr } from "./processXhr";
import type { HttpRequest } from "./types";
import { calcQueryParmsString } from "./util/calcQueryParmsString";

export async function processRequest({
    requestInterceptor,
    ...request
}: HttpRequest): Promise<HttpResponse> {
    if (requestInterceptor != null) {
        request = await Promise.resolve(requestInterceptor(request));
    }

    const { method } = request;
    const queryString = calcQueryParmsString(request.params);
    const url =
        queryString != null ? `${request.url}?${queryString}` : request.url;

    const process = () => {
        return method === "JSONP"
            ? processJsonp(url, queryString != null, request)
            : processXhr(url, method, request);
    };

    const response = request.cache
        ? await cache.get(method + url, process)
        : await process();

    // Response based on interceptor.
    if (request.responseInterceptor != null) {
        return request.responseInterceptor(response);
    }

    if (response.ok) {
        return response;
    }

    throw response;
}
