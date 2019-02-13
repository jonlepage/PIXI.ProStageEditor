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
        //this.prepare(sceneData,className);TODO:
    };

    // prepar in GPU all baseTexture and texture
    prepare(sceneData,className){
        const dataValues = sceneData && sceneData._background.dataValues;
        const dataObj = dataValues && $objs.newDataObjs_dataValues(sceneData._background.dataValues);
        this.createBackgroundFrom(dataObj);
    };
    
    /*** clear and creat Background, from dataValues or dataBase editor select
    * @param {objet} dataValues * @param {Number} dataBase editor
    */
    //TODO: trouver un meilleur system pour obtenir dataValue des Background ? refair lediteur bg
   createBackgroundFrom(dataObj) {
        this.clearBackground();
        if(dataObj){
            this.background = new Container_Background(dataObj);
        }else{
            this.background = new Container_Background();
           
        }
        this.addChildAt(this.background,0);
        /*if(dataBase && dataBase instanceof _dataBase){
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
        }*/
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
        $camera.initialize(this);
    };

    update(delta){
        $camera.update();
    };

    onStop(){
        this._runned = false;
        this._started = false;
        this.visible = false;
        this.renderable = false;
        $camera.initialize();
    };
    

};
