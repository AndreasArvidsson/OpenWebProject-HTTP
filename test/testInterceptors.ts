import assert from "./assert";

const url = "https://petstore.swagger.io/v2/swagger.json";
const urlLarge =
    "https://raw.githubusercontent.com/json-iterator/test-data/refs/heads/master/large-file.json";
type Response = [string, unknown, unknown];

const testStateChangeInterceptor = async (): Promise<Response> => {
    let count = 0;

    await xhr({
        contentType: "text/plain",
        fullResponse: true,
        responseType: "json",
        url,
        stateChangeInterceptor: () => {
            ++count;
        },
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", true, r.ok);
    });

    return ["testStateChangeInterceptor", 5, count];
};

const testProgressInterceptor = async (): Promise<Response> => {
    let loaded = 0;
    let total = 0;

    await xhr({
        responseType: "json",
        url: urlLarge,
        cache: true,
        progressInterceptor: (l, t) => {
            loaded = l;
            total = t;
        },
    });

    assert.equals("total", 3844333, total);

    return ["testProgressInterceptor", total, loaded];
};

const testRequestInterceptor = async (): Promise<Response> => {
    let count = 0;

    await xhr({
        url,
        cache: true,
        requestInterceptor: (r) => {
            assert.equals("url", url, r.url);
            return r;
        },
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", undefined, r.ok);
        assert.equals("basePath", "/v2", r.basePath);
    });

    await xhr({
        url,
        cache: true,
        requestInterceptor: (r) => Promise.resolve(r),
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", undefined, r.ok);
        assert.equals("basePath", "/v2", r.basePath);
    });

    await xhr({
        url,
        cache: true,
        requestInterceptor: () => Promise.reject("Doh!"),
    }).catch((r) => {
        ++count;
        assert.equals("reject", "Doh!", r);
    });

    return ["testRequestInterceptor", 3, count];
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
        },
    }).then((r: any) => {
        ++count;
        assert.equals("fullResponse", true, r.ok);
        assert.equals("basePath", "/v2", r.data.basePath);
        assert.equals("tmp", 10, r.tmp);
    });

    await xhr({
        url,
        cache: true,
        responseInterceptor: (r) => Promise.resolve(10),
    }).then((r) => {
        ++count;
        assert.equals("resolve", 10, r);
    });

    await xhr({
        url,
        cache: true,
        responseInterceptor: () => Promise.reject("Doh!"),
    }).catch((r) => {
        ++count;
        assert.equals("catch", "Doh!", r);
    });

    return ["testResponseInterceptor", 3, count];
};

(async () => {
    console.log("test/testInterceptors.js");

    let res: Response[] = [
        await testStateChangeInterceptor(),
        await testProgressInterceptor(),
        await testRequestInterceptor(),
        await testResponseInterceptor(),
    ];

    res.forEach(([message, a, b]) => {
        assert.equals(message, a, b);
    });
})();
