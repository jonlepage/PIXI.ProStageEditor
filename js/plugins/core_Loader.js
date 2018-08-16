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
        this._currentPlanetID = null; // currentPlanet ID loaded set ?

        this._tmpRes_normal = {};
        this._tmpRes_multiPack = {};
        this._tmpData = null; // store temp data befor normalise structure 
        this._tmpRes = null; // store ressources for compute
        this.Data2 = {};
        this._scene = null; // asign the current sceneLoader
        this.isLoading = false; // loading status
        this.loaderSet = {}; // sloaderSet from JSONlIST =>.json ***
        // FIRST TIME BOOT, NEED ALL JSON LIST
        Object.defineProperties(this, {
            "_JsonPath": {
                value: {
                    MapInfos:"data/MapInfos.json", // also load all maps Map###_data.json and create galaxi register
                    System:"data/System.json", // also load all maps Map###_data.json and create galaxi register

                    Perma:"data/perma.json", // perma , Enemies,cursor,loader,Avatar...
                    Scene_IntroVideo_data:"data/Scene_IntroVideo_data.json",
                    Scene_Local_data:"data/Scene_Local_data.json",
                    Scene_Title_data:"data/Scene_Title_data.json",
                    PlanetID1:"data/PlanetID1.json",
                    
                    //Scene_Boot:"data/Scene_Boot.json",
                    //Scene_IntroVideo:"data/Scene_IntroVideo.json",
                    //Scene_Local_data:"data/Scene_Local_data.json",
                    //Scene_Title:"data/Scene_Title.json",
                },
            }
          });
          Object.defineProperties(this, {
            "_permaName": { // PERMA LIST IN GAME , also allow editor to create or update perma.json based on this
                value: ["gloves","Hero1_Big"],
            }
          });
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
    const L0 = function(){
        const loader0 = new PIXI.loaders.Loader();
        for (const key in this._JsonPath) {
            loader0.add(key, this._JsonPath[key]);
        };
        loader0.load();
        loader0.onProgress.add((loader, res) => {
            this.loaderSet[res.name] = res.data;
        });
        loader0.onComplete.add((loader, res) => {
            L1.call(this);
        });
    };
    L0.call(this);
    const L1 = function(){
        // Scene_Map
        const loader1 = new PIXI.loaders.Loader();
        this.loaderSet.MapInfos.forEach(map => {
            if(map){
                const id = map.id.padZero(3);
                const path = `data/Map${id}.json`;
                loader1.add(String(map.id), path);
            };
        });
        loader1.load();
        loader1.onProgress.add((loader, res) => {
            const _res = this.loaderSet.MapInfos[res.name];
            _res.displayName = res.data.displayName;
            _res.encounterList = res.data.encounterList;
            _res.height = res.data.height;
            _res.width = res.data.width;
            _res.events = res.data.events;
            _res.note = res.data.note? JSON.parse(res.data.note) : {};  
        });
        loader1.onComplete.add((loader, res) => {
            // determine and add reference of galaxiID and planetID
            // it will allow editor to compile a loaderset for planet and map navigation
            function getGalaxiID(original, MapInfos){
                let current = original;
                while (!current.note.galaxiID) { current = MapInfos[current.parentId] };
                return current.note.galaxiID;
            };
            function getPlanetID(original, MapInfos){
                let current = original;
                if(current.note.galaxiID){return false}; // galaxi no have planet id
                while (!current.note.planetID) { current = MapInfos[current.parentId] };
                return current.note.planetID;
            }

            this.loaderSet.MapInfos.forEach(map => {
                if(map){
                    map.galaxiID = getGalaxiID(map, this.loaderSet.MapInfos);
                    map.planetID = getPlanetID(map, this.loaderSet.MapInfos);
                };
            });


            L2.call(this);
        });
    };

    const L2 = function(){
        // Scene_Map .DATA// TODO:
        const loader2 = new PIXI.loaders.Loader();
        this.loaderSet.MapInfos.forEach(map => {
            if(map){
                const id = map.id.padZero(3);
                const path = `data/Scene_MapID${map.id}_data.json`;
                loader2.add(String(map.id), path);
            };
        });
        loader2.load();
        loader2.onError.add((err, loader, res) => { console.error(`Error on load MapID${res.name} Use Editor To create Scene_MapID${res.name}_data.json`) });

        loader2.onProgress.add((loader, res) => {
            if(res.data){
                this.loaderSet[`Scene_MapID${res.name}_data`] = res.data;
            }
          
        });
        loader2.onComplete.add((loader, res) => {
            L3.call(this);
        });
    };

    const L3 = function(){
        // normalize and asign planet galaxi id to all map id.
 

        // build planet information
       /* this.loaderSet.PlanetsInfos = {};
        for (const key in this.loaderSet.Scene_Map) {
            const data = this.loaderSet.Scene_Map[key].data;
            const planetID = data.planet;
            // registering all planet id existe from rmmv comment json
            if(planetID && !this.loaderSet.PlanetsInfos[planetID]){
                this.loaderSet.PlanetsInfos[planetID] = {};
            };
            // scan all game maps and store sheets need for each planet id
            for (const sheetKey in data.sheets) {
                this.loaderSet.PlanetsInfos[planetID][sheetKey] = data.sheets[sheetKey];
            };
        };*/
       this._scene.isLoading = false; // allow continue scene laoder
    };
};

