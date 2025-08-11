import HTTP, { HttpResponse } from "../src";
import { XhrResponse } from "../src/HttpResponse";

const url = "https://petstore.swagger.io/v2/swagger.json";

export default async function () {
    console.log("test/liveDemo.js");

    const http = new HTTP("https://petstore.swagger.io/v2");
    const res = await http.path("swagger.json").get();

    console.log(res);
}
