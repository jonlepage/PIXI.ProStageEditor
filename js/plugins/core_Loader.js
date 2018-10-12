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
        this.Data2 = {}; // all cache game data ***
        this._scene = null; // attache current scene stage
        this.loaderSet = null; // sloaderSet from JSONlIST =>.json ***
        this.isLoading = false; // loading status
        this._currentSet = null; // store the current set loading
        this._progressTxt = `BOOT:cores:  `;
        // JSON BOOT LIST
        Object.defineProperties(this, { "_JsonPath": { value: {
            //RMMV
            MapInfos:"data/MapInfos.json", // also load all maps Map###_data.json and create galaxi register
            System:"data/System.json", // also load all maps Map###_data.json and create galaxi register
            //EDITOR
            Perma:"data/perma.json", // perma , Enemies,cursor,loader,Avatar...
            //Scene_IntroVideo_data:"data/Scene_IntroVideo_data.json",
            Scene_Local_data:"data/Scene_Local_data.json",
            Scene_Title_data:"data/Scene_Title_data.json",
            // PLANETS
            PlanetID1_data:"data/PlanetID1_data.json",
            //MAPS
            Scene_MapID1_data:"data/Scene_MapID1_data.json", // nathalia Farm
        },}});
        // PERMA LIST // PERMA LIST IN GAME , also allow editor to create or update perma.json based on this
        Object.defineProperties(this, { "_permaName": { value: [
            "gloves","heroe1_rendered","heroe2"
        ],}});
    };
    
    get BaseTextureCache () { return PIXI.utils.BaseTextureCache };
    get TextureCache () { return PIXI.utils.TextureCache };
    get utils () { return PIXI.utils };
};

const $Loader = new _coreLoader();
console.log1('$Loader.', $Loader);

// update information in sceneLoader
_coreLoader.prototype.updateSceneLoader = function(res) {
    this._scene._progress = 0;
    this._scene._progressTxt = [];
};

// ┌-----------------------------------------------------------------------------┐
// LOADER JSON
// special boot once loader for json
//└------------------------------------------------------------------------------┘
// $Loader.preLoad_Json();
_coreLoader.prototype.preLoad_Json = function() {
    // add loaderSet: ...MapInfos and Scene### base
    this.isLoading = true;
    this.loaderSet = {};
    // add temp buffers
    this._tmpRes_normal = {};
    this._tmpRes_multiPack = {};
    this._tmpData = null; // store temp data befor normalise structure 
    this._tmpRes = null; // store ressources for compute


    const loader0 = new PIXI.loaders.Loader();
    for (const key in this._JsonPath) {
        loader0.add(key, this._JsonPath[key]);
    };
    loader0.load();
    loader0.onProgress.add((loader, res) => {
        this.loaderSet[res.name] = res.data;
        console.log('this.loaderSet[res.name]: ', this.loaderSet[res.name]);
        this._progressTxt = this._progressTxt+` ${res.url }\n`; //FIXME: loader Text
    });
    loader0.onComplete.add((loader, res) => {
        this._progressTxt = this._progressTxt+`___________________________\n`; //FIXME: loader Text
        this.isLoading = false; // allow continue scene laoder
    });
};

