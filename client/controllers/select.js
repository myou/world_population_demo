
worldPop.controller('SelectCtrl', function($scope, wpData, wpState) {
  var countries = wpData.data.map(function(countryData) {
    return countryData.name;
  });

  $scope.countries = countries;

  $scope.search = search = {};

  $scope.topFiveSearchResults = function() {
    if (!search.name) return;

    return countries.filter(function(country) {
      var notSelected = $scope.selectedCountries.indexOf(country) === -1;
      var matched = country.toLowerCase().match(search.name);
      return notSelected && matched;
    }).slice(0, 5);
  };

  $scope.selectedCountries = wpState.selectedCountries = [ 'United States', 'Arab World' ];

  $scope.add = function(index) {
    wpState.selectedCountries.push($scope.topFiveSearchResults()[index]);
  };

  $scope.remove = function(index) {
    wpState.selectedCountries.splice(index, 1);
  };
});
