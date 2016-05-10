var myApp = angular.module('myApp', []);

myApp.controller('MainCtrl', function($scope, $window){
	$scope.personajes = [];
	$scope.escenas = [];

	d3.xml("xml_guiones/Rocky_corregido-min.plt-sent.xml", function(error, pelicula){
		if(error) {throw error;}
		
		$scope.pelicula = pelicula;
		var personajes = d3.select(pelicula).selectAll("char")[0];	
		var escenas = d3.select(pelicula).selectAll("timeSlice")[0];

		// Relleno el array de objetos Personaje
		angular.forEach(personajes, function(p){
			$scope.personajes.push({
				name: p.getAttribute("name"),
				color: p.getAttribute("color").replace("0x","#"),
				sentimiento: p.getAttribute("sentimiento"),
				colorSentimiento: p.getAttribute("color-sentimiento")
			});
		});

		// Relleno el array de objetos Escena
		angular.forEach(escenas, function(e){
			$scope.escenas.push({
				cabecera: e.getAttribute("cabecera"),
				duracion: e.getAttribute("duracion"),
				letra: e.getAttribute("letra"),
				numeroCabecera: e.getAttribute("numerocabecera"),
				step:e.getAttribute("step"), 
				stepReal: e.getAttribute("stepreal"),
				sentimiento: e.getAttribute("sentimiento"),
				colorSentimiento: e.getAttribute("color-sentimiento"),
				pointGroup: {
					ambiente: e.childNodes[1].getAttribute("ambiente"),
					dummy: e.childNodes[1].getAttribute("dummy"),
					indiceAsignado: e.childNodes[1].getAttribute("indiceasignado"),
					name: e.childNodes[1].getAttribute("name"),
					pin: e.childNodes[1].getAttribute("pin"),
					principal: e.childNodes[1].getAttribute("principal"),
					tipo: e.childNodes[1].getAttribute("tipo"),
					tipoEscena: e.childNodes[1].getAttribute("tipoescena"),
					urlImagen: e.childNodes[1].getAttribute("urlimagen"),
					y: e.childNodes[1].getAttribute("y")
				},
				charPoints: $filter('filter')(e.childNodes[1].children, nodeName:'charPoint')
			});
		});
console.log(escenas);
console.log($scope.escenas);
		$scope.$apply();
			
    });	

});

myApp.directive('chars', function(){
	function link(scope, el, attr){		
	}
	return{
		link: link,
		restrict: 'E',
		scope:{personajes:'='},
		templateUrl: 'layout/chars.htm',
		replace:false

	};
});

myApp.directive('vis', function(){
	function link(scope, el, attr){		
	}
	return{
		link: link,
		restrict: 'E',
		scope:{escenas:'='},
		templateUrl: 'layout/vis.htm',
		replace:false

	};
});