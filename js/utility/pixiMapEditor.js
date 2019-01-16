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
        this._fastModeKey = "p"; // ["p","y","w","s","r","u"] // fast mode transfome type 
        this.initialize(event); // loader
    };

    initialize(e){
        this.setupScroll();
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
            };
        });
        const tilesheetBar_txt = new PIXI.Text('Hello World', {fill: "white"});
        const titleBarTileSheets =  spine.skeleton.findSlot("TileBarLeft");
        titleBarTileSheets.currentSprite.addChild(tilesheetBar_txt);
        titleBarTileSheets.txt = tilesheetBar_txt;
        tilesheetBar_txt.position.set(-200,-15);

        spine.autoUpdate = true;
        spine.state.setAnimation(0, 'idle', true);
        spine.state.setAnimation(1, 'start0', false);
        //EDITOR.state.setAnimation(2, 'hideTileSheets', false);
        spine.state.tracks[1].listener = {
            complete: (trackEntry, count) => {
                this.startEditor();
            }
        };
    };


    startEditor(){
        this.filters = { // cache filters
            OutlineFilterx4: new PIXI.filters.OutlineFilter (4, 0x000000, 1),
            OutlineFilterx16: new PIXI.filters.OutlineFilter (16, 0x000000, 1),
            OutlineFilterx6White: new PIXI.filters.OutlineFilter (4, 0xffffff, 1),
            OutlineFilterx8Green: new PIXI.filters.OutlineFilter (4, 0x16b50e, 1),
            OutlineFilterx8Green_n: new PIXI.filters.OutlineFilter (8, 0x16b50e, 1), // need x2 because use x2 blendMode for diffuse,normal
            OutlineFilterx8Red: new PIXI.filters.OutlineFilter (8, 0xdb120f, 1),
            ColorMatrixFilter: new PIXI.filters.ColorMatrixFilter(),
            PixelateFilter12: new PIXI.filters.PixelateFilter(12),
            BlurFilter: new PIXI.filters.BlurFilter (10, 3),
        };
        this.LIBRARY_BASE = this.createLibrary_base();
        this.LIBRARY_TILE = this.createLibrary_tile();
        this.FASTMODES = this.createFastModes();
        this.refresh_LIBRARY_BASE();
        this.setupInteractions();

    };

    createLibrary_base(){
        const c = new PIXI.Container();
        const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
        c.position.set(115,950);
        [mask.width, mask.height] = [1740, 105];
        mask.position.set(-8,-8); // marge outline filters
        c.mask = mask;
        c.addChild(mask);
        // reference
        c.name = "LIBRARY_BASE";
        c.interactive = true;
        //c.hitArea = new PIXI.Rectangle(0,0,1740,220);
        c.buttonType = "library";
       // c.on('pointerover', pointer_overIN);
       // c.on('pointerout', pointer_overOUT);
       // c.on('pointerdown', pointer_DW);
       $stage.CAGE_EDITOR.addChild(c);
       // create thumbs 
       c.list = []; // store liste of current obj cages elements
       for (const key in this.data2) { // this._avaibleData === DATA2
            const dataBase =  this.data2[key];
            if(dataBase.classType !== 'backgrounds'){ // dont add BG inside library
                const cage = new Container_Base(dataBase);
                cage.d.scale.set( $app.getRatio(cage, 134, 100));
                cage.buttonType = "thumbs";
                cage.alpha = 0.75;
                this.create_Debug(cage,dataBase);
                c.list.push(cage);
            };
        };
        return c;
    };

    createLibrary_tile(){
        const c = new PIXI.Container();
        const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
        c.position.set(1280,50);
        c.cage = new PIXI.Container(); // list inside subContainer for allow mask zoom
        c.list = [];
        c.cache = {}; // cache coord by dataName
        [mask.width, mask.height] = [640, 880];
        mask.position.set(0, 0); // marge outline filters
        c.mask = mask;
        c.addChild(mask,c.cage);
        // reference
        c.name = "LIBRARY_TILE";
        c.buttonType = "library";
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
        c.renderable = false; // render only when mouse hold.
        c.y = 100;
        c.addChild(txt0,txt1,txt2,txt3,txt4, txt5);
        $mouse.pointer.addChild(c);
       return c;
    };

    refresh_LIBRARY_BASE(){
        const c = this.LIBRARY_BASE;
        c.removeChild(...c.list); // clear all child but keep the child mask
        const maxX = 1740;
        const maskH = 105;
        for (let [i,x,y,line] = [0,0,0,0], disX = 25, l = c.list.length; i < l; i++) {
            const cage = c.list[i];
            if(cage.renderable){
                if(cage.x+cage.width+x>maxX){ x=0, y+=maskH+8};
                cage.x = +x;
                cage.y = +y;
                x+=cage.width+disX;
                c.addChild(cage);
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
            var txt = new PIXI.Text("↓■↓-P-↑□↑",{fontSize:12,fill:0x000000,strokeThickness:4,stroke:0xffffff});
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

    
    setupInteractions() {
        this.editor.buttons.forEach(buttons => {
            buttons.interactive = true;
            buttons.on('pointerover'      , this.pIN_buttons    , this);
            buttons.on('pointerout'       , this.pOUT_buttons   , this);
            buttons.on('pointerdown'      , this.pDW_buttons    , this);
            buttons.on('pointerup'        , this.pUP_buttons    , this);
            buttons.on('pointerupoutside' , this.pUPOUT_buttons , this);
        });
        this.LIBRARY_BASE.list.forEach(thumbs => {
            thumbs.interactive = true;
            thumbs.on('pointerover' , this.pIN_thumbs  , this);
            thumbs.on('pointerout'  , this.pOUT_thumbs , this);
            thumbs.on('pointerup'   , this.pUP_thumbs  , this);
        });
    };
    

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
    pUP_buttons(e){};
    pUPOUT_buttons(e){};


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
        this.show_tileSheet(ee.dataObj);
    };

    pIN_tile(e){
        const ee = e.currentTarget;
        ee._filters = [ this.filters.OutlineFilterx4 ]; // thickness, color, quality
    };
    pOUT_tile(e){
        const ee = e.currentTarget;
        ee._filters = null;
    };
    pUP_tile(e){
        const ee = e.currentTarget;
        this.add_toMouse(ee.dataObj);
    };

    pDW_mouse(e){
        const ee = e.currentTarget;
        this.startMouseHold(ee);
    };

    pUP_mouse(e){
        if(this.mouseHold){return};
        const ee = e.currentTarget;
        console.log('ee: ', ee);
        ee.hitArea = null;
        this.inMouse = null;
        // Right click => cancel
        if(e.data.button===2){
            $stage.scene.removeChild(ee);
        };
        // Left click <= apply
        if(e.data.button===0){
            this.add_toMouse(ee.dataObj)
        };
    };

    show_tileSheet(dataObj) {
        const name = dataObj.name;
        const textures = dataObj.textures || dataObj.skins;
        const dataBase = this.data2[name]
        this.editor.gui.state.setAnimation(2, 'showTileSheets', false);
        this.editor.gui.skeleton.findSlot("TileBarLeft").txt.text = `(${Object.keys(textures).length}): ${name}.json`; // update title 
        this.LIBRARY_TILE.list = []; //TODO: NEED RESET
        Object.keys(textures).forEach(textureName => {
          const _dataObj = $objs.newDataObjsFrom(null,dataBase,textureName);
          const cage = $objs.newContainerFrom(_dataObj);
          cage.buttonType = "tileLibs";
          this.create_Debug(cage,dataBase);
          this.LIBRARY_TILE.list.push(cage);
          this.LIBRARY_TILE.cage.addChild(cage);
          cage.n.renderable = false; // disable normal
          cage.interactive = true;
          cage.on('pointerover', this.pIN_tile, this);
          cage.on('pointerout', this.pOUT_tile, this);
          cage.on('pointerup', this.pUP_tile, this);
        });
        const cache = this.LIBRARY_TILE.cache;
        if(!cache[name]){
            cache[name] = this.pathFindSheet(this.LIBRARY_TILE.list, 20);
        };
        this.LIBRARY_TILE.list.forEach(cage => {
            const pos = cache[name][cage.dataObj.b.textureName];
            cage.position.copy(pos); 
        });
        
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

    add_toMouse(dataObj) {
        const name = dataObj.b.name;
        const dataBase = this.data2[name]
        const _dataObj = $objs.newDataObjsFrom(null,dataBase,dataObj.b.textureName);
        // hack data 
        _dataObj.p.parentGroup = this._displayGroupID;
        const cage = $objs.newContainerFrom(_dataObj);
        cage.convertTo2d();
        cage.position.set($camera.mouseToMapX3D,$camera.mouseToMapY3D);
        cage.buttonType = "tileMouse";
        this.inMouse = cage;
        $stage.scene.addChild(cage);
        this.create_Debug(cage);

        // disable other interactive obj map
        const LB = cage.getLocalBounds();
        cage.Debug.hitZone.clear();
        cage.Debug.hitZone.lineStyle(2, 0xff0000, 1).drawRect(LB.x, LB.y, LB.width, LB.height);
        LB.pad(1920,1080);
        cage.hitArea = LB;//new PIXI.Rectangle(0,0, cage.width,cage.height);
        cage.interactive = true;
        cage.on('pointerdown' , this.pDW_mouse , this);
        cage.on('pointerup'   , this.pUP_mouse , this);
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
        });
        //Game_Player.prototype.updateScroll = function(){}//disable scoll character in editor mode
        editorTiker.start();
    };

    update(e=$mouse.interaction.mouse.originalEvent){
        //this.preview && this.preview.position.set($mouse.x,900);
        if(this.preview){
            const xLimit = ($mouse.x+this.preview.width-$mouse._screenW);
            this.preview.x = ($mouse.x-(xLimit>0?xLimit:0))
        }
        if(this.inMouse){
            this.inMouse.position.set($camera.mouseToMapX3D,$camera.mouseToMapY3D);
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
    
    startMouseHold(cage){
        clearTimeout(this._holdTimeOut);
        this.mouseHold = null;
        if(cage){ // active mouse MouseHold after 160 ms
            this._holdTimeOut = setTimeout(() => {
                this.mouseHold = cage;
                this.activeFastModes(cage);
            }, 160);
        };
    };

    activeFastModes(cage){
        this.FASTMODES.renderable = true; // show fastmode key debug
        const fmKey = this._fastModeKey;
        cage.Debug.bg.renderable = true;
        cage.Debug.an.renderable = true;
        cage.Debug.hitZone.renderable = true;
        cage.Debug.piv.renderable = true;
    };

};//END 