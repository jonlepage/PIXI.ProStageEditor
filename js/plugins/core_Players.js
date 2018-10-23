
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
class _player extends PIXI.ContainerSpine {
    constructor(dataBase, textureName, dataValues) {
        super(dataBase, textureName, dataValues);
        this._planetID = null; // player current planet id
        this._dir = 6; //player direction
        this.setupOnce(); // one time setup player1
    };
};

// player setup once, configuration
_player.prototype.setupOnce = function() {
    // spine
    const spine = this.d;
    spine.stateData.defaultMix = 0.1;
    spine.state.setAnimation(0, "idle", true);
    spine.state.setAnimation(1, "hair_idle", true);
    setInterval(function(){ //TODO: wink eyes, use spine events random
        const allowWink = Math.random() >= 0.5;
        allowWink && spine.state.setAnimation(2, 'wink1', false); 
    }, 1200);
    // player transform
    this.scale.set(0.45,0.45);
    //this.position.set(1555,1150); //FIXME:  MAKE DYNAMIQUE POSITIONNING 
    // player layers
    this.parentGroup = $displayGroup.group[1];
    this.zIndex = this.position._y;

    spine.skeleton.setSlotsToSetupPose();
    this.setupListeners();
    this.setupTweens();
};

// setup all spine events for player1
// https://github.com/pixijs/pixi-spine/blob/master/examples/index.md
_player.prototype.setupListeners= function() {
    spine.state.addListener({
        event: (function(entry, event) {
            if(event.data.name === "jumpStart"){
               this.moveToNextPath(entry);
            }else
            if(event.data.name === "reverse"){
               this.reversePlayer(entry);
            }else
            if(event.data.name === "jumpEnd"){
                this.endJump(entry);
             };
        }).bind(this),
        start: function(entry) { console.log0('animation is set at '+entry.trackIndex) },
    });
};

// setup all tweens once or reset if need
// https://greensock.com/docs/Core/Animation
_player.prototype.setupTweens = function() {
    this.tweenPosition = new TweenLite(this.position, 0, {
        x:this.position.x,
        y:this.position.y,
        ease:Power4.easeOut,
    });
    // initialise position without delay
    this.tweenScale = new TweenLite(this.scale, 0, {
        x:this.scale.x,
        y:this.scale.y,
        ease:Power4.easeOut,
    });
};

//$player.initialisePath(); matrix 
// store path matrix for players TODO: refaire le system pour mieux utiliser le mixing et empecher les bug events, 
_player.prototype.initialisePath = function(pathBuffer) {
    this.pathBuffer = pathBuffer;
    this.pathBufferIndex = 0;
    console.log('pathBuffer: ', pathBuffer);
    let tarckDir = this._dir; // track direction path, initialise with current player dir 2,4,8,6 -10
    this.d.state.timeScale = 1.5; //TODO: MATH speed dexterity
    for (let i=0, started = false, l=pathBuffer.length; i<l; i++) {
        let entry = null;
        const id = pathBuffer[i];
        const id_next = pathBuffer[i+1];
        
        // check direction
        const dirX = Number.isFinite(id_next)? $Objs.getDirXFromId(id, id_next) : void 0;
        const reverse = (tarckDir&&dirX) && tarckDir !== dirX;
        console.log(`id:${id} => id:${id_next}`, !!reverse);
        if(reverse){ // reverse
            if(started){
                entry = this.d.state.addAnimation(0,"reverse6to4",false,0.1); // sync  //(trackIndex, animationName, loop, delay)
            }else{
                entry = this.d.state.setAnimation(0, "reverse6to4", false)
            };
            tarckDir = +dirX; // update dir
            i--;
        }else
        if(Number.isFinite(id_next)){ // jump
            if(started) {
                entry = this.d.state.addAnimation(0,"jump1",false);  //(trackIndex, animationName, loop, delay)
            }else{
                entry = this.d.state.setAnimation(0, "jump1", false);
            }
        }else{ // end
            entry = this.d.state.addAnimation(0,"idle",true);
        };

        started = true;
        entry.id = i;
        console.log(entry);
    };
};

_player.prototype.moveToNextPath = function(entry) {
    console.log('entry: ', entry);
    const id = this.pathBuffer[this.pathBufferIndex]
    const nextID = this.pathBuffer[this.pathBufferIndex+1];
    const toCase = $Objs.list_cases[nextID];
    if(toCase){
        // tween
        this.tweenPosition.vars.x = toCase.x;
        this.tweenPosition.vars.y = toCase.y+toCase.height/3;
        this.tweenPosition._duration = 1;
        this.tweenPosition.invalidate(); // TODO: deep study source of this
        this.tweenPosition.play(0);
        // update setup
        this.zIndex = toCase.y;
        this.inCase = toCase;
        // haire dlow
        this.d.state.setAnimation(1, "hair_jump1", false);
        this.pathBufferIndex++; 
    }else{
        this.d.state.addAnimation(1, "hair_idle", true)
    }
};

_player.prototype.endJump = function(entry) {
    const nextID = this.pathBuffer[this.pathBufferIndex+1];
    if(!nextID>-1){
        this.d.state.setAnimation(1, "hair_idle", true)
    }
};

_player.prototype.reversePlayer = function() {
        // tween
        this.tweenScale.vars.x = this.tweenScale.vars.x*-1;
        this.tweenScale._duration = 1;
        this.tweenScale.invalidate(); // TODO: deep study source of this
        this.tweenScale.play(0);
        // update setup
        this._dir = 10-this._dir; // reverse dir 
};






//TODO: OBSOLETE, mapid planetid seron mintenant dans le editor
// $player.transferMap(1); // setupNewGame
_player.prototype.transferMap = function(id) {
    // check if need load all stuff for planet ?
    const planetID = $Loader.loaderSet[`Scene_MapID${id}_data`].system.mapID; // target planet id need for this mapID
    if(planetID !== this._planetID){
        // need load planet
        this._planetID = planetID;
        SceneManager.goto(Scene_Loader,`PlanetID${planetID}_data`,Scene_MapID1);
    }else{
        SceneManager.goto(window[`Scene_MapID${id}`]); // planet was loaded , just go mapScene id
    };
};

 // TODO: system transfer
 _player.prototype.transferPlayerToCase = function(objCase) {
    this.Sprites.x = objCase.x;
    this.Sprites.y = objCase.y+objCase.height/2;
    this.Sprites.zIndex = this.Sprites.y;
    this.inCase = objCase;
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