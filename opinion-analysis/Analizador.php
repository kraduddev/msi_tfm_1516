<html>
<head>
<title>Analizador de sentimientos</title>
</head>
<body>
<?php

	include './opinion-analysis/bayesian-opinion-mining.php';

  	copy($_FILES['archivo']['tmp_name'],$_FILES['archivo']['name']);
  	echo "El fichero ha sido cargado en el servidor correctamente.<br>";
  	$nom=$_FILES['archivo']['name'];
  	//echo "<img src=\"$nom\">";
  	echo $nom;

  	echo '<a href="index.html">Generar visualización</a>';


	$pelicula = new SimpleXMLElement($nom, null, true);


	//PERSONAJES 
	 $personajes = [];
	 foreach ($pelicula->chars->char as $char):
        array_push($personajes, $char->attributes()['name']);
    endforeach;

	 //print_r($personajes);

	$op = new Opinion();
	$op->addToIndex('opinion-analysis/opinion/rt-polaritydata/rt-polarity.neg', 'neg');
	$op->addToIndex('opinion-analysis/opinion/rt-polaritydata/rt-polarity.pos', 'pos');

	$valorSentimiento = 0;

	// --> ESCENAS
	$escenas = [];
	$contEscenas=1;
	$contAcciones = 1;

	//recorremos las acciones de las escenas y añadimos un nuevo atributo por cada una con el valor devuelto por el analizador
	foreach ($pelicula->vis->timeSlice as $timeSlice):
	 	//echo "Escena $contEscenas \n";
	 	foreach ($timeSlice->pointGroup->accion as $accion):
	 		//echo "Acción $contAcciones \n". $accion->attributes()['descripcion'];
	 		$doc = $accion->attributes()['descripcion'];
	 		$sentences = explode(".", $doc);

	 		$score = array('pos' => 0, 'neg' => 0);
			foreach($sentences as $sentence) {
			        if(strlen(trim($sentence))) {
			                $class = $op->classify($sentence);
			      //          echo "Classifying: \"" . trim($sentence) . "\" as " . key($class) . "\n"; //var_dump($class);
			                $score[$class]++;

			                if (key($class) == 'pos'){
			                	$valorSentimiento++;
			                }else{
			                	$valorSentimiento--;
			                } 

			        }
			  //      echo "</br>";
			}  
			//var_dump($score); 
			
			// se añade el sentimiento global de la accion
			if ($valorSentimiento > 0)
			{
				$accion->addAttribute('sentimiento','positivo');
				$accion->addAttribute('color-sentimiento','green');	
			}
			else if ($valorSentimiento < 0){
				$accion->addAttribute('sentimiento','negativo');
				$accion->addAttribute('color-sentimiento','red');
			}
			else{
				$accion->addAttribute('sentimiento','neutro');
				$accion->addAttribute('color-sentimiento','blue');
			}

			$valorSentimiento = 0; 

	 		$contAcciones++;
	 	endforeach;
	 	$contEscenas++;
	 	$contAcciones=1;
	endforeach;



	// --> DIALOGOS
	$contEscenas=1;
	$contAcciones = 1;
	$contDialogos = 1;

	//recorremos loss diálogos de las escenas y añadimos un nuevo atributo por cada una con el valor devuelto por el analizador
	foreach ($pelicula->vis->timeSlice as $timeSlice):
	 	//echo "Escena $contEscenas \n";
	 	foreach ($timeSlice->pointGroup->accion as $accion):
	 		
	 		foreach ($accion->charDialog as $charDialog):
	 			$doc = $charDialog->attributes()['texto'];
		 		$sentences = explode(".", $doc);

		 		$score = array('pos' => 0, 'neg' => 0);
				foreach($sentences as $sentence) {
				        if(strlen(trim($sentence))) {
				                $class = $op->classify($sentence);
				      //          echo "Classifying: \"" . trim($sentence) . "\" as " . key($class) . "\n"; //var_dump($class);
				                $score[$class]++;

				                if (key($class) == 'pos'){
				                	$valorSentimiento++;
				                }else{
				                	$valorSentimiento--;
				                } 

				        }
				  //      echo "</br>";
				}  

				
				// se añade el sentimiento global del diálogo
				if ($valorSentimiento > 0)
				{
					$charDialog->addAttribute('sentimiento','positivo');	
					$charDialog->addAttribute('color-sentimiento','green');	
				}
				else if ($valorSentimiento < 0){
					$charDialog->addAttribute('sentimiento','negativo');
					$charDialog->addAttribute('color-sentimiento','red');	
				}
				else{
					$charDialog->addAttribute('sentimiento','neutro');
					$charDialog->addAttribute('olor-sentimiento','blue');
				}

				$valorSentimiento = 0; 
				$contDialogos++;
	 		endforeach;

	 		$contAcciones++;
	 	endforeach;
	 	$contEscenas++;
	 	$contAcciones=1;
	endforeach;


