/*:
// PLUGIN □────────────────────────────────□ Scene_IntroVideo □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_IntroVideo
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
Les video ne fon pas parti du loader.
elle son charger dans cette scenes.Tous les video du jeux seron de la meme facon
*/

function Scene_IntroVideo() {
    this.initialize.apply(this, arguments);
}

Scene_IntroVideo.prototype = Object.create(Scene_Base.prototype);
Scene_IntroVideo.prototype.constructor = Scene_IntroVideo;

Scene_IntroVideo.prototype.initialize = function() {
    this.wait = 60;
    this.vidControlers = [];
    Scene_Base.prototype.initialize.call(this);
};

Scene_IntroVideo.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.create_IntroVideo();
};

Scene_IntroVideo.prototype.create_IntroVideo = function() {
    const texture = PIXI.Texture.fromVideo('data2/Video/intro/vidA1.webm');
    const videoSprite = new PIXI.Sprite(texture);
    const videoControler = texture.baseTexture.source;

    videoSprite.width = 1920;
    videoSprite.height = 1080;

    videoControler.currentTime = 12.2;
    videoControler.onended = function(){
        this.nextVideo();
    }.bind(this);

    this.addChild(videoSprite);
    this.videoControler = videoControler;
};

Scene_IntroVideo.prototype.isReady = function() {
    // check scene stabilisator // TODO:
   return !this.wait--;
};

Scene_IntroVideo.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.videoControler.play();
};

Scene_IntroVideo.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
};

//TODO: compiler un planet id json
Scene_IntroVideo.prototype.nextVideo = function() {
   //SceneManager.goto(Scene_Loader,"Scene_Local_data",Scene_Local);
   $player.transferMap(1);
   
};