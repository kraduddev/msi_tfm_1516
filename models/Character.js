var models = models || {};

models.Character = function(name, color, number, sent, colorSent){
	var _color = "#FFFFFF";
	var _name = "No_Name";
	var _number = 0;
	var _sent = "";
	var _colorSent = "#000000"
	var _firstScene = -1;
	var _lastScene = -1;
	var _startLabel;
	var _endLabel;
	var _numScenes = 0;
	var _position = -1;

	_name = name;
	_color = color;
	_number = number;
	_sent = sent;
	_colorSent = colorSent;

	this.getNumber = function(){
		return _number;
	}
	
	this.getNumScenes = function(){
		return _numScenes;
	}

	this.getName = function(){
		return _name;
	}

	this.getNumber = function(){
		return _number;
	}

	this.hasFirstScene = function()
	{
		return (_firstScene == -1 ? false : true);
	}

	this.setFirstScene = function(first)
	{
		_firstScene = first;
	}
	
	this.setLastScene = function(last)
	{
		_lastScene = last;
	}
	
	this.getFirstScene = function()
	{
		return _firstScene;
	}
	
	this.getLastScene = function()
	{
		return _lastScene;
	}
	
	this.addScene = function()
	{
		_numScenes++;
	}
	
	this.getNumScenes = function()
	{
		return _numScenes;
	}

	this.getColor = function()
	{
		return _color;
	}

	this.setColor = function(color)
	{
		_color = color;
	}
	
	this.getSent = function()
	{
		return _sent;
	}

	this.getColorSent = function()
	{
		return _colorSent;
	}

	this.getPosition = function()
	{
		return _position;
	}

	this.setPosition = function(pos)
	{
		_position = pos;
	}
}
