
/*:
// PLUGIN □────────────────────────────────□CREATE CAHRACTERE PLAYER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc create player and setup for whole game
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
dans les class, . pour les objects, function deep (non Json), _ pour les props array bool,
*/

// ┌------------------------------------------------------------------------------┐
// GLOBAL $SLL CLASS: _SLL for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
function _player() {
    this.currentMap = null;
    this.currentGalaxi = null;
    this.currentPlanet = null;
    this.spine = null;
    this._zoneLimit = 200; // player limit zone for search
    this._width = null;
    this._height = null;
    this.inCase = null;
} 

$player = new _player(); // create game player
console.log1('$player.', $player);

// $player.initialize(); // setupNewGame
_player.prototype.initialize = function() {
    const player = this.spine = new PIXI.spine.Spine($Loader.Data2.Hero1_Big.spineData);

    player.parentGroup = $displayGroup.group[1];
    player.x = 945, player.y = 610;
    player.zIndex = player.position._y;
    player.name = "player";
    player.scale.set(0.5,0.5);
    // prop class
    // add render
    player.state.setAnimation(0, 'idle', true);
    player.state.setAnimation(2, 'hair_idle1', true);
    setInterval(function(){ //TODO:
        const allowWink = Math.random() >= 0.5;
        allowWink && player.state.setAnimation(3, 'wink1', false); 
    }, 1000);
    
    player.stateData.defaultMix = 0.3;
    this.player1 = player;
};

 // TODO: system transfer
 _player.prototype.transferPlayerToCase = function(objCase) {
    this.spine.x = objCase.x;
    this.spine.y = objCase.y+objCase.height/2;
    this.spine.zIndex = this.spine.y;
    this.inCase = objCase;
};

//$player.moveToCase();
_player.prototype.moveToCase = function(objCase) {
    this.spine.x = objCase.x;
    this.spine.y = objCase.y+objCase.height/2;
    this.spine.zIndex = this.spine.y;
    this.inCase = objCase;
};

//$player.position();
_player.prototype.position = function() {
    return this.spine.position;
};

_player.prototype.width = function() {
    return this.spine.width;
};

_player.prototype.height = function() {
    return this.spine.height;
};


// $player.transferMap(1,1,1); // setupNewGame
_player.prototype.transferMap = function(mapID) {
    // check if need load all stuff for planet ?
    const targetPlanetID = $Loader.loaderSet.MapInfos[mapID].planetID; // target planet id need for this mapID
    if($Loader._currentPlanetID !== targetPlanetID){ // the planet not loaded ? 
        SceneManager.goto(Scene_Loader, `PlanetID${mapID}`, window[`Scene_MapID${mapID}`]); // load befor planetID and go map
        
    }else{
        SceneManager.goto(window[`Scene_MapID${mapID}`]); // planet loaded , just go mapScene id
    }
    
};