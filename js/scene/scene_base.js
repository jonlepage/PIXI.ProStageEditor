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
class _Scene_Base extends PIXI.projection.Container2d {
    constructor(sceneData,className) {
        super();
        this._started   = false ;
        this.visible    = false ;
        this.renderable = false ;
        sceneData && this.prepare(sceneData,className);
    };

    // prepar seulement le background ? a voir si on eleve car exist dans loader
    prepare(sceneData,className){
    // register data
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
    //TODO: trouver un meilleur system pour obtenir dataValue des Background ? refair lediteur bg
   createBackgroundFrom(dataBase) {
        this.clearBackground();
        if(dataBase && dataBase instanceof _dataBase){
            this.background = $objs.newContainer_dataBase(dataBase, dataBase.name);
            // setup BG
            this.background.parentGroup = $displayGroup.group[1];
            this.background.d.parentGroup = PIXI.lights.diffuseGroup;
            this.background.n.parentGroup = PIXI.lights.normalGroup;
            this.addChildAt(this.background,0);
        }else if(dataBase){
            this.background = $objs.newContainer_dataValues(dataBase);
            this.background.parentGroup = $displayGroup.group[1];
            this.background.d.parentGroup = PIXI.lights.diffuseGroup;
            this.background.n.parentGroup = PIXI.lights.normalGroup;
            this.addChildAt(this.background,0);
        }
    };

    clearBackground() {
        if(this.background){
            this.removeChild(this.background);
            this.background = null;
        }
    };

    start(){
        this._started = true;
        this.visible = true;
        this.renderable = true;
    };

    update(delta){
       

    };
    

};
