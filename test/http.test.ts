import assert from "node:assert";
import HTTP from "../src/index";

describe("HTTP()", () => {
    HTTP.useOptions({
        params: { a: 1, b: 2, c: 3 },
        cache: true
    });

    const http = new HTTP("https://petstore.swagger.io", "v2", {
        params: { a: 10, b: null, d: 4 },
        cache: false
    });

    const sub = http.path("swagger.json", {
        params: { e: 5 },
        cache: true
    });

    it("HTTP.options", () => {
        assert.deepEqual(HTTP.options, { params: { a: 1, b: 2, c: 3 }, headers: {}, cache: true });
    });

    it("http.options", () => {
        assert.deepEqual(http.options, {
            params: { a: 10, b: null, c: 3, d: 4 },
            headers: {},
            url: "https://petstore.swagger.io/v2",
            cache: false
        });
    });

    it("sub.options", () => {
        assert.deepEqual(sub.options, {
            params: { a: 10, b: null, c: 3, d: 4, e: 5 },
            headers: {},
            url: "https://petstore.swagger.io/v2/swagger.json",
            cache: true
        });
    });

    it("sub.request", async () => {
        try {
            await sub.get({
                params: { f: 6 },
                requestInterceptor: (r) => {
                    assert.deepEqual(r, {
                        params: { a: 10, b: null, c: 3, d: 4, e: 5, f: 6 },
                        headers: {},
                        url: "https://petstore.swagger.io/v2/swagger.json",
                        method: "GET",
                        cache: true
                    });
                    return r;
                }
            });
        } catch (e) {
            if (e instanceof assert.AssertionError) {
                throw e;
            }
        }
    });
});
