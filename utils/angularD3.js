var marginSurface = {};
var widthSurface = 0;
var heightSurface = 0;

var margin = {top:30, right:10, bottom:10, left:10},
	width = 2600 - margin.left - margin.right,
	height = 1100 - margin.top - margin.bottom;

var xD3 = d3.scale.ordinal()
	.rangePoints([0, width], 1),
	yD3={},
	dragging = {};

var line = d3.svg.line().interpolate("basis"),
	axis = d3.svg.axis().orient("left"),
	background,
	foreground;

var zoom = d3.behavior.zoom();
 
var svg;
var divTitle;
var divTitleChar;
var g;
var dimensions = [];
var ellipse = [];

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

var _lineMethod = 0;
var _minEscenas = 0;
var _maxNumScenesPerChar = MAX_VALUE;
var _tamStartEndLine = 10;
var _showWeights = false;
var _showAxis = false;
var _showSceneNumber = true;
var _showSceneLength = false;
var _showScenes = true;

var _cutLongLines = true;

// Saltos en las lineas de personaje
var _maxJump = 12;
// Contendra en cada posicion el tamanio del salto en que se encuentra
var _charJumps = [];

// path de los personajes
var lineChar = [];
var pathPersonajes = [];

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
    console.log( d)
    d3.select(this)
        .attr("cx", d3.event.dx)
        .attr("cy", d3.event.dy);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

var drawLines = function (){
	switch(_lineMethod)
	{
		// case 1:
		// 	drawLinesSmooth();
		// 	break;
		// case 4:
		// 	drawLinesSmooth2();
		// 	break;
		// case 2:
		// 	drawLinesSmooth3();
		// 	break;
		// case 3:
		// 	drawLinesSmooth4();
		// 	break;
		case 0:
			drawLinesNormal();
			break;
		// default:
		// 	drawLinesSmooth();
		// 	break;
	}
}

