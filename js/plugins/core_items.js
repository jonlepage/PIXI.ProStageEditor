/*:
// PLUGIN □──────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/

/*
┌------------------------------------------------------------------------------┐
  GLOBAL $huds CLASS: _huds
  Controls and manage all bases class hubs 
└------------------------------------------------------------------------------┘
*/
class _huds{
    constructor() {
        this.hudsList = {};
        this.menuList = {};
    };
    // getters,setters
    get displacement() { return this.hudsList.displacements };
    get pinBar() { return this.hudsList.pinBar };
    get stats() { return this.hudsList.stats };
    get menuItems() { return this.menuList.menuItems };
};

$huds = new _huds();
console.log1('$huds', $huds);

// initialise all huds and menues from Scene_Boot.prototype.initialize
_huds.prototype.initialize = function() {
    // creates all hubs [displacements,stats,]
    this.hudsList.displacements = new _huds_displacement();
    this.hudsList.pinBar = new _huds_pinBar();
    this.hudsList.stats = new _huds_stats();
    this.menuList.menuItems = new _menu_items();
};

// get avaible huds and menues return array for addchilds
_huds.prototype.getHubsList = function() {
    const list = [];
    this.displacement && list.push(this.displacement);
    this.pinBar       && list.push(this.pinBar      );
    this.stats        && list.push(this.stats       );
    this.menuItems    && list.push(this.menuItems   );
    return list;
};


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
    this.pinners = []; // store spine slots pinners for interactions
    this.rotator = null; // store rotator for hideShow bar
    this.showMode = 0; // mode for rotator, sleepmode, hide show.
    this.position.set(1840,1048);
};

// create pinBar hud
_huds_pinBar.prototype.initialize = function() {
    const dataBase = $Loader.Data2.hudsPinBar;
    const d = new PIXI.spine.Spine(dataBase.spineData);
    const n = d.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)
    this.Sprites.d = d;
    this.Sprites.n = n;

    const idle = d.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
    idle.timeScale = 0.6;

    // pinGems 
    for (let i = 1, l = 12; i < l; i++) {
        const pinner  = d.skeleton.findSlot("pinner" +i).currentSprite;
        const pinGem  = d.skeleton.findSlot("pinGemL"+i).currentSprite;
        const pinItem = d.skeleton.findSlot("pinItem"+i).currentSprite;
        pinner  .renderable = false;
        pinGem  .renderable = false;
        pinItem .renderable = false;
        this.pinners.push({pinner,pinGem,pinItem});
    }
    // remove pinners for initialise game
    for (let i = 0, l = this.startingPinBar; i < l; i++) {
        const p = this.pinners[i];
        p.pinner .renderable = true;
        p.pinGem .renderable = true;
        p.pinItem.renderable = true;
    }

    d.parentGroup = $displayGroup.group[4]; //FIXME:
    d.stateData.defaultMix = 0.2;
    d.skeleton.setSlotsToSetupPose();
    
    // asign proprety
    this.rotator = d.skeleton.findSlot("rotator").currentSprite;

    this.addChild(d);
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
};

_huds_pinBar.prototype.show = function(duration) {
    this.d.state.addEmptyAnimation(1,0.1);
};

_huds_pinBar.prototype.hide = function(duration) {
    this.d.state.setAnimation(1, "hide", false);
};

