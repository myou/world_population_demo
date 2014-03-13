
worldPop.controller('TabularCtrl', function($scope, wpData) {
  var years = [];
  for (var i = wpData.startYear; i <= wpData.endYear; i++) {
    years.push(i);
  }

  $scope.getDataSize = function() {
    return wpData.data.length;
  };

  $scope.years = years;

  $scope.countriesData = wpData.data;
});
