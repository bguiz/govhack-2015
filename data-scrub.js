'use strict';

var fs = require('fs');

var inFileName;
var outFileName;
var isPretty = false;

inFileName = './client/data/sa2-2011-aust-001p.json';
outFileName = './client/data/sa2-2011-aust-001p-with-props.json';

// SA2 GeoJson

var geoJsonSa2 = require(inFileName);
var features = geoJsonSa2.features.map(function eachFeature(feature) {
  var props = {
    id: feature.properties.SA2_MAIN11,
    name: feature.properties.SA2_NAME11,
    stateId: feature.properties.STE_CODE11,
    area: feature.properties.ALBERS_SQM,
  };
  feature.properties = props;
  // feature.properties.id = feature.properties.SA2_MAIN11;
  // feature.properties.name = feature.properties.SA2_NAME11;
  // feature.properties.stateId = feature.properties.STE_CODE11;
  // feature.properties.area = feature.properties.ALBERS_SQM;
  // ['SA2_MAIN11', 'SA2_5DIG11', 'SA2_NAME11', 'SA3_CODE11', 'SA3_NAME11',
  //   'SA4_CODE11', 'SA4_NAME11', 'GCC_CODE11', 'GCC_NAME11', 'STE_CODE11',
  //   'STE_NAME11', 'ALBERS_SQM']
  //   .forEach(function eachUnwantedProperty(unwantedPropertyName) {
  //     feature.properties[unwantedPropertyName] = undefined;
  //   });
  return feature;
});
geoJsonSa2.features = features;

fs.writeFile(
  outFileName,
  (isPretty ?
    JSON.stringify(geoJsonSa2, undefined, 2) :
    JSON.stringify(geoJsonSa2)),
  function onWroteFile(err) {
    if(err) {
        return console.log(err);
    }
    console.log('File write success - geoJsonSa2');
});

// State geoJson

inFileName = './client/data/ste-2011-aust-0001p.json';
outFileName = './client/data/ste-2011-aust-0001p-with-props.json';

var geoJsonSte = require(inFileName);
var featuresSte = geoJsonSte.features.map(function eachFeature(feature) {
  var props = {
    id: feature.properties.STE_CODE11,
    name: feature.properties.STE_NAME11,
    area: feature.properties.ALBERS_SQM,
  };
  feature.properties = props;
  // feature.properties.id = feature.properties.STE_CODE11;
  // feature.properties.name = feature.properties.STE_NAME11;
  // feature.properties.area = feature.properties.ALBERS_SQM;
  // ['STE_CODE11', 'STE_NAME11', 'ALBERS_SQM']
  //   .forEach(function eachUnwantedProperty(unwantedPropertyName) {
  //     feature.properties[unwantedPropertyName] = undefined;
  //   });
  return feature;
});
geoJsonSte.features = featuresSte;

fs.writeFile(
  outFileName,
  (isPretty ?
    JSON.stringify(geoJsonSte, undefined, 2) :
    JSON.stringify(geoJsonSte)),
  function onWroteFile(err) {
    if(err) {
        return console.log(err);
    }
    console.log('File write success - geoJsonSte');
});


// Dummy data

inFileName = './client/data/sa2-xxxx-aust-data.json';
outFileName = './client/data/sa2-xxxx-aust-data-clean.json';
var data = require(inFileName);
var key, val;
for (key in data) {
  if (data.hasOwnProperty(key)) {
    val = data[key];
    data[key] = val[0];
  }
}
fs.writeFile(
  outFileName,
  (isPretty ?
    JSON.stringify(data, undefined, 2) :
    JSON.stringify(data)),
  function onWroteFile(err) {
    if(err) {
        return console.log(err);
    }
    console.log('File write success - data');
});