// make the huds in sleep mode, all pinGem will lateral
_huds_pinBar.prototype.sleepingMode = function(duration) {
    this.d.state.setAnimation(1, "sleepingMode", false);
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
    this.pinners.forEach(slots => {
        slots.pinGem.interactive = true;
        slots.pinGem.on('pointerover', this.IN_pinGem , this);
        slots.pinGem.on('pointerout' , this.OUT_pinGem, this);
        slots.pinGem.on('pointerup'  , this.UP_pinGem , this);
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
    if(event.data.button === 0){ // _clickRight ==>

    }else
    if(event.data.button === 2){ // clickLeft_ <==

    }else
    if(event.data.button === 1){ // click_Middle =>|<=

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

/*#region [rgba(0, 0, 0, 0.05)]
┌------------------------------------------------------------------------------┐
  METHODS
└------------------------------------------------------------------------------┘
*/

//#endregion


/*#region [rgba(255, 255, 255, 0.07)]
┌------------------------------------------------------------------------------┐
  GLOBAL $huds.stats CLASS: _huds_stats
  huds qui affiche les states general
└------------------------------------------------------------------------------┘
*/
class _huds_stats extends PIXI.Container{
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
_huds_stats.prototype.initializeProprety = function() {
    this.tweens = {};
    this.Sprites = {};
    this.icons = []; // access icons lists
    //[hp:heath point], [mp:magic point], [hg:hunger], [hy:hydratation], [miw:max items weight], [mic:max item capacity]
    this.statsList_L = ['hp','mp','hg','hy','miw','mic'];
    //[atk:attack], [def:defense], [sta:stamina], [lck:luck], [exp:exploration], [int:intelligence]
    this.statsList_S = ['atk','def','sta','lck','exp','int'];
};

// create states hud
_huds_stats.prototype.initialize = function() {
    const dataBase = $Loader.Data2.hudStats;
    // scope method
    function assignGroups(d,n){
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup;
    }
    let x = 0, y = 0;
    let tint_L = [0xff0000,0x8c00ff,0x00ff08,0x00d4ff,0xffb600,0x684810];
    this.statsList_L.forEach(state => {
        console.log2('state: ', state);
        // create master_L
        const master_L = new PIXI.Container();
        var d = new PIXI.Sprite(dataBase.textures.masterBar_L);
        var n = new PIXI.Sprite(dataBase.textures_n.masterBar_L_n);
        assignGroups(d,n);
        master_L.addChild(d,n);
        // create BG for barColor
        const bgBar = new PIXI.Container();
        var d = new PIXI.Sprite(dataBase.textures.barBG_L);
        var n = new PIXI.Sprite(dataBase.textures_n.barBG_L_n);
        d.position.set(45,2);
        n.position.copy(d.position);
        assignGroups(d,n);
        bgBar.addChild(d,n);
        // create barColor large
        const barColorL = new PIXI.Container();
        var d = new PIXI.Sprite(dataBase.textures.barColor_L);
        var n = new PIXI.Sprite(dataBase.textures_n.barColor_L_n);
        d.position.set(45+4,2+3);
        n.position.copy(d.position);
        d.tint = tint_L.shift();
        d.blendMode = 1;
        assignGroups(d,n);
        barColorL.addChild(d,n);
        // create icon TODO: make spine icon animated
        const icon = new PIXI.Container();
        var d = new PIXI.Sprite(dataBase.textures[`${state}_icon`]);
        var n = new PIXI.Sprite(dataBase.textures_n[`${state}_icon_n`]);
        assignGroups(d,n);
        icon.addChild(d,n);
        this.icons.push(icon);
        master_L.addChild(bgBar, barColorL, icon);
        this.addChild(master_L);
        // master states position
        master_L.position.set(x,y);
        y===45? (y=0, x+=220) : y=45;
    });
    // create small states
    this.statsList_S.forEach(state => {
        console.log2('state: ', state);
        // create master_S
        const master_S = new PIXI.Container();
        var d = new PIXI.Sprite(dataBase.textures.barMaster_S);
        var n = new PIXI.Sprite(dataBase.textures_n.barMaster_S_n);
        assignGroups(d,n);
        master_S.addChild(d,n);
        // create barColor small
        const barColorS = new PIXI.Container();
        var d = new PIXI.Sprite(dataBase.textures.barColor_S);
        var n = new PIXI.Sprite(dataBase.textures_n.barColor_S_n);
        d.position.set(50,4);
        n.position.copy(d.position);
        assignGroups(d,n);
        barColorS.addChild(d,n);
        // create icon TODO: make spine icon animated
        const icon = new PIXI.Container();
        var d = new PIXI.Sprite(dataBase.textures[`${state}_icon`]);
        var n = new PIXI.Sprite(dataBase.textures_n[`${state}_icon_n`]);
        assignGroups(d,n);
        icon.addChild(d,n);
        this.icons.push(icon);
        master_S.addChild(barColorS, icon);
        this.addChild(master_S);
        // master states position
        master_S.position.set(x,y);
        y===45? (y=0, x+=145) : y=45;
    });
    this.parentGroup = $displayGroup.group[4]; //FIXME:
    this.position.set(1920/4,6);
};
//#endregion

/*#region [rgba(0, 200, 0, 0.04)]
┌------------------------------------------------------------------------------┐
  TWEENS EASINGS DISPLACEMENTS
  https://greensock.com/docs/Core/Animation
└------------------------------------------------------------------------------┘
*/
_huds_stats.prototype.setupTweens = function() {
    this.tweens.position = new TweenLite(this.position, 0, {
        x:this.position.x,
        y:this.position.y,
        ease:Elastic.easeOut.config(1.2, 0.4),
    });
    this.tweens.position_statesIcons = new TweenLite(this.icons, 0, {
        //x:this.position.x,
        y:this.position.y,
        ease:Bounce.easeOut,
    });
};

_huds_stats.prototype.renderabled = function(a,b,c) {
    console.log('a,b,c: ', a,b,c);
    this.renderabled = false;
};

_huds_stats.prototype.show = function(duration) {
    this.move(1920/4,10,duration);
    duration && this.moveIcons(0,0,duration);
};

_huds_stats.prototype.hide = function(duration) {
    this.move(1920/4,-120,duration);
    duration && this.moveIcons(null,-35,duration);
};

_huds_stats.prototype.move = function(x,y,duration) {
    if(duration){
        const t = this.tweens.position;
        t.vars.x = x;
        t.vars.y = y;
        t._duration = duration;
        t.invalidate();
        t.play(0);
    }else{ this.position.set(x,y) };
};
_huds_stats.prototype.moveIcons = function(x,y,duration) {
        const t = this.tweens.position_statesIcons;
        // t.vars.x = x;
        t.vars.y = y;
        t._duration = duration*1.2;
        t.invalidate();
        t.play(0);
};
//#endregion

/*#region [rgba(0, 0, 0, 0.4)]
┌------------------------------------------------------------------------------┐
  INTERACTIONs EVENTS LISTENERS
  pointerIN, pointerOUT, pointerUP
└------------------------------------------------------------------------------┘
*/
_huds_stats.prototype.setupInteractions = function() {
    $player.interactive = true;
    // TODO: $player faire un sytem global event manager et interaction dans mouse
    $player.on('pointerover', this.pointerIN, this);
    $player.on('pointerout', this.pointerOUT, this);
    //$player.on('pointerup', this.pointerUP, this);
};

_huds_stats.prototype.pointerIN = function(e) {
    this.show(1);
};

_huds_stats.prototype.pointerOUT = function(e) {
    this.hide(1);
};

_huds_stats.prototype.pointerUP = function(e) {
    
};
//#endregion

/*#region [rgba(0, 0, 0, 0.05)]
┌------------------------------------------------------------------------------┐
  METHODS
└------------------------------------------------------------------------------┘
*/

//#endregion














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
    };
    // getters,setters

};

// add basic proprety
_menu_items.prototype.initializeProprety = function() {
    this.tweens = {};
    this.Sprites = {};
    this.gemPinsTints = [0xffffff,0x425bd9 ,0xc42626,0x40b312,0xb7b7b7,0xbb42f3,0x8a5034,0x464646,0x584615]; // also use as filters
    this.gemPinsNames = ["all"   ,"diceGem","food"  ,"plant" ,"mineral","alchemie","builder","tools","keys"]; // also use as filters
    this.filtersGems = [];
    this._sortByLists = ["name","recent","weigth","quantity","value","rarity"];
    this.interactive = true; // TODO: prevents map back map interaction
};

// create menu Items 
_menu_items.prototype.initialize = function() {
    const dataBase = $Loader.Data2.menueItems;
    // contour frame du menue
    const frames = new PIXI.Container();
    var d = new PIXI.Sprite(dataBase.textures.menueItemFrame);
    var n = new PIXI.Sprite(dataBase.textures_n.menueItemFrame_n);
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup;
        frames.pivot.set(d.width/2,d.height/2);
    frames.addChild(d,n);
    
    //MASK container split D,N for masking scroll items
    const masked_d = new PIXI.Container(); // difuse menu mask limit 
    const masked_n = new PIXI.Container(); // normal menu mask limit
        masked_d.parentGroup = PIXI.lights.diffuseGroup;
        masked_n.parentGroup = PIXI.lights.normalGroup;
    const mask_d = new PIXI.Sprite(PIXI.Texture.WHITE);
    //const mask_n = new PIXI.Sprite(PIXI.Texture.WHITE);
        mask_d.width = d.width-42, mask_d.height = d.height-45;
       // mask_n.width = d.width-42, mask_n.height = d.height-45;
        mask_d.position.set(42,45);
       // mask_n.position.set(42,45);
    masked_d.mask = masked_d.addChild(mask_d);
    masked_n.mask = mask_d;
    // create x2 BGFX
    var d = new PIXI.Sprite(dataBase.textures.bgMaster);
    var n = new PIXI.Sprite(dataBase.textures_n.bgMaster_n);
        masked_d.addChild(d);
        masked_n.addChild(n);
    this.bgFX1 = {d,n}; // store for scope mouse FX deformation
    var d = new PIXI.Sprite(dataBase.textures.bgDiag);
    var n = new PIXI.Sprite(dataBase.textures_n.bgDiag_n);
        d.alpha = 0.2; n.alpha = 0.8;
        masked_d.addChild(d);
        masked_n.addChild(n);
    this.bgFX2 = {d,n}; // store for scope mouse FX deformation
    masked_d.pivot.set(d.width/2,d.height/2);
    masked_n.pivot.set(n.width/2,n.height/2);
        
    // build filters gemPins
    const filtersGems = [];
    for (let i=0, x = -700, y = -190, l=this.gemPinsNames.length; i<l; i++,y+=48) {
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
    };
    this.filtersGems = filtersGems;
    
    // build items
    let maxGameItemsType = 120; //FIXME: add a game items limits
    let itemsFrames = []; // empty item frame avaible
    let bgTxtFocus = []; // empty item frame avaible
    for (let i=0, x = 250, y = 75, xx=0, l=maxGameItemsType; i<l; i++,x+=250) {
        // items frames containers
        var d = new PIXI.Sprite(dataBase.textures.itemsFrame);
        var n = new PIXI.Sprite(dataBase.textures_n.itemsFrame_n);
            d.position.set(x,y);
            n.position.set(x,y);
            masked_d.addChild(d);
            masked_n.addChild(n);
    
        itemsFrames.push({d,n});

        // text Background FX
        var d = new PIXI.Sprite(dataBase.textures.bgTxtFocus);
        var n = new PIXI.Sprite(dataBase.textures_n.bgTxtFocus_n);
            d.blendMode = 1;
            n.blendMode = 2;
            d.position.set(x,y);
            n.position.set(x,y);
            masked_d.addChild(d);
            masked_n.addChild(n);
            bgTxtFocus.push({d,n});
        xx++;
        if(xx===5){
            xx=0;
            x = 0;
            y+=87;
        }
    };
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
    document.addEventListener('wheel', testingwheel.bind(this));

    // build filterBy
    const sortBy_box = new PIXI.Container();
    var d = new PIXI.Sprite(dataBase.textures.buttonFilterBy);
    var n = new PIXI.Sprite(dataBase.textures_n.buttonFilterBy_n);
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup;
        sortBy_box.addChild(d,n);
        sortBy_box.pivot.set(d.width/2,d.height/2);
        sortBy_box.position.set(0,-230);
        sortBy_box.scale.set(0.9,0.9);
    // gem text
    const sortTxt = new PIXI.Text(`Sort By: ${this._sortByLists[0].toUpperCase()}`,{fontSize:18,fill:0xffffff,strokeThickness:2,stroke:0x000000, fontFamily: "ArchitectsDaughter", fontWeight: "bold"});
    sortTxt.pivot.set(sortTxt.width/2,sortTxt.height/1.6);
    sortTxt.position.copy(sortBy_box.pivot);
    sortTxt.scale.set(0.9,0.9);
    sortBy_box.addChild(sortTxt);
    sortBy_box.sortTxt = sortTxt;
    
    this.parentGroup = $displayGroup.group[4];
    this.addChild(masked_d,masked_n,frames,sortBy_box,...filtersGems);
    this.position.set(1050,680);
    //TODO: DELETE ME 
    setInterval((function(){ 
        this.bgFX1.d.position.set(-($mouse.x/5)+100,($mouse.y/50));
        this.bgFX1.d.scale.x = 1+($mouse.x/10000);

        this.bgFX2.d.position.set((($mouse.x/100)-40)*-1,(($mouse.y/45)));


        //this.bgFX2.d.rotation = $mouse.x/70000;
        
       
    }).bind(this), 20);
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
        Elastic1: Elastic.easeOut.config(1.2, 0.2),
        Back1:Back.easeOut.config(4),
    };
};

_menu_items.prototype.show = function(duration) {
    
};

_menu_items.prototype.hide = function(duration) {
    
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
    // rotator: controle la rotation showHide du hud
    this.filtersGems.forEach(pinGem => {
        pinGem.interactive = true;
        pinGem.on('pointerover' , this.IN_pinGem  , this);
        pinGem.on('pointerout'  , this.OUT_pinGem , this);
        pinGem.on('pointerup'   , this.UP_pinGem  , this);
    });
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

// TODO: faire un sytem global event manager et interaction dans mouse
_menu_items.prototype.UP_pinGem = function(e) {
    const pinGem  = e.currentTarget;
    if(event.data.button === 0){ // _clickRight ==>

    }else
    if(event.data.button === 2){ // clickLeft_ <==

    }else
    if(event.data.button === 1){ // click_Middle =>|<=

    }
};

_menu_items.prototype.IN_rotator = function(e) {
    const rotator  = e.currentTarget;
    rotator._filters = [new PIXI.filters.OutlineFilter (2, 0x000000, 1)]; // TODO:  make a filters managers cache
    this.scaleRotator(rotator,true);
};

_menu_items.prototype.OUT_rotator = function(e) {
    const rotator  = e.currentTarget;
    rotator._filters = null;
    this.scaleRotator(rotator,false);
};

// TODO: faire un sytem global event manager et interaction dans mouse
_menu_items.prototype.UP_rotator = function(e) {
    const rotator = e.currentTarget;
    switch (this.showMode++) {
        case 0: this.sleepingMode(); break;
        case 1: this.hide(); break;
        case 2: this.showMode = 0; this.show(); break;
    }
};

//#endregion
//TODO: creer les hide show et animations, pour le menue et le pinHud 