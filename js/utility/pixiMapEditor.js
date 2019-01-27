/*:
// PLUGIN □────────────────────────────────□PIXI MAP EDITOR□─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc EDITOR GUI for create map with object sprine JSON (texture packer, spine)
* V.2.0
* License:© M.I.T
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

document.addEventListener('keydown', (e)=>{
    if(!window.$PME&&e.key=== "F1"){
        $PME = new _PME();
        console.log1('$PME: ', $PME);
    };
});
// ┌-----------------------------------------------------------------------------┐
// GLOBAL $PME CLASS: _PME for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
class _PME{
    constructor() {
        console.log1('__________________initializeEditor:__________________ ');
        this._version = 'v2.0';
        this.editor = {gui:null,buttons:[]};
        this.data2 = null;
        this.inMouse = null ; // if sprite in mouse ?
        this._displayGroupID = 1; // current display groups selected
        this.LIBRARY_TILE_active = false; // indique si la tile library est showed
        this.initialize(event); // loader
    };

    initialize(e){
        this.prepareScene()
        this.load_Js();
    };

    prepareScene(){
        $huds.displacement.hide();
        $huds.pinBar.hide();
        $huds.pinBar.hide();
    }

    load_Js(){
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
        const onComplette = () => this.load_Editor();
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
    }

    load_Editor(){
        iziToast.warning( this.izit_loading1($stage) );
        const loader = new PIXI.loaders.Loader();
        loader.add('editorGui', `editor/pixiMapEditor1.json`).load();
        loader.onProgress.add((loader, res) => {
           // if (res.extension === "png") { this.editor[res.name] = res.texture};
            if (res.spineData) { this.editor.gui = new PIXI.spine.Spine(res.spineData)};
        });
        loader.onComplete.add(() => { this.load_dataJson() });
    };

    load_dataJson () {
        const loadingStatus =  document.getElementById('izit_loading1');
        const path = require('path'), fs=require('fs');
        const _tmpData = [];
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
                    _tmpData[fileData.name] = fileData;
                };
            };
        }.bind(this);
        fromDir('data2','.json'); //START: startPath, extention.Filter
        const _Loader2 = new _coreLoader();
        _Loader2.loadFromEditor( $stage.scene.constructor.name ,_tmpData);
     };

    startGui (data2) {
        this.data2 = data2;
        $Loader.Data2 = data2; // delete me ?
       // scene hack
       $stage.CAGE_EDITOR = new PIXI.Container();
       $stage.CAGE_EDITOR.parentGroup = $displayGroup.group[4];
       $stage.CAGE_EDITOR.name = "CAGE_EDITOR";
       const index = $stage.children.indexOf($stage.CAGE_MOUSE);
       $stage.addChildAt($stage.CAGE_EDITOR, index); // -1 befor mouse
       const cage = new PIXI.Container();
       const spine = this.editor.gui;
       $stage.CAGE_EDITOR.addChild(spine);
       // asign buttons
       const list = spine.spineData.slots;
       list.forEach(_slot => {
            if(_slot.name.contains("icon_")){
                const slot = spine.skeleton.findSlot(_slot.name);
                slot.currentSprite.slot = slot;
                this.editor.buttons.push( slot.currentSprite );
                slot.currentSprite.interactive = true;
                slot.currentSprite.on('pointerover'      , this.pIN_buttons    , this);
                slot.currentSprite.on('pointerout'       , this.pOUT_buttons   , this);
                slot.currentSprite.on('pointerdown'      , this.pDW_buttons    , this);
                slot.currentSprite.on('pointerup'        , this.pUP_buttons    , this);
                slot.currentSprite.on('pointerupoutside' , this.pUPOUT_buttons , this);
            };
        });
        const tilesheetBar_txt = new PIXI.Text('Hello World', {fill: "white"});
        const titleBarTileSheets =  spine.skeleton.findSlot("TileBarLeft");
        titleBarTileSheets.currentSprite.addChild(tilesheetBar_txt);
        titleBarTileSheets.txt = tilesheetBar_txt;
        tilesheetBar_txt.position.set(-200,-15);

        spine.autoUpdate = true;
        spine.stateData.defaultMix = 0.1;
        spine.state.setAnimation(0, 'idle', true);
        spine.state.setAnimation(1, 'start0', false);
        //EDITOR.state.setAnimation(2, 'hideTileSheets', false);
        spine.state.tracks[1].listener = {
            complete: (trackEntry, count) => {
                this.startEditor();
            }
        };
    };

//#region [rgba(250, 0, 0,0.03)]
// ┌------------------------------------------------------------------------------┐
// START INITIALISE
// └------------------------------------------------------------------------------┘
    startEditor(){
        this.filters = { // cache filters
            OutlineFilterx4       : new PIXI.filters.OutlineFilter     (4, 0x000000, 1 ),
            OutlineFilterx16      : new PIXI.filters.OutlineFilter     (16, 0x000000, 1),
            OutlineFilterx6White  : new PIXI.filters.OutlineFilter     (4, 0xffffff, 1 ),
            OutlineFilterx8Green  : new PIXI.filters.OutlineFilter     (4, 0x16b50e, 1 ),
            OutlineFilterx8Green_n: new PIXI.filters.OutlineFilter     (8, 0x16b50e, 1 ), // need x2 because use x2 blendMode for diffuse,normal
            OutlineFilterx8Red    : new PIXI.filters.OutlineFilter     (8, 0xdb120f, 1 ),
            ColorMatrixFilter     : new PIXI.filters.ColorMatrixFilter (               ),
            PixelateFilter12      : new PIXI.filters.PixelateFilter    (12             ),
            BlurFilter            : new PIXI.filters.BlurFilter        (10, 3          ),
        };
        this.convertForEditor();
        this.LIBRARY_BASE = this.createLibrary_base();
        this.LIBRARY_TILE = this.createLibrary_tile();
        this.FASTMODES = this.createFastModes();
        this.refresh_LIBRARY_BASE();
        this.setupScroll();
        this.setupListener();

    };
//#endregion
    convertForEditor(){
        $objs.spritesFromScene.forEach(cage => {
            this.create_Debug(cage);
            cage.interactive = true;
            cage.on('pointerdown'      , this.pDW_tile , this);
            cage.on('pointerup'        , this.pUP_tile , this);
            
        });
    };

    createLibrary_base(){
        const c = new PIXI.Container();
        const list = new PIXI.Container(); // container obj to masks
        const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
        c.position.set(115,950);
        [mask.width, mask.height] = [1740, 105];
        mask.anchor.set(0,1);
        mask.position.set(-8,mask.height); // marge outline filters
        mask.interactive = true;
        mask.on('pointerdown'    , this.pDW_Library_base_mask , this);
        mask.on('pointerup'      , this.pUP_Library_base_mask , this);
        mask.on('mouseupoutside' , this.pUP_Library_base_mask , this);
        c.addChild(mask,list);
        c.mask = mask;
        // reference
        c.name = "LIBRARY_BASE";
        //c.hitArea = new PIXI.Rectangle(0,0,1740,220);

       $stage.CAGE_EDITOR.addChild(c);
       // create thumbs
       c.list = list;
       c._list = []; // store liste of current obj cages elements
       for (const key in this.data2) { // this._avaibleData === DATA2
            const dataBase =  this.data2[key];
            if(dataBase.classType !== 'backgrounds'){ // dont add BG inside library
                const cage = $objs.newContainer_dataBase(dataBase); //Container_Base
                cage.d.scale.set( $app.getRatio(cage, 134, 100));
                cage.buttonType = "thumbs";
                cage.alpha = 0.75;
                this.create_Debug(cage,dataBase);
                c._list.push(cage);
                // interactions
                cage.interactive = true;
                cage.on('pointerover' , this.pIN_thumbs            , this);
                cage.on('pointerout'  , this.pOUT_thumbs           , this);
                cage.on('pointerdown' , this.pDW_Library_base_mask , this);
                cage.on('pointerup'   , this.pUP_thumbs            , this);
            };
        };
        return c;
    };

    createLibrary_tile(){
        const c = new PIXI.Container();
        const list = new PIXI.Container(); // container obj to masks
        const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
        c.position.set(1280,50);
        c.cache = {}; // cache coord by dataName // TODO: PRECOMPUTE AT EDITOR START ? sa pourait etre long ? a verifier
        [mask.width, mask.height] = [640, 880];
        mask.position.set(0, 0); // marge outline filters
        c.mask = mask;
        c.list = list;
        c.addChild(mask,list);
        // reference
        c.name = "LIBRARY_TILE";
        mask.interactive = true;
        mask.on('pointerdown'    , this.pDW_Library_tile_mask   , this);
        mask.on('pointerup'      , this.pUP_Library_tile_mask   , this);
        mask.on('mouseupoutside' , this.pUP_Library_tile_mask   , this);
        mask.on('mousewheel'     , this.pWEEL_Library_tile_mask , this);
       $stage.CAGE_EDITOR.addChild(c);
       return c;
    };

    createFastModes(){
        const c = new PIXI.Container();
        const txt0 = new PIXI.Text("P: pivot from position"   ,{fontSize:16,fill:0x000000,strokeThickness:10,stroke:0xffffff,lineJoin: "round",fontWeight: "bold",});
        const txt1 = new PIXI.Text("Y: position from pivot"   ,{fontSize:16,fill:0x000000,strokeThickness:10,stroke:0xffffff,lineJoin: "round",fontWeight: "bold",});
        const txt2 = new PIXI.Text("W: skew mode"             ,{fontSize:16,fill:0x000000,strokeThickness:10,stroke:0xffffff,lineJoin: "round",fontWeight: "bold",});
        const txt3 = new PIXI.Text("S: Scale mode"            ,{fontSize:16,fill:0x000000,strokeThickness:10,stroke:0xffffff,lineJoin: "round",fontWeight: "bold",});
        const txt4 = new PIXI.Text("R: Rotation mode"         ,{fontSize:16,fill:0x000000,strokeThickness:10,stroke:0xffffff,lineJoin: "round",fontWeight: "bold",});
        const txt5 = new PIXI.Text("U: Rotate Textures Anchor",{fontSize:16,fill:0x000000,strokeThickness:10,stroke:0xffffff,lineJoin: "round",fontWeight: "bold",});
        const txtH = txt0.height;
        txt1.y = txt0.y+txtH, txt2.y = txt1.y+txtH, txt3.y = txt2.y+txtH, txt4.y = txt3.y+txtH, txt5.y = txt4.y+txtH;
        c.txtModes = {p:txt0, y:txt1, w:txt2, s:txt3, r:txt4, u:txt5}; // when asign a FastModesKey
        c._mode = 'p';
        c.renderable = false; // render only when mouse hold.
        c.y = 100;
        c.addChild(txt0,txt1,txt2,txt3,txt4, txt5);
        $mouse.pointer.addChild(c);
        c.target = null; // target cage element for fast mode
       return c;
    };

    refresh_LIBRARY_BASE(){ // TODO: AUTO SORT BY NAME ? helper visuel
        const c = this.LIBRARY_BASE;
        c.list.removeChild(...c._list); // clear all child but keep the child mask
        const maxX = 1740;
        const maskH = 105;
        for (let [i,x,y,line] = [0,0,0,0], disX = 25, l = c._list.length; i < l; i++) {
            const cage = c._list[i];
            if(cage.renderable){
                if(cage.x+cage.width+x>maxX){ x=0, y+=maskH+8};
                cage.x = +x;
                cage.y = +y;
                x+=cage.width+disX;
                c.list.addChild(cage);
            };
        };
    };

    create_Debug(c,dataBase){
        const Debug = {bg:null, previews:null, an:null, piv:null, ico:null};
        if(c.buttonType==='thumbs'){ // if no data type, it a "thumbs"
        const create_Previews = (textures) => {
                const cage = new PIXI.Container();
                let totalWidth = 0;
                for (let i = 0, l = textures.length; i < l; i++) { // build the preview sheets
                    const sprite = new PIXI.Sprite(textures[i]);
                    sprite.scale.set( $app.getRatio(sprite, 400, 400) );
                    sprite.anchor.y = 1;
                    sprite.x = totalWidth;
                    totalWidth+=sprite.width;
                    cage.addChild(sprite);
                };
                const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
                (bg.width = cage.width), (bg.height = cage.height);
                bg.anchor.y = 1;
                bg.alpha = 0.9;
                cage.addChildAt(bg,0);
                cage.y = 900;
                return cage;
            };
            const create_IconsFilters = (dataBase) => {
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
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const previews = create_Previews(dataBase.baseTextures); // sprites preview reference;
            const icons = create_IconsFilters(dataBase); // icons
            // setup
            icons.x = c.d.width;
            bg.width = c.d.width + icons.width;
            bg.height =  Math.max(c.d.height, icons.height);
            //bg.getBounds();
            Debug.bg = bg;
            Debug.previews = previews;
            Debug.ico = icons;
            Debug.bg.name = "debug-bg";
            Debug.previews.name = "debug-previews";
            Debug.ico.name = "debug-ico";
            c.Debug = Debug;
            c.addChildAt(Debug.bg,0);
            c.addChild(c.Debug.ico);
        }else{
            let w = c.d.width;
            let h = c.d.height;
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const an = new PIXI.Sprite( $app.renderer.generateTexture( this.drawRec(0,0, 14,14, '0x000000', 1, 6) ) ); // x, y, w, h, c, a, r, l_c_a
            const piv = new PIXI.Container(); //computeFastModes need a container for skews
            const pivLine = new PIXI.Sprite( $app.renderer.generateTexture( this.drawRec(0,0, w,4, '0xffffff', 1) ) );//computeFastModes need a container
            // BG
            bg.width = w, bg.height = h;
            bg.alpha = 0.4;
            bg.tint = 0xffffff;
            bg.anchor.copy(c.d.anchor || new PIXI.Point(0.5,1));
            c.parentGroup? bg.parentGroup = PIXI.lights.diffuseGroup : void 0;

            //anchor point
            var txt = new PIXI.Text("A",{fontSize:12,fill:0xffffff});
            txt.anchor.set(0.5,0.5);
            an.anchor.set(0.5,0.5);
            an.addChild(txt);

            // pivot
            var txt = new PIXI.Text("(P)",{fontSize:26,fill:0x000000,strokeThickness:6,stroke:0xffffff,fontWeight: "bold"});
                txt.scale.set(0.5);
                txt.anchor.set(0.5,0.5);
            pivLine.anchor.set(0.5,0.5);
            piv.position.copy(c.pivot);
            piv.pivLine = pivLine;
            piv.txtGroupeID = txt;
            piv.addChild(pivLine);
            pivLine.addChild(txt);

            // hitArea hitZone
            const lb = c.getLocalBounds();
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

            c.Debug = Debug;
            c.addChildAt(Debug.bg,0);
            c.addChild(c.Debug.an, c.Debug.piv, c.Debug.hitZone);
        }
    };

//#region [rgba(219, 182, 2, 0.05)]
// ┌------------------------------------------------------------------------------┐
// IZITOAST DATA2 EDITOR 
// └------------------------------------------------------------------------------┘
    open_dataInspector(cage) {
        const dataValues = cage.getDataValues();
        iziToast.info( this.izit_dataObjsEditor(cage) );
        const _accordion = new Accordion(document.getElementById("accordion"), { multiple: true });
        
        //const _Falloff = create_sliderFalloff(); // create slider html for pixilight
        //create_jsColors.call(cage, dataValues); // create color box for tint 
        //create_sliderHeaven.call(cage, dataValues); // create slider html for pixiHaven
        //create_dataIntepretor.call(cage, dataValues); // create the data Interpretor listener for inputs and buttons
        //setHTMLWithData.call(this, dataValues); // asign dataValues to HTML inspector
    };

    create_dataIntepretor(cage){
        const dataIntepretor = document.getElementById("dataIntepretor");
        dataIntepretor.onclick = (e) => {
            const div = e.target;
            if(div.type === "button"){
                switch (div.id) {
                    case "save" : this.startSaveDataToJson(); break;
                    case "close": this.close_dataInspector(); break;
                    case "clearScene": this.clearScene(); break;
                    default:break;
                };
            };
        };
    };

    // close the data HTML inspector
    close_dataInspector(){
        iziToast.hide({transitionOut: 'flipOutX',onClosed:() => {iziToast.opened = false;}}, document.getElementById("dataEditor") ); // hide HTML data Inspector
        $stage.interactiveChildren = true;
    };
    // close the data HTML inspector
    clearScene(){
        $objs.spritesFromScene.forEach(cage => {
            $stage.scene.removeChild(cage);
            $objs.LIST[cage.dataObj._id] = void 0;
        });
        $objs.spritesFromScene = [];
    };
//#endregion

//#region [rgba(40, 0, 0, 0.2)]
// ┌------------------------------------------------------------------------------┐
// EVENTS INTERACTION LISTENERS
// └------------------------------------------------------------------------------┘
/**BUTTONS */
    pIN_buttons(e){
        const ee = e.currentTarget;
        ee._filters = [ this.filters.OutlineFilterx4 ]; // thickness, color, quality
        TweenMax.to(ee.scale, 0.3, {x:1.25,y:-1.25, ease: Back.easeOut.config(2.5) });
        ee.slot.color.a = 1;
    };

    pOUT_buttons(e){
        const ee = e.currentTarget;
        ee._filters = null; // thickness, color, quality
        TweenMax.to(ee.scale, 0.3, {x:1,y:-1, ease: Back.easeOut.config(1.4) });
        ee.slot.color.a = 0.5;
    };
    pDW_buttons(e){};
    pUP_buttons(e){
        const ee = e.currentTarget;
        this.execute_buttons(ee);
    };
    pUPOUT_buttons(e){};

