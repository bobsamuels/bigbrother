var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');

require('less/d3Chart.less');
var d3Chart = {};

d3Chart.create = function(el, props, state) {
    var margin = 80;
    var height = 800;
    var width = 1000;

    var svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', 1000)
        .attr('height', height);

    svg.append('g')
        .attr("transform", "translate(" + margin + "," + margin + ")")
        .attr('class', 'd3-points');

    this.update(el, state, false);
};

d3Chart.reset = function(){
    d3.selectAll("circle").remove();
    d3.selectAll("text").remove();
    d3.selectAll('g').append('text')
        .attr("dx", 300)
        .attr("dy", 300)
        .attr("font-size", "24pt")
        .text('Loading Data');
}

d3Chart.update = function(el, state, clear) {
    // Re-compute the scales, and render the data points
    if(clear)
    {
        d3.selectAll("circle").remove();
        d3.selectAll("text").remove();
    }
    this._drawPoints(el, state.data);
};

d3Chart.destroy = function(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
    d3.select(el).remove();
};

d3Chart._drawPoints = function(el, data) {
    var height = 600;
    var width = 800;
    var margin = 80;
    var labelX = '';
    var labelY = '';

    //var svg = d3.select(el)
    //    .append('svg')
    //    .attr('class', 'd3')
    //    .attr("width", width + margin + margin)
    //    .attr("height", height + margin + margin)
    //    .append("g")
    //    .attr("transform", "translate(" + margin + "," + margin + ")");

    var svg = d3.selectAll('.d3-points');

    var x = d3.scale.linear()
        .domain([d3.min(data, function (d) {
            return d.x;
        }), d3.max(data, function (d) {
            return d.x;
        })])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([d3.min(data, function (d) {
            return d.y;
        }), d3.max(data, function (d) {
            return d.y;
        })])
        .range([height, 0]);

    var scale = d3.scale.sqrt()
        //.domain([d3.min(data, function (d) {
        //    return d.size;
        //}), d3.max(data, function (d) {
        //    return d.size;
        //})])
        .domain([0, d3.max(data, function (d) {
                return d.size;
            })])
        .range([1, 50]);

    var opacity = d3.scale.sqrt()
        .domain([d3.min(data, function (d) {
            return d.size;
        }), d3.max(data, function (d) {
            return d.size;
        })])
        .range([1, .8]);

    var color = d3.scale.category10();

//    var xAxis = d3.svg.axis().scale(x);
//    var yAxis = d3.svg.axis().scale(y).orient("left");
//
//    svg.append("g")
//        .attr("class", "y axis")
//        .call(yAxis)
//        .append("text")
//        .attr("transform", "rotate(-90)")
//        .attr("x", 20)
//        .attr("y", -margin)
//        .attr("dy", ".71em")
//        .style("text-anchor", "end")
//        .text(labelY);
//
//// x axis and label
//    svg.append("g")
//        .attr("class", "x axis")
//        .attr("transform", "translate(0," + height + ")")
//        .call(xAxis)
//        .append("text")
//        .attr("x", width + 20)
//        .attr("y", margin - 10)
//        .attr("dy", ".71em")
//        .style("text-anchor", "end")
//        .text(labelX);

    var entry = svg.selectAll("circle")
        .data(data)
        .enter();

        entry.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("opacity", function (d) {
            return opacity(d.size);
        })
        .style("cursor", "pointer")
        .attr("r", function (d) {
            return scale(d.size);
        })
        .style("fill", function (d) {
            return color(d.c);
        })
        .on('mouseover', function (d, i) {
            fade(d.c, .1);
        })
        .on('mouseout', function (d, i) {
            fadeOut();
        })
        .on('click', function(d){
            var url = '/#/details/' + d.type + '/'+ d.name;
            window.location = url;
        })
        .transition()
        .delay(function (d, i) {
            return x(d.x) - y(d.y);
        })
        .duration(1500)
        .attr("cx", function (d) {
            return x(d.x);
        })
        .attr("cy", function (d) {
            return y(d.y);
        })
        .ease("bounce")

    entry.append("text")
        .style("font-size", "12pt")
        .style("color", "black")
        .attr("dx", width / 2)
        .attr("dy", height / 2)
        .transition()
        .delay(function (d, i) {
            return x(d.x) - y(d.y);
        })
        .duration(1500)
        //.attr("dx", function(d){return -20})
        .attr("dx", function (d) {
            return x(d.x) - (10 + d.name.length);
        })
        .attr("dy", function (d) {
            return y(d.y);
        })
        .text(function(d){return d.name})
        .ease("bounce");


    function fade(c, opacity) {
        svg.selectAll("circle")
            .filter(function (d) {
                return d.c != c;
            })
            .transition()
            .style("opacity", opacity);
    }

    function fadeOut() {
        svg.selectAll("circle")
            .transition()
            .style("opacity", function (d) {
                opacity(d.size);
            });
    }
}
//d3Chart._drawPoints = function(el, scales, data) {
//    var g = d3.select(el).selectAll('.d3-points');
//
//    var point = g.selectAll('.d3-point')
//        .data(data, function(d) { return d.name; });
//
//    // ENTER
//    point.enter().append('circle')
//        .attr('class', function(d){
//            return 'd3-point ' + d.type + 'point';
//        });
//
//    // ENTER & UPDATE
//    point.attr('cx', function(d) { return scales.x(d.x); })
//        .attr('cy', function(d) { return scales.y(d.y); })
//        .attr('r', function(d) { return scales.z(d.z); });
//
//
//    point.on('click', function(d){
//        console.log(d);
//    })
//
//    // EXIT
//    point.exit()
//        .remove();
//};

//
//function scale(data) {
//    return d3.scale.linear()
//        .domain([0, d3.max(data)])
//        .range([0, 420]);
//}
//
//chart.create = function(el, props, state) {
//    var c = d3.select(el)
//    var bar = c.selectAll("div");
//
//    c.attr('class', 'd3')
//        .attr('width', props.width)
//        .attr('height', props.height);
//
//    var barUpdate = bar.data(state.data);
//    var barEnter = barUpdate.enter().append("div");
//    var _scale = scale(state.data);
//
//    barEnter.style("width", function(d) { return _scale(d) + "px"; });
//
//    barEnter.text(function(d) { return d; });
//
//    //var svg = d3.select(el).append('svg')
//    //    .attr('class', 'd3')
//    //    .attr('width', props.width)
//    //    .attr('height', props.height);
//    //
//    //svg.append('g')
//    //    .attr('class', 'd3-points');
//    //
//    //this.update(el, state);
//};

module.exports = d3Chart;