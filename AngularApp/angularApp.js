var myApp = angular.module('myApp', []);

myApp.controller('MainCtrl', function($scope, $window){
	$scope.personajes = [];
	$scope.escenas = [];
	var x2js = new X2JS(); //objeto para convertir XML a JSON

	d3.xml("xml_guiones/Rocky_corregido-min.plt-sent.xml", function(error, pelicula){
		if(error) {throw error;}
		
		$scope.pelicula = pelicula;
		var personajes = d3.select(pelicula).selectAll("char")[0];	
		var escenas = d3.select(pelicula).selectAll("timeSlice")[0];
		
		// Relleno el array de objetos Personaje
		var personajesXML = "<personajes>";
		angular.forEach(personajes, function(e){
			personajesXML += (new XMLSerializer()).serializeToString(e)
		});
		personajesXML += "</personajes>";

		$scope.personajes = x2js.xml_str2json(personajesXML);
		$scope.personajes = $scope.personajes.personajes.char;
		angular.forEach($scope.personajes, function(p){
			p._color = p._color.replace("0x","#");
		});
		
		if (debug) {console.log($scope.personajes)};



		// Relleno el array de objetos Escena
		var escenasXML = "<escenas>";
		angular.forEach(escenas, function(e){
			escenasXML += (new XMLSerializer()).serializeToString(e)
		});
		escenasXML += "</escenas>";

		
		$scope.escenas = x2js.xml_str2json(escenasXML);
		$scope.escenas = $scope.escenas.escenas.timeSlice;
		if (debug) {console.log($scope.escenas)};

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