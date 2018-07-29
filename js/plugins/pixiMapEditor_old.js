/*:
// PLUGIN □────────────────────────────────□PIXI MAP EDITOR□─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc EDITOR GUI for create map with object sprine JSON (texture packer, spine)
* V.1.1A
* License:© M.I.T
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
NOTE AND HELP:
    this.CAGE_MOUSE.name = "CAGE_MOUSE";
    this.CAGE_MAP.name = "CAGE_MAP";
    this.CAGE_GUI.name = "CAGE_GUI";

*/

 // START INITIALISE EDITOR
document.addEventListener('keydown', initializeEditor);
function initializeEditor(event){
    console.log1('__________________initializeEditor:__________________ ');
    if(event.key === "F1"){
        (function() {
            const javascript = [
                "js/iziToast/iziToast.js",
                "js/iziToast/pixiMapEditor_HTML.js",
                "js/iziToast/pixiMapEditor_TOAST.js",
            ];
            const css = [
                'js/iziToast/iziToast.css',
            ];
            function onComplette(){
                $PME.initializeTOAST();
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
    };
};

// ┌------------------------------------------------------------------------------┐
// GLOBAL $PME CLASS: _SLL for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
class _PME{
    constructor() {
        this._avaibleData = {}; // store result from nwjs and pixi loader data
        this.editor = {}; // store editor
        this.filters = (function(){
            const filters = [ // cache somes filters reference
                new PIXI.filters.OutlineFilter(4, 0x2d2d2d),
                new PIXI.filters.ColorMatrixFilter(),
                new PIXI.filters.OutlineFilter(8, 0xffffff),
            ];
            filters[1].desaturate();
            return filters;
        })()

        this.storage = localStorage; // $PME.storage will keep editor information after session navigator
        // from SSL
        this.libsLoaded = false;
        this.libraryPath = 'SSA'; // FOLDER PATH WHERE STORED ALL JSON LIBRARY
        this.category = []; // store Category name found from scannerNwJS (all objects can have a general category for easy sort)
        this.pathLibsJson = {}; // result from nwJS libs folders scanner path formated for pixiJS
        this.resource = {}; //Store sheets and spine ressources
    };
  };
  const $PME = new _PME(); // global ↑↑↑
  console.log2('$PME.', $PME);

// ┌------------------------------------------------------------------------------┐
// wait JSONlibraryLoader befor initialise pixiMapEditor
//└------------------------------------------------------------------------------┘
_PME.prototype.initializeTOAST = function() { // load all sprites dependency for editor gui only
    iziToast.warning( this.izit_loading1() );
};


_PME.prototype.startEditorLoader = function() { // load all sprites dependency for editor gui only
    const loader = new PIXI.loaders.Loader();
    loader
    .add('editorGui', `editor/pixiMapEditor1.json`)
    loader.load();

    loader.onProgress.add((loader, res) => {
        if (res.extension === "png") {
            this.editor[res.name] = res.texture;
        }
        if (res.spineData) {
            this.editor[res.name] = res.spineData;
        }
    });

    loader.onComplete.add(() => { 
        this.load_nwJSFolderLibs();
        //this.startGui();
    });
 };

 _PME.prototype.load_nwJSFolderLibs = function() {
    const loadingStatus =  document.getElementById('izit_loading1')
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
                let dirArray = filenameFormated.split("/");
                let fileData = path.parse(filenameFormated); // split data
                fileData.dirArray = dirArray;
                if(fileData.dirArray.indexOf("SOURCE")<0){ // if is not a source json (exlude all json in source folder)
                    let fileDataFromJson = JSON.parse(fs.readFileSync(filename, 'utf8'));
                    fileData.meta = fileDataFromJson.meta;
                    this._avaibleData[fileData.name] = fileData;
                    const loadProgressTxt = document.createElement("div");
                    loadProgressTxt.innerHTML = `<p><span style="color:#fff">${fileData.name}</span> ==><span style="color:#989898">"${filename}"</span></p>`;
                    loadingStatus.appendChild(loadProgressTxt);
                };
            };
        };
    }.bind(this);
    fromDir('data2/libs','.json'); //START
    console.log('this._avaibleData: ', this._avaibleData);
    this.loadDataJson();
 };

 // start load all json data
 _PME.prototype.loadDataJson = function() {
    PIXI.utils.clearTextureCache(); // clear all cache avoid error
    const loader = new PIXI.loaders.Loader();
    for (const key in this._avaibleData) {
        const data = this._avaibleData[key];
        console.log('data: ', data);
        loader.add(key, `${data.dir}/${data.base}`);
        loader.resources[key].attacheData = data;
    };
    loader.load();
    loader.onProgress.add((loader, res) => {
        if(res.attacheData){
            res.attacheData.textures = res.textures;
            res.attacheData.texture_spritesheet = PIXI.Texture.from(res.spritesheet.baseTexture);
        };
    });

    loader.onComplete.add((loader, res) => {
        PIXI.utils.clearTextureCache();
        this.startGui();
        console.log('this._avaibleData: ', this._avaibleData);
    });
 };

 _PME.prototype.startGui = function() {
    $gameSystem._menuEnabled = false; // disable rmmv menu
    // scene hack
    const scene = SceneManager._scene;
    scene.CAGE_EDITOR = new PIXI.Container();
    scene.CAGE_EDITOR.name = "CAGE_GUI";
    scene.addChildAt(SceneManager._scene.CAGE_EDITOR, scene.children.length-1);

    const cage = new PIXI.Container();
    const spine = new PIXI.spine.Spine(this.editor.editorGui);
    scene.CAGE_EDITOR.addChild(spine);

    spine.autoUpdate = true;
    spine.state.setAnimation(0, 'idle', true);
    spine.state.setAnimation(1, 'start0', false);
    spine.state.tracks[1].listener = {
        complete: function(trackEntry, count) {
            iziToast.hide({transitionOut: 'fadeOutUp'}, document.getElementById("izit_loading1") );
            iziToast.warning( $PME.izit_loading1() );
            //$PME.startEditor();
        }
    };
 };


// ┌------------------------------------------------------------------------------┐
// END START INITIALISE PLUGIN METHOD** ↑↑↑
// └------------------------------------------------------------------------------┘


 // Start The Editor initialisation SCOPE
