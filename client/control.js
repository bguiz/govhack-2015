'use strict';

setUpListeners();

function setUpListeners() {
  ['sa2-xxxx-aust-data-clean']
    .forEach(function(dataSetId) {
      var elem = document.getElementById(dataSetId);
      elem.addEventListener('click', function onSelectDataSet() {
        loadDataSet(dataSetId);
      });
    });
}

function loadDataSet(dataSetId) {
  console.log('loadDataSet', dataSetId);
  var url = 'data/'+dataSetId+'.json';
  xhrGet(url, function onGot(err, results) {
    if (err) {
      console.error(err);
      return;
    }
    results = JSON.parse(results);
    console.log('got', url, results);

    displayDataSet(results);
  });
}

function displayDataSet(results) {
  // Merge the data result into the geojson
  geoJsonResult.features.map(function eachFeature(feature) {
    var id = feature.properties.id;
    var result = results[id];
    if (!!result) {
      // Override all properties,
      // except for ID, which we must guarantee stay unmodified
      feature.properties = result;
      feature.properties.id = id;
    }
    return feature;
  });

  var colourScale = window.chroma
    .scale(
        ['#eda0ff', '#002680'], // colors
        [0, 1] // positions
      )
      .domain([1, 1000], 8)
      .mode('rgb');

  leafletController.set.context({
    getPropertyValue: getPropertyValue,
    getPropertyDisplayName: getPropertyDisplayName,
    getPropertyColour: getPropertyColour,
    getPropertyColourDomain: getPropertyColourDomain,
  });
  function getPropertyValue(props) {
    return props.MedianHousePrice;
  }
  function getPropertyDisplayName(props) {
    return 'Median House Price';
  }
  function getPropertyColour(props) {
    return colourScale(getPropertyValue(props))
  }
  function getPropertyColourDomain(d) {
    return colourScale.domain();
  }

  leafletController.add.legendControl();
  leafletController.add.geoJsonLayer(geoJsonResult);
}
