var Geodir = require('./Geodir');
var GRRoute = require('./GRRoute')
var GRInput = require('./GRInput');
var request = require('superagent');
var Promise = require("bluebird");

var GRUtil = require("./GRUtil");
var grUtil = new GRUtil();
var _geo = new Geodir();

GeodirRouting = function (args) {
    this.do_zoom = true;
    this.locale = 'en';
    this.points = new GRRoute(new GRInput(), new GRInput());
    this.route = new GRRoute(new GRInput(), new GRInput());
    this.from = this.route.first();
    this.to = this.route.last();
    this.host = "https://api.geodir.co/api/v1/route";
    this.debug = false;
    this.data_type = 'application/json';
    this.points_encoded = true;
    this.instructions = true;
    this.elevation = false;
    this.optimize = 'false';
    this.basePath = '/route';
    this.timeout = 10000;
    this.pt= {};
   
    this.api_params = {"locale": "es", "vehicle": "car", "weighting": "fastest", "elevation": false,
    "pt": {},debug : false};
// TODO make reading of /api/1/info/ possible
//    this.elevation = false;
//    var featureSet = this.features[this.vehicle];
//    if (featureSet && featureSet.elevation) {
//        if ('elevation' in params)
//            this.elevation = params.elevation;
//        else
//            this.elevation = true;
//    }

    this.graphhopper_maps_host = "https://maps.geodir.co/?";
    // TODO use the i18n text provided by api/1/i18n in over 25 languages
    this.turn_sign_map = {
        "-6": "leave roundabout",
        "-3": "turn sharp left",
        "-2": "turn left",
        "-1": "turn slight left",
        0: "continue",
        1: "turn slight right",
        2: "turn right",
        3: "turn sharp right",
        4: "finish",
        5: "reached via point",
        6: "enter roundabout"
    };

    grUtil.copyProperties(args, this);
};
GeodirRouting.prototype.init = function (params) {
    for (var key in params) {
        if (key === "point" || key === "mathRandom" || key === "do_zoom" || key === "layer" || key === "use_miles")
            continue;

        var val = params[key];
        if (val === "false")
            val = false;
        else if (val === "true")
            val = true;

        this.api_params[key] = val;
    }

    if ('do_zoom' in params)
        this.do_zoom = params.do_zoom;

    if ('use_miles' in params)
        this.useMiles = params.use_miles;

    // overwrite elevation e.g. important if not supported from feature set
    this.api_params.elevation = false;
    var featureSet = this.features[this.api_params.vehicle];
    if (featureSet && featureSet.elevation) {
        if ('elevation' in params)
            this.api_params.elevation = params.elevation;
        else
            this.api_params.elevation = true;
    }

    if (params.q) {
        var qStr = params.q;
        if (!params.point)
            params.point = [];
        var indexFrom = qStr.indexOf("from:");
        var indexTo = qStr.indexOf("to:");
        if (indexFrom >= 0 && indexTo >= 0) {
            // google-alike query schema
            if (indexFrom < indexTo) {
                params.point.push(qStr.substring(indexFrom + 5, indexTo).trim());
                params.point.push(qStr.substring(indexTo + 3).trim());
            } else {
                params.point.push(qStr.substring(indexTo + 3, indexFrom).trim());
                params.point.push(qStr.substring(indexFrom + 5).trim());
            }
        } else {
            var points = qStr.split("p:");
            for (var i = 0; i < points.length; i++) {
                var str = points[i].trim();
                if (str.length === 0)
                    continue;

                params.point.push(str);
            }
        }
    }
};


GeodirRouting.prototype.createPath = function (url, skipParameters) {
    for (var key in this.api_params) {
        if(skipParameters && skipParameters[key])
            continue;

        var val = this.api_params[key];
        url += this.flatParameter(key, val);
    }
    return url;
};

