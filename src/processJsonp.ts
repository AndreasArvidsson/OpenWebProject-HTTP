import { JsonpResponse, type HttpResponse } from "./HttpResponse";
import type { HttpRequest } from "./types";

type WindowWithJsonP = Window & {
    [key: string]: unknown;
};

const myWindow = window as unknown as WindowWithJsonP;

export function processJsonp(
    url: string,
    paramsUsed: boolean,
    request: HttpRequest,
): Promise<HttpResponse> {
    return new Promise((resolve) => {
        const { stateChangeInterceptor } = request;
        const callbackName = `jsonp_${Date.now()}_${Math.round(1000000 * Math.random())}`;
        const script = document.createElement("script");
        script.src = `${url}${paramsUsed ? "&" : "?"}callback=${callbackName}`;

        const done = (ok: boolean, text: string) => {
            delete myWindow[callbackName];
            document.body.removeChild(script);

            if (stateChangeInterceptor != null) {
                stateChangeInterceptor(XMLHttpRequest.DONE);
            }

            resolve(
                new JsonpResponse(
                    url,
                    ok ? 200 : 400,
                    ok ? "OK" : "Bad Request",
                    text,
                ),
            );
        };

        // On success callback
        myWindow[callbackName] = (data: string) => {
            done(true, data);
        };

        script.onerror = () => {
            done(false, "");
        };

        if (stateChangeInterceptor != null) {
            stateChangeInterceptor(XMLHttpRequest.OPENED);
        }

        document.body.appendChild(script);
    });
}