// ┌-----------------------------------------------------------------------------┐
// LOADER DATA
//└------------------------------------------------------------------------------┘
//#1 $Loader.load(['loaderSet',loaderSet]);
_coreLoader.prototype.load = function(set) {
    console.log6('load_________________________________set: ', set);
    this._scene = SceneManager._scene; // current Scene_Loader
    for (const key in this.Data2) { delete this.Data2[key] }; // clear all cache when load new scene
    // check integrety, exist and if we have data in the set
    if(!set){return this._scene.isLoading = false };
    if(!this.loaderSet[set]){return this._scene.isLoading = false}; // return if not exist
    if(!Object.keys(this.loaderSet[set]).length){
        this.loaderSet[set] = false; // turn false the set for the SceneManager skip
        return this._scene.isLoading = false;
    }; // return if not exist

    
    let empty = !!this.loaderSet[set]._SHEETS;
    this._tmpData = this.loaderSet[set]._SHEETS;

    this._tmpRes = {};
    this._tmpRes_normal = {};
    this._tmpRes_multiPack = {};
    const loader = new PIXI.loaders.Loader();
    for (const key in this._tmpData) {
        empty = false;
        const dataJ = this._tmpData[key];
        loader.add(key, `${dataJ.dir}/${dataJ.base}`);
    };
    loader.load();

    loader.onProgress.add((loader, res) => {
        if(res.extension.contains("json")){
            this.asignBase(res);
            this._tmpRes[res.name] = res;
            
        };
    });
    loader.onComplete.add((loader, res) => {
       this.loadMultiPack();
       
    });
    if(empty){loader.onComplete._tail._fn()}; // force onComplete if empty;
};

//#1.1 load planet
_coreLoader.prototype.load_planet = function(set) {


}

//#2 load all multiPack reference
_coreLoader.prototype.loadMultiPack = function() {
    const loader = new PIXI.loaders.Loader();
    let empty = true;
    for (const key in this._tmpData) {
        const isMulti = key.contains("-0");
        if(isMulti){
            empty = false;
            const list =  this._tmpRes[key].data.meta.related_multi_packs;
            list.forEach(fileName => {
                const dir = `${this._tmpData[key].dir}/${fileName}`
                loader.add(fileName, dir);
                loader.resources[fileName].FROM = this._tmpRes[key];
            });
        }
    };
    loader.load();

    loader.onProgress.add((loader, res) => {
        res.extension.contains("json") && (this._tmpRes_multiPack[res.name] = res);
    });
    loader.onComplete.add((loader, res) => {
        this.loadNormal()
     });
     if(empty){loader.onComplete._tail._fn()}; // force onComplete if empty;
     
};

  //#3 load normal png
_coreLoader.prototype.loadNormal = function() {
    const loader = new PIXI.loaders.Loader();
    let empty = true; // if find nothing ? force jump
    for (const key in this._tmpRes) {
        const meta = this._tmpRes[key].data.meta;
        if(meta && meta.normal_map){
            empty = false;
            const path = this._tmpRes[key].url.split("/");
            const dir = `${path[0]}/${path[1]}/${path[2]}/${meta.normal_map}`;
            loader.add(meta.normal_map, dir);
            loader.resources[meta.normal_map].FROM = this._tmpRes[key];
        }
    };
    for (const key in this._tmpRes_multiPack) {
        const meta = this._tmpRes_multiPack[key].data.meta;
        if(meta && meta.normal_map){
            empty = false;
            const path = this._tmpRes_multiPack[key].url.split("/");
            const dir = `${path[0]}/${path[1]}/${path[2]}/${meta.normal_map}`;
            loader.add(meta.normal_map, dir);
            loader.resources[meta.normal_map].FROM = this._tmpRes_multiPack[key];
        }
    };
    loader.load();

    loader.onProgress.add((loader, res) => {
        this._tmpRes_normal[res.name] = res;
    });
    loader.onComplete.add((loader, res) => {
        this.computeRessources();
    });
    if(empty){loader.onComplete._tail._fn()}; // force onComplete if empty;
};

// we have data, multipack, normal, now merging
_coreLoader.prototype.computeRessources = function() {
    this.computeNormal();
    this.computeMultiPack();
    this.computeData();
    PIXI.utils.clearTextureCache();
    this._scene.isLoading = false;
 };


