/*
* Les stage rend les scenes
*/
class _stage extends PIXI.display.Stage {
    constructor() {
        super();
        // TODO: PEUT ETRE MODIFIER POUR LES FABRIER AU BOOT, class direct [huds,screenMesage,mouse]
        this.CAGE_GUI     = new PIXI.Container(); // screen menue gui huds
        this.CAGE_MESSAGE = new PIXI.Container(); // screen message
        this.CAGE_MOUSE   = new PIXI.Container(); // store master mouse sprite and FX, toujours top
        this.LIGHTS = {ambientLight:{},PointLight_mouse:{}}; //, directionalLight: new PIXI.ContainerDirectionalLight() }; // the global configurable on sceneChange
        
        this.ticker = PIXI.ticker.shared.add(this.update, this);
    };
    // change scene in camera viewPort
    set scene(nextScene){
        if(this._scene){ // initialise camera with new scene
            this.scene.onStop();
            //this.scene.onEnd();
            //this.scene.unLoad(); // quand on change de scenePack
            this._scene = null;
        };
        if(nextScene){
            document.title = document.title+` =>[${nextScene.constructor.name}] `; 
            this._scene = nextScene;
            this.nextScene = null;
        };
    };
    get scene(){ return this._scene || false };

    initialize(){
        this.initialize_Layers();
        this.initialize_Camera();
        this.initialize_lights();
        this.goto('Scene_Boot', {});
    };
    initialize_Camera(){
        this.addChild($camera); // camera can hold scene with projections
       
    };
    initialize_Layers(){
        this.addChild(this.CAGE_GUI, this.CAGE_MESSAGE, this.CAGE_MOUSE);
        this.CAGE_MOUSE.parentGroup = $displayGroup.group[4];
        this.addChild( // lights groups
            $displayGroup._spriteBlack_d,
            $displayGroup._layer_diffuseGroup,
            $displayGroup._layer_normalGroup,
            $displayGroup._layer_lightGroup,
            ...$displayGroup.layersGroup // displayGroups
        );
    };
    initialize_lights(){
       this.LIGHTS.ambientLight     = $objs.newContainer_light('AmbientLight'    );
       this.LIGHTS.PointLight_mouse = $objs.newContainer_light('PointLight'      );
       this.LIGHTS.DirectionalLight = $objs.newContainer_light('DirectionalLight');
       this.addChild(...Object.values(this.LIGHTS) );
    };
    


    // see http://pixijs.download/dev/docs/PIXI.prepare.html for gpu cache 
    goto (targetSceneName, options) {
         // check if loaderKit asigned to class are loaded, if yes get the scene, if no , goto loader scene and load all kit and scene
        this.nextScene = $Loader.getNextScene(targetSceneName); //|| $Loader.loadSceneKit(sceneName); //$Loader.needLoaderKit(sceneName);
    };
    
    update(delta) {
        try {
            if(this.nextScene){
                this.scene = this.nextScene;
            }else if(this.scene._started){
                this.scene.update(delta);
            }else if(this.scene && !this.scene._started){
                this.scene.start();
            }
        } catch (e) {
            $app.nwjs.win.showDevTools();
            throw console.error(e.stack);
        };
    };


    // get stage system informations
    getDataValues () {
        // TODO: total sheet et objet doi etre par scene et non par scenePack
        const sceneObjs = $objs.list; // getter Obj from current scene
        const totalBySheetsType = (()=>{
            return {
                totalSpines:$objs.list.filter((o) => { return o.dataValues.b.type === "spineSheet" }),
                totalTileSprites:$objs.list.filter((o) => { return o.dataValues.b.type === "tileSheet" }),
                totalAnimationSprites:$objs.list.filter((o) => { return o.dataValues.b.type === "animationSheet" }),
                totalLight:$objs.list.filter((o) => { return o.dataValues.b.type === "light" }),
            };
        })();
        const totalByClass = (()=>{
            const r={},l=$objs.list,cl = Object.keys($objs.dataTypes);
            cl.forEach(cdt => { r[cdt] = l.filter((o) => { return o.dataValues.b.classType === cdt }) });
            r.base = l.filter((o) => { return !cl.contains(o.dataValues.b.classType) });
            return r;
        })();
        const memoryUsage = (()=>{
            const m = process.memoryUsage();
            Object.keys(m).map((i)=>{ return m[i] = (m[i]/ 1024 / 1024).toFixed(2) });
            return m;
        })();
        const totalSheet = (()=>{
            const list = {};
            $objs.list.forEach(dataObj => { list[dataObj.dataBase.name] = dataObj.dataBase });
            if($stage.scene.background){
                const bg = $stage.scene.background.dataObj;
                list[bg.dataBase.name] = $stage.scene.background.dataObj.dataBase;
            }
            return list;
        })();
        return {
            memoryUsage,
            currentScene : this.scene.name,
            savePath : `data/${this.scene.name}.json`,
            totalBySheetsType,
            totalByClass,
            totalSheet,
            totalObjs : $objs.list.length,
            
        };
    };
};

const $stage = new _stage();
$app.stage = $stage;
console.log1('$stage: ', $stage);
