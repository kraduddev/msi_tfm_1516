<html>
<head>
<title>Analizador de sentimientos</title>
</head>
<body>
<?php
	
	include './bayesian-opinion-mining.php';
	include './Util.php';

	error_reporting(E_ERROR);

  	copy($_FILES['archivo']['tmp_name'],$_FILES['archivo']['name']);
  	echo "El fichero ha sido cargado en el servidor correctamente.<br>";
  	$nom=$_FILES['archivo']['name'];
  	//echo "<img src=\"$nom\">";
  	echo "<div id='guion'><span>".$nom."</span></div>";

  	//echo '<a href="../guion-vis.html">Generar visualización</a>';
  	echo "<input type='submit' id='loadVis' value='Cargar seleccionado'>";


	$pelicula = new SimpleXMLElement($nom, null, true);

	// colores base
	$colorNegativo = "#FF0000"; 
	$colorPositivo = "#00FF00";
	$util = new Util();


	//PERSONAJES 
	 $personajes = [];
	 foreach ($pelicula->chars->char as $char):
        array_push($personajes, $char->attributes()['name']);
    endforeach;

	 //print_r($personajes);

	$op = new Opinion();
	$op->addToIndex('opinion/rt-polaritydata/rt-polarity.neg', 'neg');
	$op->addToIndex('opinion/rt-polaritydata/rt-polarity.pos', 'pos');

	$valorSentimiento = 0;

	// --> ESCENAS
	$escenas = [];
	$contEscenas=1;
	$contAcciones = 1;

	// Aañado las 2 variables para quedarme con el coeficiente de sentimiento
	$contadorParcial = 0;
	$valorSentimientoParcial = 0.0;

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
			        		$contadorParcial++;
			                $class = $op->classify($sentence);
			              //  echo "Classifying: \"" . trim($sentence) . "\" as " . key($class) . "\n"; var_dump($class);
			                $score[$class]++;

			                $valorSentimientoParcial += ($class['pos'] - $class['neg']);

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
			$accion->addAttribute('valorSentimiento', $valorSentimientoParcial);	
			$color = $util->hex_color_mod($colorPositivo, $valorSentimientoParcial);
			$accion->addAttribute('colorSentimiento',$color);
			if ($valorSentimientoParcial > 0) //if ($valorSentimiento > 0)
			{
				$accion->addAttribute('sentimiento','positivo');
			//	$accion->addAttribute('colorSentimiento','green');					
							
			}
			else if ($valorSentimientoParcial < 0){ //else if ($valorSentimiento < 0){
				$accion->addAttribute('sentimiento','negativo');
			//	$accion->addAttribute('colorSentimiento','red');

			}
			/*else{
				$accion->addAttribute('sentimiento','neutro');
				$accion->addAttribute('colorSentimiento','blue');
var_dump("por aqui no debería entrar");
			}*/

			$valorSentimiento = 0; 
			$contadorParcial = 0;
	 		$valorSentimientoParcial = 0.0;

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

				                $valorSentimientoParcial += ($class['pos'] - $class['neg']);

				                if (key($class) == 'pos'){
				                	$valorSentimiento++;
				                }else{
				                	$valorSentimiento--;
				                } 

				        }
				  //      echo "</br>";
				}  

				
				// se añade el sentimiento global del diálogo
				$charDialog->addAttribute('valorSentimiento', $valorSentimientoParcial);	
				$color = $util->hex_color_mod($colorPositivo, $valorSentimientoParcial);
				$charDialog->addAttribute('colorSentimiento',$color);	
				if ($valorSentimientoParcial > 0)
				{
					$charDialog->addAttribute('sentimiento','positivo');	
				//	$charDialog->addAttribute('colorSentimiento','green');	
				}
				else if ($valorSentimientoParcial < 0){
					$charDialog->addAttribute('sentimiento','negativo');
				//	$charDialog->addAttribute('colorSentimiento','red');	
				}
				/*else{
					$charDialog->addAttribute('sentimiento','neutro');
					$charDialog->addAttribute('olor-sentimiento','blue');
				}*/

				$valorSentimiento = 0;
				$contadorParcial = 0;
	 			$valorSentimientoParcial = 0.0; 
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
	 					$vSentimiento = $charDialog->attributes()['valorSentimiento'];
	 					$valorSentimientoParcial += sscanf($vSentimiento, "%f")[0];
	 					if(strcmp($tSentimiento, 'positivo')== 0){
	 						$sentimientoParcial++;
	 					}
	 					else if (strcmp($tSentimiento, 'negativo')== 0){
	 						$sentimientoParcial--;
	 					}
	 				}
	 			endforeach;
	 		endforeach;
	 		$charPoint->addAttribute('valorSentimiento', $valorSentimientoParcial);	
	 		$color = $util->hex_color_mod($colorPositivo, $valorSentimientoParcial);
	 		$charPoint->addAttribute('colorSentimiento', $color);
	 		if ($valorSentimientoParcial > 0)
			{
				$charPoint->addAttribute('sentimiento','positivo');	
				//$charPoint->addAttribute('colorSentimiento','green');	
			}
			else if ($valorSentimientoParcial < 0){
				$charPoint->addAttribute('sentimiento','negativo');
			//	$charPoint->addAttribute('colorSentimiento','red');
			}
			/*else{
				$charPoint->addAttribute('sentimiento','neutro');
				$charPoint->addAttribute('colorSentimiento','blue');
			}*/
			$contadorParcial = 0;
			$valorSentimientoParcial = 0.0;
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
	 					$tSentimiento = $charDialog->attributes()['sentimiento'];//actualizo el sentimiento general del personaje con el que transmite la escena
	 					$vSentimiento = $charDialog->attributes()['valorSentimiento'];
	 					$valorSentimientoParcial += sscanf($vSentimiento, "%f")[0];
	 					$contadorParcial++;
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
	 	$char->addAttribute('valorSentimiento', $valorSentimientoParcial);	
	 	$color = $util->hex_color_mod($colorPositivo, $valorSentimientoParcial);
	 	$char->addAttribute('colorSentimiento',$color);
	 	if ($valorSentimientoParcial > 0)
		{
			$char->addAttribute('sentimiento','positivo');	
		//	$char->addAttribute('colorSentimiento','green');
		}
		else if ($valorSentimientoParcial < 0){
			$char->addAttribute('sentimiento','negativo');
		//	$char->addAttribute('colorSentimiento','red');
		}
		/*else{
			$char->addAttribute('sentimiento','neutro');
			$char->addAttribute('colorSentimiento','blue');
		}*/
		$contadorParcial = 0;
		$valorSentimientoParcial = 0.0;
	endforeach;

