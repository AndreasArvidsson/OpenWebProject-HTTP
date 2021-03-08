
const cache = {};

export default {

    get: (key, callback) => {
        if (!cache[key]) {
            //Store in cache emidietly so we dont get multiple http reuqest at the same time.
            cache[key] = callback();
            //Don't store failed requests. 
            cache[key].catch(() => {
                delete cache[key];
            });
        }
        return cache[key];
    }

};