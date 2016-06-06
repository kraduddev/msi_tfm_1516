var marginSurface = {};
var widthSurface = 0;
var heightSurface = 0;

var margin = {top:30, right:10, bottom:10, left:10},
	width = 800 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

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
			.domain([0,1])
			.range([heightSurface,0]));
	}));
console.log(yD3)
//console.log(yD3[0](1))
// Se añaden las lineas azules en el foco
	foreground = svg.append("g")
		.attr('class', 'foreground')
		.selectAll("path")
		.data(_chars)
		.enter().append('path')
		.attr('d', path)
		.attr("style", function(d) { return "stroke:" + d.getColor() +""; })
		.attr("stroke-width", function(d) { return d.getNumScenes()+"px"; })
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

		   svg.selectAll("ellipse").data(_scenes).enter().append("ellipse")
		    .style("stroke", "gray")
	        .style("fill", "white")
			.attr('cx', function(d,i){d.display(); return (d.getNextX()*2)-150;})
			//.attr('cy', function(d,i){return (Math.random()*200)+50;})
			.attr('cy', function(d){ 
				var chars = d.getSceneChars(); 
				var yEscena = 70;
				var primerElemento = Object.keys(chars)[0];
				return primerElemento == null ? yEscena : yEscena+chars[primerElemento].y;
			})			
			.attr('rx', 10)
			.attr('ry', 50)
			.on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
	        .on("mouseout", function(){d3.select(this).style("fill", "white");});

/*
.attr("r", _anchoEllipse)
        .attr("cx", x*2)
        .attr("cy", function(){return (Math.random()*_hSize)+100})
        .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
        .on("mouseout", function(){d3.select(this).style("fill", "white");});
*/        



/*
d3.select("body").append("svg")
	.attr({
		width: width+margin.left+margin.right,
		height: height + margin.top + margin.bottom
	})
	.append('g')
	.attr('transform', 'translate('+margin.left+','+margin.top+')');*/
/*
angular.forEach(_scenes, function(escena){
	escena.display();
	console.log("escena",escena.getNumEscena(), "x", escena.getNextX(), "size", escena.getSize(), "personajes", escena.getSceneChars());
});*/
/*
var svg = d3.select("body").append('svg')
							.attr('width', width)
							.attr('height', height);

var circle = svg.selectAll('circle')
				.data(_scenes)
				.enter()
				.append('circle');

circle
    .attr('cx', function(d){
    	d.display();
    	return d.getNextX();
    })
    .attr('cy', function(d){
    	d.display();
    	return d.getSize();
    })
    .attr('r', 10)
    .style('fill', '#fea');*/


/*svg.selectAll("circle").data(_scenes).enter().append("circle")
	.attr('cx', function(d,i){d.display(); return d.getNextX();})
	.attr('cy', function(d,i){return d.y;})
	.attr('r', 10);*/




// 	// Personajes
// 	var personajes = d3.select(_chars).selectAll("models.Character")[0];
// console.log(personajes);

// 	//Escenas
// 	var escenas = d3.select(_scenes).selectAll("models.Scene")[0];
// console.log(escenas);


// /* CARGA DE PERSONAJES */

// 	d3personajes.append("div")
//     	.attr("class","dvPersonaje")    	
//       	.style("width", function(d) { return 750 + "px"; })
//       	.style("color", function(d){return d.getAttribute("color").replace("0x","#");})
//     //  	.append('input').attr('type','checkbox');
//       	.text(function(d) { return d.getAttribute("name"); });
      	

//     // se añaden sentimientos para los personajes
//     d3.selectAll(".dvPersonaje")
//     	.data(personajes)
// 		.append("div")
// 		.attr("class", "cuadrado")
// 		.attr("style",function(d){return "background:"+d.getAttribute("colorSentimiento");});

// 	d3.selectAll(".dvPersonaje")
//     	.data(personajes)
// 		.append("div")
// 		.attr("class", function(d){
// 			var sentimiento = d.getAttribute('sentimiento');
// 			var clase = null;
// 			if (sentimiento == 'positivo'){
// 				clase="personajePositivo";
// 			}
// 			else if (sentimiento == 'negativo'){
// 				clase="personajeNegativo";
// 			}
// 			else{
// 				clase="personajeNeutro";
// 			}
// 			return clase;
// 		});


// 	// se añaden chechbox para los personajes
//     d3.selectAll(".dvPersonaje").append('input').attr('type','checkbox')


    

//     //cargar personajes principales
//    // var mispersonajes = obtenerPersonajesPrincipales(escenas, personajes, maxPersonajes);


