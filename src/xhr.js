import _cache from "./cache";
import use from "./use";
import deepClone from "./deepClone";

//1) Update request using interceptor.
export default async ({ requestInterceptor, ...request }) => {
    if (requestInterceptor) {
        request = requestInterceptor(request);
        if (request instanceof Promise) {
            request = await request;
            return evaluateRequest(request);
        }
    }
    return evaluateRequest(request);
};

//2) Evaluate request. Check in cache.
const evaluateRequest = async ({
    url,
    method = "GET",
    cache = false,
    params = {},
    ...rest
}) => {
    const queryString = calcQueryParmsString(params);
    if (queryString) {
        url = `${url}?${queryString}`;
    }

    let response;
    if (cache) {
        const res = await _cache.get(
            method + url,
            () => performRequest(url, method, !!queryString, rest)
        );
        //Make sure each hit of the cache resturns a unique copy.
        response = deepClone(res);
    }
    else {
        response = await performRequest(url, method, !!queryString, rest);
    }

    if (rest.download) {
        return doDownload(method, response, rest);
    }

    return evalResponse({ method, response, ...rest });
};

//3) Perform request. Actually perform an external action.
const performRequest = (url, method, paramsUsed, rest) => {
    if (method === "JSONP") {
        return doJsonp(url, paramsUsed, rest);
    }
    return doXhr(url, method, rest);
};

//4.1) Perform HTTP request.
const doXhr = (url, method, {
    data,
    json,
    contentType,
    responseType,
    headers = {},
    download,
    stateChangeInterceptor,
}) => new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = download ? "blob" : responseType;

    xhr.onreadystatechange = () => {
        if (stateChangeInterceptor) {
            stateChangeInterceptor(xhr.readyState);
        }
        if (xhr.readyState === XMLHttpRequest.DONE) {
            resolve(
                calcFullResponse(xhr)
            );
        }
    };

    xhr.open(method, url, true); //async

    for (const i in headers) {
        if (headers[i] !== undefined && headers[i] !== null) {
            xhr.setRequestHeader(i, headers[i]);
        }
    }

    xhr.setRequestHeader(
        "content-type",
        calcContentType(contentType, json, data)
    );

    xhr.send(
        calcBody(json, data)
    );
});

//4.2) Perform JsonP request.
const doJsonp = (url, paramsUsed, { stateChangeInterceptor }) => new Promise(resolve => {
    const callbackName = `jsonp_${Date.now()}_${Math.round(1000000 * Math.random())}`;
    const script = document.createElement("script");
    script.src = `${url}${paramsUsed ? "&" : "?"}callback=${callbackName}`;

    const done = (ok, data) => {
        delete window[callbackName];
        document.body.removeChild(script);
        if (stateChangeInterceptor) {
            stateChangeInterceptor(XMLHttpRequest.DONE);
        }
        resolve(
            calcJsonpFullResponse(ok, url, data)
        );
    };

    //On success callback
    window[callbackName] = (data) => {
        done(true, data);
    };

    script.onerror = () => {
        done(false, null);
    };

    if (stateChangeInterceptor) {
        stateChangeInterceptor(XMLHttpRequest.OPENED);
    }

    document.body.appendChild(script);
});

//5.1) Evaluate response. Update with interceptor.
const evalResponse = async ({ fullResponse, response, responseInterceptor }) => {
    const ok = response.ok;
    //Response based on interceptor.
    if (responseInterceptor) {
        response = responseInterceptor(response);
        //If response is a promise just use it for resolve/reject.
        if (response instanceof Promise) {
            return response;
        }
        //Return ok response.
        else if (ok) {
            return response;
        }
    }
    //Response based on 'fullResponse'
    else if (ok) {
        return fullResponse ? response : response.data;
    }
    //Rejection always gets the full response.
    throw response;
};

//5.2) Download response blob.
const doDownload = async (method, response, rest) => {
    if (!use.downloadjs) {
        throw "owp.http: Download option requires owp.http-get";
    }

    //First collecct needed data in case the responseInterceptor removes it.
    const blob = response.data;
    const contentType = response.headers["content-type"];
    const filename = rest.filename || calcFilename(response, contentType);

    response = await evalResponse({ method, response, ...rest });

    //Last download in case of responseInterceptor throws exception.
    use.downloadjs(blob, filename, contentType);

    return response;
};

const calcBody = (json, data) => {
    if (json) {
        return JSON.stringify(json);
    }
    //Convert object to query param string.
    if (typeof data === "object") {
        return calcQueryParmsString(data);
    }
    //Simple data.
    return data;
};

const calcContentType = (contentType, json, data) => {
    if (contentType) {
        return contentType;
    }
    if (json) {
        return "application/json";
    }
    if (data) {
        switch (typeof data) {
            case "boolean":
            case "number":
            case "string":
                return "text/plain";
        }
    }
    //Default content type.
    return "application/x-www-form-urlencoded; charset=UTF-8";
};

const calcQueryParmsString = (params) => {
    const parts = [];
    for (const i in params) {
        const key = encodeURIComponent(i);
        const value = params[i];
        //Array of values
        if (Array.isArray(value)) {
            for (const j in value) {
                parts.push(`${key}=${encodeURIComponent(value[j])}`);
            }
        }
        //Single value
        else if (value !== undefined && value !== null) {
            parts.push(`${key}=${encodeURIComponent(value)}`);
        }
    }
    return parts.join("&");
};

const calcFullResponse = (xhr) => {
    const hasText = xhr.responseType === "" || xhr.responseType === "text";
    const headers = getHeaders(xhr);
    return {
        ok: xhr.status >= 200 && xhr.status < 300 || xhr.status === 304,
        url: xhr.responseURL,
        status: xhr.status,
        statusText: xhr.statusText,
        headers,
        data: getData(xhr, headers, hasText),
        text: hasText ? xhr.responseText : null
    };
};

const calcJsonpFullResponse = (ok, url, data) => ({
    ok,
    url,
    status: ok ? 200 : 400,
    statusText: ok ? "OK" : "Bad Request",
    headers: {},
    data,
    text: null
});

const getData = (xhr, headers, hasText) => {
    //Already json in response.
    if (xhr.responseType === "json") {
        return xhr.response;
    }
    if (hasText) {
        //Check if text response is json.
        const contentType = headers["content-type"];
        if (contentType && contentType.includes("json")) {
            return JSON.parse(xhr.responseText);
        }
    }
    //Return default response.
    return xhr.response;
};

const getHeaders = (xhr) => {
    const result = {};
    const headerStrings = xhr.getAllResponseHeaders().split("\r\n");
    for (const header of headerStrings) {
        if (header) {
            const parts = header.split(": ");
            result[parts[0].toLowerCase()] = parts[1];
        }
    }
    return result;
};

const calcFilename = (response, contentType) => {
    //First look for content-disposition header.
    const disposition = response.headers["content-disposition"];
    if (disposition) {
        const i = disposition.indexOf("filename=") + "filename=".length + 1;
        return disposition.substring(i, disposition.length - 1);
    }
    //Then use last part of url.
    let url = response.url;
    const i = url.indexOf("?");
    if (i > -1) {
        url = url.substring(0, i);
    }
    const parts = url.split(/\//).filter(Boolean);
    if (parts.length) {
        const name = parts[parts.length - 1];
        //If content type is json make sure it has a json ending.
        const ext = contentType.includes("json")
            && !name.toLowerCase().endsWith(".json") ? ".json" : "";
        return name + ext;
    }
};