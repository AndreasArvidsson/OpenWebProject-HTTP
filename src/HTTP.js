let _onStateChange = null;
let _errorInterceptor = null;

function mergeObjects(target, source) {
    for (const i in source) {
        target[i] = source[i];
    }
}

function deepClone(obj) {
    if (typeof obj === "object") {
        const res = Array.isArray(obj) ? [] : {};
        for (const i in obj) {
            res[i] = deepClone(obj[i]);
        }
        return res;
    }
    return obj;
}

function getQueryParmsString(params, jsonpCallback) {
    const parts = [];
    if (jsonpCallback) {
        parts.push("callback=" + jsonpCallback);
    }
    for (const i in params) {
        const key = encodeURIComponent(i);
        const value = params[i];
        //Array of values
        if (Array.isArray(value)) {
            for (const j in value) {
                parts.push(key + "=" + encodeURIComponent(value[j]));
            }
        }
        //Single value
        else if (value !== undefined && value !== null){
            parts.push(key + "=" + encodeURIComponent(value));
        }
    }
    return parts.join("&");
}

function getFullurl(props, jsonpCallback) {
    const queryString = getQueryParmsString(props.params, jsonpCallback);
    if (queryString) {
        return props.url + "?" + queryString;
    }
    return props.url;
}

function getHeaders() {
    const result = {};
    const headerStrings = this.getAllResponseHeaders().split("\r\n");
    for (const header of headerStrings) {
        if (header) {
            const parts = header.split(": ");
            result[parts[0]] = parts[1];
        }
    }
    return result;
}

function setHeaders(xmlhttp, props) {
    if (props.headers) {
        for (const i in props.headers) {
            xmlhttp.setRequestHeader(i, props.headers[i]);
        }
    }
}

function calculateContentType(props) {
    if (props.contentType) {
        return props.contentType;
    }
    if (props.json) {
        return "application/json";
    }
    if (props.data) {
        switch(typeof props.data) {
            case "boolean":
            case "number":
            case "string":
                return "text/plain";
        }
    }
    //Default content type.
    return "application/x-www-form-urlencoded; charset=UTF-8";
}

function send(xmlhttp, props) {
    xmlhttp.setRequestHeader("Content-Type", calculateContentType(props));
    if (props.json) {
        xmlhttp.send(JSON.stringify(props.json));
    }
    else if (props.data) {
        //Convert object to query param string.
        if (typeof props.data === "object") {
            xmlhttp.send(getQueryParmsString(props.data));
        }
        //Simple data. Just send.
        else {
            xmlhttp.send(props.data);
        }
    }
    //Send with no data.
    else {
        xmlhttp.send();
    }
}

function updateProps(props, newProps) {
    if (newProps) {
        if (newProps.headers) {
            mergeObjects(props.headers, newProps.headers);
        }
        if (newProps.params) {
            mergeObjects(props.params, newProps.params);
        }
    }
    return props;
}

function getData(xmlhttp) {
    //Already json in response.
    if (xmlhttp.responseType === "json") {
        return xmlhttp.response
    }
    //Check if text response is json.
    const contentType = xmlhttp.getResponseHeader("Content-Type");
    if (contentType && contentType.includes("json")) {
        return JSON.parse(xmlhttp.responseText); 
    }
    //Return default response.
    return xmlhttp.response
}

function getFullResponse(xmlhttp) {
    return {
        url: xmlhttp.responseURL,
        statusCode: xmlhttp.status,
        statusText: xmlhttp.statusText,
        responseText: xmlhttp.responseType === "" || xmlhttp.responseType === "text" ? xmlhttp.responseText : null,
        data: getData(xmlhttp),
        headers: getHeaders.bind(xmlhttp),
        getHeader: xmlhttp.getResponseHeader.bind(xmlhttp)
    };
}

function getResponse(xmlhttp, fullResponse) {
    if (fullResponse) {
        return getFullResponse(xmlhttp);
    }
    return getData(xmlhttp);
}

function getJsonpFullResonse(data, url) {
    return {
        url: url,
        statusCode: data !== null ? 200 : 400,
        statusText: data !== null ? "OK" : "Bad Request",
        responseText: null,
        data: data,
        headers: function() {
            return {};
        },
        getHeader: function() {
            return null;
        }
    };
}

function getJsonpResonse(data, url, fullResponse) {
    if (fullResponse) {
       return getJsonpFullResonse(data, url);
    }
    return data;
}

function jsonp(props) {
    return new Promise(function(resolve, reject) {
        const callbackName = "jsonpCallback_" + Math.round(100000 * Math.random());
        const url = getFullurl(props, callbackName);
        const script = document.createElement("script");
        script.src = url;
        script.onerror = function() {
            reject(getJsonpFullResonse(null, url));
        };
        window[callbackName] = function(data) {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(getJsonpResonse(data, url, props.fullResponse));
        };
        document.body.appendChild(script);
    });
}

