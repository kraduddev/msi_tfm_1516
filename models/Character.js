models = {
	function Character (name, color, number){
		var _color = color;
		var _name = name;
		var _number = number;
		var _firstScene = -1;
		var _lastScene = -1;
		// var _startLabel = null;
		// var _endLabel = null;
		var _numScenes = 0;
		var _position = -1;

		this.getNumber = function(){
			return _number;
		}
		
		this.getNumScenes = function(){
			return _numScenes;
		}
	}
}
