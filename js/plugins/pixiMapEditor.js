/*:
// PLUGIN □────────────────────────────────□PIXI MAP EDITOR□─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc EDITOR GUI for create map with object sprine JSON (texture packer, spine)
* V.1.2B
* License:© M.I.T
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
 // START INITIALISE EDITOR (FROM RMMV PLUGIN MANAGER)
document.addEventListener('keydown', initializeEditor);
function initializeEditor(event){
    if(event.key === "F1" && !$PME.started){
        console.log1('__________________initializeEditor:__________________ ');
        // REMOVE CURRENT CAMERA LISTENER
        document.onwheel = null;
        $huds.displacement.hide();
        $huds.pinBar.hide();
        $huds.pinBar.hide();
        (function() {
            $PME.started = true;
            $PME.stage = $stage;
            
            const javascript = [
                "js/iziToast/iziToast.js",
                "js/iziToast/pixiMapEditor_HTML.js",
                "js/iziToast/pixiMapEditor_TOAST.js",
                "js/jscolor/bootstrap-slider.js",
                "js/jscolor/jscolor.js",
                "js/acordeon/mn-accordion.js", // acordeon collapser
            ];
            const css = [
                'js/iziToast/iziToast.css',
                "js/iziToast/bootstrap.min.css",
                "js/jscolor/bootstrap-slider.css",
                "editor/customEditorCSS.css",
                "js/acordeon/mn-accordion.css",
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
    iziToast.warning( this.izit_loading1($stage) );
    const loader = new PIXI.loaders.Loader();
    loader.add('editorGui', `editor/pixiMapEditor1.json`).load();
    loader.onProgress.add((loader, res) => {
        if (res.extension === "png") { this.editor[res.name] = res.texture};
        if (res.spineData) { this.editor[res.name] = res.spineData};
    });
    loader.onComplete.add(() => { this.load_nwJSFolderLibs() });
 };

 _PME.prototype.load_nwJSFolderLibs = function() {
    const loadingStatus =  document.getElementById('izit_loading1');
    const path = require('path'), fs=require('fs');
    let fromDir = function(startPath,filter){
        if (!fs.existsSync(startPath)){ return console.log("no dir ",startPath) };
        let files=fs.readdirSync(startPath);
        for(let i=0;i<files.length;i++){
            let filename=path.join(startPath,files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory()){ fromDir(filename,filter) } //recurse
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
            };
        };
    }.bind(this);
    fromDir('data2','.json'); //START: startPath, extention.Filter
    this.loadDataJson();
 };


 //#1 start load all json data
 _PME.prototype.loadDataJson = function() {
    const _Loader2 = new _coreLoader();
    _Loader2.loadFromEditor( $stage.scene.constructor.name ,this._tmpData);
    // return startGui() from core loader
 };

 _PME.prototype.startGui = function(data2) {
     this.Data2 = data2;
    // scene hack
    $stage.CAGE_EDITOR = new PIXI.Container();
    $stage.CAGE_EDITOR.parentGroup = $displayGroup.group[4]; 
    $stage.CAGE_EDITOR.name = "CAGE_EDITOR";
    const index = $stage.children.indexOf($stage.CAGE_MOUSE);
    $stage.addChildAt($stage.CAGE_EDITOR, index); // -1 befor mouse
    const cage = new PIXI.Container();
    const spine = new PIXI.spine.Spine(this.editor.editorGui);
    $stage.CAGE_EDITOR.addChild(spine);
    this.editorGui = spine;

    spine.autoUpdate = true;
    spine.state.setAnimation(0, 'idle', true);
    spine.state.setAnimation(1, 'start0', false);
    //EDITOR.state.setAnimation(2, 'hideTileSheets', false);
    spine.state.tracks[1].listener = {
        complete: function(trackEntry, count) {
            $PME.startEditor();
        }
    };
 };


// ┌------------------------------------------------------------------------------┐
// END START INITIALISE PLUGIN METHOD** ↑↑↑
// └------------------------------------------------------------------------------┘


 // Start The Editor initialisation SCOPE
_PME.prototype.startEditor = function() {
//#region [rgba(200, 0, 0,0.1)]
// ┌------------------------------------------------------------------------------┐
// Start The Editor initialisation SCOPE
// └------------------------------------------------------------------------------┘
// CAGE_MAP ________________
    const CAGE_EDITOR = $stage.CAGE_EDITOR; // the overScreen editors Elements
    const CAGE_MAP = $stage.scene; // Ref to scene Cage Map
    const CAGE_MOUSE = $stage.CAGE_MOUSE // ref to cage Mouse
    const CACHETILESSORT = {}; // cache buffer for fast tiles sorting 
    const FILTERS = { // cache filters
        OutlineFilterx4: new PIXI.filters.OutlineFilter (4, 0x000000, 1),
        OutlineFilterx16: new PIXI.filters.OutlineFilter (16, 0x000000, 1),
        OutlineFilterx6White: new PIXI.filters.OutlineFilter (4, 0xffffff, 1),
        OutlineFilterx8Green: new PIXI.filters.OutlineFilter (4, 0x16b50e, 1),
        OutlineFilterx8Green_n: new PIXI.filters.OutlineFilter (8, 0x16b50e, 1), // need x2 because use x2 blendMode for diffuse,normal
        OutlineFilterx8Red: new PIXI.filters.OutlineFilter (8, 0xdb120f, 1),
        ColorMatrixFilter: new PIXI.filters.ColorMatrixFilter(),
        PixelateFilter12: new PIXI.filters.PixelateFilter(12),
        BlurFilter: new PIXI.filters.BlurFilter (10, 3),
    }
    FILTERS.ColorMatrixFilter.desaturate();

    const DATA2    = this.Data2    ; // ref of database folders
    const EDITOR   = this.editorGui; // spine
    const Renderer = $app.renderer ; // ref pixi webGL renderer
    let ButtonsSlots = []; // store editor Spine2d buttons
    let InMapObj = null; // Store the current map Objets
    let mX  = 100, mY  = 100; // mouse Screen Global position info
    let mMX = 0  , mMY = 0  ; // mouse Map local position info
    let MovementX = 0   ; // mouseX screen accelerations
    let MovementY = 0   ; // mouseY screen accelerations
    let FreezeMY  = null; // pixi.Point freeze mouse coor
    // scoller 
    let scrollAllowed = true; // freeze or allow scroll screen
    let ScrollX = CAGE_MAP.pivot.x;
    let ScrollY = CAGE_MAP.pivot.y;
    let ScrollF = 0.1; // _displayXY power for scroll map
    let scrollSpeed = 20;
    // zoom 
    const Zoom = CAGE_MAP.scale;
    const MemCoorZoom1 = new PIXI.Point(), MemCoorZoom2 = new PIXI.Point(); // for control zoom memory
    let MouseTimeOut = null; // store mouse hold timeOut when hold click
    let MouseHold = null; // click mouse is held ?
    let LineDraw = null;
    const LineList = []; // store all lines , allow to lock on line
    let GRID = null; // store grid in global , for remove if need.
    let ClipboarData = {}; // add Data json to clipboard for ctrl+v on obj to asign data
    let FastModesKey = null; // when mouse hold, push keyboard keys to active fastEdit mode
    let FastModesObj = null; // store Obj fast mode
    let CurrentDisplayGroup = 1;
    FreezeMouse = null; // freeze mouse when place a obj from mouse, with fast mode
//#endregion

//#region [rgba(250, 0, 0,0.03)]
// ┌------------------------------------------------------------------------------┐
// SETUP Container for editor gui
// └------------------------------------------------------------------------------┘
    // CAGE_LIBRARY ________________
    // Store Available library spriteSheets with baseTextures
    const CAGE_LIBRARY = new PIXI.Container(); 
        (function() {
            this.mask = new PIXI.Sprite(PIXI.Texture.WHITE); //Mask for scroll bottom libs
            this.addChild(CAGE_LIBRARY.mask);
            this.list = []; // store liste of current obj cages elements
            // setup && hack
            this.position.set(115,950);
            this.mask.position.set(-8,-8); // marge outline filters
            this.mask.width = 1740, CAGE_LIBRARY.mask.height = 105;
            this.mask.getBounds();
            // reference
            this.name = "library";
            this.interactive = true;
            this.hitArea = new PIXI.Rectangle(0,0,1740,220);
            this.buttonType = "CAGE_LIBRARY";
            this.on('pointerover', pointer_overIN);
            this.on('pointerout', pointer_overOUT);
            this.on('pointerdown', pointer_DW);
            CAGE_EDITOR.addChild(CAGE_LIBRARY);
        }).call(CAGE_LIBRARY);

    // CAGE_TILESHEETS ________________
    const CAGE_TILESHEETS = new PIXI.Container(); // Store all avaibles libary
        (function() {
            this.mask = new PIXI.Sprite(PIXI.Texture.WHITE); //Mask for scroll bottom libs
            // setup && hack
            this.position.set(1280,50);
            this.mask.position.set(1280, 50);
            this.mask.width = 640;
            this.mask.height = 880;
            this.mask.getBounds();
            this.list        = []   ; // store list of tile
            this.opened      = false;
            this.renderable  = false;
            this.visible     = false;
            this.interactive = true ;
            this.hitArea = new PIXI.Rectangle(0,0,3600,3600); // compense le scale zoom
            this.buttonType = "CAGE_TILESHEETS";
            this.on('pointerover' , pointer_overIN );
            this.on('pointerout'  , pointer_overOUT);
            this.on('pointerdown' , pointer_DW     );
            this.on('pointerup'   , pointer_UP     );
            this.on('zoomTileLibs', wheelInLibs    );
            CAGE_EDITOR.addChild(CAGE_TILESHEETS);
        }).call(CAGE_TILESHEETS);

    // CAGE_MOUSE ________________
        (function() {
            this.previews = new PIXI.Container(); // store preview list
            this.previewsShowed = false;
            this.currentSprite = null;
            this.list = false; // store list array of current objs hold by the mouse
            this.addChild(CAGE_MOUSE.previews);
        }).call(CAGE_MOUSE);

    // fast mode indicator 
    const fastModes = new PIXI.Container();
        (function() {
            const txt0 = new PIXI.Text("P: pivot from position",{fontSize:14,fill:0x000000,strokeThickness:4,stroke:0xffffff});
            const txt1 = new PIXI.Text("Y: position from pivot",{fontSize:14,fill:0x000000,strokeThickness:4,stroke:0xffffff});
            const txt2 = new PIXI.Text("W: skew mode",{fontSize:14,fill:0x000000,strokeThickness:4,stroke:0xffffff});
            const txt3 = new PIXI.Text("S: Scale mode",{fontSize:14,fill:0x000000,strokeThickness:4,stroke:0xffffff});
            const txt4 = new PIXI.Text("R: Rotation mode",{fontSize:14,fill:0x000000,strokeThickness:4,stroke:0xffffff});
            const txt5 = new PIXI.Text("U: Rotate Textures Anchor",{fontSize:14,fill:0x000000,strokeThickness:4,stroke:0xffffff});
            const txtH = txt0.height;
            this.x = 80;
            txt1.y = txt0.y+txtH, txt2.y = txt1.y+txtH, txt3.y = txt2.y+txtH, txt4.y = txt3.y+txtH, txt5.y = txt4.y+txtH;
            this.txtModes = {p:txt0, y:txt1, w:txt2, s:txt3, r:txt4, u:txt5}; // when asign a FastModesKey
            this.renderable = false; // render only when mouse hold.
            this.addChild(txt0,txt1,txt2,txt3,txt4, txt5);
            CAGE_MOUSE.fastModes = fastModes;
            $mouse.pointer.addChild(fastModes);
        }).call(fastModes);






//#endregion

// ┌------------------------------------------------------------------------------┐
// SETUP create thumbail library AUTO
// └------------------------------------------------------------------------------┘
     // createLibraryObj sheets for thumbails libs
     (function(){
        let x = 100;
        for (const key in DATA2) { // this._avaibleData === DATA2
            if(DATA2[key].dirArray[1] !== 'BG'){ // dont add BG inside library
                const cage = build_ThumbsGUI(DATA2[key]); // create from Data ""
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
                _slot.buttonType = "button";
                _slot.currentSprite.interactive = true;
                _slot.currentSprite.on('pointerover', pointer_overIN,_slot);
                _slot.currentSprite.on('pointerout', pointer_overOUT,_slot);
                _slot.currentSprite.on('pointerup', pointer_UP);
                _slot.currentSprite._slot = _slot;
                if(slot.name.contains("gb") && slot.name.contains(String(CurrentDisplayGroup))){
                    execute_buttons(_slot.currentSprite);
                };
            };
        };
        // add title text for open cage tileSheets
        const titleBarTileSheets =  EDITOR.skeleton.findSlot("TileBarLeft");
        const text = new PIXI.Text('Hello World', {fill: "white"});
        text.anchor.set(0.6,0.5);
        titleBarTileSheets.currentSprite.addChild(text);
        titleBarTileSheets.title = text;

    }).bind(this)();

    // convert current objs to editor format
    (function() {
        $Objs.list_master.forEach(cage => {
            const dataBase = DATA2[cage.dataName];
            create_DebugElements.call(cage, dataBase);
            
            cage._events = {}; // remove event
            cage.on('pointerover', pointer_overIN);
            cage.on('pointerout', pointer_overOUT);
            cage.on('pointerup', pointer_UP);
            cage.on('pointerdown', pointer_DW);

            cage.interactive = true;
            cage.buttonType = "tileMap";
        });
        // player identification
        $player.spine.addChild(new PIXI.Text("player1",{fontSize:24,fill:0xffffff}));
        console.log('$player.spine: ', $player.spine);

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

    // Build Rectangles // x, y, w:width, h:height, c:color, a:alpha, r:radius, l_c_a:[lineWidth,colorLine,alphaLine]
    function drawRec(x, y, w, h, c, a, r, l_c_a) {
        const rec = new PIXI.Graphics();
            rec.beginFill(c||0xffffff, a||1);
            l_c_a && rec.lineStyle((l_c_a[0]||0), (l_c_a[1]||c||0x000000), l_c_a[2]||1);
            r && rec.drawRoundedRect(x, y, w, h, r) || rec.drawRect(x, y, w, h);
        return rec;
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
        if(GRID && GRID._texture){
            CAGE_MAP.removeChild(GRID);
            return GRID.destroy();
        }
        const eX = $stage.width; // map width + zoom
        const eY = $stage.height; // map width + zoom
        const maxLineH = eX/48, maxLineV = eY/48;
        const fWH = 48; // factor squares width heigth
        const color = [0xffffff,0x000000,0xff0000,0x0000ff][~~(Math.random()*4)];
        const rt = PIXI.RenderTexture.create(eX, eY); // create frame for hold rendered grafics
        const rc_grid = new PIXI.Container();
        function draw(sX,sY,eX,eY){
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(2, color, 0.5);
            return graphics.moveTo(sX,sY).lineTo(eX, eY).endFill();
        };
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
        CAGE_MAP.addChild(sprite);
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
        const renderer = $app.renderer
        const texture = renderer.generateTexture( drawLine([0,0],[1920*2,0],8,"0xff0000") );
        LineDraw = new PIXI.Sprite(texture);
        LineDraw.position.set(mX,mY);
        LineDraw.anchor.set(0.5,0.5);
        LineDraw.change = 0;
        LineDraw.pinable = true;
        LineDraw.horizon = true; // is lock on x or y
        $stage.addChild(LineDraw);
        LineDraw.interactive = true;
        LineDraw.name = "DEBUGLINE";
        LineDraw.on('pointerup', pointer_UP);
    };

    function hideShowDebugElements(){
        if($Objs.list_master.length){
            const showed = $Objs.list_master[0].Debug.bg.renderable; // check if we have a element debuged ? 
            const list = $Objs.list_master;
            list.forEach(element => {
                element.Debug.hitZone.renderable = !showed;
                element.Debug.bg.renderable = !showed;
                element.Debug.an.renderable = !showed;
                element.Debug.piv.renderable = !showed;
            });
        }
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
                CAGE_LIBRARY.removeChild(cage); // clear all child but keep the child mask
        });
        // filters TODO:
        // sorts TODO:
        const maxX = CAGE_LIBRARY.mask.width;
        const maskH = CAGE_LIBRARY.mask.height;
        for (let i=x=y=line= 0, disX = 25, l = CAGE_LIBRARY.list.length; i < l; i++) {
            const cage = CAGE_LIBRARY.list[i];
            if(cage.renderable){
                if(cage.x+cage.width+x>maxX){ x=0, y+=maskH+8};
                
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
            cache[cage.textureName] = new PIXI.Point(x,y); //REGISTER
            cage._boundsRect.pad(pad+2,pad+1);
            //cage.DebugElements.bg._boundsRect.pad(pad,pad);
        };
        return cache;
    };



//#endregion

    //#region [rgba(219, 182, 2, 0.05)]
    // ┌------------------------------------------------------------------------------┐
    // IZITOAST DATA2 EDITOR 
    // └------------------------------------------------------------------------------┘
    // create data id for HTML JSON, if existe , return Data_Values
    function computeDataForJson(OBJ){
        const data = {};
        //TODO: spineSheet
        const list1 = [ 'position','scale','skew','pivot']; // general props list for 2D value
        const list2 = [ 'name','groupID','rotation','alpha','zIndex','autoGroups', 'animationSpeed','loop']; // single value list from container
        const list3 = [ 'blendMode','tint',]; // value from difuse and normal [d,n]
        list1.forEach(key => {
            data[key] = [OBJ[key].x, OBJ[key].y];
        });
        list2.forEach(key => {
            if(OBJ.hasOwnProperty(key)){
                data[key] = OBJ[key].valueOf();
            };
        });
        list3.forEach(key => {
            if(isFinite(OBJ.Sprites.d[key])){
                data[key] = data[key] || {};
                data[key].d = OBJ.Sprites.d[key].valueOf();
            };
            if(OBJ.Sprites.n && isFinite(OBJ.Sprites.n[key])){
                data[key] = data[key] || {};
                data[key].n = OBJ.Sprites.n[key].valueOf();
            };
        });
        // SPECIAL PROPS
        data.parentGroup = OBJ.parentGroup.zIndex;
        OBJ.Sprites.d.hasOwnProperty('anchor')? data.anchor = [OBJ.Sprites.d.anchor.x, OBJ.Sprites.d.anchor.y] : void 0;
        if( OBJ.Sprites.d.hasOwnProperty('color') ){
            data.color = {};
            data.color.d = [
                PIXI.utils.hex2rgb(OBJ.Sprites.d.color.darkRgba).reverse(), 
                PIXI.utils.hex2rgb(OBJ.Sprites.d.color.lightRgba).reverse()
            ];
            data.color.n = [
                PIXI.utils.hex2rgb(OBJ.Sprites.n.color.darkRgba).reverse(), 
                PIXI.utils.hex2rgb(OBJ.Sprites.n.color.lightRgba).reverse()
            ];
        };
        return data;
        
    };

    function pasteCopyDataIn(OBJ){
        //setObjWithData.call(OBJ,ClipboarData, null)
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
    function create_sliderFalloff2(){
        const kc = new Slider("#kc", {  step: 0.01,value:0, min: 0.01, max: 1, tooltip: false });
        kc.tooltip.style.opacity = 0.5;

        const kl = new Slider("#kl", {step: 0.1,value:0, min: 0.1, max: 20, tooltip: 'always'});
        kl.tooltip.style.opacity = 0.5;

        const kq = new Slider("#kq", {step: 0.01,value:0, min: 0.1, max: 50, tooltip: 'always'});
        kq.tooltip.style.opacity = 0.5;
        return {kc:kc,kl:kl,kq:kq};
    };

    // create multi sliders Heaven
    function create_sliderHeaven(dataValues){
        // diffuse dark
        const isSpine = dataValues.p.type=== "spineSheet";
        function upd() { this.asignValues(dataValues, false) };
        const ddr = new Slider("#ddr", { tooltip: 'always'}); // step: 0.1, value:0, min: 0, max: 1, 
        const ddg = new Slider("#ddg", { tooltip: 'always'});
        const ddb = new Slider("#ddb", { tooltip: 'always'});
        ddr.tooltip.style.opacity = 1, ddg.tooltip.style.opacity = 1, ddb.tooltip.style.opacity = 1;
        ddr.on("slide", (function(value) { dataValues.d.setDark[0] = value; upd.call(this) }).bind(this));
        ddg.on("slide", (function(value) { dataValues.d.setDark[1] = value; upd.call(this) }).bind(this));
        ddb.on("slide", (function(value) { dataValues.d.setDark[2] = value; upd.call(this) }).bind(this));

        // diffuse light
        const dlr = new Slider("#dlr", {tooltip: 'always'});
        const dlg = new Slider("#dlg", {tooltip: 'always'});
        const dlb = new Slider("#dlb", {tooltip: 'always'});
        dlr.tooltip.style.opacity = 1, dlg.tooltip.style.opacity = 1, dlb.tooltip.style.opacity = 1;
        dlr.on("slide", (function(value) { dataValues.d.setLight[0] = value; upd.call(this) }).bind(this));
        dlg.on("slide", (function(value) { dataValues.d.setLight[1] = value; upd.call(this) }).bind(this));
        dlb.on("slide", (function(value) { dataValues.d.setLight[2] = value; upd.call(this) }).bind(this));
        if (!isSpine){
            // normal dark
            const ndr = new Slider("#ndr", { tooltip: 'always'}); // step: 0.1, value:0, min: 0, max: 1, 
            const ndg = new Slider("#ndg", { tooltip: 'always'});
            const ndb = new Slider("#ndb", { tooltip: 'always'});
            ndr.tooltip.style.opacity = 1, ndg.tooltip.style.opacity = 1, ndb.tooltip.style.opacity = 1;
            ndr.on("slide", (function(value) { dataValues.n.setDark[0] = value; upd.call(this) }).bind(this));
            ndg.on("slide", (function(value) { dataValues.n.setDark[1] = value; upd.call(this) }).bind(this));
            ndb.on("slide", (function(value) { dataValues.n.setDark[2] = value; upd.call(this) }).bind(this));

            // normal light
            const nlr = new Slider("#nlr", {tooltip: 'always'});
            const nlg = new Slider("#nlg", {tooltip: 'always'});
            const nlb = new Slider("#nlb", {tooltip: 'always'});
            nlr.tooltip.style.opacity = 1, nlg.tooltip.style.opacity = 1, nlb.tooltip.style.opacity = 1;
            nlr.on("slide", (function(value) { dataValues.n.setLight[0] = value; upd.call(this) }).bind(this));
            nlg.on("slide", (function(value) { dataValues.n.setLight[1] = value; upd.call(this) }).bind(this));
            nlb.on("slide", (function(value) { dataValues.n.setLight[2] = value; upd.call(this) }).bind(this));
        }

        const checkBoxHeaven = document.getElementById("enableHeaven");
        document.querySelectorAll(`#HeavenSliders`)[1].style.display = "none";
        if(this.d.color){ checkBoxHeaven.click() };
        // click on checkBox will hide or show heaven sliders and also convert / or unConvert heaven
        checkBoxHeaven.onclick = (function(e){
            if(e.target.checked){
                this.d.convertToHeaven();
                dataValues.d.setDark  = [ +ddr.value, +ddg.value, +ddb.value ];
                dataValues.d.setLight = [ +dlr.value, +dlg.value, +dlb.value ];
                if(!isSpine){
                    this.n.convertToHeaven();
                    dataValues.n.setDark  = [ +ndr.value, +ndg.value, +ndb.value ];
                    dataValues.n.setLight = [ +nlr.value, +nlg.value, +nlb.value ];
                };
                this.asignValues(dataValues, false);
            }else{
                this.d.destroyHeaven();
                delete dataValues.d.setDark;
                delete dataValues.d.setLight;
                if(!isSpine){
                    this.n.destroyHeaven();
                    delete dataValues.n.setDark;
                    delete dataValues.n.setLight;
                };
            };
            document.querySelectorAll(`#HeavenSliders`)[1].style.display = !e.target.checked && "none" || '';
        }).bind(this);
         // if checked, force onclick
    };

     // create multi sliders light falloff for Coefficient light attenuation
    function create_sliderFallOff(dataValues){
        function upd() { this.asignValues(dataValues, false) };
        const Kc = new Slider("#Kc", { value: dataValues.falloff[0], min: 0, max: 1  , step: 0.01, ticks: [0,0.75,1], ticks_snap_bounds: 0.02, tooltip: 'always'});
        const Kl = new Slider("#Kl", { value: dataValues.falloff[1], min: 0, max: 20 , step: 0.1 , ticks: [0, 3, 20], ticks_snap_bounds: 0.25 , tooltip: 'always'});
        const Kq = new Slider("#Kq", { value: dataValues.falloff[2], min: 0, max: 50, step: 0.1 , ticks: [0,20,50], ticks_snap_bounds: 0.25 , tooltip: 'always'});
        
        Kc.tooltip.style.opacity = 1, Kl.tooltip.style.opacity = 1, Kq.tooltip.style.opacity = 1;
        Kc.on("slide", (function(value) { dataValues.falloff[0] = value; upd.call(this) }).bind(this));
        Kl.on("slide", (function(value) { dataValues.falloff[1] = value; upd.call(this) }).bind(this));
        Kq.on("slide", (function(value) { dataValues.falloff[2] = value; upd.call(this) }).bind(this));
    };

    function create_jsColors(dataValues){
        // initialise tint colors pickers
        const isSpine = dataValues.p.type=== "spineSheet";

        const _jscolor_d = new jscolor( document.getElementById("d_tint") ); // for case:id="_color" slider:id="color"
        _jscolor_d.fromString( PIXI.utils.hex2string(dataValues.d.tint) ); // force asign current value 
        _jscolor_d.zIndex = 99999999;
        _jscolor_d.onFineChange = (function(){
            dataValues.d.tint = +`0x${_jscolor_d.targetElement.value}`;
            this.asignValues(dataValues, false);
        }).bind(this);
        if(!isSpine){
            const _jscolor_n = new jscolor( document.getElementById("n_tint") ); // for case:id="_color" slider:id="color"
            _jscolor_n.fromString( PIXI.utils.hex2string(dataValues.n.tint) );
            _jscolor_n.zIndex = 99999999;
            _jscolor_n.onFineChange = (function(){
                dataValues.n.tint = +`0x${_jscolor_n.targetElement.value}`;
                this.asignValues(dataValues, false);
            }).bind(this);
        }else{
            document.getElementById("n_tint").disabled = true;
        }
    };

    // create color for light elements
    function create_jsColorsLight(dataValues){
        console.log('dataValues: ', dataValues);
        // initialise tint colors pickers
        const _jscolor_p = new jscolor( document.getElementById("p_tint") ); // for case:id="_color" slider:id="color"
        _jscolor_p.fromString( PIXI.utils.hex2string(dataValues.color) ); // force asign current value 
        _jscolor_p.zIndex = 99999999;
        _jscolor_p.onFineChange = (function(){
            dataValues.color = +`0x${_jscolor_p.targetElement.value}`;
            this.asignValues(dataValues, false);
        }).bind(this);
    };

    function iniSetupIzit(){
        if(iziToast.opened){return true};
        close_editor(true);
        setStatusInteractiveObj(false);
        iziToast.opened = true;
    }

    //TODO: ENDU ICI, AJOUTER UN Case Inspector, les case son des cas special pour le jeux.
    // setup for tile in map
    function open_dataInspector(cage) {
        if(iniSetupIzit()){return console.error('please Wait izit not cleared')}
        clearFiltersFX3(cage); // clear filters
        cage.Debug.an.renderable = true;
        cage.Debug.hitZone.renderable = true;
        cage.Debug.piv.renderable = true;
        iniSetupIzit();
        const dataValues = cage.getDataValues();
        iziToast.info( $PME.tileSetupEditor(cage) );
        const myAccordion = new Accordion(document.getElementById("accordion"), { multiple: true });

        //const _Falloff = create_sliderFalloff(); // create slider html for pixilight
        create_jsColors.call(cage, dataValues); // create color box for tint 
        create_sliderHeaven.call(cage, dataValues); // create slider html for pixiHaven
        create_dataIntepretor.call(cage, dataValues); // create the data Interpretor listener for inputs and buttons
        setHTMLWithData.call(this, dataValues); // asign dataValues to HTML inspector
    };
    // setup for tile in map
    function open_stageLightInspector(cage) {
        if(iniSetupIzit()){return console.error('please Wait izit not cleared')}
        const dataValues = cage.getDataValues();
        iziToast.info( $PME.izitGlobalLightEditor(cage) );
        const myAccordion = new Accordion(document.getElementById("accordion"), { multiple: true });
        create_sliderFallOff.call(cage, dataValues); // create slider html for pixiHaven
        create_jsColorsLight.call(cage, dataValues); // create color box for tint colors
        create_dataLightIntepretor.call(cage, dataValues); // create the data Interpretor listener for inputs and buttons
        setHTMLWithData.call(this, dataValues); // asign dataValues to HTML inspector
    };

    // setup for background and maps informations => CAGE_MAP
    function open_dataBGInspector(cage) {
        if(iniSetupIzit()){return console.error('please Wait izit not cleared')}
        const dataValues = cage.getDataValues();
        // get BG list for options html
        let bgList = Object.keys(DATA2).filter(word => DATA2[word].dirArray.contains("BG") );
        bgList.unshift(false);
        bgList = bgList.map(v => [v,v]); 
        //[["LINES",1],["LINE_LOOP",2],["LINE_STRIP",3],["POINTS",4],["TRIANGLES",5],["TRIANGLE_FAN",6],["TRIANGLE_STRIP",7]]
        iziToast.info( $PME.izitBackgroundEditor(bgList) );
        // create select for change BG
        const HTMLSelectBG = document.getElementById('p_dataName');
        let result = Object.keys(DATA2).filter(s =>  {
            if (DATA2[s].isBG) {
                const opt = document.createElement("option");
                opt.text = DATA2[s].name;
                opt.selected = (dataValues.p.dataName === DATA2[s].name);
                HTMLSelectBG.add(opt);
            };
        });  
        const myAccordion = new Accordion(document.getElementById("accordion"), { multiple: true });
        create_dataIntepretor.call(cage, dataValues); // create the data Interpretor listener for inputs and buttons
        setHTMLWithData.call(this, dataValues); // asign dataValues to HTML inspector
    };
    
    // setup for tile in map
    function open_SaveSetup(stage) {
        if(iniSetupIzit()){return console.error('please Wait izit not cleared')}
        iniSetupIzit();
        iziToast.info( $PME.izit_saveSetup(stage) );
        const myAccordion = new Accordion(document.getElementById("accordion"), { multiple: true });
        create_dataIntepretor.call(stage); // create the data Interpretor listener for inputs and buttons
    };
        
    // open data HTML inspector
    function create_dataIntepretor(dataValues){
        const dataIntepretor = document.getElementById("dataIntepretor");
        dataIntepretor.oninput = (function(event){
            const e = event.target;
            const type = e.type;
            const id = e.id.split("_");
            
            if(type === "text"){
                dataValues[id[0]][id[1]] = String(e.value);
            };
            if(type === "number"){
                // check if locked d,n
                const isLockedDN = ["d","n"].contains(id[0]) && document.getElementById(`${id[1]}_lockDN`).checked;
                const index = e.attributes.index.value; // x:,y: ?
                const is2DArray = Array.isArray(dataValues[id[0]][[id[1]]]);
                if(isLockedDN){
                    if( is2DArray ){
                        const oldValue = dataValues[id[0]][[id[1]]][index];
                        const isStepUp = (+e.value - oldValue > 0 );
                        const id2 = (id[0]==="d") && "n" || "d";
                        const ee = document.querySelectorAll(`#${id2}_${id[1]}`)[index];
                        isStepUp ? ee.stepUp() : ee.stepDown();
                        dataValues[id[0]][id[1]][index] = +e.value;
                        dataValues[id2][id[1]][index] = +ee.value;
                    }else{
                        const oldValue = dataValues[id[0]][[id[1]]];
                        const isStepUp = (+e.value - oldValue > 0 );
                        const id2 = (id[0]==="d") && "n" || "d";
                        const ee = document.getElementById(`${id2}_${id[1]}`);
                        isStepUp ? ee.stepUp() : ee.stepDown();
                        dataValues[id[0]][id[1]] = +e.value;
                        dataValues[id2][id[1]] = +ee.value;
                    }
                }else{
                    if(is2DArray){
                        dataValues[id[0]][id[1]][index] = +e.value;
                    }else{
                        dataValues[id[0]][id[1]] = +e.value;
                    }
                };
            };
            if(type === "select-one"){
                // convert to boolean.
                e.value = (e.value==="true" || e.value === "false")? JSON.parse(e.value) : e.value;
                dataValues[id[0]][id[1]] = e.value;
                // if is BG, create new base
                if(id[1] === "dataName"){
                    const dataBase = DATA2[e.value];
                    $stage.scene.createBackgroundFrom(dataValues,dataBase); // pass dataBase
                    dataValues = this.getDataValues(dataBase);
                    dataBase && this.createBases(dataBase);
                    setHTMLWithData.call(this, dataValues); // asign dataValues to HTML inspector
                };
                if(dataValues.p.type === "animationSheet"){
                    this.play(0);
                }
            };
            this.asignValues(dataValues, false);
            this.Debug && refreshDebugValues.call(this);
        }).bind(this);
        // BUTTONS
        dataIntepretor.onclick = (function(event){
            const e = event.target; // buttons
            if(e.type === "button"){
                if(e.id==="copy"){ copyData(OBJ, Data_Values) };// apply to all and close
                if(e.id==="save"){ startSaveDataToJson(true) };// call save json with scan options true:
                if(e.id==="close"){ close_dataInspector(); };// call save json with scan options true:
                if(e.id==="apply"){ close_dataInspector.call(this, dataValues) };// apply and close
                if(e.id==="cancel"){close_dataInspector.call(this)};// cancel and close
                if(e.id==="reset"){ // reset dataValues to old dataValues
                    this.asignValues(this.dataValues, false);
                    setHTMLWithData.call(this, this.dataValues); // asign dataValues to HTML inspector
                    dataValues = getDataValues.call(this);
                    this.Debug && refreshDebugValues.call(this);
                };
            };
        }).bind(this);
    };

    // LIGHT DATA2 INSPECTOR listener
    function create_dataLightIntepretor(dataValues){
        const dataIntepretor = document.getElementById("dataIntepretor");
        dataIntepretor.oninput = (function(event){
            const e = event.target;
            const type = e.type;
            const id = e.id.split("_")[1]; // no need p,d,n for light
            if(type === "text"){ dataValues[id] = String(e.value) };
            if(type === "number"){ dataValues[id] = +e.value };
            if(type === "select-one"){ dataValues[id] = JSON.parse(e.value) };
            this.asignValues(dataValues, false);
            //refreshDebugValues.call(this);
        }).bind(this);
        // BUTTONS
        dataIntepretor.onclick = (function(event){
            const e = event.target; // buttons
            if(e.type === "button"){
                if(e.id==="copy"){ copyData(OBJ, Data_Values) };// apply to all and close
                if(e.id==="apply"){ close_dataLightInspector.call(this, dataValues) };// apply and close
                if(e.id==="cancel"){close_dataLightInspector.call(this)};// cancel and close
                if(e.id==="reset"){ // reset dataValues to old dataValues
                    this.asignValues(this.dataValues, false);
                    setHTMLWithData.call(this, this.dataValues); // asign dataValues to HTML inspector
                    dataValues = this.getDataValues();
                    //refreshDebugValues.call(this);
                };
            };
        }).bind(this);
    };

    // asign props value to HTML data Inspector
    function setHTMLWithData(dataValues, Data_CheckBox, _jscolor, _Falloff) {
        if(dataValues.p){ // OBJS
            dataValues.p && computeHTMLValue("p",dataValues.p);
            dataValues.d && computeHTMLValue("d",dataValues.d);
            dataValues.n && computeHTMLValue("n",dataValues.n);
        }else{
            computeHTMLValue("p",dataValues); // LIGHT
        }
        function computeHTMLValue(K, data){
            Object.keys(data).forEach(key => {
                const value = data[key];
                const id = `${K}_${key}`; // html id
                const colorIndex = (K==="n") && 1 || 0; // index of jscolors array d,n //TODO: DELETE ME , 
                let e = Array.isArray(value)? document.querySelectorAll(`#${id}`) : document.getElementById(id);
                if(e){
                    e.length===1? e = e[0] : void 0; // if value are array but not html array,
                    switch (key) {
                        case "position":case "scale":case "skew":case "pivot":case "anchor":
                            for (let i = 0, l = e.length; i < l; i++) {
                                e[i].value = value[i];
                            }
                            break;
                            case "tint":case "setDark":case "setLight":break;
                        default:
                            e.value = value || false ; // prevent choice 'undefined'
                            break;
                    };
                };
            });
        }; 
    };

    // close the data HTML inspector
    function close_dataInspector(dataValues){
        // if is a gui inspectors ?
        if(this.dataValues){
            // if cancel, and if old value not have heaven, destroyHeaven
            if(!dataValues && this.dataValues.d && !this.dataValues.d.setDark){
                this.d.destroyHeaven();
                this.n.destroyHeaven();
            };
            const oldDataBack = dataValues || this.dataValues; // add or back to old values
            this.asignValues(oldDataBack, true);
        };

        iziToast.hide({transitionOut: 'flipOutX',onClosed:() => {iziToast.opened = false;}}, document.getElementById("dataEditor") ); // hide HTML data Inspector
    
        setStatusInteractiveObj(true); // pull back tiles interactions
        open_editor(true);
    };

    // close the data HTML inspector LIGHT
    function close_dataLightInspector(dataValues){
        const oldDataBack = dataValues || this.dataValues; // add or back to old values
        this.asignValues(oldDataBack, true);
        iziToast.hide({transitionOut: 'flipOutX',onClosed:() => {iziToast.opened = false}}, document.getElementById("dataEditor") ); // hide HTML data Inspector
        setStatusInteractiveObj(true); // pull back tiles interactions
        open_editor(true);
    };
//#endregion



    //#region [rgba(0, 140, 100, 0.1)]
    // ┌------------------------------------------------------------------------------┐
    // PATHS EDITORS
    // └------------------------------------------------------------------------------┘
    // Draw path mode
    let DrawPathMode = false; // flag,switch from icon buttons, DrawPathMode freeze all other interactions
    let PathsBuffers = []; // asign path by order
    let MouseHoldDrawPath = false; // actived when DrawPathMode + holdClick
    // disable interactive and forcus on path
    function open_drawPathMode(stage) {
        DrawPathMode = true;
        $Objs.list_master.forEach(e => {
            e.interactive = false;
            e.alpha = 0.1;
        });
        $Objs.list_cases.forEach(c => {
            c.interactive = true;
            c.alpha = 1;
        });
        refreshPath();
    };

    function close_drawPathMode(stage) {
        DrawPathMode = false;
        PathsBuffers = [];
        MouseHoldDrawPath = false; 
        $Objs.list_master.forEach(e => {
            e.interactive = true;
            e.alpha = e.dataValues.p.alpha; // restor
        });
        refreshPath();
    };

    function refreshPath() {
        const zoomBuffer = Zoom.clone();
        Zoom.set(1);
        $Objs.list_cases.forEach(c => {
            // clear reset grafic path
            c.Debug.path.forEach(p => { c.removeChild(p) }); // remove path grafics
            c.Debug.path = [];
            if(DrawPathMode){
                Object.keys(c.pathConnexion).forEach(id => { // connextion id
                    const cc = $Objs.list_cases[id];
                    let point = new PIXI.Point(0,0);
                    const cXY = c.toGlobal(point)
                    const ccXY = cc.toGlobal(point)
                    const dX = ccXY.x-cXY.x
                    const dY = ccXY.y-cXY.y;
                    const path = new PIXI.Graphics();
                    path.lineStyle(4, 0xffffff, 1);
                    path.moveTo(0,0).lineTo(dX, dY).endFill();
                    const scaleXY = new PIXI.Point(~~1/c.scale.x,~~1/c.scale.y);
                    path.scale.copy(scaleXY);
                    c.addChild(path);
                    c.Debug.path.push(path);
                    c.addChild(path);
                });
            };
        });
        Zoom.copy(zoomBuffer);
    };

    function checkPathMode(cage) {
        if(MouseHoldDrawPath){
            // si pas deja dans buffer: ajouter les connextion
            if(!PathsBuffers.contains(cage)){
                PathsBuffers.push(cage);
                // create debug number
                const txt = new PIXI.Text(PathsBuffers.length,{fontSize:42,fill:0xff0000,strokeThickness:8,stroke:0x000000});
                txt.pivot.y = txt.height+cage.Debug.bg.height;
                cage.Debug.pathIndexTxt = txt;
                cage.addChild(txt);
            }else 
             // si deja dans buffer, enlever tous les autre devant
            if(PathsBuffers.contains(cage)){
                const index = PathsBuffers.indexOf(cage);
                for (let i=PathsBuffers.length-1; i>index; i--) {
                    const c = PathsBuffers[i];
                    c.removeChild(c.Debug.pathIndexTxt);
                    delete c.Debug.pathIndexTxt;
                    PathsBuffers.pop();
                };
            };
        };
    };

    function removePath(cage) {
        // remove persitance path connextions
        const currentID = $Objs.list_cases.indexOf(cage);
        for (const id in cage.pathConnexion) {
            delete $Objs.list_cases[id].pathConnexion[currentID];
        }
        cage.pathConnexion = {};
        refreshPath();
    };

    // finalise compute path draw in buffers
    //TODO: rendu ici , verifier le syste ID pour pathConnexion.
    function computeDrawPathBuffers() {
        let preview,current,next;
        for (let i=0, l=PathsBuffers.length; i<l; i++) {
            const preview = PathsBuffers[i-1];
            const current = PathsBuffers[i  ];
            const next    = PathsBuffers[i+1];
            const preview_id = $Objs.list_cases.indexOf(preview);
            const current_id = $Objs.list_cases.indexOf(current);
            const next_id    = $Objs.list_cases.indexOf(next   );
            //TODO: FIXME: compute distance via global position for Math.hypot
            if(preview){
                current.pathConnexion[String(preview_id)] = Math.hypot(preview.x-current.x, preview.y-current.y);;
            };
            if(next){
                current.pathConnexion[String(next_id)] = Math.hypot(next.x-current.x, next.y-current.y);;
            };
        };
        // clear number text debug
        PathsBuffers.forEach(cage => {
            cage.removeChild(cage.Debug.pathIndexTxt);
            delete cage.Debug.pathIndexTxt;
        });
        console.log('PathsBuffers: ', PathsBuffers);
        PathsBuffers = [];
        
        refreshPath();
    };
//#endregion


    //#region [rgba(40, 5, 50,0.2)]
    // ┌------------------------------------------------------------------------------┐
    // METHOD CREATE CAGE OBJECT SPRITES 
    // └------------------------------------------------------------------------------┘
    // refresh Debug elements with new values
    function refreshDebugValues(){
        this.Debug.bg.anchor.copy(this.d.anchor || new PIXI.Point(0.5,1));
        // piv
        this.Debug.piv.rotation = this.rotation*-1;
        this.Debug.piv.position.copy(this.pivot);
        this.Debug.piv.scale.x = 1/Math.cos(this.skew.y);
        this.Debug.piv.pivLine.skew.y = -this.skew.y;
        this.Debug.piv.scale.y = 1/Math.cos(this.skew.x);
        this.Debug.piv.pivLine.skew.x = -this.skew.x;

        // hitZone
        this.Debug.hitZone.clear();
        const LB = this.getLocalBounds();
        this.hitArea = LB;
        this.Debug.hitZone.lineStyle(2, 0x0000FF, 1).drawRect(LB.x, LB.y, LB.width, LB.height);
    }

    // build previews sprites
    function create_Previews(textures){
        const cage = new PIXI.Container();
        let totalWidth = 0;
        for (let i = 0, l = textures.length; i < l; i++) { // build the preview sheets
            const sprite = new PIXI.Sprite(textures[i]);
            sprite.scale.set( getRatio(sprite, 350, 350) );
            sprite.anchor.y = 1;
            sprite.x = totalWidth;
            totalWidth+=sprite.width;
            cage.addChild(sprite);
        };
        const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        (bg.width = cage.width), (bg.height = cage.height);
        bg.anchor.y = 1;
        bg.alpha = 0.3;
        cage.addChildAt(bg,0);
        return cage;
    };

    function create_IconsFilters(dataBase){
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
        if(dataBase.type === "tileSheet"){ addIconFrom('filter_texturePacker.png'),0 };
        if(dataBase.type === "animationSheet"){ addIconFrom('filter_animation.png'),1 };
        if(dataBase.type === "spineSheet"){ addIconFrom('filter_spine.png'),2 };
        if(dataBase.normal){ addIconFrom('filter_normal.png'),3 };
        if(dataBase.name.contains("-0")){ addIconFrom('info_multiPack.png'),4 };
        cage.addChildAt(bg,0);
        cage.filtersID = filtersID;
        cage.bg = bg;
        bg.tint = 0x000000;
        bg.alpha = 0.5;
        bg.width = 30;
        bg.height = y;
        return cage;
    };

    function create_DebugElements(dataBase){
        const Debug = {bg:null, previews:null, an:null, piv:null, ico:null};
        if(!this.type){ // if no data type, it a "thumbs"
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const previews = create_Previews(dataBase.baseTextures); // sprites preview reference;
            const icons = create_IconsFilters(dataBase); // icons
            // setup
            icons.x = this.d.width;
            bg.width = this.d.width + icons.width;
            bg.height =  Math.max(this.d.height, icons.height);
            //bg.getBounds();
            Debug.bg = bg;
            Debug.previews = previews;
            Debug.ico = icons;
            Debug.bg.name = "debug-bg";
            Debug.previews.name = "debug-previews";
            Debug.ico.name = "debug-ico";
            this.Debug = Debug;
            this.addChildAt(Debug.bg,0);
            this.addChild(this.Debug.ico);
        };
        if(this.type === "tileSheet" || this.type === "animationSheet" || this.type === "spineSheet"){
            let w = this.d.width;
            let h = this.d.height;
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const an = new PIXI.Sprite( $app.renderer.generateTexture( drawRec(0,0, 14,14, '0x000000', 1, 6) ) ); // x, y, w, h, c, a, r, l_c_a
            const piv = new PIXI.Container(); //computeFastModes need a container for skews
            const pivLine = new PIXI.Sprite( $app.renderer.generateTexture( drawRec(0,0, w,4, '0xffffff', 1) ) );//computeFastModes need a container
            // BG
            bg.width = w, bg.height = h;
            bg.tint = 0xffffff;
            bg.anchor.copy(this.d.anchor || new PIXI.Point(0.5,1));
            this.parentGroup? bg.parentGroup = PIXI.lights.diffuseGroup : void 0;

            //anchor point
            var txt = new PIXI.Text("A",{fontSize:12,fill:0xffffff});
            txt.anchor.set(0.5,0.5);
            an.anchor.set(0.5,0.5);
            an.addChild(txt);

            // pivot
            var txt = new PIXI.Text("↓■↓-P-↑□↑",{fontSize:12,fill:0x000000,strokeThickness:4,stroke:0xffffff});
                txt.anchor.set(0.5,0.5);
            pivLine.anchor.set(0.5,0.5);
            piv.position.copy(this.pivot);
            piv.pivLine = pivLine;
            piv.txtGroupeID = txt;
            piv.addChild(pivLine);
            pivLine.addChild(txt);

            // hitArea hitZone
            const lb = this.getLocalBounds();
            const hitZone = new PIXI.Graphics();
            hitZone.lineStyle(2, 0x0000FF, 1).drawRect(lb.x, lb.y, lb.width, lb.height);
            hitZone.endFill();

            Debug.path = [];
            Debug.bg = bg;
            Debug.an = an;
            Debug.piv = piv;
            Debug.hitZone = hitZone;
            Debug.bg.name = "debug-bg";
            Debug.an.name = "debug-an";
            Debug.piv.name = "debug-piv";
            Debug.hitZone.name = "debug-hitZone";

            

            this.Debug = Debug;
            this.addChildAt(Debug.bg,0);
            this.addChild(this.Debug.an, this.Debug.piv, this.Debug.hitZone);
        };
    };

    // create tiles for ThumbsGUI libs
    function build_ThumbsGUI(dataBase){
        const cage = new PIXI.CageContainer(dataBase);
        cage.dataBase = dataBase; // ref database for thumbs only
        cage.d.scale.set( getRatio(cage.d, 134, 100)); //ratio for fitt in (obj, w, h)
        create_DebugElements.call(cage,dataBase);
        cage.buttonType = "thumbs";
        cage.alpha = 0.75;
        cage.interactive = true;
        cage.on('pointerover', pointer_overIN);
        cage.on('pointerout', pointer_overOUT);
        cage.on('pointerup', pointer_UP);
        return cage;
    };

    // create tiles for tilesGUI
    function build_tilesGUI(dataBase, textureName){
        let cage;
        switch (dataBase.type) {
            case "animationSheet":
            cage =  new PIXI.ContainerAnimations(dataBase, textureName);break;
            case "spineSheet":
            cage =  new PIXI.ContainerSpine(dataBase, textureName);break;
            default:
            cage =  new PIXI.ContainerTiles(dataBase, textureName);break;           
        }
        //delete dataDefault.p.parentGroup; // remove parentGroupe because in the tilesGui, we dont use parents and normal
        create_DebugElements.call(cage, dataBase);
        // hide non essential for tileLibs
        cage.Sprites.n? cage.Sprites.n.renderable = false : void 0;
        //cage.Debug.piv? cage.Debug.piv.renderable = false : void 0;

        
        cage.interactive = true;
        cage.on('pointerover', pointer_overIN);
        cage.on('pointerout', pointer_overOUT);
        cage.on('pointerup', pointer_UP);
        
        cage.on('zoomTileLibs', wheelInLibs);
        //cage.on('pointermove', checkAnchor); TODO: permet de changer le anchor par default de 0.5 a unknow...
        cage.buttonType = "tileLibs";
        return cage;
    };

    // create tiles for mouse or map
    function build_Sprites(fromCage){
        const dataBase = DATA2[fromCage.dataValues.p.dataName];
        const textureName = fromCage.dataValues.p.textureName;
        const dataValues = fromCage.getDataValues(); // update and clone dataValues from ref
        // hack parentGroup and also Anchors
            dataValues.p.parentGroup = +CurrentDisplayGroup; // hack current parent groups
        let cage;
        switch (dataBase.type) {
            case "animationSheet":
            cage =  new PIXI.ContainerAnimations(dataBase, textureName, dataValues);break;
            case "spineSheet":
            cage =  new PIXI.ContainerSpine(dataBase, textureName, dataValues);break;
            default:
            cage =  new PIXI.ContainerTiles(dataBase, textureName, dataValues);break;           
        }
        create_DebugElements.call(cage, dataBase);

        if(fromCage.buttonType === "tileLibs" || fromCage.buttonType === "tileMap"){
            cage.buttonType = "tileMouse";
            cage.interactive = true;
        }else
        if(fromCage.buttonType === "tileMouse"){
            cage.buttonType = "tileMap";
            cage.interactive = false;
        };
        cage.on('pointerup', pointer_UP);
        cage.on('pointerdown', pointer_DW);
        cage.on('pointerover', pointer_overIN);
        cage.on('pointerout', pointer_overOUT);
        console.log('cage: ', cage);
        return cage;
        
    };
 

//#endregion

//#region [rgba(1, 20, 40,0.2)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘
    function show_tileSheet(InLibs) {
        // check if alrealy opened ???  open_tileSheet // return hide
        if(check_tileSheetStatus(InLibs)){return};
        // create tiles from a LIST ARRAY for the tilesBox
        CAGE_TILESHEETS.name = InLibs.dataName;
        
        const list = [];
        const dataBase = DATA2[InLibs.dataName];
        const textures = dataBase.textures || dataBase.skins;
        EDITOR.skeleton.findSlot("TileBarLeft").title.text = `(${Object.keys(textures).length}): ${dataBase.name}.json`; // update title 
        Object.keys(textures).forEach(textureName => {
            const cage = build_tilesGUI(dataBase, textureName);
            list.push(cage); // reference,  sheetName
            CAGE_TILESHEETS.addChild(cage);
        });
        CAGE_TILESHEETS.list = list;
        // if cache not registered, compute path or copy value from cache.
        const cacheDataName = (InLibs.dataBase.name);
        if(!CACHETILESSORT[cacheDataName]){
            CACHETILESSORT[cacheDataName] = pathFindSheet(list,20);
        }else{ // alrealy exist caches positions
            list.forEach(cage => {
                const point = CACHETILESSORT[cacheDataName][cage.textureName];
                cage.position.copy(point ); 
            });
        };
        CAGE_TILESHEETS.scale.set(0.6,0.6); // reset zoom if first time 
        const exeed = CAGE_TILESHEETS.getLocalBounds();
        list.forEach(element => {
            element.x+= Math.abs(exeed.x);
            element.y+= Math.abs(exeed.y);
        });
    };

    function check_tileSheetStatus(InLibs) {
        // if open, and same name or diff name, hide or clear
        const sameName = CAGE_TILESHEETS.name === InLibs.dataName;

        if(CAGE_TILESHEETS.renderable && sameName){ close_tileSheet(); return true; };
        if(CAGE_TILESHEETS.renderable && !sameName){ clear_tileSheet(); return false; }
        else{ 
            open_tileSheet(!sameName);
            return sameName;}
        
        
    };

    function open_tileSheet(clear) {
        // remove all, but keep the mask as child[0]
        EDITOR.state.setAnimation(2, 'showTileSheets', false);
        CAGE_TILESHEETS.renderable = true;
        CAGE_TILESHEETS.visible = true; // event manager
        clear && clear_tileSheet();
    };


    function close_tileSheet(clear) {
        // CAGE_TILESHEETS.opened = false;
        CAGE_TILESHEETS.renderable = false;
        CAGE_TILESHEETS.visible = false; // event manager
        EDITOR.state.setAnimation(2, 'hideTileSheets', false);
        clear && clear_tileSheet();
    };

    function clear_tileSheet(){
        CAGE_TILESHEETS.name = null;
        CAGE_TILESHEETS.list = [];
        CAGE_TILESHEETS.removeChildren();// TODO: KEEP MASK
        PIXI.utils.clearTextureCache();
    }

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

    function close_editor(closeTileSheet) {
        EDITOR.state.setAnimation(1, 'hideFullEditor', false);
        CAGE_LIBRARY.renderable = false;
        CAGE_LIBRARY.visible = false; // event manage
        closeTileSheet && close_tileSheet();
    };

    function setStatusInteractiveObj(status, protect){
        for (let i=0, l= $Objs.list_master.length; i<l; i++) {
            const _cage =  $Objs.list_master[i];
            if(_cage===protect){continue};
            _cage.interactive = status;
        };
    };

    let ObjMouse = null;
    function add_toMouse(InTiles) {
        setStatusInteractiveObj(false); // disable interactivity
        close_editor(true);
        const cage = build_Sprites(InTiles) //(InTiles.Data, InTiles.Sprites.groupTexureName);
        cage.position.set( mMX, mMY);
        CAGE_MAP.addChild(cage);
        CAGE_MOUSE.list = cage;
        cage.buttonType = "tileMouse";
        // disable other interactive obj map
        
        const LB = cage.getLocalBounds();
        cage.Debug.hitZone.clear();
        cage.Debug.hitZone.lineStyle(2, 0xff0000, 1).drawRect(LB.x, LB.y, LB.width, LB.height);
        LB.pad(1920,1080);
        cage.hitArea = LB;//new PIXI.Rectangle(0,0, cage.width,cage.height);
        
        FreezeMouse = false; // force disable the mosue freeze
        ObjMouse = cage;
        return cage;
    };

    // add to map new obj + Obj.Asign a copy unique of html Editor json asigned addtomap
    function add_toScene(alreadyOnMap) {
        if(alreadyOnMap){
            // si exist sur la map, cetai juste un depalcement , dont call new build_Sprites
            this.buttonType = "tileMap";
            this.interactive = false;
            CAGE_MOUSE.list = null;
            this.asignValues( PIXI.CageContainer.prototype.getDataValues.call(this) );
            ObjMouse = null;
            return add_toMouse(this);
        }else{
            const cage = build_Sprites(this) //(InTiles.Data, InTiles.Sprites.groupTexureName);
            //TODO: if pined in a line. get position of old prite this
            if(FreezeMouse){ // freeze mouse allow to keep the position of the clone this x,y
                FreezeMouse = false;
                cage.x = this.x;
                cage.y = this.y;
            }else{
                cage.x = mMX;
                cage.y = FreezeMY?FreezeMY.y : mMY;
            };
            cage.Debug.bg.renderable = false;
            CAGE_MAP.addChild(cage);
            $Objs.list_master.push(cage);
    
            cage.Debug.hitZone.clear();
            const LB = cage.getLocalBounds();
            cage.hitArea = LB;//new PIXI.Rectangle(0,0, cage.width,cage.height);
            cage.Debug.hitZone.lineStyle(2, 0x0000FF, 1).drawRect(LB.x, LB.y, LB.width, LB.height);
        };
    };

    function execute_buttons(buttonSprite) {
        const name = buttonSprite.region.name;
        if(name.contains("icon_pathMaker")){ // draw path MODE
            if(!DrawPathMode){
                open_drawPathMode()
                buttonSprite._slot.color.b = 0;
                buttonSprite._slot.color.r = 1;
                buttonSprite.scale.set(1.5,-1.5);
            }else{
                close_drawPathMode();
                buttonSprite._slot.color.b = 1;
                buttonSprite._slot.color.r = 1;
                buttonSprite.scale.set(1,-1);
            }   
        };
        if(name.contains("icon_setup")){
             open_dataBGInspector($stage.scene.background); // edit ligth brigth , and custom BG            
        };
        if(name.contains("icon_grid")){
            drawGrids();
        };
        if(name.contains("icon_masterLight")){
            open_stageLightInspector($stage.LIGHTS.ambientLight); // edit ligth brigth , and custom BG
        };
        if(name.contains("icon_spotLight")){
            open_stageLightInspector($stage.LIGHTS.directionalLight); // edit ligth brigth , and custom BG
        };
        if(name.contains("icon_drawLine")){
            addDebugLineToMouse();
        }
        if(name.contains("icon_Save")){
            open_SaveSetup($stage);
        }
        if( name.contains("gb") ){ // pixi-layers buttons only
            // old gb
            const oldGB = EDITOR.skeleton.findSlot("gb"+CurrentDisplayGroup);
            oldGB.color.a = 0.35;
            oldGB.color.g = 1;
            oldGB.currentSprite.scale.set(1,-1);
            // new gb
            CurrentDisplayGroup = +name.substr(-1);
            CAGE_MOUSE.list? CAGE_MOUSE.list.parentGroup = $displayGroup.group[CurrentDisplayGroup] : void 0;
            buttonSprite._slot.color.a = 1;
            buttonSprite._slot.color.g = 2;
            buttonSprite.scale.set(1.25,-1.25);
            EDITOR.state.setAnimation(3, 'shakeDisplay', false);
        };
        if( name.contains("icon_showHideSprites") ){
            hideShowDebugElements();
        }
    };

//#endregion

//#region [rgba(0, 0, 0,0.1)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘
    // mX,mY: mouse Position
    function show_previews(cage, show) {
        CAGE_MOUSE.previews.removeChildren();
        if(show){
            CAGE_MOUSE.previews.addChild(cage.Debug.previews);
        }
        CAGE_MOUSE.previewsShowed = !!show;
    };

    // mX,mY: mouse Position
    function checkAnchor() {
        if (this.type === "spineSheet") { return }; // spine dont have custom anchor 
        if(this.mouseIn){ // if pointer_overIN
            const z = CAGE_TILESHEETS.scale.x; //zoom factor
            let b = this._boundsRect;
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
            this.Debug.an.position.set(x/z,y/z);
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
        if( slot.name.contains("gb") && slot.name.contains(String(CurrentDisplayGroup)) ){

        }else{
            sprite._filters = [ FILTERS.OutlineFilterx4 ]; // thickness, color, quality
            sprite.scale.set(1.25,-1.25);
            slot.color.a = 1;
        }

    };

    function clearFiltersFX2(sprite,slot){ // CurrentDisplayGroup
        if( slot.name.contains("gb") && slot.name.contains(String(CurrentDisplayGroup)) ){

        }else{
            sprite._filters = null; // thickness, color, quality
            sprite.scale.set(1,-1);
            slot.color.a = 0.35;
        }

    };

    // active filter1, for thumbs
    function activeFiltersFX3(cage,checkHit){ //TODO: ALT fpour permuter entre les mask et alpha, mettre dans un buffer []
        cage.Debug.hitZone.renderable = true;
        cage._filters = [ FILTERS.OutlineFilterx8Green];
        cage.Sprites.d._filters = [ FILTERS.OutlineFilterx8Green ,FILTERS.OutlineFilterx6White];
    };

    function clearFiltersFX3(cage,hideInteractive){ //TODO: ALT fpour permuter entre les mask alpha, mettre dans un buffer []
        cage._filters = null;
        cage.Sprites.d._filters = null; // thickness, color, quality ,
        cage.Sprites.n? cage.Sprites.n._filters = null : void 0; // thickness, color, quality ,
        cage.Debug.bg.renderable = false;
        cage.Debug.hitZone.alpha = 1;
        cage.Debug.piv.alpha = 1;
        if(hideInteractive){
            cage.interactive = false;
            cage.Debug.hitZone.alpha = 0.3;
            cage.Debug.piv.alpha = 0.5;
            cage.Sprites.d._filters = [new PIXI.filters.AlphaFilter (0.2)];
            cage.Sprites.n? cage.Sprites.n._filters = [new PIXI.filters.AlphaFilter (0.2)] : void 0;
            InMapObj = null;
        };
    };

    function disableFastModes(cage){
        console.log('cage: ', cage);
        if((cage.buttonType === "tileMap" || cage.buttonType === "tileMouse") ){
            //MouseHold.Debug.fastModes.renderable = false;
            fastModes.renderable = false;
            FastModesObj = null;
        }
         // reprendre interactivity only a tileMouse et recalculer les nouveau dataValues
        if(cage.buttonType !== "tileMouse"){
            setStatusInteractiveObj(true); // disable interactivity
        };
    };

    function activeFastModes(cage, modeKey){
        if((cage.buttonType === "tileMap" || cage.buttonType === "tileMouse") ){
            if(FastModesKey){ fastModes.txtModes[FastModesKey]._filters = null };
            FastModesKey = modeKey || FastModesKey || "p";
            fastModes.txtModes[FastModesKey]._filters = [FILTERS.OutlineFilterx8Red]
            FastModesObj = cage;
            fastModes.renderable = true;
            cage.Debug.bg.renderable = true;
            cage.Debug.an.renderable = true;
            cage.Debug.hitZone.renderable = true;
            cage.Debug.piv.renderable = true;
            FreezeMouse = true;
            setStatusInteractiveObj(false, cage);
        }
    };

    function refreshMouse() {
        MovementX = $mouse.x - mX;
        MovementY = $mouse.y - mY;
        mX = $mouse.x, mY = $mouse.y;
        mMX = (mX/Zoom.x)+CAGE_MAP.pivot.x;
        mMY = (mY/Zoom.y)+CAGE_MAP.pivot.y;

        // if mouse have sprite =>update
        if(CAGE_MOUSE.list && !MouseHold && !FreezeMouse){ // update cages list hold by mouse
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

    function startMouseHold(cage){
        clearTimeout(MouseTimeOut);
        MouseHold && disableFastModes(MouseHold);
        MouseHoldDrawPath && computeDrawPathBuffers();
        //MouseHold? MouseHold.Data_Values = getDataJson(MouseHold) : void 0; // if obj was hold, update all change made from mouse edit
        MouseHold = false;
        MouseHoldDrawPath = false;
        if(cage){ // active mouse MouseHold after 160 ms
            MouseTimeOut = setTimeout(() => {
                if(cage.mouseIn){
                    if(DrawPathMode){
                        MouseHoldDrawPath = true;
                        checkPathMode(cage);
                    }else{
                        HoldX = +mX, HoldY = +mY;
                        MouseHold = cage;
                        if( ["tileMap","tileMouse"].contains(cage.buttonType) ){
                            activeFastModes(cage);
                        };
                    };
                };
            }, 160);
        }else{ // disabling mousehold and affected feature
            // collapse the CAGE_LIBRARY mask
            
            if(EDITOR.expendLibsMode){
                EDITOR.state.setAnimation(3, 'colapseThumbLibs', false);
                EDITOR.expendLibsMode = false;
                CAGE_LIBRARY.mask.position.y = -8;
                CAGE_LIBRARY.mask.height = 105;
                CAGE_LIBRARY.hitArea = new PIXI.Rectangle(0,0,1740,220);
                // hide tilesheet
                if(CAGE_TILESHEETS.opened){
                    CAGE_TILESHEETS.renderable = true;
                    CAGE_TILESHEETS.visible = true; // event manager
                    EDITOR.state.setAnimation(2, 'showTileSheets', false);
                };

            };
        }
    };
    
//#endregion

 
//#region [rgba(0, 5, 5,0.7)]
// ┌------------------------------------------------------------------------------┐
// CHECK INTERACTION MOUSE
// └------------------------------------------------------------------------------┘
    function computeFastModes(Obj) {
        switch (FastModesKey) { // ["p","y","w","s","r","u"]
            case "p": // pivot from position"
                Obj.pivot.x+=MovementX;
                Obj.pivot.y+=MovementY;
                Obj.x+=MovementX*Obj.scale.x;
                Obj.y+=MovementY*Obj.scale.y;
                // update debug
                Obj.Debug.piv.position.copy(Obj.pivot);
            break;
            case "y": // position from pivot
                Obj.pivot.x-=MovementX;
                Obj.pivot.y-=MovementY;
                // update debug
                Obj.Debug.piv.position.copy(Obj.pivot);
            break;
            case "w": // skew mode
                var skewX = Math.sin(MovementX/500)*-1; // smoot mouse
                var skewY = Math.sin(MovementY/500); // smoot mouse
                Obj.skew.y = Math.min(1, Math.max(Obj.skew.y+skewY, -1));
                Obj.skew.x = Math.min(0.5, Math.max(Obj.skew.x+skewX, -0.5));
                // update debug
                Obj.Debug.piv.scale.x = 1/Math.cos(Obj.skew.y);
                Obj.Debug.piv.pivLine.skew.y = -Obj.skew.y;
                Obj.Debug.piv.scale.y = 1/Math.cos(Obj.skew.x);
                Obj.Debug.piv.pivLine.skew.x = -Obj.skew.x;
            break;
            case "s": // Scale mode
                Obj.scale.x-=MovementX/100;
                Obj.scale.y-=MovementY/100;
            break;
            case "r": // Rotation mode
                Obj.rotation+=MovementX/100;
                Obj.Debug.piv.rotation = Obj.rotation*-1;
            break;
            case "u": // Rotation textures
                Obj.Sprites.d.rotation+=MovementX/100;
                Obj.Sprites.n? Obj.Sprites.n.rotation = Obj.Sprites.d.rotation : void 0; //FIXME: SPINE normal are slots and not container
            break;
        }
        Obj.zIndex = Obj.y;
        Obj.Debug.hitZone.clear();
        const LB = Obj.getLocalBounds();
        const color = (Obj.buttonType === "tileMouse") && 0xff0000 || 0x0000FF; // color depending of type
        Obj.hitArea = LB;
        Obj.Debug.hitZone.lineStyle(2, color, 1).drawRect(LB.x, LB.y, LB.width, LB.height);
    };

 
    // TODO: AJOUTER DANS UN TIKS OU UN NOUVEAU LISTENER
    function updateFromTicks(event) {
        //if(iziToast.opened){return}; // dont use mouse when toast editor
        refreshMouse();
        if(MouseHold){
            if( MouseHold.buttonType === "CAGE_TILESHEETS" ){
                
                CAGE_TILESHEETS.list.forEach(cage => {
                    cage.x+= MovementX*1.5;//performe scroll libs mouse
                    cage.y+= MovementY*1.5;//performe scroll libs mouse

                });
            };
            if( MouseHold.buttonType === "CAGE_LIBRARY" ){
                // enlarge the CAGE_LIBRARY mask
                if(!EDITOR.expendLibsMode){
                    EDITOR.state.setAnimation(3, 'expendThumbsLibs', false);
                    EDITOR.expendLibsMode = true;
                    CAGE_LIBRARY.mask.position.y = -8-600;
                    CAGE_LIBRARY.mask.height = 105+600;
                    CAGE_LIBRARY.hitArea = new PIXI.Rectangle(0,0-600,1740,220+600);
                    // hide tilesheet
                    if(CAGE_TILESHEETS.opened){ // was opened
                        CAGE_TILESHEETS.renderable = false;
                        CAGE_TILESHEETS.visible = false; // event manager
                        EDITOR.state.setAnimation(2, 'hideTileSheets', false);
                    };
                };
                CAGE_LIBRARY.list.forEach(cage => {
                    cage.y-= MovementX*0.8;

                });
            };
            
            if( MouseHold.buttonType === "tileMap" || MouseHold.buttonType === "tileMouse" ){
                // compute fast mode
                FastModesObj && computeFastModes(FastModesObj, event);
      
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
    };

    //TODO: VOIR: key H
    // creer un buffer , can la sourit bouge, appeller H, pour active le objet en dessous, si pas object en dessous , ignorer et buffer la list, sinon continuer en loop

    // mouse [=>IN <=OUT] FX
    function pointer_overIN(event){
        this.mouseIn = true;
        switch (this.buttonType) {
            case "thumbs":
                show_previews(this,true);
                activeFiltersFX1(event.currentTarget);
            break;
            case "button":
                !DrawPathMode && activeFiltersFX2(event.currentTarget,this);
            break;
            case "tileLibs":
                activeFiltersFX1(event.currentTarget);
            break;
            case "tileMap":
                InMapObj = event.currentTarget;
                activeFiltersFX3(event.currentTarget, event.data.originalEvent.ctrlKey);
                if(DrawPathMode){
                    checkPathMode(this);
                };
            break;
        };
    };

    function pointer_overOUT(event){
        this.mouseIn = false;
        switch (this.buttonType ) {
            case "thumbs":
                InLibs = null;
                show_previews(this,false);
                clearFiltersFX1(event.currentTarget);
            break;
            case "button":
                !DrawPathMode && clearFiltersFX2(event.currentTarget,this);
            break;
            case "tileLibs":
                clearFiltersFX1(event.currentTarget);
            break;
            case "tileMap":
            
            if(!MouseHold){
                InMapObj = null;
                clearFiltersFX3(event.currentTarget, event.data.originalEvent.ctrlKey);
            }
            break;
        };
    };

    function pointer_DW(event){
        startMouseHold(this); // timeOut check MouseHold
    };

    function pointer_UP(event){
        if(MouseHold || MouseHoldDrawPath){ return startMouseHold(false) };
        startMouseHold(false);
        const _clickRight = event.data.button === 0;
        const clickLeft_ = event.data.button === 2;
        const click_Middle = event.data.button === 1;
        if(_clickRight){// <= clickUp
            if(this.buttonType === "button"){ 
                return execute_buttons(this);
            }
            if(DrawPathMode){return}; // avoid other buttonType if DrawPathMode
            if(LineDraw){ // TODO: MAKE add line to map
                LineDraw.off("pointerup",pointer_UP)
                CAGE_MAP.addChild(LineDraw);
                LineDraw.position.set(mMX,mMY);
                LineDraw.on('pointerover', function(e){ 
                    FreezeMY = e.currentTarget;
                    FreezeMY._filters = [ FILTERS.OutlineFilterx8Green ];
                    e.currentTarget.interactive = false;
                });
                return LineDraw = null;
            }
            if(this.buttonType === "thumbs"){
                return show_tileSheet(this) // || hide_tileSheet();
            }
            if(this.buttonType === "tileLibs"){ 
                return add_toMouse(this);
            }
            if(this.buttonType === "tileMouse"){
                // if alrealy instance of map, c'etais un deplacement d'objet, just need deltete reference
                return add_toScene.call(this, $Objs.list_master.contains(this)); 
            }
            if(this.buttonType === "tileMap" && event.data.originalEvent.ctrlKey){ // in mapObj
                return document.getElementById("dataEditor") ? console.error("WAIT 1 sec, last dataEditor not cleared") : open_dataInspector(this);
            }
            if(this.buttonType === "tileMap" && event.data.originalEvent.altKey){ // in mapObj Clone
                return add_toMouse(this); 
            }
            if(this.buttonType === "tileMap"){ // in mapObj Clone
                setStatusInteractiveObj(false, this);
                close_editor(true);
                this.buttonType = "tileMouse";
                CAGE_MOUSE.list = this;
                FreezeMouse = false;
                ObjMouse = this;
                return; 
            }

        }
        if(clickLeft_){// => clickUp
            // clear filters on left click
            $Objs.list_master.forEach(cage => {
                clearFiltersFX3(cage);
            });
            if (this.buttonType === "tileMap" && DrawPathMode) { // remove path in DrawPathMode
                removePath(this);
            }else
            if(this.buttonType === "tileMouse"){
                // if exist in $Objs registery, go back to dataValues befor click
                if($Objs.list_master.contains(this)){
                    this.buttonType = "tileMap";
                    this.asignValues(this.dataValues);
                    refreshDebugValues.call(this);
                }else{
                    CAGE_MAP.removeChild(CAGE_MOUSE.list);
                }
                setStatusInteractiveObj(true);
                open_editor(true);
                ObjMouse = null;
                return CAGE_MOUSE.list = null;
            }
            if(this.buttonType === "tileMap" && event.data.originalEvent.ctrlKey){//TODO: delete the current objsmap selected
                const index = $Objs.destroy(this);
                iziToast.info( $PME.removeSprite(this, index) );
                InMapObj = null;
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
        CAGE_MAP.toLocal(pos, null, MemCoorZoom1);
        if(event.wheelDeltaY>0){
            Zoom.x+=0.1,Zoom.y+=0.1
        }else{
            if(Zoom._x>0.4){ Zoom.x-=0.1, Zoom.y-=0.1 }; 
        };
        CAGE_MAP.toLocal(pos, null, MemCoorZoom2);  // update after scale
        CAGE_MAP.pivot.x -= (MemCoorZoom2.x - MemCoorZoom1.x);
        CAGE_MAP.pivot.y -= (MemCoorZoom2.y - MemCoorZoom1.y);
        ScrollX -= (MemCoorZoom2.x - MemCoorZoom1.x);
        ScrollY -= (MemCoorZoom2.y - MemCoorZoom1.y);
    

    };

    function keydown_Editor(event) {
        if( isFinite(event.key) ){
            const spriteSlot = EDITOR.skeleton.findSlot("gb"+event.key).currentSprite;
            spriteSlot && execute_buttons(spriteSlot);
        };

        if(FastModesObj){
            const modeKey = event.key.toLowerCase();
            const keyList = ["p","y","w","s","r","u"]; 
            if( keyList.contains(modeKey) ){
                activeFastModes(FastModesObj, modeKey); // asign FastModesKey
            }else
            if(event.altKey){
                console.log(FastModesKey);
                const index = keyList.indexOf(FastModesKey);
                const nextIndex = keyList[index+1] || keyList[0];
                activeFastModes(FastModesObj, nextIndex);
            };
        };

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
                    };
                });
            };
        };
        if(event.ctrlKey && (event.key === "v" || event.key === "V")){ // if in Obj, make other transparent
            const mousePosition = new PIXI.Point(mX,mY);
            const found = $mouse.interaction.hitTest(mousePosition);
            if (found && found.buttonType === "tileMap") { 
                return pasteCopyDataIn(found);
            };
        };
        // if in a obj map and click 'H', disable the interactivity for get obj zIndex bewllow
        if (!CAGE_MOUSE.list && (event.key === "h" || event.key === "H") && InMapObj) {
            clearFiltersFX3(InMapObj,true); // hideInteractive:true
        };
        // if in a obj map and click 'F', hide elements hitted the InMapObj to focus on im
        if (!CAGE_MOUSE.list && (event.key === "f" || event.key === "F") && InMapObj) {
            setStatusInteractiveObj(false, InMapObj); // protect InMapObj
            $Objs.list_master.forEach(cage => {
                if(cage===InMapObj){//focus 
                    InMapObj.Debug.bg.renderable = true;
                }else{ // unFocus
                    const hit = hitCheck(cage,InMapObj);
                    if(hit && cage.zIndex>InMapObj.zIndex){
                        cage.Sprites.d._filters = [new PIXI.filters.AlphaFilter(0.3),FILTERS.OutlineFilterx8Red];
                        cage.Sprites.n._filters = [new PIXI.filters.AlphaFilter(0.1)];
                    };
                }
            });
        };
        if(event.key === "Delete" && InMapObj){
            const index = $Objs.destroy(InMapObj);
            iziToast.info( $PME.removeSprite(InMapObj, index) );
            InMapObj = null;
            setStatusInteractiveObj(true);
            open_editor(true);
        };
    };

    //document.addEventListener('mousemove', mousemove_Editor.bind(this));
    //document.addEventListener('mousedown', mousedown_Editor);
    document.addEventListener('mouseup',function(event){
        startMouseHold(false);
        //setStatusInteractiveObj(true);

    }); // FIXME: bug, car ce desactive seulement lors que un immit est call sur obj
    document.addEventListener('wheel', wheel_Editor);
    document.addEventListener('keydown', keydown_Editor); // change layers
//#endregion


    // Tikers for editor update (document Title, check scroll)
    const editorTiker = new PIXI.ticker.Ticker().add((delta) => {
        updateFromTicks($mouse.interaction.mouse.originalEvent); // update move obj
        document.title = `[${$stage.scene.constructor.name}] => 
        mX: ${~~mX}  mY: ${~~mY} ||  mMX: ${~~mMX}  mMY: ${~~mMY} || ScrollX:${~~ScrollX} ScrollY:${~~ScrollY}
        `;
        if(scrollAllowed){
            let scrolled = false;
            (mX<8 && (ScrollX-=ScrollF) || mX>1920-8 && (ScrollX+=ScrollF)) && (scrolled=true);
            (mY<8 && (ScrollY-=ScrollF) || mY>1080-8 && (ScrollY+=ScrollF)) && (scrolled=true);
            scrolled && (ScrollF+=0.4) || (ScrollF=0.1) ;
        }
        CAGE_MAP.pivot.x+=(ScrollX-CAGE_MAP.pivot.x)/(scrollSpeed*delta);
        CAGE_MAP.pivot.y+=(ScrollY-CAGE_MAP.pivot.y)/(scrollSpeed*delta);
    });
    //Game_Player.prototype.updateScroll = function(){}//disable scoll character in editor mode
    editorTiker.start();

    //#region [rgba(100, 5, 0,0.2)]
// ┌------------------------------------------------------------------------------┐
// SAVE COMPUTE JSON
// └------------------------------------------------------------------------------┘
    //call fast save with ctrl+s
    function startSaveDataToJson(useOption) { // open_SaveSetup
        useOption = useOption && {} || false;
        console.log('useOption: ', useOption);
        // close html editor
        if(useOption){
            /*useOption = {
                _renderParaForRMMV : document.getElementById("_renderParaForRMMV").value,
                _renderLayersPSD : document.getElementById("_renderLayersPSD").value,
                _renderEventsPlayers : document.getElementById("_renderEventsPlayers").value,
                _renderDebugsElements : document.getElementById("_renderDebugsElements").value,
                _renderingLight : document.getElementById("_renderingLight").value,
                _renderLayers_n : document.getElementById("_renderLayers_n").value,
                _renderAnimationsTime0 : document.getElementById("_renderAnimationsTime0").value,
            }*/
            // system info data
            useOption.systemInfo = {
                //MEMORY USAGES
                heaps     : +document.getElementById("heaps"    ).innerHTML.replace("MB","").replace("GB",""),
                heapTotal : +document.getElementById("heapTotal").innerHTML.replace("MB","").replace("GB",""),
                external  : +document.getElementById("external" ).innerHTML.replace("MB","").replace("GB",""),
                rss       : +document.getElementById("rss"      ).innerHTML.replace("MB","").replace("GB",""),
                // generique
                versionEditor    :  document.getElementById("versionEditor"    ).innerText,
                SavePath         :  document.getElementById("SavePath"         ).innerText,
                totalSpines      : +document.getElementById("totalSpines"      ).innerText,
                totalAnimations  : +document.getElementById("totalAnimations"  ).innerText,
                totalTileSprites : +document.getElementById("totalTileSprites" ).innerText,
                totalLight       : +document.getElementById("totalLight"       ).innerText,
                totalEvents      : +document.getElementById("totalEvents"      ).innerText,
                totalSheets      : +document.getElementById("totalSheets"      ).innerText,
            };
        };

        create_SceneJSON(useOption);
        close_dataInspector();
        iziToast.warning( $PME.savedComplette() );

    };

    function create_SceneJSON(options) {
        let _lights      = addToSave_Lights      () ; // scene global light
        let _background  = addToSave_BG          () ; // scene bg
        let _objs        = addToSave_OBJS        () ; // obj use in this scene
        let _sheets      = addToSave_Sheets      (_objs,_background) ; // all cheets used in this scene
        const sceneData = { system:options.systemInfo, _lights , _background, _sheets, _objs,   };

        const fs = require('fs');
        function writeFile(path,content){
            // backup current to _old.json with replace() rename()
            fs.rename(`${path}`, `${path.replace(".","_OLD.")}`, function(err) {
                if ( err ) { console.log('ERROR:rename ' + err) };
                fs.writeFile(path, content, 'utf8', function (err) { 
                    if(err){return console.error(path,err) }
                    return console.log9("WriteFile Complette: "+path,JSON.parse(content));
                });
            });
        };      
        writeFile(`data/${$stage.scene.constructor.name}.json` , JSON.stringify(sceneData, null, '\t') );
    };

    //save scene global light
    function addToSave_Lights() {
        const al = $stage.LIGHTS.ambientLight;
        const dl = $stage.LIGHTS.directionalLight;
        const ambientLight = al && al.getDataValues();
        const directionalLight = dl && dl.getDataValues();
        return {ambientLight,directionalLight};
    };

    //save scene background data
    function addToSave_BG() {
        if($stage.scene.background){
            return $stage.scene.background.getDataValues();
        }else{
            return null;
        }
    };

    // save objs sprites from map
    function addToSave_OBJS() {
        let objs = [];
        $Objs.list_master.forEach(e => {
            objs.push(e.getDataValues());
        });
        return objs;
    };

    // check all elements and add base data need for loader
    function addToSave_Sheets(_objs,_background) {
        const data = {};
        let dataName;
        if(_background && _background.p.dataName){
            const dName = _background.p.dataName;
            const d2 = DATA2[dName];
            data[dName] = { base:d2.base, dir:d2.dir, dirArray:d2.dirArray, name:d2.name, root:d2.root, type:d2.type };
        }
        _objs.forEach(obj => {
            const dname = obj.p.dataName;
            const d2 = DATA2[dname];
            data[dname] = { base:d2.base, dir:d2.dir, dirArray:d2.dirArray, name:d2.name, root:d2.root, type:d2.type };
        });
        return data;
    };


    /*function computeSave_PLANETS($stage,OBJS,SHEETS) {
        let data = Object.assign({}, SHEETS);
        const list = Object.keys($Loader.loaderSet); // get list of all Scene_MapID?_data
        let i = 1;
        while (list.contains(`Scene_MapID${i}_data`)) {
            const sheets = $Loader.loaderSet[`Scene_MapID${i}_data`]._SHEETS;
            data = Object.assign(data, sheets);
            i++;
        }
        return data;
    };*/



    function snapScreenMap(options) {
        // create a snap to import in rmmv sofware
        CAGE_EDITOR.renderable = false;
        const w = CAGE_MAP.width;
        const h = CAGE_MAP.height;
        CAGE_MAP.position.set(0,h);
        CAGE_MAP.scale.set(1,-1);
        CAGE_MAP.pivot.set(0,0);
        const renderer = PIXI.autoDetectRenderer(w, h);
        const renderTexture = PIXI.RenderTexture.create(w, h);
            renderer.render($stage, renderTexture);
        const canvas = renderer.extract.canvas(renderTexture);
        const urlData = canvas.toDataURL();
        const base64Data = urlData.replace(/^data:image\/png;base64,/, "");
        const _fs = require('fs');
        const crypto = window.crypto.getRandomValues(new Uint32Array(1));
        _fs.writeFile(`testSnapStage_${crypto}.png`, base64Data, 'base64', function(error){
            if (error !== undefined && error !== null) {  console.error('An error occured while saving the screenshot', error); } 
        });
        // RESTOR
        CAGE_EDITOR.renderable = true;
        CAGE_MAP.position.set(0,0);
        CAGE_MAP.scale.set(1,1);
        CAGE_MAP.pivot.set(0,0);
   };
    //#endregion

//////// ┌-----------------------------------------------------------------------------┐
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
        CAGE_MOUSE.addChild(rope);

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
            if (k < 0){ k = 0 };
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

    //add a mouse position debugger
    function addMouseCoorDebug() {
        const coor = new PIXI.Text("",{fontSize:16,fill:0x000000,strokeThickness:4,stroke:0xffffff});
        const holding = new PIXI.Text("",{fontSize:16,fill:0xff0000,strokeThickness:4,stroke:0xffffff});
        coor.y = 60;
        coor.x = -30;
        $mouse.pointer.addChild(coor,holding); 
        setInterval(function(){ 
            coor.text = `x:${~~mMX}, y:${~~mMY}`;
            ObjMouse? holding.text = ObjMouse.name : holding.text = '';
        }, 50);
    };
    addMouseCoorDebug()
};//END EDITOR