GeodirRouting.prototype.flatParameter = function (key, val) {

    if(GRRoute.isObject(val)) {
        var url = "";
        var arr = Object.keys(val);
        for (var keyIndex in arr) {
           var objKey = arr[keyIndex];
           url += this.flatParameter(key + "." + objKey, val[objKey]);
        }
        return url;

    } else  if (GRRoute.isArray(val)) {
        var url = "";
        var arr = val;
        for (var keyIndex in arr) {
            url += this.flatParameter(key, arr[keyIndex]);
        }
        return url;
    }

    return "&" + encodeURIComponent(key) + "=" + encodeURIComponent(val);
}


GeodirRouting.prototype.setLocale = function (locale) {
    if (locale)
        this.api_params.locale = locale;
};

GeodirRouting.prototype.setEarliestDepartureTime = function (localdatetime) {
    this.pt.earliest_departure_time = localdatetime;
};

GeodirRouting.prototype.getEarliestDepartureTime = function () {
    if (this.pt.earliest_departure_time)
        return this.pt.earliest_departure_time;
    return undefined;
};
GeodirRouting.prototype.initVehicle = function (vehicle) {
    this.api_params.vehicle = vehicle;
    var featureSet = this.features[vehicle];

    if (featureSet && featureSet.elevation)
        this.api_params.elevation = true;
    else
        this.api_params.elevation = false;
};

GeodirRouting.prototype.getVehicle = function () {
    return this.api_params.vehicle;
};

GeodirRouting.prototype.isPublicTransit = function () {
    return this.getVehicle() === "pt";
};

GeodirRouting.prototype.clearPoints = function () {
    this.points.length = 0;
    //addAll()
};

GeodirRouting.prototype.addPoint = function (latlon,to) {
    this.points.push(latlon);
    this.route.add(latlon,to);
};
GeodirRouting.prototype.createPointParams = function (useRawInput) {
    var str = "", point, i, l;

    for (i = 0, l = this.route.size(); i < l; i++) {
        point = this.route.getIndex(i);
        if (i > 0)
            str += "&";
        if (typeof point.input == 'undefined')
            str += "point=";
        else if (useRawInput)
            str += "point=" + encodeURIComponent(point.input);
        else
            str += "point=" + encodeURIComponent(point.toString());
    }
    return (str);
};

GeodirRouting.prototype.createURL = function () {
    return this.createPath(this.host + "?" + this.createPointParams(false) + "&type=" + this.dataType);
};

GeodirRouting.prototype.createHistoryURL = function () {
    var skip = {"key": true};
    return this.createPath("?" + this.createPointParams(true), skip) + "&use_miles=" + !!this.useMiles;
};

GeodirRouting.prototype.getParametersAsQueryString = function (args) {
    var qString = "locale=" + args.locale;

    qString += '&'+this.createPointParams(true);

    if (args.debug)
        qString += "&debug=true";

    qString += "&type=" + args.data_type;

    if (args.instructions)
        qString += "&instructions=" + args.instructions;

    if (args.points_encoded)
        qString += "&points_encoded=" + args.points_encoded;

    if (args.elevation)
        qString += "&elevation=" + args.elevation;

    if (args.optimize)
        qString += "&optimize=" + args.optimize;

    if (args.vehicle)
        qString += "&vehicle=" + args.vehicle;

    if (args.weighting)
        qString += "&weighting=" + args.weighting;

    if (args.heading_penalty)
        qString += "&heading_penalty=" + args.heading_penalty;

    if (args.pass_through)
        qString += "&pass_through=" + args.pass_through;

    if (args.algorithm)
        qString += "&algorithm=" + args.algorithm;

    if (args.block_area)
        qString += "&block_area=" + args.block_area;

    if (args.ch) {
        if (args.ch.disable)
            qString += "&ch.disable=" + args.ch.disable;
    }

    if (args.round_trip) {
        if (args.round_trip.distance)
            qString += "&round_trip.distance=" + args.round_trip.distance;
        if (args.round_trip.seed)
            qString += "&round_trip.seed=" + args.round_trip.seed;
    }

    if (args.alternative_route) {
        if (args.alternative_route.max_paths)
            qString += "&alternative_route.max_paths=" + args.alternative_route.max_paths;
        if (args.alternative_route.max_weight_factor)
            qString += "&alternative_route.max_weight_factor=" + args.alternative_route.max_weight_factor;
        if (args.alternative_route.max_share_factor)
            qString += "&alternative_route.max_share_factor=" + args.alternative_route.max_share_factor;
    }

    if (args.details) {
        for (var detailKey in args.details) {
            var detail = args.details[detailKey];
            qString += "&details=" + encodeURIComponent(detail);
        }
    }

    if (args.point_hint) {
        for (var hintKey in args.point_hint) {
            var hint = args.point_hint[hintKey];
            qString += "&point_hint=" + encodeURIComponent(hint);
        }
    }

    if (args.heading) {
        for (var headingKey in args.heading) {
            var heading = args.heading[headingKey];
            qString += "&heading=" + encodeURIComponent(heading);
        }
    }

    return qString;
};

