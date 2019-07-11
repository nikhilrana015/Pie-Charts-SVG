var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year)
var width = 600;
var height = 600;


// Iterate through the data...

var continents=[]
for(var i=0;i<birthData.length;i++){
	var continent=birthData[i].continent;
	if(continents.indexOf(continent)===-1){       // Used To Create The Discrete set of Values of Continent in birthData
		continents.push(continent);
	}
}

// scaleOrdinal For scaling the Axis. It just map the values of domain with valuesof range....
var colorScale=d3.scaleOrdinal()
				  .domain(continents)
				  .range(d3.schemeCategory10);  // It is inbuilt category of colors in d3 which has 10 colors.
                                                // If all continents not match then rest colors would not use.

var tooltip=d3.select("body")
			  .append("div")
			    .classed("tooltip",true);


// Pie charts normally contains inside the group element tag..

d3.select("svg")
    .attr("width",width)
    .attr("height",height)
  .append("g")
    .attr("transform","translate("+width/2+","+height/2+")")
    .classed("chart",true);


d3.select("input")
    .property("min",minYear)
	.property("max",maxYear)
    .property("value",minYear)
    .on("input",function(){
    	makeGraph(+d3.event.target.value)
    });







 makeGraph(minYear);           // This is when script loads and got the min year at starting.


// Function to avoid repetition of code while in update and merge command ...
function makeGraph(year){
	var yearData = birthData.filter(d => d.year === year);

	// Pie Chart function just like .histogram....

	var arcs=d3.pie()
			   .value(d=> d.births)
			   
			   .sort(function(a,b){              // Sort method basically sort our pie chart as per continent
			   	if(a.continent<b.continent)      // IF alphabetically this cond. satisfied return -1
			   		return -1;
			   
			   	else if(a.continent>b.continent)
			   		return 1;
			                                      //THIS  BASICALLY HELPS IN GROUP ALL ARCS HAVING THE SAME COLOR.
			   	else return a.births-b.births;
			   })
			   (yearData);                      // Passing the data for having min year .
			   								// Giving array of objects.



	// Arc function...
	var path=d3.arc()                   // Arc function just converts the property of padRadius,startAngle etc in our data arcs into the path text element
			     .outerRadius(width/2-10)     // just like "M200 133 A342 112 12 0 1 344" in that form.
			     .innerRadius(width/4)

			     // .padAngle(0.02)           // It provides the padding between arcs. 
			     // .cornerRadius(20);        // It just corner the arcs.
   
   // Update the Elements...

   var update=d3.select(".chart")
   				.selectAll(".arc")
   				.data(arcs)

   	update
   		 .exit()
   		 .remove();

    update
    	 .enter()
    	 .append("path")
    	   .classed("arc",true)

    	   
    	 .merge(update)
    	   .attr("fill",d=> colorScale(d.data.continent))
           .attr("stroke","black")
           .attr("d",path)
           .on("mousemove",showToolTip)
    	   .on("touchStart",showToolTip)
    	   .on("mouseout",hideToolTip)             // USED FOR MOBILE USERS BECAUSE mousemove works in PC'S.
           .on("touchend",hideToolTip)
           
      
           


}

// For Adding the Tooltip

function showToolTip(d){
  tooltip
        .style("opacity",1)
        .style("left",d3.event.x-(tooltip.node().offsetWidth/2)+"px")    // d3.event.x gives the position of mouse pointer and set the positioon of div to left
        .style("top",d3.event.y+25+"px")     // d3.event.x gives the position of mouse pointer and set the positioon of div to right
        
        // tooltip.node().offsetWidth/2) used to move the div to the center when we hover the scatter plot.

        .html(`
          <p>Region: ${d.data.region}</p>
          <p>Births: ${d.data.births}</p>
          <p>Year: ${d.data.year} </p>    
          <p>Continent: ${d.data.continent} </p>
          `);
                                        //toLocaleString used to convert the big no. to more readable form

}


function hideToolTip(d){
  tooltip
        .style("opacity",0)
}









