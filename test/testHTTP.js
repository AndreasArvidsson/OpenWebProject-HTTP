import HTTP from "../src/index";
// import Assert from "./Assert";

export default async () => {
    console.log("test/testHTTP.js")

    HTTP.options({
        cache: true,
        params: { a: 1, b: 2, c: 3 }
    });

    const http = new HTTP("https://petstore.swagger.io", "v2", {
        cache: false,
        params: { a: 10, b: null }
    })

    console.log(JSON.stringify(http.options, null, 4));

    const sub = http.path("swagger.json", {
        cache: true,
        params: { a: 5 }
    });

    console.log(JSON.stringify(sub.options, null, 4));

    // sub.get({ method: "post", json: 2 })
};

