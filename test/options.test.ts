import assert from "node:assert";
import HTTP from "../src/index";

describe("Options", () => {
    const http = new HTTP("https://petstore.swagger.io/v2", {
        params: { a: 10, b: null, d: 4 },
        cache: false,
    });

    it("HTTP.useOptions()", () => {
        HTTP.useOptions({
            params: { a: 1, b: 2, c: 3 },
        });
        HTTP.useOptions({
            cache: true,
        });

        assert.deepEqual(HTTP.getOptions(), {
            params: { a: 1, b: 2, c: 3 },
            headers: {},
            cache: true,
        });
    });

    it("HTTP.setOptions()", () => {
        console.log("set options");
        HTTP.setOptions({
            cache: true,
        });

        assert.deepEqual(HTTP.getOptions(), {
            cache: true,
        });

        HTTP.setOptions({});

        assert.deepEqual(HTTP.getOptions(), {});
    });

    it("getUrl()", () => {
        assert.deepEqual(http.getUrl(), "https://petstore.swagger.io/v2");
    });

    it("getOptions()", () => {
        assert.deepEqual(http.getOptions(), {
            params: { a: 10, b: null, d: 4 },
            headers: {},
            cache: false,
        });
    });

    it("path()", () => {
        const sub = http.path("swagger.json");
        assert.deepEqual(
            sub.getUrl(),
            "https://petstore.swagger.io/v2/swagger.json",
        );
    });

    it("options()", () => {
        const sub = http.options({
            params: { e: 5 },
            headers: {},
            cache: true,
        });
        assert.deepEqual(sub.getOptions(), {
            params: { a: 10, b: null, d: 4, e: 5 },
            headers: {},
            cache: true,
        });
    });
});