// ┌-----------------------------------------------------------------------------┐
// LOADER DATA
//└------------------------------------------------------------------------------┘
//#1 $Loader.load(['loaderSet',loaderSet]);
_coreLoader.prototype.load = function(set) {
    console.log6('coreLoader_________________________________set: ', set);
    this.isLoading = true;
    this._currentSet = set;
    this._scene = SceneManager._scene; // current Scene_Loader
    this.destroys(); // clear all cache when load new scene

    // check integrety, exist and if we have data in the set
    if(this.cantLoad(set)){return this.isLoading = false }; // check if cant or can load ??

    
    // temp buffers
    let sheetsBuffer = this.loaderSet[set]._sheets; // ref to loaderSet sheets 
    let data2Buffer = this.Data2; // buffer ref to final storage
    let ressBuffer = {}; // buffer for store ressource temporary.
    let normalBuffer = {}; // buffer for store Normal packs temporary.
    let multiPackBuffer = {}; // buffer for store multiPack sheets temporary.
    
    let loader = new PIXI.loaders.Loader();
    for (const name in sheetsBuffer) {
        if(!data2Buffer[name]){ // jump perma clone
            const sheetData = sheetsBuffer[name];
            loader.add(name, `${sheetData.dir}/${sheetData.base}`);
        };
    };
    loader.load();

    loader.onProgress.add((loader, res) => {
    if(res.extension.contains("json")){
            asignBase(res.name, res); // add more informations to ._sheets 
            ressBuffer[res.name] = res;
        };
    });
    loader.onComplete.add((loader, res) => {
       loadMultiPack(); // NEXT STEP++
    });

    // SCOPE FUNCTIONS FOR MULTIAPCK , ANIMATIONS, AND NORMALS 

    function loadMultiPack(){
        let loader = new PIXI.loaders.Loader();
        for (const sourceName in data2Buffer) {
            if( sourceName.contains("-0") ){ // have MultiPack
                const list = ressBuffer[sourceName].data.meta.related_multi_packs;
                list.forEach(fileName => {
                    const dir = `${sheetsBuffer[sourceName].dir}/${fileName}`;
                    const name = fileName.substring(0, fileName.length-5); // normalize name without ".png"
                    loader.add(name, dir); 
                    loader.resources[name].sourceName = sourceName; // multiPack need know the original source of texturePacker
                });
            };
        };
        loader.load();
        loader.onProgress.add((loader, res) => {
            if(res.extension.contains("json")){ multiPackBuffer[res.name] = res };
        });
        loader.onComplete.add((loader, res) => {
            loadNormal(); // NEXT LOAD STEP++
        });
        !loader.loading && loader.onComplete._tail._fn(); // force continue if nothing to load;
    };

    function loadNormal() {
        const loader = new PIXI.loaders.Loader();
        for (const name in data2Buffer) {
            const meta = ressBuffer[name].data.meta;
            if(meta && meta.normal_map){
                const originPath = sheetsBuffer[name].dir;
                const dir = `${originPath}/${meta.normal_map}`;
                loader.add(meta.normal_map.substring(0, meta.normal_map.length-6), dir);
            };
        };
        for (const name in multiPackBuffer) {
            const meta = multiPackBuffer[name].data.meta;
            if(meta && meta.normal_map){
                const path = multiPackBuffer[name].url.split("/");
                const dir = `${path[0]}/${path[1]}/${path[2]}/${meta.normal_map}`;
                loader.add(meta.normal_map.substring(0, meta.normal_map.length-6), dir);
            };
        };
        loader.load();
        loader.onProgress.add((loader, res) => {
            normalBuffer[res.name] = res;
        });
        loader.onComplete.add((loader, res) => {
            computeNormal();
            computeMultiPack();
            computeData();
            finalize();
        });
        !loader.loading && loader.onComplete._tail._fn();
    };

    // COMPUTING DATA BUFFERED
    // asign base type data and normalise structures
    function asignBase(name, res) {
        const data2 = data2Buffer[name] = {}; // final result
        Object.assign(data2, sheetsBuffer[name]); // base for editor (no need for deployed projet)
        const type = res.spineData && "spineSheet" || res.data.animations && "animationSheet" || "tileSheet"; // get the type ? 
        if(type==="spineSheet"){ // type spineSheet;
            //Object.defineProperty(tmpData, "baseTextures", { value: [], writable:true }); // only for editor
            Object.defineProperty(data2, "spineData", { value: {}, writable:true });
            Object.defineProperty(data2, "data", { value: {}, writable:true });
            Object.defineProperty(data2, "perma", { value: $Loader._permaName.contains(res.name) });
            Object.defineProperty(data2, "type", { value: "spineSheet"});
            Object.defineProperty(data2, "normal", { value: false, writable:true}); // TODO: need scan skin
            return;
        };
        if(type==="animationSheet" || type==="tileSheet"){
            //Object.defineProperty(tmpData, "baseTextures", {value: [], writable:true }); // only for editor
            Object.defineProperty(data2, "textures", { value: {} ,writable:true });
            Object.defineProperty(data2, "textures_n", { value: {} ,writable:true });
            Object.defineProperty(data2, "data", { value: {}, writable:true });
            Object.defineProperty(data2, "perma", { value: $Loader._permaName.contains(res.name) });
            Object.defineProperty(data2, "type", { value: type});
            Object.defineProperty(data2, "normal", { value: false, writable:true});
            return;
        };
        return console.error("CRITICAL WARNING, can not find type of packages sheets! Missing meta. check version of the sheet:",res)
    };

    // asign normals textures to ressBuffer or multiPackBuffer
    computeNormal = function() {
        for (const name in normalBuffer) {
            const baseTexture = normalBuffer[name].texture.baseTexture;
            const original = ressBuffer[name] || multiPackBuffer[name]; // get original caller in witch buffers ? 
            const textures_n = {};
            // get all textures from original
            for (const texName in original.textures) {
                const tex = original.textures[texName];
                const orig = tex.orig.clone();
                const frame = tex._frame.clone();
                const trim = tex.trim && tex.trim.clone();
                const rot = tex._rotate;
                const texture = new PIXI.Texture(baseTexture, frame, orig, trim, rot); // (this.baseTexture, this.frame, this.orig, this.trim, this.rotate
                texture.textureCacheIds = [texName+"_n"];
                textures_n[`${texName}_n`] = texture;
            };
            original.textures_n = textures_n; // add to originals textures normals
        };
    };

    // merge multiPack data and textures to ressBuffer;
    function computeMultiPack() {
        for (const key in multiPackBuffer) {
            const pack = multiPackBuffer[key];
            const original = ressBuffer[pack.sourceName];
            // merge multiPack to original ressBuffer 
            Object.assign(original.textures, pack.textures);
            Object.assign(original.textures_n, pack.textures_n);
            // merge frames if animations ? 
            if(pack.data.animations){
                Object.assign(original.data.frames, pack.data.frames);
                for (const key in pack.data.animations) {
                    const ani = pack.data.animations[key];
                    original.data.animations[key].push(...ani);
                };
            };
        };
    };

    // add data and textures to data2Buffer
    
    computeData = function() {
        for (const name in data2Buffer) {
            const origin = data2Buffer[name];
            if(origin.type === "spineSheet"){
                //FIXME: TODO: WARNING, objAsign spineData proto__ SkeletonData are not allowed
                origin.data = ressBuffer[name].data;
                origin.spineData = ressBuffer[name].spineData;
            }
            else if(origin.type === "tileSheet"){
                Object.assign(origin.data, ressBuffer[name].data);
                 // BG are special, asign single first texture only without the name reference.
                if( origin.isBG ){
                    const texName = Object.keys(ressBuffer[name].textures)[0];
                    const texture = ressBuffer[name].textures[texName];
                    const texture_n = ressBuffer[name].textures_n[texName+"_n"];
                    Object.assign(origin.textures, texture);
                    Object.assign(origin.textures_n, texture_n);
                    
                }else{
                    Object.assign(origin.textures, ressBuffer[name].textures);
                    Object.assign(origin.textures_n, ressBuffer[name].textures_n);
                };
            }
            else if(origin.type === "animationSheet"){
                // build animations data
                Object.assign(origin.data, ressBuffer[name].data);
                for (const key in origin.data.animations){
                    const keyList = origin.data.animations[key];
                    origin.textures[key] = [];
                    origin.textures_n[key] = [];
                    keyList.sort().forEach(keyAni => {
                        const ani = ressBuffer[name].textures[keyAni];
                        const ani_n = ressBuffer[name].textures_n[keyAni+"_n"];
                        origin.textures[key].push(ani);
                        origin.textures_n[key].push(ani_n);
                    });
                };
            };
        };
    };

    // END LOADERS
    function finalize() {
        sheetsBuffer = null;
        ressBuffer = null;
        normalBuffer = null;
        multiPackBuffer = null;
        // check if perma
        PIXI.utils.clearTextureCache();
        $Loader.isLoading = false;
    };
};

//┌-----------------------------------------------------------------------------┐
// DESTOY MANAGER
// Destroy all tmp cache, an also all pixi object created in scene
// pixi text, pixi grafics, 
//└-----------------------------------------------------------------------------┘
_coreLoader.prototype.cantLoad = function(set) {
    // check if pass set? or not exist? or is empty ?
    if(!set || !this.loaderSet[set] || !this.loaderSet[set]._sheets){
        return true; // we cant load
    };
    return false;  // we can load
};

// destroy custom cache but keep perma not enumerable
_coreLoader.prototype.destroys = function() {
    PIXI.utils.clearTextureCache();
    for (const key in this.Data2) { 
        delete this.Data2[key];
    }; 
};

// make perma current data2, do it once when sceneBooting the game
_coreLoader.prototype.setPermaCurrentData = function() {
    for (const key in this.Data2) {
        Object.defineProperty(this.Data2, key, { enumerable: false });
    }; 
};

// return data of current loaderSet
_coreLoader.prototype.getCurrentLoaderSet = function(set) {
    // force get new set
    if(set){
        this._currentSet = set;
    }
    if(this._currentSet){
        return this.loaderSet[this._currentSet];
    };
};

