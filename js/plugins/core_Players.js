
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
        this._dirX = 6; //player direction
        this.setupOnce(); // one time setup player1
    };
};

// player setup once, configuration
_player.prototype.setupOnce = function() {
    // spine
    const spine = this.d;
    spine.stateData.defaultMix = 0.2;
    spine.state.setAnimation(0, "idle", true);
    spine.state.setAnimation(1, "hair_idle", true);
    setInterval(function(){ //TODO: wink eyes, use spine events random
        const allowWink = Math.random() >= 0.5;
        allowWink && spine.state.setAnimation(2, 'wink1', false); 
    }, 1250);
    // player transform
    this.scale.set(0.45,0.45);
    this.position.set(1555,1150); //FIXME:  MAKE DYNAMIQUE POSITIONNING 
    // player layers
    this.asignParentGroups();
    this.parentGroup = $displayGroup.group[1];
    this.zIndex = this.position._y;

    spine.skeleton.setSlotsToSetupPose();
    this.setupListeners();
    this.setupTweens();
};

// setup all spine events for player1
// https://github.com/pixijs/pixi-spine/blob/master/examples/index.md
_player.prototype.setupListeners= function() {
    this.d.state.addListener({
        event: (function(entry, event) {
            if(event.data.name === "jumpStart"){
               this.moveToNextPath(entry);
            }else   
            if(event.data.name === "reverse"){
               this.reversePlayer(entry);
            }else
            if(event.data.name === "jumpEnd"){
                this.d.state.addAnimation(4, "hair_jump1", false);
                this.d.state.addEmptyAnimation(4,1);
                this.checkCaseInteraction();
            }
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
    this.sequenceBuffer = 0;
    let dirBuffer = +this._dirX; // track direction path, (2,4,8,6 base:10)
    this.d.state.timeScale = 1.4; //TODO: MATH speed player dexterity
    for (let i=0, started = false, l=pathBuffer.length; i<l; i++) {
        const id = pathBuffer[i];
        const id_next = pathBuffer[i+1];
        const dir_next =  $Objs.getDirXFromId(id, id_next);
        // compute sequence need
        const ani_jump = Number.isFinite(id_next);
        const ani_reverse = this.needReverse(dirBuffer, dir_next);
        // add sequence aniamtions
         ani_reverse && this.d.state.addAnimation     (3, "reverse6to4", false);
         ani_jump    && this.d.state.addAnimation     (3, "jump1", false);
        !ani_jump    && this.d.state.addEmptyAnimation(3,0.1); // (trackIndex, mixDuration, delay)
        // update buffers
        ani_reverse && (dirBuffer = dir_next);
    };
};

_player.prototype.needReverse = function(dirBuffer=this._dirX, dir_next) {
    if(dir_next){
        return (10-dirBuffer) === dir_next;
    };
    return false;
};

_player.prototype.moveToNextPath = function(entry) {
    const id = this.pathBuffer[0];
    const id_next = this.pathBuffer[1];
    const toCase = Number.isFinite(id_next) && $Objs.list_cases[id_next];
    this.pathBuffer.shift(); // remove first id
    // tween
    this.tweenPosition.vars.x = toCase.x;
    this.tweenPosition.vars.y = toCase.y+toCase.height/3;
    this.tweenPosition._duration = 1;
    this.tweenPosition.invalidate(); // TODO: deep study source of this
    this.tweenPosition.play(0);
    // update setup
    this.zIndex = toCase.y;
    this.inCase = toCase;
};

_player.prototype.reversePlayer = function() {
        // tween
        this.tweenScale.vars.x = this.tweenScale.vars.x*-1;
        this.tweenScale._duration = 1;
        this.tweenScale.invalidate(); // TODO: deep study source of this
        this.tweenScale.play(0);
        // update setup
        this._dirX = 10-this._dirX; // reverse dir 
};


// when player jump to a case, do all stuff here
_player.prototype.checkCaseInteraction = function() {
   // stamina, sfx,fx , check auto-break cases .... 
   $Objs.newHitFX.call(this.inCase); // fx hit case
   $huds.displacement.addStamina(-1);
   //play audio
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