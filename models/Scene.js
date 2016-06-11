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

	var _pixelsPerChar = 16;
	var _rectMargin = 10;
	var _anchoRect = 7;//8;
	var _pointSize = 2;

	// TODO: Cambiar el punto del scenePoint por el apropiado
	var _scenePoint = 20;

	var _circleColor = 0x252525;
	var _ellipseColor = 0x969696;
	var _rectColor = 0xCCCCCC;

	var _sceneMovement = 0;

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
// console.log("num",num,"_chars[num]",_chars[num]);			
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
// console.log("scenePoint", scenePoint);
// console.log("positions", positions);
// console.log("_chars",_chars);	
		// Obtengo los personajes de la escena		
		angular.forEach(_chars, function(charpoint){
// console.log("charpoint", charpoint);				
			charpoint.y = _margenSuperior + positions[charpoint._num] * _pixelsPerChar;
// console.log("charpoint.y",charpoint.y);
		});
		
		// Obtengo los personajes de fuera de la escena
		angular.forEach(_charsAux, function(charpointAux){
			charpointAux.y = _margenSuperior + positions[charpointAux._num] * _pixelsPerChar;
 //console.log("charpointAux.y",charpointAux.y);			
		});		
	}

	this.getSceneChars = function()
	{
		return _chars;
	}
	
	this.getNoSceneChars = function()
	{
		return _charsAux;
	}

	this.getXValue = function()
	{
		return getNextX() - _hSize/2; //_margenDerecho + (_numEscena-1)*_hSize + _hSize/2;
	}


	this.display = function()
	{
		y=0;
		x = _numEscena==1? _margenDerecho : _scenes[_numEscena-2].getNextX();
		//_margenDerecho + (_numEscena-1)*_hSize;
		
		/*if(_actDivision)
		{
			if(this._startingPag<=30 && this._scenes[this.numEscena]._startingPag>30 || this._startingPag>=30 && this._startingPag<31){
				showShadow();
			}
			
			if(this._startingPag<=60 && this._scenes[this.numEscena]._startingPag>60 || this._startingPag>=60 && this._startingPag<61){
				showShadow();
			}
			
			
			if(this._startingPag<=90 && this._scenes[this.numEscena]._startingPag>90 || this._startingPag>=90 && this._startingPag<91){
				showShadow();
			}
		}
		
		
		if(_showVlines)
		{
			vlinesDisplay();
		}
		*/
		ellipseDisplay();
		/*
		if(_showSceneNumbers)
		{
			showSceneNumber();
		}
		else
		{
			label.visible = false;
		}*/
	}

	this.pintar = function(g){
		y=0;
		x = _numEscena==1? _margenDerecho : _scenes[_numEscena-2].getNextX();

		pintarEscena(g);
	}

	var pintarEscena = function(g){
		if(_numChars > 0)
		{
			// Calculo alto rectangulo a partir de los chars
			//var altoRect:int = _numChars * _pixelsPerChar;
			var altoElipse = _numChars * _pixelsPerChar + _rectMargin;
			
			var xRect = (_hSize/2)-(_anchoRect/2);
			var yRect = (_scenePoint + _sceneMovement) *_pixelsPerChar - _pixelsPerChar/2 + _margenSuperior;

			g.filter(function(d){
				return d == _numEscena;
			})
			.append("ellipse")
			.style("stroke", "gray")
	        .style("fill", "white")
			.attr('cx', x)
			//.attr('cy', function(d,i){return (Math.random()*200)+50;})
			.attr('cy', function(){ 
				var chars = _scenes[_numEscena-1].getSceneChars(); 
				var yEscena = 70;
				var primerElemento = Object.keys(chars)[0];
				return primerElemento == null ? yEscena : yEscena+chars[primerElemento].y;
			})			
			.attr('rx', 10)
			.attr('ry', 50)
			.on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
	        .on("mouseout", function(){d3.select(this).style("fill", "white");});		
		}
	}

	var ellipseDisplay = function()
	{
		if(_numChars > 0)
		{
			// Calculo alto rectangulo a partir de los chars
			//var altoRect:int = _numChars * _pixelsPerChar;
			var altoElipse = _numChars * _pixelsPerChar + _rectMargin;
			
			var xRect = (_hSize/2)-(_anchoRect/2);
			var yRect = (_scenePoint + _sceneMovement) *_pixelsPerChar - _pixelsPerChar/2 + _margenSuperior;
			


/*
var g = svg.selectAll(".trait")
      .data(traits)
    .enter().append("svg:g")
      .attr("class", "trait")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
      .origin(function(d) { return {x: x(d)}; })
      .on("dragstart", dragstart)
      .on("drag", drag)
      .on("dragend", dragend));

*//*
        g.append("circle")
        .style("stroke", "gray")
        .style("fill", "white")
        .attr("r", _anchoEllipse)
        .attr("cx", x*2)
        .attr("cy", function(){return (Math.random()*_hSize)+100})
        .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
        .on("mouseout", function(){d3.select(this).style("fill", "white");});*/
    	/*
		g.append("ellipse")
              			.attr("cx", _ellipseMargin)
			          	.attr("cy", yRect - _rectMargin/2 )
			         	.attr("rx", _hSize-_ellipseMargin*2)
			         	.attr("ry", altoElipse);*/

/*
			_ellipse.graphics.clear();
			_ellipse.graphics.lineStyle();
			_ellipse.graphics.beginFill(_ellipseColor);
			
			_ellipse.graphics.drawEllipse(_ellipseMargin,yRect - _rectMargin/2 ,_hSize-_ellipseMargin*2, altoElipse);
			// Dibujar el cuadrado interior
			_ellipse.graphics.beginFill(_rectColor);
			_ellipse.graphics.drawRect(xRect, yRect-_rectAddedY/2, _anchoRect, _altoRect);
*/

/*			
			if(_ellipseClicked)
			{
				_sceneNameText.visible = true;
				_sceneNameText.y = (_scenePoint + _sceneMovement)*_pixelsPerChar - _pixelsPerChar/2 + _margenSuperior - _sceneNameText.height/2 - _rectAddedY/4 ;
				if (_sceneNameText.width > 110)
				{
					_sceneNameText.width = 110;
				}
				_sceneNameText.x = xRect + 10;
				_house.x = _anchoRectSize - 25;
				_house.y = _sceneNameText.y - 5;
				_sun.x = _anchoRectSize - 27;
				_sun.y = _sceneNameText.y - 7;
			}
			else
			{
				_sceneNameText.visible = false;
			}
*/

/*
			// Dibutar puntos de personajes
			var i = 0;
			if(_ellipseClicked)
			{
				for each(var char:CharPoint in _chars)
				{
					if(_colorCircle)
					{
						_ellipse.graphics.beginFill(_layoutPadre.chars[char._num].getColor());
					}
					else
					{
						_ellipse.graphics.beginFill(_circleColor);	
					}
					_ellipse.graphics.drawCircle(xRect + 20, char.y , _pointSize);
					_charNames[i].y = char.y - 5;
					_charNames[i].x = xRect + 20 + 10;
					_charNames[i].text = char._name;
					_charNames[i].visible = true;
					i++;
				}
			}
			else
			{
				for each(char in _chars)
				{
					if(_colorCircle)
					{
						_ellipse.graphics.beginFill(_layoutPadre.chars[char._num].getColor());
					}
					else
					{
						_ellipse.graphics.beginFill(_circleColor);	
					}
					_ellipse.graphics.drawCircle(xRect + _anchoRect/2, char.y , _pointSize);
					_charNames[i].visible = false;
					i++;
				}
			}
*/			
		}
	}
}