import xhr from "../src/XHR";
import Assert from "./Assert";

const url = "https://petstore.swagger.io/v2/swagger.json";

export default async () => {
    console.log("test/testXhr.js")

    let res = [
        await testStateChangeInterceptor(),
        await testXhr(),
        await testPost(),
        await testJsonp(),
        await testRequestInterceptor(),
        await testResponseInterceptor()
    ];

    res.forEach(p => {
        Assert.equals(...p);
    });
};

const testPost = async () => {
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
}

const testXhr = async () => {
    let count = 0;

    await xhr({ url, cache: true, method: "GET", fullResponse: true })
        .then(r => {
            ++count;
            Assert.equals("fullResponse", true, r.ok);
            Assert.equals("basePath", "/v2", r.data.basePath);
        })

    await xhr({ url, cache: true })
        .then(r => {
            ++count;
            Assert.equals("fullResponse", undefined, r.ok);
            Assert.equals("basePath", "/v2", r.basePath);
        })

    // await xhr({ url: url + 1 })
    //     .catch(r => {
    //         ++count;
    //         Assert.equals("fullResponse", false, r.ok);
    //         Assert.equals("basePath", 404, r.status);
    //     })

    return ["testXhr", 2, count];
}

const testStateChangeInterceptor = async () => {
    let count = 0;

    await xhr({
        contentType: "text/plain",
        fullResponse: true,
        responseType: "json",
        url, cache: true,
        stateChangeInterceptor: () => {
            ++count;
        }
    })
        .then(r => {
            ++count;
            Assert.equals("fullResponse", true, r.ok);
        })

    return ["testStateChangeInterceptor", 5, count];
};

const testResponseInterceptor = async () => {
    let count = 0;

    await xhr({
        url, cache: true,
        responseInterceptor: (r) => {
            Assert.equals("fullResponse", true, r.ok);
            Assert.equals("basePath", "/v2", r.data.basePath);
            r.tmp = 10;
            return r;
        }
    })
        .then(r => {
            ++count;
            Assert.equals("fullResponse", true, r.ok);
            Assert.equals("basePath", "/v2", r.data.basePath);
            Assert.equals("tmp", 10, r.tmp);
        })

    await xhr({
        url, cache: true,
        responseInterceptor: () => Promise.resolve(10)
    })
        .then(r => {
            ++count;
            Assert.equals("resolve", 10, r);
        })

    await xhr({
        url, cache: true,
        responseInterceptor: () => Promise.reject("Doh!")
    })
        .catch(r => {
            ++count;
            Assert.equals("catch", "Doh!", r);
        })

    return ["testResponseInterceptor", 3, count];
};

const testRequestInterceptor = async () => {
    let count = 0;

    await xhr({
        url, cache: true,
        requestInterceptor: (r) => {
            Assert.equals("url", url, r.url);
            return r;
        }
    })
        .then(r => {
            ++count;
            Assert.equals("fullResponse", undefined, r.ok);
            Assert.equals("basePath", "/v2", r.basePath);
        })

    await xhr({
        url, cache: true,
        requestInterceptor: (r) => Promise.resolve(r)
    })
        .then(r => {
            ++count;
            Assert.equals("fullResponse", undefined, r.ok);
            Assert.equals("basePath", "/v2", r.basePath);
        })

    await xhr({
        url, cache: true,
        requestInterceptor: () => Promise.reject("Doh!")
    })
        .catch(r => {
            ++count;
            Assert.equals("reject", "Doh!", r);
        })

    return ["testRequestInterceptor", 3, count];
};

const testJsonp = async () => {
    const url = "https://itunes.apple.com/search";
    let count = 0;

    await xhr({
        method: "JSONP",
        url,
        params: { term: "a", media: "music", limit: 20 },
        fullResponse: true,
        cache: true
    })
        .then(r => {
            ++count;
            Assert.equals("fullResponse", true, r.ok);
            Assert.equals("resultCount", 20, r.data.resultCount);
        })

    await xhr({
        method: "JSONP",
        url,
        params: { term: "a", media: "music", limit: 20 },
        cache: true
    })
        .then(r => {
            ++count;
            Assert.equals("fullResponse", undefined, r.ok);
            Assert.equals("resultCount", 20, r.resultCount);
        })

    return ["testJsonp", 2, count];
}