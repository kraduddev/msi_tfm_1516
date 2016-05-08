var myApp = angular.module('myApp', []);

myApp.controller('MainCtrl', function($scope, $window){

	$scope.personajes = [];
	$scope.maxPersonajes = 3;

	d3.xml("xml_guiones/Rocky_corregido-min.plt-sent.xml", function(error, pelicula){
		
		if(error) {throw error;}
		console.log(pelicula);
		var personajes = d3.select(pelicula).selectAll("char")[0];		
		angular.forEach(personajes, function(p){
			$scope.personajes.push({
				name: p.getAttribute("name"),
				color: p.getAttribute("color").replace("0x","#"),
				sentimiento: p.getAttribute("sentimiento"),
				colorSentimiento: p.getAttribute("color-sentimiento")
			});
		});

		var divPersonajes = d3.select("#personajes")
    	.selectAll("div")    	
    	.data(personajes)    	
    	.enter();

		divPersonajes.append("div")
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




		$scope.apply;
    });
});

myApp.directive('personajesContainer', function(){
	function link(scope, el, attr){
		scope.$watch('data', function(data){
          scope.personajes = [];
          for (var i=0; i<scope.maxPersonajes; i++){
          	cope.personajes.push({
				name: p.getAttribute("name"),
				color: p.getAttribute("color").replace("0x","#"),
				sentimiento: p.getAttribute("sentimiento"),
				colorSentimiento: p.getAttribute("color-sentimiento")
			});
          }
        }, true);	
	}
	return{
		link: link,
		restrict: 'E',
		scope:{data:'='}
	};
});