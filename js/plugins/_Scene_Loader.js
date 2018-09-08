/*:
// PLUGIN □────────────────────────────────□ Scene_Loader □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc loader class for the sceneLoader
* V.1.0
* License:© M.I.T
REMOVE FPSMETER FOR THIS WORK

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/

// ┌-----------------------------------------------------------------------------┐
// HACK GRAFICS
//└------------------------------------------------------------------------------┘
Graphics.startLoading = function() {};
Graphics.updateLoading = function() {};
Graphics.endLoading = function() {};

// remove fpsmeter, uppercanvas loader
Graphics._createAllElements = function() {
    this._createErrorPrinter();
    this._createCanvas();
    //this._createVideo();
    //this._createUpperCanvas();
    this._createRenderer();
    //this._createFPSMeter();
    //this._createModeBox();
    this._createGameFontLoader();
};

Graphics._updateAllElements = function() {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    //this._updateVideo();
    //this._updateUpperCanvas();
    this._updateRenderer();
    //this._paintUpperCanvas();
};

Graphics._clearUpperCanvas = function() {};

Graphics._createErrorPrinter = function() {
    this._errorPrinter = document.createElement('p');
    this._errorPrinter.id = 'ErrorPrinter';
    this._updateErrorPrinter();
    this._errorPrinter.style.pointerEvents = 'none'
    document.body.appendChild(this._errorPrinter);
};

Graphics._createModeBox = function() {
    this._modeBox.style.pointerEvents = 'none'
};

Graphics._updateVideo = function() {
    this._video.style.pointerEvents = 'none'
};

Graphics._createUpperCanvas = function() {
    this._upperCanvas.style.pointerEvents = 'none'
};

// ┌-----------------------------------------------------------------------------┐
// SCENE LOADER THATS SHOW
//└------------------------------------------------------------------------------┘
function Scene_Loader(loaderSets,callBackScene,firstTime) {
    this.initialize.apply(this, arguments);
}

Scene_Loader.prototype = Object.create(Scene_Base.prototype);
Scene_Loader.prototype.constructor = Scene_Loader;

Scene_Loader.prototype.initialize = function(loaderSets, callBackScene) {
    console.log(`Scene_Loader.initialize: %c("${arguments[0]}",  ${arguments[1].name})`,"color: green");
    this.loaderSets = loaderSets;
    this.callBackScene = callBackScene;
    
    Scene_Base.prototype.initialize.call(this);
};

Scene_Loader.prototype.create = function() {
    // if loader set not exist, it because it the first boot, so preload all json
    if(!$Loader.loaderSet){
        this._progress = 0;
        this._progressTxt = [];
        const style = new PIXI.TextStyle({ fill: "white", fontFamily: "Times New Roman", fontSize: 20 });
        const text1 = new PIXI.Text('Please Wait Initialisation ...', style);
        const text2 = new PIXI.Text('data', style);
        text1.x = 10, text1.y = 10;
        text2.x = 10, text2.y = 65;
        this.addChild(text1,text2);
        this.text1 = text1;
        this.text2 = text2;
        $Loader.preLoad_Json();
    };
};

// #1
Scene_Loader.prototype.isReady = function() {
    // if firstime, wait load the MapInfos.json befor start boot load
    if(this.firstTime){ // FORCE RENDERING TEXT FIRST TIME 
        this.text2.text = $Loader._progressTxt;
        Graphics.render(this);
    }; 
    return !$Loader.isLoading;
};

// #2 start Loader
Scene_Loader.prototype.start = function() {
    console.log(`start: %c$Loader.load("${this.loaderSets}")`, "color: green");
    //$Objs.list_master = []; // purge objet scene
    $Loader.load(this.loaderSets);
};

aaa = 100
Scene_Loader.prototype.update = function() {
    if(!$Loader.isLoading && aaa-- ===0){
    console.log9(`load %ccomplette:`,"color: green");
        document.title = document.title+"=>"+this.callBackScene.name;
        SceneManager.goto(this.callBackScene);
    };
};


