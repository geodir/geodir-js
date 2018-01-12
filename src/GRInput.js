GRInput = function (input, input2) {
    this.set(input, input2);
};
function round(val, precision) {
    if (precision === undefined)
        precision = 1e6;
    return Math.round(val * precision) / precision;
}
GRInput.prototype.round = function (val, precision) {
    if (precision === undefined)
        precision = 1e6;
    return Math.round(val * precision) / precision;
};

GRInput.prototype.setCoord = function (lat, lng) {
    this.lat = this.round(lat);
    this.lng = this.round(lng);
    this.input = this.toString();
};

GRInput.isObject = function (value) {
    var stringValue = Object.prototype.toString.call(value);
    return (stringValue.toLowerCase() === "[object object]");
};

GRInput.isString = function (value) {
    var stringValue = Object.prototype.toString.call(value);
    return (stringValue.toLowerCase() === "[object string]");
};

GRInput.prototype.isResolved = function () {
    return !isNaN(this.lat) && !isNaN(this.lng);
};

GRInput.prototype.setCoord = function (lat, lng) {
    this.lat = round(lat);
    this.lng = round(lng);
    this.input = this.toString();
};

GRInput.prototype.setUnresolved = function () {
    this.lat = undefined;
    this.lng = undefined;
};

GRInput.prototype.set = function (strOrObject, input2) {
    if (input2) {
        this.setCoord(strOrObject, input2);
        return;
    }

    // either text or coordinates or object
    this.input = strOrObject;

    if (GRInput.isObject(strOrObject)) {
        this.setCoord(strOrObject.lat, strOrObject.lng);
    } else if (GRInput.isString(strOrObject)) {
        var index = strOrObject.indexOf(",");
        if (index >= 0) {
            this.lat = this.round(parseFloat(strOrObject.substr(0, index)));
            this.lng = this.round(parseFloat(strOrObject.substr(index + 1)));
            if (this.isResolved()) {
                this.input = this.toString();
            } else {
                this.setUnresolved();
            }
        } else {
            this.setUnresolved();
        }
    }
};

GRInput.prototype.toString = function () {
    if (this.lat !== undefined && this.lng !== undefined)
        return this.lat + "," + this.lng;
    return undefined;
};

module.exports = GRInput;