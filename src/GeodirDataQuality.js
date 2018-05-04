var request = require('superagent');
var Promise = require("bluebird");

var GRUtil = require("./GRUtil");
var ghUtil = new GRUtil();

GeodirDataQuality = function (args) {
    this.time_limit = 600;
    this.point;
    this.host = "https://api.geodir.co/api/v1/data-quality";
    this.debug = false;
    this.basePath = '/data-quality';
    this.timeout = 30000;
    ghUtil.copyProperties(args, this);
};

GeodirDataQuality.prototype.getParametersAsQueryString = function (args) {
    var qString = "point=" + args.point;
    if (args.debug)
        qString += "&debug=true";
    return qString;
};

GeodirDataQuality.prototype.doRequest = function (reqArgs) {
    var that = this;

    return new Promise(function(resolve, reject) {
        var args = ghUtil.clone(that);
        if (reqArgs)
            args = ghUtil.copyProperties(reqArgs, args);

        var url = args.host + "?" + that.getParametersAsQueryString(args) + "&access_token=" + args.key;

        request
            .get(url)
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

module.exports = GeodirDataQuality;