/**THUMBS */
    pIN_thumbs(e){
        this.preview && $stage.CAGE_MOUSE.removeChild(this.preview);
        const ee = e.currentTarget;
        this.preview = ee.Debug.previews;
        this.preview.x = $mouse.x;
        this.preview.alpha = 0;
        TweenMax.to(this.preview, 2, {alpha:1, ease: Power3.easeOut });
        $stage.CAGE_MOUSE.addChild(this.preview);
        ee._filters = [ this.filters.OutlineFilterx4 ]; // thickness, color, quality
    };

    pOUT_thumbs(e){
        const ee = e.currentTarget;
        this.preview && $stage.CAGE_MOUSE.removeChild(this.preview);
        this.preview = null;
        ee._filters = null; // thickness, color, quality
    };

    pUP_thumbs(e){
        const ee = e.currentTarget;
        this.startMouseHold(false);
        this.LIBRARY_TILE.list.removeChildren();
        this.LIBRARY_TILE._list = [];
        this.show_tileSheet(ee);
    };

/**LIBRARY BASE */
    pDW_Library_base_mask(e){
        const ee = e.currentTarget.parent.list || e.currentTarget.parent; // also from thumbs
        !e.currentTarget.isMask && this.pOUT_thumbs(e); // force hide preview if hold from thumbs
        const callBack = () => {
            ee.interactiveChildren = false; // disable thumbs interactions
            this.editor.gui.state.setAnimation(3, 'expendThumbsLibs', false);
            ee.parent.mask.height = 105+600;
        }
        ee.position.zeroSet();
        $mouse.pointer.position.zeroSet();
        this.startMouseHold(ee,callBack); // this.mouseHold set ee
    };

    pUP_Library_base_mask(e){
        const ee = e.currentTarget.parent.list;
        ee.parent.mask.height = 105;
        (this.mouseHold === ee) && this.editor.gui.state.setAnimation(3, 'colapseThumbLibs', false); // close expen mode
        this.startMouseHold(false); // this.mouseHold nulled
        ee.interactiveChildren = true; // enable thumbs interactions
    };