// /* FIN CARGA DE PERSONAJES */


// /* CARGA DE ESCENAS */

// //d.getAttribute("color").replace("0x","#");
// 	// Peliculas/Escenas
// function PersonajeColor (nombre, color){
// 	this.nombre = nombre;
// 	this.color = color;
// }

// 	function Personaje(nombre, color, escenas, numEscenas){
// 		this.nombre = nombre;
// 		this.color = color;
// 		this.escenas = escenas;
// 		this.numEscenas = numEscenas;
// 	}


// 	var personajesArray = [];

// 	personajes.forEach(function(valor, indice){
// 		var personajeColor = new PersonajeColor(valor.getAttribute("name"), valor.getAttribute("color").replace("0x","#"));
// 		personajesArray.push(personajeColor);
// 	});

// 	// console.log(personajesArray);

// 	var aPersonajesEscenas = [];
// 	var oPersonajes=[];
	

// 	// recorro personajes y escenas para ver en que escena interviene cada personaje
// 	for (ipersonaje in personajesArray){
// 		var cont = 0;
// 		escenas.forEach(function(v, i){
// 			var pointGroup = v.childNodes[1].children;
// 			for (ip in pointGroup){
// 				if (pointGroup[ip].localName == "charPoint"){
// 						if (pointGroup[ip].getAttribute("char") == personajesArray[ipersonaje].nombre){
// 							aPersonajesEscenas.push(v.getAttribute("step"));
// 							cont ++;
// 						}																				
// 				}
// 			}	
// 		});
// 		var oPersonaje= new Personaje(personajesArray[ipersonaje].nombre,personajesArray[ipersonaje].color, aPersonajesEscenas, cont);
// 		oPersonajes.push(oPersonaje);
// 		oPersonaje = [];
// 		aPersonajesEscenas=[];
// 	}


// 	// console.log(oPersonajes);


// 	// recorro escenas para crear un objeto y adaptarlo al gráfico.
// 	var personajeEscenas = new Object();
// 	var oPersonajeEscenas = [];

// 	//recorremos la lista de personajes
// 	for (ipersonaje in oPersonajes){
// 		//recorremos cada escena y creamos una propiedad por cada una
// 			personajeEscenas['personaje'] = oPersonajes[ipersonaje].nombre;
// 			personajeEscenas['color'] = oPersonajes[ipersonaje].color;
// 			personajeEscenas['numEscenas'] = oPersonajes[ipersonaje].numEscenas;
// 			var escenasP = oPersonajes[ipersonaje].escenas;
// 		escenas.forEach(function(v, i){
// 			var esPersonajeEscena = indexOf.call(escenasP, v.getAttribute("step")) > 0 ? 1 : 0;
// 			var y = 0;
// 			// se comprueba si el personaje está contenido en la escena para pintarlo en la elipse en relación donde esta esté pintada
// 			//for (i in escenas){ //recorro las escenas
// 			escenas.forEach(function(valor, indice){
// 				if (parseInt(valor.getAttribute("step")) == parseInt(v.getAttribute("step"))){//compruebo que la escena es la que estoy actualmente
// 					var sentimiento = valor.getAttribute("sentimiento");
// 					switch (sentimiento){
// 						case "positivo":
// 							if (esPersonajeEscena == 1 ){ 
// 								y = 0.95+(ipersonaje *0.01);
// 							}
// 							else{
// 								y = Math.random() * (0.6 - 0) + 0;
// 							}
// 							break;
// 						case "negativo":
// 							if (esPersonajeEscena == 1 ){ 
// 								y = 0.05+(ipersonaje *0.01);
// 							}
// 							else{
// 								y = Math.random() * (1 - 0.4) + 0.4;
// 							}
// 							break;
// 						case "neutro":
// 							if (esPersonajeEscena == 1 ){ 
// 								y = 0.5+(ipersonaje *0.01);
// 							}
// 							else{
// 								y = Math.random() * (0.2 - 0) + 0;
// 							}
// 							break;
// 					}
// 				}		
// 			});
// 			personajeEscenas[i] = y;
// 		});
// 		oPersonajeEscenas.push(personajeEscenas);
// 		var personajeEscenas = new Object();
// 	}
// 	// console.log(oPersonajeEscenas);
	
// 	var oPersonajeEscenasAux = oPersonajeEscenas.sort(function(obj1, obj2) {
// 		return obj2.numEscenas - obj1.numEscenas;
// 	});