var drawLinesNormal = function (){
	var i = 0;
	var numChar = 0;

    var colorOriginalEllipse; 
    
    for (numChar=0; numChar<_chars.length;numChar++){
    	pathPersonajes[numChar] = "";
    }

    //Dibujo las líneas iniciales
    for (numChar=0; numChar<_chars.length;numChar++){
    	var indexPrimeraEscena = _chars[numChar].getFirstScene()-1;
    	
    	pathPersonajes[numChar] = "M"
    		+(position(dimensions[indexPrimeraEscena])-_tamStartEndLine-_scenes[indexPrimeraEscena].getSize()/2)
    		+","
    		+ _scenes[indexPrimeraEscena].getYChar(numChar); 
    }

	for(i=0; i<_scenes.length;i++){
        
		for(numChar=0; numChar<_chars.length;numChar++){ 
			if(_chars[numChar].getNumScenes() >= _minEscenas){
                
                if(_chars[numChar].getFirstScene()<=i+1 && _chars[numChar].getLastScene()>=i+1){
                    if (_cutLongLines){ 
                    	if(_charJumps[numChar][i]<=_maxJump){
                            if (_scenes[i].getYChar(numChar) != 0){
	                    	  pathPersonajes[numChar] += "L"+position(dimensions[i])+","+ _scenes[i].getYChar(numChar);                    
                            }
	                    }
	                    else if(_charJumps[numChar][i]>_maxJump && _charJumps[numChar][i+1]==0){
                         //   if(_scenes[i].getYChar(numChar) != 0){
    	                    	pathPersonajes[numChar] += "M"+position(dimensions[i])+","+ _scenes[i].getYChar(numChar);
                               // pathPersonajes[numChar] += "M"+position(dimensions[i+1])+","+ _scenes[i].getYChar(numChar);
	                   	        var c1 = svg.append("circle")
    					            .attr('cx', position(dimensions[i]))
    					            .attr('cy', _scenes[i].getYChar(numChar))
    					            .attr('r', 6)
    					            .attr('fill',  _chars[numChar].getColor());

    					        var c2 = svg.append("circle")
    					            .attr('cx', position(dimensions[i]))
    					            .attr('cy', _scenes[i].getYChar(numChar))
    					            .attr('r', 4)
    					            .attr('fill',  "#FFF");  
                           // } 
                    	}
                    	else if (i>0){
                    		if (_charJumps[numChar][i-1] == 0){
                              //  if(_scenes[i].getYChar(numChar) != 0){
                                 //  pathPersonajes[numChar] += "L"+position(dimensions[i])+","+ _scenes[i].getYChar(numChar);
                        			var c1 = svg.append("circle")
    						            .attr('cx', position(dimensions[i]))
    						            .attr('cy', _scenes[i].getYChar(numChar))
    						            .attr('r', 6)
    						            .attr('fill',  _chars[numChar].getColor());

    						        var c2 = svg.append("circle")
    						            .attr('cx', position(dimensions[i]))
    						            .attr('cy', _scenes[i].getYChar(numChar))
    						            .attr('r', 4)
    						            .attr('fill',  "#FFF");  
                              //  }
                    		}
                    	}
                    }                    
                    else{
                        if (_scenes[i].getYChar(numChar) != 0){
                    	   pathPersonajes[numChar] += "L"+position(dimensions[i])+","+ _scenes[i].getYChar(numChar); 
                        }
                    }
                }
            }
		}
		
	}

    //Dibujo las líneas finales
    for (numChar=0; numChar<_chars.length;numChar++){
    	var indexUltimaEscena = _chars[numChar].getLastScene()-1;
    	
    	pathPersonajes[numChar] += "L"
    		+(position(dimensions[indexUltimaEscena])+_tamStartEndLine+_scenes[indexUltimaEscena].getSize()/2)
    		+","
    		+ _scenes[indexUltimaEscena].getYChar(numChar);

    	var c1 = svg.append("circle")
            .attr('cx', (position(dimensions[indexUltimaEscena])+_tamStartEndLine+_scenes[indexUltimaEscena].getSize()/2))
            .attr('cy', _scenes[indexUltimaEscena].getYChar(numChar))
            .attr('r', 6)
            .attr('fill',  _chars[numChar].getColor());

        var c2 = svg.append("circle")
            .attr('cx', (position(dimensions[indexUltimaEscena])+_tamStartEndLine+_scenes[indexUltimaEscena].getSize()/2))
            .attr('cy', _scenes[indexUltimaEscena].getYChar(numChar))
            .attr('r', 4)
            .attr('fill',  "#FFF");   
    }
    
    // console.log(pathPersonajes)

    angular.forEach (_chars, function (char, i){
    	lineChar[char.getNumber()] = svg.append("path")
                            .attr("d", pathPersonajes[i])
                            .attr('class', char.getNumber())
                            .attr("stroke", char.getColor())
                            .attr("stroke-width", function(){ 
                                if (_showWeights == false){
                                    return 2;
                                }
                                else{
                                    return (parseInt(char.getNumScenes()) / _maxNumScenesPerChar * 10) + 1
                                }
                            })
                            .attr("fill", "none")
                            .attr('title', char.getName())
                            .on("mouseover", function(){
                                divTitleChar.transition()
                                    .duration(200)
                                    .style("background", char.getColor)
                                    .style("width", 75+"px")
                                    .style("height", 30+"px")
                                    .style("opacity", .9);
                                divTitleChar.html(char.getName()) 
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");   
                            
                                // mostramos sentimiento del personaje en las escenas donde interviene
                                // en el resto, se muestra en gris
                                angular.forEach(ellipse, function(e){
                                    e.transition()
                                        .duration(500)
                                        .ease("linear")
                                        .style('stroke', "gray")
                                        .style('stroke-width', '2px');
                                });
                                angular.forEach(_scenes, function(escena){                                    
                                    if (ellipse[escena.getNumEscena()] != null){                                    
                                        if (escena.charVisible(char.getNumber())){
                                            var colorSent; 
                                            angular.forEach(escena.getSceneChars(), function (cEnEscena){
                                                if(cEnEscena._name == char.getName()){                                                         
                                                    colorSent = cEnEscena._colorSent;
                                                }
                                            });
                                            ellipse[escena.getNumEscena()].transition()
                                                .duration(500)
                                                .ease("linear")
                                                .style('fill', _colorEllipsePersonaje)
                                                .style('stroke', colorSent)
                                                .style('stroke-width', '4px');

                                        }
                                    }
                                });
                            })
                            .on("mouseout", function(){
                                divTitleChar.transition()
                                    .duration(500)
                                    .ease("linear")
                                    .style("opacity", 0);   

                                // el borde de la escena vuelve a tener el sentimiento de la escena
                                angular.forEach(_scenes, function(escena){                                    
                                    if (ellipse[escena.getNumEscena()] != null){    
                                        var colorSent = escena.getColorSent(); 
                                        ellipse[escena.getNumEscena()].transition()
                                            .duration(500)
                                            .ease("linear")
                                            .style('fill', _colorOriginalEllipse)
                                            .style('stroke', colorSent)
                                            .style('stroke-width', '4px');
                                    }
                                });
                            }); 		    	                        
    });
}

