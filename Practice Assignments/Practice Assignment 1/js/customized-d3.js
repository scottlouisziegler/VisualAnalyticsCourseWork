
$(document).ready(function(){ /// jQuery function that starts JavaScript when DOM loads
/// Data in JSON format. In this type of JSON variables before ":" are called keys, after semicolon are called values.
  var data = [{"date":"2016-01","total":36, "color":"red"},{"date":"2016-02","total":45, "color":"orange"},{"date":"2016-03","total":53, "color":"yellow"},{"date":"2016-04","total":81, "color":"green"},{"date":"2016-05","total":20, "color":"blue"},{"date":"2016-06","total":11, "color":"indigo"}];

var margin = {top: 40, right: 40, bottom: 40, left:40}, //// The concept of margins is best explained here: http://bl.ocks.org/mbostock/3019563
    width = 600, ///width and height of the SVG image 
    height = 500;

var x = d3.time.scale() /// D3 has multiple scales (I will discuss scales later in this lesson). This is a time scale. this scale is used to draw the x-axis.Pay attention to how we specify domain and rangeBound for this scale. rangeBound you can find only in time scales
    .domain([new Date(data[0].date), d3.time.month.offset(new Date(data[data.length - 1].date), 0)])/// domain is an array that contains the beginning of the range and the end of the range. new Date(XXX) in Javascript means a date.
    /// data[0].date is a reference to the first value in our JSON array.
    .rangeRound([0, width - margin.left - margin.right]); /// the rangeBound extends from 0 to the maximum width (width-margins!!!).


var y = d3.scale.linear() /// This is a linear scale. This scale is used to draw the y-axis. 
    .domain([0, d3.max(data, function(d) { return d.total;})]) /// Similarly to the time scale,this scale has a domain as well. 
    ///The domain start at 0 and continues to the largest number in JSON array. d3.max is a function in D3 that allows to determine the largest number in the array.
    //// function(d) { return d.total;} -- this function extracts all values with the key total from the data.
    .range([height - margin.top - margin.bottom, 0]); /// this scale has a range, not a rangeBound. The range extends from the max height to 0

var xAxis = d3.svg.axis() /// Specification for xAxis
    .scale(x) // link to x scale
    .orient('bottom') /// position
    .ticks(d3.time.month, 1) /// Changed this to month since dealing with months 
    //The ticks method will split your domain in (more or less) n convenient, 
    //human-readable values, and return an array of these values. This is especially useful to label axes. 
    //Passing these values to the scale allows them to position ticks nicely on an axis.
    .tickFormat(d3.time.format('%m-%Y')) /// d3.time.format('%m-%d-%Y') is a function in d3.js You can read more about it here: https://github.com/mbostock/d3/wiki/Time-Formatting
    /// try to change this format to day of the year as a decimal number [001,366].
    .tickSize(0) /// tickSize is specified in pixels. tickSize and tickPadding are similar to CSS.
    ///tickPadding pushes elements in, away from the edges of the SVG, to prevent them from being clipped. 
    .tickPadding(8);

var yAxis = d3.svg.axis() /// Specification for yAxis
    .scale(y) // link to y scale
    .orient('left')
    .tickPadding(8);
    
var xAxis1 = d3.svg.axis() //// this is an additional xAxis scale for gridlines
    .scale(x) // link to x scale
    .orient('bottom'); /// important to keep orientation for the gridlines.

var yAxis1 = d3.svg.axis()
    .scale(y)
    .orient('left');

var svg = d3.select('#bar-demo').append('svg') /// append an SVG chart to the div with id #bar-demo
    .attr('class', 'chart') /// Attach a CSS class (see styles above). This class can have any oher name
    .attr('width', width) // a reference to width which was specified earlier in this file
    .attr('height', height) // a reference to height which was specified earlier in this file
  .append('g') /// here we specify that the chart will conatin a group of elements
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')'); /// the position of the chart should start not at 0,0,but at 40,40.



svg.append("g") /// append a group of grid lines         
        .attr("class", "grid") /// append CSS class "grid". See styles above
        .attr("transform", "translate(0," + (height - margin.bottom - margin.top)+")") /// the grid should not start at 0,0. Where shoud it start,can you compute?
        .call(xAxis1 /// a reference to xAxis1
        .ticks(d3.time.day, 30) /// since I'm working with months, changed this to 30 days.
        .tickSize(-(height-margin.top-margin.bottom), 0, 0) /// please note that these ticks are larger
        .tickFormat("")
);            
svg.append('g') /// Append xAxis
    .attr('class', 'axis') /// A reference to a CSS class
    .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')') ///position
    .call(xAxis); //A reference to xAxis
    
svg.append('g') /// Append yAxis
  .attr('class', 'axis') ///A reference to a CSS class
  .call(yAxis); //Reference to yAxis

svg.append("g") /// Append yAxis        
        .attr("class", "grid") /// A reference to a CSS class
        .call(yAxis1 //A reference to yAxis1
        .ticks(20) /// try to close this line, see what happens. By default, you will have gridlines for each bar
        .tickSize(-(width-margin.left-margin.right), 0, 0)
         .tickFormat("")
        );

svg.selectAll('.chart') /// Here we select the CSS class chart. (Remember we assigned it earlier?)
    .data(data) //Bind the chart to data.
    .enter()
    .append('rect') // add SVG rectangles
    .attr('class', 'bar') // Add a CSS class
    .attr('x', function(d) { return x(new Date(d.date)); }) /// A reference to valriables on x scale
    .attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.total)) })
    /// Specification how tall bars should be in pixels
    .attr('width', 25) // Width of bar charts
    .attr('height', function(d) { return height - margin.top - margin.bottom - y(d.total) }) //height of bars in pixel
	.style("stroke", function(d) { return d.color; });//adding color as defined in dataset, based on: http://stackoverflow.com/questions/21821304/how-to-assign-random-colors-to-d3-bar-chart
	

 svg.selectAll(".rect") /// select all DOM elements that have rect class
     .data(data) /// bind to data
   .enter().append("svg:text") //append text labels with values
     .attr("x", function(d) { return x(new Date(d.date)); }) // position
     .attr("y", function(d) { return y(d.total); })/// position of the text label
     .attr("dx", "0.5em") // padding-right
     .attr("dy", "1.50em") // padding-left
     .attr("text-anchor", "left") // text-align: left
     .text(function(d) { return d.total }); /// Text	
     
//// Adding graph Title     
svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text("Readers Days by Month");		
	
});
