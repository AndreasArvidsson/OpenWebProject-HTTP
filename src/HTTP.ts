/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-HTTP
 */

import cloneDeep from "lodash.clonedeep";
import type { Arg, InternalOptions, Method, Options } from "./types";
import { xhr } from "./xhr";

export default class HTTP {
    static options: Options = {};
    options: InternalOptions;

    static get(url: string, ...args: Arg[]) {
        return staticXhr("GET", url, args);
    }
    static delete(url: string, ...args: Arg[]) {
        return staticXhr("DELETE", url, args);
    }
    static head(url: string, ...args: Arg[]) {
        return staticXhr("HEAD", url, args);
    }
    static put(url: string, ...args: Arg[]) {
        return staticXhr("PUT", url, args);
    }
    static patch(url: string, ...args: Arg[]) {
        return staticXhr("PATCH", url, args);
    }
    static post(url: string, ...args: Arg[]) {
        return staticXhr("POST", url, args);
    }
    static jsonp(url: string, ...args: Arg[]) {
        return staticXhr("JSONP", url, args);
    }

    static useOptions(options: Options) {
        mergeOptions(HTTP.options, options);
    }

    constructor(http: HTTP, ...args: Arg[]);
    constructor(url: string, ...args: Arg[]);
    constructor(urlOrHttp: string | HTTP, ...args: Arg[]) {
        //Sub instance called internally by path().
        if (urlOrHttp instanceof HTTP) {
            this.options = cloneDeep(urlOrHttp.options);
            parseArguments(this.options, args);
        }
        //Normal instance created by user.
        else {
            this.options = constructOptions(urlOrHttp, args);
        }
    }

    get(...args: Arg[]) {
        return this.xhr("GET", args);
    }
    delete(...args: Arg[]) {
        return this.xhr("DELETE", args);
    }
    head(...args: Arg[]) {
        return this.xhr("HEAD", args);
    }
    put(...args: Arg[]) {
        return this.xhr("PUT", args);
    }
    patch(...args: Arg[]) {
        return this.xhr("PATCH", args);
    }
    post(...args: Arg[]) {
        return this.xhr("POST", args);
    }
    jsonp(...args: Arg[]) {
        return this.xhr("JSONP", args);
    }

    path(...args: Arg[]) {
        return new HTTP(this, ...args);
    }

    private xhr(method: Method, args: Arg[]) {
        const options = cloneDeep(this.options);
        parseArguments(options, args);
        return xhr({ method, ...options });
    }
}

function staticXhr(method: Method, url: string, args: Arg[]) {
    const options = constructOptions(url, args);
    return xhr({ method, ...options });
}

function constructOptions(url: string, args: Arg[]): InternalOptions {
    const options: InternalOptions = {
        url,
        params: {},
        headers: {}
    };
    mergeOptions(options, HTTP.options);
    parseArguments(options, args);
    return options;
}

function parseArguments(options: InternalOptions, args: Arg[]) {
    const urlParts = [options.url];
    args.forEach((arg) => {
        if (typeof arg === "object") {
            mergeOptions(options, arg);
        } else {
            urlParts.push(encodeURIComponent(arg));
        }
    });
    options.url = urlParts.join("/");
}

function mergeOptions(target: Options, source: Options) {
    const { headers, params, ...rest } = source;
    Object.assign(target, rest);
    target.headers = { ...target.headers, ...headers };
    target.params = { ...target.params, ...params };
}
