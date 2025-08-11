export function xhrToJson<T>(xhr: XMLHttpRequest): T {
    if (xhr.responseType === "json") {
        return xhr.response as T;
    }

    return textToJson<T>(xhr.responseText);
}

export function textToJson<T>(responseText: string): T {
    if (responseText) {
        return JSON.parse(responseText) as T;
    }

    throw new Error("Response is not JSON");
}
