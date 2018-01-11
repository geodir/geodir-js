var GeodirRouting = require('../src/GeodirRouting');
var GRInput = require('../src/GRInput');
var routing = new GeodirRouting({elevation: false,host : "http://localhost:5555/api/v1"});

describe("Simple Route", function () {
    it("Get results", function (done) {
        routing.clearPoints();
        routing.addPoint(new GRInput("-11.981562,-77.11853"));
        routing.addPoint(new GRInput("-12.085149,-77.00592"));

        routing.doRequest()
            .then(function (json) {
                expect(json.paths.length).toBeGreaterThan(0);
                expect(json.paths[0].distance).toBeGreaterThan(3000);
                expect(json.paths[0].distance).toBeLessThan(40000);
                expect(json.paths[0].instructions[0].points.length).toBeGreaterThan(1);
                expect(json.paths[0].instructions[0].points[0][0]).toEqual(json.paths[0].points.coordinates[0][0]);
                expect(json.paths[0].instructions[0].points[0][1]).toBeGreaterThan(-12.0);
                expect(json.paths[0].instructions[0].points[0][1]).toBeLessThan(-11.9);
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
    it("Compare Fastest vs. Shortest", function (done) {
        routing.clearPoints();
        routing.addPoint(new GRInput("-11.981562,-77.11853"));
        routing.addPoint(new GRInput("-12.085149,-77.00592"));

        routing.doRequest()
            .then(function (json) {
                var fastestTime = json.paths[0].time;
                var fastestDistance = json.paths[0].distance;
                // Shortest is not prepared with CH
                routing.doRequest({weighting: "shortest", ch: {disable: true}})
                    .then(function (json2) {
                        expect(json2.paths[0].time).toBeGreaterThan(fastestTime);
                        expect(json2.paths[0].distance).toBeLessThan(fastestDistance);
                        done();
                    })
                    .catch(function (err) {
                        done.fail(err.message);
                    });
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
    it("Get Path Details", function (done) {
        routing.clearPoints();
        routing.addPoint(new GRInput("-11.981562,-77.11853"));
        routing.addPoint(new GRInput("-12.085149,-77.00592"));

        routing.doRequest({"details": ["average_speed", "edge_id"]})
            .then(function (json) {
                expect(json.paths.length).toBeGreaterThan(0);
                var details = json.paths[0].details;
                expect(details).toBeDefined();
                var edgeId = details.edge_id;
                var averageSpeed = details.average_speed;
                expect(edgeId.length).toBeGreaterThan(25);
                expect(edgeId.length).toBeLessThan(300);
                expect(averageSpeed.length).toBeGreaterThan(5);
                expect(averageSpeed.length).toBeLessThan(30);
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });

    it("Use PointHint", function (done) {
        routing.clearPoints();
        routing.addPoint(new GRInput("-11.981562,-77.11753"));
        routing.addPoint(new GRInput("-11.981862,-77.11453"));

        routing.doRequest({"point_hint": ["Geranienweg", ""]})
            .then(function (json) {
                expect(json.paths.length).toBeGreaterThan(0);
                // Due to PointHints, we match a different coordinate
                // These coordinates might change over time
                var snappedGeranienWeg = json.paths[0].snapped_waypoints.coordinates[0];
                expect(snappedGeranienWeg[0]).toBeCloseTo(-77.11753, 4);
                expect(snappedGeranienWeg[1]).toBeCloseTo(-11.98152, 4);
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
    it("Disable CH and Use Turn Restrictions", function (done) {
        routing.clearPoints();
        routing.addPoint(new GRInput("-11.981562,-77.11753"));
        routing.addPoint(new GRInput("-11.981862,-77.11453"));

        routing.doRequest({ch: {disable: true}})
            .then(function (json) {
                // With ch this will be only 12 m due to ignored turn restriction
                expect(json.paths[0].distance).toBeGreaterThan(300);
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
    it("Disable CH to use Heading", function (done) {
        routing.clearPoints();
        routing.addPoint(new GRInput("-11.981562,-77.11753"));
        routing.addPoint(new GRInput("-11.981862,-77.11453"));

        routing.doRequest({ch: {disable: true}, heading: [0]})
            .then(function (json) {
                // With ch this will be only 12 m due to ignored turn restriction
                expect(json.paths[0].distance).toBeGreaterThan(150);
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
    it("Test Roundtrip", function (done) {
        routing.clearPoints();
        routing.addPoint(new GRInput("-11.981562,-77.11753"));
        // tmp fix as the API currently requires two points
        routing.addPoint(new GRInput(""));

        routing.doRequest({round_trip: {distance: 10000, seed: 123}, algorithm: "round_trip"})
            .then(function (json) {
                expect(json.paths[0].distance).toBeGreaterThan(1000);
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
});

describe("Info Test", function () {
    it("Get Info", function (done) {

        routing.info()
            .then(function (json) {
                expect(json.version.length).toBeGreaterThan(0);
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
});

describe("i18n Test", function () {
    it("Get EN", function (done) {

        routing.i18n()
            .then(function (json) {
                expect(json.en['web.hike']).toEqual('Hike');
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
    it("Get DE", function (done) {

        routing.i18n({locale: 'de'})
            .then(function (json) {
                expect(json.default['web.hike']).toEqual('Wandern');
                done();
            })
            .catch(function (err) {
                done.fail(err.message);
            });
    });
});