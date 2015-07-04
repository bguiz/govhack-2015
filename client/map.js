'use strict';

xhrGet('data/sa2-2011-aust-001p-with-props.json', function onGot(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  result = JSON.parse(result);
  console.log('geoJsonData:', result);
  startLeaflet({
    geoJsonData: result,
    getPropertyValue: function getPropertyValue(props) {
      return props.area;
    },
    getPropertyDisplayName: function getPropertyDisplayName(props) {
      return 'Area';
    },
  });
});

function startLeaflet(context) {
  context = context || {};

  var geoJsonData = context.geoJsonData;

  var getRegionName = context.getName || defaultGetRegionName;
  function defaultGetRegionName(props) {
    return props.name;
  }
  var getPropertyValue = context.getPropertyValue || defaultGetPropertyValue;
  function defaultGetPropertyValue(props) {
    return props.value;
  }
  var getPropertyDisplayName = context.getPropertyDisplayName || defaultGetPropertyDisplayName;
  function defaultGetPropertyDisplayName(props) {
    return 'Value';
  }
  var getPropertyColour = context.getPropertyColour || defaultGetPropertyColour;
  function defaultGetPropertyColour(props) {
    return getPropertyColourFromValue(getPropertyValue(props) / 1000000)
  }
  var colourScale = chroma
    .scale(
      ['#eda0ff', '#002680'], // colors
      [0, 1]  // positions
      )
      .domain([1, 10000000], 7, 'log')
      .mode('rgb');
  function getPropertyColourFromValue(d) {
    return colourScale(d);
  }

  var map;
  var info;
  var geoJsonLayer;
  var legend;

  map = L.map('map');

  addTiles();
  addInfoControl();
  addGeoJsonLayer();
  addAttributionControl();
  addLegendControl();

  function addTiles() {
    map
      // Sydney, NSW: 33.8650° S, 151.2094° E
      .setView([-33.8650, 151.2094], 10);

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
    info = L.control();

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function (props) {
      this._div.innerHTML = '<h4>Australia</h4>' +
      (props ?
        '<b>' + getRegionName(props) + '</b><br />' +
          getPropertyDisplayName(props) + ' ' + getPropertyValue(props)
        : 'Hover over a region');
    };

    info.addTo(map);
  }

  function addGeoJsonLayer() {
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

      info.update(
        layer.feature.properties);
    }
    function resetHighlight(e) {
      geoJsonLayer.resetStyle(
        e.target);
      info.update();
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
    legend = L.control({
      position: 'bottomright'
    });

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = colourScale.domain(),
        labels = [],
        from, to;

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' + getPropertyColourFromValue(from + 1) + '"></i> ' +
          from +
          (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);
  }
}

function xhrGet(url, onGot) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        onGot(undefined, this.responseText);
      } else {
        // Error :(
        onGot(this, this.responseText)
      }
    }
  };

  request.send();
  request = null;
}
