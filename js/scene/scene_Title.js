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
    constructor() {
        super();// TODO:: ADD BACKGROUND

    };



    start(){
        super.start()
        this.visible = true;
        this.renderable = true;
    };

    update(delta){
        this.startNewGame();
    };

    end(){
        
    };

    setupObjs(){
        $objs.createObjsFrom(this.name); //create objs from json
        const objs = $objs.list_master;
        if(objs.length){
            this.addChild(...objs);
        };
    };

    setupLights(){
        const dataValues = $Loader.DataScenes[this.name]._lights.ambientLight;
        $stage.LIGHTS.ambientLight.asignValues(dataValues, true);
    }

    startNewGame(){
        //TODO : GENERATE ALL RANDOM MAP, BUT KEEP   STORY SCRYPTED CASE EVENTS
       //this.setupObjs(); //FIXME: 
       //this.setupLights();
       $objs.computeNewRandomGame(1);
        $stage.goto('Scene_Map1');
    };

};
