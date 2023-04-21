const Assert = {
    equals: function (message: string, expected: unknown, found: unknown) {
        if (expected !== found) {
            console.error(
                "Assert.equals: " + message + ". Expected '" + expected + "', Found '" + found + "'"
            );
        }
    },

    jsonEquals: function (message: string, expected: unknown, found: unknown) {
        this.equals(message, JSON.stringify(expected), JSON.stringify(found));
    }
};

export default Assert;
