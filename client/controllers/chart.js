
worldPop.controller('ChartCtrl', function($scope, wpData, wpState) {
  var populationList = [];
  var processedData = {
    populationByYear: populationList
  };

  // hack, could not get data bind working properly
  // if doing this for work, would either properly study d3.js data binding
  // or simply use an eventemitter design
  $scope.counter = 0;

  $scope.state = wpState;

  $scope.data = processedData;

  $scope.$watchCollection('state.selectedCountries', calculateData);

  function calculateData() {
    $scope.counter++;

    processedData.name = 'none';
    processedData.code = '';
    populationList.splice(0, populationList.length);

    var filtered = wpData.data.filter(function(country) {
      return wpState.selectedCountries.indexOf(country.name) !== -1;
    });

    if (filtered.length === 0) return;

    var nameList, name;
    if (filtered.length === 2) {
      name = filtered.map(function(country) {
        return country.name;
      }).join(' and ');
    } else {
      nameList = filtered.map(function(country) {
        return country.name;
      });
      name = nameList[nameList.length - 1];
      nameList[nameList.length - 1] = 'and ' + name;
      name = nameList.join(', ');
    }

    var code = filtered.map(function(country) {
      return country.code;
    }).join(', ');

    for (var i = 0; i < filtered[0]['populationByYear'].length; i++) {
      var year = filtered[0]['populationByYear'][i].year;
      var population = 0;

      filtered.forEach(function(country) {
        population += country.populationByYear[i].population || 0;
      });

      populationList[i] = {
        year: year,
        population: population
      };
    }

    processedData.name = name;
    processedData.code = code;
  }
});
