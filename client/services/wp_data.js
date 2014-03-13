
worldPop.factory('wpData', function() {
  var data = [{
    name: 'United States',
    code: 'USA',
    populationByYear: [
      { year: 1960, population: 93145751 },
      { year: 1961, population: 95588326.4 }
    ]
  }];

  var getSize = function() {
    return data.length;
  };

  return {
    data: data,
    getSize: getSize
  };
});
