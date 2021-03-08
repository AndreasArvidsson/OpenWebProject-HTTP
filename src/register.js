
const register = {};

const get = (key) =>
    register[key];

const set = (key, value) => {
    register[key] = value;
};

export default { get, set };