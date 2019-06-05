export function clone(obj, deep) {
    if (Array.isArray(obj)) {
        return cloneArray(obj, deep);
    } else if (typeof obj === "object") {
        return cloneObject(obj, deep);
    }
}

export function cloneArray(array, deep) {
    if (!array) {
        return array;
    }
    var len = array.length;
    var result = [];
    if (deep) {
        while (len--) {
            result[len] = clone(array[len], deep);
        }
    } else {
        while (len--) {
            result[len] = array[len];
        }
    }
    return result;
}

export function cloneObject(obj, deep) {
    if (!obj) {
        return obj;
    }
    if (deep) {
        var result = { ...obj }; ////ToDo: do deep cloning logic

        return result;
    } else {
        return { ...obj };
    }
}

export const UUID = (function() {
    var self = {};
    var lut = [];
    for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? "0" : "") + i.toString(16);
    }
    self.generate = function() {
        var d0 = (Math.random() * 0xffffffff) | 0;
        var d1 = (Math.random() * 0xffffffff) | 0;
        var d2 = (Math.random() * 0xffffffff) | 0;
        var d3 = (Math.random() * 0xffffffff) | 0;
        return (
            lut[d0 & 0xff] +
            lut[(d0 >> 8) & 0xff] +
            lut[(d0 >> 16) & 0xff] +
            lut[(d0 >> 24) & 0xff] +
            "-" +
            lut[d1 & 0xff] +
            lut[(d1 >> 8) & 0xff] +
            "-" +
            lut[((d1 >> 16) & 0x0f) | 0x40] +
            lut[(d1 >> 24) & 0xff] +
            "-" +
            lut[(d2 & 0x3f) | 0x80] +
            lut[(d2 >> 8) & 0xff] +
            "-" +
            lut[(d2 >> 16) & 0xff] +
            lut[(d2 >> 24) & 0xff] +
            lut[d3 & 0xff] +
            lut[(d3 >> 8) & 0xff] +
            lut[(d3 >> 16) & 0xff] +
            lut[(d3 >> 24) & 0xff]
        );
    };
    return self;
})();
