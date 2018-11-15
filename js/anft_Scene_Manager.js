
class _stage extends PIXI.display.Stage {
    constructor() {
        super();
        this.scene = null; // current scene rendering and managing by the stage
        this.ticker = PIXI.ticker.shared.add(this.masterUpdate, this);
    };
    get scenesBuffer () { return $Loader.Scenes }; // lots of scenes buffer constructor ready in memory, just need to start, userfull for maps


    run() {
        try { this.goto(Scene_Boot, {}) } // option for loader scenes boot
        catch (e) { throw console.error(e.stack) };
    };

    // see http://pixijs.download/dev/docs/PIXI.prepare.html for gpu cache 
    goto (sceneClass, options) {
        // TODO: add FX transitions, maybe a callBack .onEnd, onStop...
        if(this.scene){
            this.scene.end();
            this.removeChild(this.scene);
            
        };
         // check if loaderKit asigned to class are loaded, if yes get the scene, if no , goto loader scene and load all kit and scene
        const sceneName = sceneClass.name || sceneClass;
        const loaderKit = $Loader.needLoaderKit(sceneName);
        const nextScene = loaderKit && new Scene_Loader(sceneClass.name, options, loaderKit) || this.scenesBuffer[sceneName];
        
        this.scene = nextScene;
        this.addChild(nextScene);
        nextScene.start();
        document.title = document.title+` =>[${sceneName}] `; 
    };

    masterUpdate(delta) {
        try {
            this.updateMain(delta);
        } catch (e) {
            $app.nwjs.win.showDevTools();
            throw console.error(e.stack) 
        };
    };

    updateMain(delta){
        this.scene && this.scene.update(delta);
    };
};

const $stage = new _stage();
$app.stage = $stage;
console.log1('$stage: ', $stage);




