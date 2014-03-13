
worldPop.directive('wpLinechart', function($parse) {
  return {
    restrict: 'E',
    replace: true,
    template: '<svg></svg>',
    link: function (scope, element, attrs) {
      var id = attrs.id;
      var data = {
        "name": "Arab World",
        "code": "ARB",
        "populationByYear": [
          {
            "year": 1960,
            "population": 93145751
          },
          {
            "year": 1961,
            "population": 95588326
          },
          {
            "year": 1962,
            "population": 98125908
          }
        ]
      };

      var popData = data.populationByYear;
      var popNumData = popData.map(function(datum) {
        return datum.population;
      });
      var yearData = popData.map(function(datum) {
        return datum.year;
      });
      var maxPopData = d3.max(popNumData);
      var minPopData = d3.min(popNumData);
      var diffPopData = maxPopData - minPopData;
      var basePopDomain = minPopData - diffPopData * 0.1;
      element.id = id;

      // height, width, and x and y data -> position scalers
      var width = 1000;
      var height = 500;
      var xMargin = 100;
      var yMargin = 30;
      var x = d3.scale.linear()
        .domain([0, popData.length - 1])
        .range([xMargin, width - xMargin]);
      var y = d3.scale.linear()
        .domain([basePopDomain, maxPopData])
        .range([yMargin, height - yMargin]);

      // chart
      var chart = d3.select('#' + id)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(0, 500)');

      // line graph
      var line = d3.svg.line()
        .x(function(d) { return x(d.year - 1960); })
        .y(function(d) { return -1 * y(d.population); });

      chart.append('path')
        .attr('d', line(popData));

      // x axes
      chart.append('line')
        .attr('x1', x(0))
        .attr('y1', -1 * y(basePopDomain))
        .attr('x2', x(popData.length - 1) + 20)
        .attr('y2', -1 * y(basePopDomain));

      chart.append('line')
        .attr('x1', x(0))
        .attr('y1', -1 * y(basePopDomain))
        .attr('x2', x(0))
        .attr('y2', -1 * y(maxPopData));

      // tickLabels
      chart.selectAll('.xTickLabel')
        .data(yearData)
        .enter()
        .append('text')
        .attr('class', 'xTickLabel')
        .text(String)
        .attr('x', function(d) { return x(d - 1960); })
        .attr('y', 0)
        .attr('text-anchor', 'middle');

      chart.selectAll('.yTickLabel')
        .data(y.ticks(5))
        .enter()
        .append("text")
        .attr("class", 'yTickLabel')
        .text(String)
        .attr('x', 0)
        .attr('y', function(d) { return -1 * y(d); })
        .attr('text-anchor', 'start')
        .attr('dy', 4);

      // ticks
      chart.selectAll('.xTick')
        .data(yearData)
        .enter()
        .append('line')
        .attr('class', 'xTick')
        .attr('x1', function(d) { return x(d - 1960); })
        .attr('y1', -1 * y(basePopDomain))
        .attr('x2', function(d) { return x(d - 1960); })
        .attr('y2', -1 * y(basePopDomain - diffPopData * 0.03));

      chart.selectAll('.yTick')
        .data(y.ticks(5))
        .enter()
        .append('line')
        .attr('class', 'yTick')
        .attr('y1', function(d) { return -1 * y(d); })
        .attr('x1', x(-0.05))
        .attr('y2', function(d) { return -1 * y(d); })
        .attr('x2', x(0));
    }
  };
});
