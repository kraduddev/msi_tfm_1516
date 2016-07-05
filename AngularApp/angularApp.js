var myApp = angular.module('myApp', []);

myApp.controller('MainCtrl', function($scope, $window, $rootScope){
	
	$(document).ready(function(){
		// reaccion cuando se pincha en una escena
		$(document).on("click",'ellipse',function(e) {		
		    $('#detalle-escena').lightbox_me({
		        centered: true, 
		        onLoad: function() { 
		            $('#detalle-escena').find('input:first').focus()
		            }
		        });
		    e.preventDefault();
		    addDetalleEscena($(this).attr('title'));
		});

		// reaccion cuando se pincha en una línea de personaje
		$(document).on("click",'path',function(e) {		
		    e.preventDefault();
		    console.log("personaje",$(this).attr('class'))
		    // addDetalleEscena($(this).attr('class'));
		});
	});

	//se añaden los datos del detalle de la escena para representarlo
	var addDetalleEscena = function(numEscena){
		$scope.$apply(function(){
			$scope.numEscenaActual = numEscena;
			$scope.colorSentEscenaActual = _scenes[numEscena-1].getColorSent();
			$scope.lugarEscenaActual = _scenes[numEscena-1].getLugar();
			$scope.charsEnEscena = [];
			angular.forEach(_scenes[numEscena-1].getSceneChars(), function(c){
				if (c != null) $scope.charsEnEscena.push(c);
console.log(numEscena, _scenes[numEscena-1].getNumEscena(), _scenes[numEscena-1].getSceneChars())
			});
		});
	}

	var createCharacters = function (personajes){
		var i = 0; 
		angular.forEach(personajes, function(p){		
			if(p.hasOwnProperty('_name')){ 		
				_chars.push(new models.Character(p._name, p._color, i, p._sentimiento, p._colorSentimiento));
				_charToNumber[p._name] = i; 
			}
			i++;
		});		

		//Obtengo la primera y última escena de cada personaje
		angular.forEach($scope.escenas, function(escena){
			
			if (escena.hasOwnProperty('pointGroup')){	
				// sólo tengo un personaje en la escena
				if (escena.pointGroup.hasOwnProperty('charPoint') && escena.pointGroup.charPoint.length == null){
				
					var charNum = _charToNumber[escena.pointGroup.charPoint._char];
					//Sumo uno al número de escenas del personaje
					if (_chars[charNum] != null){
						_chars[charNum].addScene();

						//Si no tiene primera escena, se la establezco
						if(!_chars[charNum].hasFirstScene()){
							_chars[charNum].setFirstScene(parseInt(escena._step));
						}
						//Actualizo la última escena obtenido
						_chars[charNum].setLastScene(parseInt(escena._step));
					}	
				}

				// tengo varios personajes en la escena
				else if (escena.pointGroup.hasOwnProperty('charPoint') && escena.pointGroup.charPoint.length != null){

					angular.forEach(escena.pointGroup.charPoint, function(charPoint){
					
						var charNum = _charToNumber[charPoint._char];
						//Sumo uno al número de escenas del personaje
						if (_chars[charNum] != null){
							_chars[charNum].addScene();

							//Si no tiene primera escena, se la establezco
							if(!_chars[charNum].hasFirstScene()){
								_chars[charNum].setFirstScene(parseInt(escena._step));
							}
							//Actualizo la última escena obtenido
							_chars[charNum].setLastScene(parseInt(escena._step));
						}				
					});
				}
			}		
		});

		if (debug){
			angular.forEach(_chars, function(c){
				console.log(c.getName() 
					+" nº"+c.getNumber()
					+" f"+c.getFirstScene()
					+" l"+c.getLastScene()
					+" t"+c.getNumScenes());
			});
		}
		//Queda añadir la importancia de cada personaje.
		//
		

		height = _chars.length * _pixelsPerChar;		
	};

	var calcMaxSceneInChars = function(){
		_maxNumScenesPerChar = -MIN_VALUE;
		angular.forEach(_chars, function(c){
			if(c.getNumScenes() > _maxNumScenesPerChar){
				_maxNumScenesPerChar = c.getNumScenes();
			}
		});
	};

	var createScenes = function(escenas){
		var text = "";
		var scene;

		_scenesTotalLength = 0;
		// Calculo el valor total de la longitud de la película
		angular.forEach(escenas, function(escena){
			_scenesTotalLength += 2; //Sumo el encabezado de la escena
			if (escena.hasOwnProperty('pointGroup')){
				angular.forEach(escena.pointGroup.accion, function(accion){
					text = accion._descripcion; 
					if (text != null){
						_scenesTotalLength += text.length % 60 == 0 
							? text.length / 60 
							: text.length / 60 + 1;		
						_scenesTotalLength += 1; // sumo la nueva linea de parrafo						
									
						angular.forEach(accion.charDialog, function(dialog){
							text = dialog._texto;
							if (text != null){
								_scenesTotalLength +=text.length % 40 == 0
									?  text.length / 40
									:  text.length / 40 + 1;
								_scenesTotalLength += 2; //Sumo el nombre del char		
							}					
						});
					}
				});
			}
		});
	//	_scenesTotalLength = Math.round(_scenesTotalLength);

		width = 0 ;
		_numEscenas = 0;
		var currentLength = 0;
		angular.forEach(escenas, function(escena){
			var sceneLength = 0;
			sceneLength += 2; // sumo el encabezado de la escena
			if (escena.hasOwnProperty('pointGroup')){
				angular.forEach(escena.pointGroup.accion, function(accion){
					text = accion._descripcion;
					if (text != null){						
						sceneLength += text.length % 60 == 0
							? text.length / 60
							: text.length / 60 + 1;
						sceneLength += 1; // sumo la nueva linea de parrafo

						angular.forEach(accion.charDialog, function(dialog){
							text = dialog._texto;
							if (text != null){
								sceneLength += text.length % 40 == 0
									? text.length / 40
									: text.length / 40 + 1;
								sceneLength += 2; //Sumo nombre del char
							}
						});
					}
				});
			}

		//	sceneLength = Math.round(sceneLength);

			if (_sceneMinLength > sceneLength){
				_sceneMinLength = sceneLength;
			}

			if (_sceneMaxLength > sceneLength){
				_sceneMaxLength = sceneLength;
			}

			scene = new models.Scene(this
				, escena._step
				, _scenes
				, escena.hasOwnProperty('pointGroup') ? escena.pointGroup._name : "" 
				, sceneLength
				, currentLength/_scenesTotalLength * parseInt(_numPagsScript)
				, null
				, escena._sentimiento
				, escena._colorSentimiento
				, escena.hasOwnProperty('pointGroup') ? escena.pointGroup._name : "" );

			currentLength +=sceneLength;
//console.log(currentLength, _scenesTotalLength, parseInt(_numPagsScript),currentLength/_scenesTotalLength * parseInt(_numPagsScript))						
			// si encuentro EXT
			if(escena._cabecera.indexOf(".EXT.") >= 0){
				scene.interior = 0;
			}
			else if (escena._cabecera.indexOf(".INT.") >= 0){
				scene.interior = 1;
			}
			else{
				scene.interior = 2;
			}

			var listChars = new Array();

			//Obtengo la lista de personajes que aparecen en esta escena
			//sólo tengo un personaje en la escena
			
			if (escena.hasOwnProperty('pointGroup')){
				if (escena.pointGroup.hasOwnProperty('charPoint') && escena.pointGroup.charPoint.length == null){
					listChars[escena.pointGroup.charPoint._char] = true;
				}

				// tengo varios personajes en la escena
				if (escena.pointGroup.hasOwnProperty('charPoint') && escena.pointGroup.charPoint.length != null){
					angular.forEach(escena.pointGroup.charPoint, function(c){
						listChars[c._char] = true;
					});
				}
				angular.forEach(_chars, function(c){		
					if (listChars[c.getName()]){

						// obtengo el sentimiento del personaje
						var sent = null;
						var colorSent = null;
						if (escena.pointGroup.hasOwnProperty('charPoint') && escena.pointGroup.charPoint.length == null){
							sent = escena.pointGroup.charPoint._sentimiento;
							colorSent = escena.pointGroup.charPoint._colorSentimiento;
						}

						// tengo varios personajes en la escena
						if (escena.pointGroup.hasOwnProperty('charPoint') && escena.pointGroup.charPoint.length != null){
							angular.forEach(escena.pointGroup.charPoint, function(cEscena){
								if (cEscena._char == c.getName()){
									sent = cEscena._sentimiento;
									colorSent = cEscena._colorSentimiento;
								}
							});
						}

						scene.addChar(c.getNumber(), c.getColor(), c.getName(), true, sent, colorSent);
					}
					else{
						var numEscena = scene.getNumEscena();
	// console.log(c.getName(), c.getFirstScene(), c.getLastScene(), numEscena)
						if(c.getFirstScene() <= numEscena && c.getLastScene() >= numEscena){
							scene.addChar(c.getNumber(), c.getColor(), c.getName(), false);
						}
					}
				});
			}

			_scenes.push(scene);
			width = width + scene.getSize();
			_numEscenas++;

// console.log(scene.getNumEscena()+") "+scene.getNumVisibleChar());				

		});

		//Agrego los márgenes derecho e izquierdo
		width = width + (models.Scene._margenDerecho * 2);
	};

	var calcJumps = function(){
		_charJumps = [];

		angular.forEach(_chars, function(c){
			//Preparo el vector para cada personaje
			var v = [];
			var jumpSize = 0;
			for (var i=0; i<_scenes.length;i++){  //console.log(_scenes[i])
				if(i < c.getFirstScene()-1 || i>c.getLastScene()-1){
					v[i] = -1;
					//v[i] = v[i-1] + 1;
				}
				else if(_scenes[i].charVisible(c.getNumber())){
					v[i] = 0;
				}
			 	else if(_scenes[i-1].charVisible(c.getNumber())){
				 	//Calcular
				 	jumpSize = 0;					
				 	for (var j = i; !_scenes[j].charVisible(c.getNumber()); j++){
				 	 	jumpSize++;
				 	}
				 	v[i] = jumpSize;
				}
				else{
					// Esta es medio de un salto, cogemos el valor ya calculado
					v[i] = v[i-1];
					//v[i] = v[i-1] + 1;
				}
			}
			_charJumps.push(v);
		});
	};

	var updateScenePositions = function(scenes){
		for (var i=0; i<scenes.length; i++){
			scenes[i].updatePosition();
		}
	};

	var calcPointScenes = function(scenePoints, positions){
		//Calculo los puntos de la primera escena	
// console.log(scenePoints, positions);
		for(var i=0; i< _scenes.length; i++){
// console.log("_scenes[i].getSceneChars()",_scenes[i].getSceneChars());
			_scenes[i].calcCharPoints(scenePoints[i], positions[i]);
		}
	}

	var calcRepresentation = function(){
		_algoritmo = new algorithms.Iteractivo();

		_algoritmo.setOption(1);

		var individuo = _algoritmo.calcIndividuo(_chars.length, _scenes, _chars);

		//Realizo el cálculo inicial de posiciones
		calcPointScenes(individuo._scenePos, _algoritmo.calcPositions(individuo._initCharPos, individuo._scenePos, _scenes));
	};

	$scope.personajes = [];
	$scope.escenas = [];
	var x2js = new X2JS(); //objeto para convertir XML a JSON

	$scope.showWeights = false;
	$scope.showAxis = false;
	$scope.showSceneNumber = true;
	$scope.showSceneLength = false;
	$scope.showScenes = true;
	$scope.showCutLines = true;
	$scope.showActDivision = true;
	$scope.nombrePelicula = localStorage.getItem("sharedGuion").replace(".plt-sent.xml","");

	// mostrar importancia personaje
	$scope.$watch('showWeights', function() {
        _showWeights = $scope.showWeights;

        //modifico el ancho de la línea del personaje
        angular.forEach (_chars, function (char, i){
    	lineChar[char.getNumber()]
    		.transition()
    		.duration(500)
    		.ease("linear")
            .attr("stroke-width", function(){ 
                if (_showWeights == false){
                    return 2;
                }
                else{
                    return (parseInt(char.getNumScenes()) / _maxNumScenesPerChar * 10) + 1
                }
            });		    	                        
    	});
    });

	// mostrar ejes
	$scope.$watch('showAxis', function() {
        _showAxis = $scope.showAxis;
        if (g != null){
	        if (!_showAxis){
	        	g.selectAll(".domain")
		        	.transition()
		    		.duration(500)
		    		.ease("linear")
		    		.style('display', 'none');
	        }
	        else{
	        	g.selectAll(".domain")
	        		.transition()
		    		.duration(500)
		    		.ease("linear")
		    		.style('display', 'block');
	        }
		}
    });

    // mostrar numero de escenas
	$scope.$watch('showSceneNumber', function() {
        _showSceneNumber = $scope.showSceneNumber;
        if (g != null){
	        if (!_showSceneNumber){
	        	g.selectAll(".sceneNumber")
		        	.transition()
		    		.duration(300)
		    		.ease("linear")
		    		.style('font', '0px sans-serif');
	        }
	        else{
	        	g.selectAll(".sceneNumber")
	        		.transition()
		    		.duration(300)
		    		.ease("linear")
		    		.style('font', '10px sans-serif');
	        }
		}
    });

    // mostrar longitud de escenas
	$scope.$watch('showSceneLength', function() {
        _showSceneLength = $scope.showSceneLength;

        if (!_showSceneLength){
        /*	g.selectAll("ellipse")
	        	.transition()
	    		.duration(500)
	    		.ease("linear")
	    		.attr('rx', 35-5*2); //_hSize-_ellipseMargin*2	    	
        }
        else{
        	g.selectAll("ellipse")
        		.transition()
	    		.duration(500)
	    		.ease("linear")
	    		.attr('rx', 100);*/
        }
    });

    // mostrar escenas
    $scope.$watch('showScenes', function() {
        _showScenes = $scope.showScenes;
        if (g != null){
	        if (!_showScenes){
	        	g.selectAll(".escena-group")
		        	.transition()
		    		.duration(300)
		    		.ease("linear")
		    		.style('visibility', 'hidden');
	        }
	        else{
	        	g.selectAll(".escena-group")
	        		.transition()
		    		.duration(300)
		    		.ease("linear")
		    		.style('visibility', 'visible');
	        }
		}
    });

    // mostrar cortes
    $scope.$watch('showCutLines', function() {
        _cutLongLines = $scope.showCutLines;
        if (g != null){
	        drawLines();
		}
    });

    // mostrar división de actos
    $scope.$watch('showActDivision', function() {
        _showActDivision = $scope.showActDivision;
        if (g != null){
        /*	if (_showActDivision){
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
			else{
				angular.forEach(_scenes, function(scene){
					clearShadow();
				});				
			}*/
		}
    });

	var _nombreGuion;
	(function (global) {
	    _nombreGuion = localStorage.getItem("sharedGuion");
	}(window));
	
	var _directorioGuion = "xml_guiones/"+_nombreGuion;

	d3.xml(_directorioGuion, function(error, pelicula){
		if(error) {
			//throw error; 
			//alert(JSON.parse(error.responseText));
			alert ("El guión no tiene un formato adecuado para visualizarse.")
			return;
		}
	
		$scope.pelicula = pelicula;
		var personajes = d3.select(pelicula).selectAll("char")[0];	
		var escenas = d3.select(pelicula).selectAll("timeSlice")[0];
		var script = d3.select(pelicula).selectAll("script")[0];

		// Relleno el array de objetos Personaje
		var personajesXML = "<personajes>";
		angular.forEach(personajes, function(e){
			personajesXML += (new XMLSerializer()).serializeToString(e)
		});
		personajesXML += "</personajes>";

		$scope.personajes = x2js.xml_str2json(personajesXML);
		$scope.personajes = $scope.personajes.personajes.char;
		angular.forEach($scope.personajes, function(p){
			p._color = p._color.replace("0x","#");
		});
		
		if (debug) {console.log($scope.personajes)};

		// Relleno el array de objetos Escena
		var escenasXML = "<escenas>";
		angular.forEach(escenas, function(e){
			escenasXML += (new XMLSerializer()).serializeToString(e)
		});
		escenasXML += "</escenas>";

		
		$scope.escenas = x2js.xml_str2json(escenasXML);
		$scope.escenas = $scope.escenas.escenas.timeSlice;
		if (debug) {console.log($scope.escenas)};

		//Obtengo el numero de páginas en caso de que haya, si no pongo por defecto el número de escenas
		_numPagsScript = script[0].attributes[0] != null ?
			script[0].attributes[0].value :
			escenas.length;

		//Obtengo los personajes
		createCharacters($scope.personajes);

		//Calculo el nº de escenas en las que aparece el personaje con más escenas
		calcMaxSceneInChars();

		//Incluyo la línea de los personajes		
		_lines = [];
		for(var i=0; i<_chars.length; i++){
			_lines[i] = new models.CharacterLine(_chars[i].getName(), _chars[i].getNumber());
		} 

		//Incluyo las escenas
		createScenes($scope.escenas);
		if (debug) {console.log(_scenes)};
		
		//Calculo los saltos desde cada punto
		calcJumps(); 
		if (debug) {console.log(_charJumps)}; 

		//Calculo las posiciones de las escenas
		updateScenePositions(this._scenes);

		calcRepresentation();

		drawRepresentation();

		$scope.$apply();
			
    });	

});

myApp.directive('chars', function(){
	function link(scope, el, attr){		
	}
	return{
		link: link,
		restrict: 'E',
		scope:{personajes:'='},
		templateUrl: 'layout/chars.htm',
		replace:false

	};
});

myApp.directive('vis', function(){
	function link(scope, el, attr){		
	}

	return{
		link: link,
		restrict: 'E',
		scope:{escenas:'='},
		templateUrl: 'layout/vis.htm',
		replace:false

	};
});