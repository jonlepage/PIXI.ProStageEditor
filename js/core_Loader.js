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

class _coreLoader {
    constructor () {
        this.Data2 = {}; //{} store textures game by pack name,
        this.DataScenes = {} //{} info sur tous les pack utliser par scene et leur dir, lier a la phase loaderKit
        this.Scenes = {}; // store full scenes cache
        this.fonts = null;
        this.loaderBuffers = [];
        this._isLoading = false;
        this.loaderKit = { // loaderKit by class name for get .json
            loaderSet_boot:['Scene_Boot','Scene_IntroVideo','Scene_Title'],
        };
        this.sceneKits = []; // buffering scene kits for loader progress
        this.currentLoadedKit = []; // buffering scene kits for loader progress
        this.buffers = null; // buffer used when load scenes
    };
    get utils () { return PIXI.utils };
    get BaseTextureCache () { return PIXI.utils.BaseTextureCache };
    get TextureCache () { return PIXI.utils.TextureCache };
    get utils () { return PIXI.utils };


    getClassScene(className){
        switch (className) {
            case 'Scene_Boot'       : return Scene_Boot       ; break;
            case 'Scene_IntroVideo' : return Scene_IntroVideo ; break;
            case 'Scene_Title'      : return Scene_Title      ; break;
        };
    };
    // defeni les classGroup du jeux pour le loader, lorsqune class appartien a un groups, loader tous les elements de chaque class.
    // lorsque goto:class, verifier a quel loaderSet elel appatien, si le loaderSet nest pas en memore, passer a la scene loading.
    needLoaderKit(className){
        if(this.Scenes[className]){return false}; // alrealy loaded
        function check(arr) { return arr[1].contains(className) };
        const result = Object.entries(this.loaderKit).find(check);
        if(!result){ throw console.error("'getClassGroups' not found, Scene do not exist!") };
        return result[1];
    };

    load (options,loaderKit) {
        this._isLoading = true;
        loaderKit? this.sceneKits = loaderKit.clone() : void 0;
        options  ? this.options   = options   : void 0;
        // firstBoot verifier que tous est deja preloader, ensuite verifier les kits
        if(!this.fonts){ return this.load_fonts() };
        //if(!this.DataScenes){ return this.load_dataScenes(options) };
        //if(!this.Data2){ return this.load_perma() };
        // load and store a cache of each scenes class in the kits
        if(this.sceneKits.length){
            this.loadSceneClass(this.sceneKits.shift());
        }else{ this._isLoading = false };
    };

    load_fonts(){
        const fonts = [
            {name:"ArchitectsDaughter", url:"fonts/ArchitectsDaughter.ttf"},
            {name:"zBirdyGame", url:"fonts/zBirdyGame.ttf"},
        ];
        this.fonts = fonts;
        return this.load();
    };

    load_dataScenes(){
        this.DataScenes = {};
        const classScenes = { // key: nom des class scenes + path
            Scene_Local_data:"data/Scene_Local_data.json",
            Scene_Title_data:"data/Scene_Title_data.json",
        };
        const loader = new PIXI.loaders.Loader();
        for (const key in classScenes) { loader.add(key, classScenes[key]) };
        loader.load();
        loader.onProgress.add((loader, res) => { this.DataScenes[res.name] = res.data });
        loader.onComplete.add((loader, res) => { this.load() });
    };

    load_perma(options){
        this.Data2 = {};
        const perma = { // key: nom des class scenes + path (.png pour les images, mais redefeni l'extentions ensuite)
            gloves:"data2/Miscs/gloves/gloves.png",
            heroe1_rendered:"data2/Characteres/a1/heroe1_rendered.png",
            heroe2:"data2/Characteres/a2/heroe2.png",
            caseFXhit1:"data2/FX/caseFX1/caseFXhit1.png",
            hud_displacement:"data2/Hubs/stamina/hud_displacement.png",
            hudsPinBar:"data2/Hubs/pinBar/hudsPinBar.png",
            hudStats:"data2/Hubs/stats/hudStats.png",
            menueItems:"data2/Hubs/menueItems/menueItems.png",
            gameItems:"data2/Objets/gameItems/gameItems.png",
            playerRadius:"data2/FX/radiusPlayerInteraction/playerRadius.png",
            flagsLocal:"data2/Miscs/flags/flagsLocal-0.png",
        };
        Object.keys(perma).forEach(key => { perma[key] = perma[key].replace('.png', '.json') });
        const loader = new PIXI.loaders.Loader();
        for (const key in perma) { loader.add(key, perma[key]) };
        loader.load();
        loader.onProgress.add((loader, res) => {
            if(res.extension.contains("json")){
                this.Data2[res.name] = res.data;
            };
        });
        loader.onComplete.add((loader, res) => { this.load(options) });
    };

