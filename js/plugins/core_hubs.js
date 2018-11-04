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
    masterBar.pivot.set(masterBar_d.width, masterBar_d.height/2);
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
    for (let i=0, x=86,y=30, mx=133, l=11; i<l; i++,x+=mx) { // add 11 pinGem 
        // bg Gem pinner
        const pinner = new PIXI.Container();
        const pinner_d = new PIXI.Sprite(dataBase.textures.pinner);
        const pinner_n = new PIXI.Sprite(dataBase.textures_n.pinner_n);
        pinner_d.parentGroup = PIXI.lights.diffuseGroup;
        pinner_n.parentGroup = PIXI.lights.normalGroup;
        pinner.addChild(pinner_d,pinner_n);
        pinner.pivot.set(pinner_d.width/2,pinner_d.height-6);

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
        
        masterBar.addChild(pinner)
        pinner.position.set(x,y);
        this.pinGems[i] = {pinner,pinGem};
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
    for (let i=0, l=35; i<l; i++) { //$items.totalGameItems
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
            masked_d.addChild(itemFrame_d);
            masked_n.addChild(itemFrame_n);
        this.slots[i].frames = {d:itemFrame_d, n:itemFrame_n};
        // text Background FX
        const txtFx_d = new PIXI.Sprite(dataBase.textures.bgTxtFocus);
        const txtFx_n = new PIXI.Sprite(dataBase.textures_n.bgTxtFocus_n);
            txtFx_d.blendMode = 1;
            txtFx_n.blendMode = 2;
            txtFx_n.alpha = 0.5;
            masked_d.addChild(txtFx_d);
            masked_n.addChild(txtFx_n);
        this.slots[i].txtFx = {d:txtFx_d, n:txtFx_n};
        const txt = `iron gearing\n *:6(2)\n [12]`;
        const spriteTxt = new PIXI.Text(txt,{fontSize:16,fill:0x000000,strokeThickness:2,stroke:0xffffff, fontFamily: "ArchitectsDaughter", letterSpacing: -1,fontWeight: "bold",lineHeight: 20});
        masked_d.addChild(spriteTxt);
        this.slots[i].txt = {d:spriteTxt, n:spriteTxt};
        spriteTxt.pivot.x = -74;
        // add items 
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
    this.sortBox.on('pointerover' , this.IN_sortBox  , this);
    this.sortBox.on('pointerout'  , this.OUT_sortBox , this);
    this.sortBox.on('pointerup'   , this.UP_sortBox  , this);
};
_menu_items.prototype.toogleInteractive = function(active) {
    this.interactive = active;
    this.filtersGems.forEach(pinGem => {
        pinGem.interactive = active;
    });
    this.sortBox.interactive = active;
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

// positionner les items et les sort
_menu_items.prototype.refreshItemsGrid = function() {
    const x = 200, y = 75;
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
        TweenLite.to([slot.txtFx.d.position,slot.txtFx.n.position], 1+Math.random(), {x:xx,y:yy, ease:Power4.easeOut});
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