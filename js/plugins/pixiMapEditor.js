/*:
// PLUGIN □────────────────────────────────□PIXI MAP EDITOR□─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc EDITOR GUI for create map with object sprine JSON (texture packer, spine)
* V.1.1.5A
* License:© M.I.T
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
    this.CAGE_MOUSE.name = "CAGE_MOUSE";
    this.CAGE_MAP.name = "CAGE_MAP";
    this.CAGE_GUI.name = "CAGE_GUI";

*/

 // START INITIALISE EDITOR (FROM RMMV PLUGIN MANAGER)
document.addEventListener('keydown', initializeEditor);
function initializeEditor(event){
    if(event.key === "F1" && !$PME.started){
        console.log1('__________________initializeEditor:__________________ ');
        (function() {
            $PME.started = true;
            $PME.stage = SceneManager._scene;
            $gameSystem && ($gameSystem._menuEnabled = false); // disable rmmv menu
            const javascript = [
                "js/iziToast/iziToast.js",
                "js/iziToast/pixiMapEditor_HTML.js",
                "js/iziToast/pixiMapEditor_TOAST.js",
                "js/jscolor/bootstrap-slider.js",
                "js/jscolor/jscolor.js",
            ];
            const css = [
                'js/iziToast/iziToast.css',
                "js/iziToast/bootstrap.min.css",
                "js/jscolor/bootstrap-slider.css",
                "editor/customEditorCSS.css",
            ];
            function onComplette(){
                $PME.startEditorLoader();
            };
            const head = document.getElementsByTagName('head')[0];
            let total = javascript.length + css.length;
            for (let i = 0, l = css.length; i < l; i++) {
                let link = document.createElement('link');
                link.onload = function() {
                    total--;
                    !total && onComplette();
                  };
               // link.async = false;
                //tmp = link.cloneNode(true);
                link.href = css[i];
                link.rel = 'stylesheet';
                head.appendChild(link);
            }
            for (let i = 0, l = javascript.length; i < l; i++) {
                let script = document.createElement('script');
                script.onload = function() {
                    total--;
                    !total && onComplette();
                  };
                script.async = false;
                script._url = javascript[i];
                script.src = javascript[i];
                script.href = javascript[i];
                document.body.appendChild(script);
            }
            
        })();
        // hack mouse interaction from scene
        // we dont whant the scene interaction
        $mouse.__proto__._mousedown = function(){};
        $mouse.__proto__._mouseup = function(){};

    };
};

// ┌------------------------------------------------------------------------------┐
// GLOBAL $PME CLASS: _SLL for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
class _PME{
    constructor() {
        this.version = "v1.1.5A";
        this._tmpRes_normal = {};
        this._tmpRes_multiPack = {};
        this._tmpRes = {};
        this._tmpData = {}; // store tmp data for loader , wait to compute
        this.Data2 = {};
        this.editor = {}; // store editor
        this.stage = null;
    };
  };
  const $PME = new _PME(); // global ↑↑↑
  console.log2('$PME.', $PME);

// ┌------------------------------------------------------------------------------┐
// wait JSONlibraryLoader befor initialise pixiMapEditor
//└------------------------------------------------------------------------------┘


