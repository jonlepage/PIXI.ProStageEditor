/*:
// PLUGIN □────────────────────────────────□ Scene_Base □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Base
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/
/*
* Les bases general des scenes
*/
class _Scene_Base extends PIXI.Container {
    constructor(sceneData,className) {
        super();
        sceneData && this.prepare(sceneData,className);
    };

    prepare(sceneData,className){
     this.setupBackgroundFrom(sceneData._background,className);
        /*
let loader = new PIXI.loaders.Loader()
loader.add('http://mysite.fake/sprite1.json')
loader.add('http://mysite.fake/sprite2.json')
loader.add('http://mysite.fake/sprite3.json')
loader.once('complete', callback)
loader.load()


function uploadToGPU(resourceName){
  resourceName = resourceName + '_image'
  let texture = new PIXI.Texture.fromImage(resourceName)
  this.renderer.bindTexture(texture)
}

loadSpriteSheet(function(resource){
  uploadToGPU('http://mysite.fake/sprite1.json')
  uploadToGPU('http://mysite.fake/sprite2.json')
  uploadToGPU('http://mysite.fake/sprite3.json')

  // helper function to get all the frames from multiple textures
  let frameArray = getFrameFromResource(resource)
  let animSprite = new PIXI.extras.AnimatedSprite(frameArray)
  this.stage.addChild(animSprite)
  animSprite.play()  
})


        */
    };
    setupBackgroundFrom(dataValues,className){
        this.createBackgroundFrom (dataValues);
    };
    
    /*** clear and creat Background, from dataValues or dataBase editor select
    * @param {objet} dataValues * @param {Number} dataBase editor
    */
   createBackgroundFrom(dataValues) {
        this.clearBackground();
        this.background =  $objs.newContainer_dataValues(dataValues); //TODO:
        this.addChildAt(this.background,0);
    };

    clearBackground() {
        if(this.background){
            this.removeChild(this.background);
            this.background = null;
        }
    };

    

};
