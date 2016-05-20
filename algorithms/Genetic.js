var algorithms = algorithms || {};

algorithms.Genetic = function(){
	// Clase que implementa el algoritmo genético que coloca las lineas/escenas
	var mutationRate = 0.01;
	var numGeneraciones = 1;
	var tamGeneracion = 15;

	this.individuo = function (numChars, scenes){
		//Genero aleatorialmente la ordenación inicial
		var arr = [];
		var i;

		for (i=0; i<numChars; i++){
			arr.push(i);
		}

		var arr2 = [];
		while (arr.length > 0){
			arr2.push(arr.splice(Math.round(Math.random() * (arr.length - 1)), 1)[0]);
		}

		//Genero aleatoriamente la posición de cada elipse
		var positions = [];
		i = 0;
		angular.forEach(scenes, function(scene){
			//Calculo el num de personajes en la elipse para posicionarla correctamente
			var numCharsScene = scenes[i].getNumVisibleChar();
			var position =  Math.round(Math.random()*(numChars-numCharsScene));
			i++;
			positions.push(position);
		});

		var individuo = new models.Individuo();
		individuo.create(arr2, positions);
		return individuo;

	}

}
