var models = models || {};

models.CharacterLine = function (name, charNumber){
	var _name = "noname";
	var _charNumber = 0;

	_name = name;
	_charNumber = charNumber;

	this.getName = function(){
		return _name;
	}

	this.setName = function (value){
		_name = value;
	}

	this.getCharNumber = function(){
		return _charNumber;
	}

	this.setCharNumber = function (value){
		_charNumber = value;
	}

}