// 	oPersonajeEscenas = [];
// 	for (i=0; i<maxPersonajes;i++){
// 		oPersonajeEscenas.push(oPersonajeEscenasAux[i]);
// 	}

// //	console.log(oPersonajeEscenas);

// ////////////////////////////////////////////////////////////////////////
/* PRUEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA	
	x.domain(dimensions=d3.keys(_scenes.length).filter(function(d){
		return (y[d.getNumEscena()] = d3.scale.linear()
			//.domain(d3.extent(oPersonajeEscenas, function(p){ return +p[d];}))
			.domain([0,1])
			.range([height,0]));
	}));
	

	//Se añaden las lineas de fondo grises
	background = svg.append("g")
		.attr('class', 'background')
		.selectAll('path')
			.data(_scenes)
		.enter().append('path')
			.attr('d', path);

	// Se añaden las lineas azules en el foco
	foreground = svg.append("g")
		.attr('class', 'foreground')
		.selectAll("path")
		.data(_scenes)
		.enter().append('path')
		.attr('d', path)
		.attr("style", function(d) { return "stroke:" + d.color +""; })
	//	.attr("stroke-width", function(d) { return d.numEscenas+"px"; })
		.append("svg:title")
   .text(function(d) { return d.personaje; });
   
*/

// 	// Se añade un grupo de elementos por cada dimensión
// 	var g=svg.selectAll(".dimension")
// 		.data(dimensions)
// 		.enter().append('g')
// 		.attr('class', 'dimension')
// 		.attr('transform', function(d){return "translate("+x(d)+")";})
// 		.call(d3.behavior.drag()
// 			.origin(function(d){return {x: x(d)};})
// 			/*.on("dragstart",function(d){
// 				dragging[d]=x(d);
// 				background.attr("visibility","hidden");
// 			})
// 			.on("drag", function(d){
// 				dragging[d] = Math.min(width, Math.max(0,d3.event.x));
// 				foreground.attr('d', path);
// 				dimensions.sort(function(a,b){return position(a)-position(b);});
// 				x.domain(dimensions);
// 				g.attr('transform', function(d){return "translate("+position(d)+")";});
// 			})
// 			.on("dragend", function(d){
// 				delete dragging[d];
// 				transition(d3.select(this)).attr('transform', "translate("+x(d)+")"); //function(d){return "translate("+x(d)+")";}
// 				transition(foreground).attr('d', path);
// 				background
// 						.attr('d', path)
// 					.transition()
// 						.delay(500)
// 						.duration(0)
// 						.attr('visibility', null);
// 			})*/
// 			);

// 	// Se añaden ejes y títulos
// 	g.append("g")
// 			.attr('class', 'axis')
// 			.each(function(d){ d3.select(this).call(axis.scale(y[d]));})
// 		.append("text")
// 			.style("text-anchor", "middle")
// 			.attr('y', -9)
// 			.text(function(d){ return "Escena "+(parseInt(d)+1);});
			

// 	// Se añade y almacena un pincel para cada eje
// 	g.append('g')
// 		.attr('class', 'brush')
// 		.each(function(d){
// 			d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart)
// 				.on("brush",brush));
// 		})
// 		.selectAll("rect")
// 			.attr('x', -8)
// 			.attr('width', 16);


// 	// se añaden las elipses de las escenas con los sentimientos
// 	d3.selectAll(".dimension")
//     	.data(escenas)
// 		.append("ellipse")
//     .attr("cx", 0)
//     .attr("cy", function(d){ 
//     	var sentimiento = d.getAttribute("sentimiento");
//     	var cy = 0;
//     	if (sentimiento == "positivo"){
//     		cy = 25;
//     	}
//     	else if (sentimiento == "negativo"){
//     		cy = height - 25;
//     	}
//     	else{
//     		cy = height/2;
//     	}
//     	return cy;
//     })
//     .attr("rx", function(d){
//     		var duracion = d.getAttribute("duracion");
//     		return duracion==0?5:parseInt(duracion)/1.5;
//     	})
//     .attr("ry", 25)
//     .attr("fill", function(d){return d.getAttribute("colorSentimiento");})
//     .attr("fill-opacity", "0.3")
//     .attr("stroke", function(d){return d.getAttribute("colorSentimiento");})
//     .attr("stroke-width", function(d){ return (parseInt(d.getAttribute("duracion"))/100)+3+"px"})
//     .append("svg:title")
//    .text(function(d) { return "Polaridad sentimiento: " +d.getAttribute("sentimiento"); });


// /* FIN CARGA DE ESCENAS */

}

