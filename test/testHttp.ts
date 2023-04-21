import HTTP from "../src";
import xhr from "../src/xhr";
import assert from "./assert";

const url = "https://petstore.swagger.io/v2/swagger.json";

(async () => {
    console.log("test/testHttp.js");

    const http = new HTTP("https://petstore.swagger.io", "v2");

    const res = await http.get("swagger.json");

    console.log(res);
})();