function http(method, props, ignoreErrorInterceptor) {
    return new Promise(function (resolve, reject) {
        const xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function () {
            if (_onStateChange) {
                _onStateChange(this.readyState);
            }
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 300 || this.status === 304) {
                    resolve(getResponse(this, props.fullResponse));
                }
                else {
                    const error = getFullResponse(this);
                    if (_errorInterceptor && !ignoreErrorInterceptor) {
                        const repeat = function(newProps) {
                            return http(method, updateProps(props, newProps), true);
                        }
                        //If error intereptor returns false dont't continue with rejection.
                        if (_errorInterceptor(error, repeat, resolve, reject) !== false) {
                            reject(error);
                        }
                    }
                    else {
                        reject(error);
                    }
                }
            }
        };
        //responseType
        xmlhttp.open(method, getFullurl(props), true); //async = true
        if (props.responseType) {
            xmlhttp.responseType = props.responseType;
        }
        setHeaders(xmlhttp, props);
        send(xmlhttp, props);
    });
}

function parseArguments(args, allowData, result) {
    if (!result) {
        result = {
            url: "",
            headers: {},
            params: {}
        }
    }
    const urlParts = [];
    if (result.url) {
        urlParts.push(result.url);
    }
    let i = 0;
    while (args[i] !== undefined && typeof args[i] !== "object") {
        if (urlParts.length) {
            urlParts.push(encodeURIComponent(args[i++]));
        }
        //Dont encode first url part
        else {
            urlParts.push(args[i++]);
        }
    }
    result.url = urlParts.join("/");

    if(typeof args[i] === "object") {
        const obj = args[i];
        if (obj.headers) {
            mergeObjects(result.headers, obj.headers);
        }
        if (obj.params) {
            mergeObjects(result.params, obj.params);
        }
        if (obj.fullResponse !== undefined) {
            result.fullResponse = obj.fullResponse;
        }
        if (obj.jsonp !== undefined) {
            result.jsonp = obj.jsonp;
        }
        if (obj.responseType !== undefined) {
            result.responseType = obj.responseType;
        }
        if (obj.contentType) {
            result.contentType = obj.contentType;
        }
        if (allowData) {
            if (obj.json) {
                result.json = obj.json;
            }
            else if (obj.data) {
                result.data = obj.data;
            }
        }
    }    
    return result;
}

function getInstanceBaseArguments(http) {
    return {
        url: http.url,
        fullResponse: http.fullResponse,
        responseType: http.responseType,
        headers: deepClone(http.headers),
        params: deepClone(http.params)
    }
}

export default class HTTP {

    static get() {
        return http("GET", parseArguments(arguments, false));
    }
    static delete() {
        return http("DELETE", parseArguments(arguments, false));
    }
    static head() {
        return http("HEAD", parseArguments(arguments, false));
    }
    static put() {
        return http("PUT", parseArguments(arguments, true));
    }
    static patch() {
        return http("PATCH", parseArguments(arguments, true));
    }
    static post() {
        return http("POST", parseArguments(arguments, true));
    }
    static jsonp() {
        return jsonp(parseArguments(arguments, true));
    }

    static setOnStateChange(onStateChange) {
        _onStateChange = onStateChange;
    }
    static setErrorInterceptor(errorInterceptor) {
        _errorInterceptor = errorInterceptor;
    }

    constructor() {
        this.url = "";
        this.headers = {};
        this.params = {};
        this.fullResponse = false;
        this.responseType = "";
        parseArguments(arguments, false, this);
    }

    get() {
        return http("GET", parseArguments(arguments, false, getInstanceBaseArguments(this)));
    }
    delete() {
        return http("DELETE", parseArguments(arguments, false, getInstanceBaseArguments(this)));
    }
    head() {
        return http("HEAD", parseArguments(arguments, false, getInstanceBaseArguments(this)));
    }
    put() {
        return http("PUT", parseArguments(arguments, true, getInstanceBaseArguments(this)));
    }
    patch() {
        return http("PATCH", parseArguments(arguments, true, getInstanceBaseArguments(this)));
    }
    post() {
        return http("POST", parseArguments(arguments, true, getInstanceBaseArguments(this)));
    }
    jsonp() {
        return jsonp(parseArguments(arguments, true, getInstanceBaseArguments(this)));
    }

    getUrl() {
        return this.url;
    }

    setHeader(key, value) {
        this.headers[key] = value;
    }

    setHeaders(headers) {
        for (const key in headers) {
            this.headers[key] = headers[key];
        }
    }

    setFullResponse(fullResponse) {
        this.fullResponse = fullResponse;
    }

    setResponseType(responseType) {
        this.responseType = responseType;
    }

    path() {
        const urlParts = [];
        if (this.url) {
            urlParts.push(this.url);
        }
        for (const part of arguments) {
            urlParts.push(encodeURIComponent(part));
        }
        return new HTTP(urlParts.join("/"), this);
    }

}