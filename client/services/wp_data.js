
worldPop.factory('wpData', function() {
  var data = {
    'United States': {
      code: 'USA',
      populationByYear: [
        { year: 1960, population: 93145751 },
        { year: 1961, population: 95588326.4 }
      ]
    }
  };

  var getSize = function() {
    var size = 0;
    for (var k in data) { size++ ;}
    return size;
  };

  return {
    data: data,
    getSize: getSize
  };
});
