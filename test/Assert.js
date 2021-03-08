const Assert = {

    equals: function(message, expected, found) {
        if (expected !== found) {
            console.error("Assert.equals: " + message + ". Expected '" + expected + "', Found '" + found + "'");
        }
    },

    jsonEquals: function(message, expected, found) {
        this.equals(message, JSON.stringify(expected), JSON.stringify(found));
    }

};
export default Assert;