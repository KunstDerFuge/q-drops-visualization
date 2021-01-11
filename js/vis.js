// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 1280 - margin.left - margin.right,
    height = 1280 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(d3.zoom().on("zoom", function () {
       svg.attr("transform", d3.event.transform)
    }))
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("q_scatter.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-35, 35])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-35, 35])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([0, 6500])
    .range([2, 4]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["8kun", "8ch", "4ch"])
    .range(d3.schemeSet2);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#my_dataviz")
    .append("div")
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("position", "absolute")
      .style("border-radius", "2px")
      .style("padding", "2px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("visibility", "visible")
      .html("Drop #" + d.drop_id + ": " + d.body_text)
      .style("left", (d3.mouse(this)[0]+3) + "px")
      .style("top", (d3.mouse(this)[1]+3) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("visibility", "visible")
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("visibility", "hidden")
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(d.features_x); } )
      .attr("cy", function (d) { return y(d.features_y); } )
      .attr("r", function (d) { return z(d.post_length_chars); } )
      .style("fill", function (d) { return myColor(d.platform); } )
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  })
