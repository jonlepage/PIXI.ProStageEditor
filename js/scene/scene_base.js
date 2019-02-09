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
     this.setupBackgroundFrom(sceneData._background,className);
     this._sceneW = this.background? this.background.d.width  :  $app.screen.width; // 1920
     this._sceneH = this.background? this.background.d.height :  $app.screen.height; // 1080;
     this.pivot.set(this._sceneW/2,this._sceneH);
     this.background && this.background.position.set(this._sceneW/2,this._sceneH);

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
        $camera.setupToScene(this);
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
