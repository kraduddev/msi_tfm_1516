var models = models || {};

models.Scene = function (layoutPadre, numEscena, scenes, sceneName, sceneLength, currentPage, ultimaEscena, sent, colorSent, lugar){
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
	var _rectAddedY = 0;
	var _altoRect = 0;

	var _sent = "";
	var _colorSent = "#000000";
	var _lugar = "";

	_sent = sent;
	_colorSent = colorSent;
	_lugar = lugar;

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
	var _anchoRect = 8;//8;
	var _pointSize = 2;

	// TODO: Cambiar el punto del scenePoint por el apropiado
	var _scenePoint = 20;

	var _circleColor = "#252525";
	var _ellipseColor = "#969696";
	_colorOriginalEllipse = _ellipseColor;
	var _rectColor = "#CCCCCC";

	var _sceneMovement = 0;

	var escenaGroup;	
	var gEscena;

	// Mostrar sombra de acto
	var _actDivision = false; // -> he definido la variable en angularD3.js

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

	this.getSent = function(){
		return _sent;
	}

	this.getColorSent = function(){
		return _colorSent;
	}

	this.getLugar = function(){
		return _lugar;
	}

	this.addChar = function (num, color, charName, visible, sent, colorSent){
		if (visible == true){			
			_chars[num] = new models.CharPoint(charName, color, num, sent, colorSent);		
			_numChars++;
			_altoRect = _chars.length * _pixelsPerChar;
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
		return this.getNextX() - _hSize/2; //_margenDerecho + (_numEscena-1)*_hSize + _hSize/2;
	}

	this.getYChar = function(num)
	{ 
//console.log(num, _chars[num], _charsAux[num])
		if (_chars[num] != null)
		{
			var char = _chars[num];
			return char == null ? 0 : char.y; // TODO
		}
		else
		{
			var charAux = _charsAux[num];
			return charAux == null ? 0 :charAux.y; // TODO
		}
	}

	this.showShadow = function()
	{
		if (gEscena != null){
			gEscena.select(".axis").append("rect")
					.attr('class', 'actDivison')				
					.style("fill", "#000000")
					.style('opacity', 0.1)
					.attr('x', -17) //xRect
					.attr('y', -20)
					.attr('width', _hSize)
					.attr('height', function(){ return height+50;})
		}
	}

	this.showShadowCreated = function()
	{
		if (gEscena != null){
			gEscena.select(".actDivison")
					.transition()
					.duration(500)
					.ease("linear")
					.style('opacity', 0.1);
		}
	}

	this.clearShadow = function()
	{
		if (gEscena != null){
			gEscena.select(".actDivison")				
					.transition()
					.duration(500)
					.ease("linear")
					.style('opacity', 0)
		}
	}

	this.display = function()
	{
		y=0;
		x = _numEscena==1? _margenDerecho : _scenes[_numEscena-2].getNextX();
		//_margenDerecho + (_numEscena-1)*_hSize;
	/*
		if(_actDivision)
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

	this.pintar = function(g, numEscena){
		y=0;
		x = _numEscena==1 ? _margenDerecho : _scenes[_numEscena-2].getNextX();

		pintarEscena(g);

		if(_showActDivision)
		{
//console.log(_numEscena, _startingPag);				
			if(/*_startingPag<=30 && _scenes[numEscena]._startingPag>30 || */_startingPag>=28 && _startingPag<=30){
				this.showShadow();
			}
			
			if(/*_startingPag<=60 && _scenes[numEscena]._startingPag>60 ||*/ _startingPag>=75 && _startingPag<=78){
				this.showShadow();
			}
			
			
			if(/*_startingPag<=90 && _scenes[this.numEscena]._startingPag>90 || */_startingPag>=90 && _startingPag<=91){
				this.showShadow();
			}
		}

		
	}

	var pintarEscena = function(g){
		if(_numChars > 0)
		{
			// Calculo alto rectangulo a partir de los chars
			
			var altoRect = _numChars * _pixelsPerChar;
			var altoElipse = _numChars * _pixelsPerChar + _rectMargin;
		
			var xRect = (_hSize/2)-(_anchoRect/2);
			var yRect = (_scenePoint + _sceneMovement) *_pixelsPerChar - _pixelsPerChar/2 + _margenSuperior;

			gEscena = g.filter(function(d){
				return d == _numEscena;
			});

			var cy = yRect - _rectMargin/2;
			
			escenaGroup = gEscena.append("g")
				.attr('transform', function(){
					return "translate(0, "+ cy+")";
				})
				.attr('class', 'escena-group');

			

//_ellipse.graphics.drawEllipse(_hSize/2-_anchoEllipse/2 /*_ellipseMargin*/
//	,yRect - _rectMargin/2 
//	,_anchoEllipse/*_hSize-_ellipseMargin*2*/
//	, altoElipse);

//_ellipse.graphics.drawEllipse(/*_hSize/2-_anchoEllipse/2*/ _ellipseMargin
//	,yRect - _rectMargin/2 
//	,/*_anchoEllipse*/_hSize-_ellipseMargin*2
//	, altoElipse);
				
/*

if (b)
				{
					scene.hSize = Number(scene.sceneLength)/_sceneMinLength*20;
				}
				else
				{
					scene.hSize = 35;
				}

*/
			ellipse[_numEscena] = escenaGroup
				.append("ellipse")
				//.style("stroke", "gray")
				.style('stroke', _colorSent)
				.style('stroke-width', '4px')
		        .style("fill", _ellipseColor)
				.attr('cx', 0) //x			
				//.attr('cy', function(){
				//	return (yRect - _rectMargin)*2;
				//})
				.attr('cy', ( altoElipse/2))			
				.attr('rx', _hSize-_ellipseMargin*4) //_hSize-_ellipseMargin*2
				.attr('ry', altoElipse/2) //50
				.attr('title', _numEscena)
				.on("mouseover", function(){
					d3.select(this).style("fill", "aliceblue");
					divTitle.transition()
						.duration(200)
						.style("opacity", .9);
					divTitle.html("Escena "+ _numEscena + "<br/>" + _lugar) 
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");	
				})
		        .on("mouseout", function(){
		        	d3.select(this).style("fill", _ellipseColor);
		        	divTitle.transition()
		        		.duration(500)
		        		.style("opacity", 0);	
		        })	        

	        // Dibujar el cuadrado interior
	        escenaGroup
				.append("rect")
				.style("fill", _rectColor)
				.attr('x', -3) //xRect
				.attr('y', yRect - _rectAddedY/2 - cy)
			//	.attr('y', yRect-_rectAddedY/2)	
				.attr('width', _anchoRect)
				.attr('height', altoRect)

			// dibujar los puntos de personaje en la escena
			angular.forEach(_chars, function(char){
				escenaGroup.append("circle")
					.style("fill", char._color)
					.attr('cx', 0) //xRect + _anchoRect/2
					.attr('cy', char.y-cy)
					.attr('r', _pointSize)
					.attr('class', char._name)
					.attr('title', char._name);
			});

			// comportamiento cuando muevo una escena en el eje vertical
			var cyInicial = null;
			var cxInicial = [];
		/*	escenaGroup.call(d3.behavior.drag()
	        	.origin(Object)
		  		.on("dragstart", function (d) {
	  				cyInicial = cy;
	  				cxInicial = gEscena.attr('transform').match(floatRegex)[0];
console.log("cxInicial", cxInicial)	  				
				  	d3.event.sourceEvent.stopPropagation();
				  	d3.select(this).classed("dragging", true);
				})
			    .on("drag", function (d) { 
		            d3.select(this).attr("transform", function(d,i){
		            	cy += d3.event.dy;
		                return "translate(" + [0, cy] + ")";
		            });     				
				})
			    .on("dragend", function (d) {
//console.log(cyInicial, cy);
					var cyFinal = cy - cyInicial;
				  	d3.select(this).classed("dragging", false);
				  	// movemos también la línea de los personajes que intervienen en la escena
			 	 	angular.forEach(pathPersonajes, function(path, i){
			 	 		//obtengo y del personaje		 	 		
			 	 		var regex = new RegExp("L"+cxInicial+","+"[0-9]*");
			 	 		var yPersonajeOriginalArray = path.match(regex);
			 	 		if (yPersonajeOriginalArray != null){
			 	 			var yPersonajeOriginal = yPersonajeOriginalArray[0].split(",");
				 	 		// sumo el cyFinal
				 	 		var yPersonajeAux = yPersonajeOriginal[0]+","+(parseInt(yPersonajeOriginal[1])+parseInt(cyFinal));
console.log(yPersonajeOriginalArray[0], cyFinal, parseInt(yPersonajeOriginal[1])+parseInt(cyFinal), yPersonajeAux)			 	 						 	 		
				 	 		// hago replace 
				 	 		path = path.replace(yPersonajeOriginalArray[0], yPersonajeAux);
				 	 		//repinto la línea del personaje con los nuevos atributos
					//		$("path"+"."+i).attr("d", path);								 	 		
			 	 		}
				  	});
				}
			));	*/
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