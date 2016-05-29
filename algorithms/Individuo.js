var algorithms = algorithms || {};


algorithms.Individuo = function(initCharPos, scenePos){
	// Clase que implementa el algoritmo genético que coloca las lineas/escenas
	this._initCharPos = initCharPos;
	this._scenePos = scenePos;

	// this.create = function (initCharPos, scenePos){
	// 	_initCharPos = initCharPos;
	// 	_scenePos = scenePos;
	// }

	this.copy = function (ind){
		_initCharPos = [];
		_scenePos = [];

		var j = 0;

		angular.forEach(ind._initCharPos, function(i){
			_initCharPos[j] = i;
			j++;
		});

		j=0;
		angular.forEach(ind._scenePos, function(i){
			_scenePos[j] = i;
			j++;
		});
	}

}

