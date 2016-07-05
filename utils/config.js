var debug = false;

var width;
var height;
var x;
var y;

var MIN_VALUE = 0;
var MAX_VALUE = 150;
var _numPagsScript = 0;
//Variables globales controller MainCtrl
var _scenes = [];
var _chars = [];
var _lines = [];
var _charJumps = [];
var _charToNumber = new Array();
var _maxNumScenesPerChar = MIN_VALUE;
var _scenesTotalLength = 0;
var _numEscenas;
var _sceneMinLength = MAX_VALUE;
var _sceneMaxLength = MIN_VALUE;
var numPagsScript = 1;
var _pixelsPerChar = 16;
var _algoritmo;

var _colorOriginalEllipse;
var _colorEllipsePersonaje = "#DCF8F4";

//configuracion _colores
var _colorPositivoAbsoluto = "#00FF00"; //verde
var _colorNegativoAbsoluto = "#FF0000"; //rojo
var _colorNeutroAbsoluto = "#0000FF"; //azul