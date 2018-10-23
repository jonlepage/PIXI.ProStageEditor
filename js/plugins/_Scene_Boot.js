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
    this._startDate = Date.now();

    $Loader.setPermaCurrentData(); // all loaded from SceneBoot are Perma ressource, protect perma ressource once for avoid destoyed
    $mouse.initialize(); // initialise mouse core
    $player = new _player($Loader.Data2.heroe1_rendered); // create game player
    $player2.initialize();
    //$gui.initialize(); 
    //$avatar.initialize();
    //$monster.initialize();
    Scene_Base.prototype.initialize.call(this);
};


Scene_Boot.prototype.create = function() {
    //Scene_Base.prototype.create.call(this);
   // DataManager.loadDatabase();
   // ConfigManager.load();
   // this.loadSystemWindowImage();
};



Scene_Boot.prototype.isReady = function() {
    return true;
};

// rendu ici ,Scene_Title
Scene_Boot.prototype.start = function() {
    SceneManager.goto(Scene_Loader,"Scene_IntroVideo_data",Scene_IntroVideo);
    //$player.transferMap(1); // HACKED FOR DEBUG// FIXME: SceneManager.goto(Scene_Loader,"Scene_IntroVideo_data",Scene_IntroVideo);

};
