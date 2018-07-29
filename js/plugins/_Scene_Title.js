/*:
// PLUGIN □────────────────────────────────□ Scene_Title □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Title
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
    this.CAGE_MOUSE.name = "CAGE_MOUSE";
    this.CAGE_MAP.name = "CAGE_MAP";
    this.CAGE_GUI.name = "CAGE_GUI";
*/

function Scene_Title() {
    this.initialize.apply(this, arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

Scene_Title.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this.currentHoverCommand = null;
    this.command = {}; // store Command by name{}
    this.waitReady = 40; // stabiliser
};


Scene_Title.prototype.create = function() {
    this.createSunLight(); // container background (diff,n)
    this.createBackgroundVideo(); // container background (diff,n)
    this.createTitleLogo();
    this.createCommandBGFX();
    this.createCommands();
};  
Scene_Title.prototype.createSunLight = function() {
    this.light_sunny =  new PIXI.lights.PointLight(0xffffff,10); // the sceen FX sun
    this.light_sunny.position.set(380, 240);
    this.addChild(this.light_sunny);

};   


Scene_Title.prototype.createBackgroundVideo = function() {
    const data = $Loader.reg._videos._title.bgVidTitle; // bg
    const cage = new PIXI.Container();
    const video_texture = PIXI.Texture.fromVideo(data.data);
    const video_controler = video_texture.baseTexture; // controler from source
    const video_sprite =  new PIXI.Sprite(video_texture);
    const blackTextureVideo = new PIXI.Sprite(PIXI.Texture.WHITE);
    // asign group display
    video_sprite.parentGroup = PIXI.lights.diffuseGroup;
    blackTextureVideo.parentGroup = PIXI.lights.normalGroup;
    cage.parentGroup = $displayGroup.group[0];
    cage.zIndex = 0;

    // setup && hack
    video_controler.source.loop = true;
    cage.name = 'videoBG';
    blackTextureVideo.width = 1920, blackTextureVideo.height = 1080;
    video_sprite.width = 1920, video_sprite.height = 1080;
    video_controler.source.play();

    // parenting
    cage.addChild(blackTextureVideo,video_sprite);
    this.CAGE_MAP.addChild(cage);
    // reference
    this.bgVideoControler = video_controler;
};

Scene_Title.prototype.createTitleLogo = function() {
    const data = $Loader.reg._misc._title.logoTitle; // title logo
    const cage = new PIXI.Container();
    const tex_d = data.textures;
    const tex_n = data.textures_n;
    const sprite_d = new PIXI.extras.AnimatedSprite(tex_d);
    const sprite_n = new PIXI.Sprite(tex_n[0]);
        sprite_d.normalWith(sprite_n, tex_n); // convert ani to [diff,normal]
    // asign group display
    sprite_n.parentGroup = PIXI.lights.normalGroup;
    sprite_d.parentGroup = PIXI.lights.diffuseGroup;
    cage.parentGroup = $displayGroup.group[0];
    cage.zIndex = 1;
    // setup && hack
    cage.x = 350,cage.y = -100;
    sprite_d.animationSpeed = 0.2;
    sprite_d.play();
    // parenting
    cage.addChild(sprite_d, sprite_n);
    this.CAGE_MAP.addChild(cage);
    // reference
    cage.name = data.name;

};

Scene_Title.prototype.createCommandBGFX = function() {
    const data = $Loader.reg._misc._title.BGFX; // title logo
    const cage = new PIXI.Container(); // TODO: MAKE CUSTOM CONTROLER ANI CLASS
    const tetxure = data.textures;
    const spriteAni = new PIXI.extras.AnimatedSprite(tetxure);
    // setup or hack
    spriteAni.blendMode = 1;
    spriteAni.x = 1600,spriteAni.y = 600;
    spriteAni.animationSpeed = 0.2;
    spriteAni.getBounds();
    spriteAni.play();
    // filter aread for pad
    spriteAni.filterArea = spriteAni._boundsRect.clone();
    spriteAni.filterArea.pad(200,200)
    // parenting
    cage.addChild(spriteAni);
    this.CAGE_MAP.addChild(cage);
    // reference
    spriteAni.name = "BGCommandFX";
    this.BGFX = spriteAni;
};

Scene_Title.prototype.createCommands = function() {
    const data = $Loader.reg._misc._title.commandesTitles; // title logo
    const cage = new PIXI.Container(); // TODO: MAKE CUSTOM CONTROLER ANI CLASS
    let i = 0;
    data.dataFromSet.splitter.forEach(name => {
        const textures = data['textures'+name];
        const spriteAni = new PIXI.extras.AnimatedSprite(textures);
        // parenting
        cage.addChild(spriteAni);
        // setup or hack
        spriteAni.x = 1920;
        spriteAni.y = 720 + (spriteAni.height*i++);
        spriteAni.animationSpeed = 0.2;
        spriteAni.pivot.set(spriteAni.width,spriteAni.height/2)
        spriteAni.getBounds();
        spriteAni.play();
        // filter aread for pad
        spriteAni.filterArea = spriteAni._boundsRect.clone();
        spriteAni.filterArea.pad(200,200)
        
   
        // reference
        spriteAni.name = name;
        this.command[name] = spriteAni;
    });
    this.CAGE_MAP.addChild(cage);
};

Scene_Title.prototype.isReady = function() {
    // check scene stabilisator // TODO:
    Graphics.render(this);
    this.waitReady--;
   return !this.waitReady;
};

Scene_Title.prototype.start = function() {
    
};

Scene_Title.prototype.update = function() {
    if(!this.busy){
        this.mX = $mouse.x, this.mY = $mouse.y;
        this.update_Light();
        this.update_Command();
    };
};

// scene mouse update
Scene_Title.prototype.update_Light = function() {
    this.light_sunScreen.x =  this.mX, this.light_sunScreen.y = this.mY;
};


// scene mouse update
Scene_Title.prototype.update_Command = function() {
    let valueIn;
    for (const key in this.command) {
        const command = this.command[key];
        if(command._boundsRect.contains(this.mX, this.mY)){
            valueIn = command;
            break;
        };
    };
    if(valueIn){
        if(valueIn === this.currentHoverCommand){return}
        else {
            if(this.currentHoverCommand){
                this.currentHoverCommand._filters = null;
                this.currentHoverCommand.scale.set(1,1);
            };
            this.currentHoverCommand = valueIn;
            this.BGFX._filters = [ new PIXI.filters.OutlineFilter (20, 0xffffff, 1) ];
            valueIn._filters = [ new PIXI.filters.OutlineFilter (12, 0x000000, 1) ]; // thickness, color, quality
            valueIn.scale.set(1.5,1.5);
        }
    }else{
        if(this.currentHoverCommand){
            this.BGFX._filters = null;
            this.currentHoverCommand._filters = null;
            this.currentHoverCommand.scale.set(1,1);
            this.currentHoverCommand = null;
        };
    };
};

// onMouseup for this scene
Scene_Title.prototype.onMouseup = function(event) {
    if(this.currentHoverCommand.name === "CnewGame"){
        this.playCommand_startNewGame();
    };

};

// playCommand_startNewGame
Scene_Title.prototype.playCommand_startNewGame = function(selected) {
    $player.transferMap(1,1,1); // transfer + loader 
};
