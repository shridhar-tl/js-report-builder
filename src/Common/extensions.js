(function() {
    var id_counter = 1;
    Object.defineProperty(Object.prototype, "__objectId__", {
        writable: true,
        configurable: false,
        enumerable: false
    });
    Object.defineProperty(Object.prototype, "_uniqueId", {
        get: function() {
            if (this.__objectId__ === undefined) {
                this.__objectId__ = id_counter++;
            }
            return this.__objectId__;
        }
    });
})();
