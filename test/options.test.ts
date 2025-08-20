import assert from "node:assert";
import HTTP from "../src/index";

describe("Options", () => {
    const http = new HTTP("https://petstore.swagger.io/v2", {
        params: { a: 10, b: null, d: 4 },
        responseType: "blob",
    });

    it("HTTP.useOptions()", () => {
        HTTP.useOptions({
            params: { a: 1, b: 2, c: 3 },
        });
        HTTP.useOptions({
            responseType: "json",
        });

        assert.deepEqual(HTTP.getOptions(), {
            params: { a: 1, b: 2, c: 3 },
            headers: {},
            responseType: "json",
        });
    });

    it("HTTP.setOptions()", () => {
        HTTP.setOptions({
            responseType: "json",
        });

        assert.deepEqual(HTTP.getOptions(), { responseType: "json" });

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
            responseType: "blob",
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
            responseType: "json",
        });
        assert.deepEqual(sub.getOptions(), {
            params: { a: 10, b: null, d: 4, e: 5 },
            headers: {},
            responseType: "json",
        });
    });
});