_PME.prototype.startEditor = function() {
    //#region [rgba(200, 0, 0,0.07)]
    // ┌------------------------------------------------------------------------------┐
    // Start The Editor initialisation SCOPE
    // └------------------------------------------------------------------------------┘
    const Scene = SceneManager._scene; 
    const SpriteSet = SceneManager._scene._spriteset;
    const TilesMap = SceneManager._scene._spriteset._tilemap;
    const Renderer = Graphics._renderer; // ref to current renderer RMMV Graphics
    const Scene_W = SceneManager._boxWidth;
    const Scene_H = SceneManager._boxHeight;
    const Zoom = TilesMap.scale;
    const memCoord = new PIXI.Point(), memCoord2 = new PIXI.Point(); // for control zoom memory
    const DisplayGroup = SpriteSet.displayGroup; // reference to PIXI.display.Group for stage
    const Cage_Libs = new PIXI.Container(); // Store all avaibles libary
    const Cage_Libs_Mask = new PIXI.Sprite(PIXI.Texture.WHITE); //Mask for scroll bottom libs
    const Cage_SheetsPNG = new PIXI.Container(); // hold all PNG preview from avaible sheets libs
    const Cage_LibsTiles = new PIXI.Container(); // Store all tiles avaible from a libs
    const Cage_LibsTiles_Mask = new PIXI.Sprite(PIXI.Texture.WHITE); //Mask for scroll right Libtiles
    const Cage_DataEditor = new PIXI.Container();  //store sprite preview data editor
    const Cage_Mouse = new PIXI.Container(); // hold all Obj sprites in mouse 
    const Cage_Grid = new PIXI.Container(); // cage that store grid system
    const Bg_Selector = new PIXI.Sprite(PIXI.Texture.WHITE); // BG rectangle when mouse over a libs elements
    let DisplayGroup_Selected = DisplayGroup[1]; // default or selected Display groupe
    let mX,mY,memX,memY; mX = mY = memX = memY = 50; // Mouse screen Position XY scoped, memX,memY its memory when mouse start hold 
    let [dX,dY] = [TilesMap.width+(TilesMap.pivot.x-TilesMap.width),TilesMap.height+(TilesMap.pivot.y-TilesMap.height)];// real display, not the supid one from rmmv (give real information for place obj)
    let ScrollX = 0, ScrollY = 0; // scroll increase Ease
    let ScrollF = 0.1; // _displayXY power for scroll map
    let scrollSpeed = 20; // speed for map scrool
    let [InObjSprite,InButtons,InlibsMask,Inlibs,InTile,InTileMask,InObjMap] = [false,false,false,false,false,false]; // store data , when hover a interaction object, InObjSprite:get current target editor
    let scrollAllowed = true; // allow scroll screen XY
    let ButtonsSlots = {}; // Store skeleton Button Data for editor
    let LastGuiFocused = Cage_Libs; // keep last focused library for scroll when obj library (default Inlibs:Cage_Libs)
    let MouseTimeOut = null; // store mouse hold timeOut when hold click
    let MouseHold = null; // click mouse is held ?
    let TileSheetsOpened = false; // tell if tilesheets are showed or no ?
    let QuickEditMode = false; // the quick proprety mode when hold click with obj in mouse
    let EditorOpen = false; // tell if the editor are open.

    let PathMode = false; // path mode allow draw path system
    let CaseObjList = []; // list of all case obj for easy scan
    let PathObjSelected = [];
 
    //#endregion

    //#region [rgba(250, 0, 0,0.03)]
    // ┌------------------------------------------------------------------------------┐
    // SETUP VARIABLE AND AUTO FUNCTION SCOPED (ONCE)
    // └------------------------------------------------------------------------------┘
    Scene.addChild(Cage_Libs,Cage_Libs_Mask, Cage_SheetsPNG, Cage_LibsTiles, Cage_LibsTiles_Mask, Cage_DataEditor );
    // setup Cage_Libs and mask
    Cage_Libs.name = "Cage_Libs";
    Cage_Libs.position.set(100,712);
    Cage_Libs_Mask.anchor.set(0,1);
    Cage_Libs_Mask.width = 1310, Cage_Libs_Mask.height = 145;
    Cage_Libs_Mask.x = 100-4, Cage_Libs_Mask.y = 712+Cage_Libs_Mask.height-4;
    Cage_Libs.mask = Cage_Libs_Mask;
    Cage_Libs_Mask.getBounds();
    // setup Cage_SheetsPNG (use .renderable)
    Cage_SheetsPNG.cage_bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    Cage_SheetsPNG.cage_bg.alpha = 0.8;
    Cage_SheetsPNG.cage_bg.anchor.set(0.5,0);
    Cage_SheetsPNG.addChild(Cage_SheetsPNG.cage_bg);
    // setup Cage_LibsTiles and mask
    Cage_LibsTiles.name = "Cage_LibsTiles";
    Cage_LibsTiles.position.set(Scene_W-635,70);
    Cage_LibsTiles.renderable = false;
    Cage_LibsTiles_Mask.position.set(Scene_W,70);
    Cage_LibsTiles_Mask.anchor.set(1,0);
    Cage_LibsTiles_Mask.width = 630, Cage_LibsTiles_Mask.height = 590;
    Cage_LibsTiles.mask = Cage_LibsTiles_Mask;
    Cage_LibsTiles_Mask.getBounds();
    // add dinamyc txt for tileGui
    Cage_LibsTiles.title = new PIXI.Text("",{fill:"#5b5b5b"});
    Cage_LibsTiles.title.x = -240, Cage_LibsTiles.title.y = -15;
    $PME.editorGui.skeleton.findSlot("Top_R_TileScreen").currentSprite.addChild(Cage_LibsTiles.title);
    // setup Cage_Grid
    TilesMap.addChild(Cage_Grid);
    // setup Cage_Mouse
    TilesMap.addChild(Cage_Mouse);
    Cage_Mouse.name = "Cage_Mouse";
    Cage_Mouse.objSprite = false; // ref to children obj
    Cage_Mouse.parentGroup = DisplayGroup_Selected;
    Cage_Mouse.icons = [], Cage_Mouse.iconsLight = [];
    Cage_Mouse.ico_rotation = new PIXI.Sprite(PIXI.utils.TextureCache["mode_rotation"]);
    Cage_Mouse.ico_rotation.pivot.set(Cage_Mouse.ico_rotation.width/2,Cage_Mouse.ico_rotation.height/2);
    Cage_Mouse.ico_scale = new PIXI.Sprite(PIXI.utils.TextureCache["mode_scale"]);
    Cage_Mouse.ico_scale.pivot.set(Cage_Mouse.ico_scale.width/2,Cage_Mouse.ico_scale.height/2);
    Cage_Mouse.ico_pivot = new PIXI.Sprite(PIXI.utils.TextureCache["mode_pivot"]);
    Cage_Mouse.ico_pivot.pivot.set(Cage_Mouse.ico_pivot.width/2,Cage_Mouse.ico_pivot.height/2);
    Cage_Mouse.ico_skew = new PIXI.Sprite(PIXI.utils.TextureCache["mode_skew"]);
    Cage_Mouse.ico_skew.pivot.set(Cage_Mouse.ico_skew.width/2,Cage_Mouse.ico_skew.height/2);
    Cage_Mouse.icons.push(Cage_Mouse.ico_rotation,Cage_Mouse.ico_scale,Cage_Mouse.ico_pivot,Cage_Mouse.ico_skew);
    Cage_Mouse.ico_radius = new PIXI.Sprite(PIXI.utils.TextureCache["mode_radius"]);
    Cage_Mouse.ico_radius.pivot.set(Cage_Mouse.ico_radius.width/2,Cage_Mouse.ico_radius.height/2);
    Cage_Mouse.ico_lightHeigth = new PIXI.Sprite(PIXI.utils.TextureCache["mode_lightHeigth"]);
    Cage_Mouse.ico_lightHeigth.pivot.set(Cage_Mouse.ico_lightHeigth.width/2,Cage_Mouse.ico_lightHeigth.height/2);
    Cage_Mouse.ico_brightness = new PIXI.Sprite(PIXI.utils.TextureCache["mode_brightness"]);
    Cage_Mouse.ico_brightness.pivot.set(Cage_Mouse.ico_brightness.width/2,Cage_Mouse.ico_brightness.height/2);
    Cage_Mouse.iconsLight.push(Cage_Mouse.ico_radius,Cage_Mouse.ico_lightHeigth,Cage_Mouse.ico_brightness);

     // createLibraryObj sheets for thumbails libs
    (function(){
        const list = Object.keys($SLL.resource);
        for (let i = 0, len = list.length; i < len; i++) {
            const name = list[i];
            const source =  $SLL.resource[name];
            if(typeof(source.normal) === "boolean"){ continue };
            const cage = new PIXI.Container(); // need Cage for store all icon and other elements
            const cage_bg = new PIXI.Sprite(PIXI.Texture.WHITE); // bg for the cage
            const objSprite = create_ObjSprite(source,false); //(name,type,normal):return sprite
            const sheetsPNG = create_SheetsPNG(source); // the preview spriteSheets
            const icon_type = new PIXI.Sprite(PIXI.utils.TextureCache[`thumb_icon_${source.type}`]); // icon for type
            const icon_normal = new PIXI.Sprite(PIXI.utils.TextureCache[`thumb_icon_normal`]); // icon for normal
            const icon_edited = new PIXI.Sprite(PIXI.utils.TextureCache["thumb_icon_editedData"]);
                const frameW = 170, frameH = 122; //editor libs frames widh,height
                cage_bg.width = frameW, cage_bg.height = frameH;
                 // resize to frame
                objSprite.scale.set( getRatio(objSprite, frameW, frameH) );//(obj, w, h)
                sheetsPNG.scale.set( getRatio(sheetsPNG, 400, 400) );//(obj, w, h)
                // position
                objSprite.position.set(cage_bg.width/2,cage_bg.height);
                icon_normal.y = icon_type.height+4;
                icon_edited.y =(icon_type.height*2)+8;
                // reference
                objSprite.source = source;
                objSprite.sheetsPNG = sheetsPNG;
                cage.source = source;
                cage.objSprite = objSprite;
                cage.cage_bg = cage_bg;
                cage.addChild(cage_bg, objSprite, icon_type, icon_normal, icon_edited);
            $PME.objLibrary.push(cage);
        };
        refreshLibs();
    })();
    
    // createButtons
    (function(){ // make and store buttons Data'slots
    const list = $PME.editorGui.spineData.slots;
    for (let i = 0; i < list.length; i++) {
        const slot = list[i];
        const name = slot.boneData.name;
        if(name.indexOf("buttons_")>-1){
            const _slot = $PME.editorGui.skeleton.findSlot(slot.name);
            const type = name.substr(name.indexOf("_") + 1);
            ButtonsSlots[slot.name] = _slot;
            _slot.name = slot.name;
            _slot.type = type;
            _slot.boundRec = _slot.currentSprite.getBounds();
        };
    };
    //force select layer button 
    update_DisplayGroup(1);
    })();

    // convert Existing sprites elements from json to objmapEditor
    (function(){
        TilesMap._objSprites.forEach(e => {
            // asign source
            e.source = Object.assign({}, $SLL.resource[e.sheetName]);
            e.source.name = e.name, e.source.type = e.type;
            // normal diffuse reference
            e._d = e.children[0];
            e._n = e.children[1];
            e._boundsMap = getReelBounds(e,true); // objSprite,fromMap
            //get basic session prop and also edit props that used in json compilator
            e.session =  getSession(e);
            e.session.alpha[1] = e.alpha;
            e.session.tint[1] = PIXI.utils.hex2string(e._d.tint).replace("#", "0x");
            e.session.autoDisplayGroup[1] = e.autoDisplayGroup;
            create_debugElements(e);
            render_debugElements(e);
        });
        TilesMap._objLight.forEach(e => {
            // asign source
            e.source = create_lightSource(e.name);
            //get basic session prop and also edit props that used in json compilator
            e.session =  getSession(e);
            e.session.color[1] = PIXI.utils.hex2string(e.color).replace("#", "0x");
            create_debugElements_light(e);
            e._boundsMap = getReelBounds(e,true); // objSprite,fromMap
            render_debugElements(e);
        });
        // check case and create debug element for editor
        for (let i = 0, l = TilesMap._objSprites.length; i < l; i++) {
            const element = TilesMap._objSprites[i];
            if(element._isCase){
                CaseObjList.push(element);
            };
        };
        CaseObjList.forEach(e => {
            for (let i = 0, l = e.connectPath.length ; i <l; i++) {
                const id = e.connectPath[i];
                e.connectPath[i] = CaseObjList[id];
            }
        });
        CaseObjList.forEach(e => {
            for (let i = 0, l = e.connectPath.length ; i < l; i++) {
                const cuCase = e;
                const neCase = cuCase.connectPath[i];
                if(neCase){
                    create_debugPath(e,neCase,true); // true: dont clear value
                };
            };
        });
    })();
    //#endregion

    //#region [rgba(250, 250, 180,0.05)]
    // ┌------------------------------------------------------------------------------┐
    // METHOD SCOPED FOR EDITOR ONLY (POLYFILL)
    // └------------------------------------------------------------------------------┘

    // random hex color
    function hexColors() { return ('0x' + Math.floor(Math.random() * 16777215).toString(16) || 0xffffff) };

    // refresh all variable mouse
    function refreshMousePos(event) {
        // screen mouse
        mX = (event.pageX-Graphics._canvas.offsetLeft)/Graphics._realScale //Graphics.pageToCanvasX(event.pageX);
        mY = (event.pageY-Graphics._canvas.offsetTop)/Graphics._realScale //Graphics.pageToCanvasY(event.pageY);
        return Graphics.isInsideCanvas(mX, mY);
    };

    // Build Rectangles // x, y, w:width, h:height, c:color, a:alpha, r:radius, l_c_a:[lineWidth,colorLine,alphaLine]
    function drawRec(x, y, w, h, c, a, r, l_c_a) {
        const rec = new PIXI.Graphics();
            rec.beginFill(c||0xffffff, a||1);
            l_c_a && rec.lineStyle((l_c_a[0]||0), (l_c_a[1]||c||0x000000), l_c_a[2]||1);
            r && rec.drawRoundedRect(x, y, w, h, r) || rec.drawRect(x, y, w, h);
        return rec;
    };
    
    function drawLine(sXY,eXY,l,c,a){
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(l||2, c||0xffffff, a||1);
        return graphics.moveTo(sXY[0],sXY[1]).lineTo(eXY[0], eXY[1]).endFill();
    };

    function hitCheck(a, b){ // colision
        var ab = a._boundsMap._pad
        var bb = b._boundsMap
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    };

    // recovery session storage proprety or asign current proprety
    function getSession(objSprite){return JSON.parse($PME.storage.getItem(objSprite.source.name)) || setSession(objSprite, create_Proprety(objSprite) ) };
    function setSession(objSprite,proprety){$PME.storage.setItem(objSprite.source.name, JSON.stringify(proprety)); return getSession(objSprite)};

    // add create register default data sprite basic: [[def,def],[set,set]] or [def,set]
    function create_Proprety (objSprite){
        let proprety;
        if(objSprite.source.type==="light"){
            proprety = {
                blendMode:[1,1],
                lightHeight:[0.075,0.075],
                brightness:[1,1],
                drawMode:[4,4],
                color:['0xffffff' ,'0xffffff'],
                falloff:[[0.75,3,20] ,[0.75,3,20]],
            };
            if(objSprite.source.name === "DirectionalLight"){
                proprety.target = [[0,0],[0,0]];
            }else{
                proprety.radius = [Infinity,Infinity];
            }
        }else{
            proprety = {
                scale:[[1,1],[1,1]],
                skew:[[0,0],[0,0]],
                pivot:[[0,0],[0,0]],
                rotation:[0,0],
                alpha:[1,1],
                blendMode:[0,0],
                //illuminate:[true,true],
                tint:['0xffffff' ,'0xffffff'],
                //setDark:[[0,0,0] ,[0,0,0]],
                //setLight:[[1,1,1] ,[1,1,1]],
                autoDisplayGroup:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]],
            };
            // if spine obj ?
            if(objSprite.source.type ==="spineSheets"){
                const defaultAni = objSprite.spineData.findAnimation('idle') && 'idle' || objSprite.spineData.animations[0].name;
                Object.assign(proprety, {
                    defaultAni:[defaultAni,defaultAni],
                    startTime:['default','random'],
                    timeScale:[1,1],
                });
            }
        };

        // create actived case _props (for html editor case)
        const props = Object.keys(proprety);
        for (let [i,len] = [0,props.length]; i < len; i++) {
            proprety[`_${props[i]}`] = false;
        };
        return proprety;
    };

    function create_lightSource(type) {
    return {
            name:type,
            cat:"light",
            path:null,
            type:"light",
            data:null,
            normal:null,
        };
    };

    // creates a sheets PNG previews
    function create_SheetsPNG(source) {
        let texture;
        if(source.type==="tileSheets"){
            texture = PIXI.utils.TextureCache[`${source.name}_image`];
        };
        if(source.type==="spineSheets"){
            texture = PIXI.utils.TextureCache[`${source.name}_atlas_page_${source.name}.png`];
        };
        const sheetsPNG = new PIXI.Sprite(texture);
        sheetsPNG.anchor.set(0.5,0);
        return sheetsPNG;
    };
        
    // create a ObjSprite from a source (tileSheets,spine,tile)
    function create_ObjSprite(source,normal) {
        const name = source.name;
        const type = source.type;
        if(type==="tile"){ // create a tile
            const cage = new PIXI.Container();
                cage.source = source;
                cage.session = getSession(cage);
            if(normal){
                const texture_d = PIXI.utils.TextureCache[name];
                const sprite_d = new PIXI.Sprite(texture_d);
                const texture_n = PIXI.utils.TextureCache[`${name}_n`];
                const sprite_n = new PIXI.Sprite(texture_n);
                sprite_d.parentGroup = PIXI.lights.diffuseGroup;
                sprite_n.parentGroup = PIXI.lights.normalGroup;
                sprite_d.anchor.set(0.5,1); // Note: hack defaul position for all sprites not spine. (workflow)
                sprite_n.anchor.set(0.5,1); // Note: hack defaul position for all sprites not spine. (workflow)
                cage._d = sprite_d;
                cage._n = sprite_n;
                cage.addChild(sprite_d,sprite_n);
            }else{
                const texture = PIXI.utils.TextureCache[name];
                const sprite = new PIXI.Sprite(texture);
                sprite.anchor.set(0.5,1);
                cage.addChild(sprite);
            }
            create_debugElements(cage);
            refreshSpriteWith_session(cage, cage.session);
            update_debugElements(cage, cage.session);
            
            return cage;
        };
        if(type==="spineSheets"){ // create a spineSheets Obj
            //TODO:
            const spineData = $SLL.resource[name].spineData;
            let spine = new PIXI.spine.Spine(spineData);
            spine.convertToNormal(source.normal, normal);
           // const defaultAni = spineData.findAnimation('idle') && 'idle' || spineData.animations[0].name;
            //spine.state.setAnimation(0, defaultAni, true); // play animation
            spine.source = source;
            const session =  getSession(spine);
            spine.session = session;
            //refreshSpriteWith_session(spine,session);
            spine = create_debugElements(spine);
            return spine;
        };
        if(type==="tileSheets"){ // create a TileSheets Obj
            const texture = PIXI.utils.TextureCache[`${name}_image`];
            const sprite = new PIXI.Sprite(texture);
            sprite.anchor.set(0.5,1); // Note: hack defaul position for all sprites not spine. (workflow)
            sprite.source = source;
            return sprite;
        };
        if(type==="light"){ // create a light
            let light;
            if(name==="PointLight"){
                light =  new PIXI.lights.PointLight(0xffffff, 3);
             }else{//"DirectionalLight"
                light = new PIXI.lights.DirectionalLight(0xffffff, 1, new PIXI.Point (1600/2, 900/2));
             }
             light.source = source;
             light.session =  getSession(light);

              refreshSpriteWith_session(light, light.session);
              create_debugElements_light(light);
              return light;
        };
    };
    

    // update debug elements
    function update_debugElements(objSprite,session){
        const color = objSprite.debugElements.linePivot.graphicsData[0].lineColor
        objSprite.debugElements.linePivot.clear();
        objSprite.debugElements.linePivot.lineStyle(2, color, 0.6);
        objSprite.debugElements.linePivot.moveTo(0,0).lineTo(objSprite.pivot.x||0.1, objSprite.pivot.y).endFill();
        objSprite.debugElements.lineH.position.set(objSprite.pivot.x,objSprite.pivot.y);
    };

    // create debug elements for a sprite 
    function create_debugElements(CAGE) {
        const color =  hexColors();
        // draw BG Rectangle
        const cage_bg = drawRec(0, 0, CAGE.width, CAGE.height,'',0.3,14); // x, y, w, h, c, a, r, l_c_a
        // draw line
        const lineH = drawLine([0,0],[CAGE.width*3,0],4,color,0.8)
        const lineV = drawLine([0,0],[0,Scene_H*2],20,color,0.6)
        const linePivot = drawLine([0||1,0],[CAGE.pivot.x,CAGE.pivot.y],2,color,0.5); // arrow line to cirOrigin
        const cirOrigin = drawRec(0, 0, 16, 16, color, 0.6, 10); // x, y, w, h, c, a, r, l_c_a
        // text info
        const style1 = new PIXI.TextStyle({fill:color,letterSpacing:-1,lineJoin:"round",fontSize:12,stroke:"black",strokeThickness:6});
        const txtGroupe = new PIXI.Text(`${DisplayGroup_Selected.zIndex}`, style1);
        // asign groupe
        cage_bg.parentGroup = PIXI.lights.diffuseGroup;
        lineV.parentGroup = PIXI.lights.diffuseGroup;
        // setup element
        cage_bg.pivot.set(cage_bg.width/2,cage_bg.height);
        lineH.pivot.set(lineH.width/2,lineH.height/2);
        cirOrigin.pivot.set(cirOrigin.width/2,cirOrigin.height);
        lineV.pivot.set(0,lineV.height/2);
        txtGroupe.pivot.set(-1,4);
        //reference
        CAGE.debugElements = {
            txtGroupe:txtGroupe,
            linePivot:linePivot,
            lineH:lineH,
            lineV:lineV,
            cirOrigin:cirOrigin,
            cage_bg:cage_bg,
        };
        cirOrigin.addChild(txtGroupe);
        CAGE.addChild(linePivot,lineH,cirOrigin);
        return CAGE
    };
    
    // create debug elements for a light
    function create_debugElements_light(CAGE) {
        console.log('CAGE: ', CAGE);
        // draw line
        const lineH = drawLine([-50,0],[50, 0],3,CAGE.color,1)
        const lineV = drawLine([0,-50],[0, 50],3,CAGE.color,1)
        const linePivot = drawLine([0||1,0],[CAGE.pivot.x,CAGE.pivot.y],6,CAGE.color,1); // arrow line to cirOrigin
        const cirOrigin = drawRec(0, 0, 26, 26, CAGE.color, 1, 10); // x, y, w, h, c, a, r, l_c_a
        // text info
        const style1 = new PIXI.TextStyle({fill:0xffffff,letterSpacing:-1,lineJoin:"round",fontSize:12,stroke:"black",strokeThickness:6});
        const txtGroupe = new PIXI.Text(`${DisplayGroup_Selected.zIndex}`, style1);
        // icon
        const iconLight = new PIXI.Sprite(PIXI.utils.TextureCache[`thumb_icon_${CAGE.source.name}`]);
        iconLight.pivot.set(iconLight.width/2,iconLight.height/2);
        // setup element
        cirOrigin.pivot.set(cirOrigin.width/2,cirOrigin.height/2);
        txtGroupe.pivot.y = txtGroupe.height;
        //reference
        CAGE.debugElements = {
            lineH:lineH,
            lineV:lineV,
            txtGroupe:txtGroupe,
            linePivot:linePivot,
            cirOrigin:cirOrigin,
        };
        CAGE.lightIcon = iconLight;
        CAGE.addChild(linePivot,lineH,lineV,cirOrigin,iconLight,txtGroupe);
    };

          
    // Get a ratio for resize in a bounds
    function getRatio(obj, w, h) {
        if(obj.type==="spineSheets"){
            /*VGT = {x:vertices[0], y:vertices[1]}
            VGD = {x:vertices[2], y:vertices[3]}
            VRT = {x:vertices[4], y:vertices[5]}
            VRD = {x:vertices[6], y:vertices[7]}*/
            const slot = obj.skeleton.findSlot('size');
            const V = slot.attachment.vertices;
            const W = V[4]-V[0];
            const H = V[5]-V[1];
            let r = Math.min(w / W, h / H);
            return r>1 && 1 || r;
        }else{
            let r = Math.min(w / obj.width, h / obj.height);
            return r>1 && 1 || r;
        }
    };

    //get reel bounds obj from map 
    function getReelBounds(objSprite,fromMap){
        const mapX = ScrollX
        const mapY = ScrollY
        const pivX = objSprite.pivot && objSprite.pivot.x || 0;
        const pivY = objSprite.pivot && objSprite.pivot.y || 0;
        const memScale = TilesMap.scale.x;
        TilesMap.scale.set(1,1); // i know am weird !! but its more easy
        if(objSprite.source.type === "tile"){
            var _boundsMap =  objSprite._d.getBounds().clone();
        }else
        if(objSprite.source.type === "light"){
            var _boundsMap = objSprite.getBounds().clone();
        }else{ // spine TODO: wait popelyshev FIX

        }
        if(!fromMap){ // if exist allrealy on map, bound are ok.
            _boundsMap.x+=mapX,
            _boundsMap.y+=mapY;
        };
        _boundsMap._pad = _boundsMap.clone()
        _boundsMap._pad.pad(-_boundsMap.width/3,-_boundsMap.height/3);
        TilesMap.scale.set(memScale,memScale);
        return _boundsMap;
    };

    //#endregion


    //#region [rgba(219, 182, 2, 0.05)]

    // ┌------------------------------------------------------------------------------┐
    // IZITOAST DATA EDITOR
    // └------------------------------------------------------------------------------┘
    // create multi sliders light
    function createSlider_falloff(){
        //dark
        Cage_DataEditor.kc = new Slider("#kc", {  step: 0.01,value:0, min: 0.01, max: 1, tooltip: 'always' });
        Cage_DataEditor.kc.tooltip.style.opacity = 0.5;

        Cage_DataEditor.kl = new Slider("#kl", {step: 0.1,value:0, min: 0.1, max: 20, tooltip: 'always'});
        Cage_DataEditor.kl.tooltip.style.opacity = 0.5;

        Cage_DataEditor.kq = new Slider("#kq", {step: 0.01,value:0, min: 0.1, max: 50, tooltip: 'always'});
        Cage_DataEditor.kq.tooltip.style.opacity = 0.5;
    };

    function start_lightEditor(type){
        EditorOpen = true;
        close_GuiEditor();
        TileSheetsOpened && close_tileSheets();

         //show iziToast and create buttons
         iziT.info(iziT.dataEditor_light()); // id: "dataEditor"
         createSlider_falloff(); // create slider html for pixiHaven
        
         //attache a new input color module to html tint
        const jsColor = new jscolor(document.getElementById("color"));
            jsColor.zIndex = 9999999;
        let objLight = createObjLight(type);
        objLight.x = Scene_W/1.5
        objLight.y = Scene_H/2;
        objLight = create_debugElements_light(objLight);
        Cage_DataEditor.objSprite = objLight;
        Cage_DataEditor.jsColor = jsColor;
        Cage_DataEditor.addChild(objLight);
        update_dataEditor_light(objLight);
        InObjSprite = objLight;
    };

    // initialise dataEditor core for light
    function update_dataEditor_light(objLight){
        const name = objLight.name;
        let session = getSession(objLight); // session (final data)
        // refresh
        refreshHtmlWith_session(session);// asign session value to html input
        refreshSpriteWith_session(objLight,session);// asign session value to sprite obj

        // Listener for dataEditor
        const dataIntepretor = document.getElementById("dataIntepretor");
        dataIntepretor.onchange = function(event){ // click on a input checkbox
            if(event.target.type !== "checkbox"){return};
            const element = event.target;
            const key = element.id;
            if(key.indexOf("_")>-1){ // ts a checkBox
                const value = element.checked;
                refreshSessionWith_html(session,key,value);
                refreshSpriteWith_session(objLight,session);
            };
             // for color mode jsColor
            const mode = document.getElementById("tint_mode").checked && "HVS" || "HSV";
            Cage_DataEditor.jsColor.mode = mode;
        };

        dataIntepretor.oninput = function(event){ // click on a input
            const element = event.target;
            const value = element.value;
            const key = element.id;
            const key2 = element.attributes.id2 && Number(element.attributes.id2.value); //array id
            let lock;
            if(element.attributes.id2){// if is a array props, look for ratioLock
                let step = Number(value)-session[key][1][key2];
                lock = document.getElementById(`${key}_lock`).checked;
                if(lock){
                    const isKeyboard = event.data || false;
                    isKeyboard && (step=value);
                    refreshSessionWith_html(session,key,step,(~~!key2),!isKeyboard);
                }
            }
            refreshSessionWith_html(session,key,value,key2);
            refreshSpriteWith_session(objLight,session);
            if(lock){
                refreshHtmlWith_session(session);
            }
        };
       
        // JSCOLOR
        Cage_DataEditor.jsColor.onFineChange = function(){
            refreshSessionWith_html(session,"color", `0x${this.targetElement.value}`);
            refreshSpriteWith_session(objLight,session);
        };
        
        iziT.kc.on("slide", function(value) {
            refreshSessionWith_html(session,"falloff", value, 0);
        });
        iziT.kl.on("slide", function(value) {
            refreshSessionWith_html(session,"falloff", value, 1);
           
        });
        iziT.kq.on("slide", function(value) {
            refreshSessionWith_html(session,"falloff", value, 2);
        });
        // BUTTONS
        dataIntepretor.onclick =function(event){ //check if html checkbox change?
            if(event.target.type !== "button"){return};
            const T = event.target; // buttons
            if(T.type === "button"){
                if(T.id==="apply"){ close_dataEditor_light(true,session) };// apply and close
                if(T.id==="applyAll"){  };// apply to all and close
                if(T.id==="cancel"){ close_dataEditor_light(false,session) };// cancel and close
                if(T.id==="reset"){ // reset session cache and data
                    $PME.storage.removeItem(name);
                    session = getSession(objLight); // session (final data)
                    // refresh
                    refreshHtmlWith_session(session);// asign session value to html input
                    refreshSpriteWith_session(objLight,session);// asign session value to sprite obj
                 };
            };
        };
    };

    // ┌------------------------------------------------------------------------------┐
    // IZITOAST DATA EDITOR
    // └------------------------------------------------------------------------------┘
    // open the dataEditor html
    function open_dataEditor(CAGE){
        EditorOpen = true;
        close_GuiEditor(), close_tileSheets();
        const light = typeof CAGE === "string" && { source:create_lightSource(CAGE) };
        let objSprite;
        if(!light){ // tile,spine
            TilesMap.map_d.parentGroup._activeLayer._filters = [$PME.filters[1]];
            iziT.info(iziT.dataEditor(CAGE)); // id:"dataEditor"
            objSprite = create_ObjSprite(CAGE.source, false);
                objSprite.x = Scene_W-(Scene_W/2/2);
                objSprite.y = Scene_H-(Scene_H/4);
        }else{ //light
            iziT.info(iziT.dataEditor_light());
            createSlider_falloff(); // create slider html for pixiHaven
            objSprite = create_ObjSprite(light.source, false);
                objSprite.x = Scene_W/1.5
                objSprite.y = Scene_H/2;
        }
        // create a new preview sprite for help editData (without normal)
        const cage_Debug = new PIXI.Container(); // related to Cage_Mouse but for editor
         //attache a new input color module to html tint
        const jsColor = new jscolor(document.getElementById(!light&&"tint"||"color"));
            jsColor.keyName = !light&&"tint"||"color";
            jsColor.zIndex = 9999999;
        Cage_DataEditor.jsColor = jsColor;
        // Text title name,type for dataEditor
        const style = new PIXI.TextStyle({fill:"#ff8000",fontSize:20,letterSpacing:-1,lineJoin:"round",strokeThickness:7});
        const txt = `(live compute rendering) for ${!light&&CAGE.source.name||light.source.name} Type: ${!light&&CAGE.source.type||light.source.type}`;
        const txtSprite = new PIXI.Text(txt, style);
            txtSprite.pivot.set(txtSprite.width/2,txtSprite.height/2)
            txtSprite.x = Scene_W-(Scene_W/2/2);
            txtSprite.y = txtSprite.height;
        if(!light){ // tile,spine
            cage_Debug.addChild(objSprite.debugElements.lineV, objSprite);
        }else{
            cage_Debug.addChild(objSprite);
        };
        Cage_DataEditor.addChild(cage_Debug);
        InObjSprite = objSprite;
        start_dataEditor(objSprite);
    };

    // initialise update dataEditor
    function start_dataEditor(objSprite){
        let session = getSession(objSprite); // session (final data)
        // refresh
        refreshHtmlWith_session(session);// asign session value to html input
        refreshSpriteWith_session(objSprite,session);// asign session value to sprite obj
        
        // Listener for dataEditor
        const dataIntepretor = document.getElementById("dataIntepretor");
        dataIntepretor.onchange = function(event){ // click on a input checkbox
            if(event.target.type !== "checkbox"){return};
            const _reelZoom = document.getElementById('reelZoom').checked;
            refreshSessionWith_html(session);
            refreshSpriteWith_session(objSprite,session,[_reelZoom]);
             // for color mode jsColor (refresh)
            const mode = document.getElementById("tint_mode").checked && "HVS" || "HSV";
            Cage_DataEditor.jsColor.mode = mode;
        };

        dataIntepretor.oninput = function(event){ // click on a input
            const element = event.target;
            document.getElementById(`_${element.id}`).checked = true; // force check case
            const is2D =  !!element.attributes.id2; // isArray
            const lock = is2D && document.getElementById(`${element.id}_lock`).checked;
            if(is2D && lock){
                const arrId = Number(element.attributes.id2.value);
                const arrId_reversed = ~~!Number(element.attributes.id2.value);
                const value = Number(element.value);
                const key = element.id; // prop name
                var listE = document.querySelectorAll(`#${element.id}`); // list elements
                var e = listE[arrId_reversed];
                if(!event.data){
                    var isIncrease = (value-session[key][1][arrId])>0;
                    if(isIncrease){e.stepUp()}
                    else{e.stepDown()};
                }else{
                    e.value = value;
                };
            };
            refreshSessionWith_html(session);
            const _reelZoom = document.getElementById('reelZoom').checked;
            refreshSpriteWith_session(objSprite,session,[_reelZoom]);
 
        };

        // JSCOLOR
        Cage_DataEditor.jsColor.onFineChange = function(){
            const key = Cage_DataEditor.jsColor.keyName;
            document.getElementById(`_${key}`).checked = true; // force check case
            refreshSessionWith_html(session);
            const _reelZoom = document.getElementById('reelZoom').checked;
            refreshSpriteWith_session(objSprite,session,[_reelZoom]);
        };
        if(objSprite.source.type === "light"){
            Cage_DataEditor.kc.on("slide", function(value) {
                refreshSessionWith_html(session,"falloff", value, 0);
                const _reelZoom = document.getElementById('reelZoom').checked;
                refreshSpriteWith_session(objSprite,session,[_reelZoom]);
            });
            Cage_DataEditor.kl.on("slide", function(value) {
                refreshSessionWith_html(session,"falloff", value, 1);
                const _reelZoom = document.getElementById('reelZoom').checked;
                refreshSpriteWith_session(objSprite,session,[_reelZoom]);
               
            });
            Cage_DataEditor.kq.on("slide", function(value) {
                refreshSessionWith_html(session,"falloff", value, 2);
                const _reelZoom = document.getElementById('reelZoom').checked;
                refreshSpriteWith_session(objSprite,session,[_reelZoom]);
            });
        }
        // BUTTONS
        dataIntepretor.onclick =function(event){ //check if html checkbox change?
            if(event.target.type !== "button"){return};
            const T = event.target; // buttons
            if(T.type === "button"){
                if(T.id==="apply"){ close_dataEditor(true,session) };// apply and close
                if(T.id==="applyAll"){  };// apply to all and close
                if(T.id==="cancel"){ close_dataEditor(false,session) };// cancel and close
                if(T.id==="reset"){ // reset session cache and data
                    $PME.storage.removeItem(objSprite.source.name);
                    session = getSession(objSprite); // session (final data)
                    // refresh
                    refreshHtmlWith_session(session);
                    const _reelZoom = document.getElementById('reelZoom').checked;
                    refreshSpriteWith_session(objSprite,session,[_reelZoom]);
                 };
            };
        };
    };

    // assign to session, html value
    function refreshSessionWith_html(session){
        const sessionKeys = Object.keys(session);
        sessionKeys.forEach(key => {
            switch (key) {
                case"scale":case"skew":case"pivot":case"anchor":
                    document.querySelectorAll(`#${key}`).forEach(e => {
                            var value = e.value;
                            var arrId = e.attributes.id2.value;
                            session[key][1][arrId] = Number(value);
                        });
                break;
                case"rotation":case"alpha":case"blendMode":
                case"defaultSkin":case"defaultAni":case"timeScale":case"startTime":
                case"lightHeight":case"brightness":case"drawMode":case"radius"://light
                    var value = document.getElementById(`${key}`).value;
                    session[key][1] = !isFinite(value) && value || Number(value);
                break;
                case"tint":case"color":
                    var value = `0x${document.getElementById(`${key}`).value}`;
                    session[key][1] = value;
                break;
                case"falloff":
                    session[key][1] = [+Cage_DataEditor.kc.getValue(),+Cage_DataEditor.kl.getValue(),+Cage_DataEditor.kq.getValue()];
                break;
                case"autoDisplayGroup":
                    for (let i = session[key][1].length; i--;) {
                        var value = document.getElementById(`AD${i}`).checked
                        session[key][1][i] = value;
                    };
                break;
                case"setDark":case"setLight":
                    // TODO:
                break;
                default://_checkBox
                    var value = document.getElementById(`${key}`).checked;
                    session[key] = value;
                break;
            };
        });
    };

    // asign to html , with a single props value
    function refreshHtmlWith_props(props){
        let key;
            if(Array.isArray(props[0])){
                key = props[0][0];
                e = document.querySelectorAll(`#${key}`);
                for (let i =  e.length; i--; ) { 
                    e[i].value = props[i][1];
                };
            }else{
                key = props[0];
                document.getElementById(`${key}`).value = +props[1];
            };
        document.getElementById(`_${key}`) && (document.getElementById(`_${key}`).checked = true); // force check case
    };

    // asign to html , session value
    function refreshHtmlWith_session(session){
        let value, element, e;
        for (const key in session) {
            if( Array.isArray(session[key]) ){ value = session[key][1] }
            else{ value = session[key] };
            switch (key) {
                case"scale":case"skew":case"pivot":case"anchor":
                    e = document.querySelectorAll(`#${key}`);
                    for (let i = e.length; i--; ) {
                        e[i].value = value[i];
                    };
                break;
                case"rotation":case"alpha":case"blendMode":
                case"defaultSkin":case"defaultAni":case"timeScale":case"startTime":case"defaultSkin":
                case"lightHeight":case"brightness":case"drawMode":
                    e = document.getElementById(`${key}`);
                    e && (e.value = value); // TODO:illuminate
                break;
                case"tint":case"color": 
                    e = document.getElementById(`${key}`);
                    e.value = value.substr(2);
                    e.style.backgroundColor = '#' + value.substr(2);
                break;
                case"autoDisplayGroup":
                    for (let i = value.length; i--;) {
                        e = document.getElementById(`AD${i}`)
                        e.checked = value[i];
                    };
                break;
                case"setDark":case"setLight":
                    // TODO:
                break;
                case"falloff":
                    Cage_DataEditor.kc.setValue(value[0]);
                    Cage_DataEditor.kl.setValue(value[1]);
                    Cage_DataEditor.kq.setValue(value[2]);
                break;
                case"radius":
                    e = document.getElementById(`${key}`);
                    e.value = Number(value);
                   
                break;
                default://_checkBox
                    e = document.getElementById(`${key}`);
                    e && (e.checked = value);
                break;
            };
        };
    };

    // assign to sprite, session value
    function refreshSpriteWith_session(objSprite,session,paraCase=[]){ // paraCase: reelZoom
        for (const key in session) {
            if(key.indexOf("_") > -1){continue}; // jump prop case _checkBox
            const checked = Number(session[`_${key}`]);
            const value = session[key][checked]; // get default or current
            switch (key) {
                case"scale":case"skew":case"pivot":case"anchor"://sprite
                    objSprite[key].set(value[0],value[1]);
                    if(key==="pivot"){
                        update_debugElements(objSprite,session)
                    };
                    // if need to reelZoom
                    if(key==="scale" && paraCase[0] && paraCase[0].checked){
                        objSprite[key].set(value[0]*Zoom.x,value[1]*Zoom.y);
                    };
                break;
                case"rotation":case"alpha"://sprite
                case"lightHeight":case"brightness":case"color":case"drawMode":
                    objSprite[key] = +value;
                break;
                case"falloff":
                    objSprite[key] = value; // arr
                break;
                case"tint":case"blendMode":
                if(objSprite.source.type === "light"){
                    objSprite[key] = +value; // blendMode for light set in parent
                }else{
                    objSprite.children[0][key] = +value;
                }
                break;
                case"radius":
                    objSprite[key] = value && value || Infinity; 
                break;
                case"autoDisplayGroup":
                    // TODO:
                break;
                case"setDark":case"setLight":
                    // TODO:
                break;
                case"defaultSkin":
                 // TODO:
                break;
                case"startTime":
                    // TODO:
                break;
                case"defaultAni":
                const current =  objSprite.state.getCurrent(0);
                if(!current || current.animation.name !== value){
                    objSprite.state.setAnimation(0, value, true);
                }
                break;
                case"timeScale":
                if(objSprite.state.tracks[0]){
                    objSprite.state.tracks[0].timeScale = value;
                }
                break;
            };
        };
    };


    // close the dataEditor
    function close_dataEditor(save,session){
        if(save){
            refreshSessionWith_html(session);
            setSession(InObjSprite,session);
            InObjSprite.session = session;
        }
        add_toMouse(InObjSprite);
        TilesMap.map_d.parentGroup._activeLayer._filters = [];
        delete Cage_DataEditor.cage;
        delete Cage_DataEditor.objSprite;
        delete Cage_DataEditor.jsColor;
        delete Cage_DataEditor.darkR, delete Cage_DataEditor.darkG, delete Cage_DataEditor.darkB;
        delete Cage_DataEditor.lightR, delete Cage_DataEditor.lightG, delete Cage_DataEditor.lightB;

        Cage_DataEditor.removeChildren();
        iziT.hide({transitionOut: 'flipOutX'}, document.getElementById("dataEditor") );
        EditorOpen = false;
    };

    // close the dataEditor
    function close_dataEditor_light(save,session){
        if(save){
            setSession(InObjSprite,session);
            InObjSprite.session = session;
            
        }
        add_toMouse(InObjSprite);
        delete Cage_DataEditor.cage;
        delete Cage_DataEditor.objSprite;
        delete Cage_DataEditor.jsColor;
        
        Cage_DataEditor.removeChildren();
        iziT.hide({transitionOut: 'flipOutX'}, document.getElementById("dataEditor") );
        EditorOpen = false;
    };

