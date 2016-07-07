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
var _minEscenas = 0;
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

var floatRegex = /[-+]?([0-9]*\.[0-9]+|[0-9]+)/; 
var intRegex = /^[0-9]+$/;

// Variables para colores de personajes
var _currentColor = 0;
var _numColors = 20;
var _colorList = [
	"#1f77b4", "#ff7f0e", "#2ca02c",
	"#d62728", "#9467bd", "#8c564b",
	"#e377c2", "#7f7f7f", "#bcbd22",
	"#17becf", "#aec7e8", "#ffbb78",
	"#98df8a", "#ff9896", "#c5b0d5",
	"#c49c94", "#f7b6d2", "#c7c7c7",
	"#dbdb8d", "#9edae5"];