
worldPop.controller('ChartCtrl', function($scope, wpData, wpState) {
  $scope.state = wpState;

  $scope.data = calculateData();

  $scope.$watchCollection('state.selectedCountries', function() {
    $scope.data = calculateData();
  });

  function calculateData() {
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
    }

    return {
      name: name,
      code: code,
      populationByYear: populationByYear
    };
  }
});
