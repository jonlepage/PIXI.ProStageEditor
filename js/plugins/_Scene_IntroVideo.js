/*:
// PLUGIN □────────────────────────────────□ Scene_IntroVideo □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_IntroVideo
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/

function Scene_IntroVideo() {
    this.initialize.apply(this, arguments);
}

Scene_IntroVideo.prototype = Object.create(Scene_Base.prototype);
Scene_IntroVideo.prototype.constructor = Scene_IntroVideo;

Scene_IntroVideo.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this.vidControlers = [];
};

Scene_IntroVideo.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    //this.create_IntroVideo();
};

Scene_IntroVideo.prototype.create_IntroVideo = function() {

    // setup : see custom pixi _this.autoPlay = false;f
    for (const key in $Loader.reg._videos._intro) {
        const vid = $Loader.reg._videos._intro[key];
        const vid_textures = PIXI.Texture.fromVideo(vid.data);
        const vid_controler = vid_textures.baseTexture;
        const vid_sprite =  new PIXI.Sprite(vid_textures);
        // setup
        vid_sprite.width = 1920;
        vid_sprite.height = 1080;
        vid_controler.source.currentTime = 12; // 12
        // parenting
        this.CAGE_MAP.addChild(vid_sprite);
        
        // reference
        this.vidControlers.push(vid_controler);
        vid_controler.source.onended = function(){
            this.nextVideo();
        }.bind(this);

    };

  
};

Scene_IntroVideo.prototype.nextVideo = function() {
    this.introPlayed = true;
    SceneManager.goto(Scene_Loader,"loaderSet_SceneLocal",Scene_Local);
};

Scene_IntroVideo.prototype.isReady = function() {
    // check scene stabilisator // TODO:
   return true;
};

Scene_IntroVideo.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    //this.vidControlers[0].source.play();
    //SceneManager.clearStack();
    //this.playTitleMusic();
    //this.startFadeIn(this.fadeSpeed(), false);

    //DELETEME TEST HACK
    SceneManager.goto(Scene_Loader,"Scene_Local_data",Scene_Local);
};

Scene_IntroVideo.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
};

