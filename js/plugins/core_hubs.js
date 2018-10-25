/*:
// PLUGIN □────────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc create player and setup for whole game
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $huds CLASS: _huds
//└------------------------------------------------------------------------------┘


/*#region [rgba(100, 30, 30, 0.07)]
// ┌------------------------------------------------------------------------------┐
// Hubs Parent Controllers
// Controls and manage all bases class hubs 
// └------------------------------------------------------------------------------┘
*/

class _huds{
    constructor() {
        this.hudsList = {};

    };
    // getters,setters
    get displacement() { return this.hudsList.displacements };

};

$huds = new _huds();
console.log1('$huds.', $huds);

// hubs prototype
_huds.prototype.initialize = function() {
    // creates all hubs [displacements,stats,]
    this.hudsList.displacements = new _huds_displacement();
};






// setup all tweens once or reset if need
// https://greensock.com/docs/Core/Animation
_huds.prototype.move = function(x,y) {
    // tween
    this.tweenPosition.vars.x = x;
    this.tweenPosition.vars.y = y;
    this.tweenPosition._duration = 0.5;
    this.tweenPosition.invalidate(); // TODO: deep study source of this
    this.tweenPosition.play(0);
};



//#endregion




/*#region [rgba(241, 244, 66, 0.03)]
// ┌------------------------------------------------------------------------------┐
// Hub Displacement
// hubs de stamina pour deplacement
// └------------------------------------------------------------------------------┘
*/
class _huds_displacement extends PIXI.Container{
    constructor() {
       super();
       this.Sprites = {};
       this.stamina = 9999;
        this.initialize();
    };
    // getters,setters
    get d() { return this.Sprites.d };
    get n() { return this.Sprites.n };

};

// create spine displacement hud
_huds_displacement.prototype.initialize = function() {
    const dataBase = $Loader.Data2.hud_displacement;
    const d = new PIXI.spine.Spine(dataBase.spineData);
    const n = d.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)
    this.Sprites.d = d;
    this.Sprites.n = n;

    const idle = d.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
    idle.timeScale = 0.05;

    d.parentGroup = $displayGroup.group[4]; //FIXME:
    d.stateData.defaultMix = 0.2;
    d.skeleton.setSlotsToSetupPose();

    this.setupStamina();
    this.setupInteractions();
    //this.setupListeners();
    this.setupTweens(d);
    this.hide();
    this.addChild(d);
};


_huds_displacement.prototype.setupStamina = function() {
    const slot = this.d.skeleton.findSlot("txt_stamina"); // 1px sprite slot
    const style = new PIXI.TextStyle({ dropShadow: true, dropShadowAlpha: 0.4, 
        dropShadowAngle: 1.6, dropShadowBlur: 4, dropShadowDistance: 4, 
        fill: ["black", "#6d6d6d"], fillGradientStops: [0.5, 0.4], fontFamily: "zBirdyGame", 
        fontSize: 76, letterSpacing: -3, lineJoin: "round", miterLimit: 15, padding: 6,
        fontWeight: "bold", stroke: "white", strokeThickness: 6 });
    const txt = new PIXI.Text(this.stamina+'',style);
    txt.pivot.set(txt.width/2,txt.height/2);
    slot.currentSprite.addChild(txt);
    this.stamina_txt = txt;
};

_huds_displacement.prototype.setupInteractions = function() {
    const d = this.d;
    d.interactive = true;
    d.on('pointerover', this.pointer_overIN, this);
    d.on('pointerout', this.pointer_overOUT, this);
    d.on('pointerup', this.pointer_UP, this);
};

// setup all tweens once or reset if need
// https://greensock.com/docs/Core/Animation
_huds_displacement.prototype.setupTweens = function() {
    this.tweenPosition = new TweenLite(this.position, 0, {
        x:this.position.x,
        y:this.position.y,
        ease:Elastic.easeOut.config(1.2, 0.4),
    });
};

_huds_displacement.prototype.hide = function(duration) {
    duration? this.move(-150,850,duration) : this.position.set(-150,850);
};

_huds_displacement.prototype.show = function(duration) {
    this.d.state.addEmptyAnimation(1,0.1);
    duration? this.move(100,995,duration) : this.position.set(100,995);
};

_huds_displacement.prototype.showDice = function() {
    this.move(180,890,1);
    this.d.state.setAnimation(1, "hover_dice", false);
};

_huds_displacement.prototype.showBigStamina = function() {
    this.move(140,940,2);
    this.d.state.setAnimation(1, "hover_stamina", false);
};

// tween move
_huds_displacement.prototype.move = function(x,y,duration) {
    this.tweenPosition.vars.x = x;
    this.tweenPosition.vars.y = y;
    this.tweenPosition._duration = duration;
    this.tweenPosition.invalidate(); // TODO: deep study source of this
    this.tweenPosition.play(0);
}; 

// interactions
_huds_displacement.prototype.pointer_overIN = function(e) {
    this.showBigStamina();
};

_huds_displacement.prototype.pointer_overOUT = function(e) {
    this.show(1);
};

// TODO: faire un sytem global event manager et interaction dans mouse
_huds_displacement.prototype.pointer_UP = function(e) {
    this.showDice();
};


_huds_displacement.prototype.addStamina = function(value) {
    this.stamina+=value;
    this.stamina_txt.text = this.stamina;
    this.d.state.setAnimation(1, "changeNumber", false);
    this.d.state.addEmptyAnimation(1,0.1);
};

//#endregion