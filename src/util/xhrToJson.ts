import { xhrHasText } from "./xhrHasText";

export function xhrToJson<T>(xhr: XMLHttpRequest): T {
    if (xhr.responseType === "json") {
        return xhr.response as T;
    }

    if (xhrHasText(xhr) && xhr.responseText) {
        return JSON.parse(xhr.responseText) as T;
    }

    throw new Error("Response is not JSON");
}
