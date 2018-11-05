/*:
// PLUGIN □──────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/


/*#region [rgba(255, 255, 255, 0.07)]
┌------------------------------------------------------------------------------┐
  GLOBAL $huds.menuItems CLASS: _menu_items
  menu pour la gestion et l'attribution des pinGems et des items.
└------------------------------------------------------------------------------┘

// ┌------------------------------------------------------------------------------┐
// Menu Items
// hubsMenue affiche les items et manage le pinBar
// └------------------------------------------------------------------------------┘
pinGems => See Microsoft OneNote.
all      : permet de mettre pinner n'importquel type de items
diceGem  : oubligatoire d 'en agarder un , permet de pinner les diceGem pour naviger dans le jeux
food     : la nourriture permet d'etre mixer a des diceGem pour revigorer la faim, la soif. En combat , elle peut deconcentrer ou empoisoner un monstre
plant    : les plante sont surtout medicinal, elle augment, diminnue et soigne des etas
mineral  : les mineral sont utile pour fabriquer des dices ou augmenter le LV des Tools. Peut egalement service a de la constructions
alchemie : utiliser pour fabriquer des items, booster, keys magic. Peut egalement fabriquer des nouvelle magie
builder  : materieux permetant de fabriquer , des ponts, routes, arme, ... update des batiments..
tools    : outils pour les interaction et les action dans l'environements, certain outils seron limiter par leur nombre
keys     : objet collection unique permetant la progressio ndu storyboard.
*/

class _menu_items extends PIXI.Container{
  constructor() {
     super();
     this.initializeProprety();
      this.initialize();
    this.setupTweens();
    this.setupInteractions();

    this.hide();
  };
  // getters,setters

};

// add basic proprety
_menu_items.prototype.initializeProprety = function() {
  this.tweens = {};
  this.Sprites = {};
  this._currentFilter = false; 
  this._sortByLists = ["id","name","recent","weigth","quantity","value","rarity"];
  this._currentSort = 0;
  this.gemPinsNames =  Object.keys($items.types); // get gems name and filters
  this.gemPinsTints = Object.values($items.types).map(obj => obj.tint) // get gems color tint
  this.slots = [];//new Array(3).fill({}); // $items.totalGameItems
  const dataBase = $Loader.Data2.gameItems;
  for (let i=0, l=$items.totalGameItems; i<l; i++) { //$items.totalGameItems
      this.slots.push({items:{
          d:new PIXI.Sprite(dataBase.textures[i]), 
          n:new PIXI.Sprite(dataBase.textures_n[i+'n'])
          }
      });
      Object.defineProperty(this.slots[i], "renderables", { set: function (b) { 
          for (const key in this) {
              this[key].d.renderable = b;
              this[key].n.renderable = b;
          };
      } });
      Object.defineProperty(this.slots[i], "id", { value:i } );
      Object.defineProperty(this.slots[i], 'name', { value: $items.getNames(i) });
      Object.defineProperty(this.slots[i], 'type', { value: $items.getTypes(i) });
  };
  this.parentGroup = $displayGroup.group[4];
};

