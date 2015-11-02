
worldPop.controller('ChartCtrl', function($scope, wpData, wpState) {
  // hack, could not get data bind working properly
  // if doing this for work, would either properly study d3.js data binding
  // or simply use an eventemitter design
  $scope.counter = 0;
  $scope.state = wpState;
  $scope.data = {
    name: '',
    code: '',
    populationByYear: []
  };;

  $scope.$watchCollection('state.selectedCountries', calculateDisplayData);

  function calculateDisplayData() {
    $scope.counter++; // the hack mentioned above

    $scope.data.name = 'none';
    $scope.data.code = '';
    $scope.data.populationByYear.splice(0, $scope.data.populationByYear.length);

    var selected = wpData.data.filter(function(country) {
      return wpState.selectedCountries.indexOf(country.name) !== -1;
    });

    if (selected.length === 0) return;

    $scope.data = {
      populationByYear: calculateCombinedPopulationList(selected),
      name: constructSelectedCountryNames(selected),
      code: selected.map(function(country) {
        return country.code;
      }).join(', ')
    };
  }

  function constructSelectedCountryNames(selected) {
    var name;

    if (selected.length === 2) {
      name = selected.map(function(country) {
        return country.name;
      }).join(' and ');
    } else {
      var nameList = selected.map(function(country) {
        return country.name;
      });
      name = nameList[nameList.length - 1];
      nameList[nameList.length - 1] = 'and ' + name;
      name = nameList.join(', ');
    }

    return name;
  }

  function calculateCombinedPopulationList(selected) {
    var populationList = [];

    for (var i = 0; i < selected[0]['populationByYear'].length; i++) {
      var year = selected[0]['populationByYear'][i].year;
      var population = 0;

      selected.forEach(function(country) {
        population += country.populationByYear[i].population || 0;
      });

      populationList[i] = {
        year: year,
        population: population
      };
    }

    return populationList;
  }
});
