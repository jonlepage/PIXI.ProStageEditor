/*:
// PLUGIN □──────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/


/*#region [rgba(255, 255, 255, 0.07)]
┌------------------------------------------------------------------------------┐
  GLOBAL $huds.pinBar CLASS: _huds_pinBar
  hubs pour pinners les items d'interactions
└------------------------------------------------------------------------------┘
*/
class _huds_pinBar extends PIXI.Container{
  constructor() {
     super();
     this.initializeProprety();
     this.initialize();
     this.setupTweens();
     this.setupInteractions();
     this.setPinSlotsAvaible(); // render only player start value slots avaible
  };
  // getters,setters
  get d() { return this.Sprites.d };
  get n() { return this.Sprites.n };

};

// add basic proprety
_huds_pinBar.prototype.initializeProprety = function() {
  this.tweens = {}; // store cache tween easing
  this.Sprites = {};
  this.startingPinBar = 11; // le player debut avec ce nombre de pinBar MAX 11
  this.pinGems = []; // store slots pinners for interactions
  this.rotator = null; // store rotator for hideShow bar
  this.showMode = 0; // mode for rotator, sleepmode, hide show.
  this.position.set(1830,1050);
  this.parentGroup = $displayGroup.group[4];
};

// create pinBar hud
_huds_pinBar.prototype.initialize = function() {
  const dataBase = $Loader.Data2.hudsPinBar;
  const masterBar = new PIXI.Container();
  const masterBar_d = new PIXI.Sprite(dataBase.textures.pinBar);
  const masterBar_n = new PIXI.Sprite(dataBase.textures_n.pinBar_n);
  masterBar_d.parentGroup = PIXI.lights.diffuseGroup;
  masterBar_n.parentGroup = PIXI.lights.normalGroup;
  masterBar.addChild(masterBar_d,masterBar_n);
  masterBar.pivot.set(masterBar_d.width-10,( masterBar_d.height/2)+8);
  this.masterBar = masterBar;
 

  const rotator = new PIXI.Container();
  const rotator_d = new PIXI.Sprite(dataBase.textures.rotator);
  const rotator_n = new PIXI.Sprite(dataBase.textures_n.rotator_n);
  rotator_d.parentGroup = PIXI.lights.diffuseGroup;
  rotator_n.parentGroup = PIXI.lights.normalGroup;
  rotator.addChild(rotator_d,rotator_n);
  rotator.pivot.set(rotator_d.width/2, rotator_d.height/2);
  rotator.position.set(-12, 0);
  this.rotator = rotator;

  this.initialisePinGems(masterBar);
  this.addChild(rotator,masterBar);
};

_huds_pinBar.prototype.initialisePinGems = function(masterBar) {
  const dataBase = $Loader.Data2.hudsPinBar;
  for (let i=0, x=87,y=27, mx=133, l=11; i<l; i++,x+=mx) { // add 11 pinGem 
      // bg Gem pinner
      const pinner = new PIXI.Container();
      const pinner_d = new PIXI.Sprite(dataBase.textures.pinner);
      const pinner_n = new PIXI.Sprite(dataBase.textures_n.pinner_n);
      pinner_d.parentGroup = PIXI.lights.diffuseGroup;
      pinner_n.parentGroup = PIXI.lights.normalGroup;
      pinner.addChild(pinner_d,pinner_n);
      pinner.pivot.set(pinner_d.width/2,pinner_d.height-8);

      // Gem
      const pinGem = new PIXI.Container();
      const pinGem_d = new PIXI.Sprite(dataBase.textures.pinGemL);
      const pinGem_n = new PIXI.Sprite(dataBase.textures_n.pinGemL_n);
      pinGem_d.parentGroup = PIXI.lights.diffuseGroup;
      pinGem_n.parentGroup = PIXI.lights.normalGroup;
      pinGem.addChild(pinGem_d,pinGem_n);
      pinGem.pivot.set(pinGem_d.width/2,pinGem_d.height/2);
      pinGem.scale.set(0.4,1)
      pinner.addChild(pinGem);
      pinGem.position.set(25,50);
      pinGem.id = i;
      
      masterBar.addChild(pinner)
      pinner.position.set(x,y);
      this.pinGems[i] = {pinner,pinGem};
      // TODO: MAKE class for change type or setter ?
      this.pinGems[i].type = 'diceGem';
      pinGem_d.tint = $items.types['diceGem'].tint;
  };
      
};