// asign base type data and normalise structures
_coreLoader.prototype.asignBase = function(res) {
    const type = res.spineData && "spineSheet" || res.data.animations && "animationSheet" || "tileSheet";
    const tmpData = this._tmpData[res.name];
    
    if(type==="spineSheet"){ // type spineSheet;
        //Object.defineProperty(tmpData, "baseTextures", { value: [], writable:true }); // only for editor
        Object.defineProperty(tmpData, "spineData", { value: {}, writable:true });
        Object.defineProperty(tmpData, "data", { value: {}, writable:true });
        Object.defineProperty(tmpData, "perma", { value: $Loader._permaName.contains(res.name) });
        Object.defineProperty(tmpData, "type", { value: "spineSheet"});
        Object.defineProperty(tmpData, "normal", { value: false, writable:true}); // TODO: need scan skin

        return type;
    };
    if(type==="animationSheet" || type==="tileSheet"){
        //Object.defineProperty(tmpData, "baseTextures", {value: [], writable:true }); // only for editor
        Object.defineProperty(tmpData, "textures", { value: {} ,writable:true });
        Object.defineProperty(tmpData, "textures_n", { value: {} ,writable:true });
        Object.defineProperty(tmpData, "data", { value: {}, writable:true });
        Object.defineProperty(tmpData, "perma", { value: $Loader._permaName.contains(res.name) });
        Object.defineProperty(tmpData, "type", { value: type});
        Object.defineProperty(tmpData, "normal", { value: false, writable:true});
        return type;
    };
    return console.error("WARNING, can not find type of packages sheets! Missing meta:",res)
};
    
// create Normal Textures
_coreLoader.prototype.computeNormal = function() {
    for (const key in this._tmpRes_normal) {
        const res = this._tmpRes_normal[key];
        const baseTexture = res.texture.baseTexture;
        const textures_n = {};
        for (const texName in  res.FROM.textures) {
            const tex = res.FROM.textures[texName];
            const orig = tex.orig.clone();
            const frame = tex._frame.clone();
            const trim = tex.trim && tex.trim.clone();
            const rot = tex._rotate;
            const texture = new PIXI.Texture(baseTexture, frame, orig, trim, rot); // (this.baseTexture, this.frame, this.orig, this.trim, this.rotate
            texture.textureCacheIds = [texName];
            textures_n[`${texName}_n`] = texture;
        }
        res.FROM.textures_n = textures_n;
    };
    delete this._tmpRes_normal;
};

// assign multiPack data to FROM original data
_coreLoader.prototype.computeMultiPack = function() {
    for (const key in this._tmpRes_multiPack) {
        const ress = this._tmpRes_multiPack[key];

        const textures = ress.textures;
        const origin_textures = ress.FROM.textures;
        Object.assign(origin_textures, textures);

        const textures_n = ress.textures_n;
        const origin_textures_n = ress.FROM.textures_n;
        Object.assign(origin_textures_n, textures_n);

        // DATA
        const frames = ress.data.frames;
        const origin_frames = ress.FROM.data.frames;
        Object.assign(origin_frames, frames);

        const animations = ress.data.animations;
        const origin_animations = ress.FROM.data.animations;
        for (const key in animations) {
            const ani = animations[key];
            origin_animations[key].push(...ani);
        };

        ress.FROM.children.push(ress.children[0]) // add baseTexture for editor only
    };
    delete this._tmpRes_multiPack;
};

_coreLoader.prototype.computeData = function() {
    for (const key in this._tmpData) {
        const tmpData = this._tmpData[key];
        const tmpRes = this._tmpRes[key];

        if(tmpData.type === "spineSheet"){
            tmpData.data = tmpRes.data;
            tmpData.spineData = tmpRes.spineData;
        };

        if(tmpData.type ==="tileSheet"){
            Object.assign(tmpData.data, tmpRes.data);
            if( tmpData.dirArray.contains("BG") ){
                const texName = Object.keys(tmpRes.textures)[0];
                Object.assign(tmpData.textures, tmpRes.textures[texName]);
                Object.assign(tmpData.textures_n, tmpRes.textures_n[texName+"_n"]);
                tmpData.BG = true;
            }else{
                Object.assign(tmpData.textures, tmpRes.textures);
                Object.assign(tmpData.textures_n, tmpRes.textures_n);
            };
            tmpData.normal = !!tmpData.data.meta.normal_map; 

        };

        if(tmpData.type ==="animationSheet"){
            Object.assign(tmpData.data, tmpRes.data);
            tmpData.normal = !!tmpData.data.meta.normal_map;
            for (const key in tmpRes.data.animations) {
                tmpData.textures[key] = [];
                tmpData.textures_n[key] = [];
                const keyList = tmpRes.data.animations[key];
                keyList.sort().forEach(keyAni => {
                    const ani = tmpRes.textures[keyAni];
                    const ani_n = tmpRes.textures_n[keyAni+"_n"];
                    tmpData.textures[key].push(ani);
                    tmpData.textures_n[key].push(ani_n);
                });
            };
        };
    };
    Object.assign(this.Data2, this._tmpData);
    for (const key in this.Data2) {
        if(this.Data2[key].perma){
            Object.defineProperty(this.Data2, key, {
                enumerable: false,
            });
        };
    };
    delete this._tmpData;
    delete this._tmpRes;
};


//┌-----------------------------------------------------------------------------┐
// DESTOY MANAGER
// Destroy all tmp cache, an also all pixi object created in scene
// pixi text, pixi grafics, 
//└-----------------------------------------------------------------------------┘
