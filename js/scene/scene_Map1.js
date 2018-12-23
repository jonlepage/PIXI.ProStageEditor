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


    // prepare and set event for map 1
    start(){
        $huds.setInteractive(true);
        this.setupObjs();
        this.setupLights();
        this.setupPlayer();
        this.setupCamera(); // TODO: ADD TO SCENE BASE ?
        this.setupEventCases(); // setup interactivity for events case in map1?
        this.visible = true;
        this.renderable = true;
       //$stage.goto();
    };

    update(delta){
    
    };

    end(){
        
    };

    setupObjs(){
        $objs.createObjsFrom(this.name); //create objs from className json
        const objs = $objs.list_master;
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
        this.addChild($player2.spine);
        // TODO: stoker le case id de transfer dans $player
        if( $objs.list_cases[0]){
            $player.x = $objs.list_cases[0].x
            $player.y = $objs.list_cases[0].y+20
            $player.spine.parentGroup = $displayGroup.group[1];
            $player.spine.zIndex = $player.y;
            $player.inCase = $objs.list_cases[0]; //TODO: add from arg, utiliser pour transferer d'une map a lautre, le id de la procahien case.
        };
        $player2.moveToPlayer();
        
    }

    setupCamera(){
        $camera.initialize();
       //$camera.setTarget($player.spine.position);
    }

    // Events initialisator and hack optimiser
    // setup hack or change context in current map base on global variable
    setupEventCases(){
        // TODO: METTRE LES ID CASE UNIQUE ?
        if(!$gameVariables._wallMaisonDroiteDetuits){
            // empeche la case id id 8 detre selectionner
            console.log('TODO:: ', 'caseSousMurMaison');
            /*$objs.getCase_FromName('caseSousMurMaison').conditionInteractive = () => { 
                return $gameVariables._wallMaisonDroiteDetuits 
            };*/
        };
    }
};
