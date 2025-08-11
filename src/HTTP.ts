/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-HTTP
 */

import { processRequest } from "./processRequest";
import type { HttpOptions, Method, PathParam } from "./types";
import { mergeOptions } from "./util/mergeOptions";
import { updateUrl } from "./util/updateUrl";

export default class HTTP {
    private static options: HttpOptions = {};

    private url: string;
    private options: HttpOptions;

    static get(url: string, options?: HttpOptions) {
        return HTTP.process("GET", url, options);
    }
    static delete(url: string, options?: HttpOptions) {
        return HTTP.process("DELETE", url, options);
    }
    static head(url: string, options?: HttpOptions) {
        return HTTP.process("HEAD", url, options);
    }
    static put(url: string, options?: HttpOptions) {
        return HTTP.process("PUT", url, options);
    }
    static patch(url: string, options?: HttpOptions) {
        return HTTP.process("PATCH", url, options);
    }
    static post(url: string, options?: HttpOptions) {
        return HTTP.process("POST", url, options);
    }
    static jsonp(url: string, options?: HttpOptions) {
        return HTTP.process("JSONP", url, options);
    }

    static useOptions(options: HttpOptions) {
        mergeOptions(HTTP.options, options);
    }

    private static process(
        method: Method,
        url: string,
        optionsA?: HttpOptions,
        optionsB?: HttpOptions,
    ) {
        const updatedOptions = mergeOptions(HTTP.options, optionsA, optionsB);
        return processRequest({ url, method, ...updatedOptions });
    }

    constructor(url: string, options: HttpOptions = {}) {
        this.url = url;
        this.options = options;
    }

    get(options?: HttpOptions) {
        return this.process("GET", options);
    }
    delete(options?: HttpOptions) {
        return this.process("DELETE", options);
    }
    head(options?: HttpOptions) {
        return this.process("HEAD", options);
    }
    put(options?: HttpOptions) {
        return this.process("PUT", options);
    }
    patch(options?: HttpOptions) {
        return this.process("PATCH", options);
    }
    post(options?: HttpOptions) {
        return this.process("POST", options);
    }
    jsonp(options?: HttpOptions) {
        return this.process("JSONP", options);
    }

    path(...params: PathParam[]) {
        const url = updateUrl(this.url, params);
        return new HTTP(url, this.options);
    }

    private process(method: Method, options: HttpOptions | undefined) {
        return HTTP.process(method, this.url, this.options, options);
    }
}
