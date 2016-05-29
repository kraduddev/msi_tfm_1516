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
			valueArray[i] = chars[i].getNumScenes();
		}
// console.log(numChars); 
// console.log(charArray); 
		for (var i=1; i<numChars; i++){
			valueToInsert = valueArray[i];
			valueToInsert2 = charArray[i];
			holePos = i;

// console.log("charArray["+i+"]: "+ charArray[i]);
// console.log("valueToInsert2: "+ valueToInsert2);

// console.log(i+") holePos("+holePos+"), valueToInsert("+valueToInsert+"), valueArray[holePos-1]("+valueArray[holePos-1]+"), charArray[holePos-1]("+charArray[holePos-1]+")");

			while(holePos > 0 && valueToInsert > valueArray[holePos -1]){
				valueArray[holePos] = valueArray[holePos-1];
				charArray[holePos] = charArray[holePos-1];

// console.log("Dentro del while "+i+") holePos("+holePos+"), valueToInsert("+valueToInsert+"), valueArray[holePos-1]("+valueArray[holePos-1]+"), charArray[holePos-1]("+charArray[holePos-1]+")");					
				holePos = holePos - 1;			
			}
			valueArray[holePos] = valueToInsert;
			charArray[holePos] = valueToInsert2;
// console.log("charArray["+i+"]: "+ charArray[i]);
// console.log("valueArray["+i+"]: "+ valueArray[i]);			
		}

		// Obtengo el punto medio inicial
		mid = numChars%2 == 0 ? numChars/2-1 : numChars/2;
		inf = mid+1;
		sup = mid-1;
// console.log("mid("+mid+"), inf("+inf+"), sup("+sup+")");
		//Primer personaje
		result[mid] = charArray[0];
// console.log("result[mid]: "+result[mid]);		
		//Resto de personajes
		for(var i=1; i<numChars;i++){
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
// console.log(result);
// console.log(this.invertVector(result));
		//Aqui tengo los chars ordenados
		return this.invertVector(result);
	}

	this.invertVector = function (v){
		var result = new Array(); 

		for (var i in v){
			result[v[i]] = parseInt(i); 
		}
		return result;
	}

	this.calcPositions = function (initCharPos, scenePos, scenes){
		
 // console.log(initCharPos,scenePos,scenes);

		var positions = new Array(scenePos.length);
		var prevPos = initCharPos;
		var numChars;				
		
// console.log("positions.length",positions.length);
		for(var k=0; k< scenePos.length; k++){
			//Calculo la posición de cada escena
			numChars = scenes[k].getNumVisibleChar();
			var posChar = new Array(prevPos.length);
			var enEscena = new Array(numChars);
			var noEscena = new Array(prevPos.length - numChars);		
			var newPos = new Array(prevPos.length);			
			var scenePos_ = scenePos[k];
// console.log(k,prevPos);
			//Creo el vector para traducir posiciones a personajes
			// for (i=0; i<prevPos.length; i++){
			// 	posChar[prevPos[i]] = i;
			// 	// posChar[5] contiene el personaje que está en la pos 5
			// }
			for (i in prevPos){
				posChar[prevPos[i]] = parseInt(i);
				// posChar[5] contiene el personaje que está en la pos 5
			}

			var charsObtained = 0;

// console.log("prevPos", prevPos);
// console.log("posChar", posChar);
			//Busco los visibles ordenadamente	
			var i=0;
			while (charsObtained < enEscena.length){			
				if(scenes[k].charVisible(posChar[i])){
					//Estamos ante un personaje de la escena
					enEscena[charsObtained] = parseInt(posChar[i]);
					charsObtained++;
 // console.log(scenes[k].getNumEscena(), posChar[i],scenes[k].charVisible(posChar[i]));						
				}
				 i++;
			}

			charsObtained = 0;
			i=0;
			while(charsObtained < (prevPos.length - numChars)){
				if(!scenes[k].charVisible(posChar[i])){
					//Estamos ante un personaje de fuera de la escena
					noEscena[charsObtained] = parseInt(posChar[i]);
					charsObtained++;
				}
				i++;
			}

			//Creo un array con los personajes ordenados
			var iNoEscena = 0;
			var iEnEscena = 0;

// console.log("scenePos_", scenePos_);	
// console.log("prevPos.length",prevPos.length);
			for (var i=0; i<prevPos.length; i++){				
// console.log("i",i,"scenePos_",scenePos_,"numChars",numChars);				
				if(i<scenePos_ || i>=scenePos_+numChars){									
					newPos[noEscena[iNoEscena]] = parseInt(i);			
					iNoEscena++;
				}
				else{
					newPos[enEscena[iEnEscena]] = parseInt(i);				
					iEnEscena++;
				}
			}
// console.log("enEscena", enEscena);
// console.log("noEscena", noEscena);
// console.log("newPos", newPos);			

			prevPos = newPos;
			positions[k] = newPos;
// console.log("k",k,"positions[k]",positions[k]);			

		}
// console.log(positions);
		return positions;
	}

	this.setOption = function (value){
		return;
	}

	this.calcIndividuo = function (numChars, scenes, chars){

		var bestPos;
		var numCharsScene;
		var positions = new Array();
		var prevPos = new Array(numChars);

		var newPos = new Array(numChars);
		var posChar = new Array(numChars);
		var minCruces;
		var cruces = 0;
		var arr2 = [];

		arr2 = this.calcInitialPosition(numChars, chars);
 // console.log(arr2);
 
		//Inicializo la posición inicial
		for(i=0; i<numChars;i++){			
			prevPos[i] = arr2[i];
		}

// console.log(arr2);
 // console.log(prevPos);		

		var prevScene = scenes[0];	
		angular.forEach(scenes, function(scene, index){
// console.log(scene.getNumVisibleChar());				
			//Calculo el nº de personajes en la elipse, para posicionarla correctamente
			numCharsScene = scene.getNumVisibleChar(); 
// console.log(numCharsScene);			
			bestPos = Math.round(Math.random()*(numChars - numCharsScene));
			minCruces = MAX_VALUE;	

			//Obtengo la ordenación de los personajes
// console.log(prevPos);	
			for(var j=0; j<prevPos.length; j++){		
// console.log(index+", "+j+", "+prevPos.length+" -> "+prevPos[j]);					
				posChar[prevPos[j]] = j;
// console.log(j+", "+prevPos[j]+", "+posChar[prevPos[j]]);
			}
// console.log(posChar);			
// console.log(prevPos);
			//Calculo los cruces con cada posibilidad
			for(var j=0;j<(numChars - numCharsScene); j++){
				cruces = 0;
				var k =0;
				angular.forEach(posChar, function(char){
//console.log("prevPos[char]: "+prevPos[char]);	
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
			var enEscena = new Array(numCharsScene);
			var noEscena = new Array(numChars - numCharsScene);
			
			// Busco los de la escena ordenadamente
			var charsObtained = 0;
			var i = 0;
// console.log("charsObtained:"+charsObtained+", numCharsScene:"+numCharsScene)			
			while(charsObtained < numCharsScene)
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
//console.log(cruces);					
					iEnEscena++;
				}
			}
// console.log(prevPos);			
			prevPos = newPos; 
			positions.push(bestPos);
			prevScene = scene;		
		
		});

		var individuo = new algorithms.Individuo(arr2, positions); 
// console.log(arr2);
// console.log(positions);
		return individuo;
	}
}