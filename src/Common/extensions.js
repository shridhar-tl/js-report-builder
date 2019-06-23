(function () {
    var id_counter = 1;
    Object.defineProperty(Object.prototype, "_uniqueId", {
        get: function () {
            if (this.__objectId__ === undefined) {
                Object.defineProperty(this, "__objectId__", {
                    value: id_counter++,
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
            }
            return this.__objectId__;
        }
    });
})();
