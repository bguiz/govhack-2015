'use strict';

setUpListeners();

function setUpListeners() {
`  ['sa2-xxxx-aust-data-clean']
    .forEach(function(dataSetId) {
      var elem = document.getElementById(dataSetId);
      elem.addEventListener('click', function onSelectDataSet() {
        displayDataSet(dataSetId);
      });
    });
}

function displayDataSet(dataSetId) {
  console.log('displayDataSet', dataSetId);
  var url = 'data/'+dataSetId+'.json';
  xhrGet(url, function onGot(err, results) {
    if (err) {
      console.error(err);
      return;
    }
    results = JSON.parse(results);
    console.log('got', url, results);

    geoJsonResult.features.map(function eachFeature(feature) {
      var id = feature.properties.id;
      var result = results[id];
      if (!!result) {
        feature.properties.MedianHousePrice = result.MedianHousePrice;
        feature.properties.MedianMortgagePrice = result.MedianMortgagePrice;
      }
      return feature;
    });

    leafletController.set.context({
      getPropertyValue: function getPropertyValue(props) {
        return props.MedianHousePrice;
      },
      getPropertyDisplayName: function getPropertyDisplayName(props) {
        return 'Median House Price';
      },
    });
    leafletController.add.geoJsonLayer(geoJsonResult);
  });
}
