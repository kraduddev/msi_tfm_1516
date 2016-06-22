<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <form action="./opinion-analysis/Analizador.php" method="post" enctype="multipart/form-data">
            <input type="file" name="archivo" id="archivo"></input>
            <input type="submit" value="Subir archivo"></input>
        </form>

<br/>

		<h3>Guiones disponibles</h3>
		<?php
		$directorio = opendir("./xml_guiones"); //ruta actual
		while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
		{
		    if (is_dir($archivo))//verificamos si es o no un directorio
		    {
		       //echo "[".$archivo . "]<br />"; //de ser un directorio lo envolvemos entre corchetes
		    }
		    else
		    {
		    	if ($archivo != "backup_guiones"){
		        	//echo $archivo . "<br />";
		        	//echo "<a href='./guion-vis.html'>".$archivo."</a> <br />";
		    		
		        	echo 	"<input type='radio' name='guion' value='".$archivo."' id='".$archivo."'>
								<label for='".$archivo."'>".$archivo."</label>
							</input> <br/>";

		    	}
		    }
		}
		?>
		<br/>
		<input type="submit" id="loadVis" value="Cargar seleccionado">

		<script src="./references/jquery-2.1.4.min.js"></script>
		<script>
			$(document).ready(function(){
				$( "#loadVis" ).on( "click", function() {
					if ($('input[name="guion"]:checked').val() != null){
					  	if (typeof(Storage) !== "undefined") {
						    localStorage.setItem("sharedGuion", $('input[name="guion"]:checked').val());
						} 
						window.location = "./guion-vis.html";
					}
					else{
						alert("No ha seleccionado ninguno.")
					}
				});
			});
		</script>
    </body>
</html>
