function position(d){
	var v = dragging[d];
	return v == null ? x(d) : v;
}

function transition(g){
	return g.transition().duration(500);
}

//Devuelve el path para un punto dado
function path(d){
	return line(dimensions.map(function(p){return [position(p), y[p](d[p])];}));
}

function brushstart(){
	d3.event.sourceEvent.stopPropagation();
}

//Maneja un brush event, aosiciando el display a las líneas foreground
function brush(){
	var actives = dimensions.filter(function(p){return !y[p].brush.empty();}),
		extents = actives.map(function(p){return y[p].brush.extent();});
	foreground.style("display", function(d){
		return actives.every(function(p,i){
			return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		}) ? null : "none";
	});
}

var indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle);
};


// seleccionar todos los personajes
function seleccionarPersonajes(){
	if ($('#chkSeleccionarPersonajes').is(':checked'))
    	d3.selectAll('input').property('checked', true);
	else 
		d3.selectAll('input').property('checked', false);
}

//se añaden los datos del detalle de la escena para representarlo
function addDetalleEscena(){
	//d3.select("#personajes-contenido-detalle-escena").append('p').text('prueba');

	d3.select("#personajes-contenido-detalle-escena").selectAll('p')
    	.data(escenas).enter()
		.append("p")
		.text("prueba");

   /* .attr("cx", 0)
    .attr("cy", function(d){ return height/2; })
    .attr("rx", function(d){
    		var duracion = d.getAttribute("duracion");
    		return duracion==0?5:duracion;
    	})
    .attr("ry", 17)
    .attr("fill", function(d){return d.getAttribute("color-sentimiento");});*/

}

var obtenerPersonajesPrincipales = function (lasEscenas, losPersonajes, maxPersonajes){

	var personajesAux = personajes;

	function PersonajeColor (nombre){
		this.nombre = nombre;
		this.color = color;
	}

	function Personaje(nombre, numEscenas){
		this.nombre = nombre;
		this.numEscenas = numEscenas;
	}


	var personajesArray = [];

	for (i in losPersonajes){
		var person = new PersonajeColor(losPersonajes[i].getAttribute("name"));
		personajesArray.push(person);
	}
	/*losPersonajes.forEach(function(valor, indice){
		var person = new PersonajeColor(valor.getAttribute("name"));
		personajesArray.push(person);
	});*/

	console.log(personajesArray);

	var oPersonajes=[];
	

	// recorro personajes y escenas para ver en que escena interviene cada personaje
	for (ipersonaje in personajesArray){
		var cont = 0;
		lasEscenas.forEach(function(v, i){
			var pointGroup = v.childNodes[1].children;
			for (ip in pointGroup){
				if (pointGroup[ip].localName == "charPoint"){
						if (pointGroup[ip].getAttribute("char") == personajesArray[ipersonaje].nombre){
							cont++;
						}																				
				}
			}	
		});
		var oPersonaje= new Personaje(personajesArray[ipersonaje].nombre, cont);
		oPersonajes.push(oPersonaje);
		oPersonaje = [];
		aPersonajesEscenas=[];
	}

	console.log("personajes con numEscenas");
	console.log(losPersonajes);
	console.log(lasEscenas);
	console.log(maxPersonajes);
	console.log(oPersonajes);

	return oPersonajes;

}

$(document).ready(function(){

	$(document).on("click",'ellipse',function(e) {		
	    $('#detalle-escena').lightbox_me({
	        centered: true, 
	        onLoad: function() { 
	            $('#detalle-escena').find('input:first').focus()
	            }
	        });
	    e.preventDefault();
	    addDetalleEscena();
	});

});