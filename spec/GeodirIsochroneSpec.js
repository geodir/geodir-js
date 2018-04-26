var GeodirIsochrone = require('../src/GeodirIsochrone');
var ghIsochrone = new GeodirIsochrone({host : "http://localhost:8083"});


describe("Isochrone Test", function () {
    it("Get results", function (done) {
        ghIsochrone.doRequest({point: "-12.03059,-77.1559", buckets: 2})
            .then(function (json) {
                expect(json.polygons.length).toBeGreaterThan(0);
                expect(json.polygons[0].geometry.type).toEqual('Polygon');
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
        ;
    });
});