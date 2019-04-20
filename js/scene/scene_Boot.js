/*:
// PLUGIN □────────────────────────────────□ Scene_Boot □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Scene_Boot
* V.1.0
* License:© M.I.T

└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
when all initial data are loaded
Boot
*/

class Scene_Boot extends _Scene_Base {
    constructor() {
        super();
    };

    // initialize tous les modules attacher au jeux
    start(){
        super.start();
        $txt.initialize(); // initialise all hubs
        $objs.initialize();
        $items.initialize();
        $mouse.initialize(); // initialise mouse core
        $player.initialize(); // create game player
        $player2.initialize(); // create game player
       
        $huds.initialize(); // initialise all hubs
        //$gui.initialize(); 
        //$avatar.initialize();
        $dataMonsters.initialize();
        $audio.initialize();

        //SceneManager.goto(Scene_Loader,"Scene_IntroVideo_data",Scene_IntroVideo);
        //$player.transferMap(1); // HACKED FOR DEBUG// FIXME: SceneManager.goto(Scene_Loader,"Scene_IntroVideo_data",Scene_IntroVideo);
        //$stage.goto(Scene_IntroVideo);
    };

    update(delta){
        $stage.goto('Scene_IntroVideo');
    };

    end(){
        this.visible = false;
        this.renderable = false;
    };


};
