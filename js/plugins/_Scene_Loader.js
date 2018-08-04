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
    this._createModeBox();
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

Graphics._clearUpperCanvas = function() {

};

// ┌-----------------------------------------------------------------------------┐
// SCENE LOADER THATS SHOW
//└------------------------------------------------------------------------------┘
function Scene_Loader(loaderSets,callBackScene,firstTime) {
    this.initialize.apply(this, arguments);
}

Scene_Loader.prototype = Object.create(Scene_Base.prototype);
Scene_Loader.prototype.constructor = Scene_Loader;

Scene_Loader.prototype.initialize = function(loaderSets,callBackScene,firstTime) {
    Scene_Base.prototype.initialize.call(this);
    $Loader._scene = this; // attache the current scene to core loader
    this.firstTime = !!firstTime; // first time allow show basic text, because loading animation was not loaded
    this.loaderSets = loaderSets;
    this.callBackScene = callBackScene;
    this.isLoading = !!firstTime;
    this._progress = 0;
    this._progressTxt = [];
    document.title = document.title+" || "+"Scene_Loader:set=>"+String(loaderSets);
};

Scene_Loader.prototype.create = function() {
    // FIRST TIME BOOT, NEED ALL JSON LIST, and use pixi.text for progress
    if(this.firstTime){
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


Scene_Loader.prototype.isReady = function() {
    console.log("%cScene_Loader.isReady ? isLoading", "color: red", this.isLoading);
    // if firstime, wait load the MapInfos.json befor start boot load
    if(this.firstTime){ // FORCE RENDERING TEXT FIRST TIME 
        this.text2.text = $Loader._progressTxt;
        Graphics.render(this);
    }; 
   
    return !this.isLoading;
};

// start Loader
Scene_Loader.prototype.start = function() {
    console.log("%cScene_Loader.start. Load => set:", "color: green",'$Loader', this.loaderSets);
    this.isLoading = true;
    $Loader.load(this.loaderSets);
};


Scene_Loader.prototype.update = function() {
    if(!this.isLoading){
        document.title = document.title+"=>"+this.callBackScene.name;
        SceneManager.goto(this.callBackScene);
        
    };
    //Scene_Base.prototype.update.call(this);
};


