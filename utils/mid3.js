var margin = {top:30, right:10, bottom:10, left:10},
	width = 2600 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
	.rangePoints([0, width], 1),
	y={},
	dragging = {};

var line = d3.svg.line(),
	axis = d3.svg.axis().orient("left"),
	background,
	foreground;

var svg = d3.select("body").append("svg")
	.attr({
		width: width+margin.left+margin.right,
		height: height + margin.top + margin.bottom
	})
	.append('g')
	.attr('transform', 'translate('+margin.left+','+margin.top+')');

var maxPersonajes = 6;


//CARGAMOS EL FICHERO 
//d3.xml("./csv/BatmanBegins-min-sent.xml", function(error, pelicula){
d3.xml("xml_guiones/Rocky_corregido-min.plt-sent.xml", function(error, pelicula){


	// Personajes
	var personajes = d3.select(pelicula).selectAll("char")[0];


	//Escenas
	var escenas = d3.select(pelicula).selectAll("timeSlice")[0];



/* CARGA DE PERSONAJES */

	var d3personajes = d3.select("#personajes")
    	.selectAll("div")    	
    	.data(personajes)    	
    	.enter();

	d3personajes.append("div")
    	.attr("class","dvPersonaje")    	
      	.style("width", function(d) { return 750 + "px"; })
      	.style("color", function(d){return d.getAttribute("color").replace("0x","#");})
    //  	.append('input').attr('type','checkbox');
      	.text(function(d) { return d.getAttribute("name"); });
      	

    // se añaden sentimientos para los personajes
    d3.selectAll(".dvPersonaje")
    	.data(personajes)
		.append("div")
		.attr("class", "cuadrado")
		.attr("style",function(d){return "background:"+d.getAttribute("color-sentimiento");});

	d3.selectAll(".dvPersonaje")
    	.data(personajes)
		.append("div")
		.attr("class", function(d){
			var sentimiento = d.getAttribute('sentimiento');
			var clase = null;
			if (sentimiento == 'positivo'){
				clase="personajePositivo";
			}
			else if (sentimiento == 'negativo'){
				clase="personajeNegativo";
			}
			else{
				clase="personajeNeutro";
			}
			return clase;
		});


	// se añaden chechbox para los personajes
    d3.selectAll(".dvPersonaje").append('input').attr('type','checkbox')


    

    //cargar personajes principales
   // var mispersonajes = obtenerPersonajesPrincipales(escenas, personajes, maxPersonajes);


/* FIN CARGA DE PERSONAJES */


/* CARGA DE ESCENAS */

//d.getAttribute("color").replace("0x","#");
	// Peliculas/Escenas
function PersonajeColor (nombre, color){
	this.nombre = nombre;
	this.color = color;
}

	function Personaje(nombre, color, escenas, numEscenas){
		this.nombre = nombre;
		this.color = color;
		this.escenas = escenas;
		this.numEscenas = numEscenas;
	}


	var personajesArray = [];

	personajes.forEach(function(valor, indice){
		var personajeColor = new PersonajeColor(valor.getAttribute("name"), valor.getAttribute("color").replace("0x","#"));
		personajesArray.push(personajeColor);
	});



	var aPersonajesEscenas = [];
	var oPersonajes=[];
	

	// recorro personajes y escenas para ver en que escena interviene cada personaje
	for (ipersonaje in personajesArray){
		var cont = 0;
		escenas.forEach(function(v, i){
			var pointGroup = v.childNodes[1].children;
			for (ip in pointGroup){
				if (pointGroup[ip].localName == "charPoint"){
						if (pointGroup[ip].getAttribute("char") == personajesArray[ipersonaje].nombre){
							aPersonajesEscenas.push(v.getAttribute("step"));
							cont ++;
						}																				
				}
			}	
		});
		var oPersonaje= new Personaje(personajesArray[ipersonaje].nombre,personajesArray[ipersonaje].color, aPersonajesEscenas, cont);
		oPersonajes.push(oPersonaje);
		oPersonaje = [];
		aPersonajesEscenas=[];
	}




	// recorro escenas para crear un objeto y adaptarlo al gráfico.
	var personajeEscenas = new Object();
	var oPersonajeEscenas = [];

	//recorremos la lista de personajes
	for (ipersonaje in oPersonajes){
		//recorremos cada escena y creamos una propiedad por cada una
			personajeEscenas['personaje'] = oPersonajes[ipersonaje].nombre;
			personajeEscenas['color'] = oPersonajes[ipersonaje].color;
			personajeEscenas['numEscenas'] = oPersonajes[ipersonaje].numEscenas;
			var escenasP = oPersonajes[ipersonaje].escenas;
		escenas.forEach(function(v, i){
			var esPersonajeEscena = indexOf.call(escenasP, v.getAttribute("step")) > 0 ? 1 : 0;
			var y = 0;
			// se comprueba si el personaje está contenido en la escena para pintarlo en la elipse en relación donde esta esté pintada
			//for (i in escenas){ //recorro las escenas
			escenas.forEach(function(valor, indice){
				if (parseInt(valor.getAttribute("step")) == parseInt(v.getAttribute("step"))){//compruebo que la escena es la que estoy actualmente
					var sentimiento = valor.getAttribute("sentimiento");
					switch (sentimiento){
						case "positivo":
							if (esPersonajeEscena == 1 ){ 
								y = 0.95+(ipersonaje *0.01);
							}
							else{
								y = Math.random() * (0.6 - 0) + 0;
							}
							break;
						case "negativo":
							if (esPersonajeEscena == 1 ){ 
								y = 0.05+(ipersonaje *0.01);
							}
							else{
								y = Math.random() * (1 - 0.4) + 0.4;
							}
							break;
						case "neutro":
							if (esPersonajeEscena == 1 ){ 
								y = 0.5+(ipersonaje *0.01);
							}
							else{
								y = Math.random() * (0.2 - 0) + 0;
							}
							break;
					}
				}		
			});
			personajeEscenas[i] = y;
		});
		oPersonajeEscenas.push(personajeEscenas);
		var personajeEscenas = new Object();
	}

	
	var oPersonajeEscenasAux = oPersonajeEscenas.sort(function(obj1, obj2) {
		return obj2.numEscenas - obj1.numEscenas;
	});

	oPersonajeEscenas = [];
	for (i=0; i<maxPersonajes;i++){
		oPersonajeEscenas.push(oPersonajeEscenasAux[i]);
	}


////////////////////////////////////////////////////////////////////////
console.log("oPersonajesEscenas", oPersonajeEscenas);	
	x.domain(dimensions=d3.keys(oPersonajeEscenas[0]).filter(function(d){
		return d!="personaje"&&d!="color"&&d!="numEscenas"&&(y[d] = d3.scale.linear()
			//.domain(d3.extent(oPersonajeEscenas, function(p){ return +p[d];}))
			.domain([0,1])
			.range([height,0]));
	}));
	

	//Se añaden las lineas de fondo grises
	background = svg.append("g")
		.attr('class', 'background')
		.selectAll('path')
			.data(oPersonajeEscenas)
		.enter().append('path')
			.attr('d', path);

	// Se añaden las lineas azules en el foco
	foreground = svg.append("g")
		.attr('class', 'foreground')
		.selectAll("path")
		.data(oPersonajeEscenas)
		.enter().append('path')
		.attr('d', path)
		.attr("style", function(d) { return "stroke:" + d.color +""; })
		.attr("stroke-width", function(d) { return d.numEscenas+"px"; })
		.append("svg:title")
   .text(function(d) { return d.personaje; });
   


	// Se añade un grupo de elementos por cada dimensión
	var g=svg.selectAll(".dimension")
		.data(dimensions)
		.enter().append('g')
		.attr('class', 'dimension')
		.attr('transform', function(d){return "translate("+x(d)+")";})
		.call(d3.behavior.drag()
			.origin(function(d){return {x: x(d)};})
			/*.on("dragstart",function(d){
				dragging[d]=x(d);
				background.attr("visibility","hidden");
			})
			.on("drag", function(d){
				dragging[d] = Math.min(width, Math.max(0,d3.event.x));
				foreground.attr('d', path);
				dimensions.sort(function(a,b){return position(a)-position(b);});
				x.domain(dimensions);
				g.attr('transform', function(d){return "translate("+position(d)+")";});
			})
			.on("dragend", function(d){
				delete dragging[d];
				transition(d3.select(this)).attr('transform', "translate("+x(d)+")"); //function(d){return "translate("+x(d)+")";}
				transition(foreground).attr('d', path);
				background
						.attr('d', path)
					.transition()
						.delay(500)
						.duration(0)
						.attr('visibility', null);
			})*/
			);

	// Se añaden ejes y títulos
	g.append("g")
			.attr('class', 'axis')
			.each(function(d){ d3.select(this).call(axis.scale(y[d]));})
		.append("text")
			.style("text-anchor", "middle")
			.attr('y', -9)
			.text(function(d){ return "Escena "+(parseInt(d)+1);});
			

	// Se añade y almacena un pincel para cada eje
	g.append('g')
		.attr('class', 'brush')
		.each(function(d){
			d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart)
				.on("brush",brush));
		})
		.selectAll("rect")
			.attr('x', -8)
			.attr('width', 16);


	// se añaden las elipses de las escenas con los sentimientos
	d3.selectAll(".dimension")
    	.data(escenas)
		.append("ellipse")
    .attr("cx", 0)
    .attr("cy", function(d){ 
    	var sentimiento = d.getAttribute("sentimiento");
    	var cy = 0;
    	if (sentimiento == "positivo"){
    		cy = 25;
    	}
    	else if (sentimiento == "negativo"){
    		cy = height - 25;
    	}
    	else{
    		cy = height/2;
    	}
    	return cy;
    })
    .attr("rx", function(d){
    		var duracion = d.getAttribute("duracion");
    		return duracion==0?5:parseInt(duracion)/1.5;
    	})
    .attr("ry", 25)
    .attr("fill", function(d){return d.getAttribute("color-sentimiento");})
    .attr("fill-opacity", "0.3")
    .attr("stroke", function(d){return d.getAttribute("color-sentimiento");})
    .attr("stroke-width", function(d){ return (parseInt(d.getAttribute("duracion"))/100)+3+"px"})
    .append("svg:title")
   .text(function(d) { return "Polaridad sentimiento: " +d.getAttribute("sentimiento"); });


/* FIN CARGA DE ESCENAS */




});	

