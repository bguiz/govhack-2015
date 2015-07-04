'use strict';

var fs = require('fs');

var inFileName = './client/data/sa2-2011-aust-001p.json';
var outFileName = './client/data/sa2-2011-aust-001p-with-props.json';
var isPretty = false;

var geoJson = require(inFileName);
var features = geoJson.features.map(function eachFeature(feature) {
  feature.properties.id = feature.properties.SA2_MAIN11;
  feature.properties.name = feature.properties.SA2_NAME11;
  feature.properties.stateId = feature.properties.STE_CODE11;
  feature.properties.area = feature.properties.ALBERS_SQM;
  ['SA2_MAIN11', 'SA2_5DIG11', 'SA2_NAME11', 'SA3_CODE11', 'SA3_NAME11',
    'SA4_CODE11', 'SA4_NAME11', 'GCC_CODE11', 'GCC_NAME11', 'STE_CODE11',
    'STE_NAME11', 'ALBERS_SQM']
    .forEach(function eachUnwantedProperty(unwantedPropertyName) {
      feature.properties[unwantedPropertyName] = undefined;
    });
  return feature;
});
geoJson.features = features;

fs.writeFile(
  outFileName,
  (isPretty ?
    JSON.stringify(geoJson, undefined, 2) :
    JSON.stringify(geoJson)),
  function onWroteFile(err) {
    if(err) {
        return console.log(err);
    }
    console.log('File write success - geoJson');
});

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
