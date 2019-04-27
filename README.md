# HTTP
[https://github.com/AndreasArvidsson/HTTP]
HTTP client for JavaScript

**Static requests**
```javascript
const promise = HTTP.get("http://www.mysite.com/rest/data");
const promise = HTTP.delete("http://www.mysite.com/rest/data");
const promise = HTTP.head("http://www.mysite.com/rest/data");
const promise = HTTP.post("http://www.mysite.com/rest/data", { data: "Mydata" });
const promise = HTTP.put("http://www.mysite.com/rest/data", { data: "Mydata" });
const promise = HTTP.patch("http://www.mysite.com/rest/data", { data: "Mydata" });
const promise = HTTP.jsonp("http://www.mysite.com/rest/data");
```

**Instance requests**
```javascript
const http = new HTTP("http://www.mysite.com/rest");
const promise = http.get("data");
const promise = http.delete("data");
const promise = http.head("data");
const promise = http.post("data", { data: "Mydata" });
const promise = http.put("data", { data: "Mydata" });
const promise = http.patch("data", { data: "Mydata" });
const promise = http.jsonp("data");
```

**Path parameters**
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

**Headers and query parameters**
```javascript
//Headers. Flat object(key/value map)
const headers: { Origin:  "http://www.mysite.com" };

//Query parameters. Object(key/value map) which supports multiple values per key.
//?id=123&field=name&field=value
const params: { id: "123", field: [ "name", "value" ] };

//Can be used for static requests.
const promise = HTTP.get("http://www.mysite.com/rest/data", { headers: headers, params: params });

//Can be given to the constructor and passed to each request.
const http = new HTTP("http://www.mysite.com/rest", { headers: headers, params: params });

//Can be defined for single request.
const promise = http.get("data", { headers: headers, params: params });
```

**Payload**    
Payload parameters are the same for post/put/patch.
```javascript
//Data with specified content type.
const promise = http.post({ data: "myData", contentType: "text/plain" })
//Data with undefined content type. String/boolean/number defaults to "text/plain".
const promise = http.post({ data: "myData" })
//Unspecified objects are converted to urlencoded query string a=1&b=2 with content type: "application/x-www-form-urlencoded".
const promise = http.post({ data: { a: 1, b: 2 } })
//Json object. Object is stringified and content type is "application/json".
const promise = http.post({ json: { a: 1, b: 2 } })
```

**Response**    
Resolved promise returns payload.
```javascript
http.get().then(
    function(response) {
        //Response from server if promise resolved(request succeeded).
    },
    function(error) {
        //Full response object if promise rejected(request failed). Se  below for description of full response.
    }
);
```

**Full response**    
Get a full response in both promise resolve and reject.    
Can be used in static request, constructor or instance request same as headers.    
```javascript
http.get({ fullResponse: true }).then(
    function(response) {
        //Full response returned.
    }
);
//Full response format.
{
    url: "http://www.mysite.com/rest/data?id=123",
    statusCode: 200,
    statusText: "OK",
    responseText: "{ value: 5 }",
    //Data is the same value that is returned in a simple(non full) response.
    data: { value: 5 },
    //Returns object with headers
    headers: function () {}, 
    //Returns value for single header name
    getHeader: function (headerName) {}
}
```

**Response type**    
Specify response type. Can be used to request binary data    
Can be used in static request, constructor or instance request same as headers.
```javascript
http.get({ responseType: "blob"  }).then(
    function(blob) {
        //Blob containing binary data
    }
);
```

**Instance functions**    
Functions to get or set options for an instance.
```javascript
//Returns the current url as an string.
const url = http.getUrl();
//Set a specific header value.
http.setHeader(headerName, headerValue);
//Set multiple header values.
http.setHeaders({ headerName1: headerValue1, headerName2: headerValue2 });
//Set full response true or false.
http.setFullResponse(true);
//Set response type.
http.setResponseType("blob");
//Crease a sub instance with additional path parameters. Each path is uri encoded.
const httpSub = http.path("subpath", id, "anotherPath");
```

**On state change event**    
Register callback to trigger on every state change on the underlying XMLHttp​Request​.    
0 	UNSENT - Client has been created. open() not called yet.    
1 	OPENED - open() has been called.    
2 	HEADERS_RECEIVED - send() has been called, and headers and status are available.    
3 	LOADING - Downloading; responseText holds partial data.    
4 	DONE - The operation is complete.    
```javascript
HTTP.setOnStateChange(function (readyState) {
    switch (readyState) {
        //readyState = [0, 4]
    }
});
```

**On error event**    
Register callback to trigger on all rejected/failed requests.    
Useful to display error messages, log problem or refresh authorization tokens.    
Supports repeat of request.
```javascript
HTTP.setErrorInterceptor(function(response, repeat, resolve, reject) {
    //Unauthorized 
    if (response.statusCode === 401) {
        //Try to refesh access token.
        Auth.refresh().then(function() {
            //Repeat request with new access token.
            const accessToken = Auth.getAccessToken();
            const headers = { authorization: accessToken };
            //Repeat supports new headers and pararms.
            repeat({headers: headers}).then(resolve, reject);
        });
        //Stop other reject callback. Only applied for first time. 
        //If repeat fails the promise will reject.
        return false;
    }
});
```