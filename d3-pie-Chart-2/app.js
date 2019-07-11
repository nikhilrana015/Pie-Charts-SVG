// http://data.un.org/Data.aspx?d=POP&f=tableCode%3a22

var width = 600;
var height = 600;
var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);
var orderedMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var colors = [
  "#aec7e8", "#a7cfc9", "#9fd7a9", "#98df8a", "#bac78e", "#ddb092",
  "#ff9896", "#ffa48c", "#ffaf82", "#ffbb78", "#e4bf9d", "#c9c3c3"
];

var quarterColors = ["#1f77b4", "#2ca02c", "#d62728", "#ff7f0e"];

var tooltip=d3.select("body")
        .append("div")
          .classed("tooltip",true);



var colorScale = d3.scaleOrdinal()
           .domain(orderedMonths)
           .range(colors);
           
var svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height);

svg
  .append("g")
    .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
    .classed("chart", true);

svg
  .append("g")
    .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
    .classed("inner-chart", true);

svg
  .append("text")
    .classed("title", true)
    .attr("x", width / 2)
    .attr("y", 30)
    .style("font-size", "2em")
    .style("text-anchor", "middle");

drawGraph(minYear);


d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', () => drawGraph(+d3.event.target.value));

function drawGraph(year) {
  var yearData = birthData.filter(d => d.year === year);
  var arcs = d3.pie()
               .value(d => d.births)
               .sort((a, b) => orderedMonths.indexOf(a.month) - orderedMonths.indexOf(b.month));

  var innerArcs = d3.pie()
                    .value(d => d.births)
                    .sort((a, b) => a.quarter - b.quarter);

  var path = d3.arc()
               .innerRadius(width / 4)
               .outerRadius(width / 2 - 40);

  var innerPath = d3.arc()
                    .innerRadius(0)
                    .outerRadius(width / 4);

  var outer = d3.select(".chart")
                .selectAll(".arc")
                .data(arcs(yearData));

  var inner = d3.select(".inner-chart")
                .selectAll(".arc")
                .data(innerArcs(getDataByQuarter(yearData)));

  outer
    .enter()
    .append("path")
      .classed("arc", true)
      .attr("fill", d => colorScale(d.data.month))
    .merge(outer)
      .attr("d", path)
      .on("mousemove",showToolTip)
      .on("touchStart",showToolTip)
      .on("mouseout",hideToolTip)             // USED FOR MOBILE USERS BECAUSE mousemove works in PC'S.
      .on("touchend",hideToolTip)

  inner
    .enter()
    .append("path")
      .classed("arc", true)
      .attr("fill", (d, i) => quarterColors[i])
    .merge(inner)
      .attr("d", innerPath)
      .on("mousemove",showToolTip1)
      .on("touchStart",showToolTip1)
      .on("mouseout",hideToolTip1)             // USED FOR MOBILE USERS BECAUSE mousemove works in PC'S.
      .on("touchend",hideToolTip1);

  d3.select(".title")
      .text("Births by months and quarter for " + year);
}

function getDataByQuarter(data) {
  var quarterTallies = [0, 1, 2, 3].map(n => ({ quarter: n, births: 0 }));
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var quarter = Math.floor(orderedMonths.indexOf(row.month) / 3);
    quarterTallies[quarter].births += row.births;
  }
  return quarterTallies;
}



// For adding the tooltip for outer....
function showToolTip(d){
  tooltip
        .style("opacity",1)
        .style("left",d3.event.x-(tooltip.node().offsetWidth/2)+"px")    // d3.event.x gives the position of mouse pointer and set the positioon of div to left
        .style("top",d3.event.y+25+"px")     // d3.event.x gives the position of mouse pointer and set the positioon of div to right
        
        // tooltip.node().offsetWidth/2) used to move the div to the center when we hover the scatter plot.

        .html(`
          <p>Region: ${d.data.month}</p>
          <p>Births: ${d.data.births.toLocaleString()}</p>
          <p>Year: ${d.data.year} </p>    
          `);
                                        //toLocaleString used to convert the big no. to more readable form

}


function hideToolTip(d){
  tooltip
        .style("opacity",0)
}




// Tooltip for inner data

function showToolTip1(d){
  tooltip
        .style("opacity",1)
        .style("left",d3.event.x-(tooltip.node().offsetWidth/2)+"px")    // d3.event.x gives the position of mouse pointer and set the positioon of div to left
        .style("top",d3.event.y+25+"px")     // d3.event.x gives the position of mouse pointer and set the positioon of div to right
        
        // tooltip.node().offsetWidth/2) used to move the div to the center when we hover the scatter plot.

        .html(`
          
          <p>Total Births : ${d.data.births.toLocaleString()}</p>
           
          `);
                                        //toLocaleString used to convert the big no. to more readable form

}


function hideToolTip1(d){
  tooltip
        .style("opacity",0)
}