/**LIBRARY TILES */
    pDW_Library_tile_mask(e){
        const ee = e.currentTarget.parent.list;
        const callBack = () => {
            ee.interactiveChildren = false; // disable thumbs interactions
        };
        ee.position.zeroSet();
        $mouse.pointer.position.zeroSet();
        this.startMouseHold(ee,callBack); // this.mouseHold set ee
    };

    pUP_Library_tile_mask(e){
        const ee = e.currentTarget.parent.list;
        this.startMouseHold(false); // this.mouseHold nulled
        ee.interactiveChildren = true; // enable thumbs interactions
    };

    pWEEL_Library_tile_mask(e,ee){
        const scale = ee.parent.list.scale;
        if(e.wheelDeltaY>0 && scale._x<2){
            TweenMax.to(scale, 1, {x:scale._x+0.2,y:scale._y+0.2, ease: Back.easeOut.config(1.4) });
        }else
        if( e.wheelDeltaY<0 && scale._x>0.5){
            TweenMax.to(scale, 1, {x:scale._x-0.2,y:scale._y-0.2, ease: Back.easeOut.config(1.4) });
        };
    };

/**TILES MAPS */
    pIN_tile(e){
        const ee = e.currentTarget;
        ee._filters = [ this.filters.OutlineFilterx4 ]; // thickness, color, quality
    };

    pOUT_tile(e){
        const ee = e.currentTarget;
        this.LIBRARY_TILE._hold = false;
        ee._filters = null;
    };

    pDW_tile(e){
        const ee = e.currentTarget;
        const callBack = () => {
            ee.interactiveChildren = false; // disable thumbs interactions
            this.activeFastModes(ee);
        }
        this.startMouseHold(ee,callBack);
    };
    
    pUP_tile(e){
        if(this.FASTMODES.renderable){ this.disableFastModes(true) };
        if(this.mouseHold){return this.startMouseHold(false) };
        this.startMouseHold(false);
        const ee = e.currentTarget;
        this.remove_toMouse(ee); // detach from mouse
        const cLeft   = e.data.button===0; // <== 
        const cRight  = e.data.button===2; // ==>
        const cCenter = e.data.button===1; // >|<

        if(e.data.originalEvent.ctrlKey && cLeft){
            return this.open_dataInspector(ee);
        }
        // Right click => cancel delete current attach
        if(e.data.button===2){
            $stage.scene.removeChild(ee);
        };
        // Left click <= apply
        if(e.data.button===0){
            this.registerToMap(ee); // register in map objs
            ee.getDataValues(); // update attached dataValues
            this.add_toMouse( this.add_toMap(ee) ); // attache to mouse
        };
    };
