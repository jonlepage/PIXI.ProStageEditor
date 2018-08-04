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

//#region [rgba(0, 0, 0,0.3)]
// ┌------------------------------------------------------------------------------┐
// HEADER SCENE
// └------------------------------------------------------------------------------┘
function Scene_Title() {
    this.initialize.apply(this, arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

Scene_Title.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this,"Scene_Title_data"); // pass loaderset for setup Scene ambiant
    this.waitReady = 65; // stabiliser
};

// create element for scene.
Scene_Title.prototype.create = function() {
     // this.createBackgroundVideo();
};

Scene_Title.prototype.isReady = function() {
    // check scene stabilisator // TODO:
    Graphics.render(this); // force spike lag
    this.waitReady--;
   return !this.waitReady;
};

// start Loader
Scene_Title.prototype.start = function() {
   
};

Scene_Title.prototype.update = function() {
    if(!this.busy){

    };
};

//#endregion

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
//#region [rgba(0, 5, 5,0.5)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘
// onMouseDown for this scene
Scene_Title.prototype.onMouseDown = function(event) {

};

// onMouseup for this scene
Scene_Title.prototype.onMouseup = function(event) {
    if(this.__inFlag){
        this.event1(this.__inFlag);
    };
};
//#endregion

// playCommand_startNewGame
Scene_Title.prototype.playCommand_startNewGame = function(selected) {
    $player.transferMap(1,1,1); // transfer + loader 
};
