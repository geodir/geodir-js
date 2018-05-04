var GeodirDataQuality = require('../src/GeodirDataQuality');
var ghDataQuality = new GeodirDataQuality({host : "http://localhost:8084"});


describe("Isochrone Test", function () {
    it("Get results", function (done) {
        ghDataQuality.doRequest({point: "-12.05,-77.05",key:'78cdc73f-2d88-473c-aa9e-503a015e0541'})
            .then(function (json) {
                expect(json[0].codigo_inei).toEqual('15010102200001B');
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
        ;
    });
});