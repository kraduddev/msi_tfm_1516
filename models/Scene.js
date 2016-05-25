var models = models || {};

models.Scene = function (layoutPadre, numEscena, scenes, sceneName, sceneLength, currentPage, ultimaEscena){
	// al principio no hay personajes
	var _numChars = 0;
	var _numCharsAux = 0;
	var _chars = [];
	var _charsAux = [];
	var _numEscena = 0;
	var _hSize = 35;
	var _margenDerecho = 60;
	var _ellipseMargin = 5;
	var _margenSuperior = 30;
	var _anchoEllipse = 25;

	// guardo la página en la que empieza la escena
	var _startingPag = currentPage;

	// guardo el layout padre
	var _layoutPadre = layoutPadre;

	// numero de la escena (ordinal, no del guión)
	var _numEscena = numEscena;
	var _ultimaEscena = ultimaEscena;

	//Referencia a cada escena
	var _scenes = scenes;

	// Tamaño del texto de la escena
	var _sceneLength = sceneLength;

	this.getNumVisibleChar = function(){
		return _numChars;
	}

	this.charVisible = function(char){
		if(_chars[char] != null){
			return true;
		}
		else{
			return false;
		}
	}

	this.charInAux = function(char){
		if(_charsAux[char] != null){
			return true;
		}
		else{
			return false;
		}
	}

	this.getNumEscena = function(){
		return _numEscena;
	}

	this.addChar = function (num, color, charName, visible){
		if (visible == true){
			_chars[num] = new models.CharPoint(charName, color, num);
			_numChars++;
		}
		else{
			_charsAux[num] = new models.CharPoint(charName, color, num);
			_numCharsAux++;
		}
	}

	this.getSize = function (){
		return _hSize;
	}

	this.getNextX = function(){
		return x + _hSize;
	}

	this.updatePosition = function(){
		if (_numEscena == 1){
			x = _margenDerecho;
		}
		else{
			x = _scenes[_numEscena-2].getNextX();
		} 
	}

	this.calcCharPoints = function(scenePoint, positions)
	{
		_scenePoint = scenePoint;
		
		// Obtengo los personajes de la escena
		angular.forEach(_chars, function(charpoint){
			charpoint.y = _margenSuperior + positions[charpoint._num] * _pixelsPerChar;
		});
		
		// Obtengo los personajes de fuera de la escena
		angular.forEach(_charsAux, function(charpointAux){
			charpointAux.y = _margenSuperior + positions[charpointAux._num] * _pixelsPerChar;
		});
	}
}