console.log("tests/liveTests.ts");

import liveAssert from "./liveAssert";
import liveDemo from "./liveDemo";

void (async () => {
    await liveAssert();
    await liveDemo();
})();
