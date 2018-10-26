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
    get pinBar() { return this.hudsList.pinBar };
    get stats() { return this.hudsList.stats };

};

$huds = new _huds();
console.log1('$huds.', $huds);

// hubs prototype
_huds.prototype.initialize = function() {
    // creates all hubs [displacements,stats,]
    this.hudsList.displacements = new _huds_displacement();
    this.hudsList.pinBar = new _huds_pinBar();
    this.hudsList.stats = new _huds_stats();
    
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


/*#region [rgba(60, 60, 120, 0.03)]
// ┌------------------------------------------------------------------------------┐
// Hub Displacement
// hubs de stamina pour deplacement
// └------------------------------------------------------------------------------┘
*/

class _huds_pinBar extends PIXI.Container{
    constructor() {
       super();
        this.maxPinBar = 15;
        this.startingPinBar = 3; // le nombre de pinBar que le joueur debute
        this.initialize();
    };
    // getters,setters
    get colorBar() { return this.pinners.colorBar };
    get pinBar() { return this.pinners.pinBar };

};


// create pinBar hud
_huds_pinBar.prototype.initialize = function() {
    const dataBase = $Loader.Data2.hudsPinBar;
    // create master bg slider bar
    const masterPinBar = new PIXI.Container();
    let d = new PIXI.Sprite(dataBase.textures.pinBarSlider);
    let n = new PIXI.Sprite(dataBase.textures_n.pinBarSlider_n);
    d.parentGroup = PIXI.lights.diffuseGroup;
    n.parentGroup = PIXI.lights.normalGroup;
    masterPinBar.addChild(d,n);
    // create pinners
    let pinners = new PIXI.Container();
    pinners.pinnerID = [];
    for (let i=0, l=this.maxPinBar, x = 50, marge = 100; i<l; i++, x+=marge) {
        const d = new PIXI.Sprite(dataBase.textures.pinner);
        const n = new PIXI.Sprite(dataBase.textures_n.pinner_n);
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup;
        d.position.set(x,25);
        n.position.set(x,25);
        d.pivot.set(d.width/2, d.height/2);
        n.pivot.set(n.width/2, n.height/2);
        d.id = i;
        pinners.pinnerID[i] = d;
        pinners.addChild(d,n);
    
    };
    // create pinBars : ce sont les bar attachable au pinners, commence avec 3 renderable.
    // ont pourra attacher des couleur au bar lorsquel seront renderable
    pinners.pinBar = [];
    for (let i=0, l=this.maxPinBar; i<l; i++) {
        const isVisible =  i<this.startingPinBar;
        const d = new PIXI.Sprite(dataBase.textures.pinBar);
        const n = new PIXI.Sprite(dataBase.textures_n.pinBar_n);
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup;
        d.position.copy(pinners.pinnerID[i].position);
        n.position.copy(d.position);
        d.pivot.set(d.width/2, d.height-10);
        n.pivot.set(n.width/2, n.height-10);
        d.renderable = isVisible;
        n.renderable = isVisible;
        d.id = i;
        d.n = n; // link normal
        pinners.pinBar[i] = d;
        pinners.addChild(d,n);
    };
    // add colorPinBar attachement. par default , toujours type:dice
    pinners.colorBar = [];
    for (let i=0, l=this.maxPinBar; i<l; i++) {
        const isVisible =  pinners.pinBar[i].renderable;
        const d = new PIXI.Sprite(dataBase.textures.cBar_dice_S);
        const n = new PIXI.Sprite(dataBase.textures_n.cBar_dice_S_n);
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup;
        d.position.copy(pinners.pinnerID[i].position);
        n.position.copy(d.position);
        d.pivot.set(d.width/2, d.height+2);
        n.pivot.set(n.width/2, n.height+2);
        d.renderable = isVisible;
        n.renderable = isVisible;
        d.id = i;
        console.log('d: ', d);
        d.n = n; // link normal
        pinners.colorBar[i] = d;
        pinners.addChild(d,n);
    };
    
    this.pinners = pinners;
    this.parentGroup = $displayGroup.group[4]; //FIXME:
    this.addChild(masterPinBar,pinners);
    this.pivot.x = this.width;
    this.x = 1840, this.y = 1020;
    //setup
    this.setupInteractions();

};

_huds_pinBar.prototype.setupInteractions = function() {
    this.colorBar.forEach(cBar => {
        cBar.interactive = true;
        //d.on('pointerover', this.pointer_overIN, this);
        //d.on('pointerout', this.pointer_overOUT, this);
        cBar.on('pointerup', this.pointer_UP, this);
    });
};

// TODO: faire un sytem global event manager et interaction dans mouse
_huds_pinBar.prototype.pointer_UP = function(e) {
    this.setBarMode_Large(e);
};

_huds_pinBar.prototype.setBarMode_Large = function(e) {
    console.log('e: ', e);
    const cBar = e.currentTarget;
    cBar.scale.x = 3;
    cBar.n.scale.x = 3;
   console.log(this);

};

//#endregion



/*#region [rgba(20, 20, 100, 0.09)]
// ┌------------------------------------------------------------------------------┐
// Hub stats
// hubs affiche les stats
// └------------------------------------------------------------------------------┘
*/

class _huds_stats extends PIXI.Container{
    constructor() {
       super();
       //[hp:heath point], [mp:magic point], [hg:hunger], [hy:hydratation], [miw:max items weight], [mic:max item capacity]
       //[atk:attack], [def:defense], [sta:stamina], [lck:luck], [exp:exploration], [int:intelligence]
        this.statsList_L = ['hp','mp','hg','hy','miw','mic']
        this.statsList_S = ['atk','def','sta','lck','exp','int'];

        this.initialize();
    };
    // getters,setters
    get d() { return this.Sprites.d };
    get n() { return this.Sprites.n };
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

        master_S.addChild(barColorS, icon);
        this.addChild(master_S);
        // master states position
        master_S.position.set(x,y);
        y===45? (y=0, x+=145) : y=45;
    });
    this.parentGroup = $displayGroup.group[4]; //FIXME:
    this.position.set(4,6);

};

//#endregion