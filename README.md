# JavaScript client for the Geodir API

This project offers JavaScript clients and examples for the [Geodir API](https://www.geodir.co).

**Try the live examples [here](https://graphhopper.com/api/1/examples/).**

Also see how we integrated the Routing and the Geocoding API to build a fully featured maps application called [Geodir Maps](http://maps.geodir.co)

## Getting Started

### CDN

You can use the hosted js client by adding it to your HTML like this:

```
 <script src="/dist/geodir-js.js"></script>
```

You can then use it like this:
```
<script>
  window.onload = function() {

    var geodir = new GeodirAPI.Routing({
      key: "[Sign-up for free and get your own key: https://www.graphhopper.com/products/]",
      vehicle: "car",
      elevation: false
    });

    geodir.addPoint(new GRInput(47.400905, 8.534317));
    geodir.addPoint(new GRInput(47.394108, 8.538265));

    geodir.doRequest()
      .then(function(json) {
        // Add your own result handling here
        console.log(json);
      })
      .catch(function(err) {
        console.error(err.message);
      });


  };
</script>
```

### NPM

Install the lib with npm:

```npm install @geodir/geodir-js --save```

You can either require the whole client enabling you to use every GraphHopper API, but you can also only require the pieces you need.
```
 require('@geodir/geodir-js');
 // If you only need e.g. Routing, you can only require the needed parts
 //var GeodirRouting = require('@geodir/geodir-js/src/GeodirRouting');
 //var GRInput = require('@geodir/geodir-js/src/GRInput');
 
 window.onload = function() {
 
     var defaultKey = "[Sign-up for free and get your own key: https://www.geodir.co/]";
     var profile = "car";
 
     var host;
     var ghRouting = new GraphHopper.Routing({key: defaultKey, host: host, vehicle: profile, elevation: false});
     // If you only need e.g. Routing, you can only require the needed parts
     //var ghRouting = new GeodirRouting({key: defaultKey, host: host, vehicle: profile, elevation: false});
 
     // Setup your own Points
     ghRouting.addPoint(new GRInput(47.400905, 8.534317));
     ghRouting.addPoint(new GRInput(47.394108, 8.538265));
 
     ghRouting.doRequest()
     .then(function(json){
        // Add your own result handling here
        console.log(json);
     })
     .catch(function(err){
        console.error(err.message);
     });
 
 };
```

## Running Tests

You can run all tests via `npm test`. If you only want to run a single spec file, you can use the `--spec` option, e.g., `npm test --spec spec/GeodirRoutingSpec.js`.

## Dependencies

The API depends on superagent and bluebird which are packaged into the geodir-js.js.

The demo uses a couple of dependencies, but they are not required for requests to the API.

## Integrate the APIs in your application

You can either use our [bundled version](./dist/geodir-js.js), including all APIs or you can use only the 
pieces you need.

### GraphHopper Routing API

![Geodir Routing API screenshot](./img/screenshot-routing.png)

You need [the routing client](./src/GeodirRouting.js).

There is also a different client developed from the community [here](https://www.npmjs.com/package/lrm-graphhopper).


### Geodir Isochrone API

![Geodir Isochrone API screenshot](https://raw.githubusercontent.com/graphhopper/directions-api/master/img/isochrone-example.png)

You need [the isochrone client](./src/GeodirIsochrone.js)


### Geodir Geocoding API

![Geodir Geocoding API screenshot](./img/screenshot-geocoding.png)

You need [the geocoding client](./src/GeodirGeocoding.js).
