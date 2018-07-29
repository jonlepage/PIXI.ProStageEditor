
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
    const player = this.spine = new PIXI.spine.Spine($SLL.resource.Hero1_Big.spineData);
    player.convertToNormal("_n",true);
    player.parentGroup = $displayGroup.group[1];
    player.x = 945, player.y = 610;
    player.zIndex = player.y;
    player.name = "player";
    player.scale.set(0.5,0.5);
    // prop class
    $player._width = player.width;
    $player._height = player.height;
    // add render
    player.state.setAnimation(0, 'idle', true);
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
_player.prototype.transferMap = function(id,galaxi,planet) {
    this.currentMap = `Map${String(id).padZero(3)}`; // "Map001"
    if(!galaxi || !planet){
        SceneManager.goto(Scene_Map); 
    }else{
        this.currentGalaxi = "g"+galaxi; // "g1"
        this.currentPlanet = "p"+galaxi; // "p1"
        SceneManager.goto(Scene_Loader,[this.currentGalaxi,this.currentPlanet],Scene_Map); // full load + build planet library textures
    };
};