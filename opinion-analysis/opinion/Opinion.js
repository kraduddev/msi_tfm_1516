function Opinion(){
	this.index = []; //2 dimensiones
	this.classes = ['pos','neg'];
	this.classTokCounts = [{"pos":0},{"neg":0}];
	this.tokCount = 0;
	this.classDocCounts = [{"pos":0},{"neg":0}];
	this.docCount = 0;
	this.prior = [{"pos":0.5},{"neg":0.5}];

	/*this.addToIndex = function(fichero, clase, limite){
		limite || (limite = 0);
		var i = 0;
		var linea = 0;
		var myFileSysObj = new ActiveXObject("Scripting.FileSystemObject");
		var myInputTextStream = myFileSysObj.OpenTextFile(fichero, 1, true);
		var tokens = [];

		if(this.classes.indexOf(clase)<0){
			return;
		}
		while (!myInputTextStream.AtEndOfStream) {
			linea = myInputTextStream.ReadLine();

			if (limite > 0 && i>limite){
				break;	
			}
			i++;

			this.docCount++;
			this.classDocCounts[clase]++;
			tokens = this.tokenise(linea);
			tokens.forEach(function(value,index){
				if (typeof this.index[index][clase] == 'undefined'){
					this.index[index][clase] = 0;					
				}
				this.index[index][clase]++;
				this.classTokCounts[clase]++;
				this.tokCount++;
			});	

		}
		myInputTextStream.Close();

	}*/

	this.addToIndex = function(fichero, clase, limite){
		limite || (limite = 0);
		var i = 0;
		var linea = 0;
		var myFileSysObj = new ActiveXObject("Scripting.FileSystemObject");
		var myInputTextStream = myFileSysObj.OpenTextFile(fichero, 1, true);
		var tokens = [];

		if(this.classes.indexOf(clase)<0){
			return;
		}
		while (!myInputTextStream.AtEndOfStream) {
			linea = myInputTextStream.ReadLine();

			if (limite > 0 && i>limite){
				break;	
			}
			i++;

			this.docCount++;
			this.classDocCounts[clase]++;
			tokens = this.tokenise(linea);
			tokens.forEach(function(value,index){
				if (typeof this.index[index][clase] == 'undefined'){
					this.index[index][clase] = 0;					
				}
				this.index[index][clase]++;
				this.classTokCounts[clase]++;
				this.tokCount++;
			});	

		}
		myInputTextStream.Close();

	}

	this.classify = function(documento){
		this.prior['pos'] = this.classDocCounts['pos'] / this.docCount;
		this.prior['neg'] = this.classDocCounts['neg'] / this.docCount;
		var tokens = this.tokenise(documento);
		var classScores = new Array();
		var count = 0;

		this.classes.forEach(function(value, index){
			classScores[index] = 1;
			tokens.forEach(function(v, i){
				count = typeof this.index[i][index] != 'undefined' ?
							this.index[i][index] : 0;
				classScores[index] *= (count + 1) / (this.classTokCounts[index] + this.tokCount);
			});	
			classScores[index] = this.prior[index] * classScores[index];
		});
		classScores = classScores.sort();
		return classScores;

	}

	this.tokenise = function(documento){
		documento = documento.toLowerCase();
		var result = documento.match(/\w+/g);
		return result[0]; 
	}
}