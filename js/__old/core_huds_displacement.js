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

  // add basic proprety
  initializeProprety() {
    this._stamina = 0;
    this.position.set(100,995);
    this.parentGroup = $displayGroup.group[4];
    this.slots = [];

      
    
  };
  // create spine displacement hud
  initialize() {
    const dataBase = $Loader.Data2.hud_displacement;

    // url("data2/Hubs/stamina/SOURCE/images/background.png"); 
    const masterBG = new PIXI.Container();
    const masterBG_d = new PIXI.Sprite(dataBase.textures.background);
    const masterBG_n = new PIXI.Sprite(dataBase.textures_n.background_n);
      masterBG_d.parentGroup = PIXI.lights.diffuseGroup;
      masterBG_n.parentGroup = PIXI.lights.normalGroup;
     //masterBG_d.pivot.set(masterBG_d.width/2,masterBG_d.height/2);
     //masterBG_n.pivot.set(masterBG_d.width/2,masterBG_d.height/2);
    masterBG.addChild(masterBG_d,masterBG_n);
    masterBG.pivot.set(masterBG.width/2,masterBG.height/2);

    // url("data2/Hubs/stamina/SOURCE/images/center_bottom.png"); 
    const masterBG2 = new PIXI.Container();
    const masterBG2_d = new PIXI.Sprite(dataBase.textures.center_bottom);
    const masterBG2_n = new PIXI.Sprite(dataBase.textures_n.center_bottom_n);
      masterBG2_d.parentGroup = PIXI.lights.diffuseGroup;
      masterBG2_n.parentGroup = PIXI.lights.normalGroup;
     // masterBG2_d.pivot.set(masterBG_d.width/2,masterBG_d.height/2);
     // masterBG2_n.pivot.set(masterBG_d.width/2,masterBG_d.height/2);
    masterBG2.addChild(masterBG2_d,masterBG2_n);
    masterBG2.pivot.set(masterBG2.width/2,masterBG2.height/2);
    this.masterBG2 = masterBG2;

    // url("data2/Hubs/stamina/SOURCE/images/centerBG.png"); 
    const shadow_top = new PIXI.Sprite(dataBase.textures.shadow);
      shadow_top.parentGroup = PIXI.lights.diffuseGroup;
      shadow_top.pivot.set(shadow_top.width/2,masterBG.pivot.y);
    this.shadow_top = shadow_top;
      // url("data2/Hubs/stamina/SOURCE/images/shadow_top.png"); 
    const shadow_dw = new PIXI.Sprite(dataBase.textures.shadow);
      shadow_dw.parentGroup = PIXI.lights.diffuseGroup;
      shadow_dw.pivot.set(shadow_dw.width/2,masterBG.pivot.y);
      shadow_dw.scale.y = -1;
      this.shadow_dw = shadow_dw;

    // url("data2/Hubs/stamina/SOURCE/images/center_top.png"); 
     const centerBG = new PIXI.Sprite(dataBase.textures.center_top);
     centerBG.parentGroup = PIXI.lights.diffuseGroup;
     centerBG.pivot.set(centerBG.width/2,centerBG.height/2);
      //centerBG.blendMode = 1;
      centerBG.alpha = 0.5;
      this.centerBG = centerBG;

    // slots items //TODO: remplacer par des sprites
    // url("data2/Hubs/stamina/SOURCE/images/itemSlot.png"); 
    for (let i=0, l=3; i<l; i++) {
      const itemSlot = new PIXI.Container();
      const itemslot_d = new PIXI.Sprite(dataBase.textures.itemSlot);
      itemSlot.d = itemslot_d;
      itemslot_d.pivot.set(itemslot_d.width/2,itemslot_d.height/2);
      itemSlot.addChild(itemslot_d);
      itemSlot.scale.set(0.5);
      itemSlot.position.set(-70+((itemslot_d.width/2+10)*i),0);
      itemSlot.parentGroup = $displayGroup.group[4]; //TODO: permet interaction correctement
    
      this.slots[i] = {itemSlot};
      itemSlot.parentSlot = this.slots[i];
      itemSlot._y = itemSlot.y; // mode slotItem vide
      itemSlot._yy = itemSlot.y-60+(i===1?-20:0); // mode stamina slots computed
      
      Object.defineProperties(this.slots[i], {
        "item": { // add item to slots
            set: function (id) {
                if(this.currentItem){
                  this.itemSlot.removeChild(this.currentItem);
                };
                if(Number.isFinite(id)){
                  const newItem = $items.createItemsSpriteByID(id);
                  this.currentItem = newItem;
                  this.itemSlot.addChild(newItem);
                }else{
                  this.currentItem = null;
                };
            },
            get: function () {
                return this.currentItem;
            },
        },
        _id : {value: i},
        currentItem : {value: null, writable: true},
    });
  };
      // TODO: MAKE STYLE LIBS, MAKE TEXT MANAGER 
      const style = new PIXI.TextStyle({ dropShadow: true, dropShadowAlpha: 0.4, 
        dropShadowAngle: 1.6, dropShadowBlur: 4, dropShadowDistance: 4, 
        fill: ["black", "#6d6d6d"], fillGradientStops: [0.5, 0.4], fontFamily: "zBirdyGame", 
        fontSize: 76, letterSpacing: -3, lineJoin: "round", miterLimit: 15, padding: 6,
        fontWeight: "bold", stroke: "white", strokeThickness: 6 });
        const txt = new PIXI.Text(this._stamina+'',style);
        txt.pivot.set(txt.width/2,txt.height/2);
        txt.renderable = false;
        txt.visible = false; // preven click
        this.staminaTxt = txt;

    this.addChild(masterBG,masterBG2,shadow_top,shadow_dw,centerBG);
    this.addChild(this.slots[0].itemSlot,this.slots[1].itemSlot,this.slots[2].itemSlot);
    this.addChild(txt);
  };
  //#endregion

  /*#region [rgba(0, 200, 0, 0.04)]
  ┌------------------------------------------------------------------------------┐
  TWEENS EASINGS DISPLACEMENTS
  https://greensock.com/docs/Core/Animation
  └------------------------------------------------------------------------------┘
  */
  setupTweens() {
    TweenMax.to(this.masterBG2, 60, {
        rotation: Math.PI*2,
        ease: Power0.easeNone,
        repeat: -1
    });
    this.shadow_top.rotation = -0.1
      TweenMax.to(this.shadow_top, 8, {
        rotation: 0.1,
        ease: Power1.easeInOut,
        repeat: -1,
        yoyoEase: true,
    });
    this.shadow_dw.rotation = 0.1
      TweenMax.to(this.shadow_dw, 8, {
        rotation: -0.1,
        ease: Power1.easeInOut,
        repeat: -1,
        yoyoEase: true,
    });
    // hold click roll dice
    this.timeLileRoll = new TimelineMax({
        paused: true,
        onComplete: () => {
          TweenMax.to(this.scale, 1, {x:1,y:1, ease: Elastic.easeOut.config(1.2, 0.1) });
          this.StartRoll();
        },
      });
      this.timeLileRoll.fromTo( this.scale, 1, {x:1,y:1},{x:1.3,y:1.3} );
    };

  show(duration) {
    this.d.state.addEmptyAnimation(1,0.1);
    this.move(100,995,duration);
  };

  hide(duration) {
    this.move(-150,850,duration);
  };

  show_modeDice() {
    this.d.state.setAnimation(1, "hover_dice", false);
    this.move(180,890,1);
  };

  show_modeBigSta() {
    this.move(140,940,2);
    this.d.state.setAnimation(1, "hover_stamina", false);
  };

  move(x,y,duration) {
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
  setupInteractions() {
    this.interactive = true;
    this.on('pointerover', this.pointerIN, this);
    this.on('pointerout', this.pointerOUT, this);
    this.on('pointerdown', this.pointerDW, this);
    this.on('pointerup', this.pointerUP, this);
    this.on('pointerupoutside', this.pointerUPOUT, this);
    // items slot
    this.slots.forEach(slot => {
      slot.itemSlot.interactive = true;
      slot.itemSlot.on('pointerover', this.IN_slots , this);
      slot.itemSlot.on('pointerout' , this.OUT_slots, this);
      slot.itemSlot.on('pointerup'  , this.UP_slots , this);
    });
  };

  pointerIN(e) {
    this.centerBG.blendMode = 1;
      TweenLite.to(this.scale, 1, { x: 1.3, y: 1.3, ease: Back.easeOut.config(1.7) });
      TweenLite.to(this.position, 0.8, { x: 140, y: 940, ease: Power3.easeOut });
  };

  pointerOUT(e) {
      this.centerBG.blendMode = 0;
      TweenLite.to(this.scale, 0.6, { x: 1, y: 1, ease: Back.easeOut.config(1.7) });
      TweenLite.to(this.position, 0.8, { x: 100, y: 995, ease: Elastic.easeOut.config(1, 0.3) });
  };

  pointerDW(e) {
    //TODO: utiliser https://greensock.com/forums/topic/18496-synchronize-progress-with-mousedown/?tab=comments#comment-85641
    // mais faire quand meme un time out pour activer le holdMode, et desactiver les interactive items ou autre pendant le progress.
    if(!this._stamina && (this.slots[0].item || this.slots[1].item || this.slots[2].item)){ // need a item TODO: voir si mieux utiliser onComplette ? 
      //TweenLite.to(this.shadow_top.scale, 3, {y: 1.3, ease: Power4.easeOut });
      //this._timeoutHoldRoll = setTimeout(() => this.StartRoll(), 1200);
      this.timeLileRoll.timeScale(1).play();
    }; 
  };
  pointerUP(e) {
    //TweenLite.to(this.shadow_top.scale, 0.4, {y: 1, ease: Power4.easeOut });
    if(!this._stamina){
      this.timeLileRoll._active && this.timeLileRoll.timeScale(4).reverse();
    }
    
  };
  pointerUPOUT(e) {
  
  };


  IN_slots(e) {
    const ee = e.currentTarget;
    TweenLite.to(ee.parentSlot.itemSlot.scale, 0.3, { x: 1, y: 1, ease: Power3.easeOut });
  };

  OUT_slots(e) {
    const ee = e.currentTarget;
    TweenLite.to(ee.parentSlot.itemSlot.scale, 0.3, { x: 0.5, y: 0.5, ease: Power3.easeOut });
  };

  UP_slots(e) {
    const ee = e.currentTarget;
    if(e.data.button === 0){
      if (!this._stamina && $mouse.holdingItem && !$huds.menuItems.renderable) { // si item dans mouse et mode menu
          ee.parentSlot.item = $mouse.holdingItem._id;
          $mouse.holdingItem = null;
      };
    };

  };
  //#endregion

  /*#region [rgba(0, 0, 0, 0.05)]
  ┌------------------------------------------------------------------------------┐
  METHODS
  └------------------------------------------------------------------------------┘
  */
  addStamina(value) {
    this._stamina+=value;
    this.staminaTxt.text = this._stamina;
    this.staminaTxt.pivot.set(this.staminaTxt.width/2,this.staminaTxt.height/2);
    this.staminaTxt.scale.set(1.5,1.5);
      TweenMax.to(this.staminaTxt.scale, 2, {
        x:1, y:1,
        ease: Elastic.easeOut.config(1.2, 0.1) ,
        delay:0.5,
    });

    TweenMax.to(this.scale, 0.3, { x: 1.3, y: 1.3, ease: Power2.easeOut });
    TweenMax.to(this.scale, 0.7, { x: 1, y: 1, ease: Back.easeOut.config(1.7), delay:0.3 });
  };

  StartRoll() {
    this.computeRollslots();
    this.slots.forEach(slot => {
      const yy = slot.itemSlot._yy;
      TweenLite.to(slot.itemSlot.scale, 1, { x: 0.35, y: 0.35, ease: Elastic.easeOut.config(1, 0.3) });
      TweenLite.to(slot.itemSlot.position, 1, { y: yy, ease: Elastic.easeOut.config(1, 0.3) });
    });
    this.staminaTxt.text = this._stamina;
    this.staminaTxt.pivot.set(this.staminaTxt.width/2,this.staminaTxt.height/2);
    this.staminaTxt.renderable = true;
    this.staminaTxt.visible = true;
  };

  // reset en mode pinGem, et clear les slots (fin du tour)
  clearRoll() {
    this.slots.forEach(slot => {
      slot.item = null;
      const y = slot.itemSlot._y;
      TweenLite.to(slot.itemSlot.scale, 1.2, { x: 0.5, y: 0.5, ease: Elastic.easeOut.config(1, 0.3) });
      TweenLite.to(slot.itemSlot.position, 1, { y: y, ease: Elastic.easeOut.config(1, 0.3) });
    });
    this.staminaTxt.renderable = false;
    this.staminaTxt.visible = false;
    this.timeLileRoll.timeScale(1).restart().pause(); // reset the timeline animation
  };

  //Calcul les combinaisons et les valeur de chaque dice ou obj
  computeRollslots() {
    let itemsDataSlots = this.slots.map(obj => obj.item?$items.list[obj.item._id]:false); // Liste des items data dans slots de la DB
    let diceResults = [];
    let totalStamina = 0;
    for (let i=0, l=itemsDataSlots.length; i<l; i++) {
      const item = itemsDataSlots[i]; 
      if(item && item.diceFactor){
        const min = item.diceFactor[0];
        const max = item.diceFactor[1];
        diceResults[i] = ~~( Math.random() * (max - min + 1) ) + min;
      }else{
        diceResults[i] = 0;
      }
    };
    totalStamina = (diceResults[0]+diceResults[1]+diceResults[2]);
    this._stamina = totalStamina;
  };
  //#endregion

};// END CLASS