var drawRepresentation = function(){

	marginSurface = {
			            top: 30,
			            right: 10,
			            bottom: 10,
			            left: 10
		        	};
    widthSurface = 2600 - marginSurface.left - marginSurface.right,
    heightSurface = 1100 - marginSurface.top - margin.bottom;

    divTitle = d3.select("body").append("div")  
        .attr("class", "tooltip")               
        .style("opacity", 0);
    divTitleChar = d3.select("body").append("div")  
        .attr("class", "tooltip")               
        .style("opacity", 0);

    svg = d3.select("#parallelcoordinates")
            .append("svg")
            .attr("width", widthSurface + marginSurface.right + marginSurface.left)
            .attr("height", heightSurface + marginSurface.top + marginSurface.bottom)
            .attr("class", "parallelCoordinates")
            .append("g")
            .attr("transform", "translate(" + marginSurface.left + "," + marginSurface.top + ")")
            .call(zoom
                .on("zoom", function(){
                    svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                }))
            .append('g');
 
	
	angular.forEach(_scenes, function(escena){
		dimensions.push(escena.getNumEscena());
	});

	xD3.domain(dimensions.filter(function(d){ 
		return (yD3[d]= d3.scale.linear()
			.domain([0,heightSurface]) //[0,1]
			.range([heightSurface,0]) 
			); 
	}));
// Se añaden las lineas azules en el foco
/*	foreground = svg.append("g")
		.attr('class', 'foreground')
		.selectAll("path")
		.data(_chars)
		.enter().append('path')
		.attr('d', path)
		.attr("style", function(d) { return "stroke:" + d.getColor() +""; })
		.attr("stroke-width", function(d) { return (d.getNumScenes()*5/7)+"px"; })
		.append("svg:title")
   .text(function(d) { return d.getName(); });*/

    // Pinto las líneas de los personajes
    drawLines();

	// Añado las dimensiones (escenas)
	g = svg.selectAll(".escena")
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
                .attr('class', 'sceneNumber')
                .text(function(d){ return (parseInt(d));});

    g.selectAll(".domain")
                    .transition()
                    .duration(500)
                    .ease("linear")
                    .style('display', function(){
                        return _showAxis == true ? "block" : "none";
                    });
 
          /*  g.append("g")
                .attr("class", "brush")
                .each(function(d) {
                    d3.select(this).call(yD3[d].brush = d3.svg.brush().y(yD3[d]).on("brush", brush));
                })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);*/

    // Pinto las escenas
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

