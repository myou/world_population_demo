
var fs = require('fs');

var output = [];
var startYear = 1960;
var endYear = 2011;

fs.readFile('./world-pop.csv', function(err, data) {
  var countriesData = data.toString().split('\n').slice(0, -1);

  for (var i = 1; i < countriesData.length; i++) {
    var countryData = countriesData[i];
    output.push(countryDataToJSON(countryData));
  }

  output = JSON.stringify(output, null, 2);
  fs.writeFile('./world-pop.json', output, function() {
    console.log('Success! JSON written to ./world-pop.json');
  });
});

function countryDataToJSON(countryData) {
  var countryDataColumns = countryData.split(',');
  var countryPopByYear = [];

  for (var j = startYear; j <= endYear; j++) {
    // parseInt is used because decimal point in population is nonsense
    var population = parseInt(countryDataColumns[j - startYear + 2], 10);

    countryPopByYear.push({
      year: j,
      population: population || null
    });
  }

  return {
    name: countryDataColumns[0],
    code: countryDataColumns[1],
    populationByYear: countryPopByYear
  };
}