import testHTTP from "./testHTTP";
import testXhr from "./testXhr";

(async () => {
    await testXhr();
    await testHTTP();
})();