//#endregion

    registerToMap(ee){
        if(ee.parent === $stage.scene && ee.dataObj._id === null){
            // cherche si des array son undefined, (suprimer) pour remplacer les data au bon id
            const id = ($objs.LIST.indexOf(void 0)>-1)? $objs.LIST.indexOf(void 0) : $objs.LIST.length;
            const spriteID = $objs.spritesFromScene.length;
            ee.dataObj._id = id;
            ee.dataObj._spriteID = spriteID;
            $objs.LIST[id] = ee.dataObj;
            $objs.spritesFromScene[spriteID] = ee;
        };
    };

    //dispatch button executor
    execute_buttons(ee) {
        const slot = ee.slot;
        const name = slot.currentSpriteName;
        switch (name) {
            case "icon_Save": this.show_saveSetup();break;
            default: throw console.error(' le button name existe pas , TODO'); break;
        }
    };

    show_saveSetup() {
        $stage.interactiveChildren = false; // disable stage interactive
        iziToast.info( this.izit_saveSetup() );
        const myAccordion = new Accordion(document.getElementById("accordion"), { multiple: true });
        this.create_dataIntepretor(); // create the data Interpretor listener for inputs and buttons
    };
        

    show_tileSheet(cage) {
        const dataBase = cage.dataObj.dataBase;
        Object.keys(dataBase.textures).forEach(textureName => {
          const cage = $objs.newContainer_dataBase(dataBase,textureName);
          cage.buttonType = "tileLibs";
          this.create_Debug(cage,dataBase);
          this.LIBRARY_TILE._list.push(cage);
          this.LIBRARY_TILE.list.addChild(cage);
          cage.n.renderable = false; // disable normal
          // interactions
          cage.interactive = true;
          cage.on('pointerdown', this.pDW_tile , this);
          cage.on('pointerover', this.pIN_tile , this);
          cage.on('pointerout' , this.pOUT_tile, this);
          cage.on('pointerup'  , this.pUP_tile , this);
        });
        const cache = this.LIBRARY_TILE.cache;
        if(!cache[dataBase.name]){
            cache[dataBase.name] = this.pathFindSheet(this.LIBRARY_TILE._list, 20);
        };
        this.LIBRARY_TILE._list.forEach(cage => {
            const pos = cache[dataBase.name][cage.dataObj.b.textureName];
            cage.position.copy(pos); 
        });
        // anime
        this.LIBRARY_TILE.alpha = 0;
        TweenMax.to(this.LIBRARY_TILE, 1, {alpha:1, ease: Power4.easeOut });
        // anime spine
        if(!this.LIBRARY_TILE_active){
            this.editor.gui.state.setAnimation(2, 'showTileSheets', false);
            this.editor.gui.skeleton.findSlot("TileBarLeft").txt.text = `(${Object.keys(dataBase.textures).length}): ${name}.json`; // update title 
        }
        this.LIBRARY_TILE_active = true; // flag indic si activer
    };

    // build a sheets objList with pathFinding => [vertical to horizontal]
    pathFindSheet(list, pad) {
        const c = this.LIBRARY_TILE
        const yMax = c.mask.height;
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
                if($app.hitCheck(cage,temp)){
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
            cache[cage.dataObj.b.textureName] = new PIXI.Point(x,y); //REGISTER
            cage._boundsRect.pad(pad+2,pad+1);
        };
        return cache;
    };

    add_toMap(fromCage) { // add new sprite to map
        const dataObj = fromCage.dataObj.clone();
        // hack dataObj 
        dataObj.p.parentGroup = this._displayGroupID;
        const cage = $objs.newContainer_dataObj(dataObj);
        cage.convertTo2d();
        cage.position.set($camera.mouseToMapX3D,$camera.mouseToMapY3D);
        cage.buttonType = "tileMouse";
        $stage.scene.addChild(cage);
        this.create_Debug(cage);
        cage.interactive = true;
        cage.on('pointerdown'      , this.pDW_tile , this);
        cage.on('pointerup'        , this.pUP_tile , this);
        return cage;
    };

    add_toMouse(cage){ // attache to mouse update
        this.enlargeHitZone(cage);
        this.inMouse = cage;
    };
    remove_toMouse(cage){ // detach from mouse 
        this.enlargeHitZone(cage,'remove');
        this.inMouse = null;
        cage.Debug.hitZone.tint = 0x000000;
    };

    enlargeHitZone(cage,remove){
        // disable other interactive obj map
        if(!remove){
            const LB = cage.getLocalBounds();
            cage.Debug.hitZone.clear();
            cage.Debug.hitZone.lineStyle(2, 0xff0000, 1).drawRect(LB.x, LB.y, LB.width, LB.height);
            LB.pad(1920,1080);
            cage.hitArea = LB;//new PIXI.Rectangle(0,0, cage.width,cage.height);
        }else{
            cage.hitArea = null;
        }
    };

    setupScroll(){
        this.scrollable = true;
        let [ScrollX,ScrollY] = [$camera.pivot.x, $camera.pivot.y];
        let force = 0.1; // _displayXY power for scroll map
        let speed = 20;
        const editorTiker = new PIXI.ticker.Ticker().add((delta) => {
            this.update(); // update move obj
            let [mX,mY] = [$mouse.x,$mouse.y];
            /*document.title = `[${$stage.scene.constructor.name}] => 
            mX: ${~~mX}  mY: ${~~mY} ||  mMX: ${~~mMX}  mMY: ${~~mMY} || ScrollX:${~~ScrollX} ScrollY:${~~ScrollY}
            `;*/
            if(this.scrollable){
                let scrolled = false;
                (mX<8 && (ScrollX-=force) || mX>1920-8 && (ScrollX+=force)) && (scrolled=true);
                (mY<8 && (ScrollY-=force) || mY>1080-8 && (ScrollY+=force)) && (scrolled=true);
                scrolled && (force+=0.2) || (force=0.1);
            };
            $camera.pivot.x+=(ScrollX- $camera.pivot.x)/(speed);
            $camera.pivot.y+=(ScrollY- $camera.pivot.y)/(speed);
            // 2.5D affine mouse 
            if( this.inMouse && !(this.inMouse.dataObj._dataBase === "cases") && this.inMouse.proj){ // TODO: add affine method in container car special pour les case
                this.inMouse.affines(PIXI.projection.AFFINE.AXIS_X); // AXIS_Y test in space navigation
            };
        });
        //Game_Player.prototype.updateScroll = function(){}//disable scoll character in editor mode
        editorTiker.start();
    };

    update(e=$mouse.interaction.mouse.originalEvent){
        //this.preview && this.preview.position.set($mouse.x,900);
        if(this.mouseHold){
            // reposition du mask
            const name = this.mouseHold.name || this.mouseHold.parent.name;
            const diff = $mouse.pointer.position.zeroDiff();
            const zero = this.mouseHold.position.zero;
            if(name==="LIBRARY_BASE"){
                this.mouseHold.position.set(zero.x,zero.y-(diff.x/1.5));
            }else
            if(name==="LIBRARY_TILE"){
                this.mouseHold.position.set(zero.x+(diff.x*2),zero.y+(diff.y*2));
            } 
        };
        if(this.preview){
            const xLimit = ($mouse.x+this.preview.width-$mouse._screenW);
            this.preview.x = ($mouse.x-(xLimit>0?xLimit:0))
        }
        if(this.FASTMODES.renderable && this.mouseHold){
            this.computeFastModes(this.mouseHold);
        }else
        if(this.inMouse){
            this.inMouse.position.set($camera.mouseToMapX3D,$camera.mouseToMapY3D);
            this.inMouse.zIndex = this.inMouse.y;
        }
 
  
    };

    activeFastModes(cage=this.FASTMODES.target){
        Object.values(this.FASTMODES.txtModes).forEach(txt => { txt._filters = null });
        this.FASTMODES.target = cage;
        this.FASTMODES.renderable = true; // show fastmode key debug
        this.FASTMODES.txtModes[this.FASTMODES._mode]._filters = [this.filters.OutlineFilterx8Red]
        this.FASTMODES.freeze = new PIXI.Point($mouse.x,$mouse.y);
        cage.Debug.bg     .renderable = true;
        cage.Debug.an     .renderable = true;
        cage.Debug.hitZone.renderable = true;
        cage.Debug.piv    .renderable = true;
        // ZERO all possible transform  ["p","y","w","s","r","u"]
        this.FASTMODES.zero = {
            mouse:new PIXI.Point($mouse.x,$mouse.y),
            position:cage.position.clone(),
            pivot   :cage.pivot   .clone(),
            skew    :cage.skew    .clone(),
            scale    :cage.scale    .clone(),
            rotation:cage.rotation        ,
            zh:cage.zh        ,
        }
        
    };

    disableFastModes(updateValue){
        const cage = this.FASTMODES.target;
        updateValue && cage.getDataValues();
        cage.asignDataObjValues();
        cage.Debug.piv.position.copy(cage.pivot);
        this.FASTMODES.target = null;
        this.FASTMODES.renderable = false; // show fastmode key debug
        this.FASTMODES.txtModes[this.FASTMODES._mode]._filters = null;
    };

    computeFastModes(cage) {
        // compute diff
        const diff = new PIXI.Point(($mouse.x-this.FASTMODES.freeze.x), ($mouse.y-this.FASTMODES.freeze.y));
        switch (this.FASTMODES._mode) { // ["p","y","w","s","r","u"]
            case "p": // pivot from position"
                cage.pivot.set(this.FASTMODES.zero.pivot.x-diff.x, this.FASTMODES.zero.pivot.y-diff.y);
                cage.Debug.piv.position.copy(cage.pivot);
            break;
            case "y": // position from pivot
                cage.position.set(this.FASTMODES.zero.position.x-diff.x, this.FASTMODES.zero.position.y-diff.y);
                cage.pivot.set((this.FASTMODES.zero.pivot.x-diff.x)/cage.scale._x, (this.FASTMODES.zero.pivot.y-diff.y)/cage.scale._y);
                cage.Debug.piv.position.copy(cage.pivot);
            break;
            case "w": // skew mode
                cage.skew.set(this.FASTMODES.zero.skew.x-(diff.x/400), this.FASTMODES.zero.skew.y-(diff.y/400));
            break;
            case "s": // Scale mode
                cage.scale.set(this.FASTMODES.zero.scale.x-(diff.x/200), this.FASTMODES.zero.scale.y-(diff.y/200));
            break;
            case "r": // Rotation mode
                cage.rotation = this.FASTMODES.zero.rotation-(diff.x/100);
            break;
            case "u": // Rotation textures
                // TODO:
            break;
        }
    };

    // Build Rectangles // x, y, w:width, h:height, c:color, a:alpha, r:radius, l_c_a:[lineWidth,colorLine,alphaLine]
    drawRec(x, y, w, h, c, a, r, l_c_a) {
        const rec = new PIXI.Graphics();
            rec.beginFill(c||0xffffff, a||1);
            l_c_a && rec.lineStyle((l_c_a[0]||0), (l_c_a[1]||c||0x000000), l_c_a[2]||1);
            r && rec.drawRoundedRect(x, y, w, h, r) || rec.drawRect(x, y, w, h);
        return rec;
    };
    
    startMouseHold(cage,callBack){
        clearTimeout(this._holdTimeOut);
        this.mouseHold = null;
        if(cage){ // active mouse MouseHold after 160 ms
            this._holdTimeOut = setTimeout(() => {
                this.mouseHold = cage;
                callBack && callBack();
            }, 190);
        };
    };

    setupListener(){
        document.addEventListener('keydown', (event) => {
            // key for FASTMODES
            if(this.FASTMODES.renderable){
                if(event.key === event.key.toUpperCase()){ throw console.error('ERREUR LES CAPITAL SON ACTIVER!')}
                if(["p","y","w","s","r","u"].contains(event.key)){
                    this.FASTMODES._mode = event.key;
                    this.activeFastModes(this.FASTMODES.target);
                }
            };
        });

        document.addEventListener('wheel',(e) => {
            const hitTest = $mouse.interaction.hitTest($mouse.pointer.position);
            // Dispatch scroll event
            if (hitTest) { 
                hitTest._events.mousewheel && hitTest.emit('mousewheel',e,hitTest);
            };
        });

        document.addEventListener('mouseup',(event)=>{
            // disable fastmode si hold click left et click right
            if(event.button===2 && this.FASTMODES.renderable){
                this.disableFastModes(false);
            };
        });


    };
    

