const config = require('./util/config');

Geodir = function(){
    this.config = config;
};

Geodir.prototype.getAccessToken = function () {
    return this.config.ACCESS_TOKEN;
};

Geodir.prototype.setAccessToken = function (token) {
    this.config.ACCESS_TOKEN = token;
};

module.exports = Geodir;