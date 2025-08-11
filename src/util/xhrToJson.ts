export function xhrToJson<T>(xhr: XMLHttpRequest): T {
    if (xhr.responseType === "json") {
        return xhr.response;
    }

    if (xhr.responseText) {
        return JSON.parse(xhr.responseText);
    }

    throw new Error("Response is not JSON");
}
