
worldPop.directive('wpScatterplot', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    template: '<svg></svg>',
    link: function (scope, element, attrs) {
      element.id = attrs.id;

      // hack, could not get data bind working properly
      // if doing this for work, would either properly study d3.js data binding
      // or simply use an eventemitter design
      scope.$watchCollection('counter', constructGraph);

      constructGraph();

      function constructGraph() {
        document.body.querySelector('#' + attrs.id)
          .parentNode.innerHTML = '<svg id=' + attrs.id + '></svg>';
        element = document.body.querySelector('#' + attrs.id);

        // data
        var data = scope.data.populationByYear;

        // height, width, and margin
        var margin = {
          top: 30,
          left: 100,
          right: 50,
          bottom: 30
        };
        var width = 1000 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        // data to position mappings
        var getXValue = function(datum) { return datum.year; };
        var getXPos = d3.scale.linear()
          .domain([d3.min(data, getXValue), d3.max(data, getXValue)])
          .range([0, width]);
        var mapX = function(datum) { return getXPos(getXValue(datum)); };

        var getYValue = function(datum) { return datum.population; };
        var getYPos = d3.scale.linear()
          .domain([d3.min(data, getYValue), d3.max(data, getYValue)])
          .range([height, 0]);
        var mapY = function(datum) { return getYPos(getYValue(datum)); };

        // axes
        var xAxis = d3.svg.axis().scale(getXPos).orient('bottom');
        var yAxis = d3.svg.axis().scale(getYPos).orient('left');

        // chart
        var chart = d3.select('#' + attrs.id)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ' ,' + margin.top + ')');

        // x axis
        chart.append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(0, ' + height + ')')
          .call(xAxis)
          .append('text')
          .attr('class', 'label')
          .attr('x', width)
          .attr('y', -10)
          .style('text-anchor', 'end')
          .text('Years');

        // y axis
        chart.append('g')
          .attr('class', 'axis')
          .call(yAxis)
          .append('text')
          .attr('class', 'label')
          .attr('transform', 'rotate(90)')
          .attr('y', -15)
          .style('text-anchor', 'start')
          .text('Population');

        var path = chart.append('path')
          .attr('class', 'line')
          .attr('d', line(data));

        var totalLength = path.node().getTotalLength();

        path
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(2000)
          .ease('linear')
          .attr('stroke-dashoffset', 0);
      }
    }
  };
});
