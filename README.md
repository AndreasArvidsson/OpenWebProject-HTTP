# OpenWebProject HTTP

**HTTP client for JavaScript**

HTTP is a simple and lightweight wrapper for the browsers native XMLHttpRequest functionality.  
The purpose of this utility is to easiliy enable HTTP request without relying on a large framework. No matter if you have a simple standard JS app, uses jQuery or react framework you can make use of HTTP request in the same way.

## Installation and use

```
npm install owp.http --save
```

```ts
import HTTP from "owp.http";
```

## Example usage

```ts
const restBase = new HTTP("http://www.mysite.com/rest");
const userService = restBase.path("management", "users");

userService
    .get({ params: { id: "123" } })
    .then(async (response) => {
        const data = await response.json();
        const contentType = response.header("Content-Type");
    })
    .catch((error) => {
        if (error instanceof HttpResponse) {
            console.error(error.status, response.statusText);
        }
        console.error(error);
    });

userService.get({ responseType: "blob" }).then(async (response) => {
    await response.download();
});
```

## Static requests

```ts
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

```ts
HTTP.useOptions(options);
const http = new HTTP("http://www.mysite.com/rest", options);
const promise = http.path("data").get(options);
const promise = http.path("data").delete(options);
const promise = http.path("data").head(options);
const promise = http.path("data").post(options);
const promise = http.path("data").put(options);
const promise = http.path("data").patch(options);
const promise = http.path("data").jsonp(options);
```

## Options

| Name                   | Description                          |
| ---------------------- | ------------------------------------ |
| headers                | Headers                              |
| params                 | Query parameters                     |
| data                   | Data payload                         |
| json                   | JSON data payload                    |
| contentType            | Media type(MIME) for data payload    |
| responseType           | Type for response data               |
| cache                  | Set to true to cache responses       |
| stateChangeInterceptor | State change interceptor callback    |
| progressInterceptor    | Progress update interceptor callback |
| requestInterceptor     | Request interceptor callback         |
| responseInterceptor    | Response interceptor callback        |

### Options inheritence

- Add options to the class with `useOptions(options)`
    - Inherits NO options
- Add options to the static request `HTTP.get("URL", options)`
    - Inherits CLASS options
- Add options to the instance `new HTTP("URL", options)`
    - Inherits CLASS options
- Add options to the instance request `http.get(options)`
    - Inherits INSTANCE options

## Path parameters

```ts
const id = "FooBar";

// Static request. All paths string after the first(base) one is uri encoded.
const promise = HTTP.get(["http://www.mysite.com/rest/data", id, "subpath"]);

// Instance constructor. All paths string after the first(base) one is uri encoded.
const http = new HTTP(["http://www.mysite.com", "rest"]);
// Instance path(). All path string are uri encoded.
const promise = http.path("data", id, "subpath");
// Instance request at base path.
const promise = http.get();
```

## Headers and query parameters

```ts
// Headers. Flat object(key/value map)
const headers = { Origin: "http://www.mysite.com" };

// Query parameters. Object(key/value map) which supports multiple values per key.
// ?id=123&field=name&field=value
const params = { id: "123", field: ["name", "value"] };

// Can be used for static requests.
const promise = HTTP.get("http://www.mysite.com/rest/data", {
    headers: headers,
    params: params,
});

// Can be given to the constructor and passed to each request.
const http = new HTTP("http://www.mysite.com/rest", {
    headers: headers,
    params: params,
});

// Can be defined for single request.
const promise = http.get("data", { headers: headers, params: params });
```

## Payload

Payload parameters are the same for post/put/patch.

```ts
// Data with specified content type.
const promise = http.post({ data: "myData", contentType: "text/plain" });
// Data with undefined content type. String/boolean/number defaults to "text/plain".
const promise = http.post({ data: "myData" });
// Unspecified objects are converted to urlencoded query string a=1&b=2 with content type: "application/x-www-form-urlencoded".
const promise = http.post({ data: { a: 1, b: 2 } });
// Json object. Object is stringified and content type is "application/json".
const promise = http.post({ json: { a: 1, b: 2 } });
```

## Response

Resolved promise returns payload.

```ts
http.get()
    .then((response: HttpResponse) => {
        // Response from server if promise resolved (request succeeded).
    })
    .catch((error: HttpResponse) => {
        // Full response object if promise rejected (request failed). Se  below for description of HttpResponse.
    });
```

## HttpResponse

```ts
{
    url: "http://www.mysite.com/rest/data?id=123",
    ok: true,
    status: 200,
    statusText: "OK",
    responseType: "json",

    header(name: string): string,
    headers(): Record<string, string>,
    text(): string,
    json<T>(): T,
    blob(): Blob ,
    arrayBuffer(): ArrayBuffer,
    download(filename?: string): Promise<void>,
}
```

## Response type

Specify response type. Can be used to request binary data

```ts
http.get({ responseType: "blob" }).then((blob: Blob) => {
    // Blob containing binary data
});
```

## Cache

Enable cache. Matches method+url and caches response.

```ts
http.get({ cache: true }).then((cachedResponse: HttpResponse) => {
    // Response is fetched from cache.
});
```

## Request interceptor

Callback to format/update request. Useful for updating auth credentials.

```ts
requestInterceptor: (
    request: HttpRequest,
): HttpRequest | Promise<HttpRequest> => {
    // Update auth credentials
    request.headers.Authorization = "...";
    // Return updated request
    return request;
    // Or return Promise
    return Promise.resolve(request);
    // Returning rejected promise rejects the entire http request
    return Promise.reject("Error");
};
```

## Response interceptor

Callback to format/update response. Useful for logging errors.

```ts
responseInterceptor: (
    response: HttpResponse,
): HttpResponse | Promise<HttpResponse> => {
    // Log errors
    if (!response.ok) {
        console.error(response.statusText);
    }
    // Return updated response
    return new CustomHttpResponse(...);
    // Or return Promise
    return Promise.resolve(response);
    // Returning rejected promise rejects the entire http request
    return Promise.reject("Error");
};
```

## State change interceptor

Callback to trigger on every state change on the underlying XMLHttp​Request​.  
0 UNSENT - Client has been created. open() not called yet.  
1 OPENED - open() has been called.  
2 HEADERS_RECEIVED - send() has been called, and headers and status are available.  
3 LOADING - Downloading; responseText holds partial data.  
4 DONE - The operation is complete.

```ts
stateChangeInterceptor: (readyState: number): void => {
    // readyState = [0, 4]
};
```

## Progress interceptor

Callback to trigger on every progress update on the underlying XMLHttp​Request​.  
`total` will always be `0` if the content length could not be computed.

```ts
progressInterceptor: (loaded: number, total: number): void => {
    console.log((100 * loaded) / total, "%");
};
```
