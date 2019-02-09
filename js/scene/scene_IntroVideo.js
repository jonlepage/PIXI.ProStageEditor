/*:
// PLUGIN □────────────────────────────────□ Scene_IntroVideo □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Boot
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/
/**
 * The Superclass of all scene within the game.
 * 
 * @class Scene_IntroVideo
 * @constructor 
 * @extends _Scene_Base
 */
class Scene_IntroVideo extends _Scene_Base {
    constructor() {
        super();
    };

    start(){
        super.start();
        this.create_IntroVideo();
        //this.setupCamera(); //TODO: ADD TO SCENE BASE ? 
    };

    update(delta){

    };

    end(){
        this.visible = false;
        this.renderable = false;
    };


    create_IntroVideo () {
        const dataVideo = $Loader.Data2['vidA1'].data;
        const texture = PIXI.Texture.fromVideo( dataVideo, 1, void 0, false );
        const videoSprite = new PIXI.Sprite(texture);
        const videoControler = texture.baseTexture.source;
    
        videoSprite.width = 1920;
        videoSprite.height = 1080;
    
        videoControler.currentTime = 12.2;
        videoControler.onended = () => {
            //this.nextVideo();
           $stage.goto('Scene_Title');
           
        }

        this.addChild(videoSprite);
        this.videoControler = videoControler;
        videoControler.play();
    };
    
    setupCamera(){
        //$camera.initialize();
       //$camera.setTarget($player.spine.position);
    }

};

