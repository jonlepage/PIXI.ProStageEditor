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
// scene qui affiche  lecran de loading
// loadCore mais aussi precharge les nouvelle scene de la planet

class Scene_Loader extends _Scene_Base {
    constructor(nextSceneName) {
        super();
        this._nextSceneName = nextSceneName;
        this.createDisplayLoading(); // affiche loiading status
    };

    createDisplayLoading() {
        const style = new PIXI.TextStyle({ fill: "white", fontFamily: "Times New Roman", fontSize: 20 });
        const text1 = new PIXI.Text('Please Wait Initialisation ...', style);
        const text2 = new PIXI.Text('data', style);
        this.addChild(text1,text2);
    };

    start(){
        super.start();
        $Loader.initialize (this._nextSceneName);
    };

    update(delta){
        super.update(delta);
        if(!$Loader._isLoading){
           $stage.goto(this._nextSceneName);
        }
    };

    end(){
        this.visible = false;
        this.renderable = false;
    };


};
/*
// ┌-----------------------------------------------------------------------------┐
// SCENE LOADER THATS SHOW
//└------------------------------------------------------------------------------┘
function Scene_Loader(loaderSets,callBackScene) {
    this.initialize.apply(this, arguments);
}

Scene_Loader.prototype = Object.create(Scene_Base.prototype);
Scene_Loader.prototype.constructor = Scene_Loader;

Scene_Loader.prototype.initialize = function(loaderSets, callBackScene) {
    console.log(`Scene_Loader.initialize: %c("${arguments[0]}",  ${arguments[1].name})`,"color: green");
    this.loaderSets = loaderSets;
    this.callBackScene = callBackScene;
    this.firstBoot = false;
    Scene_Base.prototype.initialize.call(this);
};

Scene_Loader.prototype.create = function() {
    // if loader set not exist, it because it the first boot, so preload all json
    if(!$Loader.loaderSet){
        this.firstBoot = true;
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
    }
};

// firstBoot, need wait loader load all json data
Scene_Loader.prototype.isReady = function() {
    if(this.firstBoot){ // FORCE RENDERING TEXT LOG firstBoot mode
        this.text2.text = $Loader._progressTxt;
        Graphics.render(this);
    };
    return !$Loader.isLoading;
};

// #2 start Loader
Scene_Loader.prototype.start = function() {

    //$Objs.list_master = []; // purge objet scene
    
};


Scene_Loader.prototype.update = function() {
    if(!$Loader.isLoading){
        console.log('!$Loader.isLoading: ', !$Loader.isLoading);
        document.title = document.title +"+" +this.callBackScene.name;
        SceneManager.goto(this.callBackScene);
        
    };
};
*/