// create menu Items 
_menu_items.prototype.initialize = function() {
   // contour frame du menue
  const dataBase = $Loader.Data2.menueItems;
  const frames = new PIXI.Container();
  const frames_d = new PIXI.Sprite(dataBase.textures.menueItemFrame);
  const frames_n = new PIXI.Sprite(dataBase.textures_n.menueItemFrame_n);
  const w = frames_d.width, h = frames_n.height;
  frames_d.parentGroup = PIXI.lights.diffuseGroup;
  frames_n.parentGroup = PIXI.lights.normalGroup;
  frames.addChild(frames_d,frames_n);

  //MASK Master Container D,N for all masked elements
  const masked_d = new PIXI.Container(); // difuse menu mask limit 
  const masked_n = new PIXI.Container(); // normal menu mask limit
  const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
  masked_d.parentGroup = PIXI.lights.diffuseGroup;
  masked_n.parentGroup = PIXI.lights.normalGroup;
  mask.width  = w -42;
  mask.height = h -45;
  mask.position.set(15,20);
  masked_d.mask = mask;
  masked_n.mask = mask;

  this.initialize_background (masked_d,masked_n);
  this.initialize_items      (masked_d,masked_n);
  this.initialize_filters    (masked_d,masked_n);
  this.initialize_sorter   (masked_d,masked_n);
  this.addChild(masked_d,masked_n,mask,...this.filtersGems,frames,this.sortBox);

  this.pivot.set(frames.width/2,frames.height/2);
  this.position.set(1050,680);
  

};
// ini background and add to mask
_menu_items.prototype.initialize_items = function(masked_d,masked_n) {
  const dataBase = $Loader.Data2.menueItems;
  // build items
  for (let i=0, l=this.slots.length; i<l; i++) {
      // items frames containers
      const itemFrame_d = new PIXI.Sprite(dataBase.textures.itemsFrame);
      const itemFrame_n = new PIXI.Sprite(dataBase.textures_n.itemsFrame_n);
          itemFrame_d.pivot.set(itemFrame_d.width/2,itemFrame_d.height/2);
          itemFrame_n.pivot.set(itemFrame_n.width/2,itemFrame_n.height/2);
          masked_d.addChild(itemFrame_d);
          masked_n.addChild(itemFrame_n);
      this.slots[i].frames = {d:itemFrame_d, n:itemFrame_n};
      itemFrame_d.id = i; // permet de retoruver le slot pour easing animation TODO: FIXME:
      // text Background FX
      const txtFx_d = new PIXI.Sprite(dataBase.textures.bgTxtFocus);
      const txtFx_n = new PIXI.Sprite(dataBase.textures_n.bgTxtFocus_n);
          txtFx_d.blendMode = 1;
          txtFx_n.blendMode = 2;
          txtFx_d.alpha = 0.3;
          masked_d.addChild(txtFx_d);
          masked_n.addChild(txtFx_n);
      this.slots[i].txtFx = {d:txtFx_d, n:txtFx_n};
      const txt = `${$items.list[i]._name}\n *:6(2)\n [12]`;
      const spriteTxt = new PIXI.Text(txt,{fontSize:16,fill:0x000000,strokeThickness:2,stroke:0xffffff, fontFamily: "ArchitectsDaughter", letterSpacing: -1,fontWeight: "bold",lineHeight: 20});
      masked_d.addChild(spriteTxt);
      this.slots[i].txt = {d:spriteTxt, n:spriteTxt};
      spriteTxt.pivot.set(-45,40);
      // add items
      const item_d = this.slots[i].items.d;
      const item_n = this.slots[i].items.n;
      item_d.pivot.set(item_d.width/2,item_d.height/2);
      item_n.pivot.set(item_n.width/2,item_n.height/2);
      masked_d.addChild(this.slots[i].items.d);
      masked_n.addChild(this.slots[i].items.n);
  };
};
// ini background and add to mask
_menu_items.prototype.initialize_background = function(masked_d,masked_n) {
  // create x2 BGFX
  const dataBase = $Loader.Data2.menueItems;
  const bg1_d = new PIXI.Sprite(dataBase.textures.bgMaster);
  const bg1_n = new PIXI.Sprite(dataBase.textures_n.bgMaster_n);
      masked_d.addChild(bg1_d);
      masked_n.addChild(bg1_n);
  var bg2_d = new PIXI.Sprite(dataBase.textures.bgDiag);
  var bg2_n = new PIXI.Sprite(dataBase.textures_n.bgDiag_n);
      bg2_d.alpha = 0.2; bg2_n.alpha = 0.8;
      masked_d.addChild(bg2_d);
      masked_n.addChild(bg2_n);
  this.bgFX2 = {bg2_d,bg2_n}; // store for scope mouse FX deformation
  this.bgFX1 = {bg1_d, bg1_n}; // store for scope mouse FX deformation
  
};
// ini background and add to mask
_menu_items.prototype.initialize_filters = function(masked_d,masked_n) {
  // build filters gemPins
  const dataBase = $Loader.Data2.menueItems;
  const filtersGems = [];
  for (let i=0, x = 100, y = 55, l=this.gemPinsNames.length; i<l; i++,y+=48) {
      const filterFrame = new PIXI.Container();
      var d = new PIXI.Sprite(dataBase.textures.filters_frame);
      var n = new PIXI.Sprite(dataBase.textures_n.filters_frame_n);
          d.parentGroup = PIXI.lights.diffuseGroup;
          n.parentGroup = PIXI.lights.normalGroup;
          n.alpha = 0.3;
      filterFrame.addChild(d,n);
      filterFrame.scale.set(0.9,0.9)
      filterFrame.pivot.set(d.width/2,d.height/2);
      filterFrame.position.set(x,y);
      filterFrame.type = this.gemPinsNames[i];
      filtersGems.push(filterFrame);
      // Colored Gem inside frame
      const filters_button = new PIXI.Container(); 
      var d = new PIXI.Sprite(dataBase.textures.filters_button);
      var n = new PIXI.Sprite(dataBase.textures_n.filters_button_n);
          d.parentGroup = PIXI.lights.diffuseGroup;
          n.parentGroup = PIXI.lights.normalGroup;
          n.alpha = 0.3;
          d.tint = this.gemPinsTints[i];
      filters_button.addChild(d,n);
      filters_button.position.set(6,6);
      filterFrame.addChild(filters_button);
      filterFrame.gem = filters_button;
      // gem text
      const gemTxt = new PIXI.Text(this.gemPinsNames[i].toUpperCase(),{fontSize:18,fill:0xffffff,strokeThickness:4,stroke:0x000000, fontFamily: "ArchitectsDaughter", fontWeight: "bold"});
      gemTxt.pivot.set(gemTxt.width/2,gemTxt.height/2);
      gemTxt.position.set(69,23);
      gemTxt.scale.set(0.9,0.9);
      filterFrame.addChild(gemTxt);
      filterFrame.gemTxt = gemTxt;
      // gem txt quantity
      const qty = $items.pinGemsPossed[this.gemPinsNames[i]] ;
      const gemTxtQty = new PIXI.Text('*'+qty,{fontSize:18,fill:0xffffff,strokeThickness:4,stroke:0x000000, fontFamily: "ArchitectsDaughter", fontWeight: "bold"});
      gemTxtQty.pivot.set(0,gemTxt.height/2);
      gemTxtQty.position.set(130,23);
      gemTxtQty.scale.set(0.9,0.9);
      filterFrame.addChild(gemTxtQty);
      filterFrame.gemTxtQty = gemTxtQty;

  };
  this.filtersGems = filtersGems;
};
// ini background and add to mask
_menu_items.prototype.initialize_sorter = function(masked_d,masked_n) {
  const dataBase = $Loader.Data2.menueItems;
  const sortBy_box = new PIXI.Container();
  var d = new PIXI.Sprite(dataBase.textures.buttonFilterBy);
  var n = new PIXI.Sprite(dataBase.textures_n.buttonFilterBy_n);
      d.parentGroup = PIXI.lights.diffuseGroup;
      n.parentGroup = PIXI.lights.normalGroup;
      sortBy_box.addChild(d,n);
      sortBy_box.pivot.set(d.width/2,d.height/2);
      sortBy_box.position.set(800,20);
      sortBy_box.scale.set(0.9,0.9);
  // gem text
  const sortTxt = new PIXI.Text(`Sort By: ${this._sortByLists[0].toUpperCase()}`,{fontSize:18,fill:0xffffff,strokeThickness:2,stroke:0x000000, fontFamily: "ArchitectsDaughter", fontWeight: "bold"});
  sortTxt.pivot.set(sortTxt.width/2,sortTxt.height/1.6);
  sortTxt.position.copy(sortBy_box.pivot);
  sortTxt.scale.set(0.9,0.9);
  sortBy_box.addChild(sortTxt);
  sortBy_box.sortTxt = sortTxt;
  this.sortBox = sortBy_box;
};
//#endregion

