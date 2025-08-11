/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-HTTP
 */

import { execRequest } from "./execRequest";
import type { HttpOptions, Method, PathParam, Url } from "./types";
import { mergeOptions } from "./util/mergeOptions";
import { parseUrl, updateUrl } from "./util/updateUrl";

export default class HTTP {
    private static options: HttpOptions = {};

    private readonly _url: string;
    private readonly _options: HttpOptions;

    static get(url: Url, options?: HttpOptions) {
        return exec("GET", url, options);
    }
    static delete(url: Url, options?: HttpOptions) {
        return exec("DELETE", url, options);
    }
    static head(url: Url, options?: HttpOptions) {
        return exec("HEAD", url, options);
    }
    static put(url: Url, options?: HttpOptions) {
        return exec("PUT", url, options);
    }
    static patch(url: Url, options?: HttpOptions) {
        return exec("PATCH", url, options);
    }
    static post(url: Url, options?: HttpOptions) {
        return exec("POST", url, options);
    }
    static jsonp(url: Url, options?: HttpOptions) {
        return exec("JSONP", url, options);
    }

    static useOptions(options: HttpOptions) {
        HTTP.options = mergeOptions(HTTP.options, options);
    }
    static setOptions(options: HttpOptions) {
        HTTP.options = options;
    }
    static getOptions(): HttpOptions {
        return HTTP.options;
    }

    constructor(url: Url, options: HttpOptions = {}) {
        this._url = parseUrl(url);
        this._options = mergeOptions(options);
    }

    getUrl(): string {
        return this._url;
    }
    getOptions(): HttpOptions {
        return this._options;
    }

    get(options?: HttpOptions) {
        return this.exec("GET", options);
    }
    delete(options?: HttpOptions) {
        return this.exec("DELETE", options);
    }
    head(options?: HttpOptions) {
        return this.exec("HEAD", options);
    }
    put(options?: HttpOptions) {
        return this.exec("PUT", options);
    }
    patch(options?: HttpOptions) {
        return this.exec("PATCH", options);
    }
    post(options?: HttpOptions) {
        return this.exec("POST", options);
    }
    jsonp(options?: HttpOptions) {
        return this.exec("JSONP", options);
    }

    path(...params: PathParam[]) {
        const url = updateUrl(this._url, params);
        return new HTTP(url, this._options);
    }
    options(options: HttpOptions) {
        const updatedOptions = mergeOptions(this._options, options);
        return new HTTP(this._url, updatedOptions);
    }

    private exec(method: Method, options: HttpOptions | undefined) {
        return exec(method, this._url, this._options, options);
    }
}

function exec(
    method: Method,
    url: Url,
    optionsA?: HttpOptions,
    optionsB?: HttpOptions,
) {
    return execRequest({
        method,
        url: parseUrl(url),
        ...mergeOptions(HTTP.getOptions(), optionsA, optionsB),
    });
}
