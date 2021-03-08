/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-HTTP
 */

import xhr from "./xhr";

const classOptions = {};


export default class HTTP {

    static get(url, ...args) {
        return http("GET", parseInitArgs(url, args));
    }
    static delete(url, ...args) {
        return http("DELETE", parseInitArgs(url, args));
    }
    static head(url, ...args) {
        return http("HEAD", parseInitArgs(url, args));
    }
    static put(url, ...args) {
        return http("PUT", parseInitArgs(url, args));
    }
    static patch(url, ...args) {
        return http("PATCH", parseInitArgs(url, args));
    }
    static post(url, ...args) {
        return http("POST", parseInitArgs(url, args));
    }
    static jsonp(url, ...args) {
        return http("JSONP", parseInitArgs(url, args));
    }

    static options(options) {
        mergeOptions(classOptions, options);
    }

    constructor(url, ...args) {
        //Url is options from parent instance.
        if (typeof url === "object") {
            this.options = parseArguments(url, args);
        }
        else {
            this.options = parseInitArgs(url, args);
        }
    }

    get(...args) {
        return http("GET", parseArguments(this.options, args));
    }
    delete(...args) {
        return http("DELETE", parseArguments(this.options, args));
    }
    head(...args) {
        return http("HEAD", parseArguments(this.options, args));
    }
    put(...args) {
        return http("PUT", parseArguments(this.options, args));
    }
    patch(...args) {
        return http("PATCH", parseArguments(this.options, args));
    }
    post(...args) {
        return http("POST", parseArguments(this.options, args));
    }
    jsonp(...args) {
        return http("JSONP", parseArguments(this.options, args));
    }

    path(...args) {
        return new HTTP(this.options, ...args);
    }

};

export { default as register } from "./register";

const http = (method, options) => {
    return xhr({ method, ...options });
};

const parseInitArgs = (url, args) => {
    const options = {
        url,
        params: {},
        headers: {}
    };
    mergeOptions(options, classOptions);
    return parseArguments(options, args);
}

const parseArguments = (options, args) => {
    const res = deepClone(options);
    const urlParts = [res.url];
    args.forEach(arg => {
        if (typeof arg === "object") {
            mergeOptions(res, arg);
        }
        else {
            urlParts.push(encodeURIComponent(arg));
        }
    });
    res.url = urlParts.join("/");
    return res;
};

const mergeOptions = (target, source) => {
    for (const i in source) {
        switch (i) {
            case "headers":
            case "params":
                target[i] = { ...target[i], ...source[i] };
                break;
            case "requestInterceptor":
            case "responseInterceptor":
            case "stateChangeInterceptor":
            case "cache":
            case "fullResponse":
            case "method":
            case "json":
            case "data":
            case "contentType":
            case "responseType":
            case "download":
            case "filename":
                target[i] = source[i];
                break;
            default:
                throw Error(`owp.HTTP: Unknown option: '${i}'`)
        }
    }
    return target;
};

const deepClone = (obj) => {
    if (typeof obj === "object" && obj !== null) {
        const res = Array.isArray(obj) ? [] : {};
        for (const i in obj) {
            res[i] = deepClone(obj[i]);
        }
        return res;
    }
    return obj;
};