/*#region [rgba(0, 200, 0, 0.04)]
┌------------------------------------------------------------------------------┐
TWEENS EASINGS DISPLACEMENTS mix with spine2D core
https://greensock.com/docs/Core/Animation
└------------------------------------------------------------------------------┘
*/
// setup and cache all thning need for easing tweens
_menu_items.prototype.setupTweens = function() {
  this.tweens = {
      Elastic1: Elastic.easeOut.config(0.5, 1),
      Elastic2: Elastic.easeInOut.config(0.5, 1),
  };
};

_menu_items.prototype.show = function(duration) {
  this.toogleInteractive(true);
  TweenLite.killTweensOf(this);
  TweenLite.set(this, { renderable: true });
  TweenLite.to(this.position, 0.4, {x:1050,y:680, ease:this.tweens.Elastic2,  });
  TweenLite.to(this.scale, 0.4, {x:1,y:1, ease:this.tweens.Elastic2, delay:0.1 });
  this.sortById();
  
};

_menu_items.prototype.hide = function(duration) {
  this.toogleInteractive(false);
  let _this = this;
  TweenLite.to(this.position, 0.3, {x:1050,y:680+400, ease:this.tweens.Elastic2, delay:0.1 });
  TweenLite.to(this.scale, 0.4, {x:0,y:0.9, ease:Power4.easeOut, onComplete: function(){
      TweenLite.set(_this, { renderable: false });
    }});
};

