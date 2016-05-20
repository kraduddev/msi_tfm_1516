var models = models || {};

models.CharPoint = function(name, color, num){
	this.y = 0;
	this._color = "0x22EE00";
	this._num;
	this._name;

	_color = color;
	_num = num;
	_name = name;

	this.copy = function(cp){
		_color = cp._color;
		_num = cp._num;
		y = cp.y;
		_name = cp._name;
	}

	this.getYValue = function(){
		return y;
	}

	this.getNum = function(){
		return _num;
	}
}