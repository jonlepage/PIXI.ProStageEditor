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
    this.alpha = 0; // active the fadeIn
    this.waitReady = 30; // stabiliser
    Scene_Base.prototype.initialize.call(this);
};

// create element for scene and setup.
Scene_Title.prototype.create = function() {
     this.setupCommands();
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

// TODO: voir si bonne idea de mettre une video en BG our 100% sprites
/*Scene_Title.prototype.createBackgroundVideo = function() {
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
};*/


Scene_Title.prototype.setupCommands = function() {
    const commands = $Objs.getsByID("command");
    for (let i=0, l=commands.length; i<l; i++) {
        const command = commands[i];
        // enlarge filter area , preven crope
        const rectangle = command.Sprites.d.getBounds();
        rectangle.pad(40,40);
        command.Sprites.d.filterArea =  rectangle;

        command.interactive = true;
        command.on('pointerover', this.commandOver);
        command.on('pointerout', this.commandOut);
        command.on('pointerup', this.commandClick, this);
    };
};


//#region [rgba(0, 5, 5,0.5)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘

Scene_Title.prototype.commandOver = function(e) {
    switch (e.currentTarget.Sprites.d.name) {
        case "CnewGame": e.currentTarget.Sprites.d._filters = [$Filters.OutlineFilterx8Green]; break;
        case "Cloadgame": e.currentTarget.Sprites.d._filters = [$Filters.OutlineFilterx8Red]; break;
        case "Coptions": e.currentTarget.Sprites.d._filters = [$Filters.OutlineFilterx8Yellow]; break;
        case "Ccredit": e.currentTarget.Sprites.d._filters = [$Filters.OutlineFilterx8Pink]; break;

    }
};

Scene_Title.prototype.commandOut = function(e) {
    e.currentTarget.Sprites.d._filters = null;
};

Scene_Title.prototype.commandClick = function(e) {
    console.log('this: ', this);
    switch (e.currentTarget.Sprites.d.name) {
        case "CnewGame": this.startNewGame(); break;
        case "Cloadgame": void 0; break;
        case "Coptions": void 0; break;
        case "Ccredit": void 0; break;
    }
};
//#endregion

// playCommand_startNewGame
Scene_Title.prototype.startNewGame = function(option) {
    //TODO: SETUP NEW GAME() METHOD
    const startMapID = $Loader.loaderSet.System.startMapId;
    $player.transferMap(startMapID);
};
