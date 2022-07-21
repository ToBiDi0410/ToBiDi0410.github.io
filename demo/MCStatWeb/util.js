function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {
                    [key]: {}
                });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function nulledArray(length) {
    var array = new Array();
    for (var i = 0; i < length; i++) {
        array[i] = 0;
    }
    return array;
}

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function isNum(obj) {
    return !isNaN(obj);
}

function roundTwoDecimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

function limitArray(arr, maxcount) {
    if (arr.length > maxcount) {
        console.debug("LIMITED ARRAY TO MAXLENGTH", maxcount);
        return arr.slice(0, maxcount);
    }
    return arr;
}