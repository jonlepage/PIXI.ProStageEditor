/*:
// PLUGIN □────────────────────────────────□ Scene_Local □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Local
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
    this.CAGE_MOUSE.name = "CAGE_MOUSE";
    this.CAGE_MAP.name = "CAGE_MAP";
    this.CAGE_GUI.name = "CAGE_GUI";
*/

function Scene_Local(loaderSets,callBackScene,firstTime) {
    this.initialize.apply(this, arguments);
}

Scene_Local.prototype = Object.create(Scene_Base.prototype);
Scene_Local.prototype.constructor = Scene_Local;

Scene_Local.prototype.initialize = function(loaderSets,callBackScene,firstTime) {
    Scene_Base.prototype.initialize.call(this,"Scene_Local_data"); // pass loaderset for setup Scene ambiant
    this.mX = 0;
    this.mY = 0;
    this.currentHoverFlag = null; // when mouse are hover a flag
    this.waitReady = 30; // stabiliser
};

Scene_Local.prototype.create = function() {
    const bgName = $Loader.loaderSet.Scene_Local_data.SCENE.BackGround || false;
    this.createBackground(bgName); //TODO:
    this.create_ObjFromJson();
    //this.createLocalFlags();
    //this.createTexts();
    //this.createSpineAvatar();
};

// create Objs from json
Scene_Local.prototype.create_ObjFromJson = function() {
    $Objs.createFromList($Loader.loaderSet.Scene_Local_data.OBJS);
    this.CAGE_MAP.addChild(...$Objs.list_master);
};


// allow pass a sting reference data, or a full Data
Scene_Local.prototype.createBackground = function(bgName) {
    if(this.Background){
        this.CAGE_MAP.removeChild(this.Background);
    };
    const cage = new PIXI.Container();
    if(bgName){
        const data = typeof bgName === 'string' && $Loader.Data2[bgName] || bgName;
        //const data = _data || $Loader.reg._misc._bg.backgroud; // bg
        const sprite_d = new PIXI.Sprite(data.textures);
        const sprite_n = new PIXI.Sprite(data.textures_n);
        // asign group display
        sprite_d.parentGroup = PIXI.lights.diffuseGroup;
        sprite_n.parentGroup = PIXI.lights.normalGroup;
        cage.parentGroup = $displayGroup.group[0];
        cage.addChild(sprite_d, sprite_n);
    };

    cage.name = typeof bgName === 'string' &&  bgName || bgName && bgName.name || false;
    // parenting
    this.CAGE_MAP.addChildAt(cage,0); // at 0 ?
    // reference
    this.Background = cage;
};

Scene_Local.prototype.createLocalFlags = function() {
    const cageFlags = new PIXI.Container();
    const flagsList = $Loader.reg._misc._flags;
    // create all flags
    let x = 40, y = 700, i = 0;
    for (const key in flagsList) {
        // execute only on diffuse obj, bypass normal
        const data = flagsList[key];
        const cage = new PIXI.Container(); // cage for _d,_n // TODO: MAKE A CONTROLER ANIMATION CLASS
        const tex_d = data.textures;
        const tex_n = data.textures_n;
        const sprite_d = new PIXI.extras.AnimatedSprite(tex_d);
        const sprite_n = new PIXI.Sprite(tex_n[0]);
            sprite_d.normalWith(sprite_n, tex_n); // pass (sprite normal, textures normal)
        // asign group display
        sprite_n.parentGroup = PIXI.lights.normalGroup;
        sprite_d.parentGroup = PIXI.lights.diffuseGroup;
        cage.parentGroup = $displayGroup.group[0];
        cage.zIndex = 1;
        // parenting
        cage.addChild(sprite_d, sprite_n);
        cageFlags.addChild(cage);
        //setup
        cage.x = x+(cage.width*i++);
        cage.y = y;
        cage.reversed = false;
        cage.getBounds();
        sprite_d.loop = false;
        // reference
        cage.name = data.name;
        cage.txt1 = data.dataFromSet.txt1;
        cage.txt2 = data.dataFromSet.txt2;
        cage.sprite_d = sprite_d;
        cage.sprite_n = sprite_n;
        cage.localID = i;
    };
    //this.setupFlags();
    this.cageFlags = cageFlags;
    this.CAGE_MAP.addChild(cageFlags);
};

