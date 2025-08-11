export function xhrToText(xhr: XMLHttpRequest): string {
    if (xhrHasText(xhr)) {
        return xhr.responseText;
    }

    if (xhrIsJson(xhr)) {
        return JSON.stringify(xhr.response);
    }

    throw Error("Response is not text");
}

export function xhrToJson<T>(xhr: XMLHttpRequest): T {
    if (xhrIsJson(xhr)) {
        return xhr.response as T;
    }

    if (xhrHasText(xhr) && xhr.responseText) {
        return JSON.parse(xhr.responseText) as T;
    }

    throw Error("Response is not JSON");
}

function xhrHasText(xhr: XMLHttpRequest): boolean {
    return xhr.responseType === "" || xhr.responseType === "text";
}

function xhrIsJson(xhr: XMLHttpRequest): boolean {
    return xhr.responseType === "json";
}
