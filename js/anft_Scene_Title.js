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
    constructor(sceneData) {
        super(sceneData);

    };



    start(){
        this.visible = true;
        this.renderable = true;
        //$Loader.setPermaCurrentData(); // all loaded from SceneBoot are Perma ressource, protect perma ressource once for avoid destoyed
        //$mouse.initialize(); // initialise mouse core
        //$player = new _player($Loader.Data2.heroe1_rendered); // create game player
        //$player2.initialize();
        //$items.initialize();
        //$huds.initialize(); // initialise all hubs
        //$gui.initialize(); 
        //$avatar.initialize();
        //$monster.initialize();
        //SceneManager.goto(Scene_Loader,"Scene_IntroVideo_data",Scene_IntroVideo);
        //$player.transferMap(1); // HACKED FOR DEBUG// FIXME: SceneManager.goto(Scene_Loader,"Scene_IntroVideo_data",Scene_IntroVideo);
        
    };

    update(delta){
    
    };

    end(){
        
    };


};
