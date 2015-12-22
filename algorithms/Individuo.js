algorithms = {
	class Individuo(){
		var _initCharPos = [];
		var _scenePos = [];

		this.create = function(initCharPos, scenePos){
			_initCharPos = initCharPos;
			_scenePos = scenePos;
		}

		this.copy = function(ind){
			_initCharPos = [];
			int j=0;
			int i=0;

			ind._initCharPos.forEach(function(icp){
				_initCharPos[j]=icp;
				j++;
			});

			_scenePos = [];
			j=0;
			ind._scenePos.forEach(function(sp){
				_initCharPos[j]=sp;
				j++;
			});
		}
	}
}