// initialise the save option gui
    function start_saveEditor(){
        scrollAllowed = false;
        EditorOpen = true;
        close_GuiEditor();
        TileSheetsOpened && close_tileSheets();
         //show iziToast and create buttons
         iziT.info(iziT.dataEditor_save()); // id: "dataEditor"
        // BUTTONS
        dataIntepretor.onclick = function(event){ //check if html checkbox change?
            if(event.target.type !== "button"){return};
            const T = event.target; // buttons
            if(T.type === "button"){
                if(T.id==="export"){
                    iziT.hide({transitionOut: 'flipOutX'}, document.getElementById("dataEditor") );
                    EditorOpen = false;
                    iziT.info(iziT.libs_saveProgress());
                    const options = {
                        r_paraRmmv:document.getElementById("r_paraRmmv").checked,
                    }
                    compute_export(options);
                };
                if(T.id==="cancel"){
                    show_GuiEditor();
                    TileSheetsOpened && show_tileSheets();
                    iziT.hide({transitionOut: 'flipOutX'}, document.getElementById("dataEditor") );
                    EditorOpen = false;
                    scrollAllowed = true;
                };
            };
        };
    };

    //#endregion

        //#region [rgba(100, 5, 0,0.08)]
    // ┌------------------------------------------------------------------------------┐
    // SAVE COMPUTE JSON
    // └------------------------------------------------------------------------------┘
    function compute_export(options) {
        console.log('options: ', options);
        if(options.r_paraRmmv){ // Rendering parralaxe for RMMV?
         //   snapMap(options); // TODO: wait for ivan
        }
        create_jsonData(options);
    }

    function spriteToJson(e) { // RENDU ICI VERIFIER CE QUI CLOCHE , ET FORCER LE ZOOM
        const json = {
            name: e.source.name,
            sheetName: e.source.sheetName,
            type: e.source.type,
            cat: e.source.cat,
            x: e.x,
            y: e.y,
            rotation: e.rotation,
            alpha: e.alpha,
            blendMode: e.blendMode,
            tint: e.session._tint && e.session.tint[1] || e.session.tint[0],
            scale: [e.scale.x, e.scale.y],
            skew: [e.skew.x, e.skew.y],
            pivot: [e.pivot.x, e.pivot.y],
            autoDisplayGroup: e.session._autoDisplayGroup && e.session.autoDisplayGroup[1] || e.session.autoDisplayGroup[0],
            parentGroup: e.parentGroup.zIndex,
            zIndex: e.zIndex,
        }
        if(e.source.type ==="spineSheets"){
            Object.assign(json_tile,{
                defaultAni: e.session.defaultAni[1],
                startTime: e.session.startTime[1],
                timeScale: e.session.timeScale[1],
            });
        };
        if( isFinite(e._caseID) ){
            json._caseID = e._caseID;
            json.connectPath = [];
            e.connectPath && e.connectPath.forEach(E => {
                const id = E._caseID;
                json.connectPath.push(id);
            });
            json._caseID = e._caseID;
        }
        return json;
    };

    function lightToJson(e) {
        const json = {
            name: e.source.name,
            type: e.source.type,
            cat: e.source.type,
            x: e.x,
            y: e.y,
            alpha: e.alpha,
            blendMode: e.blendMode,
            color: e.session._color && e.session.color[1] || e.session.color[0],
            drawMode: e.drawMode,
            brightness: e.brightness,
            lightHeight: e.lightHeight,
            falloff: e.falloff,
            radius: isFinite(e.radius) && e.radius || Infinity,
        }
        return json;
    };

    function create_jsonData(options) {
        const data = [];
        TilesMap._objSprites.forEach(e => {
            const d = spriteToJson(e);
            data.push(d);
        });
        TilesMap._objLight.forEach(e => {
            const d = lightToJson(e);
            data.push(d);
        });
        const path = `data/Map${$gameMap._mapId.padZero(3)}_sprites.json`; // Map001_sprites.json
        const fs = require('fs');
        const content = JSON.stringify(data, null, '\t'); //human read format
        fs.writeFile(path, content, 'utf8', function (err) { 
            if(err){return console.log(err) }
            console.log('complette: ', err);
        });
   };

    function snapMap(options) {
        const fs = require('fs');
        const pathName = `img/parallaxes/${$dataMap.parallaxName}.png`;
        const snap = Bitmap.snap2(Scene);
        const urlData = snap._canvas.toDataURL();
        const base64Data = urlData.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(pathName, base64Data, 'base64', function(error){
            if (error !== undefined && error !== null) {  console.error('An error occured while saving the screenshot', error); } 
        });

   };

   Bitmap.snap2 = function(stage) {
    var width =  $dataMap.width*48;
    var height = $dataMap.height*48;
    var bitmap = new Bitmap(width, height);
    var context = bitmap._context;
    var renderTexture = PIXI.RenderTexture.create(width, height);
    if (stage) {
        Renderer.render(stage, renderTexture);
        stage.worldTransform.identity();
        var canvas = null;
        if (Graphics.isWebGL()) {
            canvas = Renderer.extract.canvas(renderTexture);
        } else {
            canvas = renderTexture.baseTexture._canvasRenderTarget.canvas;
        }
        context.drawImage(canvas, 0, 0);
    } else {

    }
    renderTexture.destroy({ destroyBase: true });
    bitmap._setDirty();
    return bitmap;
};
    //#endregion


    //#region [rgba(10, 80, 10,0.08)]
    // ┌------------------------------------------------------------------------------┐
    // BUTTONS CLASS
    // └------------------------------------------------------------------------------┘


    //#endregion


    //#region [rgba(100, 80, 100,0.08)]
    // ┌------------------------------------------------------------------------------┐
    // METHOD SCOPED
    // └------------------------------------------------------------------------------┘

    // get or create new proprety localStorage
    function Get_Proprety(type){
        const proprety = { // basic: ['def'[x,y], 'asign'[x,y]]
            scale:[[1,1],[1,1]],
            skew:[[0,0],[0,0]],
            pivot:[[0,0],[0,0]],
            anchor:[[0.5,1],[0.5,1]],
            rotation:[0,0],
            alpha:[1,1],
            tint:['0xffffff' ,'0xffffff'],
            //setDark:[[0,0,0] ,[0,0,0]],
            //setLight:[[1,1,1] ,[1,1,1]],
            autoDisplayGroup:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
            // zIndexMode:[false,'Y','Y'], //TODO:
            // parentGroup:[false,'Y','Y'], //TODO:
        };
        // if is spine
        if(type==="spinesheets"){
            const defaultAni = objSprite.spineData.findAnimation('idle') && 'idle' || objSprite.spineData.animations[0].name;
            Object.assign(proprety, {
                defaultAni:[defaultAni,defaultAni],
                startTime:['default','random'],
                timeScale:[1,1],
            });
        };
        // create actived case _props
        const props = Object.keys(proprety);
        for (let [i,len] = [0,props.length]; i < len; i++) {
            proprety[`_${props[i]}`] = false; // case mode, list[i]:name
        };
        return proprety;
    };

    // refresh objLibrary thumbails
    function refreshLibs(){
        Cage_Libs.removeChildren(); // clear libs render
        //TODO: MAKE FILTERS for _cat _type
        let list = $PME.objLibrary;
        for (let i=x=y=l= 0, disX= 50, len = list.length; i < len; i++) {
            const cage = list[i];
            cage.x = x, cage.y = y;
            Cage_Libs.addChild(cage);
            cage.getBounds();
            if(!(~i%~5)){ x=0, y+=cage.height+disX}
            else{ x+=cage.width+disX };
        };
    };
    

    // Check if mouse are inside SLOTS buttons?
    function checkInButtons(){
        let isIN = false;
        // is Inside a slots Editor
        for (const name in ButtonsSlots) {
            const slot = ButtonsSlots[name];
            if(!isIN && slot.boundRec.contains(mX,mY)){
                if(slot===InButtons){return InButtons};
                slot.currentSprite.alpha = 0.4;
                AudioManager.playSe({name: "click", pan: 0, pitch: 50, volume: 70});
                slot.currentSprite.scale.set(1.20,-1.20);
                isIN = slot;
            }else{
                slot.currentSprite.alpha = 1;
                slot.currentSprite.scale.set(1,-1);
            };
        };
        return isIN;
    };
    
    // Check if mouse are inside a LIBRARY obj from libs gui or tile gui?
    function checkIn(CAGE,TARGET){
        if(!CAGE.mask._boundsRect.contains(mX,mY)){return};// not in mask? dont check
        let isIN = false;
        const list = CAGE.children;
        for (let i = 0, l = list.length; i < l; i++) {
            const cage = list[i];
            if(cage._boundsRect.contains(mX,mY)){
                if(cage===TARGET){return TARGET}; // TARGET: inLibs, inTile..
                cage.cage_bg.alpha = 1;
                cage._filters = [$PME.filters[0]];
                cage.objSprite._filters = [$PME.filters[0]];
                AudioManager.playSe({name: "click", pan: 0, pitch: 50, volume: 70});
                isIN = cage;
                if(cage.objSprite.sheetsPNG){ // if in a obj that have sheetsPNG, showit
                    Cage_SheetsPNG.children = [];
                    const sheetsPNG = cage.objSprite.sheetsPNG;
                    Cage_SheetsPNG.cage_bg.width = sheetsPNG.width;
                    Cage_SheetsPNG.cage_bg.height = sheetsPNG.height;
                    Cage_SheetsPNG.addChild(Cage_SheetsPNG.cage_bg, sheetsPNG);
                    Cage_SheetsPNG.pivot.x=-Cage_SheetsPNG.width/2;
                    Cage_SheetsPNG.renderable = true;
                }else{
                    const title = `${cage.source.name}:  ${cage.cage_bg.width}*${cage.cage_bg.height}`
                    Cage_LibsTiles.title.text = title;
                }
            }else{
                cage._filters = null;
                cage.objSprite._filters = null;
                cage.cage_bg.alpha = 0.4;
            };
        };
        return isIN;
    };


    function checkInPath(list){
        const x = (mX/Zoom.x)+ScrollX, y = (mY/Zoom.y)+ScrollY;
        for (let i = 0, l=list.length; i < l; i++) {
            const e = list[i];
            if(e._boundsMap._pad.contains(x, y)) {
                e._d._filters = [$PME.filters[2]];
                return e;
            };
        }
    }

    // Check if mouse are inside a obj in Map
    function checkInMap(list){ // TilesMap._objSprites
        const x = (mX/Zoom.x)+ScrollX, y = (mY/Zoom.y)+ScrollY;
        if(InObjMap){
            // clear all
            if(!InObjMap._boundsMap.contains(x, y)){ //hoverOut, clear
                InObjMap.debugElements_Rendered.renderable = false;
                for (let i = 0, l=list.length; i < l; i++) {
                    const e = list[i];
                    switch (e.source.type) {
                        case "spineSheets":
                            for (let i = 0, l = e.list_d.length; i < l; i++) {
                                e.list_d[i]._filters = null;
                            };
                            e.alpha = 1;
                            e.blendMode = 0;
                            break;
                        case "tile":
                            e._d._filters = null;
                            e._n.tint = 0xffffff;
                            e.alpha = 1;
                            e.blendMode = 0;
                        break;
                        case "light":
                            e.alpha = 1;
                            e.children[0]._filters = null;
                        break;
                    };
                };
                return false;
            };
            return InObjMap; //keep hover, do nothing
        }
        // inside
        let subList;
        let isIN;
        for (let i = 0, l=list.length; i < l; i++) {
            const e = list[i];
            if(e._boundsMap._pad.contains(x, y)) {
                isIN = e;
                if(e.source.spineData){
                    for (let i = 0, l = e.list_d.length; i < l; i++) {
                        e.list_d[i]._filters = [$PME.filters[2]];
                    };
                }else
                if(e.source.type === "light"){
                    e.debugElements_Rendered._filters = [$PME.filters[2]];
                }else{
                    e._d._filters = [$PME.filters[2]];
                }
                subList = list.concat();
                subList.splice(i, 1);
                e.debugElements_Rendered.renderable = true;
                break;
            };
        };
        // hit check for alpha near object
        if(isIN){
            for (let i = 0, l=subList.length; i < l; i++) {
                const e = subList[i];
                if(e.source.type === "light"){
                    e.alpha = 0.4;
                }else
                if(hitCheck(isIN,e)&&e.zIndex>isIN.zIndex){
                    e.alpha = 0.2;
                    e.blendMode = 1;
                    e._d._filters = [$PME.filters[2]];
                    e._n.tint = 0x000000;
                    
                    //!e.spineData && (e.children[0]._filters = [$PME.filters[1]]);
                };
            };
        };

        return isIN;
    };


    // show bottom edtitor gui
    function show_GuiEditor(){
        Cage_Libs.renderable = true;
        Cage_SheetsPNG.renderable = true;
        $PME.editorGui.state.setAnimation(1, 'show', false);
    };

    // show tilesheets gui
    function show_tileSheets(clear){
        if(clear){  Cage_LibsTiles.children = [] };
        TileSheetsOpened = true;
        Cage_LibsTiles.renderable = true;
        $PME.editorGui.state.setAnimation(2, 'show_tileScreen', false);
    };

    // close tilesheets gui
    function close_tileSheets(clear){
        Cage_LibsTiles.renderable && $PME.editorGui.state.setAnimation(2, 'hide_tileScreen', false);
        if(clear){
            Cage_LibsTiles.children = [];
            TileSheetsOpened = false;
            clear.opened = false;
        };
        Cage_LibsTiles.renderable = false;
    };
    
    // clear bottom edtitor gui
    function close_GuiEditor(){
        Cage_Libs.renderable && $PME.editorGui.state.setAnimation(1, 'hide', false);
        Cage_Libs.renderable = false;
        Cage_SheetsPNG.renderable = false;
        Cage_SheetsPNG.children = [];
        // close tileSheet gui if opened, but memorise it was opened
        TileSheetsOpened && close_tileSheets();
    };

    // clear mouse Container
    function clear_mouseObj(clear){
        Cage_Mouse.children = [];
        delete Cage_Mouse.objSprite;
        clear && (InObjSprite = false);
    };

    // update QuickEdit proprety mode 
    function update_quickEditMode(CAGE){
        const D = 45; // distance margin for active a mode (malus)
        const difX = mX-memX;
        const difY = mY-memY;
        let angle = Math.atan2(difY, difX);
        const kX = CAGE.skew._x*difX; // skew for help compute pivot ?
        const kY = CAGE.skew._y*difY; // skew for help compute pivot ?
        // angle = Math.radians(angle *180);
        // wait move mouse in a direction margin for identify wich quick mode
        if(!QuickEditMode){
            if(CAGE.source.type === "light"){
                QuickEditMode = difX>D&&'brightness'||difX<-D&&'lightHeight'||difY>D&&'target'||difY<-D&&'radius'||false;
            }else{
                QuickEditMode = difX>D&&'rotation'||difX<-D&&'scale'||difY>D&&'skew'||difY<-D&&'pivot'||false;
            }
        }else{
            switch (QuickEditMode) {
                case 'target':
                    if(!CAGE.target){break};
                    CAGE.target.x = (mX/Zoom.x)+ScrollX, CAGE.target.y = (mY/Zoom.y)+ScrollY;
                break;
                case 'radius':
                    CAGE.radius=(D-difY)/1000;
                    if((D-difY)/1000<0){CAGE.radius = Infinity }
                break;
                case 'brightness':
                    CAGE.brightness=-(D-difX)/10;
                break;
                case 'lightHeight':
                    CAGE.lightHeight=(D-difX)/1000;
                break;
                case 'rotation':
                    CAGE.rotation=(angle);
                    CAGE.debugElements.cirOrigin.rotation = -CAGE.rotation
                break;
                case 'scale':
                    CAGE.scale.set(-((difX-D)/100),(D-difY)/100);
                    CAGE.debugElements.lineH.scale.set(1/CAGE.scale._x,1/CAGE.scale._y);
                    CAGE.debugElements.cirOrigin.scale.set(1/CAGE.scale._x,1/CAGE.scale._y);
                break;
                case 'skew':
                    CAGE.skew.set((D-difX)/100,(difY-D)/100);
                break;
                case 'pivot':
                    if(CAGE.name === "DirectionalLight"){ //obj is light: TODO: find a way to play with target 
                        CAGE.target.x = (mX/Zoom.x)+ScrollX, CAGE.target.y = (mY/Zoom.y)+ScrollY;
                        return;
                    }
                    CAGE.pivot.set((difX*-1)/CAGE.scale._x+kY,(difY*-1)/CAGE.scale._y+kX)
                    update_debugElements(CAGE);
                break;
            };
        };
        if(CAGE.source.type === "light"){ // update session for light because not follow scale scene
            CAGE.session.brightness[1] = CAGE.brightness;
            CAGE.session.lightHeight[1] = CAGE.lightHeight;
            CAGE.radius && (CAGE.session.radius[1] = CAGE.radius);
        }
        if(EditorOpen && QuickEditMode){ // if the open_dataEditor => refreshHtmlWith_session
            switch (QuickEditMode) {
                case 'pivot':case 'skew':case 'scale':
                    refreshHtmlWith_props([
                        [QuickEditMode,CAGE[QuickEditMode].x],
                        [QuickEditMode,CAGE[QuickEditMode].y],
                    ]);
                break;
                default:
                console.log('a', [QuickEditMode,CAGE[QuickEditMode]] );
                    refreshHtmlWith_props([QuickEditMode,CAGE[QuickEditMode]]);
                    
                    
                break;
            }
        }
    };
    // update the preview PNG sheets
    function update_SheetsPNG(){
        if(Inlibs){
            Cage_SheetsPNG.x = mX-(mX/2);
            Cage_SheetsPNG.y = mY-(Cage_SheetsPNG.height+100);
        }else{
            Cage_SheetsPNG.renderable = false;
        };
    };

    // update the preview PNG sheets rendering
    function update_scrollLibrary(){
        LastGuiFocused = Inlibs && Inlibs.parent || InTile && InTile.parent || LastGuiFocused;
        if(MouseHold){
            switch (LastGuiFocused.name) {
            case "Cage_Libs":
                if(!LastGuiFocused.scrolled){
                    if(TileSheetsOpened){// hide Cage_LibsTiles if exist
                        Cage_LibsTiles.renderable = false; 
                        $PME.editorGui.state.setAnimation(2, 'hide_tileScreen', false);
                        
                    }
                    $PME.editorGui.state.setAnimation(1, 'scrollLibrary', false);
                    LastGuiFocused.mask.height = 145*4;
                    LastGuiFocused.scrolled = true;
                }
                LastGuiFocused.y+= event.movementY*0.8;//performe scroll libs mouse 
            break;
            case "Cage_LibsTiles":
                if(!LastGuiFocused.scrolled){
                    LastGuiFocused.mask.width = 630*2;
                    LastGuiFocused.scrolled = true;
                }
                LastGuiFocused.x+= event.movementX*0.8;//performe scroll libs mouse
                LastGuiFocused.y+= event.movementY*0.8;//performe scroll libs mouse
            break;
            };
        }else{
            switch (LastGuiFocused.name) {
                case "Cage_Libs":
                    if(LastGuiFocused.scrolled){
                        if(TileSheetsOpened){// show Cage_LibsTiles if was opened
                            Cage_LibsTiles.renderable = true; // show again Cage_LibsTiles if exist
                            $PME.editorGui.state.setAnimation(2, 'show_tileScreen', false);
                        }
                        $PME.editorGui.state.setEmptyAnimation(1,0.05);
                        LastGuiFocused.children.forEach(cage => {
                            cage.getBounds();
                        });
                        LastGuiFocused.mask.height = 145;
                        LastGuiFocused.scrolled = false;
                    }
                break;
                case "Cage_LibsTiles":
                    if(LastGuiFocused.scrolled){
                        LastGuiFocused.children.forEach(cage => {
                            cage.getBounds();
                        });
                        LastGuiFocused.mask.width = 630;
                        LastGuiFocused.scrolled = false;
                    }
                break;
            };
        };
    };

    // add sprite to mouse
    function update_Cage_Mouse() {
        if(Cage_Mouse.freeze){return Cage_Mouse.freeze-=1 }; // freeze after move pivot 
        Cage_Mouse.x = (mX/Zoom.x)+ScrollX;
        Cage_Mouse.y = (mY/Zoom.y)+ScrollY;
        Cage_Mouse.zIndex = Cage_Mouse.y;
        if(Cage_Mouse.objSprite){
            Cage_Mouse.objSprite.zIndex = Cage_Mouse.y;
        }
    };

    // show or hide icons indicator mode from mouse
    function update_mouseIcons(InObjSprite) {
        if(InObjSprite){
            if(InObjSprite.source.type === "light"){
                Cage_Mouse.iconsLight.forEach(ico => { Cage_Mouse.addChild(ico); }); // show all icon modes
                // icon 
                var w =  InObjSprite.width || 100;
                var h =  InObjSprite.height || 100;
                Cage_Mouse.ico_brightness.position.set(w/2,-h/2);
                Cage_Mouse.ico_lightHeigth.position.set(-w/2,-h/2);
                Cage_Mouse.ico_radius.position.set(0,-h*1.2);


            }else{
                Cage_Mouse.icons.forEach(ico => { Cage_Mouse.addChild(ico); }); // show all icon modes
                // icon 
                var w =  InObjSprite.width || 100;
                var h =  InObjSprite.height || 100;
                Cage_Mouse.ico_rotation.position.set(w/2,-h/2);
                Cage_Mouse.ico_scale.position.set(-w/2,-h/2);
                Cage_Mouse.ico_pivot.position.set(0,-h*1.2);
                Cage_Mouse.ico_skew.position.set(0,h/8);
            };
        }else{
            Cage_Mouse.icons.forEach(ico => { Cage_Mouse.removeChild(ico); }); // show all icon modes
        }
   
    };

     // add sprite to mouse
     function add_toMouse(CAGE,transfered) { // transfere avoid create clone
        close_GuiEditor();
        // keep Cage if transfered or create new one
        let objSprite = transfered && CAGE || create_ObjSprite(CAGE.source, CAGE.source.normal);
        if(transfered){
            const pO = new PIXI.Point(objSprite.x, objSprite.y);
            const sC = new PIXI.Point(objSprite.scale.x, objSprite.scale.y); 
            const pV = new PIXI.Point(objSprite.pivot.x, objSprite.pivot.y); 
            const sK = new PIXI.Point(objSprite.skew.x, objSprite.skew.y); 
            const rO = objSprite.rotation;
             //replace Cage_Mouse to sprite map position
            Cage_Mouse.x = pO.x, Cage_Mouse.y = pO.y, Cage_Mouse.zIndex = pO.y;
            Cage_Mouse.freeze = 15; // count freeze update
            objSprite.transfered = {pO:pO,sC:sC,pV:pV,rO:rO,sK:sK};
            objSprite.x = 0, objSprite.y = 0; // reset sprite xy in container mouse
            CAGE.source.type !== "light" && (objSprite.parentGroup = null); // use the mouse parentGroup
            console.log('!CAGE.source.type === "light": ', !CAGE.source.type === "light");
            CAGE.removeChild(CAGE.debugElements_Rendered); // if was move only, delete last rendered
            CAGE.addChild(CAGE.debugElements.linePivot,CAGE.debugElements.lineH,CAGE.debugElements.cirOrigin);
        };
        // reference
        InObjSprite = objSprite;
        Cage_Mouse.objSprite = objSprite;
        if(CAGE.source.type === "light"){
            Cage_Mouse.addChild(objSprite);
        }else{
            Cage_Mouse.addChild(objSprite.debugElements.lineV, objSprite);
        };
    };


    // rendering debug element to texture (performance triks) create_debugElements
    function render_debugElements(CAGE) {
        CAGE.debugElements_Rendered = new PIXI.Container();
        if(CAGE.source.type ==="light"){
            CAGE.debugElements_Rendered.addChild(
                CAGE.debugElements.lineH,
                CAGE.debugElements.lineV,
                CAGE.debugElements.linePivot,
                CAGE.debugElements.cirOrigin
            );
        }else{
            CAGE.debugElements.lineH.width = CAGE._d.width;
            CAGE.debugElements_Rendered.addChild(
                CAGE.debugElements.linePivot,
                CAGE.debugElements.lineH,
                CAGE.debugElements.cirOrigin
            );
        };
        const bounds = CAGE.debugElements_Rendered.getBounds();
        const texture = Renderer.generateTexture(CAGE.debugElements_Rendered);
        const debugSprite = new PIXI.Sprite(texture);
        CAGE.debugElements_Rendered.removeChildren();
        CAGE.debugElements_Rendered.addChild(debugSprite);
        CAGE.debugElements_Rendered.position.set(bounds.x,bounds.y)
        CAGE.addChildAt(CAGE.debugElements_Rendered,0);
        CAGE.debugElements_Rendered.renderable = false;
    };

    // add mouse obj to map
    function add_toMap(restoreXY){
        InObjSprite.x = Cage_Mouse.x;
        InObjSprite.y = Cage_Mouse.y;
        InObjSprite.parentGroup = DisplayGroup_Selected;
        InObjSprite.zIndex = Cage_Mouse.y;
        TilesMap.addChild(InObjSprite); // need befor for correct bounds
        if(restoreXY){ // was transfered, and right click restore to last position
            //{pO:pO,sC:sC,pV:pV,rO:rO};
            InObjSprite.position.set(InObjSprite.transfered.pO.x,InObjSprite.transfered.pO.y);
            InObjSprite.scale.set(InObjSprite.transfered.sC.x,InObjSprite.transfered.sC.y);
            InObjSprite.pivot.set(InObjSprite.transfered.pV.x,InObjSprite.transfered.pV.y);
            InObjSprite.skew.set(InObjSprite.transfered.sK.x,InObjSprite.transfered.sK.y);
            InObjSprite.rotation = InObjSprite.transfered.rO;
            InObjSprite.zIndex = InObjSprite.y;
            update_debugElements(InObjSprite)
        }else{
             //re-calculate all bound in objet for colision
            InObjSprite._boundsMap = getReelBounds(InObjSprite);
        };
        render_debugElements(InObjSprite);
        
        // if obj was transfered to mouse, don push again
        if(!InObjSprite.transfered){ // push only if not transfer
            if(InObjSprite.source.type === "light"){
                TilesMap._objLight.push(InObjSprite);
            }else{
               TilesMap._objSprites.push(InObjSprite);
                // if is a 'case', also push in case list of game
               if(InObjSprite.source.case){
                InObjSprite._caseID = CaseObjList.length;
                CaseObjList.push(InObjSprite);
                   
                };
            };
        }else{
            delete InObjSprite.transfered;
        }
        clear_mouseObj(); // clear Cage_Mouse
    };

 
    // open the TileSheets library Cage_LibsTiles
    function open_tileSheets(CAGE){
        if(CAGE.opened){ return close_tileSheets(CAGE) }; //toggle Open Close tileSheets 
        show_tileSheets(true); //clear
        const name = CAGE.source.name;
        const textures = $SLL.resource[name].spritesheet.textures;
        const list = Object.keys(textures);
        // scan all textures, and add to gui based on frame trimmed
        for (let i = 0, len = list.length; i < len; i++) {
            const _name = list[i]; // texture tile name
            const _frame = CAGE.source.data.frames[_name].frame;
            const cage = new PIXI.Container(); // need Cage for store all icon and other elements
            const cage_bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const objSprite = new PIXI.Sprite( textures[_name] );
            const source = Object.assign({},CAGE.source);
            source.type = "tile", source.name = _name;
            // cage position, size
            cage.x = _frame.x;
            cage.y = _frame.y;
            cage_bg.width = objSprite.width;
            cage_bg.height = objSprite.height;
            // reference
            cage.objSprite = objSprite;
            cage.cage_bg = cage_bg;
            cage.source = source;
            objSprite.source = source;
            // get and asign session or create one
            objSprite.session = getSession(objSprite);
            // add to global
            cage.addChild(cage_bg,objSprite);
            Cage_LibsTiles.addChild(cage);
            cage.getBounds(); // for mouse interaction
        };
        CAGE.opened = true; //this objCage are open (toggle double click open/close)
        TileSheetsOpened  = true; // indication tilesheets gui it open
        Cage_LibsTiles.title.text = name; // name of the gui indicator
        
    };

    function createGrid(){
        const eX = TilesMap.width/TilesMap.scale.x; // map width + zoom
        const eY = TilesMap.height/TilesMap.scale.y; // map width + zoom
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
        Cage_Grid.addChild(sprite);
    };

    function show_DebugPathFrom(inObjPath) {
        // hide all
        CaseObjList.forEach(e => {
            e.debugPath && e.debugPath.forEach(arrow => {
                arrow.alpha = !inObjPath && 1 || 0.1;
            });
        });
        // show path debug conextion
        inObjPath && inObjPath.debugPath && inObjPath.debugPath.forEach(arrow => {
            arrow.alpha = 1;
        });
        
    };
    
     // create debug Path arrow for understand path
     function create_debugPath(cuCase,neCase,dontClear) {
        if(!!cuCase.connectPath && !!cuCase.debugPath){
            const index = cuCase.connectPath.indexOf(neCase);
            if(index>-1){ // conextion alrealy exist, so delete
                cuCase.removeChild(cuCase.debugPath[index]); // remove arrow child
                cuCase.connectPath.splice(index, 1); // remove conextion id
                cuCase.debugPath.splice(index, 1); // remove arrow id
            };
        }else{ // not exist create
            !dontClear && (cuCase.connectPath = []);
            cuCase.debugPath = [];
        };

        const p1 = { x: cuCase.x, y: cuCase.y };
        const p2 = { x: neCase.x, y: neCase.y-(neCase._boundsMap.height) };
        const angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const dist = Math.hypot((p2.x-p1.x)/cuCase.scale.x, (p2.y-p1.y)/cuCase.scale.y);
        const arrow = new PIXI.Sprite(PIXI.utils.TextureCache["pathArrow"]);
 
            arrow.anchor.set(0,0.5);
            arrow.width=dist;
            arrow.blendMode = 1;
            arrow.rotation = angleRadians;
        cuCase.debugPath.push(arrow);
        cuCase.connectPath.push(neCase);
        cuCase.addChild(arrow);
    };


    function add_pathToCase(list,shiftKey) {
        for (let i = 0, l = list.length; i < l; i++) {
            const cCase = list[i]; // current case
            const nCase = list[i+1] // next case
            if(nCase){ // only if have next case
                create_debugPath(cCase,nCase);
            }
        }
        // reverse auto path Conextion
        if(shiftKey){
            for (let i = list.length; i--;) {
                const cCase = list[i]; // current case
                const nCase = list[i-1]; // next case
                if(nCase){ // only if have next case
                    create_debugPath(cCase,nCase);
                }
            }
        }
    };
    // execute action button from editor
    function open_Button(InButtons, clickEvent){
        console.log('InButtons: ', InButtons); // PahtMode
        if(InButtons.type === "displayGroup"){
            const keyNum = InButtons.name.substr(InButtons.name.indexOf("gb") + 2);
            return update_DisplayGroup(keyNum);
        }

        if(InButtons.name === "icon_light_s" || InButtons.name === "icon_light_p"){ //  LIGHT MODE
            const type = InButtons.currentSpriteName;
            if(clickEvent===2){ open_dataEditor(type) };
            const light = { source:create_lightSource(type) }; // create a light with.source
            if(clickEvent===0){ add_toMouse(light) };
        };
        if(InButtons.name === "icon_grid"){
            if(Cage_Grid.children.length){
                Cage_Grid.children = [];
                InButtons.color.b = 1;
            }else{
                InButtons.color.b = 250;
                createGrid();
            }
        }
        if(InButtons.name === "saveIcon"){
            start_saveEditor();
        }
        if(InButtons.name === "pathicon"){
            PathMode = !PathMode;
            InButtons.color.b = PathMode && 255 || 1;
            InButtons.currentSprite._filters = PathMode && [$PME.filters[0]] || null;
            console.log('InButtons: ', InButtons);
        }
    };

    // refresh objLibrary thumbails
    function update_DisplayGroup(keyNum,ctrlKey){
        DisplayGroup_Selected = DisplayGroup[keyNum];
        Cage_Mouse.parentGroup = DisplayGroup_Selected;
        for (let i = 7; i --;) {
            const slot = $PME.editorGui.skeleton.findSlot("gb"+i);
            slot.color.b = ("gb"+i === "gb"+keyNum) && (ctrlKey&&30||250) || 1;
        };
        if(Cage_Mouse.objSprite){ // refresh txt if mouse have obj
            Cage_Mouse.objSprite.debugElements.txtGroupe.text = `${DisplayGroup_Selected.zIndex}`;
        };
        if(ctrlKey){
            TilesMap._objSprites.forEach(obj => {
                if(obj.session._autoDisplayGroup){
                    const value = obj.session.autoDisplayGroup[1][keyNum];
                    if(value){
                        obj.parentGroup = DisplayGroup_Selected;
                    };
                };
            });
        }
    };
    //#endregion

    //#region [rgba(20, 140, 100,0.05)]
    // ┌------------------------------------------------------------------------------┐
    // MONSE INTERACTION
    // └------------------------------------------------------------------------------┘
    // mouse hold timeOut
    function startMouseHold(active){
        clearTimeout(MouseTimeOut);
        MouseHold=false;
        QuickEditMode = false;
        if(EditorOpen && !(mX>Scene_W/2) ){ return }; // if mode editor, fix holdMouse out input
        if(active){
            MouseTimeOut = setTimeout(() => {
                memX = (mX), memY = (mY);
                MouseHold=true;
                if(InObjSprite){
                    update_mouseIcons(InObjSprite);
                }
            }, 160);
        };
        update_mouseIcons(false);
  
    };

    // move Mouse ##############################
    function mousemove_Editor(event) { 
        refreshMousePos(event); // refresh mX,mY
        if(!MouseHold && !InObjSprite && !EditorOpen){
            InButtons = checkInButtons();
            Inlibs = checkIn(Cage_Libs, Inlibs) || false;
            InTile = TileSheetsOpened && !Inlibs && checkIn(Cage_LibsTiles, InTile) || false;
            InObjMap = !InButtons && !Inlibs && !InTile && checkInMap(TilesMap._objSprites) || checkInMap(TilesMap._objLight);
        }
        // update
        if(InObjSprite){
            !MouseHold && update_Cage_Mouse();
            MouseHold && update_quickEditMode(InObjSprite); 
        }else{
            if(!EditorOpen && !InObjMap){
                update_SheetsPNG();
                !PathMode && update_scrollLibrary();
            }
        };
        // in pathMod add direction
        if(PathMode){
            const inObjPath = checkInPath(CaseObjList);
            if(MouseHold){
                // sir inObjPath et pas deja dans la list, add
                if(inObjPath && PathObjSelected.indexOf(inObjPath)===-1){
                    PathObjSelected.push(inObjPath);
                };
            }else{
                show_DebugPathFrom(inObjPath);
            };
        };
    };

    // press Mouse ##############################
    function mousedown_Editor(event) {
        startMouseHold(true); // timeOut check hold click
        Cage_Mouse.freeze = 10;
        if(PathMode && InObjMap){
            PathObjSelected = [];
            PathObjSelected.push(InObjMap);
        };
    };

    // release Mouse ##############################
    function mouseup_Editor(event) {
        Cage_Mouse.freeze = 0;
        if(!EditorOpen){
            if(event.button === 0){//<=rightClick
                // add to map obj hold by mouse
                if(!MouseHold && InObjSprite){
                    add_toMap();
                }
                // execute libs obj (open || addMouse)
                if(!MouseHold  && (Inlibs||InTile||InObjSprite) ){
                    const cage = Inlibs||InTile||InObjSprite;
                    const type = cage.source.type;
                    switch (type) {
                        case"spineSheets":case"tile":case"light": add_toMouse(cage); break; //InObjSprite allow keep
                        case"tileSheets": open_tileSheets(cage); break;
                    };
                }else
                if(!MouseHold && !InObjSprite && InButtons){
                    open_Button(InButtons, event.button);
                };
                if(MouseHold && InObjSprite && !PathMode){
                    Cage_Mouse.freeze = 10; // count freeze update
                }
                if(InObjMap && !PathMode){
                    add_toMouse(InObjMap,true); // transfere to mouse 
                }
            }else
            if(event.button === 2){//=>leftClick
                // open dataEditor
                if(!MouseHold  && !PathMode && !InObjSprite && (Inlibs||InTile||InButtons) ){
                    if(InButtons){
                        open_Button(InButtons, event.button);
                    }else{
                        const type = Inlibs && Inlibs.source.type || InTile.source.type || false;
                        switch (type) {
                            case"spineSheets":case"tile": open_dataEditor(Inlibs||InTile); break;
                        };
                    };
                }else
                if(!MouseHold && InObjSprite){
                    if(InObjSprite.transfered){
                        add_toMap(true); // restoreXY
                    }
                    clear_mouseObj(true); // true:clear: (InObjSprite = false);
                    show_GuiEditor();
                    TileSheetsOpened && show_tileSheets();
                    
                };
                if(InObjMap){
                    delete_objMap(InObjMap);
                }
            };
        };
        if(PathMode){
            if(PathObjSelected.length>1){ // draw path
                add_pathToCase(PathObjSelected,event.shiftKey); // draw path to case
                PathObjSelected = [];
                
            };
           
        }

        startMouseHold(false); // clear mouse hold click
        update_scrollLibrary(); // refresh scrolled libs 
         InTile = false, InObjMap = false;
    };//__

   function delete_objMap(InObjMap) {
       if(PathMode){ // delette only path
            const c = confirm("DELETE PATH, ARE YOU SURE ?");
            if (c === true) {
                InObjMap.connectPath = [];
                InObjMap.debugPath && InObjMap.debugPath.forEach(arrow => {
                    InObjMap.removeChild(arrow);
                });
                InObjMap.debugPath = [];
            };
       }else{  // delette object
            const c = confirm("DELETE OBJ, ARE YOU SURE ?");
            if (c === true) {
                TilesMap.removeChild(InObjMap);
                const index = TilesMap._objSprites.indexOf(InObjMap);
                TilesMap._objSprites.splice(index,1);
            };
       }
   
   };

   function update_lightZoom() {
    const list = TilesMap._objLight;
    list.forEach(light => {
        const session = light.session;
        light.brightness = session.brightness[1]*Zoom.x;
        light.lightHeight = session.lightHeight[1]*Zoom.x;
        isFinite(light.radius) && (light.radius = session.radius[1]*Zoom.x);
    });
    if(InObjSprite && InObjSprite.source.type === "light"){
        const session = InObjSprite.session;
        InObjSprite.brightness = session.brightness[1]*Zoom.x;
        InObjSprite.lightHeight = session.lightHeight[1]*Zoom.x;
        isFinite(InObjSprite.radius) && (InObjSprite.radius = session.radius[1]*Zoom.x);
    };
   }
    // zoom camera
    function wheel_Editor(event) {
        const pos = new PIXI.Point(mX,mY);
        TilesMap.toLocal(pos, null, memCoord);
        if(event.wheelDeltaY>0){
            Zoom.x+=0.1,Zoom.y+=0.1
        }else{
           if(Zoom._x>0.3){ Zoom.x-=0.1, Zoom.y-=0.1 }; 
        };
        TilesMap.toLocal(pos, null, memCoord2);  // update after scale
        TilesMap.pivot.x -= (memCoord2.x - memCoord.x);
        TilesMap.pivot.y -= (memCoord2.y - memCoord.y);
        ScrollX -= (memCoord2.x - memCoord.x);
        ScrollY -= (memCoord2.y - memCoord.y);
        // update light zoom
        update_lightZoom();
    };

    function keydown_Editor(event) {
        if(EditorOpen){return};
        const keyNum = Number(event.key);
        if(keyNum<=6){
            update_DisplayGroup(keyNum, event.ctrlKey);
        };
    };

    document.addEventListener('mousemove', mousemove_Editor);
    document.addEventListener('mousedown', mousedown_Editor);
    document.addEventListener('mouseup',mouseup_Editor);
    document.addEventListener('wheel', wheel_Editor);
    document.addEventListener('keydown', keydown_Editor); // change layers
    //#endregion

    // Tikers for editor update (document Title, check scroll)
    const editorTiker = new PIXI.ticker.Ticker().add((delta) => {
        document.title = `(mX: ${~~mX} mY: ${~~mY}) \u00A0|\u00A0 (memX: ${~~memX} memY: ${~~memY}) \u00A0|\u00A0 (ScrollX: ${~~ScrollX} ScrollY: ${~~ScrollY}) \u00A0|\u00A0 (rX: ${~~((mX/Zoom.x)+ScrollX)} rY: ${~~((mY/Zoom.y)+ScrollY)}) \u00A0|\u00A0  (zoX :${Math.round(Zoom.x*100)/100} zoY: ${Math.round(Zoom.y*100)/100}) \u00A0|\u00A0
        InObjSprite: ${!!InObjSprite} \u00A0\u00A0\u00A0\u00A0 inlibs: ${!!Inlibs} \u00A0\u00A0\u00A0\u00A0 inTile: ${!!InTile} \u00A0\u00A0\u00A0\u00A0 InButtons: ${!!InButtons} \u00A0\u00A0\u00A0\u00A0 inObjMap: ${!!InObjMap} 
            \u00A0\u00A0\u00A0\u00A0 (cage_mouse.objSprite: ${!!Cage_Mouse.objSprite}) \u00A0\u00A0\u00A0\u00A0 (MouseHold: ${MouseHold}) `;
        if(scrollAllowed){
            let scrolled = false;
            (mX<10 && (ScrollX-=ScrollF) || mX>Scene_W-10 && (ScrollX+=ScrollF)) && (scrolled=true);
            (mY<15 && (ScrollY-=ScrollF) || mY>Scene_H-15 && (ScrollY+=ScrollF)) && (scrolled=true);
            scrolled && (ScrollF+=0.4) || (ScrollF=0.1) ;
        }
        TilesMap.pivot.x+=(ScrollX-TilesMap.pivot.x)/scrollSpeed;
        TilesMap.pivot.y+=(ScrollY-TilesMap.pivot.y)/scrollSpeed;
    });
    Game_Player.prototype.updateScroll = function(){}//disable scoll character in editor mode
    editorTiker.start();

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
        Scene.addChild(rope);
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
    startTrailMouse()

}; // *** END SCOPE startEditor***
