const Assert = {
    equals(message: string, expected: unknown, found: unknown) {
        if (expected !== found) {
            console.error(
                "Assert.equals: " +
                    message +
                    ". Expected '" +
                    expected +
                    "', Found '" +
                    found +
                    "'",
            );
        }
    },

    jsonEquals(message: string, expected: unknown, found: unknown) {
        this.equals(message, JSON.stringify(expected), JSON.stringify(found));
    },

    ok(message: string, condition: boolean) {
        if (!condition) {
            console.error("Assert.ok: " + message);
        }
    },

    fail(message: string, data?: unknown) {
        const errorMessage =
            data instanceof Error ? data.message : JSON.stringify(data);
        console.error(`Assert.fail: ${message}, ${errorMessage}`);
    },
};

export default Assert;
