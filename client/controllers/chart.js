
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

    if (filtered.length === 0) return null;

    var name = filtered.map(function(country) {
      return country.name;
    }).join(', ');

    var code = filtered.map(function(country) {
      return country.code;
    }).join(', ');

    var populationByYear = filtered[0].populationByYear;
    var others = filtered.slice(1);

    for (var i = 0; i < populationByYear.length; i++) {
      others.forEach(function(country) {
        if (populationByYear[i].population === null) {
          populationByYear[i].population = country.populationByYear[i].population;
        } else {
          populationByYear[i].population += country.populationByYear[i].population || 0;
        }
      });

      populationList[i] = populationByYear[i];
    }

    processedData.name = name;
    processedData.code = code;
  }
});