_menu_items.prototype.scalePinGem = function(pinGem,large) {
  if(large){
      TweenLite.to(pinGem.scale, 0.3, {x:1.15, ease:this.tweens.Back1});
      TweenLite.to(pinGem.scale, 0.4, {y:1.15, ease:Power4.easeInOut, delay:0.01});
      TweenLite.to(pinGem.gemTxt.scale, 0.4, {x:0.7,y:0.7, ease:Power4.easeInOut, delay:0.1});
  }else{
      TweenLite.to(pinGem.scale, 1, {x:0.9,y:0.9, ease:this.tweens.Elastic1});
      TweenLite.to(pinGem.gemTxt.scale, 0.7, {x:0.9,y:0.9, ease:Power4.easeInOut});
  };
};

//#endregion

/*#region [rgba(0, 0, 0, 0.4)]
┌------------------------------------------------------------------------------┐
INTERACTIONs EVENTS LISTENERS
pointerIN, pointerOUT, pointerUP
└------------------------------------------------------------------------------┘
*/
_menu_items.prototype.setupInteractions = function() {
  this.filtersGems.forEach(pinGem => {
      pinGem.on('pointerover' , this.IN_pinGem  , this);
      pinGem.on('pointerout'  , this.OUT_pinGem , this);
      pinGem.on('pointerup'   , this.UP_pinGem  , this);
  });
  this.slots.forEach(slot => {
      slot.frames.d.interactive = true;
      slot.frames.d.on('pointerover' , this.IN_itemSlot  , this);
      slot.frames.d.on('pointerout'  , this.OUT_itemSlot , this);
      slot.frames.d.on('pointerup'   , this.UP_itemSlot  , this);
  });
  this.sortBox.on('pointerover' , this.IN_sortBox  , this);
  this.sortBox.on('pointerout'  , this.OUT_sortBox , this);
  this.sortBox.on('pointerup'   , this.UP_sortBox  , this);
};
_menu_items.prototype.toogleInteractive = function(active) {
  //this.interactive = active;
  this.filtersGems.forEach(pinGem => {
      pinGem.interactive = active;
  });
  this.sortBox.interactive = active;
};

