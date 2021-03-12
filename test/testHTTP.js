import HTTP from "../src/index";

export default async () => {
    console.log("test/testHTTP.js")

    HTTP.useOptions({
        cache: true,
        params: { a: 1, b: 2, c: 3 }
    });

    const http = new HTTP("https://petstore.swagger.io", "v2", {
        cache: false,
        params: { a: 10, b: null, d: 4 }
    })

    const sub = http.path("swagger.json", {
        cache: true,
        params: { e: 5 }
    });

    sub.get({
        params: { f: 6 },
        requestInterceptor: r => {
            r.params.g = 7;

            console.log("HTTP.options", JSON.stringify(HTTP.options, null, 4));
            console.log("http.options", JSON.stringify(http.options, null, 4));
            console.log("sub.options", JSON.stringify(sub.options, null, 4));
            console.log("sub.request", JSON.stringify(r, null, 4));

            return r;
        }
    })

    sub.get().then(r1 => {
        r1.tmp = "Test";
        sub.get().then(r2 => {
            console.log("response1.tmp", r1.tmp);
            console.log("response2.tmp", r2.tmp);
        })
    })

};

