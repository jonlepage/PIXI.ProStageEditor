/*:
// PLUGIN □────────────────────────────────□ Scene_MapID1 □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_MapID1
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
    this.CAGE_MOUSE.name = "CAGE_MOUSE";
    this.CAGE_MAP.name = "CAGE_MAP";
    this.CAGE_GUI.name = "CAGE_GUI";
*/
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
// Scene_MapID1
//

//#region [rgba(0, 0, 0,0.3)]
// ┌------------------------------------------------------------------------------┐
// HEADER SCENE
// └------------------------------------------------------------------------------┘
function Scene_MapID1() {
    this.initialize.apply(this, arguments);
}

Scene_MapID1.prototype = Object.create(Scene_Base.prototype);
Scene_MapID1.prototype.constructor = Scene_MapID1;

Scene_MapID1.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this,"Scene_MapID1_data"); // pass loaderset for setup Scene ambiant
    this.planetID = 1; //TODO: METTRE DYNAMICS
    this.alpha = 0; // active the fadeIn
    this.waitReady = 30; // stabiliser
};

// create element for scene and setup.
Scene_MapID1.prototype.create = function() {
    this.CAGE_MAP.addChild($player.player1); //TODO:
};

Scene_MapID1.prototype.isReady = function() {
    // check scene stabilisator // TODO:
    Graphics.render(this); // force spike lag
    this.waitReady--;
   return !this.waitReady;
};

// start Loader
Scene_MapID1.prototype.start = function() {
   
};

Scene_MapID1.prototype.update = function() {
    if(!this.busy){

    };
};

//#endregion



//#region [rgba(0, 5, 5,0.5)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘


//#endregion

