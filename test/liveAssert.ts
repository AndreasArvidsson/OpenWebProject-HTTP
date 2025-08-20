import HTTP from "../src";
import { JsonpResponse } from "../src/HttpResponse";
import assert from "./assert";

const url = "https://httpbin.org";
const urlNotFound = `${url}/notFound`;
const urlGet = "https://petstore.swagger.io/v2/swagger.json";
const urlLarge =
    "https://raw.githubusercontent.com/json-iterator/test-data/refs/heads/master/large-file.json";

const testGet = async () => {
    await HTTP.get(urlGet)
        .then(async (r) => {
            assert.equals("Get: status", 200, r.status);
            const data = await r.json<any>();
            assert.equals("Get: basePath", "/v2", data.basePath);
        })
        .catch((e) => assert.fail("Get", e));

    await HTTP.get(urlNotFound)
        .then(() => assert.fail("Get: Expected exception"))
        .catch((r) => {
            assert.equals("Get: status", 404, r.status);
        });
};

const testPost = async () => {
    await HTTP.post([url, "post"], {
        json: { name: "testPost" },
    })
        .then(async (r) => {
            assert.equals("Post: status", 200, r.status);
            const data = await r.json<any>();
            assert.equals("Post: name", "testPost", data.json.name);
        })
        .catch((e) => assert.fail("Post", e));

    await HTTP.post(urlGet)
        .then(() => assert.fail("Post: Expected exception"))
        .catch((r) => {
            assert.equals("Post: status", 405, r.status);
        });
};

const testPut = async () => {
    await HTTP.put([url, "put"], {
        json: { name: "testPut" },
    })
        .then(async (r) => {
            assert.equals("Put: status", 200, r.status);
            const data = await r.json<any>();
            assert.equals("Put: name", "testPut", data.json.name);
        })
        .catch((e) => assert.fail("Put", e));

    await HTTP.put(urlGet)
        .then(() => assert.fail("Put: Expected exception"))
        .catch((r) => {
            assert.equals("Put: status", 405, r.status);
        });
};

const testPatch = async () => {
    await HTTP.patch([url, "patch"], {
        json: { name: "testPatch" },
    })
        .then(async (r) => {
            assert.equals("Patch: status", 200, r.status);
            const data = await r.json<any>();
            assert.equals("Patch: name", "testPatch", data.json.name);
        })
        .catch((e) => assert.fail("Patch", e));

    // Gives cors errors
    // await HTTP.patch(getUrl)
    //     .then(() => assert.fail("Patch: Expected exception"))
    //     .catch((r) => {
    //         assert.equals("Patch: status", 405, r.status);
    //     });
};

const testDelete = async () => {
    await HTTP.delete([url, "delete"], {
        json: { name: "testDelete" },
    })
        .then(async (r) => {
            assert.equals("Delete: status", 200, r.status);
            const data = await r.json<any>();
            assert.equals("Delete: name", "testDelete", data.json.name);
        })
        .catch((e) => assert.fail("Delete", e));

    await HTTP.delete(urlGet)
        .then(() => assert.fail("Delete: Expected exception"))
        .catch((r) => {
            assert.equals("Delete: status", 405, r.status);
        });
};

const testHead = async () => {
    await HTTP.head([url, "head"], {
        json: { name: "testHead" },
    })
        .then(async (r) => {
            assert.equals("Head: status", 200, r.status);
            const data = await r.json<any>();
            assert.equals("Head: name", "testHead", data.json.name);
        })
        .catch((e) => assert.fail("Head", e));

    await HTTP.head(urlGet)
        .then(() => assert.fail("Head: Expected exception"))
        .catch((r) => {
            assert.equals("Head: status", 405, r.status);
        });
};

const testJsonp = async () => {
    await HTTP.jsonp("https://itunes.apple.com/search", {
        params: { term: "a", media: "music", limit: 20 },
    })
        .then(async (r) => {
            assert.equals("Jsonp: status", 200, r.status);
            const data = await r.json<any>();
            assert.equals("Jsonp: resultCount", 20, data.resultCount);
        })
        .catch((e) => assert.fail("Jsonp", e));

    await HTTP.jsonp(urlNotFound)
        .then(() => assert.fail("Jsonp: Expected exception"))
        .catch((r) => {
            assert.equals("Jsonp: status", 400, r.status);
        });
};

const testStateChangeInterceptor = async () => {
    let count = 0;

    await HTTP.get(urlGet, {
        stateChangeInterceptor: (r) => {
            count++;
        },
    }).then(() => {
        count++;
    });

    assert.equals("stateChangeInterceptor", 5, count);
};

const testProgressInterceptor = async () => {
    let loaded = 0;
    let total = 0;

    await HTTP.get(urlLarge, {
        progressInterceptor: (l, t) => {
            loaded = l;
            total = t;
        },
    });

    assert.equals("stateChangeInterceptor: total", 3844333, total);
    assert.equals("stateChangeInterceptor: loaded", total, loaded);
};

const testRequestInterceptor = async () => {
    await HTTP.get(urlGet, {
        requestInterceptor: (r) => {
            assert.equals("url", urlGet, r.url);
            return r;
        },
    })
        .then((r) => r.json())
        .then((r: any) => {
            assert.equals(
                "testRequestInterceptor1: basePath",
                "/v2",
                r.basePath,
            );
        })
        .catch((e) => assert.fail("testRequestInterceptor1", e));

    await HTTP.get(urlGet, {
        requestInterceptor: (r) => Promise.resolve(r),
    })
        .then((r) => r.json())
        .then((r: any) => {
            assert.equals("testRequestInterceptor2: status", "/v2", r.basePath);
        })
        .catch((e) => assert.fail("testRequestInterceptor2", e));

    await HTTP.get(urlGet, {
        requestInterceptor: () => Promise.reject("Doh!"),
    })
        .then(() => assert.fail("testRequestInterceptor: Expected exception"))
        .catch((r) => {
            assert.equals("testRequestInterceptor: reject", "Doh!", r);
        });
};

const testResponseInterceptor = async () => {
    await HTTP.get(urlGet, {
        responseInterceptor: (r) => {
            assert.equals("testResponseInterceptor1: status", 200, r.status);
            return new JsonpResponse(r.url, 200, "", 10);
        },
    })
        .then((r) => r.json())
        .then((r: any) => {
            assert.equals("testResponseInterceptor1: tmp", 10, r);
        })
        .catch((e) => assert.fail("testResponseInterceptor1", e));

    await HTTP.get(urlGet, {
        responseInterceptor: (r) =>
            new JsonpResponse(r.url, r.status, r.statusText, 10),
    })
        .then((r) => r.json())
        .then((r) => {
            assert.equals("testResponseInterceptor2: resolve", 10, r);
        })
        .catch((e) => assert.fail("testResponseInterceptor2", e));

    await HTTP.get(urlGet, {
        responseInterceptor: () => Promise.reject("Doh!"),
    })
        .then((r) => assert.fail("testResponseInterceptor: Expected exception"))
        .catch((r) => {
            assert.equals("testResponseInterceptor: catch", "Doh!", r);
        });
};

export default async function run() {
    console.log("test/testAssert.js");

    await testGet();
    await testPost();
    await testPut();
    await testPatch();
    await testDelete();
    // Cors errors
    // await testHead();
    await testJsonp();
    await testStateChangeInterceptor();
    await testProgressInterceptor();
    await testRequestInterceptor();
    await testResponseInterceptor();
}
