import HTTP from "../src";

const url = "https://petstore.swagger.io/v2/swagger.json";

(async () => {
    console.log("test/testHttp.js");

    const http = new HTTP("https://petstore.swagger.io", "v2");

    const res = await http.get("swagger.json");
    const re2 = await http.get<object>("swagger.json");
    // const res3 = await http.get("swagger.json", { fullResponse: true });

    const res4 = await http.path("swagger.json").get({ fullResponse: true });

    console.log(res);
})();
