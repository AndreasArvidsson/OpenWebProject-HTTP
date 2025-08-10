import HTTP from "../src";

const url = "https://petstore.swagger.io/v2/swagger.json";

(async () => {
    console.log("test/testHttp.js");

    const http = new HTTP("https://petstore.swagger.io", "v2");

    const res = await http.get("swagger.json");

    console.log(res);
})();
