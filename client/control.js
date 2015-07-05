'use strict';

setUpListeners();

function setUpListeners() {
  ['sa2-xxxx-aust-data-clean']
    .forEach(function eachDataSetId(dataSetId) {
      var elem = document.getElementById(dataSetId);
      elem.addEventListener('click', function onSelectDataSet() {
        loadDataSet(dataSetId, displayDataSet);
      }, false);
    });

  ['ste-2016-2061-schools-data-clean']
    .forEach(function eachDataSetWithRangeSliderId(dataSetId) {
      var elem = document.getElementById(dataSetId);
      var displayElem = document.getElementById('range-value-'+dataSetId);

      loadDataSet(dataSetId, function onDone(err, results) {
        updateDataSet();
        elem.addEventListener('input', updateDataSet, false);
        function updateDataSet() {
          var rangeValue = elem.value;
          elem.setAttribute('value', rangeValue);
          console.log('onRangeInput', rangeValue);
          var dataSet = results[''+rangeValue];
          var err;
          if (!dataSet) {
            err = 'No data set found for '+rangeValue;
          }
          displayElem.innerHTML = ''+rangeValue;
          displayDataSet(err, dataSet);
        }
      });


    });
}

function loadDataSet(dataSetId, onDone) {
  console.log('loadDataSet', dataSetId);
  var url = 'data/'+dataSetId+'.json';
  xhrGet(url, function onGot(err, results) {
    if (!err) {
      try {
        results = JSON.parse(results);
        console.log('got', url, results);
      }
      catch (ex) {
        err = ex;
      }
    }

    onDone(err, results);
  });
}

function displayDataSet(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('displayDataSet', results);

  // Merge the data result into the geojson
  geoJsonResult.features.map(function eachFeature(feature) {
    var id = feature.properties.id;
    var name = feature.properties.name;
    var result = results[id];
    if (!!result) {
      // Override all properties,
      // except for `id` and `name`, which we must guarantee stay unmodified
      feature.properties = result;
      feature.properties.id = id;
      feature.properties.name = name;
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
    return props.schools;
    // return props.MedianHousePrice;
  }
  function getPropertyDisplayName(props) {
    return 'New Schools Needed';
    // return 'Median House Price';
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
