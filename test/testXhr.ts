import xhr from "../src/xhr";
import assert from "./assert";

const url = "https://petstore.swagger.io/v2/swagger.json";
type Response = [string, unknown, unknown];

const testPost = async (): Promise<Response> => {
    let count = 0;

    // await xhr({
    //     url,
    //     method: "POST",
    //     json: {a:2,b:3}
    // })
    //     .catch(r => {
    //         ++count;
    //         Assert.equals("fullResponse", false, r.ok);
    //         Assert.equals("basePath", 404, r.status);
    //     })

    return ["testXhr", 0, count];
};

const testXhr = async (): Promise<Response> => {
    let count = 0;

    await xhr({ url, cache: true, method: "GET", fullResponse: true }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", true, r.ok);
        assert.equals("basePath", "/v2", r.data.basePath);
    });

    await xhr({ url, cache: true }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", undefined, r.ok);
        assert.equals("basePath", "/v2", r.basePath);
    });

    // await xhr({ url: url + 1 })
    //     .catch(r => {
    //         ++count;
    //         Assert.equals("fullResponse", false, r.ok);
    //         Assert.equals("basePath", 404, r.status);
    //     })

    return ["testXhr", 2, count];
};

const testStateChangeInterceptor = async (): Promise<Response> => {
    let count = 0;

    await xhr({
        contentType: "text/plain",
        fullResponse: true,
        responseType: "json",
        url,
        cache: true,
        stateChangeInterceptor: () => {
            ++count;
        }
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", true, r.ok);
    });

    return ["testStateChangeInterceptor", 5, count];
};

const testResponseInterceptor = async (): Promise<Response> => {
    let count = 0;

    await xhr({
        url,
        cache: true,
        responseInterceptor: (r: any) => {
            assert.equals("fullResponse", true, r.ok);
            assert.equals("basePath", "/v2", r.data.basePath);
            r.tmp = 10;
            return r;
        }
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", true, r.ok);
        assert.equals("basePath", "/v2", r.data.basePath);
        assert.equals("tmp", 10, r.tmp);
    });

    await xhr({
        url,
        cache: true,
        responseInterceptor: (r) => Promise.resolve(10)
    }).then((r) => {
        ++count;
        assert.equals("resolve", 10, r);
    });

    await xhr({
        url,
        cache: true,
        responseInterceptor: () => Promise.reject("Doh!")
    }).catch((r) => {
        ++count;
        assert.equals("catch", "Doh!", r);
    });

    return ["testResponseInterceptor", 3, count];
};

const testRequestInterceptor = async (): Promise<Response> => {
    let count = 0;

    await xhr({
        url,
        cache: true,
        requestInterceptor: (r) => {
            assert.equals("url", url, r.url);
            return r;
        }
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", undefined, r.ok);
        assert.equals("basePath", "/v2", r.basePath);
    });

    await xhr({
        url,
        cache: true,
        requestInterceptor: (r) => Promise.resolve(r)
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", undefined, r.ok);
        assert.equals("basePath", "/v2", r.basePath);
    });

    await xhr({
        url,
        cache: true,
        requestInterceptor: () => Promise.reject("Doh!")
    }).catch((r) => {
        ++count;
        assert.equals("reject", "Doh!", r);
    });

    return ["testRequestInterceptor", 3, count];
};

const testJsonp = async (): Promise<Response> => {
    const url = "https://itunes.apple.com/search";
    let count = 0;

    await xhr({
        method: "JSONP",
        url,
        params: { term: "a", media: "music", limit: 20 },
        fullResponse: true,
        cache: true
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", true, r.ok);
        assert.equals("resultCount", 20, r.data.resultCount);
    });

    await xhr({
        method: "JSONP",
        url,
        params: { term: "a", media: "music", limit: 20 },
        cache: true
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", undefined, r.ok);
        assert.equals("resultCount", 20, r.resultCount);
    });

    return ["testJsonp", 2, count];
};

(async () => {
    console.log("test/testXhr.js");

    let res: Response[] = [
        await testStateChangeInterceptor(),
        await testXhr(),
        await testPost(),
        await testJsonp(),
        await testRequestInterceptor(),
        await testResponseInterceptor()
    ];

    res.forEach(([message, a, b]) => {
        assert.equals(message, a, b);
    });
})();