    //STEP:1 load dataScenes scenes?.json
    loadSceneClass(className){
        if(this.DataScenes[className]){
            throw console.error(`${className} alrealy loaded WTF! check json and loadSceneClass`);
        };
        this.buffers = {
            className  :className,
            base       : {} , // this is the final compute data
            ressources  : {} ,
            multiPacks : {} ,
            normals    : {} ,
        };
        const loader = new PIXI.loaders.Loader();
        loader.add(className, `data/${className}.json`).load();
        loader.onProgress.add((loader, res) => { this.DataScenes[className] = res.data }); // json data parsed
        loader.onComplete.add((loader, res) => { this.loadSheets(className) });
    };

    loadSheets(className){
        const loader = new PIXI.loaders.Loader();
        const sheets = this.DataScenes[className]._sheets;
    if(!sheets){ console.warn('%cSCENE JSON EMPTY DATA: Use editor for create json template => %c%s', 'font-weight:bold;color:#000 ;background:#721919', 'font-weight:bold;color:#ee5000;background:#fffbe6', ` ${className}`);}
        for (const name in sheets) { loader.add(name, sheets[name].root) };
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
                    loader.add(fileName.replace('.json',''), `${this.DataScenes[className]._sheets[name].dir}/${fileName}`);
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
        for (const key in this.buffers.ressources) {
            const res = this.buffers.ressources[key];
            const data = data2[key] = this.createBaseFrom(res);
            const key_n = data.meta && data.meta.normal_map && key+'_n';
            const isSpine = !!data.spineData;
            const isVideo = !!data.dataVideo;
            isSpine? Object.assign(data.spineData,res.spineData) : Object.assign(data.textures,res.textures);
            key_n && Object.assign(data.textures_n, this.createNormals(data, res.textures, this.buffers.normals[key_n].texture));
            (!isSpine && !isVideo) && data.meta.related_multi_packs && data.meta.related_multi_packs.forEach(keyLink => {
                keyLink = keyLink.replace('.json','');
                const keyLink_n = keyLink+'_n';
                const resLink = this.buffers.multiPacks[keyLink];
                Object.assign(data.textures, resLink.textures);
                if(data.animations){
                    const animations = Object.entries(resLink.data.animations);
                    animations.forEach(keys => { 
                        data.animations[keys[0]].push(...keys[1]);
                        data.animations[keys[0]].sort();
                    });
                }
                key_n && Object.assign(data.textures_n, this.createNormals(resLink.data, resLink.textures, this.buffers.normals[keyLink_n].texture));
            });
            
            !this.Data2[key] && Object.defineProperty(this.Data2, key, { value: data, enumerable: !(this.buffers.className === 'Scene_Boot') });
        };
        this.createScene();
        this.buffers = null;
        this.utils.clearTextureCache();
        this.load(); // next scene load =>=>=>
    };

    // create scene Cache
    createScene(){
        const className = this.buffers.className;
        const scene = new (this.getClassScene(className))();
        this.Scenes[className] = scene;
    };

    createNormals(data, resTextures, baseTexture_n){
        // .clone(); ? check if we need clone or just link ?
        const textures_n = {};
        for (const key in resTextures) {
            const tex = resTextures[key];
            const frame = tex.frame && tex.frame; 
            const orig = tex.orig && tex.orig;
            const trim = tex.trim && tex.trim;
            const rot = data.frames[key].rotated ? 2 : 0; // data.rotated ? 2 : 0 ?
            textures_n[key+'_n'] = new PIXI.Texture(baseTexture_n, frame, orig, trim, rot, data.frames[key].anchor);
        };
        return textures_n;
    };

    createBaseFrom(res) {
        this.buffers
        const base = {
            name : res.name,
            perma: this.buffers.className === 'Scene_Boot',
            ...( res.isVideo ?  {dataVideo: res.data} : res.data ),
            ...( res.data.meta ? {normal: !!res.data.meta.normal_map } : {normal: true } ), //FIXME: find way to check spine normal ?
            ...( res.spineData ? {meta: {}} : void 0 ),
            ...( res.spineData ? {spineData: {}} : void 0 ),
            ...( 
                res.spineData ?       { type:'spineSheet'}:
                res.data.animations ? { type:'animationSheet'}:
                res.isVideo?          { type:'video'}:
                                      { type:'tileSheet'} ),
            ...(!res.spineData ? {textures: {}, textures_n: {}} : void 0 ),
        };
        return base;
    };


};//END CLASS

   
const $Loader = new _coreLoader();
console.log1('$Loader.', $Loader);