_menu_items.prototype.IN_itemSlot = function(e) {
  const slot  = e.currentTarget;
  const parentSlot = this.slots[slot.id]; //FIXME:  on peut pas utiliser sa , car quand on sort, la list array change
  slot.blendMode = 1;
  parentSlot.frames.n.blendMode = 1;
  const tl = new TimelineLite()
  .to( slot.scale, 0.4, { x:1.6,y:1.6, ease:Power4.easeOut } )
  .to( slot, 0.5, { rotation:-0.15, ease:Back.easeOut.config(1.7) } )
  .to( slot, 0.5, { rotation:0.15, ease:Power1.easeInOut , repeat: -1, yoyoEase: true } );
  // item
  TweenLite.to(parentSlot.items.d.scale, 0.8, {x:1.4,y:1.4, ease:Expo.easeOut});
  TweenLite.to(parentSlot.items.n.scale, 0.9, {x:1.4,y:1.4, ease:Expo.easeOut});
  // txt FX diffuse
  TweenLite.to(parentSlot.txtFx.d, 3, {alpha:0.8, ease:Expo.easeOut});
 
};
_menu_items.prototype.OUT_itemSlot = function(e) {
  const slot  = e.currentTarget;
  const parentSlot = this.slots[slot.id];
  slot.blendMode = 0;
  parentSlot.frames.n.blendMode = 0;
  TweenLite.killTweensOf(slot.scale);
  TweenLite.killTweensOf(slot);
  TweenLite.to(slot, 1, {rotation:0, ease:Elastic.easeOut.config(1.5, 0.3)});
  TweenLite.to(slot.scale, 0.3, {x:1,y:1, ease:Expo.easeOut});
  TweenLite.to(parentSlot.items.d.scale, 0.4, {x:1,y:1, ease:Expo.easeOut});
  TweenLite.to(parentSlot.items.n.scale, 0.4, {x:1,y:1, ease:Expo.easeOut});
  // txt FX diffuse
  TweenLite.to(parentSlot.txtFx.d, 2, {alpha:0.2, ease:Expo.easeOut});
};

_menu_items.prototype.UP_itemSlot = function(e) {
  const slot  = e.currentTarget;
};

_menu_items.prototype.IN_sortBox = function(e) {
  const sortBox  = e.currentTarget;
  TweenLite.to(sortBox.scale, 1, {x:1,y:1, ease:this.tweens.Elastic1});
};
_menu_items.prototype.OUT_sortBox = function(e) {
  const sortBox  = e.currentTarget;
  TweenLite.to(sortBox.scale, 1, {x:0.9,y:0.9, ease:this.tweens.Elastic1});
};

_menu_items.prototype.UP_sortBox = function(e) {
  const sortBox  = e.currentTarget;
  this.nextSortValue();
  TweenLite.to(sortBox.scale, 0.1, {x:1.15,y:1.05, ease:Power4.easeOut });
  TweenLite.to(sortBox.scale, 0.4, {x:1,y:1, ease:Power4.easeOut, delay:0.1 });
  sortBox.sortTxt.text = `Sort By: ${this._sortByLists[this._currentSort].toUpperCase()}`;
  sortBox.sortTxt.pivot.x = sortBox.sortTxt.width/2;
  if(this._currentSort===0){
      this.sortById();
  }else{
      this.sortByName();
  }
};

