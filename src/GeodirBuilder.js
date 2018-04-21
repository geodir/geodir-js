var request = require('superagent');
var Promise = require("bluebird");

var Geodir = require('./Geodir');
var GRUtil = require("./GRUtil");
var ghUtil = new GRUtil();
var _geo = new Geodir();

GeodirBuilder = function (args) {

    this.host = "https://geoserver.geodir.co/builder.api";
    this.basePath = '/services';
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
GeodirBuilder.prototype.getTeams = function (reqArgs) {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host + args.basePath+'/teams';
    return that.doRequest(url,reqArgs);
};

GeodirBuilder.prototype.getLayersByTeam = function (team,reqArgs) {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host + args.basePath+'/'+team+'/layers-team';
    return that.doRequest(url,reqArgs);
};

GeodirBuilder.prototype.getMapsbyTeam = function (team,reqArgs) {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host + args.basePath+'/'+team+'/maps-team';
    return that.doRequest(url,reqArgs);
};

GeodirBuilder.prototype.getLayersByMap = function (map,reqArgs) {
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host + args.basePath+'/'+map+'/layers-map';
    return that.doRequest(url,reqArgs);
};

GeodirBuilder.prototype.getInfoLayer = function (team,map,idLayer,reqArgs){
    var that = this;
    var args = ghUtil.clone(that);
    var url = args.host + args.basePath+'/'+team+'/'+map+'/'+idLayer+'/info-layer';
    return that.doRequest(url,reqArgs);
}

GeodirBuilder.prototype.doRequest = function (url,reqArgs) {
    var that = this;
    return new Promise(function(resolve, reject) {
        var args = ghUtil.clone(that);
        if (reqArgs)
            args = ghUtil.copyProperties(reqArgs, args);

        var _url = url + "?" + that.getParametersAsQueryString(args) + "&key=" + args.key;

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