var marginSurface = {};
var widthSurface = 0;
var heightSurface = 0;

var margin = {top:30, right:10, bottom:10, left:10},
	width = 800 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var xD3 = d3.scale.ordinal()
	.rangePoints([0, width], 1),
	yD3={},
	dragging = {};

var line = d3.svg.line().interpolate("cardinal"),
	axis = d3.svg.axis().orient("left"),
	background,
	foreground;
 
 var svg;
 var dimensions = [];


var drawRepresentation = function(){

	marginSurface = {
			            top: 30,
			            right: 10,
			            bottom: 10,
			            left: 10
		        	};
    widthSurface = 800 - marginSurface.left - marginSurface.right,
    heightSurface = 400 - marginSurface.top - margin.bottom;

    svg = d3.select("#parallelcoordinates")
            .append("svg")
            .attr("width", widthSurface + marginSurface.right + marginSurface.left)
            .attr("height", heightSurface + marginSurface.top + marginSurface.bottom)
            .attr("class", "parallelCoordinates")
            .append("g")
            .attr("transform", "translate(" + marginSurface.left + "," + marginSurface.top + ")");
 
	
	angular.forEach(_scenes, function(escena){
		dimensions.push(escena.getNumEscena());
	});
	//Se extrae dimensión y se crea una escala
	//xD3.domain([0,800]);

	xD3.domain(dimensions.filter(function(d){ 
		return (yD3[d]= d3.scale.linear()
			.domain([0,heightSurface]) //[0,1]
			.range([heightSurface,0]) 
			); 
	}));
// Se añaden las lineas azules en el foco
	foreground = svg.append("g")
		.attr('class', 'foreground')
		.selectAll("path")
		.data(_chars)
		.enter().append('path')
		.attr('d', path)
		.attr("style", function(d) { return "stroke:" + d.getColor() +""; })
		.attr("stroke-width", function(d) { return (d.getNumScenes()*5/7)+"px"; })
		.append("svg:title")
   .text(function(d) { return d.getName(); });

	// Añado las dimensiones (escenas)
	var g = svg.selectAll(".escena")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "escena")
                .attr("transform", function(d) { 
                    return "translate(" + xD3(d) + ")";
                })
                .call(d3.behavior.drag()
                  /*  .on("dragstart", function(d) {
                        dragging[d] = this.__origin__ = xD3(d);
                        background.attr("visibility", "hidden");
                    })
                    .on("drag", function(d) {
                        dragging[d] = Math.min(width, Math.max(0, this.__origin__ += d3.event.dx));
                        foreground.attr("d", path);
                        dimensions.sort(function(a, b) {
                            return position(a) - position(b);
                        });
                        x.domain(dimensions);
                        g.attr("transform", function(d) {
                            return "translate(" + position(d) + ")";
                        })
                    })
                    .on("dragend", function(d) {
                        delete this.__origin__;
                        delete dragging[d];
                        transition(d3.select(this)).attr("transform", "translate(" + xD(d) + ")");
                        transition(foreground)
                            .attr("d", path);
                        background
                            .attr("d", path)
                            .transition()
                            .delay(500)
                            .duration(0)
                            .attr("visibility", null);
                    })*/
                    );
	g.append("g")
                .attr("class", "axis")
                .each(function(d) {
                    d3.select(this).call(axis.scale(yD3[d]));
                })
                .append("text")
                .attr("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d){ return "Escena "+(parseInt(d));});

 
          /*  g.append("g")
                .attr("class", "brush")
                .each(function(d) {
                    d3.select(this).call(yD3[d].brush = d3.svg.brush().y(yD3[d]).on("brush", brush));
                })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);*/

    angular.forEach(_scenes, function(scene){    	
    	scene.pintar(g);
    });
		   // svg.selectAll("ellipse").data(_scenes).enter().append("ellipse")
		 //    .style("stroke", "gray")
	  //       .style("fill", "white")
			// .attr('cx', function(d,i){d.display(); return (d.getNextX()*2)-150;})
			// //.attr('cy', function(d,i){return (Math.random()*200)+50;})
			// .attr('cy', function(d){ 
			// 	var chars = d.getSceneChars(); 
			// 	var yEscena = 70;
			// 	var primerElemento = Object.keys(chars)[0];
			// 	return primerElemento == null ? yEscena : yEscena+chars[primerElemento].y;
			// })			
			// .attr('rx', 10)
			// .attr('ry', 50)
			// .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
	  //       .on("mouseout", function(){d3.select(this).style("fill", "white");});


}