_menu_items.prototype.IN_pinGem = function(e) {
  const pinGem  = e.currentTarget;
  pinGem._filters = [new PIXI.filters.OutlineFilter (2, 0x000000, 1)]; // TODO:  make a filters managers cache
  this.scalePinGem(pinGem,true);
};
_menu_items.prototype.OUT_pinGem = function(e) {
  const pinGem  = e.currentTarget;
  pinGem._filters = null;
  this.scalePinGem(pinGem,false);
};
// filtrer les items selon le pinGem choisi "all" == no filter
_menu_items.prototype.UP_pinGem = function(e) {
  const pinGem  = e.currentTarget;
  if(e.data.button === 0){ // clickLeft_ <==
      const newFilter = pinGem.type!=="all" && pinGem.type || false;
      this._currentFilter = newFilter;
      this.refreshItemsGrid();
  }else
  if(e.data.button === 2){ // _clickRight ==>
      // prendre le pinGem pour le palcer dans un slot
  }else
  if(e.data.button === 1){ // click_Middle =>|<=

  }
};

//#endregion

// positionne les items et les sort
_menu_items.prototype.refreshItemsGrid = function() {
  const x = 260, y = 110;
  const margeX = 240;
  const margeY = 100;
  for (let i=0,xx=x,yy=y,ii=0, l=this.slots.length; i<l; i++) {
      const slot = this.slots[i];
      /*if(![1,5,6,8,7,12,24,56].contains(slot.id)){ //TODO: ajouter le system items pour players
          slot.renderables = false;
          continue;
      };*/
      if(this._currentFilter && this._currentFilter !== slot.type){
          slot.renderables = false;
          continue;
      };
      slot.renderables = true;
      TweenLite.to([slot.frames.d.position,slot.frames.n.position], 1+Math.random(), {x:xx,y:yy, ease:Power4.easeOut});
      TweenLite.to([slot.txtFx.d.position,slot.txtFx.n.position], 1+Math.random(), {x:xx,y:yy-40, ease:Power4.easeOut});
      TweenLite.to([slot.txt.d.position,slot.txt.n.position], 1+Math.random()/1.2, {x:xx,y:yy, ease:Power4.easeOut});
      TweenLite.to([slot.items.d.position,slot.items.n.position], 1+Math.random()*2.1, {x:xx,y:yy, ease:this.tweens.Elastic1});
      ii++===4 ? (xx=x,yy+=margeY,ii=0)  : xx+=margeX ;
  };
};

// positionner les items et les sort
// $huds.menuItems.sortById()
_menu_items.prototype.sortById = function() {
  this.slots.sort( function(a, b){return a.id-b.id } );
  this.refreshItemsGrid();
};
// $huds.menuItems.sortByName()
_menu_items.prototype.sortByName = function() {
  this.slots.sort( function(a, b){return ('' + a.name).localeCompare(b.name) } );
  this.refreshItemsGrid();
};

// change sorting value
_menu_items.prototype.nextSortValue = function(value) {
  if(value){
      this._currentSort = value;
  }else{
      if(this._currentSort++ === this._sortByLists.length-1){  this._currentSort = 0 }
  };
};

// temp test , interaction mouse du menu
_menu_items.prototype.makeInteractiveFX = function() {

  /*//TODO: DELETE ME 
  setInterval((function(){ 
      this.bgFX1.d.position.set(-($mouse.x/5)+100,($mouse.y/50));
      this.bgFX1.d.scale.x = 1+($mouse.x/10000);
      this.bgFX2.d.position.set((($mouse.x/100)-40)*-1,(($mouse.y/45)));
  }).bind(this), 20);
   //TODO: DELETE ME
  function testingwheel(e) {
      itemsFrames.forEach(item => {
          const yy = item.d.position.y+e.deltaY;
          const speed = ~~((Math.random() * 10) + 1)/100;
          TweenLite.to(item.d.position, 1+speed, {y:yy, ease:Power4.easeOut});
          TweenLite.to(item.n.position, 1+speed, {y:yy, ease:Power4.easeOut});
      });
      bgTxtFocus.forEach(item => {
          const yy = item.d.position.y+e.deltaY;
          TweenLite.to(item.d.position, 1.5, {y:yy, ease:Power4.easeOut});
          TweenLite.to(item.n.position, 1.2, {y:yy, ease:Power4.easeOut});
      });
  }
  document.addEventListener('wheel', testingwheel.bind(this));*/
  
};