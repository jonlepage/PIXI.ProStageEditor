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
        const debug = require('nw.gui').Window.get().showDevTools();
        const gui = require('nw.gui').Window.get();
        gui.x = 0 ;
        gui.focus();
        // setup compatibility pointer lock
        const element = document.body; // document.body.requestPointerLock()
        /*if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }*/
    
        element.requestPointerLock = element.requestPointerLock ||
        element.mozRequestPointerLock ||
        element.webkitPointerLockElement;
        //element.requestPointerLock(); // pointlocker API
        this.initialize();
        this.goto(Scene_Loader,"Perma",Scene_Boot,true);
        this.requestUpdate();
    } catch (e) {
        this.catchException(e);
    }
};


SceneManager.goto = function(sceneClass, loaderSets, callBackScene, firstTime) {
    console.log0('SceneManager.goto: ', sceneClass.name,loaderSets,callBackScene&&callBackScene.name,firstTime);
    //if sceneClass is loaderScene, take loader Argument, wait , and isReady goTo callBackScene
    if (sceneClass) {
        this._nextScene = new sceneClass(loaderSets,callBackScene,firstTime);
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



// ┌-----------------------------------------------------------------------------┐
// SCENE BASE 
//└------------------------------------------------------------------------------┘
Scene_Base.prototype.initialize = function(loaderSet) {
    Stage.prototype.initialize.call(this);
    this._active = false;
    this._fadeSign = 0;
    this._fadeDuration = 0;
    this._fadeSprite = null;
    this._imageReservationId = Utils.generateRuntimeId();
    // improtan props
    this.Background = null;
    this.SpritesNoEvent = []; // element no interactions
    this.loaderSet = loaderSet;
    this.asignDisplayGroup();
    this.create_Cages();
};

Scene_Base.prototype.asignDisplayGroup = function() {
    this.addChild($displayGroup._spriteBlack_d);
    this.addChild($displayGroup._layer_diffuseGroup);
    this.addChild($displayGroup._layer_normalGroup);
    this.addChild($displayGroup._layer_lightGroup);
    // addChild group
    const layersGroup = $displayGroup.layersGroup;
    for (let i = 0, l = layersGroup.length; i < l; i++) {
        this.addChild(layersGroup[i]);
    };
    //http://pixijs.io/pixi-lights/docs/PIXI.lights.PointLight.html
    const dataScene = this.loaderSet && $Loader.loaderSet[this.loaderSet].SCENE || {color:0xffffff, brightness:1};
    this.light_Ambient = new PIXI.lights.AmbientLight(dataScene.color, dataScene.brightness); // the general ambiance from sun and game clock (affect all normalGroup)
    this.light_sunScreen =  new PIXI.lights.PointLight(0xffffff,3); // the sceen FX sun TODO: in Editor
    this.light_sunScreen.position.set(0, 0);
    this.addChild(this.light_Ambient,this.light_sunScreen);
};

Scene_Base.prototype.create_Cages = function() {
    this.CAGE_MOUSE = new PIXI.Container();
    this.CAGE_MAP = new PIXI.Container();
    this.CAGE_GUI = new PIXI.Container();
    this.CAGE_MOUSE.name = "CAGE_MOUSE";
    this.CAGE_MAP.name = "CAGE_MAP";
    this.CAGE_GUI.name = "CAGE_GUI";
    this.addChild( this.CAGE_MAP, this.CAGE_GUI, this.CAGE_MOUSE);
    $mouse.cursor && this.CAGE_MOUSE.addChild($mouse.cursor);
};
