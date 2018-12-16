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
        this.DataScenes = null //{} info sur tous les pack utliser par scene et leur dir, cpntien aussi tous les events du jeux a mapper random newGame
        this.Scenes = {}; // store full scenes cache
        this.options = {};
        this.fonts = null;
        this._textsSCVLoaded = null; // is textsSCV loaded
        this.loaderBuffers = [];
        this._isLoading = false;
        this.loaderKit = { // batch .json in arrays, when change scene, check if need load a kits
            loaderSet_boot:['Scene_Boot','Scene_IntroVideo','Scene_Title'],
            loaderSet_planet1:['Scene_Map1'],
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
            case 'Scene_Map1'      : return Scene_Map1      ; break;
        };
    };
    // defeni les classGroup du jeux pour le loader, lorsqune class appartien a un groups, loader tous les elements de chaque class.
    // lorsque goto:class, verifier a quel loaderSet elel appatien, si le loaderSet nest pas en memore, passer a la scene loading.
    needLoaderKit(className){
        if(this.currentLoadedKit.contains(className)){return false}; // alrealy loaded
        this.currentLoadedKit = [];
        function check(arr) { return arr[1].contains(className) };
        const result = Object.entries(this.loaderKit).find(check);
        if(!result){ throw console.error("CRITIAL ERROR:'getClassGroups' not found, Scene do not exist!") };
        // reset for next loading
        this.destroyData();
        this.currentLoadedKit = result[1];
        return result[1];
    };

    // when need a new loadKit? destroy all cache elements for new loading
    destroyData () {
        this.currentLoadedKit = [];
        //this.DataScenes = {}; //reset data loaded TODO: voir si on peut garder , mais on doi tous precharger au sceneBoot
        this.Scenes = {}; // store full scenes cache
        for (const key in this.Data2) { delete this.Data2[key] };
    };

    load (options,loaderKit) {
        this._isLoading = true;
        loaderKit? this.sceneKits = loaderKit.clone() : void 0;
        options  ? this.options   = options   : void 0;
        // firstBoot verifier que tous est deja preloader, ensuite verifier les kits
        if(!this.fonts){ return this.load_fonts() };
        if(!this._textsSCVLoaded){ return this.load_textsSCV() };
        if(!this.DataScenes){ return this.load_dataScenes() };
        //if(!this.Data2){ return this.load_perma() };
        // load and store a cache of each scenes class in the kits
        if(this.sceneKits.length){
            this.loadSheets(this.sceneKits.shift());
        }else{ 
            this.options = {}; this._isLoading = false 
        };
    };

    loadFromEditor (className,dataFromNwjs) {
        this._isLoading = true;
        this.options.fromEditor = true;
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

    load_textsSCV(){
        const loader = new PIXI.loaders.Loader();
        loader.add('eventMessagesData', `data/eventMessage.csv`);
        loader.load();
        loader.onProgress.add((loader, res) => {
            this.dataText = Papa.parse(res.data);
            $texts.initializeFromData($Loader.dataText);
        });
        loader.onComplete.add((loader, res) => {
            this._textsSCVLoaded = true;
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

    // preload all data scene strings data, help for compute new random game
    load_dataScenes(){
        this.DataScenes = {};
        const loader = new PIXI.loaders.Loader();
        const scenesList = [].concat(...Object.values(this.loaderKit));
        scenesList.forEach(sceneDataName => {
            loader.add(sceneDataName, `data/${sceneDataName}.json`);
        });
        loader.load();
        loader.onProgress.add((loader, res) => {  this.DataScenes[res.name] = res.data }); // json string data parsed
        loader.onComplete.add((loader, res) => { this.load() });
    };

    loadSheets(className){
        this.buffers = {
            className  :className,
            base       : {} , // this is the final compute data
            ressources  : {} ,
            multiPacks : {} ,
            normals    : {} ,
        };
        if(!this.DataScenes[className]){throw console.error(`Critical Error: JSON dont contains Base structure: [_sheets,_objs,background,lights...]`)}
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
        for ( const key in this.buffers.ressources ) {
            const res = this.buffers.ressources[key];
            const data = data2[key] = this.createBaseFrom(res);
            const key_n = data.meta && data.meta.normal_map && key+'_n';
            const isSpine = !!data.spineData ;
            const isVideo = !!data.dataVideo ;
            const isAni   = data.type === 'animationSheet';
            //FIXME: TODO: WARNING, objAsign spineData remove proto__ SkeletonData are not allowed, will not herit context
            isSpine? data.spineData = res.spineData : Object.assign(data.textures,res.textures);
            key_n && Object.assign(data.textures_n, this.createNormals(data, res.textures, this.buffers.normals[key_n].texture));
            //multiPacks
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
                };
                key_n && Object.assign(data.textures_n, this.createNormals(resLink.data, resLink.textures, this.buffers.normals[keyLink_n].texture));
            });
            if(isAni){ // cache a map of bach textures animations by name
                let _textures = {};
                let _textures_n = {};
                for (const key in data.animations) {
                    _textures   [key ] = data.animations[key].map(a => data.textures   [a     ]);
                    _textures_n [key ] = data.animations[key].map(a => data.textures_n [a+'_n']);
                }
                data.textures = _textures;
                data.textures_n = _textures_n;
            };
            data.dirArray = this.DataScenes[className]._sheets[key].dirArray;
            // add only if need
            !this.Data2[key] && Object.defineProperty(this.Data2, key, { value: data, enumerable: !(this.buffers.className === 'Scene_Boot'), configurable: true });
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
        if(this.options.fromEditor){
            Object.defineProperty(base, "baseTextures", { value: [], writable:true });
            //base.baseTextures.push(res.children[res.children.length-1].texture.baseTexture); FIXME: broken in pixi
            const texture = this.utils.TextureCache[`${res.name}_image`] || this.utils.TextureCache[`${res.name}_atlas_page_${res.name}.png`];
            base.baseTextures.push( texture );
            if(base.meta.related_multi_packs){
                base.meta.related_multi_packs.forEach(keyLink => {
                    keyLink = keyLink.replace('.json','');
                    const resLink = this.buffers.multiPacks[keyLink];
                    //base.baseTextures.push(resLink.spritesheet.baseTexture);
                    base.baseTextures.push( this.utils.TextureCache[`${resLink.name}_image`] );
                });
            };
        };
        return base;
    };

    loadCSV(){
        const loader = new PIXI.loaders.Loader();
        loader.add('ddd', `data/eventMessage.csv`);
        loader.load();
        loader.onProgress.add((loader, res) => {
            console.log('res: ', res);
        });
    };


};//END CLASS

   
const $Loader = new _coreLoader();
console.log1('$Loader.', $Loader);
