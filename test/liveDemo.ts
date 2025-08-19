import HTTP from "../src";

export default async function () {
    console.log("test/liveDemo.js");

    const json = await HTTP.get(
        "https://petstore.swagger.io/v2/swagger.json",
    ).then((res) => res.json());
    console.log(json);

    const http = new HTTP("https://petstore.swagger.io/v2");
    const res = await http.path("swagger.json").get({ responseType: "blob" });

    res.download();
}
