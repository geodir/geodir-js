var request = require('superagent');
var Promise = require("bluebird");

var Geodir = require('./Geodir');
var GRUtil = require("./GRUtil");
var ghUtil = new GRUtil();
var _geo = new Geodir();

GeodirBuilder = function (args) {

    this.host = "https://geoserver.geodir.co/builder.api";
    ghUtil.copyProperties(args, this);

};

GeodirBuilder.prototype.getParametersAsQueryString = function (args) {
    var qString = "";
    if (args.debug)
        qString += "debug=true";

    return qString;
};
/**
 * List of teams
 */
GeodirBuilder.prototype.getTeams = function () {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host + '/team/all';
    return that.doRequest(url,{});
};

GeodirBuilder.prototype.getLayersByTeam = function (team) {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host +'/team/'+team+'/layers';
    return that.doRequest(url,{});
};

GeodirBuilder.prototype.getMapsbyTeam = function (team) {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host +'/team/'+team+'/maps';
    return that.doRequest(url,{});
};

GeodirBuilder.prototype.getLayersByMap = function (map) {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host +'/map/'+map+'/layers';
    return that.doRequest(url,{});
};

GeodirBuilder.prototype.getMapConfig = function (map) {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host +'/map/'+map+'/config';
    return that.doRequest(url,{});
};

GeodirBuilder.prototype.doRequest = function (url,reqArgs) {
    var that = this;
    return new Promise(function(resolve, reject) {
        var args = ghUtil.clone(that);
        if (reqArgs)
            args = ghUtil.copyProperties(reqArgs, args);

        var _url = url + "?" + that.getParametersAsQueryString(args) + "&access_token=" + args.key;
        request
            .get(_url)
            .set('Authorization', 'Bearer '+_geo.getAccessToken())
            .accept('application/json')
            .timeout(args.timeout)
            .end(function (err, res) {
                if (err || !res.ok) {
                    reject(ghUtil.extractError(res, url));
                } else if (res) {
                    resolve(res.body);
                }
            });
    });
};

module.exports = GeodirBuilder;