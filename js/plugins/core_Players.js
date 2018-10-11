
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
class _player extends PIXI.Container {
    constructor() {
        super();
        this.Sprites = {d:null, n:null};
        this._planetID = null; // player current planet id
    };
  
};

$player = new _player(); // create game player
console.log1('$player.', $player);

// $player.initialize(); // setupNewGame
_player.prototype.initialize = function() {
    const spine = new PIXI.spine.Spine($Loader.Data2.heroe1_rendered.spineData);
        //spine.skeleton.setSkinByName()//
        spine.stateData.defaultMix = 0.1;
        spine.state.setAnimation(0, "idle", true);
        spine.state.setAnimation(1, "hair_idle", true);
        setInterval(function(){ //TODO:
            const allowWink = Math.random() >= 0.5;
            allowWink && spine.state.setAnimation(2, 'wink1', false); 
        }, 1200);
        spine.skeleton.setSlotsToSetupPose();

    const spineBg_n = new PIXI.Sprite(PIXI.Texture.WHITE); // allow swap texture hover tile
        spineBg_n.width = spine.width, spineBg_n.height = spine.height;
        spineBg_n.anchor.set(0.5,1);
    
    this.scale.set(0.45,0.45);
    this.position.set(945,610);

    spine.parentGroup = PIXI.lights.diffuseGroup;
    spine.convertToNormal();
    
    //spineBg_n.parentGroup = PIXI.lights.normalGroup;
    
    this.parentGroup = $displayGroup.group[1];
    this.zIndex = this.position._y;
    this.addChild(spine);
    // player 2 TODO:
    
   
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



//TODO: OBSOLETE, mapid planetid seron mintenant dans le editor
// $player.transferMap(1,1,1); // setupNewGame
_player.prototype.transferMap = function(mapID) {
    // check if need load all stuff for planet ?
    const planetID = $Loader.loaderSet.MapInfos[mapID].planetID; // target planet id need for this mapID
    if(planetID !== this._planetID){
        this._planetID = planetID;
        SceneManager.goto(Scene_Loader,"PlanetID1",Scene_MapID1);
    }else{
        SceneManager.goto(window[`Scene_MapID${mapID}`]); // planet loaded , just go mapScene id
    };
    
};

// ┌------------------------------------------------------------------------------┐
// GLOBAL $SLL CLASS: _SLL for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
class _player2 extends PIXI.Container {
    constructor() {
        super();
        this.Sprites = {d:null, n:null};
    };
  
};

$player2 = new _player2(); // create game player
console.log1('$player2.', $player2);

// $player2.initialize(); // setupNewGame
_player2.prototype.initialize = function() {
    const spine = new PIXI.spine.Spine($Loader.Data2.heroe2.spineData);
        //spine.skeleton.setSkinByName()//
        spine.stateData.defaultMix = 0.1;
        spine.state.setAnimation(0, "idle", true);
        spine.skeleton.setSlotsToSetupPose();
    
    this.scale.set(0.45,0.45);
    this.position.set(890,610);

    spine.parentGroup = PIXI.lights.diffuseGroup;
    spine.convertToNormal();

    this.parentGroup = $displayGroup.group[1];
    this.zIndex = this.position._y;
    this.addChild(spine);


   
};