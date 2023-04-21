# OpenWebProject HTTP

**HTTP client for JavaScript**

HTTP is a simple and lightweight wrapper for the browsers native XMLHttpRequest functionality.  
The purpose of this utility is to easiliy enable HTTP request without relying on a large framework. No matter if you have a simple standard JS app, uses jQuery or react framework you can make use of HTTP request in the same way.

## Installation and use

```
npm install owp.http --save
```

```javascript
import HTTP from "owp.http";
```

## Static requests

```javascript
HTTP.useOptions(options);
const promise = HTTP.get("http://www.mysite.com/rest/data", options);
const promise = HTTP.delete("http://www.mysite.com/rest/data", options);
const promise = HTTP.head("http://www.mysite.com/rest/data", options);
const promise = HTTP.post("http://www.mysite.com/rest/data", options);
const promise = HTTP.put("http://www.mysite.com/rest/data", options);
const promise = HTTP.patch("http://www.mysite.com/rest/data", options);
const promise = HTTP.jsonp("http://www.mysite.com/rest/data", options);
```

## Instance requests

```javascript
HTTP.useOptions(options);
const http = new HTTP("http://www.mysite.com/rest", options);
const promise = http.get("data", options);
const promise = http.delete("data", options);
const promise = http.head("data", options);
const promise = http.post("data", options);
const promise = http.put("data", options);
const promise = http.patch("data", options);
const promise = http.jsonp("data", options);
```

## Options

| Name                   | Description                           |
| ---------------------- | ------------------------------------- |
| headers                | Headers                               |
| params                 | Query parameters                      |
| data                   | Data payload                          |
| json                   | JSON data payload                     |
| fullResponse           | Set to true to get full response      |
| contentType            | Media type(MIME) for data payload     |
| responseType           | Type for response data                |
| cache                  | Set to true to cache responses        |
| stateChangeInterceptor | State change interceptor callback     |
| requestInterceptor     | Request interceptor callback          |
| responseInterceptor    | Response interceptor callback         |
| download               | Set to true to download response data |
| filename               | Filename for downloaded file          |

### Options inheritence

-   Add options to the class with `useOptions(options)`
    -   Inherits NO options
-   Add options to the static request `HTTP.get("URL", options)`
    -   Inherits CLASS options
-   Add options to the instance `new HTTP("URL", options)`
    -   Inherits CLASS options
-   Add options to the instance request `http.get("PATH", options)`
    -   Inherits INSTANCE options

## Path parameters

```javascript
const id = "Fo%Bar";

//Static request. All paths string after the first(base) one is uri encoded.
const promise = HTTP.get("http://www.mysite.com/rest/data", id, "subpath");

//Instance constructor. All paths string after the first(base) one is uri encoded.
const http = new HTTP("http://www.mysite.com", "rest");
//Instance request. All path string are uri encoded.
const promise = http.get("data", id, "subpath");
//Instance request at base path.
const promise = http.get();
```

## Headers and query parameters

```javascript
//Headers. Flat object(key/value map)
const headers = { Origin: "http://www.mysite.com" };

//Query parameters. Object(key/value map) which supports multiple values per key.
//?id=123&field=name&field=value
const params = { id: "123", field: ["name", "value"] };

//Can be used for static requests.
const promise = HTTP.get("http://www.mysite.com/rest/data", { headers: headers, params: params });

//Can be given to the constructor and passed to each request.
const http = new HTTP("http://www.mysite.com/rest", { headers: headers, params: params });

//Can be defined for single request.
const promise = http.get("data", { headers: headers, params: params });
```

## Payload

Payload parameters are the same for post/put/patch.

```javascript
//Data with specified content type.
const promise = http.post({ data: "myData", contentType: "text/plain" });
//Data with undefined content type. String/boolean/number defaults to "text/plain".
const promise = http.post({ data: "myData" });
//Unspecified objects are converted to urlencoded query string a=1&b=2 with content type: "application/x-www-form-urlencoded".
const promise = http.post({ data: { a: 1, b: 2 } });
//Json object. Object is stringified and content type is "application/json".
const promise = http.post({ json: { a: 1, b: 2 } });
```

## Response

Resolved promise returns payload.

```javascript
http.get()
    .then(function (response) {
        //Response from server if promise resolved(request succeeded).
    })
    .catch(function (error) {
        //Full response object if promise rejected(request failed). Se  below for description of full response.
    });
```

## Full response

Get a full response in both promise resolve and reject.

```javascript
http.get({ fullResponse: true })
    .then(function(response) {
        //Full response returned.
    });

//Full response format.
{
    ok: true,
    url: "http://www.mysite.com/rest/data?id=123",
    status: 200,
    statusText: "OK",
    text: "{ value: 5 }",
    //Data is the same value that is returned in a simple(non full) response.
    data: { value: 5 },
    //Object with headers
    headers: { }
}
```

## Response type

Specify response type. Can be used to request binary data

```javascript
http.get({ responseType: "blob" }).then(function (blob) {
    //Blob containing binary data
});
```

## Cache

Enable cache. Matches method+url and caches response.

```javascript
http.get({ cache: true }).then(function (cachedResponse) {
    //Response is fetched from cache.
});
```

## State change interceptor

Callback to trigger on every state change on the underlying XMLHttp​Request​.  
0 UNSENT - Client has been created. open() not called yet.  
1 OPENED - open() has been called.  
2 HEADERS_RECEIVED - send() has been called, and headers and status are available.  
3 LOADING - Downloading; responseText holds partial data.  
4 DONE - The operation is complete.

```javascript
stateChangeInterceptor: function (readyState) {
    switch (readyState) {
        //readyState = [0, 4]
    }
};
```

## Request interceptor

Callback to format/update request. Useful for updating auth credentials.

```javascript
requestInterceptor: function(request: object) {
    //Update auth credentials
    request.headers.Authorization = "...";
    //Return updated request
    return request;
    //Or return Promise.
    return Promise.resolve(request);
    //Returning rejected promise rejects the entire http request.
    return Promise.reject("Error");
}
```

## Response interceptor

Callback to format/update response. Useful for logging errors.

```javascript
responseInterceptor: function(response: object) {
    //Change response
    if (response.data === null) {
        response.data = "No Data, but ok";
    }
    //Log errors
    if (!response.ok) {
        console.error(response.statusText);
    }
    //Return updated response.
    return response;
    //Or return Promise.
    return Promise.resolve(response);
    //Returning rejected promise rejects the entire http request.
    return Promise.reject("Error");
}
```
