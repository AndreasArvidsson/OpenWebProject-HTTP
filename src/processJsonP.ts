import type { HttpResponse } from "./HttpResponse";
import type { HttpRequest } from "./types";

export function processJsonP(
    url: string,
    paramsUsed: boolean,
    request: HttpRequest,
): Promise<HttpResponse> {
    return new Promise((resolve) => {
        const { stateChangeInterceptor } = request;
        const callbackName = `jsonp_${Date.now()}_${Math.round(1000000 * Math.random())}`;
        const script = document.createElement("script");
        script.src = `${url}${paramsUsed ? "&" : "?"}callback=${callbackName}`;

        const done = (ok: boolean, data: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            delete (window as any)[callbackName];
            document.body.removeChild(script);

            if (stateChangeInterceptor != null) {
                stateChangeInterceptor(XMLHttpRequest.DONE);
            }

            function calcJsonpFullResponse(
                ok: boolean,
                url: string,
                data: any,
            ): HttpResponse {
                return {
                    ok,
                    url,
                    status: ok ? 200 : 400,
                    statusText: ok ? "OK" : "Bad Request",
                    headers: {},
                    data,
                    text: null,
                };
            }

            resolve(calcJsonpFullResponse(ok, url, data));
        };

        //On success callback
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (window as any)[callbackName] = (data: any) => {
            done(true, data);
        };

        script.onerror = () => {
            done(false, null);
        };

        if (stateChangeInterceptor != null) {
            stateChangerInterceptor(XMLHttpRequest.OPENED);
        }

        document.body.appendChild(script);
    });
}
