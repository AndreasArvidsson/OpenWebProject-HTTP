export function xhrHasText(xhr: XMLHttpRequest): boolean {
    return xhr.responseType === "" || xhr.responseType === "text";
}
