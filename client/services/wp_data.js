
worldPop.factory('wpData', function() {
  var data = worldPopData;

  var getSize = function() {
    return data.length;
  };

  return {
    data: data,
    getSize: getSize
  };
});
