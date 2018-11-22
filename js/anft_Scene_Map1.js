/*:
// PLUGIN □────────────────────────────────□ Scene_Title □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Boot
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:

*/
class Scene_Map1 extends _Scene_Base {
    constructor(sceneData,className) {
        super(sceneData,className);
        this.name = className;

    };



    start(){
        this.setupObjs  ();
        this.setupLights();
        this.setupPlayer();
        this.setupCamera();
        this.visible = true;
        this.renderable = true;
       //$stage.goto();
    };

    update(delta){
    
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

    setupPlayer(){
        this.addChild($player.spine);
        // TODO: stoker le case id de transfer dans $player
        if( $Objs.list_cases[0]){
            $player.x = $Objs.list_cases[0].x
            $player.y = $Objs.list_cases[0].y+20
            $player.spine.parentGroup = $displayGroup.group[1];
            $player.spine.zIndex = $player.y;
            $player.inCase = $Objs.list_cases[0]; //TODO: add from arg, utiliser pour transferer d'une map a lautre, le id de la procahien case.
        };
        
    }

    setupCamera(){
        $camera.attachToCurrentScene();
        $camera.setTarget($player.spine.position);
    }

    
};
