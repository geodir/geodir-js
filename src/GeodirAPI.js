var Geodir = require('./Geodir.js');
var GRUtil = require('./GRUtil.js');
var GRInput = require('./GRInput.js');
var GeodirRouting = require('./GeodirRouting.js');
var GeodirBuilder = require('./GeodirBuilder.js');

var GeodirAPI = {
    'Geodir':Geodir,
    "Util": GRUtil,
    "Input": GRInput,
    "Routing": GeodirRouting,
    "GeodirBuilder":GeodirBuilder
};

// define GeodirAPI for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = GeodirAPI;

// define GeodirAPI as an AMD module
} else if (typeof define === 'function' && define.amd) {
    define(GeodirAPI);
}

if (typeof window !== 'undefined') {
    window.GeodirAPI = GeodirAPI;
}