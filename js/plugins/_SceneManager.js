/*:
// PLUGIN □────────────────────────────────□ SceneManager hack □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc loader class for the sceneLoader
* V.1.0
* License:© M.I.T
SceneManager.goto(Scene_Loader,["loaderSet"],Scene_Boot,false);

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/
SceneManager.run = function() {
    try {
        // game gui
        const winGui = require('nw.gui').Window.get();
        winGui.show();
        winGui.focus();
        // debug gui
        winGui.showDevTools();
        const debugGui = require('nw.gui').Window.get();
        debugGui.x = 0 ;
        debugGui.focus();

        //start
        this.initialize();
        this.goto(Scene_Loader,"Perma",Scene_Boot);
        this.requestUpdate();
    } catch (e) {
        this.catchException(e);
    }
};


SceneManager.goto = function(sceneClass, loaderSets, callBackScene) {
    console.log0('SceneManager.goto: ', sceneClass.name, loaderSets, callBackScene&&callBackScene.name);
    //if sceneClass is loaderScene, take loader Argument, wait , and isReady goTo callBackScene
    if (sceneClass) {
        this._nextScene = new sceneClass(loaderSets,callBackScene);
    }
    if (this._scene) {
        this._scene.stop();
    };
};

//GAME UPDATE 
SceneManager.update = function() {
    try {
        //this.tickStart();
        if (Utils.isMobileSafari()) {
            this.updateInputData(); // sur safari, les lister ne marche pas ??
        }
        //this.updateManagers(); // ImageManager.update();
        this.updateMain();
        //this.tickEnd();
    } catch (e) {
        this.catchException(e);
    }
};


SceneManager.updateMain = function() {
    if (Utils.isMobileSafari()) {
        this.changeScene();
        this.updateScene();
    } else {
        var newTime = this._getTimeInMsWithoutMobileSafari();
        var fTime = (newTime - this._currentTime) / 1000;
        if (fTime > 0.25) fTime = 0.25;
        this._currentTime = newTime;
        this._accumulator += fTime;
        while (this._accumulator >= this._deltaTime) {
            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this._accumulator -= this._deltaTime;
        }
    };
    this.renderScene();
    this.requestUpdate();
};

SceneManager.renderScene = function() {
    if (this.isCurrentSceneStarted()) {
        Graphics.render(this._scene);
    } else if (this._scene) {
        this.onSceneLoading();
    }
};

SceneManager.requestUpdate = function() {
    if (!this._stopped) {
        requestAnimationFrame(this.update.bind(this));
    }
};


SceneManager.changeScene = function() {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
        if (this._scene) {
            this._scene.fadeInOut? clearInterval(this.fadeInOut) : void 0;
            this._scene.terminate();
            this._scene.detachReservation();
            this._previousClass = this._scene.constructor;
        }
        this._scene = this._nextScene;
        if (this._scene) {
            this._scene.attachReservation();
            this._scene.create();
            this._nextScene = null;
            this._sceneStarted = false;
            this.onSceneCreate();
        }
        if (this._exiting) {
            this.terminate();
        }
    }
};

SceneManager.updateScene = function() {
    if (this._scene) {
         // one time
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            this._scene.update();
        }
    }
};


SceneManager.onSceneStart = function() {
    if(this._scene.alpha === 0){
        this._scene.fadeInOut = setInterval(function(){
            if((this.alpha+=0.05) >=1){ clearInterval(this.fadeInOut) };
         }.bind(this._scene), 10);
    };
};

// ┌-----------------------------------------------------------------------------┐
// SCENE BASE 
//└------------------------------------------------------------------------------┘


Scene_Base.prototype.initialize = function() {
    Stage.prototype.initialize.call(this);
    this._active = false;
    this._fadeSign = 0;
    this._fadeDuration = 0;
    this._fadeSprite = null;
    this._imageReservationId = Utils.generateRuntimeId();
    // customCode base
    this.loaderSet = $Loader.getCurrentLoaderSet(); // get last set loaded from core
    this.asignDisplayGroup();
    if(this.loaderSet){
        this.createLights();
        this.create_Cages(); // create master cage distribution for Scene
        this.create_Background();
        this.create_ObjFromJson();

        $camera.initialise(this.CAGE_MAP, [1920/2,1080/2]); // initialise the cam with current scene
        this.CAGE_MOUSE.addChild($mouse);//add the mouse to current scene
        console.log9('this: ', this);
    };
};

// add to STAGE, pixiDisplay layers
Scene_Base.prototype.asignDisplayGroup = function() {
    this.addChild( // lights groups
        $displayGroup._spriteBlack_d,
        $displayGroup._layer_diffuseGroup,
        $displayGroup._layer_normalGroup,
        $displayGroup._layer_lightGroup,
        ...$displayGroup.layersGroup // displayGroups
    );
};

// add to STAGE, lights and ambiants
//http://pixijs.io/pixi-lights/docs/PIXI.lights.PointLight.html
Scene_Base.prototype.createLights = function() {
    this.lights = {};
    if(this.loaderSet._lights){
        const ambientLight     = new PIXI.ContainerAmbientLight     (this.loaderSet._lights.ambientLight     ); // the general ambiance from sun and game clock (affect all normalGroup) _SCENE.color, _SCENE.brightness
        const directionalLight = new PIXI.ContainerDirectionalLight (this.loaderSet._lights.directionalLight );
        this.addChild(ambientLight, directionalLight);
        this.lights = {ambientLight,directionalLight};
    };
    // ajust the mouse light scene if custom data exist?
};

// TODO: CAGE_MESSAGETOP, CAGE_FX... 
Scene_Base.prototype.create_Cages = function() {
    this.CAGE_MAP = new PIXI.Container();
    this.CAGE_GUI = new PIXI.Container();
    this.CAGE_MOUSE = new PIXI.Container();
    this.addChild( this.CAGE_MAP, this.CAGE_GUI, this.CAGE_MOUSE);
};

// create, add, background from loaderSet or editor
Scene_Base.prototype.create_Background = function(customBG) {
    this.clearBackground();
    const dataValues = this.loaderSet._background;
    const dataBase = dataValues? $Loader.Data2[dataValues.p.dataName] : void 0;
    this.background = new PIXI.ContainerBG(dataBase,dataValues);
    this.CAGE_MAP.addChild(this.background); // TODO: test if need addChildAt() ? because objs are in CAGE_MAP
};

// create Objs from this.loaderSet
Scene_Base.prototype.create_ObjFromJson = function() {
    if(this.loaderSet._OBJS){
        $Objs.initialize(this.loaderSet._OBJS); // initialise
        $Objs.list_master.length && this.CAGE_MAP.addChild(...$Objs.list_master);
        //$Objs.list_master.forEach(cage => { cage.getBounds() });
        // groupe all case and interactivity
       // $Objs.getCases();
       // this.initialiseCasesInteractivity();
    };
};

// add cases listener
Scene_Base.prototype.initialiseCasesInteractivity = function() {
    $Objs.list_cases.forEach(_case => {
        _case.interactive = true;
        _case.on('pointerover', pointer_overIN);
        _case.on('pointerout', pointer_overOUT);
        //_case.on('pointerup', pointer_UP);
    });
    // TODO: ADD TO MOUSE OR OTHER MANAGER , MAYBE CASES CLASS
    function pointer_overIN(e){
        e.currentTarget.Sprites.d._filters = [new PIXI.filters.OutlineFilter (4, 0x16b50e, 1)];
        $mouse.onCase = e.currentTarget;
    };
    function pointer_overOUT(e){
        e.currentTarget.Sprites.d._filters = null;
        $mouse.onCase = null;
    };

};


// clear remove Background
Scene_Base.prototype.clearBackground = function() {
    this.CAGE_MAP.removeChild(this.background);
    this.background = null;
};
