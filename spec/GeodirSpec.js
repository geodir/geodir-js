var GeodirAPI = require('../src/GeodirAPI');
var gContext = new GeodirAPI.Geodir();
describe("Simple Geodir", function () {
    it("Get Token", function (done) {
        let token = gContext.getAccessToken();
        expect(token).toEqual('a049e19d-c241-41f6-95b6-669166cbea7b');
        done();
    });
    /*it("Set Token", function (done) {
        let token = gContext.getAccessToken();
        expect(token).toEqual('dfe9eb8e-7657-4f9b-8741-01fbe1751149');
        done();
    });*/
});