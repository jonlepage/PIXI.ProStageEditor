/*:
// PLUGIN □────────────────────────────────□ Scene_Boot □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Boot
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/

// TODO: VOIR SI ON PEUT TRANSFERE DANS SCENE_LOADER
function Scene_Boot() {
    this.initialize.apply(this, arguments);
}

Scene_Boot.prototype = Object.create(Scene_Base.prototype);
Scene_Boot.prototype.constructor = Scene_Boot;

Scene_Boot.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this._startDate = Date.now();
    // all loaded from SceneBoot are Perma ressource, make perma ressource once
    for (const key in $Loader.Data2) {
        Object.defineProperty($Loader.Data2, key, { enumerable: false });
    }; 
   



    $mouse.initialize(); // initialise mouse core
    $player.initialize();
    $player2.initialize();
    //$gui.initialize(); 
    //$avatar.initialize();
    //$monster.initialize();
};


Scene_Boot.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    DataManager.loadDatabase();
    ConfigManager.load();
    this.loadSystemWindowImage();
    
};

Scene_Boot.prototype.loadSystemWindowImage = function() {
    ImageManager.reserveSystem('Window');
};

Scene_Boot.loadSystemImages = function() {
    ImageManager.reserveSystem('IconSet');
    ImageManager.reserveSystem('Balloon');
    ImageManager.reserveSystem('Shadow1');
    ImageManager.reserveSystem('Shadow2');
    ImageManager.reserveSystem('Damage');
    ImageManager.reserveSystem('States');
    ImageManager.reserveSystem('Weapons1');
    ImageManager.reserveSystem('Weapons2');
    ImageManager.reserveSystem('Weapons3');
    ImageManager.reserveSystem('ButtonSet');
};

Scene_Boot.prototype.isReady = function() {
    if (Scene_Base.prototype.isReady.call(this)) {
        return DataManager.isDatabaseLoaded() && this.isGameFontLoaded() ;
    } else {
        return false;
    }
};

Scene_Boot.prototype.isGameFontLoaded = function() {
    if (Graphics.isFontLoaded('GameFont')) {
        return true;
    } else if (!Graphics.canUseCssFontLoading()){
        var elapsed = Date.now() - this._startDate;
        if (elapsed >= 60000) {
            throw new Error('Failed to load GameFont');
        }
    };
};

// rendu ici ,Scene_Title
Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    //SoundManager.preloadImportantSounds();
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    //$player.transferMap(1,1,1); // transfer + loader  //SceneManager.goto(Scene_Loader,"loaderSet_sceneIntroVideo",Scene_IntroVideo);
    $player.transferMap(1); // HACKED FOR DEBUG// FIXME: SceneManager.goto(Scene_Loader,"Scene_IntroVideo_data",Scene_IntroVideo);
    Window_TitleCommand.initCommandPosition();
    //this.updateDocumentTitle();
};

Scene_Boot.prototype.checkPlayerLocation = function() {
    if ($dataSystem.startMapId === 0) {
        throw new Error('Player\'s starting position is not set');
    }
};