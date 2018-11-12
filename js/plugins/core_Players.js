
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
        this.radius = null; // radius player range interactions
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
    this._scaleXY = 0.45;
    // player layers
    this.asignParentGroups();
    this.parentGroup = $displayGroup.group[1];
    this.zIndex = this.position._y;

    spine.skeleton.setSlotsToSetupPose();
    // radius range 
    const dataBase = $Loader.Data2.playerRadius;
    // url("data2/Hubs/menueItems/SOURCE/images/menueItemFrame.png"); 
    //contour frame du menue.
    /*const radius = new PIXI.Container();
    const radius_d = new PIXI.Sprite(dataBase.textures.playerRadiusLarge);
    const radius_n = new PIXI.Sprite(dataBase.textures_n.playerRadiusLarge_n);
    radius_d.parentGroup = PIXI.lights.diffuseGroup;
    radius_n.parentGroup = PIXI.lights.normalGroup;
    radius.addChild(radius_d, radius_n);
    radius.pivot.set(radius.width/2,radius.height/2);
    radius_d.blendMode = 0;
    radius_n.blendMode = 0;
    radius_d.alpha = 0.2;
    radius.scale.set(2)
    this.addChild(radius);*/


    this.setupListeners();
    this.setupTweens();
};

// setup all spine events for player1
// https://github.com/pixijs/pixi-spine/blob/master/examples/index.md
_player.prototype.setupListeners= function() {
    const checkEvent = (entry, event) => {
        if(event.data.name === "startMove"){
            this.moveToNextCaseID(entry);
        }else
        if(event.data.name === "nextMove"){
            this.updateNextPath(true,entry);
        }else
        if(event.data.name === "reversX"){
            this.reversX();
        }
    };

    this.d.state.addListener({
        event: checkEvent,
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
    this._isMoving = true;
    this.pathBuffer = pathBuffer;
    this._currentPath = 0;
    this._startCaseID = pathBuffer[this._currentPath];
    this._currentCaseID = pathBuffer[this._currentPath];
    this._nextCaseID = pathBuffer[this._currentPath+1];
    if(Number.isFinite(this._nextCaseID)){
        this.updateNextPath(false); // checkCaseEvents: false car on start
    }else{
        // a click sur la case du player donc pas de move!
    }

};


_player.prototype.updateNextPath = function(checkCaseEvents) {
    this.inCase = $Objs.list_cases[this._nextCaseID];
    this._currentCaseID = this.pathBuffer[this._currentPath];
    this._nextCaseID = this.pathBuffer[++this._currentPath];
    const state = this.d.state;
    if(checkCaseEvents){
        this.checkCaseEvents();
    }
    state.timeScale = 1.2; //TODO: MATH speed player dexterity with easing
    if($huds.displacement._stamina && Number.isFinite(this._nextCaseID)){

        const nextDirection =  $Objs.getDirXFromId(this._currentCaseID, this._nextCaseID); // get dir base 10
        this.needReversX(nextDirection) && state.addAnimation(3, "reversX", false);
        state.addAnimation(3, "jump1", false);
    }else{
        state.addEmptyAnimation(3,0.2); //(trackIndex, mixDuration, delay)
        this._isMoving = false;
        if(!$huds.displacement._stamina){ // plus de stamina, END TURN
            $huds.displacement.clearRoll();
        }
        $Objs.activeInteractive();
    };
};

_player.prototype.needReversX = function(nextDirection) {
    return nextDirection !== this._dirX;
};
_player.prototype.reversX = function() {
    this._dirX = 10-this._dirX;
    const xx = this._dirX === 6 && this._scaleXY || this._scaleXY*-1;
    TweenLite.to(this.scale, 1, { x:xx, ease: Power3.easeOut });
};

// easing update x,y to this._nextCaseID
_player.prototype.moveToNextCaseID = function(entry) {
    const toCase = $Objs.list_cases[this._nextCaseID];
    // tween
    TweenLite.to(this.position, 1, { x:toCase.x, y:toCase.y+30, ease: Power3.easeOut });
    // update setup
    this.zIndex = toCase.y;
};

// when player jump to a case, do all stuff here
_player.prototype.checkCaseEvents = function() {
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