// --> AÑADIR SENTIMIENTO A CADA ESCENA
	foreach ($pelicula->vis->timeSlice as $timeSlice): //por cada escena
		$sentimientoParcial = 0;
		foreach ($timeSlice->pointGroup->charPoint as $charPoint): //por cada personaje
			$tSentimiento = $charPoint->attributes()['sentimiento'];
			$vSentimiento = $charPoint->attributes()['valorSentimiento'];
			$valorSentimientoParcial += sscanf($vSentimiento, "%f")[0];
			$contadorParcial++;
			if(strcmp($tSentimiento, 'positivo') == 0){
				$sentimientoParcial++;
			}
			else if (strcmp($tSentimiento, 'negativo') == 0){
				$sentimientoParcial--;
			}
		endforeach;
		foreach ($timeSlice->pointGroup->accion as $accion): //por cada acción
			$tSentimiento = $accion->attributes()['sentimiento'];
			$vSentimiento = $accion->attributes()['valorSentimiento'];
			$valorSentimientoParcial += sscanf($vSentimiento, "%f")[0];
			$contadorParcial++;
			if(strcmp($tSentimiento, 'positivo')== 0){
				$sentimientoParcial++;
			}
			else if (strcmp($tSentimiento, 'negativo')== 0){
				$sentimientoParcial--;
			}
		endforeach;
		$timeSlice->addAttribute('valorSentimiento', $sentimientoParcial);	
		$color = $util->hex_color_mod($colorPositivo, $valorSentimientoParcial);
		$timeSlice->addAttribute('colorSentimiento',$color);
		if ($valorSentimientoParcial > 0)
		{
			$timeSlice->addAttribute('sentimiento','positivo');	
		//	$timeSlice->addAttribute('colorSentimiento','green');
		}
		else if ($valorSentimientoParcial < 0){
			$timeSlice->addAttribute('sentimiento','negativo');
		//	$timeSlice->addAttribute('colorSentimiento','red');
		}
		/*else{
			$timeSlice->addAttribute('sentimiento','neutro');
			$timeSlice->addAttribute('colorSentimiento','blue');
		}*/
		$contadorParcial = 0;
		$valorSentimientoParcial = 0.0;
	endforeach;

	// --> Se genera el nuevo XML
	$nombreFichero = explode(".xml", $nom);
	$nuevoNombreFichero = "../xml_guiones/".$nombreFichero[0]."-sent.xml";
	$pelicula->asXML($nuevoNombreFichero);
?>

	<script src="../references/jquery-2.1.4.min.js"></script>
	<script>
		$(document).ready(function(){
			$( "#loadVis" ).on( "click", function() {
				if ($('#guion span').text() != null){
				  	if (typeof(Storage) !== "undefined") {
				  		var nombreFichero = $('#guion span').text() + "-sent.xml"
					    localStorage.setItem("sharedGuion", nombreFichero);
					} 
					window.location = "../guion-vis.html";
				}
				else{
					alert("No ha seleccionado ninguno.")
				}
			});
		});
	</script>
</body>
</html>
</html>
