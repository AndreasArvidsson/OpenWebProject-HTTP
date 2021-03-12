const deepClone = (obj) => {
    if (typeof obj === "object" && obj !== null) {
        const res = Array.isArray(obj) ? [] : {};
        for (const i in obj) {
            res[i] = deepClone(obj[i]);
        }
        return res;
    }
    return obj;
};

export default deepClone;