//#endregion

/*#region [rgba(0, 200, 0, 0.04)]
┌------------------------------------------------------------------------------┐
TWEENS EASINGS DISPLACEMENTS mix with spine2D core
https://greensock.com/docs/Core/Animation
└------------------------------------------------------------------------------┘
*/
// setup and cache all thning need for easing tweens
_huds_pinBar.prototype.setupTweens = function() {
  this.tweens = {
      Elastic1: Elastic.easeOut.config(1.2, 0.2),
      Back1:Back.easeOut.config(4),
  };
  TweenLite.to(this.rotator, 90, {
      rotation:Math.PI*2, ease:Power0.easeNone , repeat:-1 
  });
  let pinners_swing = 0.04;
  this.pinGems.forEach(obj => {
      obj.pinner.rotation = pinners_swing;
      const ani = TweenMax.to(obj.pinner, 8, {
          rotation: -pinners_swing,
          ease: Power2.easeInOut,
          repeat: -1,
          yoyoEase: true,
        });
        ani.seek( ~~(Math.random(8)*8) );
  });
  let bar_swing = 0.005;
  this.masterBar.rotation = bar_swing;
  TweenMax.to(this.masterBar, 6, {
      rotation: -bar_swing,
      ease: Power1.easeInOut,
      repeat: -1,
      yoyoEase: true,
    });
};

_huds_pinBar.prototype.show = function(duration) {
  // rotator masterBar swing
  const masterBar = new TimelineLite()
  .to( this.masterBar, 0.4, { rotation:-0.005, ease:Back.easeOut.config(1.2) } )
  .to( this.masterBar, 6, { rotation:0.005, ease:Power1.easeInOut , repeat: -1, yoyoEase: true } );
  let pinners_swing = 0.04;
  this.pinGems.forEach(obj => {
      obj.pinner.rotation = pinners_swing;
      const ani = TweenMax.to(obj.pinner, 8, {
          rotation: -pinners_swing,
          ease: Power2.easeInOut,
          repeat: -1,
          yoyoEase: true,
        });
        ani.seek( ~~(Math.random(8)*8) );
  });
};

_huds_pinBar.prototype.hide = function(duration) {
  // rotator swing
  const rotator = new TimelineLite()
  .to( this.rotator, 0.3, { rotation:-this.rotator.rotation*10, ease:Power2.easeIn } )
  .to( this.rotator, 0.4, { rotation:0, ease:Power2.easeOut } )
  .to( this.rotator, 90, { rotation:Math.PI*2, ease:Power0.easeNone , repeat: -1 } );
  // rotator masterBar swing
  TweenLite.killTweensOf(this.masterBar);
  TweenLite.to(this.masterBar, 0.5, {
      rotation:-Math.PI/2, ease:Back.easeIn.config(1.2),
  });
};

// make the huds in sleep mode, all pinGem will lateral
_huds_pinBar.prototype.sleepingMode = function(duration) {
  // rotator swing
  const rotator = new TimelineLite()
  .to( this.rotator, 0.7, { rotation:-this.rotator.rotation*10, ease:Power2.easeInOut } )
  .to( this.rotator, 90, { rotation:Math.PI*2, ease:Power0.easeNone , repeat: -1 } );
  // rotator masterBar swing
  const masterBar = new TimelineLite()
  .to( this.masterBar, 0.2, { rotation:0.02, ease:Power4.easeIn } )
  .to( this.masterBar, 0.7, { rotation:-0.005, ease:Back.easeOut.config(1.7) } )
  .to( this.masterBar, 6, { rotation:0.005, ease:Power1.easeInOut , repeat: -1, yoyoEase: true } );
  // pinGems
  this.pinGems.forEach(obj => {
      const masterBar = new TimelineLite()
      .to( obj.pinner, 1, { rotation:-Math.PI/2, ease:Bounce.easeOut } )
  });
};

