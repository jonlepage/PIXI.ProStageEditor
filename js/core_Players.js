
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
    constructor(dataBase, textureName, dataValues) {
        super();
      
    };
    
    initialize() {

    };
};

$player = new _player();
console.log1('$player: ', $player);




// ┌------------------------------------------------------------------------------┐
// GLOBAL $SLL CLASS: _SLL for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
class _player2 extends PIXI.Container {
    constructor() {
        super();
        this.Sprites = {d:null, n:null};
    };
    initialize() {
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
};

$player2 = new _player2(); // create game player
console.log1('$player2.', $player2);
