models = {
	function Scene (layoutPadre, numEscena, scenes, sceneName, sceneLength, currentPage, ultimaEscena){
		// al principio no hay personajes
		var _numChars = 0;
		var _numCharsAux = 0;
		var _chars = [];
		var _charsAux = [];

		// guardo la página en la que empieza la escena
		var _startingPag = currentPage;
		console.log(sceneName+": "+currentPage);

		// guardo el layout padre
		var _layoutPadre = layoutPadre;

		// numero de la escena (ordinal, no del guión)
		var _numEscena = numEscena;
		var _ultimaEscena = ultimaEscena;

		//Referencia a cada escena
		var _scenes = scenes;

		// Tamaño del texto de la escena
		var _sceneLength = sceneLength;

		var getNumVisibleChar = function(){
			return _numChars;
		}

		// + => metodo charVisible(int)
		var charVisible = function(char){
			if(_chars[char] != null){
				return true;
			}
			else{
				return false;
			}
		}

		var charInAux = function(char){
			if(_charsAux[char] != null){
				return true;
			}
			else{
				return false;
			}
		}
	}
}