_PME.prototype.startEditorLoader = function() {
    iziToast.warning( this.izit_loading1() );
    const loader = new PIXI.loaders.Loader();
    loader.add('editorGui', `editor/pixiMapEditor1.json`);
    loader.load();
    loader.onProgress.add((loader, res) => {
        if (res.extension === "png") { this.editor[res.name] = res.texture};
        if (res.spineData) { this.editor[res.name] = res.spineData};
    });
    loader.onComplete.add(() => {
        this.load_nwJSFolderLibs();
    });
 };

 _PME.prototype.load_nwJSFolderLibs = function() {
    const loadingStatus =  document.getElementById('izit_loading1');
    const path = require('path'), fs=require('fs');
    var fromDir = function(startPath,filter){
        if (!fs.existsSync(startPath)){
            return; console.log("no dir ",startPath);
        };
        let files=fs.readdirSync(startPath);
        for(let i=0;i<files.length;i++){
            let filename=path.join(startPath,files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory()){
                fromDir(filename,filter); //recurse
            }
            else if (filename.indexOf(filter)>=0) {
                let filenameFormated =  filename.replace(/\\/g, "/");
                let dirArray = filenameFormated.split("/"); // repertoire path formated for array [,,,]
                let fileData = path.parse(filenameFormated); // split data
                    dirArray.pop();
                    fileData.dirArray = dirArray;
                if( (fileData.dirArray.contains("SOURCE") || fileData.dirArray.contains("source")) ){continue};// (exlude all json in source folder)
                if( fileData.name.contains("-") && !fileData.name.contains("-0")  ){continue};// (exlude multiPack)

                fileData.root = `${fileData.dir}/${fileData.base}`
                this._tmpData[fileData.name] = fileData;
                //const loadProgressTxt = document.createElement("div");
                //loadProgressTxt.innerHTML = `<p><span style="color:#fff">${fileData.name}</span> ==><span style="color:#989898">"${filename}"</span></p>`;
                //loadingStatus.appendChild(loadProgressTxt);
            };
        };
    }.bind(this);
    fromDir('data2','.json'); //START
    this.loadDataJson();
 };


 //#1 start load all json data
 _PME.prototype.loadDataJson = function() {
    const loader = new PIXI.loaders.Loader();
    for (const key in this._tmpData) {
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
 };


//#2 load all multiPack reference
_PME.prototype.loadMultiPack = function() {
    const loader = new PIXI.loaders.Loader();
    for (const key in this._tmpData) {
        const isMulti = key.contains("-0");
        if(isMulti){
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
        this.loadNormal();
     });
};

  //#3 load normal png
_PME.prototype.loadNormal = function() {
    const loader = new PIXI.loaders.Loader();
    for (const key in this._tmpRes) {
        const meta = this._tmpRes[key].data.meta;
        if(meta && meta.normal_map){
            const path = this._tmpRes[key].url.split("/");
            const dir = `${path[0]}/${path[1]}/${path[2]}/${meta.normal_map}`;
            loader.add(meta.normal_map, dir);
            loader.resources[meta.normal_map].FROM = this._tmpRes[key];
        }
    };
    for (const key in this._tmpRes_multiPack) {
        const meta = this._tmpRes_multiPack[key].data.meta;
        if(meta && meta.normal_map){
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
};

// we have data, multipack, normal, now merging
_PME.prototype.computeRessources = function() {
    this.computeNormal();
    this.computeMultiPack();
    this.computeData();

    this.startGui();
 };

    // asign base type data and normalise structures
_PME.prototype.asignBase = function(res) {
    const type = res.spineData && "spineSheet" || res.data.animations && "animationSheet" || "tileSheet";
    const tmpData = this._tmpData[res.name];
    if(type==="spineSheet"){ // type spineSheet;
        Object.defineProperty(tmpData, "baseTextures", { value: [], writable:true }); // only for editor
        Object.defineProperty(tmpData, "spineData", { value: {}, writable:true });
        Object.defineProperty(tmpData, "data", { value: {}, writable:true });
        Object.defineProperty(tmpData, "perma", { value: $Loader._permaName.contains(res.name) });
        Object.defineProperty(tmpData, "type", { value: "spineSheet"});
        Object.defineProperty(tmpData, "normal", { value: false, writable:true}); // TODO: need scan skin

        return type;
    };
    if(type==="animationSheet" || type==="tileSheet"){
        Object.defineProperty(tmpData, "baseTextures", {value: [], writable:true }); // only for editor
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
_PME.prototype.computeNormal = function() {
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
_PME.prototype.computeMultiPack = function() {
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

_PME.prototype.computeData = function() {
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

        // for editor only: create thumbs baseTextures sheets preview
        tmpRes.children.forEach(ressource => {
            if(ressource.extension.contains("png")){
                tmpData.baseTextures.push(PIXI.Texture.from(ressource.data));
            };
        });
    };
    this.Data2 = Object.assign({}, this._tmpData);
    delete this._tmpData;
    delete this._tmpRes;
};

 _PME.prototype.startGui = function() {
    // scene hack
    const scene = SceneManager._scene;
    scene.CAGE_EDITOR = new PIXI.Container();
    scene.CAGE_EDITOR.name = "CAGE_GUI";
    scene.addChildAt(SceneManager._scene.CAGE_EDITOR, scene.children.length-1);

    const cage = new PIXI.Container();
    const spine = new PIXI.spine.Spine(this.editor.editorGui);
    scene.CAGE_EDITOR.addChild(spine);
    this.editorGui = spine;

    spine.autoUpdate = true;
    spine.state.setAnimation(0, 'idle', true);
    spine.state.setAnimation(1, 'start0', false);
    //EDITOR.state.setAnimation(2, 'hideTileSheets', false);
    spine.state.tracks[1].listener = {
        complete: function(trackEntry, count) {
            iziToast.hide({transitionOut: 'fadeOutUp'}, document.getElementById("izit_loading1") );
            iziToast.warning( $PME.izit_loading1() );
            $PME.startEditor();
        }
    };
 };


// ┌------------------------------------------------------------------------------┐
// END START INITIALISE PLUGIN METHOD** ↑↑↑
// └------------------------------------------------------------------------------┘


 // Start The Editor initialisation SCOPE
_PME.prototype.startEditor = function() {
    console.log1('__________________startEditor:__________________ ');
    //#region [rgba(200, 0, 0,0.1)]
    // ┌------------------------------------------------------------------------------┐
    // Start The Editor initialisation SCOPE
    // └------------------------------------------------------------------------------┘
    const SCENEJSONSETUP = {bg:null}; // base configuration for the scene.ambiant, BG ....
    const CACHETILESSORT = {}; //CACHE FOR PATHFINDING ONCE
    const FILTERS = { // buffer filter
        OutlineFilterx4: new PIXI.filters.OutlineFilter (4, 0x000000, 1),
        OutlineFilterx16: new PIXI.filters.OutlineFilter (16, 0x000000, 1),
        OutlineFilterx6White: new PIXI.filters.OutlineFilter (6, 0xffffff, 1),
        OutlineFilterx8Green: new PIXI.filters.OutlineFilter (8, 0x16b50e, 1),
        OutlineFilterx8Green_n: new PIXI.filters.OutlineFilter (8, 0x16b50e, 1), // need x2 because use x2 blendMode for diffuse,normal
        OutlineFilterx8Red: new PIXI.filters.OutlineFilter (8, 0xdb120f, 1),
        ColorMatrixFilter: new PIXI.filters.ColorMatrixFilter(),
        PixelateFilter12: new PIXI.filters.PixelateFilter(12),
        BlurFilter: new PIXI.filters.BlurFilter (10, 3),
    }
    FILTERS.ColorMatrixFilter.desaturate();

    const STAGE = SceneManager._scene; 
    console.log2('STAGE: ', STAGE);
    const DATA = this.Data2;
    const EDITOR = this.editorGui;
    const Renderer = Graphics._renderer; // ref to current renderer RMMV Graphics
    let ButtonsSlots = []; // store spine buttons
    let InMask = null;
    let InLibs = null;
    let InTiles = null;
    let InButtons = null;
    let InMapObj = null;
    let mX = 100, mY = 100; // mosue screen
    let mMX = 0, mMY = 0; // mouse map 
    let HoldX = 0, HoldY = 0; // mouse map
    let FreezeMY = null;
    // scoller 
    let scrollAllowed = true;
    let ScrollX = 0;
    let ScrollY = 0;
    let ScrollF = 0.1; // _displayXY power for scroll map
    let scrollSpeed = 20;
    // zoom 
    const Zoom = STAGE.CAGE_MAP.scale;
    const MemCoorZoom1 = new PIXI.Point(), MemCoorZoom2 = new PIXI.Point(); // for control zoom memory
    let MouseTimeOut = null; // store mouse hold timeOut when hold click
    let MouseHold = null; // click mouse is held ?
    let LineDraw = null;
    const LineList = []; // store all lines , allow to lock on line
    let GRID = null; // store grid in global , for remove if need.
    let ClipboarData = {}; // add Data json to clipboard for ctrl+v on obj to asign data

 
// TODO: ENLEVER LES JAMBRE ET LES PIED DES PERSONNAGTE. POUR FAIRE DES BOULE SAUTILLANTE.
// SEULEMENT CHEZ LES ANIMAUX SEULEMENT , IL SEMBLERAI AVOIR 2 ESPECE DIFERENTE.
// DES ANIMAUX A BOULE
// DES ANIMAUX A BOULE COMME LE CHAT, SUR LA TETE.

    //#endregion

//#region [rgba(250, 0, 0,0.03)]
// ┌------------------------------------------------------------------------------┐
// SETUP VARIABLE AND AUTO FUNCTION SCOPED (ONCE)
// └------------------------------------------------------------------------------┘
// CAGE_LIBRARY ________________
const CAGE_LIBRARY = new PIXI.Container(); // Store all avaibles libary
    CAGE_LIBRARY.mask = new PIXI.Sprite(PIXI.Texture.WHITE); //Mask for scroll bottom libs
    CAGE_LIBRARY.addChild(CAGE_LIBRARY.mask);
    CAGE_LIBRARY.list = []; // store liste of current obj cages elements
    // setup && hack
    CAGE_LIBRARY.position.set(115,950);
    CAGE_LIBRARY.mask.position.set(-8,-8); // marge outline filters
    CAGE_LIBRARY.mask.width = 1740, CAGE_LIBRARY.mask.height = 220;
    CAGE_LIBRARY.mask.getBounds();
    // reference
    CAGE_LIBRARY.name = "library";
    STAGE.CAGE_EDITOR.addChild(CAGE_LIBRARY);
// CAGE_TILESHEETS ________________
const CAGE_TILESHEETS = new PIXI.Container(); // Store all avaibles libary
    CAGE_TILESHEETS.mask = new PIXI.Sprite(PIXI.Texture.WHITE); //Mask for scroll bottom libs
    //CAGE_TILESHEETS.addChild(CAGE_TILESHEETS.mask);
    // setup && hack
    CAGE_TILESHEETS.position.set(1280,50);
    CAGE_TILESHEETS.mask.position.set(1280, 50);
    CAGE_TILESHEETS.mask.width = 1000, CAGE_TILESHEETS.mask.height = 850;
    CAGE_TILESHEETS.mask.getBounds();
    CAGE_TILESHEETS.opened = false;
    CAGE_TILESHEETS.list = []; // store list of tile
    CAGE_TILESHEETS.visible = false; 
    CAGE_TILESHEETS.interactive = true;
    CAGE_TILESHEETS.hitArea = new PIXI.Rectangle(0,0,1000,1000);
    CAGE_TILESHEETS.buttonType = "CAGE_TILESHEETS";
    CAGE_TILESHEETS.on('pointerdown', pointer_DW);
    CAGE_TILESHEETS.on('pointerup', pointer_UP);
    CAGE_TILESHEETS.on('zoomTileLibs', wheelInLibs);

    // reference
    STAGE.CAGE_EDITOR.addChild(CAGE_TILESHEETS);
// CAGE_MOUSE ________________
const CAGE_MOUSE = STAGE.CAGE_MOUSE // Store all avaibles libary
    CAGE_MOUSE.previews = new PIXI.Container(); // store preview list
    CAGE_MOUSE.previewsShowed = false;
    CAGE_MOUSE.currentSprite = null;
    CAGE_MOUSE.list = false; // store list array of current objs hold by the mouse
    CAGE_MOUSE.addChild(CAGE_MOUSE.previews);
// CAGE_MAP ________________
const CAGE_MAP = STAGE.CAGE_MAP; // Store all avaibles libary


//#endregion

// ┌------------------------------------------------------------------------------┐
// SETUP create thumbail library AUTO
// └------------------------------------------------------------------------------┘
     // createLibraryObj sheets for thumbails libs
     (function(){
        let x = 100;
        for (const key in DATA) { // this._avaibleData === DATA
            if(!DATA[key].BG){ // dont add BG inside library
                const cage = build_ThumbsLibs(key,"thumbs"); // create from Data ""
                cage.buttonType = "thumbs";
                cage.alpha = 0.75;
                cage.interactive = true;
                cage.on('pointerover', pointer_overIN);
                cage.on('pointerout', pointer_overOUT);
                cage.on('pointerup', pointer_UP);
                CAGE_LIBRARY.list.push(cage);
            };
        };
        refreshLibs();
    })();

    // createButtons interaction from spine Editor icons
    (function(){
        const list = this.editorGui.spineData.slots;
        for (let i = 0, l = list.length; i < l; i++) {
            const slot = list[i];
            const boneName = slot.boneData.name;
            if(boneName.contains("icon_")){
                const _slot = this.editorGui.skeleton.findSlot(slot.name);
                ButtonsSlots.push(_slot);
                _slot.name = slot.name;
                _slot.color.a = 0.35;
                _slot._boundsRect = _slot.currentSprite.getBounds();
                _slot.currentSprite.buttonType = "button";
                _slot.currentSprite.interactive = true;
                _slot.currentSprite.on('pointerover', pointer_overIN,_slot);
                _slot.currentSprite.on('pointerout', pointer_overOUT,_slot);
                _slot.currentSprite.on('pointerup', pointer_UP);
            };
        };
    }).bind(this)();

    // convert current objs to editor format
    (function() {
        $Objs.list_master.forEach(cage => {
            cage._events = {}; // remove event
            cage.Data = DATA[cage.name];         

            create_DebugElements.call(cage);
            setup_Parenting.call(cage);
            setup_LayerGroup.call(cage);
            setup_Propretys.call(cage,cage);
            // if animations, in editorMode we play loop
            if(cage.play){
                cage.play();
            };

            
            cage.on('pointerover', pointer_overIN);
            cage.on('pointerout', pointer_overOUT);
            cage.on('pointerup', pointer_UP);
            cage.interactive = true;
            cage.buttonType = "tileMap";
        });
    }).bind(this)();

    //#region [rgba(10, 80, 10,0.08)]
    // ┌------------------------------------------------------------------------------┐
    // METHOD SCOPED FOR EDITOR ONLY (POLYFILL) UTILITY
    // └------------------------------------------------------------------------------┘
    // get ran hexa color
    function hexColors() { 
        return ('0x' + Math.floor(Math.random() * 16777215).toString(16) || 0xffffff);
    };

    // draw a grafics lines sXY[x,eX]
    function drawLine(sXY,eXY,l,c,a){
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(l||2, c||0xffffff, a||1);
        return graphics.moveTo(sXY[0],sXY[1]).lineTo(eXY[0], eXY[1]).endFill();
    };

    // scene mouse update
    function update_Light() {
        STAGE.light_sunScreen.x =  mX, STAGE.light_sunScreen.y = mY;
    };

    // Get a ratio for resize in a bounds
    function getRatio(obj, w, h) {
        let r = Math.min(w / obj.width, h / obj.height);
        return r;
    };

    function hitCheck(a, b){ // colision
        var ab = a._boundsRect;
        var bb = b._boundsRect;
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    };

    function drawGrids(){
        if(GRID){
            STAGE.CAGE_MAP.removeChild(GRID);
            GRID.destroy();
        }
        const eX = 1920; // map width + zoom
        const eY = 1080; // map width + zoom
        const maxLineH = eX/48, maxLineV = eY/48;
        const fWH = 48; // factor squares width heigth
        const color = [0xffffff,0x000000,0xff0000,0x0000ff][~~(Math.random()*4)];
        const rt = PIXI.RenderTexture.create(eX, eY); // create frame for hold rendered grafics
        const rc_grid = new PIXI.Container();
        function draw(sX,sY,eX,eY){
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(2, color, 0.5);
            return graphics.moveTo(sX,sY).lineTo(eX, eY).endFill();
        }
        for (let l=0, y=0; l < maxLineV; l++, y=l*fWH) {
            rc_grid.addChild(draw(0,y,eX,y));
        };
        for (let l=0, x=0; l < maxLineH; l++, x=l*fWH) {
            rc_grid.addChild(draw(x,0,x,eY));
        };
        // finish to add all grid line in rc_grid. generate a texture of the rc_grid
        Renderer.render(rc_grid, rt);
        const sprite = PIXI.Sprite.from(rt);
        sprite.alpha = 0.5;
        STAGE.CAGE_MAP.addChild(sprite);
        GRID = sprite;
    };

    function addDebugLineToMouse() { // LineList LineDraw
        if(LineDraw){ // if exist just 
           const rad =  22.5 * (Math.PI/180);
           LineDraw.change+=1;
           LineDraw.pinable = !(LineDraw.change%4); // allow pinable fo horizontal vertical
           if(LineDraw.pinable){
                LineDraw.horizon = !LineDraw.horizon;
           };
           return LineDraw.rotation+=rad;
        }
        const renderer = Graphics._renderer
        const texture = renderer.generateTexture( drawLine([0,0],[1920*2,0],8,"0xff0000") );
        LineDraw = new PIXI.Sprite(texture);
        LineDraw.position.set(mX,mY);
        LineDraw.anchor.set(0.5,0.5);
        LineDraw.change = 0;
        LineDraw.pinable = true;
        LineDraw.horizon = true; // is lock on x or y
        STAGE.addChild(LineDraw);
        LineDraw.interactive = true;
        LineDraw.name = "DEBUGLINE";
        LineDraw.on('pointerup', pointer_UP);
       
    };
    //#endregion

    //#region [rgba(0, 140, 0,0.08)]
    // ┌------------------------------------------------------------------------------┐
    // METHOD ACCEST SCOPED FOR EDITOR
    // └------------------------------------------------------------------------------┘
    // REFRESH DE BASE LIBS
    function refreshLibs(){
        // refresh libs bound , positions and filters
        CAGE_LIBRARY.list.forEach(cage => {
                CAGE_LIBRARY.removeChild(cage);
        });
        // filters TODO:
        // sorts TODO:
        const maxX = CAGE_LIBRARY.mask.width;
        const maskH = CAGE_LIBRARY.mask.height;
        for (let i=x=y=line= 0, disX = 25, l = CAGE_LIBRARY.list.length; i < l; i++) {
            const cage = CAGE_LIBRARY.list[i];
            if(cage.renderable){
                if(cage.x+cage.width>maxX){ x=0, y+=maskH};
                cage.x = +x;
                cage.y = +y;
                x+=cage.width+disX;
                CAGE_LIBRARY.addChild(cage);
                cage.getBounds();
            };
        };
    };

    // build a sheets objList with pathFinding => [vertical to horizontal]
    function pathFindSheet(list, pad) {
        CAGE_TILESHEETS.scale.set(1,1); // reset zoom if first time 
        const yMax = CAGE_TILESHEETS.mask.height;
        const tmp_list = []; // new list
        let cache = {};
        let antiFreeze = 500000;

        for (let I = 0, L = list.length; I < L; I++) {
            const cage = list[I];
            let x = +pad, y = +pad;
            let w = cage.width, h = cage.height;
            cage.position.set(x,y);
            cage.getBounds();
            // scan, no collid with alrealy added cage
            for (let i = 0, l = tmp_list.length, contact = false; i < l; i++) {
                const temp = tmp_list[i];
                if(hitCheck(cage,temp)){
                    i = -1;
                    y+=(h+pad);
                    // si collision, jump pixel line X++
                    if(y+h>yMax){ x+=pad, y = +pad }
                    else{ y+=pad };
                    cage.position.set(x,y);
                    cage.getBounds();
                };
                if(!antiFreeze--){ console.error("error:antiFreeze"); break };
            };
            // no break hitCheck, we can add
            tmp_list.push(cage);
            cache[cage.TexName] = new PIXI.Point(x,y); //REGISTER
            cage._boundsRect.pad(pad+2,pad+1);
            //cage.DebugElements.bg._boundsRect.pad(pad,pad);
        };
        return cache;
    };



//#endregion

    //#region [rgba(219, 182, 2, 0.05)]
    // ┌------------------------------------------------------------------------------┐
    // IZITOAST DATA EDITOR 
    // └------------------------------------------------------------------------------┘
    // create data id for HTML JSON, if existe , return Data_Values
    function computeDataForJson(OBJ){
        const data = {};
        // general
        if( ["animationSheet", "tileSheet", "spineSheet"].contains(OBJ.Type) ){
            data.position = [OBJ.position.x, OBJ.position.y];
            data.scale = [OBJ.scale.x, OBJ.scale.y];
            data.skew = [OBJ.skew.x, OBJ.skew.y];
            data.pivot = [OBJ.pivot.x, OBJ.pivot.y];
            OBJ.Sprites.d.anchor? data.anchor = [OBJ.Sprites.d.anchor.x, OBJ.Sprites.d.anchor.y] : void 0; //sub (disable on spineSheet)

            data.groupID = OBJ.groupID;
            data.rotation = OBJ.rotation;
            data.alpha = OBJ.alpha;
            data.zIndex = OBJ.zIndex;
            data.parentGroup = OBJ.parentGroup.zIndex;
            data.autoGroups = OBJ.autoGroups;

            data.blendMode = [OBJ.Sprites.d.blendMode, OBJ.Sprites.n.blendMode]; // sub
            data.tint = [OBJ.Sprites.d.tint, OBJ.Sprites.n.tint]; // sub
            
            if(OBJ.Sprites.d.color || OBJ.Sprites.n.color){
                data.color = {}; // sub
                OBJ.Sprites.d.color ? data.color.d = [
                    PIXI.utils.hex2rgb(OBJ.Sprites.d.color.darkRgba).reverse(), 
                    PIXI.utils.hex2rgb(OBJ.Sprites.d.color.lightRgba).reverse()
                ] : void 0;
                OBJ.Sprites.n.color ? data.color.n =  [
                    PIXI.utils.hex2rgb(OBJ.Sprites.n.color.darkRgba).reverse(), 
                    PIXI.utils.hex2rgb(OBJ.Sprites.n.color.lightRgba).reverse()
                ] : void 0;
            };
        }
        if(OBJ.Type === "animationSheet"){
            data.animationSpeed = OBJ.animationSpeed;
            data.loop = OBJ.loop;
        }
        if(OBJ.Type === "spineSheet"){//TODO:

        }
        return data;
    };

    function getDataJson(OBJ){
        console.log('getDataJsonOBJ: ', OBJ);
        // data for the scene setup
        let data = {};
        if(OBJ.Type === "AmbientLight"){
            data =  { ...data,
                brightness:{def:1, value:OBJ.brightness },
                drawMode:{def:4, value:OBJ.drawMode},
                color:{def:"0xffffff", value:OBJ.color},
            };
        };
        if(OBJ.isStage){
            data =  { ...data,
                Background:{def:false, value:OBJ.Background ? OBJ.Background.name:false, hideHtml:true},
            };
        };
        if( ["animationSheet", "tileSheet", "spineSheet"].contains(OBJ.Type) ){
            data.groupID = {def:"default", value:OBJ.groupID || "default" };
            data.position = {def:[~~OBJ.position.x, ~~OBJ.position.y], value:[OBJ.position.x, OBJ.position.y]};
            data.scale = {def:[1,1], value:[OBJ.scale.x, OBJ.scale.y]};
            data.skew = {def:[0,0], value:[OBJ.skew.x, OBJ.skew.y]};
            data.pivot = {def:[0,0], value:[OBJ.pivot.x, OBJ.pivot.y]};
            OBJ.Sprites.d.anchor? data.anchor = { def:[0.5,1], value:[OBJ.Sprites.d.anchor.x, OBJ.Sprites.d.anchor.y] } : void 0;  // sub // not in spineSheet

            data.rotation = {def:0, value:OBJ.rotation};
            data.alpha = {def:1, value:OBJ.alpha};
            
            data.blendMode = {  // sub
                d:{def:0, value:OBJ.Sprites.d.blendMode}, 
                n:{def:0, value:OBJ.Sprites.n.blendMode}
            };
            data.tint = {  // sub
                d:{def:"0xffffff", value:PIXI.utils.hex2string(OBJ.Sprites.d.tint).replace("#","0x")}, 
                n:{def:"0xffffff", value:PIXI.utils.hex2string(OBJ.Sprites.n.tint).replace("#","0x")}
            };

            data.autoGroups = {def:[false,false,false,false,false,false,false], value:[false,false,false,false,false,false,false]};
            data.zIndex = {def:-1, value:OBJ.zIndex, hideHtml:true}; // hide
            
        };

        if(OBJ.Type === "animationSheet"){
            data.animationSpeed = {def:1, value:OBJ.animationSpeed};
            data.loop = {def:1, value:OBJ.loop};
        };
        //HEAVEN TODO: utiliser .color ? , enlever les boutons def .. posibility changer plugin name ?
        if( ["animationSheet", "tileSheet"].contains(OBJ.Type) ){
            data.setDark = {
                d:{def:[0,0,0], value:OBJ.Sprites.d.color? PIXI.utils.hex2rgb(OBJ.Sprites.d.color.darkRgba).reverse() : [0,0,0] }, 
                n:{def:[0,0,0], value:OBJ.Sprites.n.color? PIXI.utils.hex2rgb(OBJ.Sprites.n.color.darkRgba).reverse() : [0,0,0] }
            };
            data.setLight = {
                d:{def:[1,1,1], value:OBJ.Sprites.d.color? PIXI.utils.hex2rgb(OBJ.Sprites.d.color.lightRgba).reverse() : [1,1,1] }, 
                n:{def:[1,1,1], value:OBJ.Sprites.n.color? PIXI.utils.hex2rgb(OBJ.Sprites.n.color.lightRgba).reverse() : [1,1,1] }
            };
        };

        return data;
    };
    function pasteCopyDataIn(OBJ){
        setObjWithData.call(OBJ,ClipboarData, null)
        iziToast.info( $PME.izit_pasteCopyDataIn(OBJ,ClipboarData) );
    };

    function copyData(OBJ, Data_Values) {
        ClipboarData = {};
        const copyCheckBox = document.querySelectorAll("#copyCheck");
        copyCheckBox.forEach(e => {
            if(e.checked){
                const propName = e.attributes.id2.value;
                ClipboarData[propName] = Object.assign({},Data_Values[propName]);
            }
        });
        console.log9('ClipboarData:Copy ', ClipboarData);
        iziToast.info( $PME.izit_copyData(ClipboarData) );
    };

    // create data checkbox with Data_Values
    function getDataCheckBoxWith(OBJ, Data_Values){
        if(OBJ.Data_CheckBox){return OBJ.Data_CheckBox};
        const Data_CheckBox = {};
        Object.keys(Data_Values).forEach(key => { Data_CheckBox[key] = true });
        Data_CheckBox.heaven_d = false;
        Data_CheckBox.heaven_n = false;
        // add special case
        //Object.defineProperty(Data_CheckBox, 'position_lock', { value: false, writable: true });
        return Data_CheckBox;
    };

    // create multi sliders light
    function create_sliderFalloff(){
        const kc = new Slider("#kc", {  step: 0.01,value:0, min: 0.01, max: 1, tooltip: false });
        kc.tooltip.style.opacity = 0.5;

        const kl = new Slider("#kl", {step: 0.1,value:0, min: 0.1, max: 20, tooltip: 'always'});
        kl.tooltip.style.opacity = 0.5;

        const kq = new Slider("#kq", {step: 0.01,value:0, min: 0.1, max: 50, tooltip: 'always'});
        kq.tooltip.style.opacity = 0.5;
        return {kc:kc,kl:kl,kq:kq};
    };

    // create multi sliders light
    function create_sliderHaven(OBJ, Data_Values, Data_CheckBox){
        const setDark_d = !!Data_CheckBox.heaven_d? Data_Values.setDark.d.value : Data_Values.setDark.d.def;
        const setLight_d = !!Data_CheckBox.heaven_d? Data_Values.setLight.d.value : Data_Values.setLight.d.def;
        const setDark_n = !!Data_CheckBox.heaven_n? Data_Values.setDark.n.value : Data_Values.setDark.n.def;
        const setLight_n = !!Data_CheckBox.heaven_n? Data_Values.setLight.n.value : Data_Values.setLight.n.def;
        // diffuse dark
        function upd() { return setObjWithData.call(OBJ, Data_Values, Data_CheckBox) };
        const ddr = new Slider("#ddr", { tooltip: 'always'}); // step: 0.1, value:0, min: 0, max: 1, 
        const ddg = new Slider("#ddg", {tooltip: 'always'});
        const ddb = new Slider("#ddb", { tooltip: 'always'});
        ddr.tooltip.style.opacity = 0.5, ddg.tooltip.style.opacity = 0.5, ddb.tooltip.style.opacity = 0.5;
        ddr.on("slide", function(value) { Data_Values.setDark.d.value[0] = value; upd() }).setValue(setDark_d[0]);
        ddg.on("slide", function(value) { Data_Values.setDark.d.value[1] = value; upd() }).setValue(setDark_d[1]);
        ddb.on("slide", function(value) { Data_Values.setDark.d.value[2] = value; upd() }).setValue(setDark_d[2]);

        // diffuse light
        const dlr = new Slider("#dlr", {tooltip: 'always'});
        const dlg = new Slider("#dlg", {tooltip: 'always'});
        const dlb = new Slider("#dlb", {tooltip: 'always'});
        dlr.tooltip.style.opacity = 0.5, dlg.tooltip.style.opacity = 0.5, dlb.tooltip.style.opacity = 0.5;
        dlr.on("slide", function(value) { Data_Values.setLight.d.value[0] = value; upd() }).setValue(setLight_d[0]);
        dlg.on("slide", function(value) { Data_Values.setLight.d.value[1] = value; upd() }).setValue(setLight_d[1]);
        dlb.on("slide", function(value) { Data_Values.setLight.d.value[2] = value; upd() }).setValue(setLight_d[2]);

        // normal dark
        const ndr = new Slider("#ndr", { tooltip: 'always'}); // step: 0.1, value:0, min: 0, max: 1, 
        const ndg = new Slider("#ndg", {tooltip: 'always'});
        const ndb = new Slider("#ndb", { tooltip: 'always'});
        ndr.tooltip.style.opacity = 0.5, ndg.tooltip.style.opacity = 0.5, ndb.tooltip.style.opacity = 0.5;
        ndr.on("slide", function(value) { Data_Values.setDark.n.value[0] = value; upd() }).setValue(setDark_n[0]);
        ndg.on("slide", function(value) { Data_Values.setDark.n.value[1] = value; upd() }).setValue(setDark_n[1]);
        ndb.on("slide", function(value) { Data_Values.setDark.n.value[2] = value; upd() }).setValue(setDark_n[2]);
        // normal light
        const nlr = new Slider("#nlr", {tooltip: 'always'});
        const nlg = new Slider("#nlg", {tooltip: 'always'});
        const nlb = new Slider("#nlb", {tooltip: 'always'});
        nlr.tooltip.style.opacity = 0.5, nlg.tooltip.style.opacity = 0.5, nlb.tooltip.style.opacity = 0.5;
        nlr.on("slide", function(value) { Data_Values.setLight.n.value[0] = value; upd() }).setValue(setLight_n[0]);
        nlg.on("slide", function(value) { Data_Values.setLight.n.value[1] = value; upd() }).setValue(setLight_n[0]);
        nlb.on("slide", function(value) { Data_Values.setLight.n.value[2] = value; upd() }).setValue(setLight_n[0]);
    };

    function iniSetupIzit(){
        close_editor(true);
        setStatusInteractiveObj(false);
        iziToast.opened = true;
    }

    // setup for tile in map
    function open_tileSetupEditor(InMapObj) {
        clearFiltersFX3(InMapObj); // clear filters
        iniSetupIzit();
        iziToast.info( $PME.tileSetupEditor(InMapObj) );
        // show tint colors pickers
        const docuColorsID = document.querySelectorAll("#tint");
        const _jscolor_d = new jscolor(docuColorsID[0]); // for case:id="_color" slider:id="color"
        _jscolor_d.zIndex = 9999999;
        const _jscolor_n = new jscolor(docuColorsID[1]); // for case:id="_color" slider:id="color"
        _jscolor_n.zIndex = 9999999;
        //const _Falloff = create_sliderFalloff(); // create slider html for pixiHaven
        // focuse on objet
        // imit 
        const camPosFromObj = InMapObj.getGlobalPosition();
        ScrollX = camPosFromObj.x-(1920*0.7)+ScrollX;
        ScrollY = camPosFromObj.y-(1080*0.4)+ScrollY;
        start_iziToastDataEditor(InMapObj, [_jscolor_d, _jscolor_n], null);
    };

    // setup the global scene light :light_Ambient and directionLight
    function open_sceneSetup() {
        iniSetupIzit();
        iziToast.info( $PME.izit_sceneSetup() );
        start_iziToastDataEditor(STAGE, null, null);
    };

    // setup the global scene light :light_Ambient and directionLight
    function open_sceneGlobalLight() {
        iniSetupIzit();
        iziToast.info( $PME.izit_sceneGlobalLight() );
        const _jscolor = new jscolor(document.getElementById("color")); // for case:id="_color" slider:id="color"
        _jscolor.zIndex = 9999999;
        start_iziToastDataEditor(STAGE.light_Ambient, _jscolor, null);
    };

    // setup the global scene light :light_Ambient and directionLight
    function open_SaveSetup() {
        iniSetupIzit();
        iziToast.info( $PME.izit_saveSetup() );
        start_iziToastDataEditor(null, null, null);
    };

    function convertHeaven(OBJ, Data_Values, Data_CheckBox) {
        // toggle heaven mode
        OBJ.Sprites.d.convertToHeaven();
        OBJ.Sprites.n.convertToHeaven();
        if(Data_CheckBox.check_haven){
            iziToast.info( $PME.izit_convertHeaven() );
            document.getElementById("heaven_d").checked = !!Data_CheckBox.heaven_d;
            document.getElementById("heaven_n").checked = !!Data_CheckBox.heaven_n;
            create_sliderHaven(OBJ, Data_Values, Data_CheckBox); // create slider html for pixiHaven
            const dataIntepretor = document.getElementById("dataIntepretor_Heaven");
            dataIntepretor.oninput = function(e){
                Data_CheckBox[e.target.id] = !!e.target.checked;
                setObjWithData.call(OBJ, Data_Values, Data_CheckBox);
            };
            setObjWithData.call(OBJ, Data_Values, Data_CheckBox);
        }else{
            if(document.getElementById("Heaven")){
                iziToast.hide( {transitionOut: 'flipOutX'}, document.getElementById("Heaven") );
                setObjWithData.call(OBJ, Data_Values, Data_CheckBox);
            };
        };
        
    };

    // for tiles on map
    function start_iziToastDataEditor(OBJ, _jscolor, _Falloff){
        const dataIntepretor = document.getElementById("dataIntepretor");
        let Data_Values = OBJ ? getDataJson(OBJ) : void 0;
        let Data_CheckBox = OBJ ? getDataCheckBoxWith(OBJ, Data_Values) : void 0; //checkBox boolean value
        OBJ ? setHTMLWithData.call(OBJ, Data_Values, Data_CheckBox, _jscolor, _Falloff) : void 0;
        
        // ========= DATA LISTENER  ===========
        // when checkBox changes
        dataIntepretor.oninput = function(event){ 
            const e = event.target;
            const type = e.type;
            if(OBJ){
                if(e.id.contains("lock")){ // it a lock case check
                    return Data_CheckBox[e.id] = !!e.checked;
                };
                if(e.id.contains("check_haven")){ // case for heaven, preven fast lick
                    if(e.checked && document.getElementById("dataIntepretor_Heaven")){
                        console.error("wait 1sec window close");
                        return e.checked = false;
                    }else{
                        Data_CheckBox[e.id] = !!e.checked;
                        return convertHeaven(OBJ, Data_Values, Data_CheckBox);
                    };
                };
                if(type === "text"){ 
                    Data_Values[e.id].value = String(e.value);
                };  
                if(type === "checkbox"){ 
                    Data_CheckBox[e.id.substring(1)] = !!e.checked; // substring: remove "_"id from html data
                }; 
                if(type === "select-one"){ 
                    Data_Values[e.id].value = e.value==="false"? false : e.value==="true"? true : e.value;
                };
                if(type === "number"){
                    if(Data_Values[e.id].d || Data_Values[e.id].value.length === 2){
                        // les input a 2 array ou [d,n] peuvents etres locker, verifier
                        const ee = document.querySelectorAll('#'+e.id); // value
                        const vDN = !!Data_Values[e.id].d; // is a Data_Values [d,n].value ?
                        const isLock = Data_CheckBox[`${e.id}_lock`];
                        if(isLock){
                            const syncEE = ee[0]===e ? ee[1] : ee[0];
                            // check if we asign number with keyboard to input or if we increase step with mouse
                            if(event.inputType === "insertText"){
                                syncEE.value = e.value;
                            }else{
                                const oldValue = vDN? Data_Values[e.id][e.attributes.arrId.value].value : Data_Values[e.id].value[e.attributes.arrId.value];
                                const stepDirection = (e.value - oldValue > 0 );
                                stepDirection ? syncEE.stepUp() : syncEE.stepDown();
                            }
                        };
                        if(vDN){ // array type diffuse, normal or value
                            Data_Values[e.id].d.value = +ee[0].value;
                            Data_Values[e.id].n.value = +ee[1].value;
                        }else{ Data_Values[e.id].value = [+ee[0].value , +ee[1].value] };
                        
                    }else{
                        Data_Values[e.id].value = +e.value 
                    };
                };
                setObjWithData.call(OBJ, Data_Values, Data_CheckBox);
                e.id==="animationSpeed" && !OBJ.loop && OBJ.play(0);
                e.id==="loop" &&  OBJ.play(0);
            };
        };

        // ========= control global scene light ===========
        // JSCOLOR, when change color from color Box
        _jscolor && _jscolor[0]? _jscolor[0].onFineChange = function(){
            Data_Values.color && (Data_Values.color.value = "0x"+_jscolor[0].targetElement.value); // light
            Data_Values.tint && (Data_Values.tint.d.value = "0x"+_jscolor[0].targetElement.value); // sprite
            setObjWithData.call(OBJ, Data_Values, Data_CheckBox);
        }:void 0;
        _jscolor && _jscolor[1]? _jscolor[1].onFineChange = function(){
            Data_Values.color && (Data_Values.color.value = "0x"+_jscolor[1].targetElement.value); // light
            Data_Values.tint && (Data_Values.tint.n.value = "0x"+_jscolor[1].targetElement.value); // sprite
            setObjWithData.call(OBJ, Data_Values, Data_CheckBox);
        }:void 0;

        // Bootstrape sliders, when change value
        _Falloff ? (function(){
            _Falloff.kc.on("slide", function(value) { Data_Values.falloff.value[0] = value });
            _Falloff.kl.on("slide", function(value) { Data_Values.falloff.value[1] = value });
            _Falloff.kq.on("slide", function(value) { Data_Values.falloff.value[2] = value });
        })():void 0;

        // BUTTONS
        dataIntepretor.onclick =function(event){ //check if html checkbox change?
            const e = event.target; // buttons
            if(e.type === "button"){
                if(e.id==="save"){ close_mapSetupEditor(); start_DataSavesFromKey_CTRL_S(true) };// call save json with scan options true:
                if(e.id==="apply"){ close_mapSetupEditor(OBJ, Data_Values, Data_CheckBox); };// apply and close
                if(e.id==="copy"){ copyData(OBJ, Data_Values) };// apply to all and close
                if(e.id==="cancel"){close_mapSetupEditor()};// cancel and close
                if(e.id==="reset"){ // reset session cache and data
                    $PME.storage.removeItem(name);
                    session = getSession(objLight); // session (final data)
                    // refresh
                    refreshHtmlWith_session(session);// asign session value to html input
                    refreshSpriteWith_session(objLight,session);// asign session value to sprite obj
                };
            };
        };
    };

    // asign props value to objet, if checked, type: of objs updated ? light, tiles, from .CALL(obj)
    function setObjWithData(Data_Values, Data_CheckBox) {
        for (const key in Data_Values) {
            const checked = Data_CheckBox? !!Data_CheckBox[key] : true; // eval only if Data_CheckBox passed or alway true
            const vDN = !!Data_Values[key].d;
            let value;
            // check if use def or current value with diffuse or normal
            if(checked){ 
                value = vDN ? [Data_Values[key].d.value, Data_Values[key].n.value] : Data_Values[key].value 
            }else{ 
                value = vDN ? [Data_Values[key].d.def, Data_Values[key].n.def] : Data_Values[key].def 
            };
            switch (key) {
                //case "Background":break; TODO:
                case "Background":
                    STAGE.createBackground(value?DATA[value]:false);
                break;
                case "position":case "scale":case "skew":case "pivot":case "anchor":
                    if(this[key]){ 
                        this[key].set(...value);
                    }else{
                        this.Sprites.d[key].set(...value);
                        this.Sprites.n[key].set(...value);
                        this.Debug.bg[key].set(...value);
                    }
                break;
                case "tint":case "blendMode":
                    this.Sprites.d[key] = +value[0];
                    this.Sprites.n[key] = +value[1];
                break;
                case "setDark":case "setLight":
                    // get heaven value d,n
                    if(this.Sprites.d.color){
                        const check_haven = !!Data_CheckBox.check_haven; // global event buttons
                        const hv_d = (Data_CheckBox.heaven_d&&check_haven)? Data_Values[key].d.value : Data_Values[key].d.def;
                        const hv_n = (Data_CheckBox.heaven_n&&check_haven)? Data_Values[key].n.value : Data_Values[key].n.def;
                        this.Sprites.d.color[key](...hv_d), this.Sprites.n.color[key](...hv_n);
                    };
                break;
                default:
                    this[key] = value;
                break;
            };
        };
        // for the debug pivot zone
        if(this.Debug && this.Debug.piv){
            this.Debug.piv.height = Math.abs(this.pivot.y);
            this.Debug.piv.y = this.pivot.y<0? this.pivot.y : 0;
            this.Debug.piv.tint = this.pivot.y>0? 0xff0000 : 0x08ff00;
        };
    };

    // asign props value to HTML izit
    function setHTMLWithData(Data_Values, Data_CheckBox, _jscolor, _Falloff) {
        if(Data_CheckBox.check_haven){
            document.getElementById("check_haven").checked = true; // checkBox
            convertHeaven(this, Data_Values, Data_CheckBox);
        }
        for (const key in Data_Values) {
            if(Data_Values[key].hideHtml){continue}; // hiden props from html, z-index ..hideHtml 
            // look if it a array for (diff,norm): ['d','n'] or (def,current): [0,1]
            switch (key) {
                case "setDark":case "setLight":
                    if(Data_CheckBox.check_haven){
                        
                    }
                break;
                case "tint":case "blendMode":
                    var value_d = Data_Values[key].d.value; // curent value
                    var value_n = Data_Values[key].n.value; // curent value
                    var def_d = Data_Values[key].d.def; // default value
                    var def_n = Data_Values[key].n.def; // default value
                    document.getElementById(`_${key}`).checked = Data_CheckBox[key]; // checkBox
                    document.getElementById(`${key}_def`).innerHTML = [def_d,def_n]; // default value html
                    var e = document.querySelectorAll('#'+key); // input or 2xinput
                    e[0].value = (key==="blendMode")? value_d : value_d.substring(2).toLocaleUpperCase(); // remove #
                    e[1].value = (key==="blendMode")? value_n : value_n.substring(2).toLocaleUpperCase();
                    if(key==="tint"){
                        _jscolor[0].targetElement.style.backgroundColor = value_d.replace("0x","#");
                        _jscolor[1].targetElement.style.backgroundColor = value_n.replace("0x","#");
                    };
                break;
                case "autoGroups":
                    document.getElementById(`_${key}`).checked = Data_CheckBox[key]; // checkBox
                    for (let i=0, l=value.length; i<l; i++) {
                        let value = Data_Values[key].value[i]; // curent value
                        document.getElementById("autoGroups"+i).checked = value;
                    };
                break;
                case "falloff":
                    var value = Data_Values[key].value; // curent value
                    _Falloff.kc.setValue(value[0]);
                    _Falloff.kl.setValue(value[1]);
                    _Falloff.kq.setValue(value[2]);
                break;
                default:
                    var value = Data_Values[key].value; // curent value
                    var def = Data_Values[key].def; // default value
                    // asign default value to div
                    document.getElementById(`${key}_def`).innerHTML = def; // default value html
                    document.getElementById(`_${key}`).checked = Data_CheckBox[key]; // checkBox
                    var e = document.querySelectorAll('#'+key); // input or 2xinput
                    e[0].value = value.length===2? value[0] : value ;
                    e[1]? e[1].value = value[1]: void 0;
                break;
            };
        };
    };

    // close the dataEditor
    function close_mapSetupEditor(OBJ, Data_Values, Data_CheckBox){
        OBJ? OBJ.Data_Values = Data_Values : void 0;
        OBJ? OBJ.Data_CheckBox = Data_CheckBox : void 0;
        iziToast.hide({transitionOut: 'flipOutX'}, document.getElementById("dataEditor") );
        document.getElementById("Heaven") && iziToast.hide( {transitionOut: 'flipOutX'}, document.getElementById("Heaven") );
        iziToast.opened = false;
        setStatusInteractiveObj(true);
        open_editor(true);
    };

//#endregion

    //#region [rgba(40, 5, 50,0.2)]
    // ┌------------------------------------------------------------------------------┐
    // METHOD CREATE CAGE OBJECT SPRITES 
    // └------------------------------------------------------------------------------┘
    // build previews sprites
    function create_Previews(textures){
        const list = [];
        let totalWidth = 0;
        for (let i = 0, l = textures.length; i < l; i++) { // build the preview sheets
            const sprite = new PIXI.Sprite(textures[i]);
            sprite.scale.set( getRatio(sprite, 350, 350) );
            sprite.anchor.y = 1;
            sprite.x = totalWidth;
            totalWidth+=sprite.width;
            list.push(sprite);
        };
        return list;
    };

    function create_IconsFilters(type,data){
        const cage = new PIXI.Container();
        const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        const filtersID = []; // when we filtering by ID
        let y = 0;
        function addIconFrom(filePNG,id){
            const texture = new PIXI.Texture.fromImage(`editor/images/${filePNG}`);
            const sprite = new PIXI.Sprite(texture);
            sprite.y = +y;
            y+=30;
            cage.addChild(sprite);
            filtersID.push(id);
        };
        if(data.type === "tileSheet"){ addIconFrom('filter_texturePacker.png'),0 };
        if(data.type === "animationSheet"){ addIconFrom('filter_animation.png'),1 };
        if(data.type === "spineSheet"){ addIconFrom('filter_spine.png'),2 };
        if(data.normal){ addIconFrom('filter_normal.png'),3 };
        if(data.name.contains("-0")){ addIconFrom('info_multiPack.png'),4 };
        cage.addChildAt(bg,0);
        cage.filtersID = filtersID;
        cage.bg = bg;
        bg.tint = 0x000000;
        bg.alpha = 0.5;
        bg.width = 30;
        bg.height = y;
        return cage;
    };


    function setup_Propretys(fromCage){
        if(this.Type === "tileSheet" || this.Type === "animationSheet"){
            let anX = (fromCage.Debug.an.position.x/fromCage.Debug.bg.width) || fromCage.Sprites.d.anchor.x; // value pos/w
            let anY = (fromCage.Debug.an.position.y/fromCage.Debug.bg.height) || fromCage.Sprites.d.anchor.y; // value pos/h
            this.Sprites.d.anchor.set(anX, anY);
            this.Sprites.n.anchor.set(anX, anY);
            this.Debug.bg.anchor.set(anX, anY);
        };
    };

    function setup_LayerGroup(){
        if(this.Type === "tileSheet" || this.Type === "animationSheet"){
            this.Sprites.d.parentGroup = PIXI.lights.diffuseGroup;
            this.Sprites.n.parentGroup = PIXI.lights.normalGroup;
            this.Debug.bg.parentGroup = PIXI.lights.diffuseGroup;

            this.parentGroup = $displayGroup.group[1]; //TODO: CURRENT
            this.zIndex = this.zIndex || mMY; //TODO:
        };
        if(this.Type === "spineSheet"){
            this.Sprites.d.parentGroup = PIXI.lights.diffuseGroup;
            this.Sprites.n.parentGroup = PIXI.lights.normalGroup;
            this.Debug.bg.parentGroup = PIXI.lights.diffuseGroup;
            this.parentGroup = $displayGroup.group[1]; //TODO: CURRENT
            this.zIndex = this.zIndex || mMY; //TODO:
        };
    };

    function setup_Parenting(){
        if(this.Type === "thumbs"){
            this.addChild(this.Debug.bg, this.Sprites.d, this.Debug.ico);
            this.getBounds();
            this.Debug.bg.getBounds();
        };
        if(this.Type === "tileSheet" || this.Type === "animationSheet"){
            this.addChild(this.Debug.bg, this.Sprites.d, this.Sprites.n, this.Debug.an, this.Debug.piv);
            this.getBounds();
            this.Debug.bg.getBounds();
        };
        if(this.Type === "spineSheet"){
            this.addChild(this.Debug.bg, this.Sprites.d, this.Sprites.n, this.Debug.an);
            this.getBounds();
            this.Debug.bg.getBounds();
        };
    };

    function create_DebugElements(){
        this.Debug = {bg:null, previews:null, an:null, piv:null, ico:null};
        if(this.Type === "thumbs"){
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const previews = create_Previews(this.Data.baseTextures); // sprites preview reference;
            const icons = create_IconsFilters(this.Type, this.Data); // icons
            // setup
            icons.x = this.Sprites.d.width;
            bg.width = this.Sprites.d.width + icons.width;
            bg.height =  Math.max(this.Sprites.d.height, icons.height);
            bg.getBounds();
            this.Debug.bg = bg;
            this.Debug.previews = previews;
            this.Debug.ico = icons;
        };
        if(this.Type === "tileSheet" || this.Type === "animationSheet"){
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const an = new PIXI.Sprite(PIXI.Texture.WHITE); // anchorPoint
            const piv = new PIXI.Sprite(PIXI.Texture.WHITE);
            // setup
            let d = this.Sprites.d;
            bg.width = d.width;
            bg.height = d.height;
            bg.tint = 0xffffff;
            bg.anchor.set(d.anchor.x, d.anchor.y);

            an.width = 24;
            an.height = 24;
            an.tint = 0xee5000;
            an.alpha = 0.7;
            an.anchor.set(0.5,0.5);

            piv.width = d.width;
            piv.height = 4;
            piv.tint = 0xee5000;
            piv.blendMode = 1;
            piv.alpha = 0.5;
            piv.anchor.x = 0.5;

            this.Debug.bg = bg;
            this.Debug.an = an;
            this.Debug.piv = piv;
        };
        if(this.Type === "spineSheet"){
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const an = new PIXI.Sprite(PIXI.Texture.WHITE); // anchorPoint
            // setup
            let d = this.Sprites.d;
            let vertices = d.skeleton.findSlot("bounds").attachment.vertices;
            bg._bounds.addQuad(vertices);
            bg._bounds.rect = bg._bounds.getRectangle();
            
            bg.width = bg._bounds.rect.width;
            bg.height = bg._bounds.rect.height;
            bg.tint = 0xffffff;
            bg.anchor.set(0.5,1);

            an.width = 24;
            an.height = 24;
            an.tint = 0xee5000;
            an.alpha = 0.7;
            an.anchor.set(0.5,0.5);

            this.Debug.bg = bg;
            this.Debug.an = an;
        };
    };

    // create sprites elements
    function create_Sprites(){
        this.Sprites = {d:null,n:null};
        if(this.Type === "thumbs"){
            const sprite = new PIXI.Sprite(this.Data.baseTextures[0]); // take first tex for thumbs, preview will take all array
                sprite.scale.set( getRatio(sprite, 134, 100) ); //ratio for fitt in (obj, w, h)
            this.Sprites.d = sprite;
        };
        if(this.Type === "tileSheet"){
            const sprite_d = new PIXI.Sprite(this.Data.textures[this.TexName]); // take first tex for thumbs, preview will take all array
            const sprite_n = new PIXI.Sprite(this.Data.textures_n[this.TexName+"_n"]); // allow swap texture hover tile
            this.Sprites.d = sprite_d;
            this.Sprites.n = sprite_n;
        };
        if(this.Type === "animationSheet"){
            const sprite_d = new PIXI.extras.AnimatedSprite(this.Data.textures[this.TexName]);
            const sprite_n = this.addNormal(sprite_d, this.Data.textures_n[this.TexName]);
            this.Sprites.d = sprite_d;
            this.Sprites.n = sprite_n;
            this.play(0);
        };
        if(this.Type === "spineSheet"){
            const spine = new PIXI.spine.Spine(this.Data.spineData);
            spine.skeleton.setSkinByName(this.TexName)//();
            spine.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
            spine.skeleton.setSlotsToSetupPose();
            const spineBg_n = new PIXI.Sprite(PIXI.Texture.WHITE); // allow swap texture hover tile
            spineBg_n.width = spine.width, spineBg_n.height = spine.height;
            spineBg_n.anchor.set(0.5,1);
            this.Sprites.d = spine;
            this.Sprites.n = spineBg_n// TODO: experimenter un sprite calque fix , ou grafics gardient.
        };
    };

    // create container based on type
    function create_Containers(data,type,textureName){
        let cage;
        switch (type) {
            case "animationSheet":
                cage = new PIXI.ContainerAnimations();
            break;
            default:
                cage = new PIXI.Container();
        };
        // props
        cage.Data = data;
        cage.Type = type;
        cage.name = data.name;
        cage.TexName = textureName || false;
        return cage;
    };

    function build_ThumbsLibs(sheetName){
        const cage = create_Containers(DATA[sheetName], "thumbs"); // force type thumbs
        create_Sprites.call(cage);
        create_DebugElements.call(cage);
        setup_Parenting.call(cage);
        return cage;
    };

    // create tiles from type with texture name
    function build_tileLibs(InLibs, TexName){
        const cage = create_Containers(InLibs.Data, InLibs.Data.type, TexName); // force type thumbs
        create_Sprites.call(cage);
        create_DebugElements.call(cage);
        setup_Parenting.call(cage);
        return cage;
    };

    // create obj for mouse with current data setup from 
    function build_Sprites(fromCage){
        const cage = create_Containers(fromCage.Data, fromCage.Data.type, fromCage.TexName); // force type thumbs
        create_Sprites.call(cage);
        create_DebugElements.call(cage);
        setup_Parenting.call(cage);
        setup_LayerGroup.call(cage);

        setup_Propretys.call(cage,fromCage);
        return cage;
    };
 

//#endregion

//#region [rgba(1, 20, 40,0.2)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘

    function show_tileSheet(InLibs) {
        // check if alrealy opened ???  open_tileSheet // return hide
        if(check_tileSheetStatus(CAGE_TILESHEETS,InLibs)){return};
        // create tiles from a LIST ARRAY for the tilesBox
        const list = [];
        const elements = InLibs.Data.textures || InLibs.Data.data.skins;
        Object.keys(elements).forEach(textureName => {
            const cage = build_tileLibs(InLibs, textureName);
            cage.Sprites.n? cage.Sprites.n.renderable = false : void 0;
            cage.Debug.piv? cage.Debug.piv.renderable = false : void 0;
        
            list.push(cage); // reference,  sheetName
            CAGE_TILESHEETS.addChild(cage);
            cage.interactive = true;
            cage.on('pointerover', pointer_overIN);
            cage.on('pointerout', pointer_overOUT);
            cage.on('pointerup', pointer_UP);
            cage.on('pointermove', function(e){checkAnchor(this)});
            cage.on('zoomTileLibs', wheelInLibs);
            cage.buttonType = "tileLibs";
            //cage.on('mousemove', onMove_tileSheet);
           // cage.on('pointerdown', onPointerdown_tileSheet);
            //cage.on('pointerup', onPointerup_tileSheet);
        });
        CAGE_TILESHEETS.list = list;
        // if cache not registered, compute path or copy value from cache.
        if(!CACHETILESSORT[InLibs.name]){
            CACHETILESSORT[InLibs.name] = pathFindSheet(list,20);
        }else{ // alrealy exist caches positions
            list.forEach(cage => {
                cage.position.copy( CACHETILESSORT[InLibs.name][cage.TexName] ); 
                cage.getBounds();
            });
        };
    };

    function check_tileSheetStatus(CAGE_TILESHEETS,InLibs) {
        // if open, and same name or diff name, hide or clear
        if(CAGE_TILESHEETS.name === InLibs.name){ return clear_tileSheet(true,CAGE_TILESHEETS) };
        if(CAGE_TILESHEETS.name !== InLibs.name){ return clear_tileSheet(false,CAGE_TILESHEETS,InLibs) };
    };

    function clear_tileSheet(hide,CAGE_TILESHEETS,InLibs) {
        // remove all, but keep the mask as child[0]
        if(hide){
            CAGE_TILESHEETS.renderable = false;
            CAGE_TILESHEETS.visible = false; // event manager
            CAGE_TILESHEETS.opened = false;
            CAGE_TILESHEETS.previouName = CAGE_TILESHEETS.name || null;
            CAGE_TILESHEETS.name = null;
            EDITOR.state.setAnimation(2, 'hideTileSheets', false);
            CAGE_TILESHEETS.list = [];
        }else{
            !CAGE_TILESHEETS.opened && EDITOR.state.setAnimation(2, 'showTileSheets', false);
            CAGE_TILESHEETS.name = InLibs.name;
            CAGE_TILESHEETS.opened = true;
            CAGE_TILESHEETS.renderable = true;
            CAGE_TILESHEETS.visible = true; // event manager

        }
        // reset clear
        CAGE_TILESHEETS.removeChildren();
        PIXI.utils.clearTextureCache();
        return hide;
    };

    function open_editor(openCachedLib) {
        EDITOR.state.setAnimation(1, 'start0', false);
        CAGE_LIBRARY.renderable = true;
        CAGE_LIBRARY.visible = true; // event manage
        if(openCachedLib && CAGE_TILESHEETS.list.length){
            CAGE_TILESHEETS.renderable = true
            CAGE_TILESHEETS.visible = true
            EDITOR.state.setAnimation(2, 'showTileSheets', false);
        }
    };

    function close_editor(cachedLibs) {
        EDITOR.state.setAnimation(1, 'hideFullEditor', false);
        CAGE_LIBRARY.renderable = false;
        CAGE_LIBRARY.visible = false; // event manage
        if(cachedLibs && CAGE_TILESHEETS.list.length){
            CAGE_TILESHEETS.visible = false
            CAGE_TILESHEETS.renderable = false
            EDITOR.state.setAnimation(2, 'hideTileSheets', false);
        };
    };

    function setStatusInteractiveObj(status){
        for (let i=0, l= $Objs.list_master.length; i<l; i++) {
            const _cage =  $Objs.list_master[i];
            _cage.interactive = status;
        };
    };

    function add_toMouse(InTiles) {
        const cage = build_Sprites(InTiles) //(InTiles.Data, InTiles.Sprites.groupTexureName);
        CAGE_MAP.addChild(cage);
        CAGE_MOUSE.list = cage;
        cage.interactive = true;
        cage.on('pointerup', pointer_UP);
        cage.on('pointerdown', pointer_DW);
        cage.buttonType = "tileMouse";
        // disable other interactive obj map
        close_editor(true);
        cage.hitArea = new PIXI.Rectangle(-20,-20,cage.width*2,cage.height*2);

        return cage;
    };

    // add to map new obj + Obj.Asign a copy unique of html Editor json asigned addtomap
    function add_toScene(obj) {
        const cage = build_Sprites(obj) //(InTiles.Data, InTiles.Sprites.groupTexureName);
        //TODO: if pined in a line. get position of old prite obj
        cage.x = mMX;
        cage.y = FreezeMY?FreezeMY.y : mMY;

        cage.Debug.bg.renderable = false;
        CAGE_MAP.addChild(cage);
        $Objs.list_master.push(cage);
        cage.getBounds();
        
        cage.interactive = false;
        cage.on('pointerover', pointer_overIN);
        cage.on('pointerout', pointer_overOUT);
        cage.on('pointerup', pointer_UP);
        cage.on('pointerdown', pointer_DW);

        cage.buttonType = 'tileMap';
        //cage.on('mousemove', onMove_objMap);
        //cage.on('pointerup', onPointerup_objMap);
        

    };

    function execute_buttons(buttonSprite) {
        console.log('buttonSprite: ', buttonSprite);
        console.log('InButtons: ', InButtons);
        const name = buttonSprite.region.name;
        if(name.contains("icon_setup")){
            open_sceneSetup(); // edit ligth brigth , and custom BG            
        }
        if(name.contains("icon_grid")){
            drawGrids();
        };
        if(name.contains("icon_masterLight")){
            //open_dataEditor();
            open_sceneGlobalLight(); // edit ligth brigth , and custom BG
        };
        if(name.contains("icon_drawLine")){
            addDebugLineToMouse();
        }
        if(name.contains("icon_Save")){
            open_SaveSetup();
        }
        
    };

//#endregion

//#region [rgba(0, 0, 0,0.3)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘
    // mX,mY: mouse Position
    function show_previews(cage, show) {
        CAGE_MOUSE.previews.removeChildren();
        if(show){
            CAGE_MOUSE.previews.addChild(...cage.Debug.previews);
        }
        CAGE_MOUSE.previewsShowed = !!show;
    };

    // mX,mY: mouse Position
    function checkAnchor(cage) {
        if (cage.Type === "spineSheet") { return }
        if(cage.Debug.bg._boundsRect.contains(mX,mY)){ // if in bg (no padding)
            const z = CAGE_TILESHEETS.scale.x;
            let b = cage.Debug.bg._boundsRect;
            let vec4H = b.width/4;
            let vec4V = b.height/4;
            let vec3H = [0, b.width/2, b.width];
            let vec3V = [0, b.height/2, b.height];
            let inX = mX - (b.x);
            let inY = mY - (b.y);
            let x,y;
            if(inX>vec4H*3){ x = vec3H[2] };
            if(inX<vec4H*3){ x = vec3H[1] };
            if(inX<vec4H*1){ x = vec3H[0] };
            if(inY>vec4V*3){ y = vec3V[2] };
            if(inY<vec4V*3){ y = vec3V[1] };
            if(inY<vec4V*1){ y = vec3V[0] };
            cage.Debug.an.position.set(x/z,y/z);
        };
    };

    // active filter1, for thumbs
    function activeFiltersFX1(cage,type){
        cage.Sprites.d._filters = [ FILTERS.OutlineFilterx4 ]; // thickness, color, quality
        cage._filters = [ FILTERS.OutlineFilterx16 ];
        cage.Debug.bg._filters = [ FILTERS.OutlineFilterx16 ];
        cage.alpha = 1;
    };

    function clearFiltersFX1(cage,type){
        cage.Sprites.d._filters = null; // thickness, color, quality
        cage._filters = null;
        cage.Debug.bg._filters = null;
        cage.alpha = 0.75;
    };

    // active filter2 for button
    function activeFiltersFX2(sprite,slot){
        sprite._filters = [ FILTERS.OutlineFilterx4 ]; // thickness, color, quality
        sprite.scale.set(1.25,-1.25);
        slot.color.a = 1;
    };

    function clearFiltersFX2(sprite,slot){
        sprite._filters = null; // thickness, color, quality
        sprite.scale.set(1,-1);
        slot.color.a = 0.35;
    };

    // active filter1, for thumbs
    function activeFiltersFX3(cage,checkHit){ //TODO: ALT fpour permuter entre les mask et alpha, mettre dans un buffer []
        cage.Sprites.d._filters = [ FILTERS.OutlineFilterx8Green ];
        cage.Sprites.d._filters[0].blendMode = cage.Sprites.d.blendMode || 0;
        if(checkHit){
            cage.Debug.bg.renderable = true;
            cage.checkHit = true;
            for (let i=0, l= $Objs.list_master.length; i<l; i++) {
                const _cage =  $Objs.list_master[i];
                if(cage===_cage){continue};
                if(_cage.zIndex>cage.zIndex){
                    const hit = hitCheck(cage,_cage);
                    _cage.Sprites.d._filters = hit ? [FILTERS.OutlineFilterx8Red ]: null;
                    _cage.Sprites.d.alphaHit = +_cage.Sprites.d.alpha;
                    _cage.Sprites.d.alpha = 0.3;
                    _cage.Sprites.n? _cage.Sprites.n.renderable =  hit ? false:true : void 0;
                };
            };
        };
    };

    function clearFiltersFX3(cage,checkHit){ //TODO: ALT fpour permuter entre les mask alpha, mettre dans un buffer []
        cage.Sprites.d._filters = null; // thickness, color, quality ,
        cage.Sprites.n? cage.Sprites.n._filters = null : void 0; // thickness, color, quality ,
        cage.Debug.bg.renderable = false;
        if(cage.checkHit){
            cage.checkHit = false;
            for (let i=0, l= $Objs.list_master.length; i<l; i++) {
                const _cage =  $Objs.list_master[i];
                _cage.Sprites.d._filters = null;
                Number.isFinite(_cage.Sprites.d.alphaHit)?  _cage.Sprites.d.alpha = +_cage.Sprites.d.alphaHit : void 0;
                _cage.Sprites.n? _cage.Sprites.n.renderable = true : void 0;
            };
        };
    };



    function refreshMouse() {
        mX = $mouse.x, mY = $mouse.y;
        mMX = (mX/Zoom.x)+STAGE.CAGE_MAP.pivot.x;
        mMY = (mY/Zoom.y)+STAGE.CAGE_MAP.pivot.y;
        update_Light();

        // if mouse have sprite =>update
        if(CAGE_MOUSE.list){ // update cages list hold by mouse
            CAGE_MOUSE.list.position.set(mMX,FreezeMY?FreezeMY.y : mMY);
            CAGE_MOUSE.list.zIndex = mMY;
        };

        // preview thumbs showed
        if(CAGE_MOUSE.previewsShowed){
            CAGE_MOUSE.previews.pivot.x = mX>1920/2 && CAGE_MOUSE.previews.width/2 || 0;
            CAGE_MOUSE.previews.position.set(mX/3, 900);
        };

        // if mouse hold line and draw mode ? 
        if(LineDraw){ LineDraw.position.set(mX,mY) };
    };

    function startMouseHold(activeTarget){
        clearTimeout(MouseTimeOut);
        MouseHold=false;
        if(activeTarget){ // active mouse MouseHold after 160 ms
            MouseTimeOut = setTimeout(() => {
                HoldX = +mX, HoldY = +mY;
                MouseHold=activeTarget;
            }, 160);
        };
    };
    
//#endregion

 
//#region [rgba(0, 5, 5,0.5)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘

    $mouse.on('mousemove', function(event) {
        //if(iziToast.opened){return}; // dont use mouse when toast editor
        refreshMouse();
        if(MouseHold){
            if( MouseHold.buttonType === "CAGE_TILESHEETS" ){
                CAGE_TILESHEETS.list.forEach(cage => {
                    cage.x+= event.data.originalEvent.movementX*0.7;//performe scroll libs mouse
                    cage.y+= event.data.originalEvent.movementY*0.6;//performe scroll libs mouse
                    cage.getBounds();
                    
                });
            };
        };
        if(FreezeMY){
            // unlock mouse from line
            if( Math.abs( FreezeMY.y-mMY)>40 ){
                FreezeMY._filters = null;
                FreezeMY.interactive = true;
                FreezeMY = null;
            }else{ $mouse.y = (FreezeMY.y-ScrollY)*Zoom.y };
            
        }
    }, STAGE);
    
    // mouse [=>IN <=OUT] FX
    function pointer_overIN(event){
        switch (event.currentTarget.buttonType) {
            case "thumbs":
                show_previews(this,true);
                activeFiltersFX1(event.currentTarget);
            break;
            case "button":
                activeFiltersFX2(event.currentTarget,this);
            break;
            case "tileLibs":
                activeFiltersFX1(event.currentTarget);
            break;
            case "tileMap":
                activeFiltersFX3(event.currentTarget, event.data.originalEvent.ctrlKey);
            break;
        };
    };

    function pointer_overOUT(event){
        switch (event.currentTarget.buttonType ) {
            case "thumbs":
                InLibs = null;
                show_previews(this,false);
                clearFiltersFX1(event.currentTarget);
            break;
            case "button":
                clearFiltersFX2(event.currentTarget,this);
            break;
            case "tileLibs":
                clearFiltersFX1(event.currentTarget);
            break;
            case "tileMap":
                clearFiltersFX3(event.currentTarget, event.data.originalEvent.ctrlKey);
            break;
        };
    };

    function pointer_DW(event){
        startMouseHold(event.currentTarget); // timeOut check MouseHold
      
    };

    function pointer_UP(event){
        if(MouseHold){ return startMouseHold(false) };
        startMouseHold(false);
        const _clickRight = event.data.button === 0;
        const clickLeft_ = event.data.button === 2;
        const click_Middle = event.data.button === 1;
        if(_clickRight){// <= clickUp
            if(LineDraw){
                LineDraw.off("pointerup",pointer_UP)
                STAGE.CAGE_MAP.addChild(LineDraw);
                LineDraw.position.set(mMX,mMY);
                LineDraw.on('pointerover', function(e){ 
                    FreezeMY = e.currentTarget;
                    FreezeMY._filters = [ FILTERS.OutlineFilterx8Green ];
                    e.currentTarget.interactive = false;
                });
                return LineDraw = null;
            }
            if(event.currentTarget.buttonType === "thumbs"){
                return show_tileSheet(event.currentTarget) // || hide_tileSheet();
            }
            if(event.currentTarget.buttonType === "tileLibs"){ 
                setStatusInteractiveObj(false); // disable interactivity
                return add_toMouse(event.currentTarget);
            }
            if(event.currentTarget.buttonType === "tileMouse"){ 
                return add_toScene(event.currentTarget); 
            }
            if(event.currentTarget.buttonType === "tileMap" &&  event.data.originalEvent.ctrlKey){ // in mapObj
                return document.getElementById("dataEditor") ? console.error("WAIT 1 sec, last dataEditor not cleared") : open_tileSetupEditor(event.currentTarget);
            
            }
            if(event.currentTarget.buttonType === "button"){ 
                return execute_buttons(event.currentTarget);
            }
        }
        if(clickLeft_){// => clickUp
            if(event.currentTarget.buttonType === "tileMouse"){ 
                CAGE_MAP.removeChild(CAGE_MOUSE.list);
                setStatusInteractiveObj(true);
                open_editor(true);
                return CAGE_MOUSE.list = null;
            }
            if(event.currentTarget.buttonType === "tileMap" && event.data.originalEvent.ctrlKey){//TODO: delete the current objsmap selected
                const index = $Objs.destroy(event.currentTarget);
                iziToast.info( $PME.removeSprite(event.currentTarget, index) );
            };
        }

    };

    // zoom tileLibs with wheel, emit by listener wheel_Editor()
    function wheelInLibs(event) {
        if(event.wheelDeltaY>0){
            CAGE_TILESHEETS.scale.x+=0.1;
            CAGE_TILESHEETS.scale.y+=0.1;
        }else{
            if(CAGE_TILESHEETS.scale._x>0.4){
                CAGE_TILESHEETS.scale.x-=0.1; 
                CAGE_TILESHEETS.scale.y-=0.1;
            }; 
        };
    };


    FIXME:
    /*
    function onPointerup_thumbs(event){
        show_tileSheet(this);
    };

    function onOver_thumbs(event){
        show_previews(this,true);
        this.Sprites.d._filters = [ FILTERS.OutlineFilterx4 ]; // thickness, color, quality
        this._filters = [ FILTERS.OutlineFilterx16 ];
        this.Debug.bg._filters = [ FILTERS.OutlineFilterx16 ];
        this.alpha = 1;
    };

    function onOut_thumbs(event){
        show_previews(this,false);
        this.Sprites.d._filters = null; // thickness, color, quality
        this.Debug.bg._filters = null;
        this.alpha = 0.75;
    };

    function onOver_buttons(event){
        const sprite =  this.currentSprite;
        sprite._filters = [ FILTERS.OutlineFilterx4 ]; // thickness, color, quality
        sprite.scale.set(1.2,-1.2);
        this.color.a = 1;
    };

    function onOut_buttons(event){
        const sprite =  this.currentSprite;
        sprite._filters = null; // thickness, color, quality
        sprite.scale.set(1,-1);
        this.color.a = 0.35;
    };

    function onMove_tileSheet(event){
        if(MouseHold){ // drag library
            console.log('event: ', event.data);
            CAGE_TILESHEETS.list.forEach(cage => {
                cage.x+= event.data.originalEvent.movementX*0.3;//performe scroll libs mouse
                cage.y+= event.data.originalEvent.movementY*0.3;//performe scroll libs mouse
                //cage.getBounds();
            });
        }else{
            checkAnchor(this);
        };
    };

    function onOver_tileSheet(event){
        this.Debug.bg.getBounds();
        this._filters = [ FILTERS.OutlineFilterx16 ];

    };

    function onOut_tileSheet(event){
        this._filters = null;
    };

    function onPointerdown_tileSheet(event){
        startMouseHold(true);
    };

    function onPointerup_tileSheet(event){
        startMouseHold(false);
        const cageInMouse = add_toMouse(this);
        cageInMouse.interactive = true;
        cageInMouse.on('pointerup', onPointerup_cageMouseWithSprite);
    };

    // when sprite hold by mouse.
    function onPointerup_cageMouseWithSprite(event){
        const _clickRight = event.data.button === 0;
        const clickLeft_ = event.data.button === 2;
        const click_Middle = event.data.button === 1;
        if(_clickRight){// <=
            event.data.button
            add_toScene(this);
        }
        if(clickLeft_){// =>
            CAGE_MAP.removeChild(CAGE_MOUSE.list);
            return CAGE_MOUSE.list = null;
        }
    };

    function onOver_objMap(event){
        this.Debug.bg.renderable = true;
        this.Debug.bg._filters = [ FILTERS.OutlineFilterx16 ];

        $Objs.list_master.forEach(cage => {
            if(this !== cage && cage.zIndex>this.zIndex){
                const hit = hitCheck(this,cage);
                cage.alpha =  hit ? 0.3:1;
                cage.Sprites.d._filters = hit ? [ FILTERS.PixelateFilter12, FILTERS.OutlineFilterx6White]: null;
                if(cage.Sprites.n){ cage.Sprites.n.renderable = false };
                cage.Debug.an.renderable = false;
            }else{
                cage.alpha = 1;
                cage.Sprites.d._filters = null;
                cage.Sprites.n && (cage.Sprites.n.renderable = true);
                cage.Debug.an.renderable = true;
            };
        });
    };

    function onOut_objMap(event){
        this.Debug.bg.renderable = false;
        this.Debug.bg._filters = null;
    };
    function onMove_objMap(event){
        
    };
    function onPointerup_objMap(event){
        if(event.data.originalEvent.ctrlKey){
            open_tileSetupEditor(this);
        };
    };
*/


    /*function mousedown_Editor(event) {
        startMouseHold(true); // timeOut check hold click
    };*/
/*
    function mouseup_Editor(event) {
        if(MouseHold){ return startMouseHold(false) }; // break if was hold
        startMouseHold(false);
        if(iziToast.opened){return  document.exitPointerLock()}; // dont use mouse when toast editor
        const _clickRight = event.button === 0;
        const clickLeft_ = event.button === 2;
        const click_Middle = event.button === 1;
        const _shift_ = !!event.shiftKey;
        if(_clickRight){// <= right click
            if(CAGE_MOUSE.list){ // 
                return add_toScene(CAGE_MOUSE.list); // copy the current mouse and add to map new obj
            }
            if(InLibs){ // in bottom library
                return show_tileSheet(InLibs) //|| hide_tileSheet();
            }
            if (InTiles) { // in Right library tile
                return add_toMouse(InTiles);
            }
            if(InButtons){ // in buttons
                return execute_buttons(InButtons);
            }
            if (InMapObj && event.ctrlKey) { // in Right library tile
                // focus position objs
                return open_tileSetupEditor(InMapObj);
            }
            if(LineDraw){ // add line to stage
                CAGE_MAP.addChild(LineDraw);
                LineDraw.position.set(mMX,mMY);
                LineDraw.getBounds(); // TODO: NEED GETBOUND WHEN NO ZOOM OR FIND A FORMULA
                LineDraw._boundsRect.pad(16,16);
                LineList.push(LineDraw);
                return LineDraw = null;
            }
        };

        if(clickLeft_){// => leftClick
            if(CAGE_MOUSE.list){
                CAGE_MAP.removeChild(CAGE_MOUSE.list);
                return CAGE_MOUSE.list = null;
            }
            if(InMapObj){//TODO: delete the current objsmap selected
                
                const index = $Objs.list_master.indexOf(InMapObj);
                if(index>-1){
                    CAGE_MAP.removeChild(InMapObj);
                    $Objs.list_master.splice(index, 1);
                    iziToast.info( $PME.removeSprite(InMapObj,index) );
                }
                InMapObj = null;
            };
        };
    };
*/

    // zoom camera
    function wheel_Editor(event) {
        if(iziToast.opened){return}; // dont use mouse when toast editor
        // zoom in Libs
        const mousePosition = new PIXI.Point();// cache a global mouse position to keep from creating a point every mousewheel event TODO:
        $mouse.interaction.mapPositionToPoint(mousePosition, event.x, event.y); // get global position in world coordinates
          // returns element directly under mouse
        const found = $mouse.interaction.hitTest(mousePosition);
        // Dispatch scroll event
        if (found && (found.buttonType === "tileLibs" || found.buttonType === "CAGE_TILESHEETS") ) { 
            return found.emit('zoomTileLibs', event); 
        };
        
        // zoom map
        const pos = new PIXI.Point(mX,mY);
        STAGE.CAGE_MAP.toLocal(pos, null, MemCoorZoom1);
        if(event.wheelDeltaY>0){
            Zoom.x+=0.1,Zoom.y+=0.1
        }else{
            if(Zoom._x>0.4){ Zoom.x-=0.1, Zoom.y-=0.1 }; 
        };
        STAGE.CAGE_MAP.toLocal(pos, null, MemCoorZoom2);  // update after scale
        STAGE.CAGE_MAP.pivot.x -= (MemCoorZoom2.x - MemCoorZoom1.x);
        STAGE.CAGE_MAP.pivot.y -= (MemCoorZoom2.y - MemCoorZoom1.y);
        ScrollX -= (MemCoorZoom2.x - MemCoorZoom1.x);
        ScrollY -= (MemCoorZoom2.y - MemCoorZoom1.y);
    

    };

    function keydown_Editor(event) {
    
        if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
            // start save Data
           // return start_DataSavesFromKey_CTRL_S();
        };
        if (event.ctrlKey && (event.key === "n")) {
            // show all normals
            if(CAGE_TILESHEETS.list){
                CAGE_TILESHEETS.list.forEach(cage => {
                    if(cage.Sprites.n && cage.Sprites.d){
                        cage.Sprites.n.renderable = !cage.Sprites.n.renderable;
                        cage.Sprites.d.renderable = !cage.Sprites.d.renderable;
                    }
                });
            }
        };
        if(event.ctrlKey && (event.key === "v" || event.key === "V")){ // if in Obj, make other transparent
            const mousePosition = new PIXI.Point(mX,mY);
            const found = $mouse.interaction.hitTest(mousePosition);
            if (found && found.buttonType === "tileMap") { 
                return pasteCopyDataIn(found);
            };
        };
        
    };


    //document.addEventListener('mousemove', mousemove_Editor.bind(this));
    //document.addEventListener('mousedown', mousedown_Editor);
    document.addEventListener('mouseup',function(){ startMouseHold(false); }); // FIXME: bug, car ce desactive seulement lors que un immit est call sur obj
    document.addEventListener('wheel', wheel_Editor);
    document.addEventListener('keydown', keydown_Editor); // change layers
//#endregion


    // Tikers for editor update (document Title, check scroll)
    const editorTiker = new PIXI.ticker.Ticker().add((delta) => {
        document.title = `
        mX: ${~~mX}  mY: ${~~mY} ||  mMX: ${~~mMX}  mMY: ${~~mMY} || ScrollX:${~~ScrollX} ScrollY:${~~ScrollY}
        `;
        if(scrollAllowed){
            let scrolled = false;
            (mX<10 && (ScrollX-=ScrollF) || mX>1920-10 && (ScrollX+=ScrollF)) && (scrolled=true);
            (mY<15 && (ScrollY-=ScrollF) || mY>1080-15 && (ScrollY+=ScrollF)) && (scrolled=true);
            scrolled && (ScrollF+=0.4) || (ScrollF=0.1) ;
        }
        STAGE.CAGE_MAP.pivot.x+=(ScrollX-STAGE.CAGE_MAP.pivot.x)/(scrollSpeed*delta);
        STAGE.CAGE_MAP.pivot.y+=(ScrollY-STAGE.CAGE_MAP.pivot.y)/(scrollSpeed*delta);
    });
    //Game_Player.prototype.updateScroll = function(){}//disable scoll character in editor mode
    editorTiker.start();




    //#region [rgba(100, 5, 0,0.2)]
// ┌------------------------------------------------------------------------------┐
// SAVE COMPUTE JSON
// └------------------------------------------------------------------------------┘
    //call fast save with ctrl+s
    function start_DataSavesFromKey_CTRL_S(useOption) {
        if(useOption){
            useOption = {
                _renderParaForRMMV : document.getElementById("_renderParaForRMMV").value,
                _renderLayersPSD : document.getElementById("_renderLayersPSD").value,
                _renderEventsPlayers : document.getElementById("_renderEventsPlayers").value,
                _renderDebugsElements : document.getElementById("_renderDebugsElements").value,
                _renderingLight : document.getElementById("_renderingLight").value,
                _renderLayers_n : document.getElementById("_renderLayers_n").value,
                _renderAnimationsTime0 : document.getElementById("_renderAnimationsTime0").value,
            }
            // system info data
            useOption.systemInfo = {
                //MEMORY USAGES
                heaps : +document.getElementById("heaps").innerHTML.replace("MB",""),
                heapTotal : +document.getElementById("heapTotal").innerHTML.replace("MB",""),
                external : +document.getElementById("external").innerHTML.replace("MB",""),
                rss : +document.getElementById("rss").innerHTML.replace("MB",""),
                // generique
                versionEditor : document.getElementById("versionEditor").innerHTML,
                SavePath : document.getElementById("SavePath").innerHTML,
                totalSpines : +document.getElementById("totalSpines").innerHTML,
                totalAnimations : +document.getElementById("totalAnimations").innerHTML,
                totalTileSprites : +document.getElementById("totalTileSprites").innerHTML,
                totalLight : +document.getElementById("totalLight").innerHTML,
                totalEvents : +document.getElementById("totalEvents").innerHTML,
                totalSheets : +document.getElementById("totalSheets").innerHTML,
            }
        };
        create_SceneJSON(useOption);
        console.log('useOption: ', useOption.systemInfo);
        //useOption ? create_RenderingOptions(useOption):void 0; TODO:
        iziToast.warning( $PME.savedComplette() );
    };

    function create_SceneJSON(options) {
        const fs = require('fs');
        const sceneName = STAGE.constructor.name;
        let PERMASHEETS = computeSave_PERMASHEETS(DATA); // permanent objs
        let SCENE = computeSave_SCENE(STAGE); // scene configuration, bg ..
        let OBJS = computeSave_OBJ($Objs.list_master); // scene objs
        let SHEETS = computeSave_SHEETS(SCENE,OBJS); // sheet need for scene
        let PLANETSHEETS = computeSave_PLANETS(SCENE,OBJS,SHEETS); // CREATE PlanetID?.json with ._SHEETS
        console.log('PLANETSHEETS: ', PLANETSHEETS);

        const data = {_SCENE:SCENE, _OBJS:OBJS, _SHEETS:SHEETS, system:options.systemInfo };
        const data_perma = {_SHEETS:PERMASHEETS};
        const data_planets = {_SHEETS:PLANETSHEETS}
        
        function writeFile(path,content,data){
            // backup current to _old.json with replace() rename()
            fs.rename(`${path}`, `${path.replace(".","_old.")}`, function(err) {
                if ( err ) console.log('ERROR:rename ' + err);
                // enrigistre write json
                fs.writeFile(path, content, 'utf8', function (err) { 
                    if(err){return console.error(path,err) }return console.log9("Created: "+path,data);
                });
            });
        };
        writeFile(`data/perma.json`, JSON.stringify(data_perma, null, '\t'), data_perma);   // perma
        writeFile(`data/${sceneName}_data.json` , JSON.stringify(data, null, '\t'), data); // scene
        writeFile(`data/PlanetID${STAGE.planetID}.json` , JSON.stringify(data_planets, null, '\t'), data_planets); // planets
    };

    function computeSave_PERMASHEETS(DATA) {
        const data = {};
        for (const key in DATA) {
            DATA[key].perma ? data[DATA[key].name] =  DATA[key] : void 0;
        };
        return data;
    };

    function computeSave_SCENE(STAGE) {
        // get light setup
        const Data_Values = getDataJson(STAGE.light_Ambient);
        const Data_CheckBox = getDataCheckBoxWith(STAGE.light_Ambient, Data_Values);
        const data = {};
        for (const key in Data_Values) {
            data[key] = Data_CheckBox[key] ? Data_Values[key].value : Data_Values[key].def;
        };
        STAGE.Background ? data.Background = STAGE.Background.name: void 0;
        return data;
    };

    function computeSave_OBJ(list_master) {
        const objs = [];
        list_master.forEach(e => {
            const _Data_Values = computeDataForJson(e); // version simple du Data_Values baser sur les values reel de l'elements
            objs.push({Data: e.Data, Data_Values:_Data_Values, textureName:e.TexName });
        });
        return objs;
    };

    // check all elements and add base data need for loader
    function computeSave_SHEETS(SCENE,OBJS) {
        const data = {};
        if(SCENE.Background){ // add the background sprite
            data[SCENE.Background] = $PME.Data2[SCENE.Background];
        };
        OBJS.forEach(e => {
            data[e.Data.name] = $PME.Data2[e.Data.name];
        });
        return data;
    };

    // check all elements and add base data need for loader
    function computeSave_PLANETS(SCENE,OBJS,SHEETS) {
        let data = Object.assign({}, SHEETS);
        const list = Object.keys($Loader.loaderSet); // get list of all Scene_MapID?_data
        let i = 1;
        while (list.contains(`Scene_MapID${i}_data`)) {
            const sheets = $Loader.loaderSet[`Scene_MapID${i}_data`]._SHEETS;
            data = Object.assign(data, sheets);
            i++;
        }
        return data;
    };



    function snapScreenMap(options) {
        // create a snap to import in rmmv sofware
        STAGE.CAGE_EDITOR.renderable = false;
        const w = STAGE.CAGE_MAP.width;
        const h = STAGE.CAGE_MAP.height;
        STAGE.CAGE_MAP.position.set(0,h);
        STAGE.CAGE_MAP.scale.set(1,-1);
        STAGE.CAGE_MAP.pivot.set(0,0);
        const renderer = PIXI.autoDetectRenderer(w, h);
        const renderTexture = PIXI.RenderTexture.create(w, h);
            renderer.render(STAGE, renderTexture);
        const canvas = renderer.extract.canvas(renderTexture);
        const urlData = canvas.toDataURL();
        const base64Data = urlData.replace(/^data:image\/png;base64,/, "");
        const _fs = require('fs');
        const crypto = window.crypto.getRandomValues(new Uint32Array(1));
        _fs.writeFile(`testSnapStage_${crypto}.png`, base64Data, 'base64', function(error){
            if (error !== undefined && error !== null) {  console.error('An error occured while saving the screenshot', error); } 
        });
        // RESTOR
        STAGE.CAGE_EDITOR.renderable = true;
        STAGE.CAGE_MAP.position.set(0,0);
        STAGE.CAGE_MAP.scale.set(1,1);
        STAGE.CAGE_MAP.pivot.set(0,0);
   };
    //#endregion

//////// ┌------------------------------------------------------------------------------┐
//////// MOUSE TRAILS
////////└------------------------------------------------------------------------------┘
    //Get the texture for Rope.
    function startTrailMouse(){
        var trailTexture = PIXI.Texture.fromImage('editor/trail.png')
        var historyX = []; var historyY = [];
        var historySize = 30;//historySize determines how long the trail will be.
        var ropeSize = 80; //ropeSize determines how smooth the trail will be.
        var points = [];
        //Create history array.
        for( var i = 0; i < historySize; i++){
            historyX.push(0); historyY.push(0);
        }
        //Create rope points.
        for(var i = 0; i < ropeSize; i++){points.push(new PIXI.Point(0,0))};
        //Create the rope
        var rope = new PIXI.mesh.Rope(trailTexture, points);
        rope.blendmode = PIXI.BLEND_MODES.ADD;
        STAGE.CAGE_MOUSE.addChild(rope);
        const trailTiker = PIXI.ticker.shared.add((delta) => {
            historyX.pop();historyX.unshift(mX);
            historyY.pop();historyY.unshift(mY);
            for( var i = 0; i < ropeSize; i++){
                var p = points[i];
                var ix = cubicInterpolation( historyX, i / ropeSize * historySize);
                var iy = cubicInterpolation( historyY, i / ropeSize * historySize);
                p.x = ix; p.y = iy;
            }
        });
        function clipInput(k, arr){
            if (k < 0){k = 0;}
            if (k > arr.length - 1){  k = arr.length - 1;}
            return arr[k];
        };
        function getTangent(k, factor, array){return factor * (clipInput(k + 1, array) - clipInput(k - 1,array)) / 2;}
        function cubicInterpolation(array, t, tangentFactor){
            if (tangentFactor == null) tangentFactor = 1;
            var k = Math.floor(t);
            var m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
            var p = [clipInput(k,array), clipInput(k+1,array)];
            t -= k;
            var t2 = t * t;
            var t3 = t * t2;
            return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + ( -2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
        };
    };
    startTrailMouse();
};//END EDITOR

