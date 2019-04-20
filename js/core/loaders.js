/*:
// PLUGIN □────────────────────────────────□ LOADER CLASS □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc loader class for the sceneLoader
* V.1.0
* License:© M.I.T
*VERY IMPORTANT NOTE: Export from texturePacker with trimmed Name (remove extention.png for use tile normal)
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
-LOADDER TYPE
loaderSet_loadingData:[loadingSprite,mouseSprite]
loaderSet_PermaData:[GUI,players,sound]
loaderSet_IntroVideo:[videoIntro]
loaderSet_Scene_Local:[local flag,music]
loaderSet_TitleScene:[titleSprites,musicTitle,movies,saveGameJson]
loaderSet_PlanetData:[monsterSprites,doodadSprites,planeteMusics] // dossier global et planet only (global peut etre utiliser dans plusieur planet )
loaderSet_MapScene:[dataMapJson,mapSprites(diff,norm)]
loaderSet_GalaxiScene:[dataMapJson,mapSprites(diff,norm)]
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $Loader CLASS: _coreLoader for pixi loader management and caches
//└------------------------------------------------------------------------------┘
// structure de base pour les dataBase stoker dans data2
class _dataBase {
    constructor (_base,res,perma) {
        Object.assign(this,_base);
        Object.defineProperty(this, "data", { value: res.data });
        this.type = res.spineData?'spineSheet':res.data.animations?'animationSheet':res.isVideo?'video':this.isBackground?'background':this.isLight?'light':'tileSheet';
        this.perma = perma;
        // textures or spineData
        if(res.spineData){
            Object.defineProperty(this, "spineData", { value: res.spineData }); // TODO: new skeletonData = spineJsonParser.readSkeletonData(resource.data);

        }else{
            Object.defineProperty(this, "textures", { value: {} });
            Object.defineProperty(this, "textures_n", { value: {} });
        }
    };
};
Object.defineProperty(_dataBase.prototype, 'isMultiPacks'    , { get:function() { return this.data.meta && this.data.meta.related_multi_packs || false       } });
Object.defineProperty(_dataBase.prototype, 'isVideo'         , { get:function() { return this.type === "video"                             } });
Object.defineProperty(_dataBase.prototype, 'isSpineSheet'    , { get:function() { return this.type === "spineSheet"                        } });
Object.defineProperty(_dataBase.prototype, 'isAnimationSheet', { get:function() { return this.type === "animationSheet"                    } });
Object.defineProperty(_dataBase.prototype, 'isTileSheet'     , { get:function() { return this.type === "tileSheet"                         } });
Object.defineProperty(_dataBase.prototype, 'isNormal'        , { get:function() { return this.isSpineSheet || !this.isVideo && !!this.data.meta.normal_map  } }); // TODO: voir si on peut ajouter un skins
Object.defineProperty(_dataBase.prototype, 'isBackground'    , { get:function() { return this.dirArray.contains("backgrounds")  } });
Object.defineProperty(_dataBase.prototype, 'isLight'       , { get:function() { return this.dirArray.contains("Light") } });
Object.defineProperty(_dataBase.prototype, 'dataType'      , { get:function() { return this.dirArray[1]                } });
Object.defineProperty(_dataBase.prototype, 'containerType' , { get:function() { return this.type                       } });


class _coreLoader {
    constructor () {
        this.Data2 = {}; //{} store textures game by pack name,
        this.DataScenes = null //{} info sur tous les pack utliser par scene et leur dir, cpntien aussi tous les events du jeux a mapper random newGame
        this.Scenes = {}; // store full scenes cache
        this.options = {};
        this.fonts = null;
        this.loaderBuffers = [];
        this._isLoading = false;
        this._audioLoaded = false;
        this.CSV = {
            _loaded:false,
            get dataString(){return Object.keys(this).filter(e=>e.contains('dataString_') && this[e]) },
            get dataBase  (){return Object.keys(this).filter(e=>e.contains('dataBase_'  ) && this[e]) },
        };

        this.sceneKits = []; // buffering scene kits for loader progress
        this.currentLoaded = []; // buffering scene kits for loader progress
        this.buffers = null; // buffer used when load scenes

        //TODO: SPERARER Scene_Boot pour permettre d'aller dans le scene title?
        this.loaderKit = [  // batch .json in arrays, when change scene, check if need load a kits
            ['Scene_Boot','Scene_IntroVideo','Scene_Title'], // bootKit
            ['Scene_Map1'], // planet1
        ];
        this._sceneKit_queue = []; // queue all scene need to load from kit
        this._scenesLoaded = []; // store scene loaded by string
        this.scenesLoaded = []; // store scene loaded class Obj
    };
    get utils () { return PIXI.utils };
    get BaseTextureCache () { return PIXI.utils.BaseTextureCache };
    get TextureCache () { return PIXI.utils.TextureCache };
    get utils () { return PIXI.utils };

    // return sois la prochaine scene, sois la scene loader pour changer de scene pack
    getNextScene(targetScene){
        const index = this._scenesLoaded.indexOf(targetScene);
        if(index>-1){  // scene deja loader
            return this.scenesLoaded[index];
        }else{
            // scene n'est pas loader ! creet une nouvelle scene loader 
            return new Scene_Loader(targetScene);
        };
    };

    getClassScene(className){
        switch (className) {
            case 'Scene_Boot'       : return Scene_Boot       ; break;
            case 'Scene_IntroVideo' : return Scene_IntroVideo ; break;
            case 'Scene_Title'      : return Scene_Title      ; break;
            case 'Scene_Map1'       : return Scene_Map1       ; break;
        };
    };


    // when need a new loadKit? destroy all cache elements for new loading
    destroyData () {
        this._scenesLoaded = [];
        this.scenesLoaded = [];
        for (const key in this.Data2) { delete this.Data2[key] };
    };

    getSceneKitFrom(nextSceneName){
        for (let i=0, l=this.loaderKit.length; i<l; i++) {
            if( this.loaderKit[i].contains(nextSceneName) ){
                return this.loaderKit[i].clone();
            };
        };
    };

    // initialise prepare loader setup
    initialize (nextSceneName) {
        this._sceneName = nextSceneName;
        this.destroyData();// purge loaded scene TODO: add a destroy manager , from GPU ?
        this._isLoading = true;
        this._sceneKit_queue = this.getSceneKitFrom(nextSceneName); // obtien un kitList de scenes attacher a `nextSceneName`;
        this.load();
    };

    load() {
        // firstBoot verifier que tous est deja preloader, ensuite verifier les kits
        if(!this.fonts){ return this.load_fonts() }; // load les fonts
        if(!this.CSV._loaded){ return this.loadCSV() }; // load les CSV text
        if(!this.DataScenes){ return this.load_dataScenes() }; // load JSON DataScenes
        if(!this._audioLoaded){ return this.load_audio()};

        // default loader, load les sceneKIT
        const next = this._sceneKit_queue.shift();
        if(next){
            this._scenesLoaded.push(next);
            this.loadSheets(next);
        }else{
            this._isLoading = false;
        };
    };

    loadFromEditor (className,dataFromNwjs) {
        this._isLoading = true;
        this.options.fromEditor = true;
        this.DataScenes = {};
        this.DataScenes[className] = {};
        this.DataScenes[className]._sheets = dataFromNwjs;
        this.DataScenes[className];
        this.buffers = {
            className  :className,
            base       : {} , // this is the final compute data
            ressources  : {} ,
            multiPacks : {} ,
            normals    : {} ,
        };
        this.loadSheets(className, true);
    };

    /** load les excel CSV et les parse avec papa parse */
    loadCSV(){
        const dataString = ['dataString_keyword','dataString_monster','dataString_name','dataString_message','dataString_huds','dataString_states','dataString_items']; // les strings translate in game
        const dataBase   = ['dataBase_items','dataBase_player','dataBase_monster']; // les data value base in game
        const loader = new PIXI.loaders.Loader();
        dataString.concat(dataBase).forEach(ref => {
            loader.add(ref, `data/${ref}.csv`);
        });
        loader.load();
        loader.onProgress.add((loader, res) => {
            this.CSV[res.name] = Papa.parse(res.data,{skipEmptyLines: true, dynamicTyping: true});
        });
        loader.onComplete.add((loader, res) => {
            this.CSV._loaded = true;
            this.load();
        });
    };

    load_fonts(){
        const fonts = [
            {name:"ArchitectsDaughter", url:"fonts/ArchitectsDaughter.ttf"},
            {name:"zBirdyGame", url:"fonts/zBirdyGame.ttf"},
        ];
        let divList = [];
        fonts.forEach(font => {
            const style = document.createElement('style');
            style.appendChild(document.createTextNode(`
                @font-face {
                    font-family: '${font.name}';
                    font-style: normal;
                    font-weight: 700;
                    src: url("${font.url}");
                }
            `));
            document.getElementsByTagName('head').item(0).appendChild(style);
            const div = document.createElement('div');
            div.style.fontFamily = font.name;
            document.body.appendChild(div);/* Initiates download in Firefox, IE 9+ */
            div.innerHTML = 'Content.';/* Initiates download in WebKit/Blink */
            divList.push(div);

        });
        let checkFonts =  setInterval(()=>{
            if( fonts.every(e => document.fonts.check(`12px ${e.name}`) )){
                divList.forEach(div => { document.body.removeChild(div) });
                this.fonts = fonts;
                clearInterval(checkFonts);
                this.load();
            }
        },60);
    };

    /** load les audio permanent et redondant*/
    load_audio(){
        this._audioLoaded = true;
        // list des perma audio au SceneBoot, indic si ces un spriteAudio
        const list = { //[bgm]:BackgroundMusic, [bgs]:BackgroundSound, [sfx]:soundFX, [mfx]:musicFX
            setuniman__cozy_0_16       :{type:'bgm',ext:"mp3",sprite:false},
            newBattle_0_04             :{type:'mfx',ext:"wav",sprite:false},
            BT_BOING_Rubber_Band_Swing :{type:'sfx',ext:"wav",sprite:true },
            jump_2a4d                  :{type:'sfx',ext:"wav",sprite:true },
            laser_Rough_Up             :{type:'sfx',ext:"wav",sprite:true },
            
        };
        const loader = new PIXI.loaders.Loader();
        for (const key in list) {
            const o = list[key];
            loader.add(key, `audio/${o.type}/${key}.${o.ext}`);
            o.sprite && loader.add(`${key}_data`,`audio/${o.type}/${key}.txt`)
        }
        loader.load((loader, res) => {
            Object.keys(list).forEach(key => {
               if(list[key].sprite){
                    const data = res[`${key}_data`].data;
                    const result = {};
                    data.split('\n')
                    .filter(line => !!line)
                    .map(line => line.split('\t'))
                    .forEach(([start, end, name]) => result[name.replace(/\r/,"")] = { start, end });
                res[key].sound.addSprites(result);
               }
           });
         
        });
        loader.onComplete.add((loader, res) => { this.load() });
    };

    // preload all data scene strings data, help for compute new random game
    load_dataScenes(){
        this.DataScenes = {};
        const loader = new PIXI.loaders.Loader();
        const scenesList = [].concat(...Object.values(this.loaderKit));
        scenesList.forEach(sceneDataName => {
            loader.add(sceneDataName, `data/${sceneDataName}.json`);
        });
        loader.load();
        loader.onProgress.add((loader, res) => { this.DataScenes[res.name] = res.data }); // json string data parsed
        loader.onComplete.add((loader, res) => { this.load() });
    };

    loadSheets(className){
        this.buffers = {
            className  :className,
            base       : {} , // this is the final compute data
            ressources : {} ,
            multiPacks : {} ,
            normals    : {} ,
        };
        if(!this.DataScenes[className]){throw console.error(`Critical Error: JSON dont contains Base structure: [_sheets,_objs,background,lights...]`)}
        const loader = new PIXI.loaders.Loader();
        const sheets = this.DataScenes[className]._sheets;
        if(!sheets){ console.warn('%cSCENE JSON EMPTY DATA: Use editor for create json template => %c%s', 'font-weight:bold;color:#000 ;background:#721919', 'font-weight:bold;color:#ee5000;background:#fffbe6', ` ${className}`);}
        Object.values(sheets).forEach(el => {
            this.buffers.base[el.name] = el; // formate les sheets en objet
            loader.add(el.name, el.root); // "data2/Trees/tree1A/tree1.json"
        });
        loader.load();
        loader.onProgress.add((loader, res) => {
            (res.extension === 'json')? this.buffers.ressources[res.name] = res : void 0;
            (res.extension === 'webm')? this.buffers.ressources[res.name] = res : void 0;
        });
        loader.onComplete.add((loader, res) => { this.loadMultipack(className) });
        !loader.loading && loader.onComplete._tail._fn(); // force continue if nothing to load;
    };

    loadMultipack(className){
        const loader = new PIXI.loaders.Loader();
        for (const name in this.buffers.ressources) {
            if(name.contains("-0")){
                const multi_packs = this.buffers.ressources[name].data.meta.related_multi_packs.clone();
                multi_packs.forEach(fileName => {
                    loader.add(fileName.replace('.json',''), `${this.buffers.base[name].dir}/${fileName}`);
                });
            };
        };
        loader.load();
        loader.onProgress.add((loader, res) => {
            if(res.extension.contains("json")){
                (res.extension === 'json')? this.buffers.multiPacks[res.name] = res : void 0;
            };
        });
        loader.onComplete.add((loader, res) => { this.loadNormals(className) });
        !loader.loading && loader.onComplete._tail._fn(); // force continue if nothing to load;
    };

    loadNormals(className) {
        const loader = new PIXI.loaders.Loader();
        const list = Object.keys(this.buffers.ressources).concat(Object.keys(this.buffers.multiPacks));
        list.forEach(name => {
            const origin = this.buffers.ressources[name] || this.buffers.multiPacks[name];
            const fileName_n = origin.data.meta && origin.data.meta.normal_map;
            if(fileName_n){
                loader.add(fileName_n.replace('.png',''), origin.url.replace('.json','_n.png') );
            };
        });
        loader.load();
        loader.onProgress.add((loader, res) => { this.buffers.normals[res.name] = res });
        loader.onComplete.add((loader, res) => { this.computeBuffers(className) });
        !loader.loading && loader.onComplete._tail._fn();
    };

    computeBuffers(className) {
        const data2 = {};
        for ( const key in this.buffers.ressources ) {
            if(this.Data2[key]){continue;}; // jump if alrealy exist !
            const res = this.buffers.ressources[key];
            const base = data2[key] = this.createBaseFrom(res,this.buffers.base[key]);
            
            const isNormal    = !!base.isNormal         ;
            const isMulti     = !!base.isMultiPacks     ;
            const isSpine     = !!base.isSpineSheet     ;
            const isAni       = !!base.isAnimationSheet ;
            const isVideo     = !!base.isVideo          ;
            const isTileSheet = !!base.isTileSheet      ;
            const key_n = isNormal && key+'_n';
            
            if(!isSpine && !isVideo){
                let textures_d = res.textures;
                let textures_n = isNormal && this.createNormals(base, res.textures, this.buffers.normals[key_n].texture);
                //multiPacks
                if(isMulti){
                    base.data.meta.related_multi_packs.forEach(keyLink => {
                        keyLink = keyLink.replace('.json','');
                        const keyLink_n = keyLink+'_n';
                        const resLink = this.buffers.multiPacks[keyLink];
                        Object.assign(textures_d, resLink.textures);
                        if(isAni){
                            const animations = Object.entries(resLink.data.animations);
                            animations.forEach(keys => { 
                                base.data.animations[keys[0]].push(...keys[1]);
                                base.data.animations[keys[0]].sort();
                            });
                        };
                        isNormal && Object.assign(textures_n, this.createNormals(resLink, resLink.textures, this.buffers.normals[keyLink_n].texture));
                    });
                };
                if(isAni){ // cache a map of bach textures animations by name and also bind textures to gpu.
                    const _textures = {},  _textures_n = {}; // temp sub texture pour classer selon les animations 
                    for (const key in base.data.animations) {
                        _textures   [key] = base.data.animations[key].map(a => { const t = textures_d[a     ]; $app.renderer.bindTexture(t); return t; });
                        _textures_n [key] = base.data.animations[key].map(a => {const t = textures_n [a+'_n']; $app.renderer.bindTexture(t); return t; });
                    }
                    textures_d = _textures   ;
                    textures_n = _textures_n ;
                };
                Object.assign(base.textures, textures_d);
                Object.assign(base.textures_n, textures_n);
            };
            // add to DATA2
            this.Data2[key] = base;
            base.perma && Object.defineProperty(this.Data2, key, { enumerable: false });
        };

        if(this.options.fromEditor){
            Object.keys(data2).forEach(key => { Object.assign(data2[key],this.DataScenes[className]._sheets[key]) }); // path data for editor only
            $PME.startGui(data2);
        }else{
            this.createScene();
            this.buffers = null;
            this.utils.clearTextureCache();
            this.load(); // next scene load =>=>=>
        };
    };

    // create scene Cache
    createScene(){
        const className = this.buffers.className;
        const scene = new (this.getClassScene(className))(this.DataScenes[className],className);
        this.scenesLoaded.push(scene);
    };

    createNormals(base, resTextures, baseTexture_n){
        // .clone(); ? check if we need clone or just link ?
        const textures_n = {};
        for (const key in resTextures) {
            const tex = resTextures[key];
            const frame = tex.frame && tex.frame; 
            const orig = tex.orig && tex.orig;
            const trim = tex.trim && tex.trim;
            const rot = base.data.frames[key].rotated ? 2 : 0; // base.data.rotated ? 2 : 0 ?
            textures_n[key+'_n'] = new PIXI.Texture(baseTexture_n, frame, orig, trim, rot, base.data.frames[key].anchor);
            textures_n[key+'_n'].textureCacheIds = [key+'_n']
        };
        return textures_n;
    };

    createBaseFrom(res,_base) {
        const type = res.spineData?'spineSheet':res.data.animations?'animationSheet':res.isVideo?'video':'tileSheet';
        const perma = this.buffers.className === 'Scene_Boot';
        const base = new _dataBase(_base,res,perma);

        if(this.options.fromEditor){
            Object.defineProperty(base, "baseTextures", { value: [], writable:true });
            const texture = this.utils.TextureCache[`${res.name}_image`] || this.utils.TextureCache[`${res.name}_atlas_page_${res.name}.png`];
            base.baseTextures.push( texture );
            if(base.isMultiPacks){
                base.data.meta.related_multi_packs.forEach(keyLink => {
                    keyLink = keyLink.replace('.json','');
                    const resLink = this.buffers.multiPacks[keyLink];
                    base.baseTextures.push( this.utils.TextureCache[`${resLink.name}_image`] );
                });
            };
        };
        return base;
    };


};//END CLASS

/**@class _coreLoader*/
const $Loader = new _coreLoader();
console.log1('$Loader.', $Loader);