//#region [rgba(100, 5, 0,0.2)]
// ┌------------------------------------------------------------------------------┐
// SAVE COMPUTE JSON
// └------------------------------------------------------------------------------┘
    startSaveDataToJson() { // open_SaveSetup
        this.close_dataInspector();
        $stage._filters = [this.filters.BlurFilter];
        TweenMax.to(this.filters.BlurFilter, 1.2, {
            blur:0, ease: Power2.easeOut, delay:0.5,
            onComplete: (e) => { $stage._filters = null, this.filters.BlurFilter = 10;}, 
        });
        //this.close_dataInspector();
        const useOption = {};
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
        this.create_JSON(useOption);
        iziToast.warning( $PME.savedComplette() );
    };

    create_JSON(options) {
        let _lights      ={};// addToSave_Lights      () ; // scene global light
        let _background  = this.save_background          () ; // scene bg
        let _objs        = $objs.list // getter objs in current scene only
        let _sheets      = this.compute_Sheets      (_objs,_background) ; // all cheets used in this scene for load dataBases tuexture
        const json = { system:options.systemInfo, _lights , _background, _sheets, _objs,   };

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
            writeFile(`data/${$stage.scene.constructor.name}.json` , JSON.stringify(json, null, '\t') );
        };

    // save objs sprites from map
    save_background() {
        return $stage.scene.background? $stage.scene.background.dataObj.dataValues : null;
    };

        
    // add dataBase sheets need for this scene
    compute_Sheets(_objs,_background) {
        const sheets = {};
        if(_background){
            const background = $stage.scene.background;
            sheets[background.dataObj._dataBase] = background.dataObj.dataBase;
        };
        _objs.forEach(dataObj => {
            sheets[dataObj._dataBase] = dataObj.dataBase;
        });
        return sheets;
    };

//#endregion
};//END 