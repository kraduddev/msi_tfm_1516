var algorithms = algorithms || {};

algorithms.Iteractivo = function(){

	this.calcInitialPosition = function (numChars, chars){
		var charArray = [];
		var valueArray = [];
		var result = [];

		var valueToInsert;
		var valueToInsert2;
		var holePos;

		var sup;
		var inf;
		var mid;

		for (var i=0; i<numChars; i++){
			charArray[i] = chars[i].getNumber();
		}

		for (var i=0; i<numChars; i++){
			valueToInsert = valueArray[i];
			valueToInsert2 = charArray[i];
			holePos = 1;

			while(holePos > 0 && valueToInsert > valueArray[holePos -1]){
				valueArray[holePos] = valueArray[holePos-1];
				charArray[holePos] = charArray[holePos-1];
				holePos = holePos - 1;
			}

			valueArray[holePos] = valueToInsert;
			charArray[holePos] = valueToInsert2;
		}

		// Obtengo el punto medio inicial
		mid = numChars%2 == 0 ? numChars/2-1 : numChars/2;
		inf = mid+1;
		sup = mid-1;

		//Primer personaje
		result[mid] = charArray[0];
		//Resto de personajes
		for(var i=0; i<numChars;i++){
			if(i%2!=0){
				//Parte inferior
				result[inf] = charArray[i];
				inf++;
			}
			else{
				//Parte superior
				result[sup] = charArray[i];
				sup--;
			}
		}

		//Aqui tengo los chars ordenados
		return this.invertVector(result);
	}

	this.invertVector = function (v){
		var result = new Array(); 

		for (var i in v){
			result[v[i]] = i; 
		}
		return result;
	}

	this.calcPositions = function (initCharPos, scenePos, scenes){
		var positions = [];
		var prevPos = initCharPos;
		var numChars;

		var posChar = [];
		var enEscena = [];
		var noEscena = [];
		var scenePos_;
		var newPos = [];

		var charsObtained = 0;

		var iNoEscena = 0;
		var iEnEscena = 0;

		for(var k=0; scenePos.length; k++){
			//Calculo la posición de cada escena
			numChars = scenes[k].getNumVisibleChar();
			scenePos_ = scenePos[k];

			//Creo el vector para traducir posiciones a personajes
			for (i=0; i<prevPos.length; i++){
				posChar[prevPos[i]] = i;
				// posChar[5] contiene el personaje que está en la pos 5
			}

			//Busco los visibles ordenadamente
			while (charsObtained < numChars.length){
				if(scenes[k].charVisible(posChar[i])){
					//Estamos ante un personaje de la escena
					enEscena[charsObtained] = posChar[i];
					charsObtained++;
				}
				i++;
			}

			charsObtained = 0;
			while(charsObtained < (prevPos.length - numChars)){
				if(!scenes[k].charVisible(posChar[i])){
					//Estamos ante un personaje de fuera de la escena
					noEscena[charsObtained] = posChar[i];
					charsObtained++;
				}
				i++;
			}

			//Creo un array con los personajes ordenados
			for (var i=0; i<prevPos.length; i++){
				if(i<scenePos_ || i>=scenePos_+numChars){
					newPos[noEscena[iEnEscena]] = i;
					iNoEscena++;
				}
				else{
					newPos[enEscena[iEnEscena]] = i;
					iEnEscena++;
				}
			}

			prevPos = newPos;
			positions[k] = newPos;

		}

		return positions;
	}

	this.setOption = function (value){
		return;
	}

	this.calcIndividuo = function (numChars, scenes, chars){

		var bestPos;
		var numCharsScene;
		var positions = [];
		var prevPos = [];

		var newPos = [];
		var posChar = [];
		var minCruces;
		var cruces = 0;

		var arr2 = this.calcInitialPosition(numChars, chars);

		//Inicializo la posición inicial
		for(var i in arr2){
			prevPos[i] = arr2[i];
		}

		var prevScene = scenes[0];
		angular.forEach(scenes, function(scene){
			//Calculo el nº de personajes en la elipse, para posicionarla correctamente
			numCharsScene = scene.getNumVisibleChar(); 
			bestPos = Math.round(Math.random()*(numChars - numCharsScene));
			minCruces = MAX_VALUE;

			//Obtengo la ordenación de los personajes
//console.log(prevPos);	
			var i = 0;
			for(var j in prevPos){				
				posChar[prevPos[j]] = i;
				i++; 
//console.log(prevPos[j]); console.log(j);console.log("------")
			}
//console.log(prevPos);
			//Calculo los cruces con cada posibilidad
			for(j=0;j<numChars - numCharsScene; j++){
				cruces = 0;
				var k =0;
				angular.forEach(posChar, function(char){
console.log("prevPos[char]: "+prevPos[char]);	
					if(scene.charVisible(char)){
					
						//Está en la escena
						if(prevScene.charInAux(char) || prevScene.charVisible(char)){
							//Este char no comienza aquí, por lo que se le da más peso
							cruces = cruces + Math.abs(prevPos[char]-(j+k))*100;
						}
						else{
							cruces = cruces + Math.abs(prevPos[char]-(j+k));
						}
						k++;
					}
				});

				if(cruces < minCruces)
				{
					minCruces = cruces;
					bestPos = j;
				}
//console.log("cruces: "+cruces);				
			}

			// Calcular las nuevas posiciones
			var enEscena = [];
			var noEscena = [];
			
			// Busco los de la escena ordenadamente
			var charsObtained = 0;
			while(charsObtained < numCharsScene.length)
			{
				if(scene.charVisible(posChar[i]))
				{ // Estamos ante un personaje visible
					enEscena[charsObtained] = posChar[i];
					charsObtained++;						
				}
				i++;
			}
// console.log(posChar);
// console.log(charsObtained);
			// Ahora los de fuera de la escena
			charsObtained = 0;
			i=0;
			while(charsObtained < (numChars - numCharsScene))
			{
				if(!scene.charVisible(posChar[i]))
				{ // Estamos ante un personaje de fuera de la escena
					noEscena[charsObtained] = posChar[i];
					charsObtained++;						
				}
				i++;
			}
			
			var iNoEscena = 0;
			var iEnEscena = 0; 
// console.log("prevPos.length: "+Object.keys(prevPos).length)
			for(i=0;i<Object.keys(prevPos).length;i++)
			{
				if(i<bestPos || i>=bestPos+numCharsScene)
				{
					newPos[noEscena[iNoEscena]] = i
					iNoEscena++;
				}
				else
				{
					newPos[enEscena[iEnEscena]] = i;
					cruces = cruces + Math.abs(prevPos[enEscena[iEnEscena]]-i)*Math.abs(prevPos[enEscena[iEnEscena]]-i);
console.log(cruces);					
					iEnEscena++;
				}
			}
			
			prevPos = newPos; 
			positions.push(bestPos);
			prevScene = scene;		
		
		});

		var individuo = new algorithms.Individuo(); 
// console.log(arr2);
// console.log(positions);
		individuo.create(arr2, positions);

		return individuo;
	}
}