GeodirRouting.prototype.doRequest = function (reqArgs) {
    var that = this;

    return new Promise(function (resolve, reject) {
        var args = grUtil.clone(that);
        if (reqArgs)
            args = grUtil.copyProperties(reqArgs, args);

        var url = that.createURL()+ "&key=" + _geo.getAccessToken();//args.host + args.basePath + "?" + that.getParametersAsQueryString(args) + "&key=" + _geo.getAccessToken();
        request
            .get(url)
            .accept(args.data_type)
            .timeout(args.timeout)
            .end(function (err, res) {
                if (err || !res.ok) {
                    reject(grUtil.extractError(res, url));
                } else if (res) {
                    if (res.body.paths) {
                        for (var i = 0; i < res.body.paths.length; i++) {
                            var path = res.body.paths[i];
                            // convert encoded polyline to geo json
                            if (path.points_encoded) {
                                var tmpArray = grUtil.decodePath(path.points, that.elevation);
                                path.points = {
                                    "type": "LineString",
                                    "coordinates": tmpArray
                                };

                                var tmpSnappedArray = grUtil.decodePath(path.snapped_waypoints, that.elevation);
                                path.snapped_waypoints = {
                                    "type": "LineString",
                                    "coordinates": tmpSnappedArray
                                };
                            }
                            if (path.instructions) {
                                for (var j = 0; j < path.instructions.length; j++) {
                                    // Add a LngLat to every instruction
                                    var interval = path.instructions[j].interval;
                                    // The second parameter of slice is non inclusive, therefore we have to add +1
                                    path.instructions[j].points = path.points.coordinates.slice([interval[0], interval[1] + 1]);
                                }
                            }
                        }
                    }
                    resolve(res.body);
                }
            });
    });
};

GeodirRouting.prototype.info = function (reqArgs) {
    var that = this;

    return new Promise(function (resolve, reject) {
        var args = grUtil.clone(that);
        if (reqArgs)
            args = grUtil.copyProperties(reqArgs, args);

        var url = args.host + "/info?" + "key=" + args.key;

        request
            .get(url)
            .accept(args.data_type)
            .timeout(args.timeout)
            .end(function (err, res) {
                if (err || !res.ok) {
                    reject(grUtil.extractError(res, url));
                } else if (res) {
                    resolve(res.body);
                }
            });
    });
};

GeodirRouting.prototype.i18n = function (reqArgs) {
    var that = this;

    return new Promise(function (resolve, reject) {
        var args = grUtil.clone(that);
        if (reqArgs)
            args = grUtil.copyProperties(reqArgs, args);
        var url = args.host + "/i18n/" + args.locale + "?" + "key=" + args.key;
        request
            .get(url)
            .accept(args.data_type)
            .timeout(args.timeout)
            .end(function (err, res) {
                if (err || !res.ok) {
                    reject(grUtil.extractError(res, url));
                } else if (res) {
                    resolve(res.body);
                }
            });
    });
};

GeodirRouting.prototype.getGraphHopperMapsLink = function () {
    return this.graphhopper_maps_host + this.getParametersAsQueryString(this);
};
GeodirRouting.prototype.hasElevation = function () {
    return this.elevation;
};

GeodirRouting.prototype.getTurnText = function (sign) {
    return this.turn_sign_map[sign];
};

module.exports = GeodirRouting;