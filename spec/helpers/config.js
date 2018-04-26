var GeodirAPI = require('../../src/Geodir');
var _geo = new Geodir();
_geo.setAccessToken('a049e19d-c241-41f6-95b6-669166cbea7b');

//global.key = "a049e19d-c241-41f6-95b6-669166cbea7b";
//global.profile = "car";

// Some tests take longer than the default 5000ms of Jasmine
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;