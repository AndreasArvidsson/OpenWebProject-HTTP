import testHTTP from "./testHTTP";
// import testXhr from "./testXhr";

(async () => {
    // await testXhr();
    await testHTTP()
})();



// import HTTP from "../src/index";

// console.log(JSON.stringify(res, null, 4))

// const http = new HTTP("https://petstore.swagger.io", "v2", { cache: true, headers: { a: 1, b: 2 } });

// const http2 = http.path("sub", "a b", { cache: false, headers: { a: 6 } });
// !http2

// // http.get("swagger.json", { cache: true, headers: { c: 3 } }) .then(console.log)

// HTTP.get("https://petstore.swagger.io/v2/swagger.json")
// .then(console.log)


// // Promise.resolve(1,2).then(console.log)
// // const p = new Promise((resolv, reject) => {
// //     !resolv
// //     !reject
// //     reject("res")
// // })


// // const p2 = p.then(r => {
// //     console.log(r)
// //     return Promise.resolve(r + "___")
// // })
// //     .catch(console.error)

// // p2.then((r) => {
// //     console.log("2: ", r)
// //     })
// //     .catch((r) => {
// //         console.error("2: ", r)
// //     })