/*:
// PLUGIN □────────────────────────────────□ Scene_Title □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Boot
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/
class Scene_Title extends _Scene_Base {
    constructor(sceneData,className) {
        super(sceneData,className);
        this.name = className;

    };



    start(){
        this.setupObjs();
        this.setupLights();
        this.visible = true;
        this.renderable = true;
    };

    update(delta){
        this.startNewGame();
    };

    end(){
        
    };

    setupObjs(){
        $Objs.createObjsFrom(this.name); //create objs from json
        const objs = $Objs.list_master;
        if(objs.length){
            this.addChild(...objs);
        };
    };

    setupLights(){
        const dataValues = $Loader.DataScenes[this.name]._lights.ambientLight;
        $stage.LIGHTS.ambientLight.asignValues(dataValues, true);
    }

    startNewGame(){
        $stage.goto(Scene_Map1);
    };

};