Scene_Local.prototype.createTexts = function() {
    const style = new PIXI.TextStyle({
        dropShadow: true,
        dropShadowAlpha: 0.2,
        dropShadowAngle: 0,
        dropShadowBlur: 18,
        dropShadowColor: "white",
        dropShadowDistance: 0,
        fill: "white",
        fontFamily: "\"Arial Black\", Gadget, sans-serif",
        fontSize: 18,
        letterSpacing: 1,
        lineJoin: "round",
        padding: 12,
        strokeThickness: 8
    });

    const titleSelect = new PIXI.Text(`PLEASE SELECT YOUR LANGUAGE`, style); //TODO: PREND TEXY DANS $CORETEXT
    titleSelect.pivot.x = titleSelect.width/2;
    titleSelect.x = SceneManager._boxWidth/2;
    titleSelect.y = SceneManager._boxHeight/5*3;
    this.CAGE_MAP.addChild(titleSelect);
    this.titleSelect = titleSelect;

    // assign text to flags
    this.cageFlags.children.forEach(cage => {
        const text = new PIXI.Text(cage.txt1, style);
        cage.addChild(text);
        text.pivot.x = text.width/2;
        text.x = 234/2;
    });
 
};


Scene_Local.prototype.createSpineAvatar = function() {
    const player = new PIXI.spine.Spine($Loader.reg._avatar._A1.avatarLocal.spineData);
    //player.convertToNormal("_n",true);
    // add render
    player.x = 930,player.y = 550;
    player.scale.set(2,2)
    this.CAGE_MAP.addChild(player);
    player.state.setAnimation(0, 'idle', true);
    player.state.setAnimation(2, 'hair_idle1', true);
    //reference
    this.avatar1 = player;

};



Scene_Local.prototype.isReady = function() {
    // check scene stabilisator // TODO:
    this.waitReady--;
   return !this.waitReady;
};

// start Loader
Scene_Local.prototype.start = function() {
   
};

Scene_Local.prototype.update = function() {
    /*if(!this.busy){
        this.mX = $mouse.x, this.mY = $mouse.y;
        this.update_Light();
        this.update_Flags();
    };*/
};

// scene mouse update
Scene_Local.prototype.update_Light = function() {
    this.light_sunScreen.x =  this.mX, this.light_sunScreen.y = this.mY;
};

// scene mouse update
Scene_Local.prototype.update_Flags = function() {
    const flags = this.cageFlags.children;
    let valueIn;
    for (let i = 0, l = flags.length; i < l; i++) {
        const flag = flags[i];
        if(flag._boundsRect.contains(this.mX, this.mY)){
            valueIn = flag;
        };
       };

    if(valueIn){
        if(valueIn === this.currentHoverFlag){return}
        else {
            if(this.currentHoverFlag){
                this.currentHoverFlag._filters = null;
                this.currentHoverFlag.sprite_d._filters = null;
                this.currentHoverFlag.sprite_d.gotoAndStop(0);
            }
            this.currentHoverFlag = valueIn;
            valueIn.sprite_d.gotoAndPlay(0);
            valueIn._filters = [ new PIXI.filters.OutlineFilter (6, 0xffffff, 1) ]; // thickness, color, quality
            valueIn.sprite_d._filters = [ new PIXI.filters.OutlineFilter (12, 0xffffff, 1) ]; // thickness, color, quality
            //this.avatar1.skeleton.skin = null; // not work, this keep hold skin slots
            this.avatar1.skeleton.setSkinByName("local_"+valueIn.localID);
            //this.avatar1.state.addAnimationByName(1,'idle_local_'+valueIn.localID,true,1)
            this.avatar1.state.setAnimation(1, 'idle_local_'+valueIn.localID, true);
            this.avatar1.skeleton.setSlotsToSetupPose(); // work
            this.titleSelect.text = valueIn.txt2;
        }
    };
};


// onMouseDown for this scene
Scene_Local.prototype.onMouseDown = function(event) {

};

// onMouseup for this scene
Scene_Local.prototype.onMouseup = function(event) {
   /* const selected = this.currentHoverFlag;
   if(this.currentHoverFlag && selected._boundsRect.contains(this.mX, this.mY) ){
        this.event1(selected);
   }
*/
};

// flag selected, close scene with animation //TODO:    
// problem detuit texture , mais les atlas reste.
Scene_Local.prototype.event1 = function(selected) {
    console.log('selected: ', selected);
    this.busy = true;
    SceneManager.goto(Scene_Loader,"loaderSet_TitleScene",Scene_Title);

};
