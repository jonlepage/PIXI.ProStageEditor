/*
* Les stage rend les scenes
*/
class _stage extends PIXI.display.Stage {
    constructor() {
        super();
        this.scene = null; // current scene rendering and managing by the stage see: $Loader.Scenes for preloaded list.
        this.ticker = PIXI.ticker.shared.add(this.masterUpdate, this);
        this.CAGE_GUI   = new PIXI.Container(); // store master gui menu and huds
        this.CAGE_MESSAGE   = new PIXI.Container(); // store master game message, screen message
        this.CAGE_MOUSE = new PIXI.Container(); // store master mouse sprite and FX, toujours top
        this.LIGHTS = { ambientLight:new PIXI.ContainerAmbientLight(0xffffff, 0.8), directionalLight: new PIXI.ContainerDirectionalLight() }; // the global configurable on sceneChange
        this.addChild( // lights groups
            $displayGroup._spriteBlack_d,
            $displayGroup._layer_diffuseGroup,
            $displayGroup._layer_normalGroup,
            $displayGroup._layer_lightGroup,
            ...$displayGroup.layersGroup // displayGroups
        );
        this.addChild(this.CAGE_GUI, this.CAGE_MESSAGE, this.CAGE_MOUSE);
        this.addChild(this.LIGHTS.ambientLight, this.LIGHTS.directionalLight);
    };

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
        // lots of scenes buffer constructor ready in memory, just need to start, userfull for maps
        const nextScene = loaderKit && new Scene_Loader(sceneClass.name, options, loaderKit) || $Loader.Scenes[sceneName];
        
        this.scene = nextScene;
        this.addChildAt(nextScene,0);
        nextScene.start();
        document.title = document.title+` =>[${sceneName}] `; 
    };

    masterUpdate(delta) {
        try {
            this.updateMain(delta);
        } catch (e) {
            $app.nwjs.win.showDevTools();
            throw console.error(e.stack);
        };
    };

    updateMain(delta){
        this.scene && this.scene.update(delta);
    };
};

const $stage = new _stage();
$app.stage = $stage;
console.log1('$stage: ', $stage);

/*
* Les bases general des scenes
*/
class _Scene_Base extends PIXI.Container {
    constructor(sceneData) {
        super();
        this.background = null;
        this.prepare(sceneData);
        
    };

    prepare(sceneData){
        console.log('sceneData: ', sceneData);
        this.createBackgroundFrom(sceneData._background);
        
    };


    /*** clear and creat BG, from dataValues or dataBase editor select
    * @param {objet} dataValues * @param {Number} dataBase
    */
    createBackgroundFrom(dataValues,dataBase) {
        this.clearBackground();
        dataBase = dataBase || dataValues && $Loader.Data2[dataValues.p.dataName] || null;
        this.background = new PIXI.ContainerBG(dataBase,dataValues);
        this.addChildAt(this.background,0);
    };

    clearBackground() {
        if(this.background){
            this.removeChild(this.background);
            this.background = null;
        }
    };
};
