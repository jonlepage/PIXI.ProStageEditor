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

    // prepar in GPU all baseTexture and texture
    prepare(sceneData,className){
        this.createBackgroundFrom(sceneData._background);
    };
    
    /*** clear and creat Background, from dataValues or dataBase editor select
    * @param {objet} dataValues * @param {Number} dataBase editor
    */
    //TODO: trouver un meilleur system pour obtenir dataValue des Background ? refair lediteur bg
   createBackgroundFrom(dataObj) {
        this.clearBackground(!dataObj);
        if(dataObj){
            this.background = $objs.newContainer_dataObj(dataObj,'idle',true); 
        };
        this.addChildAt(this.background,0);
    };
    
    clearBackground(makeEmpty) {
        if(this.background){
            this.removeChild(this.background);
            this.background = null;
        };
        if(makeEmpty){
            this.background = $objs.newContainer_type('background');
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
