
worldPop.controller('TabularCtrl', function($scope, wpData) {
  $scope.getDataSize = function() {
    return wpData.getSize();
  };
});