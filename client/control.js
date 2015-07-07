'use strict';

var geoJsonId;
geoJsonId = 'sa2-2011-aust-001p-with-props';
// geoJsonId = 'ste-2011-aust-0001p-with-props';
xhrGet('data/'+geoJsonId+'.json', function onGot(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  result = JSON.parse(result);
  geoJsonResult = result;
  console.log('geoJsonData:', result);

  leafletController.add.tiles();
  setUpListeners();
});

function setUpListeners() {
  [
    // 'ste-2016-2061-schools-data-clean',
    'sa2-2015-2061-schools-data-clean'
  ]
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

function getAllValues(results, propKey)  {
  var vals = [];
  var val;
  var year, region;
  var yearVal, regionVal;
  for (year in results) {
    if (results.hasOwnProperty(year)) {
      yearVal = results[year];
      for (region in yearVal) {
        if (yearVal.hasOwnProperty(region)) {
          regionVal = yearVal[region];
          val = regionVal[propKey];
          if (typeof val !== 'undefined') {
            vals.push(val);
          }
        }
      }
    }
  }
  return vals;
}

function loadDataSet(dataSetId, onDone) {
  console.log('loadDataSet', dataSetId);
  var url = 'data/'+dataSetId+'.json';
  xhrGet(url, function onGot(err, results) {
    if (!err) {
      try {
        results = JSON.parse(results);
        console.log('got', url, results);

        var values = getAllValues(results, 'schools');

        var colourScale = window.chroma
          .scale(
              // Generated using Chroma.js colouyr scale helper
              // http://gka.github.io/palettes/#colors=lightblue,lightyellow,orange,red|steps=10|bez=1|coL=1
              ['#add8e6','#ffb973','#ffac5e','#ff9d4c','#ff8e3b','#ff7f2b','#ff6c1b','#ff570c','#ff3c02','#ff0000'], // colors
              [0, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 1.0] // positions
            )
            // .domain(values, 5, 'equidistant')
            .domain(values, 9, 'k')
            .mode('rgb')
          ;

        leafletController.set.context({
          getPropertyValue: getPropertyValue,
          getPropertyDisplayName: getPropertyDisplayName,
          getPropertyColour: getPropertyColour,
          getPropertyColourFromValue: colourScale,
          getPropertyColourDomain: getPropertyColourDomain,
          filterGeoJson: filterGeoJson,
        });
        leafletController.add.legendControl();
      }
      catch (ex) {
        err = ex;
      }
    }
    onDone(err, results);

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
    function filterGeoJson(result) {
      // NSW only
      result.features = result.features.filter(function eachFeature(feature) {
        return feature.properties.id.charAt(0) === '1';
      });
      return result;
    }


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
    var result = results[id];
    if (!!result) {
      var name = feature.properties.name;
      // Override all properties,
      // except for `id` and `name`, which we must guarantee stay unmodified
      feature.properties = result;
      feature.properties.id = id;
      feature.properties.name = name;
    }
    return feature;
  });

  leafletController.add.geoJsonLayer(geoJsonResult);
}
