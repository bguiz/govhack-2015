'use strict';

var leafletController;
leafletController = initLeafletController({
  // geoJsonData: result,
  getPropertyValue: function getPropertyValue(props) {
    return props.area;
  },
  getPropertyDisplayName: function getPropertyDisplayName(props) {
    return 'Area';
  },
});
leafletController.add.infoControl();
leafletController.add.attributionControl();
leafletController.add.legendControl();

var geoJsonResult;

var geoJsonId;
// geoJsonId = 'sa2-2011-aust-001p-with-props';
geoJsonId = 'ste-2011-aust-0001p-with-props';
xhrGet('data/'+geoJsonId+'.json', function onGot(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  result = JSON.parse(result);
  geoJsonResult = result;
  console.log('geoJsonData:', result);

  leafletController.add.tiles();
  leafletController.add.geoJsonLayer(result);
  // testUpdateDummyData(result);
});

function testUpdateDummyData(result) {
  // modify one chloropleth rendering affecting property,
  // and another that does not.
  // simply delay for a few second to simulate changing the dataset
  setTimeout(function() {
    result.features.map(function eachFeature(feature) {
      feature.properties.area = feature.properties.area * 10;
      feature.properties.name = feature.properties.name + ' (m)';
      return feature;
    });
    leafletController.add.geoJsonLayer(result);
  }, 3000);
}

function initLeafletController(initContext) {
  var context;

  var geoJsonData;
  var getRegionName;
  var getPropertyValue;
  var getPropertyDisplayName;
  var getPropertyColour;
  var getPropertyColourDomain;

  var map;
  var geoJsonLayer;
  var infoControl;
  var legendControl;

  map = L.map('map');

  var defaultColourScale = window.chroma
    .scale(
        ['#eda0ff', '#002680'], // colors
        [0, 1]  // positions
      )
      .domain([1, 10000000], 7, 'log')
      .mode('rgb');
  setContext(initContext);

  return {
    add: {
      tiles: addTiles,
      infoControl: addInfoControl,
      geoJsonLayer: addGeoJsonLayer,
      attributionControl: addAttributionControl,
      legendControl: addLegendControl,
    },
    set: {
      context: setContext,
    },
  };

  function defaultGetRegionName(props) {
    return props.name;
  }

  function defaultGetPropertyValue(props) {
    return props.value;
  }

  function defaultGetPropertyDisplayName(props) {
    return 'Value';
  }

  function defaultGetPropertyColour(props) {
    return getPropertyColourFromValue(getPropertyValue(props))
  }

  function defaultGetPropertyColourDomain() {
    return defaultColourScale.domain();
  }

  function getPropertyColourFromValue(d) {
    return defaultColourScale(d);
  }

  function setContext(context) {
    context = context || {};
    getRegionName = context.getName || defaultGetRegionName;
    getPropertyValue = context.getPropertyValue || defaultGetPropertyValue;
    getPropertyDisplayName = context.getPropertyDisplayName || defaultGetPropertyDisplayName;
    getPropertyColour = context.getPropertyColour || defaultGetPropertyColour;
    getPropertyColourDomain = context.getPropertyColourDomain || defaultGetPropertyColourDomain;
  }

  function addTiles() {
    map
      // .setView([-33.8650, 151.2094], 10);  // Sydney, NSW: 33.8650° S, 151.2094° E
      .setView([-28, 138], 4.0);           // Centre of Australia: 28° S, 138° E

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'examples.map-20v6611k'
    }).addTo(map);
  }

  function addInfoControl() {
    // control that shows state info on hover
    infoControl = L.control();

    infoControl.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    infoControl.update = function (props) {
      this._div.innerHTML = '<h4>Australia</h4>' +
      (props ?
        '<b>' + getRegionName(props) + '</b><br />' +
          getPropertyDisplayName(props) + ' ' + getPropertyValue(props)
        : 'Hover over a region');
    };

    infoControl.addTo(map);
  }

  function addGeoJsonLayer(data) {
    geoJsonData = data;

    function style(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getPropertyColour(
          feature.properties)
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }

      infoControl.update(
        layer.feature.properties);
    }

    function resetHighlight(e) {
      geoJsonLayer.resetStyle(
        e.target);
      infoControl.update();
    }

    function zoomToFeature(e) {
      map.fitBounds(
        e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    }

    if (!!geoJsonLayer &&
        map.hasLayer(geoJsonLayer)) {
      // If there is an existing geoJsonLayer,
      // remove it before re-adding the new one.
      // This is done when we wish to refresh the data
      map.removeLayer(geoJsonLayer);
    }

    geoJsonLayer = L.geoJson(geoJsonData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  }

  function addAttributionControl() {
    map.attributionControl
      .addAttribution(
        'Population data &copy; <a href="http://abs.gov.au/">' +
        'Australian Bureau of Statistics</a>');
  }

  function addLegendControl() {
    if (!!legendControl) {
      // If there is an existing legendControl,
      // remove it before re-adding the new one.
      // This is done when we wish to refresh the data
      legendControl.removeFrom(map);
    }

    legendControl = L.control({
      position: 'bottomright'
    });

    legendControl.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = getPropertyColourDomain(),
        labels = [],
        from, to;

      for (var i = 0; i < grades.length; i++) {
        from = parseInt(grades[i], 10);
        to = parseInt(grades[i + 1], 10);

        labels.push(
          '<i style="background:' + getPropertyColourFromValue(from + 1) + '"></i> ' +
          from +
          (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legendControl.addTo(map);
  }
}
