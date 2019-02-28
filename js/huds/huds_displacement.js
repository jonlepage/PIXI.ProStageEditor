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
      this._stamina = 0;
      this.sprites ={}; // store les couche layers des cercle pour animations
      this.slots = []; // store les slots items
      this.diceColors = []; // cache les couleurs apres un roll, permet autoriser les paths selon couleur des cases
  };
  /** si contien au moin 1 dice */
  get isValidSlotSetup(){ return this.slots.some((s)=>{return s && s.item}) };

  initialize() {
    this.position.set(120,$camera._screenH-120);
    this.position.zeroSet();
    this.setupSprites();
    this.setupTweens();
    this.setupInteractions();
  };

  // create spine displacement hud
  setupSprites() {
    const dataBase = $Loader.Data2.hud_displacement;
    const dhbC = new PIXI.Container(); // displacementHudBottomContainer
    const dhb_d = dhbC.d = new PIXI.Sprite(dataBase.textures.hudS_centerBottom);
    const dhb_n = dhbC.n = new PIXI.Sprite(dataBase.textures_n.hudS_centerBottom_n);
    dhb_n.alpha = 0.6;
    dhb_d.anchor.set(0.5);
    dhb_n.anchor.set(0.5);
    dhb_d.parentGroup = PIXI.lights.diffuseGroup;
    dhb_n.parentGroup = PIXI.lights.normalGroup ;
    dhbC.addChild(dhb_d,dhb_n);
    const dhmC = new PIXI.Container();// displacementHudMiddleContainer
    const dhm_d = dhmC.d = new PIXI.Sprite(dataBase.textures.hudS_centerMiddle);
    const dhm_n = dhmC.n =new PIXI.Sprite(dataBase.textures_n.hudS_centerMiddle_n);
    dhm_n.alpha = 0.6;
    dhm_d.anchor.set(0.5);
    dhm_n.anchor.set(0.5);
    dhm_d.parentGroup = PIXI.lights.diffuseGroup;
    dhm_n.parentGroup = PIXI.lights.normalGroup ;
    dhmC.addChild(dhm_d,dhm_n);
    //displacementHudMiddle diffuse only
    const dht_d = new PIXI.Sprite(dataBase.textures.hudS_centerTop);
    dht_d.parentGroup = PIXI.lights.normalGroup;
    dht_d.blendMode = 2;
    dht_d.alpha = 0.6;
    dht_d.scale.set(2)
    dht_d.anchor.set(0.5);
    // stamina text
    const style = new PIXI.TextStyle({ fontSize: 40, fill: "white",strokeThickness: 12,fontFamily: "ArchitectsDaughter" });
    const staText = new PIXI.Text(this._stamina||'ADD DICE', style);
    staText.anchor.set(0.5);
    // slots
    const slots = [];
    for (let i=0, l=3,pivX=80; i<l; i++) {
      const slotC = new PIXI.Container();// displacementHudMiddleContainer
      const slot_d = slotC.d = new PIXI.Sprite(dataBase.textures.hudS_itemSlots);
      const slot_n = slotC.n = new PIXI.Sprite(dataBase.textures_n.hudS_itemSlots_n);
      slotC.setItemId = (id)=>{
        if(slotC.item){
          slotC.removeChild(slotC.item);
          slotC.item = null;
          slotC._iID = null;
        };
        if(Number.isFinite(id)){
          const newItem = $items.createItemsSpriteByID(id);
          slotC.item = newItem;
          slotC.addChild(newItem);
          slotC._iID = id;
          slotC.item = newItem;
        };
      };
      slot_n.alpha = 0.5;
      slot_d.anchor.set(0.5);
      slot_n.anchor.set(0.5);
      slot_d.parentGroup = PIXI.lights.diffuseGroup ;
      slot_n.parentGroup = PIXI.lights.normalGroup  ;
      slotC.addChild(slot_d,slot_n);
      slots.push(slotC);
      slotC.position.x = pivX;
      slotC.position.y = 100*(i%2)||80;
      slotC.scale.set(0.7);
      slotC.position.zeroSet();
      pivX=(-80*(i%2));
    };
       
     
    // url("data2/Hubs/stamina/SOURCE/images/background.png"); 
    /*const masterBG = new PIXI.Container();
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
      centerBG.blendMode = 1;
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
*/
    
    this.addChild(dhbC,dhmC,dht_d,staText,...slots);
    this.sprites = {c0:dhbC,c1:dhmC,c2:dht_d,staText};
    this.slots = slots;
  };
  //#endregion

  /*#region [rgba(0, 200, 0, 0.04)]
  ┌------------------------------------------------------------------------------┐
  TWEENS EASINGS DISPLACEMENTS
  https://greensock.com/docs/Core/Animation
  └------------------------------------------------------------------------------┘
  */
  setupTweens() {
    TweenMax.to(this.sprites.c1, 45, { rotation:360*Math.PI/180  ,repeat:-1,ease: Power0.easeNone }); // infini
    TweenLite.to(this.sprites.c2, 45, { rotation:-360*Math.PI/180, repeat:-1,ease: Power0.easeNone });
    // hold click roll dice
    this.timeLileRoll = new TimelineMax({
        paused: true,
        onComplete: () => {
          TweenMax.to(this.scale, 1, {x:1,y:1, ease: Elastic.easeOut.config(1.2, 0.1) });
          //this.StartRoll();
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

  // temp disable when in menuItem or other interaction ?
  setDisable(value){
    this.interactiveChildren = !value;
    TweenMax.to(this, 0.4, {alpha:value?0.4:1, ease: Power4.easeOut });
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
    // items slots
    this.slots.forEach(slot => {
      slot.interactive = true;
      slot.on('pointerover', this.IN_slots , this);
      slot.on('pointerout' , this.OUT_slots, this);
      slot.on('pointerup'  , this.UP_slots , this);
    });
  };

  // disable allow interactive
  setInteractive(value) {
    this.interactive = value;
    // items slot
    for (let i=0, l=this.slots.length; i<l; i++) {
      this.slots[i].itemSlot.interactive = value;
    };
  };

  pointerIN(e) {
    this.sprites.c1.d.blendMode = 2;
      TweenLite.to(this.scale, 2, { x: 1.2, y: 1.2, ease: Back.easeOut.config(2) });
      TweenLite.to(this.position, 0.6, { x: 140, y: 920, ease: Power3.easeOut });
      TweenLite.to(this.sprites.c2.scale, 0.2, { x: 1.8, y: 1.8, ease: Back.easeOut.config(1.7) });
  };

  pointerOUT(e) {
    this.sprites.c1.d.blendMode = 0;
      TweenLite.to(this.scale, 0.6, { x: 1, y: 1, ease: Back.easeOut.config(1.7) });
      TweenLite.to(this.position, 0.8, { x: this.position.zero.x, y: this.position.zero.y, ease: Elastic.easeOut.config(1, 0.3) });
      TweenLite.to(this.sprites.c2.scale, 0.2, { x: 1.4, y: 1.4, ease: Back.easeOut.config(1.7) });
  };

  //TODO: utiliser https://greensock.com/forums/topic/18496-synchronize-progress-with-mousedown/?tab=comments#comment-85641
  pointerDW(e) {
    if(!$mouse.isHoldItem && this.isValidSlotSetup){
      this._powerShake = true;
      this.sprites.c2.alpha = 0
      this.sprites.c2.blendMode = 0;
      TweenLite.to(this.sprites.c2, 1.3, { alpha: 1, ease: Power4.easeOut });
      TweenLite.to(this.sprites.c2.scale, 0.2, { x: 3, y: 3, ease: Back.easeOut.config(1.7) });
      TweenLite.to(this.scale, 0.2, { x: 0.75, y: 0.75, ease: Back.easeOut.config(1.7) });
      const shaker = RoughEase.ease.config({ template:  Circ.easeOut, strength: 3, points: 50, taper: "in", randomize: true, clamp: true});
      TweenLite.to(this.sprites.c2.scale, 1, { delay:0.2, x: 1.4, y: 1.4, ease: shaker });
      var aaa = TweenLite.to(this.scale, 1.2, { delay:0.2, x: 1.3, y: 1.3, ease: shaker, onComplete:this.StartRoll,onCompleteScope:this });
      this.slots.forEach(slot => {
        TweenLite.to(slot.position, 1.2, { x: 0, y: 0, ease: SlowMo.ease.config(0.7, 0.7, false) });
      });
    };
  };

  pointerUP(e) {
    // si etai en mode shake
    if(this._powerShake){
      this._powerShake = false;
      TweenLite.killTweensOf([this.scale,this.sprites.c2.scale]);
      this.sprites.c2.blendMode = 2;
      TweenLite.to(this.sprites.c2.scale, 0.2, { x: 2, y: 2, ease: Back.easeOut.config(1.7) });
      TweenLite.to(this.sprites.c2, 0.5, { alpha: 0.5, ease: Power4.easeOut });
      this.slots.forEach(slot => {
        TweenLite.to(slot.position, 0.4, { x: slot.position.zero.x, y: slot.position.zero.y, ease: Power4.easeOut });
      });
    };
  };

  pointerUPOUT(e) {
    
  };


  IN_slots(e) {
    const ee = e.currentTarget;
    ee.d.blendMode = 1;
    TweenLite.to(ee.scale, 0.3, { x: 0.7, y: 0.7, ease: Power4.easeOut });
  };

  OUT_slots(e) {
    const ee = e.currentTarget;
    ee.d.blendMode = 0;
    TweenLite.to(ee.scale, 0.2, { x: 0.5, y: 0.5, ease: Power4.easeOut });
  };

  UP_slots(e) {
    const ee = e.currentTarget;
    if(e.data.button === 0){
      if ($mouse.isHoldItem) { // si item dans mouse et mode menu
          ee.setItemId($mouse._holdItemID);
          $mouse.setItemId(null);
          TweenLite.to(ee.scale, 0.3, { x: 1, y: 1, ease: Power4.easeOut });
      };
    };

  };
  //#endregion

  /*#region [rgba(0, 0, 0, 0.05)]
  ┌------------------------------------------------------------------------------┐
  METHODS
  └------------------------------------------------------------------------------┘
  */

 setStamina(value) {
  const staText = this.sprites.staText;
  staText.text = value;
  this._stamina = value;
  staText.scale.set(1.5,1.5);
  TweenMax.to(staText.scale, 1.6, {
      x:1, y:1,
      ease: Elastic.easeOut.config(1.2, 0.3) ,
      delay:0.5,
  });
  TweenMax.to(this.scale, 0.3, { x: 1.3, y: 1.3, ease: Power2.easeOut });
  TweenMax.to(this.scale, 0.7, { x: 1, y: 1, ease: Back.easeOut.config(1.7), delay:0.3 });
};

  addStamina(value) {
    const stxt = this.sprites.staText;
    this._stamina+=value;
    stxt.text = this._stamina;
    //stxt.pivot.set(stxt.width/2,stxt.height/2); // re-compute pivot ?
    stxt.scale.set(1.5,1.5);
    TweenMax.to(stxt.scale, 2, {
        x:1, y:1,
        ease: Elastic.easeOut.config(1.2, 0.1) ,
        delay:0.5,
    });

    TweenMax.to(this.scale, 0.2, { x: 1.3, y: 1.3, ease: Power2.easeOut });
    TweenMax.to(this.scale, 0.4, { x: 1, y: 1, ease: Back.easeOut.config(1.7), delay:0.3 });
  };

  StartRoll() {
    this._powerShake = false;
    this.scale.set(1.8);
    this.slots.forEach(slot => {
      slot.d.blendMode = 1;
      TweenLite.to(slot.position, 0.6, { x: slot.position.zero.x, y: slot.position.zero.y*-1, ease: Power4.easeOut });
    });
      const rollValues = this.computeRollslots(); // obtion un objet avec information roll,TODO: a mettre dans systems?
      this.setStamina(rollValues.totalStamina);
  };

  // reset en mode pinGem, et clear les slots (fin du tour)
  clearRoll() {
    this.slots.forEach(slot => {
      slot.item = null;
      const y = slot.itemSlot._y;
      TweenLite.to(slot.itemSlot.scale, 1.2, { x: 0.5, y: 0.5, ease: Elastic.easeOut.config(1, 0.3) });
      TweenLite.to(slot.itemSlot.position, 1, { y: y, ease: Elastic.easeOut.config(1, 0.3) });
    });
    this.slotColor = [];
    this.staminaTxt.renderable = false;
    this.staminaTxt.visible = false;
    this.timeLileRoll.timeScale(1).restart().pause(); // reset the timeline animation
  };

  //Calcul les combinaisons et les valeur de chaque dice ou obj
  computeRollslots() {
    let itemsDataSlots = this.slots.map(slot => slot.item? $items.list[slot._iID] : false); // Liste des items data dans slots de la DB
    console.log('itemsDataSlots: ', itemsDataSlots);
    let diceResults = [];
    let totalStamina = 0;
    let diceColors = [];
    for (let i=0, l=itemsDataSlots.length; i<l; i++) {
      const item = itemsDataSlots[i]; 
      if(item && item.diceFactor){
        const min = item.diceFactor[0];
        const max = item.diceFactor[1];
        diceResults[i] = ~~( Math.random() * (max - min + 1) ) + min;
        diceColors[i] = item._colorType; // add color autorisation
      }else{
        diceResults[i] = 0;
      }
    };
    totalStamina = (diceResults[0]+diceResults[1]+diceResults[2]);
    return {totalStamina,diceResults,diceColors};
  };
  //#endregion

};// END CLASS
