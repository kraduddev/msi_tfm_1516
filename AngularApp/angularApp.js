var myApp = angular.module('myApp', []);

myApp.controller('MainCtrl', function($scope, $window, $rootScope){

	// reaccion cuando se pincha en una escena
	$(document).ready(function(){

		$(document).on("click",'ellipse',function(e) {		
		    $('#detalle-escena').lightbox_me({
		        centered: true, 
		        onLoad: function() { 
		            $('#detalle-escena').find('input:first').focus()
		            }
		        });
		    e.preventDefault();
		    addDetalleEscena($(this).attr('class'));
		});

	});

	// reaccion cuando se pincha en una línea de personaje
	$(document).ready(function(){

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
			$scope.charsEnEscena = [];
			angular.forEach(_scenes[numEscena-1].getSceneChars(), function(c){
				if (c != null) $scope.charsEnEscena.push(c);
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
			angular.forEach(escena.pointGroup.accion, function(accion){
				text = accion._descripcion; 
				if (text != null){
					text.length % 60 == 0 
						? _scenesTotalLength += text.length / 60 
						: _scenesTotalLength += text.length / 40 + 1;
					_scenesTotalLength += 2; //Sumo el nombre del char				
				}
			});
		});

		width = 0 ;
		_numEscenas = 0;
		var currentLength = 0;
		angular.forEach(escenas, function(escena){
			var sceneLength = 0;
			sceneLength += 2;
			angular.forEach(escena.pointGroup.accion, function(accion){
				if (text != null){
					text = accion._descripcion;
					text.length % 60 == 0
						? sceneLength += text.length / 60
						: sceneLength += text.length / 60 + 1;
					sceneLength += 1;

					angular.forEach(accion.charDialog, function(dialog){
						text = dialog._texto;
						if (text != null){
							text.length % 40 == 0
								? sceneLength += text.length / 40
								: sceneLength += text.length / 40 + 1;
							sceneLength += 2; //Sumo nombre del char
						}
					});
				}
			});

			if (_sceneMinLength > sceneLength){
				_sceneMinLength = sceneLength;
			}

			if (_sceneMaxLength > sceneLength){
				_sceneMaxLength = sceneLength;
			}

			scene = new models.Scene(this, escena._step, _scenes, escena.pointGroup._name, sceneLength, currentLength/_scenesTotalLength * numPagsScript, null, escena._sentimiento, escena._colorSentimiento);

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
// console.log(scene.getNumEscena()+" "+listChars[c.getName()]);			
				if (listChars[c.getName()]){
					scene.addChar(c.getNumber(), c.getColor(), c.getName(), true, c.getSent(), c.getColorSent());
				}
				else{
					var numEscena = scene.getNumEscena();
// console.log(c.getName(), c.getFirstScene(), c.getLastScene(), numEscena)
					if(c.getFirstScene() <= numEscena && c.getLastScene() >= numEscena){
						scene.addChar(c.getNumber(), c.getColor(), c.getName(), false);
					}
				}
			});

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
				}
				else if(_scenes[i].charVisible(c.getNumber())){
					v[i] = 0;
				}
				// else if(i>0 && _scenes[i-1].charVisible(c.getNumber())){
				// 	//Calcular
				// 	jumpSize = 0;
					
				// 	var j = i;				
				// 	while (!_scenes[j].charVisible(c.getNumber())){
				// 		jumpSize++;
				// 		j++;
				// 	}

				// 	// for (var j = i; !_scenes[j].charVisible(c.getNumber()); j++){
				// 	// 	jumpSize++;
				// 	// }
				// 	v[i] = jumpSize;
				// }
				else{
					// Esta es medio de un salto, cogemos el valor ya calculado
					v[i] = v[i-1];
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

	d3.xml("xml_guiones/Rocky_corregido-min.plt-sent.xml", function(error, pelicula){
		if(error) {throw error;}
		
		$scope.pelicula = pelicula;
		var personajes = d3.select(pelicula).selectAll("char")[0];	
		var escenas = d3.select(pelicula).selectAll("timeSlice")[0];
		
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