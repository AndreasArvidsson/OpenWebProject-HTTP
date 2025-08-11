import cache from "./cache";
import { execJsonp } from "./execJsonp";
import { execXhr } from "./execXhr";
import type { HttpResponse } from "./HttpResponse";
import type { HttpRequest } from "./types";
import { calcQueryParmsString } from "./util/calcQueryParmsString";

export async function execRequest({
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
            ? execJsonp(url, queryString != null, request)
            : execXhr(url, method, request);
    };

    let response = request.cache
        ? await cache.get(method + url, process)
        : await process();

    // Response based on interceptor.
    if (request.responseInterceptor != null) {
        response = await Promise.resolve(request.responseInterceptor(response));
    }

    if (response.ok) {
        return response;
    }

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw response;
}
