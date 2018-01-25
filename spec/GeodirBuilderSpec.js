var GeodirBuilder = require('../src/GeodirBuilder');
var builder = new GeodirBuilder();


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
        builder.getLayersByTeam('teamfinantialjhonnysv1gmailcom',{})
            .then(function (json) {
                expect(json.length).toBeGreaterThan(0);
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
        ;
    });

    it("Info Layer", function(done){
        builder.getInfoLayer('finantialteamjhonnysv1gmailcom','qltWww69', 1, {})
            then(function(json){
                expect(json.length).toBeGreaterThan(0);
                done();
            })
            .catch(function (json) {
                done.fail("Shouldn't fail"+json);
            })
    });
});