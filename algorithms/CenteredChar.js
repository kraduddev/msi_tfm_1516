var algorithms = algorithms || {};

algorithms.CenteredChar = function (){

	var character = new Character("Name", "Color", "Number");
	var scene = new Scene("layoutPadre", "sceneNum", "scenes", "sceneName", "sceneLength", "currentPage", "lastScene");

	var _theChar = 0;

	this.calcInitialPosition = function (theChar, numChars, character){
		

		var charArray = [];
		var valueArray = [];
		var result = [];

		var valueToInsert = null;
		var charToInsert = null;
		var holePos = null;
		var thePosition = null;

		var aux = [];

		var sup = null;
		var inf = null;
		var mid = null;

		if(theChar >= chars.length){
			theChar = 0;
		}

		for(var i;i<numChars;i++){
			charArray[i] = chars[i].getNumber();
			valueArray[i] = chars[i].getNumScenes();
		}

		for (var i=0; i<numChars; i++){
			valueToInsert = valueArray[i];
			charToInsert = charArray[i];
			holePos = i;

			while(holePos > 0 && valueToInsert > valueArray[holePos-1]){
				valueArray[holePos] = valueArray[holePos-1];
				charArray[holePos] = charArray[holePos-1];
				holePos = holePos-1;
			}
			valueArray[holePos] = valueToInsert;
			charArray[holePos] = charToInsert;

			if(charToInsert == theChar){
				thePosition = holePos;
			}								
		}

		// Elimino el elemento central seleccionado del vector
		aux = charArray.splice(thePosition, 1); 

		// Lo inserto al principio para que ocupe la posición central
		charArray.splice(0,0,aux[0]);

		// Obtengo el punto inicial
		mid = numChars%2==0 ? numChars/2 - 1 : numChars/2;
		inf = mid+1;
		sup = mid-1;

		// Primer personaje
		result[mid] = charArray[0];
		// Resto de personajes
		for(var i=0; i<numChars; i++){
			if(i%2 != 0){
				result[inf] = charArray[i];
				inf++;
			}
			else{
				result[sup] = charArray[i];
				sup--;
			}
		}

		return invertVector(result);
	}

	var invertVector = function (v){
		var result = [];
		for (var i in v){
			result[v[i]] = i;
		}

		return result;
	}

	this.setOption = function (value){
		_theChar = value >=0 ? value : 0;
	}

	this.calcPositions = function (initCharPos, scenePos, scenes){
		var positions = [];
		var prevPos = initCharPos;
		var numChars = 0;

		//Calculo la posición central
		var mid = initCharPos.length%2==0 ? initCharPos.length/2-1 : initCharPos.length/2;

		for (var k=0; k<positions.length; k++){
			numChars = scenes[k].getNumVisibleChar();
			var posChar = [];
			var enEscena = [];
			var noEscena = [];
			var scenePos_ = scenePos[k];
			var newPos = [];

			// Creo el vector para traducir posiciones a personajes
			for (var i=0; i<prevPos.length; i++){
				posChar[prevPos[i]] = i; //posChar[0] contiene el personaje que está en la pos 0					
			}

			// Busco los visibles ordenadamente
			var charsObtained = 0;
			var i = 0;
			while(charsObtained < enEscena.length){
				if(scenes[k].charVisible(posChar[i])){
					//Estamos ante un personaje de la escena
					enEscena[charsObtained] = posChar[i];
					charsObtained++;
				}
				i++;
			}

			charsObtained = 0;
			i = 0;
			while (charsObtained < noEscena.length){
				if(!scenes[k].charVisible(posChar[i])){
					//Estamos aunte un personaje de fuera de la escena
					noEscena[charsObtained] = posChar[i];
					charsObtained++;
				}
				i++;
			}

			//Creo un array con los personajes ordenados
			var iNoEscena = 0;
			var iEnEscena = 0;
			for(i=0; i<prevPos.length; i++){
				if(i<scenePos_ || i>scenePos_+numChars){
					newPos[noEscena[iNoEscena]] = i;
					iNoEscena++;
				}
				else{
					newPos[enEscena[iEnEscena]] = i;
					iEnEscena++;
				}
			}

			//Si el personaje central no está en la escena ni en la pos central, se corrige
			if(newPos[_theChar] != mid){
				//Busco el char que está en mid
				for (i=0; i<newPos.length; i++){
					if(newPos == mid){
						newPos[i] = newPos[_theChar];
						newPos[_theChar] = mid;
					}
				}
			}

			prevPos = newPos;
			positions[k] = newPos;
		}

		return positions;

	}

	this.calcIndividuo = function(numChars, scenes, chars){
		var initPos = calcInitialPosition(_theChar, numChars, chars);

		//Inicializo el vector de posiciones previas con las posiciones iniciales
		var prevPos = [];
		var newPos = [];
		var i = 0;
		for (i=0; i<prevPos.length; i++){
			prevPos[i] = initPos[i];
		}

		//Vector de posiciones de escena
		var positions = [];

		var posChar = [];

		//Otras variables necesarias
		var bestPos = null;
		var numCharsScene = null;
		var minCruces = null;
		var cruces = null;
		var posInScene = null;
		var midPosition = numChars%2==0 ? numChars/2+1 : numChars/2;

		// Para cada escena, se calcula la mejor posición
		// se tiene en cuenta la restricciones del personaje central
		scenes.forEach(function(scene){
			// Calculo el num de personajes en la elipse, para posicionarlo correctamente
			numCharsScene = scene.getNumVisibleChar();
			bestPos = Math.round(Math.random() * (numChars - numCharsScene));
			minCruces = Number.MAX_VALUE;
			var prevScene = scenes[0];

			// Obtengo la ordenación de los personajes
			var j = 0;
			for (j=0; j<prevPos.length;j++){
				posChar[prevPos[j]] = j; // posChar[0] contiene el personaje que está en la pos 0
			}

			//Calculo los cruces con cada posibilidad
			if(scene.charVisible(_theChar)){
				//El personaje central forma parte de la escena, así que 
				//se calcula la posición del personaje en los puntos de escena
				posInScene = 0;
				posChar.forEach(function(aChar){
					if(scene.charVisible(aChar)){
						if(aChar == _theChar){
							break; 	//salgo y la pos del char en la escena se encuentra 
									//en posInScene(0-based)
						}
						posInScene++;
					}
				});
				bestPos = midPosition - posInScene;
				bestPos = bestPos;
			}
			else{
				//El personaje central no forma parte de la escena, así que
				//se evalúan todas las posibles posiciones en las que la escena
				//no atraviese la posición central
				for(j=0; j<numChars - numCharsScene;j++){
					if(j<(midPosition-(numCharsScene-1)) || j>midPosition){
						//Sólo se tienen en cuenta las que no cruzan las posición central
						cruces = 0;
						var k= 0;
						posChar.forEach(function(char){
							if(scene.charVisible(char)){
								//Está en la escena
								if(prevScene.charInAux(char) || prevScene.charVisible(char)){
									//Este char no comienza aquí por lo que se le da más peso
									cruces = cruces + Math.abs(prevPos[char]-(j+k))*100;
								}
								else{
									cruces = cruces + Math.abs(prevPos[char]-(j+k));
								}
								k++;
							}
						});

						if(cruces < minCruces){
							minCruces = cruces;
							bestPos = j;
						}
					}
				}
			}

			// En este punto ya tengo bestPos con la posición de la escena
			// Calcular las nuevas posiciones
			var enEscena = [];
			var noEscena = [];

			// Busco los de la escena ordenadamente
			var charsObtained = 0;
			i=0;
			while(charsObtained < enEscena.length){
				if(scene.charVisible(posChar[i])){
					//Estamos ante un personaje visible
					enEscena[charsObtained] = posChar[i];
					charsObtained++;
				}
				i++;
			}

			// Ahora los de fuera de la escena
			charsObtained = 0;
			i=0; 
			while(charsObtained < noEscena.length){
				if(!scene.charVisible(posChar[i])){
					// Estamos ante un personaje de fuera de la escena
					noEscena[charsObtained] = posChar[i];
					charsObtained++;
				}
				i++;
			}

			var iNoEscena = 0;
			var iEnEscena = 0;
			for(i=0; i<prevPos.length; i++){
				if(i<bestPos || i>= bestPos+numCharsScene){
					newPos[noEscena[iNoEscena]] = i;
					//ordenacion[i] = noEscena[iNoEscena];
					iNoEscena++;
				}
				else{
					newPos[enEscena[iEnEscena]] = i;
					//ordenacion[i] = enEscena[iEnEscena];
					cruces = cruces + Math.abs(prevPos[enEscena[iEnEscena]]-i) * Math.abs(revPos[enEscena[iEnEscena]]-i);
					iEnEscena++;
				}
			}

			prevPos = newPos;
			positions.push(bestPos);
			prevScene = scene;

		});

		var individuo = new Individuo();
		individuo.create(initPos, positions);

		return individuo;
	}
}
