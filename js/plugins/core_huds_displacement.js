/*:
// PLUGIN □──────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/



/*#region [rgba(255, 255, 255, 0.07)]
┌------------------------------------------------------------------------------┐
  GLOBAL $huds.displacement CLASS: _huds_displacement
  hubs de stamina pour deplacement et injection des items
└------------------------------------------------------------------------------┘
*/
class _huds_displacement extends PIXI.Container{
  constructor() {
      super();
      this.initializeProprety();
      this.initialize();
      this.setupTweens();
      this.setupInteractions();
  };
  // getters,setters
  get d() { return this.Sprites.d };
  get n() { return this.Sprites.n };

};
// add basic proprety
_huds_displacement.prototype.initializeProprety = function() {
  this.tweens = {};
  this.Sprites = {};
  this.stamina = 9999;
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

  // setup stamina texte huds
  const slot = this.d.skeleton.findSlot("txt_stamina"); // 1px sprite slot for add text
  const style = new PIXI.TextStyle({ dropShadow: true, dropShadowAlpha: 0.4, 
      dropShadowAngle: 1.6, dropShadowBlur: 4, dropShadowDistance: 4, 
      fill: ["black", "#6d6d6d"], fillGradientStops: [0.5, 0.4], fontFamily: "zBirdyGame", 
      fontSize: 76, letterSpacing: -3, lineJoin: "round", miterLimit: 15, padding: 6,
      fontWeight: "bold", stroke: "white", strokeThickness: 6 });
  const txt = new PIXI.Text(this.stamina+'',style);
  txt.pivot.set(txt.width/2,txt.height/2);
  slot.currentSprite.addChild(txt);
  this.stamina_txt = txt;
 
  this.addChild(d);
};
//#endregion

/*#region [rgba(0, 200, 0, 0.04)]
┌------------------------------------------------------------------------------┐
TWEENS EASINGS DISPLACEMENTS
https://greensock.com/docs/Core/Animation
└------------------------------------------------------------------------------┘
*/
_huds_displacement.prototype.setupTweens = function() {
  this.tweens.position = new TweenLite(this.position, 0, {
      x:this.position.x,
      y:this.position.y,
      ease:Elastic.easeOut.config(1.2, 0.4),
      //onComplete:myFunction, onCompleteParams:["param1","param2"]; // myAnimation.eventCallback("onComplete", myFunction, ["param1","param2"]);
  });
};

_huds_displacement.prototype.show = function(duration) {
  this.d.state.addEmptyAnimation(1,0.1);
  this.move(100,995,duration);
};

_huds_displacement.prototype.hide = function(duration) {
  this.move(-150,850,duration);
};

_huds_displacement.prototype.show_modeDice = function() {
  this.d.state.setAnimation(1, "hover_dice", false);
  this.move(180,890,1);
};

_huds_displacement.prototype.show_modeBigSta = function() {
  this.move(140,940,2);
  this.d.state.setAnimation(1, "hover_stamina", false);
};

_huds_displacement.prototype.move = function(x,y,duration) {
  if(duration){
      const t = this.tweens.position;
      t.vars.x = x;
      t.vars.y = y;
      t._duration = duration;
      t.invalidate(); // TODO: deep study source of this
      t.play(0);
  }else{ this.position.set(x,y) };
};
//#endregion

/*#region [rgba(0, 0, 0, 0.4)]
┌------------------------------------------------------------------------------┐
INTERACTIONs EVENTS LISTENERS
pointerIN, pointerOUT, pointerUP
└------------------------------------------------------------------------------┘
*/
_huds_displacement.prototype.setupInteractions = function() {
  const d = this.d;
  d.interactive = true;
  d.on('pointerover', this.pointerIN, this);
  d.on('pointerout', this.pointerOUT, this);
  d.on('pointerup', this.pointerUP, this);
};

_huds_displacement.prototype.pointerIN = function(e) {
  this.show_modeBigSta();
};

_huds_displacement.prototype.pointerOUT = function(e) {
  this.show(1);
};

// TODO: faire un sytem global event manager et interaction dans mouse
_huds_displacement.prototype.pointerUP = function(e) {
  this.show_modeDice();
};
//#endregion

/*#region [rgba(0, 0, 0, 0.05)]
┌------------------------------------------------------------------------------┐
METHODS
└------------------------------------------------------------------------------┘
*/
_huds_displacement.prototype.addStamina = function(value) {
  this.stamina+=value;
  this.stamina_txt.text = this.stamina;
  this.d.state.setAnimation(1, "changeNumber", false);
  this.d.state.addEmptyAnimation(1,0.1);
};
//#endregion
