/**
 * @author Andreas Arvidsson
 * https://github.com/AndreasArvidsson/OpenWebProject-HTTP
 */

import deepClone from "./deepClone";
import XHR from "./XHR";

class HTTP {

    static get(...args) {
        return staticXhr("GET", args);
    }
    static delete(...args) {
        return staticXhr("DELETE", args);
    }
    static head(...args) {
        return staticXhr("HEAD", args);
    }
    static put(...args) {
        return staticXhr("PUT", args);
    }
    static patch(...args) {
        return staticXhr("PATCH", args);
    }
    static post(...args) {
        return staticXhr("POST", args);
    }
    static jsonp(...args) {
        return staticXhr("JSONP", args);
    }

    static useOptions(options) {
        mergeOptions(HTTP.options, options);
    }

    constructor(...args) {
        //Sub instance called internally by path().
        if (args[0] instanceof HTTP) {
            this.options = deepClone(args[0].options);
            parseArguments(this.options, args[1]);
        }
        //Normal instance created by user.
        else {
            this.options = constructOptions(args);
        }
    }

    get(...args) {
        return xhr("GET", this, args);
    }
    delete(...args) {
        return xhr("DELETE", this, args);
    }
    head(...args) {
        return xhr("HEAD", this, args);
    }
    put(...args) {
        return xhr("PUT", this, args);
    }
    patch(...args) {
        return xhr("PATCH", this, args);
    }
    post(...args) {
        return xhr("POST", this, args);
    }
    jsonp(...args) {
        return xhr("JSONP", this, args);
    }

    path(...args) {
        return new HTTP(this, args);
    }

}

HTTP.options = {};

export default HTTP;

const staticXhr = (method, args) => {
    const options = constructOptions(args);
    return XHR({ method, ...options });
};

const xhr = (method, http, args) => {
    const options = deepClone(http.options);
    parseArguments(options, args);
    return XHR({ method, ...options });
};

const constructOptions = (args) => {
    const options = {
        url: undefined,
        params: {},
        headers: {}
    };
    mergeOptions(options, HTTP.options);
    parseArguments(options, args, true);
    return options;
}

const parseArguments = (options, args, dontEncodeFirstString = false) => {
    const urlParts = [];
    if (options.url !== undefined) {
        urlParts.push(options.url);
    }
    args.forEach(arg => {
        if (typeof arg === "object") {
            mergeOptions(options, arg);
        }
        else {
            if (dontEncodeFirstString) {
                dontEncodeFirstString = false;
                urlParts.push(arg);
            }
            else {
                urlParts.push(encodeURIComponent(arg));
            }
        }
    });
    options.url = urlParts.join("/");
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