// --> ASIGNAR SENTIMIENTO AL PERSONAJE DE LA ACCION 

	foreach ($pelicula->vis->timeSlice as $timeSlice): //por cada escena
		foreach($timeSlice->pointGroup->charPoint as $charPoint): // por cada personaje de la escena
			$sentimientoParcial = 0;
			$tPersonaje = $charPoint->attributes()['char'];
			foreach ($timeSlice->pointGroup->accion as $accion): // por cada accion
	 			foreach ($accion->charDialog as $charDialog): // por cada dialogo
	 				$tPersonajeDialogo = $charDialog->attributes()['char'];
	 				if (strcmp($tPersonaje, $tPersonajeDialogo) == 0){ // si el personaje del dialogo es el mismo que el que estoy recorriendo
	 					$tSentimiento = $charDialog->attributes()['sentimiento'];//acutalizo el sentimiento general del personaje con el que transmite la escena
	 					if(strcmp($tSentimiento, 'positivo')== 0){
	 						$sentimientoParcial++;
	 					}
	 					else if (strcmp($tSentimiento, 'negativo')== 0){
	 						$sentimientoParcial--;
	 					}
	 				}
	 			endforeach;
	 		endforeach;
	 		if ($sentimientoParcial > 0)
			{
				$charPoint->addAttribute('sentimiento','positivo');	
				$charPoint->addAttribute('color-sentimiento','green');	
			}
			else if ($sentimientoParcial < 0){
				$charPoint->addAttribute('sentimiento','negativo');
				$charPoint->addAttribute('color-sentimiento','red');
			}
			else{
				$charPoint->addAttribute('sentimiento','neutro');
				$charPoint->addAttribute('color-sentimiento','blue');
			}
		endforeach;
	endforeach;


// --> AÑADIR SENTIMIENTO AL LISTADO DE PERSONAJES

	foreach($pelicula->chars->char as $char): // por cada personaje del listado
		$sentimientoParcial = 0;
		$tPersonaje = $char->attributes()['name'];
		foreach ($pelicula->vis->timeSlice as $timeSlice): //por cada escena
	 		foreach ($timeSlice->pointGroup->accion as $accion): // por cada accion
	 			foreach ($accion->charDialog as $charDialog): // por cada dialogo
	 				$tPersonajeDialogo = $charDialog->attributes()['char'];
	 				if (strcmp($tPersonaje, $tPersonajeDialogo) == 0){ // si el personaje del dialogo es el mismo que el que estoy recorriendo
	 					$tSentimiento = $charDialog->attributes()['sentimiento'];//acutalizo el sentimiento general del personaje con el que transmite la escena
	 					if(strcmp($tSentimiento, 'positivo')== 0){
	 						$sentimientoParcial++;
	 					}
	 					else if (strcmp($tSentimiento, 'negativo')== 0){
	 						$sentimientoParcial--;
	 					}
	 				}
	 			endforeach;
	 		endforeach;	
	 	endforeach;
	 	if ($sentimientoParcial > 0)
		{
			$char->addAttribute('sentimiento','positivo');	
			$char->addAttribute('color-sentimiento','green');
		}
		else if ($sentimientoParcial < 0){
			$char->addAttribute('sentimiento','negativo');
			$char->addAttribute('color-sentimiento','red');
		}
		else{
			$char->addAttribute('sentimiento','neutro');
			$char->addAttribute('color-sentimiento','blue');
		}
	endforeach;

// --> AÑADIR SENTIMIENTO A CADA ESCENA
	foreach ($pelicula->vis->timeSlice as $timeSlice): //por cada escena
		$sentimientoParcial = 0;
		foreach ($timeSlice->pointGroup->charPoint as $charPoint): //por cada personaje
			$tSentimiento = $charPoint->attributes()['sentimiento'];
			if(strcmp($tSentimiento, 'positivo') == 0){
				$sentimientoParcial++;
			}
			else if (strcmp($tSentimiento, 'negativo') == 0){
				$sentimientoParcial--;
			}
		endforeach;
		foreach ($timeSlice->pointGroup->accion as $accion): //por cada acción
			$tSentimiento = $accion->attributes()['sentimiento'];
			if(strcmp($tSentimiento, 'positivo')== 0){
				$sentimientoParcial++;
			}
			else if (strcmp($tSentimiento, 'negativo')== 0){
				$sentimientoParcial--;
			}
		endforeach;
		if ($sentimientoParcial > 0)
		{
			$timeSlice->addAttribute('sentimiento','positivo');	
			$timeSlice->addAttribute('color-sentimiento','green');
		}
		else if ($sentimientoParcial < 0){
			$timeSlice->addAttribute('sentimiento','negativo');
			$timeSlice->addAttribute('color-sentimiento','red');
		}
		else{
			$timeSlice->addAttribute('sentimiento','neutro');
			$timeSlice->addAttribute('color-sentimiento','blue');
		}
	endforeach;

	// --> Se genera el nuevo XML
	$nombreFichero = explode(".xml", $nom);
	$nuevoNombreFichero = $nombreFichero[0]."-sent.xml";
	$pelicula->asXML($nuevoNombreFichero);
?>


</body>
</html>
</html>
