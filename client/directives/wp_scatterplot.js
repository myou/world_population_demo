
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

        // dots
        chart.selectAll('.dot')
          .data(data)
          .enter().append('circle')
          .attr('class', 'dot selectable')
          .attr('r', 5)
          .attr('cx', mapX)
          .attr('cy', mapY)
          .attr('data-year', function(datum) { return datum.year; })
          .attr('data-pop', function(datum) { return datum.population; });

        // drag to select
        var mousedown = false;
        var selectionField = chart.append('rect')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('fill', 'none')
          .attr('pointer-events', 'visible')
          .attr('class', 'selection-field');

        selectionField.on('mousedown', function() {
          var point = d3.mouse(this);

          chart.select('rect.selection').remove();
          chart.append('rect')
            .attr('class', 'selection')
            .attr('x', point[0])
            .attr('y', point[1])
            .attr('width', 0)
            .attr('height', 0);

          mousedown = true;
        }).on('mousemove', function() {
          if (!mousedown) return;

          var selection = chart.select( "rect.selection");
          var selectionX = parseInt(selection.attr('x'), 10);
          var selectionY = parseInt(selection.attr('y'), 10);
          var width = parseInt(selection.attr('width'), 10);
          var height = parseInt(selection.attr('height'), 10);

          var point = d3.mouse(this)
          var pointX = point[0];
          var pointY = point[1];

          var move = {
            x: pointX - selectionX,
            y: pointY - selectionY
          };

          if (move.x < 1 || move.x * 2 < width) {
            selectionX = pointX;
            width -= move.x;
          } else {
            width = move.x;
          }

          if (move.y < 1 || move.y * 2 < height) {
            selectionY = pointY;
            height -= move.y;
          } else {
            height = move.y;
          }

          selection
            .attr('x', selectionX)
            .attr('y', selectionY)
            .attr('width', width)
            .attr('height', height);

          chart.selectAll('.dot').classed('selected', false);
          var selected = getSelectedDots(chart, selection, mapX, mapY);
          selected.classed('selected', true);
        });

        angular.element(document).on('mouseup', function() {
          if (!mousedown) return; // for mouseup when view not visible

          var selection = chart.select('rect.selection');
          var selected = getSelectedDots(chart, selection, mapX, mapY);

          selected.each(function(datum) {
            console.log('selected data point: ' +
              datum.year + ' : ' + datum.population + ' for ' + scope.data.name);
          });

          selection.remove();
          mousedown = false;
        });
      }

      function getSelectedDots(chart, selection, mapX, mapY) {
        var x1 = parseInt(selection.attr('x'), 10);
        var y1 = parseInt(selection.attr('y'), 10);
        var x2 = x1 + parseInt(selection.attr('width'), 10);
        var y2 = y1 + parseInt(selection.attr('height'), 10);

        return chart.selectAll('.dot')
          .filter(function(datum) {
            var x = mapX(datum);
            var y = mapY(datum);

            var withinX = x >= x1 && x <= x2;
            var withinY = y >= y1 && y <= y2;
            return withinX && withinY;
          });
      }
    }
  };
});
