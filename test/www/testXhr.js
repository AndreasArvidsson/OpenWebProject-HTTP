"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/lodash.clonedeep/index.js
  var require_lodash = __commonJS({
    "node_modules/lodash.clonedeep/index.js"(exports, module) {
      var LARGE_ARRAY_SIZE = 200;
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var MAX_SAFE_INTEGER = 9007199254740991;
      var argsTag = "[object Arguments]";
      var arrayTag = "[object Array]";
      var boolTag = "[object Boolean]";
      var dateTag = "[object Date]";
      var errorTag = "[object Error]";
      var funcTag = "[object Function]";
      var genTag = "[object GeneratorFunction]";
      var mapTag = "[object Map]";
      var numberTag = "[object Number]";
      var objectTag = "[object Object]";
      var promiseTag = "[object Promise]";
      var regexpTag = "[object RegExp]";
      var setTag = "[object Set]";
      var stringTag = "[object String]";
      var symbolTag = "[object Symbol]";
      var weakMapTag = "[object WeakMap]";
      var arrayBufferTag = "[object ArrayBuffer]";
      var dataViewTag = "[object DataView]";
      var float32Tag = "[object Float32Array]";
      var float64Tag = "[object Float64Array]";
      var int8Tag = "[object Int8Array]";
      var int16Tag = "[object Int16Array]";
      var int32Tag = "[object Int32Array]";
      var uint8Tag = "[object Uint8Array]";
      var uint8ClampedTag = "[object Uint8ClampedArray]";
      var uint16Tag = "[object Uint16Array]";
      var uint32Tag = "[object Uint32Array]";
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reFlags = /\w*$/;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      function addMapEntry(map, pair) {
        map.set(pair[0], pair[1]);
        return map;
      }
      function addSetEntry(set, value) {
        set.add(value);
        return set;
      }
      function arrayEach(array, iteratee) {
        var index = -1, length = array ? array.length : 0;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1, length = array ? array.length : 0;
        if (initAccum && length) {
          accumulator = array[++index];
        }
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      function getValue(object, key) {
        return object == null ? void 0 : object[key];
      }
      function isHostObject(value) {
        var result = false;
        if (value != null && typeof value.toString != "function") {
          try {
            result = !!(value + "");
          } catch (e) {
          }
        }
        return result;
      }
      function mapToArray(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      function setToArray(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      var arrayProto = Array.prototype;
      var funcProto = Function.prototype;
      var objectProto = Object.prototype;
      var coreJsData = root["__core-js_shared__"];
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var objectToString = objectProto.toString;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      var Buffer2 = moduleExports ? root.Buffer : void 0;
      var Symbol2 = root.Symbol;
      var Uint8Array2 = root.Uint8Array;
      var getPrototype = overArg(Object.getPrototypeOf, Object);
      var objectCreate = Object.create;
      var propertyIsEnumerable = objectProto.propertyIsEnumerable;
      var splice = arrayProto.splice;
      var nativeGetSymbols = Object.getOwnPropertySymbols;
      var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
      var nativeKeys = overArg(Object.keys, Object);
      var DataView = getNative(root, "DataView");
      var Map = getNative(root, "Map");
      var Promise2 = getNative(root, "Promise");
      var Set = getNative(root, "Set");
      var WeakMap = getNative(root, "WeakMap");
      var nativeCreate = getNative(Object, "create");
      var dataViewCtorString = toSource(DataView);
      var mapCtorString = toSource(Map);
      var promiseCtorString = toSource(Promise2);
      var setCtorString = toSource(Set);
      var weakMapCtorString = toSource(WeakMap);
      var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
      var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
      function Hash(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
      }
      function hashDelete(key) {
        return this.has(key) && delete this.__data__[key];
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? void 0 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : void 0;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
      }
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map || ListCache)(),
          "string": new Hash()
        };
      }
      function mapCacheDelete(key) {
        return getMapData(this, key)["delete"](key);
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        getMapData(this, key).set(key, value);
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function Stack(entries) {
        this.__data__ = new ListCache(entries);
      }
      function stackClear() {
        this.__data__ = new ListCache();
      }
      function stackDelete(key) {
        return this.__data__["delete"](key);
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      function stackSet(key, value) {
        var cache2 = this.__data__;
        if (cache2 instanceof ListCache) {
          var pairs = cache2.__data__;
          if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            return this;
          }
          cache2 = this.__data__ = new MapCache(pairs);
        }
        cache2.set(key, value);
        return this;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      function arrayLikeKeys(value, inherited) {
        var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
        var length = result.length, skipIndexes = !!length;
        for (var key in value) {
          if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
            result.push(key);
          }
        }
        return result;
      }
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
          object[key] = value;
        }
      }
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }
      function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
        var result;
        if (customizer) {
          result = object ? customizer(value, key, object, stack) : customizer(value);
        }
        if (result !== void 0) {
          return result;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray(value);
        if (isArr) {
          result = initCloneArray(value);
          if (!isDeep) {
            return copyArray(value, result);
          }
        } else {
          var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag || tag == argsTag || isFunc && !object) {
            if (isHostObject(value)) {
              return object ? value : {};
            }
            result = initCloneObject(isFunc ? {} : value);
            if (!isDeep) {
              return copySymbols(value, baseAssign(result, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result = initCloneByTag(value, tag, baseClone, isDeep);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result);
        if (!isArr) {
          var props = isFull ? getAllKeys(value) : keys(value);
        }
        arrayEach(props || value, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value[key2];
          }
          assignValue(result, key2, baseClone(subValue, isDeep, isFull, customizer, key2, value, stack));
        });
        return result;
      }
      function baseCreate(proto) {
        return isObject(proto) ? objectCreate(proto) : {};
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
      }
      function baseGetTag(value) {
        return objectToString.call(value);
      }
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty.call(object, key) && key != "constructor") {
            result.push(key);
          }
        }
        return result;
      }
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var result = new buffer.constructor(buffer.length);
        buffer.copy(result);
        return result;
      }
      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
        return result;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      function cloneMap(map, isDeep, cloneFunc) {
        var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
        return arrayReduce(array, addMapEntry, new map.constructor());
      }
      function cloneRegExp(regexp) {
        var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
      }
      function cloneSet(set, isDeep, cloneFunc) {
        var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
        return arrayReduce(array, addSetEntry, new set.constructor());
      }
      function cloneSymbol(symbol) {
        return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      function copyArray(source, array) {
        var index = -1, length = source.length;
        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
      function copyObject(source, props, object, customizer) {
        object || (object = {});
        var index = -1, length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
          assignValue(object, key, newValue === void 0 ? source[key] : newValue);
        }
        return object;
      }
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
        getTag = function(value) {
          var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result;
        };
      }
      function initCloneArray(array) {
        var length = array.length, result = array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
          result.index = array.index;
          result.input = array.input;
        }
        return result;
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      function initCloneByTag(object, tag, cloneFunc, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);
          case boolTag:
          case dateTag:
            return new Ctor(+object);
          case dataViewTag:
            return cloneDataView(object, isDeep);
          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);
          case mapTag:
            return cloneMap(object, isDeep, cloneFunc);
          case numberTag:
          case stringTag:
            return new Ctor(object);
          case regexpTag:
            return cloneRegExp(object);
          case setTag:
            return cloneSet(object, isDeep, cloneFunc);
          case symbolTag:
            return cloneSymbol(object);
        }
      }
      function isIndex(value, length) {
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
        return value === proto;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      function cloneDeep2(value) {
        return baseClone(value, true, true);
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      function isArguments(value) {
        return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
      }
      var isArray = Array.isArray;
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }
      var isBuffer = nativeIsBuffer || stubFalse;
      function isFunction(value) {
        var tag = isObject(value) ? objectToString.call(value) : "";
        return tag == funcTag || tag == genTag;
      }
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isObject(value) {
        var type = typeof value;
        return !!value && (type == "object" || type == "function");
      }
      function isObjectLike(value) {
        return !!value && typeof value == "object";
      }
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function stubArray() {
        return [];
      }
      function stubFalse() {
        return false;
      }
      module.exports = cloneDeep2;
    }
  });

  // src/cache.ts
  var cache, cache_default;
  var init_cache = __esm({
    "src/cache.ts"() {
      "use strict";
      cache = {};
      cache_default = {
        get: (key, callback) => {
          if (cache[key] == null) {
            cache[key] = callback();
            cache[key].catch(() => {
              delete cache[key];
            });
          }
          return cache[key];
        }
      };
    }
  });

  // src/use.ts
  var use, use_default;
  var init_use = __esm({
    "src/use.ts"() {
      "use strict";
      use = {};
      use_default = use;
    }
  });

  // src/xhr.ts
  function evaluateRequest(request) {
    return __async(this, null, function* () {
      const { params, method = "GET" } = request;
      let { url } = request;
      const queryString = params ? calcQueryParmsString(params) : "";
      if (queryString) {
        url = `${url}?${queryString}`;
      }
      let response;
      if (request.cache) {
        const res = yield cache_default.get(
          method + url,
          () => performRequest(url, method, !!queryString, request)
        );
        response = (0, import_lodash.default)(res);
      } else {
        response = yield performRequest(url, method, !!queryString, request);
      }
      if (request.download) {
        return doDownload(request, response);
      }
      return evalResponse(request, response);
    });
  }
  function performRequest(url, method, paramsUsed, request) {
    if (method === "JSONP") {
      return doJsonp(url, paramsUsed, request);
    }
    return doXhr(url, method, request);
  }
  function doXhr(url, method, { data, json, contentType, responseType, headers, download, stateChangeInterceptor }) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = download ? "blob" : responseType != null ? responseType : "";
      xhr.onreadystatechange = () => {
        if (stateChangeInterceptor) {
          stateChangeInterceptor(xhr.readyState);
        }
        if (xhr.readyState === XMLHttpRequest.DONE) {
          resolve(calcFullResponse(xhr));
        }
      };
      xhr.open(method, url, true);
      for (const i in headers) {
        if (headers[i] !== void 0 && headers[i] != null) {
          xhr.setRequestHeader(i, headers[i]);
        }
      }
      xhr.setRequestHeader("content-type", calcContentType(contentType, json, data));
      xhr.send(calcBody(json, data));
    });
  }
  function doJsonp(url, paramsUsed, request) {
    return new Promise((resolve) => {
      const { stateChangeInterceptor } = request;
      const callbackName = `jsonp_${Date.now()}_${Math.round(1e6 * Math.random())}`;
      const script = document.createElement("script");
      script.src = `${url}${paramsUsed ? "&" : "?"}callback=${callbackName}`;
      const done = (ok, data) => {
        delete window[callbackName];
        document.body.removeChild(script);
        if (stateChangeInterceptor) {
          stateChangeInterceptor(XMLHttpRequest.DONE);
        }
        resolve(calcJsonpFullResponse(ok, url, data));
      };
      window[callbackName] = (data) => {
        done(true, data);
      };
      script.onerror = () => {
        done(false, null);
      };
      if (stateChangeInterceptor) {
        stateChangeInterceptor(XMLHttpRequest.OPENED);
      }
      document.body.appendChild(script);
    });
  }
  function evalResponse(request, response) {
    if (request.responseInterceptor) {
      return request.responseInterceptor(response);
    }
    if (response.ok) {
      return request.fullResponse ? response : response.data;
    }
    throw response;
  }
  function doDownload(request, response) {
    return __async(this, null, function* () {
      if (!use_default.downloadjs) {
        throw Error("owp.http: Download option requires owp.http-get");
      }
      const blob = response.data;
      const contentType = response.headers["content-type"];
      const filename = request.filename || calcFilename(response, contentType);
      const res = yield evalResponse(request, response);
      use_default.downloadjs(blob, filename, contentType);
      return res;
    });
  }
  function calcBody(json, data) {
    if (json) {
      return JSON.stringify(json);
    }
    if (typeof data === "object" && data != null) {
      return calcQueryParmsString(data);
    }
    return data;
  }
  function calcContentType(contentType, json, data) {
    if (contentType) {
      return contentType;
    }
    if (json) {
      return "application/json";
    }
    if (data) {
      switch (typeof data) {
        case "boolean":
        case "number":
        case "string":
          return "text/plain";
      }
    }
    return "application/x-www-form-urlencoded; charset=UTF-8";
  }
  function calcQueryParmsString(params) {
    const parts = [];
    for (const i in params) {
      const key = encodeURIComponent(i);
      const value = params[i];
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item != null) {
            parts.push(`${key}=${encodeURIComponent(item)}`);
          }
        }
      } else if (value != null) {
        parts.push(`${key}=${encodeURIComponent(value)}`);
      }
    }
    return parts.join("&");
  }
  function calcFullResponse(xhr) {
    const hasText = xhr.responseType === "" || xhr.responseType === "text";
    const headers = getHeaders(xhr);
    return {
      ok: xhr.status >= 200 && xhr.status < 300 || xhr.status === 304,
      url: xhr.responseURL,
      status: xhr.status,
      statusText: xhr.statusText,
      headers,
      data: getData(xhr, headers, hasText),
      text: hasText ? xhr.responseText : null
    };
  }
  function calcJsonpFullResponse(ok, url, data) {
    return {
      ok,
      url,
      status: ok ? 200 : 400,
      statusText: ok ? "OK" : "Bad Request",
      headers: {},
      data,
      text: null
    };
  }
  function getData(xhr, headers, hasText) {
    if (xhr.responseType === "json") {
      return xhr.response;
    }
    if (hasText) {
      const contentType = headers["content-type"];
      if (contentType && contentType.includes("json")) {
        return JSON.parse(xhr.responseText);
      }
    }
    return xhr.response;
  }
  function getHeaders(xhr) {
    const result = {};
    const headerStrings = xhr.getAllResponseHeaders().split("\r\n");
    for (const header of headerStrings) {
      if (header) {
        const parts = header.split(": ");
        result[parts[0].toLowerCase()] = parts[1];
      }
    }
    return result;
  }
  function calcFilename(response, contentType) {
    const disposition = response.headers["content-disposition"];
    if (disposition) {
      const i2 = disposition.indexOf("filename=") + "filename=".length + 1;
      return disposition.substring(i2, disposition.length - 1);
    }
    let url = response.url;
    const i = url.indexOf("?");
    if (i > -1) {
      url = url.substring(0, i);
    }
    const parts = url.split("/").filter(Boolean);
    const name = parts.length ? parts[parts.length - 1] : "file";
    const ext = contentType.includes("json") && !name.toLowerCase().endsWith(".json") ? ".json" : "";
    return name + ext;
  }
  var import_lodash, xhr_default;
  var init_xhr = __esm({
    "src/xhr.ts"() {
      "use strict";
      import_lodash = __toESM(require_lodash());
      init_cache();
      init_use();
      xhr_default = (_a) => __async(void 0, null, function* () {
        var _b = _a, { requestInterceptor } = _b, request = __objRest(_b, ["requestInterceptor"]);
        if (requestInterceptor) {
          request = yield Promise.resolve(requestInterceptor(request));
        }
        return evaluateRequest(request);
      });
    }
  });

  // test/assert.ts
  var Assert, assert_default;
  var init_assert = __esm({
    "test/assert.ts"() {
      "use strict";
      Assert = {
        equals: function(message, expected, found) {
          if (expected !== found) {
            console.error(
              "Assert.equals: " + message + ". Expected '" + expected + "', Found '" + found + "'"
            );
          }
        },
        jsonEquals: function(message, expected, found) {
          this.equals(message, JSON.stringify(expected), JSON.stringify(found));
        }
      };
      assert_default = Assert;
    }
  });

  // test/testXhr.ts
  var require_testXhr = __commonJS({
    "test/testXhr.ts"(exports) {
      init_xhr();
      init_assert();
      var url = "https://petstore.swagger.io/v2/swagger.json";
      var testPost = () => __async(exports, null, function* () {
        let count = 0;
        return ["testXhr", 0, count];
      });
      var testXhr = () => __async(exports, null, function* () {
        let count = 0;
        yield xhr_default({ url, cache: true, method: "GET", fullResponse: true }).then((r) => {
          ++count;
          assert_default.equals("fullResponse", true, r.ok);
          assert_default.equals("basePath", "/v2", r.data.basePath);
        });
        yield xhr_default({ url, cache: true }).then((r) => {
          ++count;
          assert_default.equals("fullResponse", void 0, r.ok);
          assert_default.equals("basePath", "/v2", r.basePath);
        });
        return ["testXhr", 2, count];
      });
      var testStateChangeInterceptor = () => __async(exports, null, function* () {
        let count = 0;
        yield xhr_default({
          contentType: "text/plain",
          fullResponse: true,
          responseType: "json",
          url,
          cache: true,
          stateChangeInterceptor: () => {
            ++count;
          }
        }).then((r) => {
          ++count;
          assert_default.equals("fullResponse", true, r.ok);
        });
        return ["testStateChangeInterceptor", 5, count];
      });
      var testResponseInterceptor = () => __async(exports, null, function* () {
        let count = 0;
        yield xhr_default({
          url,
          cache: true,
          responseInterceptor: (r) => {
            assert_default.equals("fullResponse", true, r.ok);
            assert_default.equals("basePath", "/v2", r.data.basePath);
            r.tmp = 10;
            return r;
          }
        }).then((r) => {
          ++count;
          assert_default.equals("fullResponse", true, r.ok);
          assert_default.equals("basePath", "/v2", r.data.basePath);
          assert_default.equals("tmp", 10, r.tmp);
        });
        yield xhr_default({
          url,
          cache: true,
          responseInterceptor: (r) => Promise.resolve(10)
        }).then((r) => {
          ++count;
          assert_default.equals("resolve", 10, r);
        });
        yield xhr_default({
          url,
          cache: true,
          responseInterceptor: () => Promise.reject("Doh!")
        }).catch((r) => {
          ++count;
          assert_default.equals("catch", "Doh!", r);
        });
        return ["testResponseInterceptor", 3, count];
      });
      var testRequestInterceptor = () => __async(exports, null, function* () {
        let count = 0;
        yield xhr_default({
          url,
          cache: true,
          requestInterceptor: (r) => {
            assert_default.equals("url", url, r.url);
            return r;
          }
        }).then((r) => {
          ++count;
          assert_default.equals("fullResponse", void 0, r.ok);
          assert_default.equals("basePath", "/v2", r.basePath);
        });
        yield xhr_default({
          url,
          cache: true,
          requestInterceptor: (r) => Promise.resolve(r)
        }).then((r) => {
          ++count;
          assert_default.equals("fullResponse", void 0, r.ok);
          assert_default.equals("basePath", "/v2", r.basePath);
        });
        yield xhr_default({
          url,
          cache: true,
          requestInterceptor: () => Promise.reject("Doh!")
        }).catch((r) => {
          ++count;
          assert_default.equals("reject", "Doh!", r);
        });
        return ["testRequestInterceptor", 3, count];
      });
      var testJsonp = () => __async(exports, null, function* () {
        const url2 = "https://itunes.apple.com/search";
        let count = 0;
        yield xhr_default({
          method: "JSONP",
          url: url2,
          params: { term: "a", media: "music", limit: 20 },
          fullResponse: true,
          cache: true
        }).then((r) => {
          ++count;
          assert_default.equals("fullResponse", true, r.ok);
          assert_default.equals("resultCount", 20, r.data.resultCount);
        });
        yield xhr_default({
          method: "JSONP",
          url: url2,
          params: { term: "a", media: "music", limit: 20 },
          cache: true
        }).then((r) => {
          ++count;
          assert_default.equals("fullResponse", void 0, r.ok);
          assert_default.equals("resultCount", 20, r.resultCount);
        });
        return ["testJsonp", 2, count];
      });
      (() => __async(exports, null, function* () {
        console.log("test/testXhr.js");
        let res = [
          yield testStateChangeInterceptor(),
          yield testXhr(),
          yield testPost(),
          yield testJsonp(),
          yield testRequestInterceptor(),
          yield testResponseInterceptor()
        ];
        res.forEach(([message, a, b]) => {
          assert_default.equals(message, a, b);
        });
      }))();
    }
  });
  require_testXhr();
})();
