var GeodirBuilder = require('../src/GeodirBuilder');
var GeodirAPI = require('../src/Geodir');
var _geo = new GeodirAPI();
_geo.setAccessToken('36a8e492-edb5-4071-8d30-28e4e3b2c02c');

var builder = new GeodirBuilder({host : "http://localhost:8888"});


describe("Builder Test", function () {
    it("Teams", function (done) {
        builder.getTeams({})
            .then(function (json) {
                expect(json.length).toBeGreaterThan(0);
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
        ;
    });
    //getLayersByTeam
    it("LayersByTeam", function (done) {
        builder.getLayersByTeam('soluciones-sig')
            .then(function (json) {
                expect(json.length).toBeGreaterThan(0);
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
        ;
    });

    it("get Maps", function (done) {
        builder.getMapsbyTeam('soluciones-sig')
            .then(function (json) {
                expect(json.length).toBeGreaterThan(0);
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
        ;
    });

    it("Map Layers", function(done){
        builder.getLayersByMap('zhKTXt5')
            .then(function(json){
                expect(json.order.length).toBeGreaterThan(0);
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
    });
    it("Map Config", function(done){
        builder.getMapConfig('zhKTXt5')
            .then(function(json){
                expect(json.zoom).toBeGreaterThan(0);
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
    })
    
});