_huds_pinBar.prototype.scalePinGem = function(pinGem,large) {
  if(large){
      TweenLite.to(pinGem.scale, 0.3, {x:1, ease:this.tweens.Back1});
  }else{
      TweenLite.to(pinGem.scale, 0.2, {x:0.4, ease:this.tweens.Elastic1});
  };
};
_huds_pinBar.prototype.scaleRotator = function(rotator,large) {
  if(large){
      TweenLite.to(rotator.scale, 0.8, {x:1.05,y:-1.05, ease:this.tweens.Back1});
  }else{
      TweenLite.to(rotator.scale, 0.5, {x:1,y:-1, ease:this.tweens.Back1});
  };
};
//#endregion

/*#region [rgba(0, 0, 0, 0.4)]
┌------------------------------------------------------------------------------┐
INTERACTIONs EVENTS LISTENERS
pointerIN, pointerOUT, pointerUP
└------------------------------------------------------------------------------┘
*/
_huds_pinBar.prototype.setupInteractions = function() {
  // rotator: controle la rotation showHide du hud
  this.rotator.interactive = true;
  this.rotator.on('pointerover', this.IN_rotator , this);
  this.rotator.on('pointerout' , this.OUT_rotator, this);
  this.rotator.on('pointerup'  , this.UP_rotator , this);
  // pinGem
  this.pinGems.forEach(obj => {
      obj.pinGem.interactive = true;
      obj.pinGem.on('pointerover', this.IN_pinGem , this);
      obj.pinGem.on('pointerout' , this.OUT_pinGem, this);
      obj.pinGem.on('pointerup'  , this.UP_pinGem , this);
  });
};

_huds_pinBar.prototype.IN_pinGem = function(e) {
  const pinGem  = e.currentTarget;
  pinGem._filters = [new PIXI.filters.OutlineFilter (2, 0x000000, 1)]; // TODO:  make a filters managers cache
  this.scalePinGem(pinGem,true);
 
};

_huds_pinBar.prototype.OUT_pinGem = function(e) {
  const pinGem  = e.currentTarget;
  pinGem._filters = null;
  this.scalePinGem(pinGem,false);
  
};

// TODO: faire un sytem global event manager et interaction dans mouse
_huds_pinBar.prototype.UP_pinGem = function(e) {
  const pinGem  = e.currentTarget;
  // si un items est dans la mouse, verifier si possible et ajouter a la pinGem
  if($mouse.holdingItem){
    this.tryAddItemToPinGem(pinGem,$mouse.holdingItem);
  }else
  if(e.data.button === 0){ // clickLeft_ <==
     //FIXME: FAST menue items show
     $huds.menuItems.hide();
  }else
  if(e.data.button === 2){ // _clickRight ==>
     //FIXME: FAST menue items show
     $huds.menuItems.show();
  }else
  if(e.data.button === 1){ // click_Middle =>|<=

  }
};

_huds_pinBar.prototype.IN_rotator = function(e) {
  const rotator  = e.currentTarget;
  rotator._filters = [new PIXI.filters.OutlineFilter (2, 0x000000, 1)]; // TODO:  make a filters managers cache
  this.scaleRotator(rotator,true);
};

_huds_pinBar.prototype.OUT_rotator = function(e) {
  const rotator  = e.currentTarget;
  rotator._filters = null;
  this.scaleRotator(rotator,false);
};

// TODO: faire un sytem global event manager et interaction dans mouse
_huds_pinBar.prototype.UP_rotator = function(e) {
  const rotator = e.currentTarget;
  switch (this.showMode++) {
      case 0: this.sleepingMode(); break;
      case 1: this.hide(); break;
      case 2: this.showMode = 0; this.show(); break;
  }
};

//#endregion

// rendering player posseded pinSlots 
_huds_pinBar.prototype.setPinSlotsAvaible = function() {
  const posseded = $items.pinSlotPossed;
  const slots = this.pinGems
  for (let i=0, l= slots.length; i<l; i++) {
      const pinSlot = slots[i].pinner.renderable = i<posseded;
  };
      
};


// TODO: faire un sytem global event manager et interaction dans mouse
_huds_pinBar.prototype.tryAddItemToPinGem = function(pinGem,items) {
  console.log('items: ', items);
  
  const data = this.pinGems[pinGem.id];
  if(items.data.type === data.type){
    data.pinGem.parent.addChild(items.sprite); //TODO:
  }

  
};