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
        const stageOldValue = null//$stage.getDataValues();
        $PME = new _PME(stageOldValue);
        console.log1('$PME: ', $PME);
    };
});
// ┌-----------------------------------------------------------------------------┐
// GLOBAL $PME CLASS: _PME for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
class _PME{
    constructor(stageOldValue) {
        console.log1('__________________initializeEditor:__________________ ');
        this.stageOldValue = stageOldValue;
        this._version = 'v2.0';
        this._debugMode = true;
        this._pathMode = false; // pathMode indicator
        this._pathBuffer = []; // store selected case for computing path
        this.debugLines = []; // store debug line when draw
        this.editor = {gui:null,buttons:[],icons:{}};
        this.data2 = null;
        this.inMouse = null ; // if sprite in mouse ?
        this._displayGroupID = 1; // current display groups selected
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
        $stage.interactiveChildren = false;
        iziToast.warning( this.izit_loading1($stage) );
        const loader = new PIXI.loaders.Loader();
        loader.add('editorGui', `editor/pixiMapEditor1.json`).load();
        loader.onProgress.add((loader, res) => {
           // if (res.extension === "png") { this.editor[res.name] = res.texture};
            if (res.spineData) { this.editor.gui = new PIXI.spine.Spine(res.spineData)};
        });
        // load some icons
        this.editor.icons.icon_light = new PIXI.Texture.fromImage(`editor/images/${'icon_light.png'}`);
        this.editor.icons.icon_spotLight = new PIXI.Texture.fromImage(`editor/images/${'icon_spotLight.png'}`);
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
        this.dataSheet = _tmpData; // save DataSheet structure fron nwjs, use when save sheet ref
        _Loader2.loadFromEditor( $stage.scene.name ,Object.values(_tmpData) );
     };

     //start From $Loader
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
            if(_slot.name.contains("icon_") || _slot.name.contains("gb")){
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
            OutlineFilterx2       : new PIXI.filters.OutlineFilter     (2, 0x000000, 1 ),
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
        $stage.interactiveChildren = true;
        this.changeDisplayGroup(1);
    };
//#endregion
    convertForEditor(){
        $objs.list_s.forEach(cage => {
            this.create_Debug(cage);
            cage.on('pointerover' , this.pIN_tile  , this);
            cage.on('pointerout'  , this.pOUT_tile , this);
            cage.on('pointerdown' , this.pDW_tile  , this);
            cage.on('pointerup'   , this.pUP_tile  , this);
            cage.on('mouseupoutside'  , this.pUPOUT_tile , this);
            cage.interactive = true;
            
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
            if(!dataBase.isBackground){ // dont add BG inside library
                const dataObj = new dataObj_base(dataBase.name,null,true); // les dataObj doivent etre dans un register
                const cage = new Container_Base(dataObj);
                cage.d.anchor.set(0);
                cage.d.scale.set( $app.getRatio(cage, 134, 100));
                cage.alpha = 0.75;
                this.create_Debug(cage,'thumbs');
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
        c.cache = {}
        const list = new PIXI.Container(); // container obj to masks
        const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
        c.position.set(1280,50);
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
        c.renderable = false;
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
        const infoTarget = new PIXI.Text("x:0 y:0"   ,{fontSize:22,fill:0xf4bc42,strokeThickness:8,stroke:0x000000,lineJoin: "round",fontWeight: "bold",});
        txt1.y = txt0.y+txtH, txt2.y = txt1.y+txtH, txt3.y = txt2.y+txtH, txt4.y = txt3.y+txtH, txt5.y = txt4.y+txtH;
        infoTarget.position.set(30,-90)
        c.txtModes = {p:txt0, y:txt1, w:txt2, s:txt3, r:txt4, u:txt5}; // when asign a FastModesKey
        c.infoTarget = infoTarget;
        c._mode = 'p';
        c.renderable = false; // render only when mouse hold.
        c.y = 100;
        c.addChild(txt0,txt1,txt2,txt3,txt4, txt5, infoTarget);
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

    create_Debug(c,type){
        const dataBase = c.dataObj.dataBase;
        type = type || dataBase.containerType;
        // callBack
        const createBackground = (w,h,a=0.35,color=0xffffff) => {
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            bg.name = "debug-bg";
            bg.width = w, bg.height = h;
            bg.alpha = a;
            bg.tint = color;
            bg.anchor.copy(c.d && c.d.anchor || new PIXI.Point(0.5,1));
            c.parentGroup? bg.parentGroup = PIXI.lights.diffuseGroup : void 0;
            return bg;
        };
        const createAnchor = () => {
            const an = new PIXI.Sprite( $app.renderer.generateTexture( this.drawRec(0,0, 14,14, '0x000000', 1, 6) ) ); // x, y, w, h, c, a, r, l_c_a
            const txt = new PIXI.Text("A",{fontSize:12,fill:0xffffff});
            an.name = "debug-an";
            txt.anchor.set(0.5,0.5), an.anchor.set(0.5,0.5);
            an.addChild(txt);
            return an;
        };
        const createPivot = (w,h) => {
            const piv = new PIXI.Sprite( $app.renderer.generateTexture( this.drawRec(0,0, 4,h, '0xffffff', 1, 1) ) ); // x, y, w, h, c, a, r, l_c_a
            const line = new PIXI.Sprite( $app.renderer.generateTexture( this.drawRec(0,0, w,4, '0xffffff', 1) ) );//computeFastModes need a container
            const txt = new PIXI.Text("(P)",{fontSize:26,fill:0x000000,strokeThickness:6,stroke:0xffffff,fontWeight: "bold"});
            piv.name = "debug-piv";
            piv.anchor.set(0.5,1);
            txt.scale.set(0.5), txt.anchor.set(0.5);
            piv.position.copy(c.pivot);
            piv.line = line;
            piv.txt = txt;
            line.anchor.set(0.5,0.5);
            line.addChild(txt);
            piv.addChild(line);
            return piv;
        };
        const createHitzone = (color=0x0000FF) => { // hitArea hitZone
            const hitZone = new PIXI.Graphics();
            const lb = c.getLocalBounds();
            hitZone.name = "debug-hitZone";
            hitZone.lineStyle(2, color, 1).drawRect(lb.x, lb.y, lb.width, lb.height);
            hitZone.endFill();
            return hitZone;
        };
        const create_Previews = (textures) => {
            const cage = new PIXI.Container();
            cage.name = "debug-previews";
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
        const create_IconsFilters = (dataBase,x) => {
            const cage = new PIXI.Container();
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            const filtersID = []; // when we filtering by ID
            cage.name = "debug-ico";
            let y = 0;
            function addIconFrom(filePNG,id){
                const texture = new PIXI.Texture.fromImage(`editor/images/${filePNG}`);
                const sprite = new PIXI.Sprite(texture);
                sprite.y = +y;
                y+=30;
                cage.addChild(sprite);
                filtersID.push(id);
            };
            if(dataBase.type === "tileSheet"     ){ addIconFrom('filter_texturePacker.png'),0 };
            if(dataBase.type === "animationSheet"){ addIconFrom('filter_animation.png'    ),1 };
            if(dataBase.type === "spineSheet"    ){ addIconFrom('filter_spine.png'        ),2 };
            if(dataBase.normal                   ){ addIconFrom('filter_normal.png'       ),3 };
            if(dataBase.name.contains("-0")      ){ addIconFrom('info_multiPack.png'      ),4 };
            cage.addChildAt(bg,0);
            cage.filtersID = filtersID;
            cage.bg = bg;
            bg.tint = 0x000000;
            bg.alpha = 0.5;
            bg.width = 30;
            bg.height = y;
            cage.x = x;
            return cage;
        };
        const create_ico = () => {
            const ico = new PIXI.Sprite(this.editor.icons.icon_light);
            ico.anchor.set(0.5,1);
            ico.parentGroup = $displayGroup.group[3];
            return ico;
        };
        const create_path = () => {
            const path = new PIXI.Container();
            path.graficConection = []; // store grafic conection line
            path.texts = []; // store text id
            return path;
        };

      
        
        const w = c.d||c.s||c.a? c.d.width  || c.s.width  || c.a.width : 24;
        const h = c.n||c.s||c.a? c.n.height || c.s.height || c.a.width : 24;

        if(type==='thumbs'){ // if no data type, it a "thumbs"
            // create visual debug elements
            const icons = create_IconsFilters(dataBase, c.d.width); // icons
            const bg = createBackground(c.d.width + icons.width, Math.max(c.d.height, icons.height), 0.7);
            const previews = create_Previews(dataBase.baseTextures); // sprites preview reference;

            c.Debug = {bg, icons, previews};
            c.addChildAt(bg,0);
            c.addChild(icons);
        }else
        if(["tileSheet", "animationSheet", "spineSheet"].contains(type) ){
            // create visual debug elements
            const bg = createBackground(w,h);
            const an = createAnchor();
            const piv = createPivot(w,h); 
            const hitZone = createHitzone();
            const path = create_path(); // for debug pathMode for cases only
            //const path = createPath();
            c.Debug = {bg,an,piv,hitZone,path};
            c.addChild(...Object.values(c.Debug));
            c.addChildAt(bg,0);
        }else 
        if(["light"].contains(type)){
            // create visual debug elements
            const ico = create_ico();
            const piv = createPivot(w,h); 
            const an = createAnchor();
            const bg = createBackground(ico.width,ico.height,0.3);
            const hitZone = createHitzone(c.color);
            c.Debug = {bg,ico,an,piv,hitZone};
            c.addChild(...Object.values(c.Debug));
            c.addChildAt(bg,0);
     
        }
    };

//#region [rgba(219, 182, 2, 0.05)]
// ┌------------------------------------------------------------------------------┐
// IZITOAST DATA2 EDITOR 
// └------------------------------------------------------------------------------┘
    open_dataInspector(cage) {
        if(Object.keys(iziToast.children).length){return console.error('Wait, alrealy open')}
        this.hideEditor();
        const isStage = (cage === $stage);
        const dataValues = cage.getDataValues(true);
        cage === $stage? iziToast.info( this.izit_saveSetup(dataValues) ) : iziToast.info( this.izit_dataObjsEditor(cage) );
        new Accordion(document.getElementById("accordion"), { multiple: true });
        const slidersNode = this.create_sliderHeaven(cage, dataValues); // create slider html for pixiHaven
        this.create_jsColors(cage, dataValues); // create color box for tint 
        !isStage && this.setHTMLWithData(dataValues,slidersNode); // asign dataValues to HTML inspector
        this.startDataIntepretor(cage,slidersNode); // create the data Interpretor listener for inputs and buttons
    };

    // Scene Setup and background, descriptions 
    open_dataInspector_scene(){
        if(Object.keys(iziToast.children).length){return console.error('Wait, alrealy open')}
        const dataValues = $stage.getDataValues();
        const bgList = Object.values(this.data2).filter(data => data.isBackground );
        iziToast.info( this.izit_SceneSetup(dataValues,bgList) );
        new Accordion(document.getElementById("accordion"), );
        const dataIntepretor = document.getElementById("dataIntepretor");
        dataIntepretor.onchange = (e) => {
            const div = e.target;
            const textureName = div.value;
            const dataBase = this.data2[div.value];
            const dataObj = $objs.newDataObjs_dataBase(dataBase,textureName,true);
            $stage.scene.createBackgroundFrom(dataObj);
            $camera.initialize($stage.scene);
        };
        dataIntepretor.onclick = (e) => {
            if(e.target.type === "button"){
                switch (e.target.id) {
                    case "clearScene": this.clear_scene(); break;
                    case "apply": this.close_dataInspector(); break;
                    case "cancel": cage.asignDataObjValues(backUp); this.close_dataInspector(); break;
                    default:break;
                };
            };
        };
    };
    
    clear_scene(){
        iziToast.info( this.izit_clearScene($stage.scene.length) );
        $stage.scene.children.forEach(sprite => {
            const id = sprite.dataObj._id;
            if (Number.isFinite(id)){
                delete $objs.LIST[id];
            };
        });
        $stage.scene.clearBackground();
        $stage.scene.removeChildren();
    };

    startDataIntepretor(cage,slidersNode){
        const backUp = cage.dataObj && cage.dataObj.clone();
        const dataIntepretor = document.getElementById("dataIntepretor");
        dataIntepretor.oninput = (e) => {
            if(e.data && e.data == '.'){return};
            if(e.target.type === "checkbox"){ e.target.value = e.target.checked };
            const div = e.target;
            const value = (Boolean(div.value) || Number(div.value))? JSON.parse(div.value) : div.value;
            const ids = div.id.split('.');
            const att = ids.pop();
            let path = cage.dataObj;
            ids.forEach(deep => { path = path[deep] });
            if( ['x','y'].contains(att) ){
                att==='x'? path[0] = value : att==='y'? path[1] = value : void 0;
            }else{
                path[att] = value;
            }
            cage.asignDataObjValues(); // refresh value
        };



        dataIntepretor.onclick = (e) => {
            if(e.target.type === "button"){
                switch (e.target.id) {
                    case "reset" : cage.asignDataObjValues(backUp); this.setHTMLWithData(cage.getDataValues(),slidersNode); break;
                    case "save" : this.startSaveDataToJson(); break;
                    case "apply": this.close_dataInspector(); break;
                    case "cancel": cage.asignDataObjValues(backUp); this.close_dataInspector(); break;
                    case "close": this.close_dataInspector(); break;
                    case "clearScene": this.clearScene(); break;
                    default:break;
                };
            };
        };
    };

    create_jsColors(cage,dataValues){
        // initialise all colors pickers
        const nodeList = document.getElementsByClassName("jscolor");
        for (let i=0, l=nodeList.length; i<l; i++) {
            const input = nodeList[i];
            const _jscolor = new jscolor(input);
            const attributID = input.id.split(".");
            
            _jscolor.zIndex = 99999999;
            _jscolor.onFineChange = (e) => {
                console.log('attributID: ', attributID);
                cage.dataObj.dataValues[attributID[0]][attributID[1]] = +`0x${_jscolor.targetElement.value}`;
                cage.asignDataObjValues();
            };
        };
    };

    // create multi sliders Heaven
    create_sliderHeaven(cage,dataValues){
        let options;
        if(dataValues){
            options = [
                {
                    min: 0,max: 0.75*4, step: 0.01,
                    rangeHighlights: [{ "start": 0.7, "end": 0.8, "class": "category1" }],
                },
                {
                    min: 0,max: 3*4,step: 0.1,
                    rangeHighlights: [{ "start": 2.5, "end": 3.5, "class": "category1" }],
                },
                {
                    min: 0,max: 20*4,step: 0.2,
                    rangeHighlights: [{ "start": 15, "end": 25, "class": "category1" }],
                },
            ]
        }
        let list = {}; // store slider list
        const nodeList = document.getElementsByClassName("sliders");
        for (let i=0, l=nodeList.length; i<l; i++) {
            const input = nodeList[i];
            const attributID = input.id.split(".");
            const slider = new Slider(input, { tooltip: 'always', ...options[i]}); // step: 0.1, value:0, min: 0, max: 1,
            slider.tooltip.style.opacity = 1, slider.tooltip.style.opacity = 1, slider.tooltip.style.opacity = 1;
            slider.on("slide",  ()=>{
                cage.dataObj.dataValues[attributID[0]][attributID[1]][attributID[2]] = slider.getValue();
                cage.asignDataObjValues();
            });
            list[input.id] = slider;
        };
        return list;
    };

    // asign props value to HTML data Inspector
    setHTMLWithData(dataValues,slidersNode) {
        const computeHTMLValue = (key,prop,value) =>{
            const id = [key,prop].toString().replace(/\,/g,".");
            switch (prop) {
                case "position":case "scale":case "skew":case "pivot":case "anchor":
                    for (const [i, p] of ['.x','.y'].entries()) { document.getElementById(id+p).value = value[i] };
                break;
                case "autoGroups":
                //TODO:
                break;
                case "radius":
                    document.getElementById(id).value = value===Infinity? 0 : value
                break;
                case "pathConnexion":
                    document.getElementById(id).value = Object.keys(value).toString();
                break;
                case "setDark": case "setLight":case "falloff":
                    for (const [i, v] of value.entries()) {  slidersNode[`${id}.${i}`].setValue(v) };
                break;
                // saveSetup
                default:
                  document.getElementById(id).value = value;
                break;
            }
        }; 
        for (const key in dataValues) {
            Object.entries(dataValues[key]).forEach(entry => {
                const prop  = entry[0];
                const value = entry[1];
                computeHTMLValue(key,prop,value);
            });
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
    pIN_drawLine(e){
        const ee = e.currentTarget;
        ee.alpha = 1;
        ee._filters = [ this.filters.OutlineFilterx2 ]; // thickness, color, quality
        if(this.inMouse && this.inMouse !==ee){ this.inMouse.inLine = ee };
    };
    pOUT_drawLine(e){
        const ee = e.currentTarget;
        ee._filters = null;
        ee.alpha = 0.7;
        if(this.inMouse && this.inMouse !==ee){ delete this.inMouse.inLine };
    };
    pDW_drawLine(e){
        const ee = e.currentTarget;
    };
    pUP_drawLine(e){
        const ee = e.currentTarget;
        if(this.inMouse && this.inMouse === ee){
            ee.scale.x = 0;
            TweenMax.to(ee.scale, 1, {x:1, ease: Power4.easeOut });
            this.inMouse = null;
        }else if(this.inMouse){
            e.currentTarget = this.inMouse;
            this.pUP_tile(e);
        }else if(e.data.button===2){
            $stage.scene.removeChild(ee);
            this.debugLines.remove(ee);
        };
    };

    pIN_buttons(e){
        const ee = e.currentTarget;
        ee._filters = [ this.filters.OutlineFilterx2 ]; // thickness, color, quality
        TweenMax.to(ee.scale, 0.3, {x:1.25,y:-1.25, ease: Back.easeOut.config(2.5) });
        ee.slot.color.a = 1;
    };

    pOUT_buttons(e){
        const ee = e.currentTarget;
        ee._filters = null; // thickness, color, quality
        TweenMax.to(ee.scale, 0.3, {x:1,y:-1, ease: Back.easeOut.config(1.4) });
        if(ee.slot.currentSpriteName ==='icon_pathMaker' && this._pathMode){
            ee.slot.color.set(1,1,0.1,2);
        }else{
            ee.slot.color.a = 0.5;
        }
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
        ee._filters = [ this.filters.OutlineFilterx2 ]; // thickness, color, quality
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
        const ee = e.currentTarget.parent.list || this.LIBRARY_TILE.list;
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
        const scale = ee.parent.list?ee.parent.list.scale : this.LIBRARY_TILE.list.scale;
        if(e.wheelDeltaY>0 && scale._x<2){
            TweenMax.to(scale, 1, {x:scale._x+0.2,y:scale._y+0.2, ease: Back.easeOut.config(1.4) });
        }else
        if( e.wheelDeltaY<0 && scale._x>0.5){
            TweenMax.to(scale, 1, {x:scale._x-0.2,y:scale._y-0.2, ease: Back.easeOut.config(1.4) });
        };
    };

/**TILES SHEETS */
    pUP_tileSheet(e){
        // tiles dans le tile sheet, just clone
        const cLeft   = e.data.button===0; // <== 
        const cRight  = e.data.button===2; // ==>
        const cCenter = e.data.button===1; // >|<
        this.startMouseHold(false);
        this.hideTileLibs();
        const ee = e.currentTarget;
        if(cLeft){
            this.add_toMouse( this.add_toMap(ee) ,true); // attache to mouse
        };
    };

/**TILES MAPS */
    pIN_tile(e){
        const ee = e.currentTarget;
        !ee.dataObj.l? ee._filters = [ this.filters.OutlineFilterx2 ] : void 0; // dont use filter on light
        ee.Debug.hitZone.renderable = true;
        if(this._pathMode && this.mouseHold){
            this.checkPathMode(ee);
        };
        ee.Debug.path?ee.Debug.path._filters = [ this.filters.OutlineFilterx8Green ]: void 0;
    };

    pOUT_tile(e){
        const ee = e.currentTarget;
        this.LIBRARY_TILE._hold = false;
        ee._filters = null;
        ee.Debug.path?ee.Debug.path._filters = null: void 0;
    };

    pDW_tile(e){
        const ee = e.currentTarget;
        const callBack = () => {
            this.activeFastModes(ee);
        }
        this.startMouseHold(ee,callBack);
        this._pathMode && this.checkPathMode(ee);
    };
    
    pUP_tile(e){
        const ctrlKey = e.data.originalEvent.ctrlKey;
        const cLeft   = e.data.button===0; // <== 
        const cRight  = e.data.button===2; // ==>
        const cCenter = e.data.button===1; // >|<
        this.startMouseHold(false);
        if(this.FASTMODES.renderable){
          this.disableFastModes(true) 
        };
        if(this._pathMode){ return };
        const ee = e.currentTarget;
  
        // Right click => cancel delete current attach
        if(cRight){
            if(!this.inMouse && ee.register && !ctrlKey){ return this.open_dataInspector(ee) };
            this.remove_toMouse(ee) && ee.asignDataObjValues();
            (ctrlKey || !ee.register) && this.remove_toMap(ee);
        };
        // Left click <= 
        if(cLeft){
            !ee.register && (ee.register = true); // setter to register
            ee.setDataValues(true);
            ctrlKey? this.add_toMouse(this.add_toMap(ee)) : this.add_toMouse(ee,!ctrlKey);
        };
        this.inMouse? this.hideEditor() : this.showEditor();
   
    };
    pUPOUT_tile(e){
        this.pUP_tile(e)
    };

    
//#endregion

    registerToMap(ee){
        const reg = $objs.getNewRegisterFrom(ee);
        ee.dataObj.register = reg; // setter register
        $objs.LIST[reg._id] = ee.dataObj;
        $objs.spritesFromScene[reg._spriteID] = ee;
    };
    unRegisterToMap(ee){
        $stage.scene.removeChild(ee);
        const reg = ee.dataObj.register;
        delete $objs.LIST[reg._id];
        delete $objs.spritesFromScene[reg._spriteID];
    };
    add_light(ee){
        const dataBase = $Loader.Data2.lightCone83f;
        const textureName = 'Ellipse 1'; // le type de light TODO:
        const cage = $objs.newContainer_dataBase(dataBase,textureName,true);
        this.add_toMouse ( this.add_toMap( cage ) );
    };

    //dispatch button executor
    execute_buttons(ee) {
        const slot = ee.slot;
        const name = slot.currentSpriteName;
        switch (name) {
            case "icon_Save" : this.show_saveSetup ( ); break;
            case "icon_light" : this.add_light(ee) ;break;
            case "icon_showHideSprites": this.toggle_debugMode ( ); ;break;
            case "icon_grid" : this.create_grids ( ); ;break;
            case "icon_pathMaker" : this.toggle_drawPathMode(ee ); ;break;
            case "icon_masterLight" : this.open_dataInspector ($stage.LIGHTS.ambientLight ); ;break;
            case "icon_setup" : this.open_dataInspector_scene ($stage.scene.background); ;break;
            case"gb0":case"gb1":case"gb2":case"gb3":case"gb4":case"gb5":case"gb6": this.changeDisplayGroup(+name.substr(2)); ;break;
            case "icon_drawLine" : this.create_lines(); ;break;
            default: throw console.error(' le button name existe pas , TODO'); break;
        };
    };

    changeDisplayGroup(value){
        if([0,1,2,3,4,5,6].contains(value)){
            this._displayGroupID = value; // current display groups selected
            this.inMouse && (this.inMouse.parentGroup = $displayGroup.group[value]);
            // change color 
            const buttons = this.editor.buttons.filter((b)=>b.slot.currentSpriteName.contains("gb"));
            buttons.forEach(b => {
                if(b.slot.currentSpriteName.contains(value)){
                    b.slot.color.set(0,1,0,1);
                    b.slot.currentSprite.scale.set(1.6,-1.6);
                    TweenMax.to(b.slot.currentSprite.scale, 0.6, {x:1,y:-1, ease: Back.easeOut.config(2) });
                    this.editor.gui.state.setAnimation(4, 'shakeDisplay', false);
                }else{
                    b.slot.color.set(1,1,1,0.6);
                };
            });
        };
    };

    // toggle , hide show debug mode
    toggle_debugMode(forceValue){
        if(forceValue !== void 0){
            this._debugMode = forceValue
        }else{
            this._debugMode = !this._debugMode
        }
        $objs.LIST.forEach(cage => {
            Object.values(cage.attache.Debug).forEach(debug => {
                debug.renderable = this._debugMode;
            });
            this.debugLines.forEach(line => {
                line.renderable = this._debugMode;
            });
        });
    };

    create_lines() { // drawLine
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(10, 0xffffff, 0.8);
        graphics.moveTo(0,0).lineTo(1920, 0).endFill();
        const sprite = new PIXI.Sprite( $app.renderer.generateTexture(graphics) );
        sprite.convertTo2d();
        sprite.affines = () => {};
        sprite.anchor.set(0.5,0.5);
        sprite.parentGroup = $displayGroup.group[4];
        $stage.scene.addChild(sprite);
        this.debugLines.push(sprite);
        this.inMouse = sprite;
        // interactions
        sprite.interactive = true;
        sprite.on('pointerover', this.pIN_drawLine , this);
        sprite.on('pointerout' , this.pOUT_drawLine, this);
        sprite.on('pointerdown', this.pDW_drawLine , this);
        sprite.on('pointerup'  , this.pUP_drawLine , this);
    };

    create_grids(){
        if($stage.scene.debugGrid){
            $stage.scene.removeChild($stage.scene.debugGrid); 
            $stage.scene.debugGrid.destroy()
            return $stage.scene.debugGrid = false;
        };
        const w = $camera._sceneW; // map width + zoom
        const h = $camera._sceneH;
        const color = [0xffffff,0x000000,0xff0000,0x0000ff,0xffd800,0xcb42f4][~~(Math.random()*6)];
        const graphics = new PIXI.Graphics();
            graphics.lineStyle(2, color, 0.5);
        // draw Vertical line
        for (let i=0, l=w/48; i<l; i++) {
            graphics.beginFill(color);
            graphics.moveTo(i*48,0).lineTo(i*48, h).endFill();
        };
         // draw Horizontal line
        for (let i=0, l=h/48; i<l; i++) {
            graphics.beginFill(color);
            graphics.moveTo(0,i*48).lineTo(w, i*48).endFill();
        };
        const sprite = new PIXI.Sprite( $app.renderer.generateTexture(graphics) );
        sprite.anchor.set(0.5,1);
        //sprite.position.set(w/2,h);
        sprite.scale.set(1.1);
        sprite.convertTo2d();
        $stage.scene.addChild(sprite);
        sprite.parentGroup = $displayGroup.group[0];
        $stage.scene.debugGrid = sprite;
    };

    show_tileSheet(cage) {
        const dataBase = cage.dataObj.dataBase;
        if(this.LIBRARY_TILE._dataName === dataBase.name){return this.hideTileLibs()};
        Object.keys(dataBase.textures || dataBase.data.skins).forEach(textureName => {
          const cage = $objs.newContainer_dataBase(dataBase,textureName,true);
          cage.n? cage.n.renderable = false:void 0; // disable normal
          this.create_Debug(cage);
          this.LIBRARY_TILE._list.push(cage);
          this.LIBRARY_TILE.list.addChild(cage);
          // interactions
          cage.interactive = true;
          cage.on('pointerdown', this.pDW_Library_tile_mask , this);
          cage.on('pointerover', this.pIN_tile , this);
          cage.on('pointerout' , this.pOUT_tile, this);
          cage.on('pointerup'  , this.pUP_tileSheet , this);
          cage.on('mousewheel'     , this.pWEEL_Library_tile_mask , this);
        });
        this.LIBRARY_TILE
        const cache = this.LIBRARY_TILE.cache;
        if(!cache[dataBase.name]){
            cache[dataBase.name] = this.pathFindSheet(this.LIBRARY_TILE._list, 20);
        };
        this.LIBRARY_TILE._list.forEach(cage => {
            const pos = cache[dataBase.name][cage.dataObj._textureName];
            cage.position.copy(pos); 
        });
        // anime
        const defaultPos = this.LIBRARY_TILE.list.getLocalBounds();
        this.LIBRARY_TILE.list.position.set(-defaultPos.x,-defaultPos.y)
        this.LIBRARY_TILE.list
        this.LIBRARY_TILE._dataName = dataBase.name;
        !this.LIBRARY_TILE.renderable && this.showTileLibs();
        this.editor.gui.skeleton.findSlot("TileBarLeft").txt.text = `(${Object.keys(dataBase.textures||dataBase.data.skins).length}): ${dataBase.name}.json`; // update title 
    };

    showEditor(){
        this.LIBRARY_BASE.interactiveChildren = true;
        this.LIBRARY_BASE.renderable = true;
        TweenMax.to(this.LIBRARY_BASE, 1, {alpha:1, ease: Power4.easeOut });
        if(this.editor.gui.state.tracks[1].animation.name!=='showTileBase'){
            this.editor.gui.state.setAnimation(1, 'showTileBase', false);
        }
    };
    hideEditor(){
        this.LIBRARY_BASE.interactiveChildren = false;
        this.LIBRARY_BASE.renderable = false;
        if(this.editor.gui.state.tracks[1].animation.name!=='hidetileBase'){
            this.editor.gui.state.setAnimation(1, 'hidetileBase', false);
        };
    };

    showTileLibs(){
        this.LIBRARY_TILE.alpha = 0;
        TweenMax.to(this.LIBRARY_TILE, 1, {alpha:1, ease: Power4.easeOut });
        this.LIBRARY_TILE.renderable = true;
        this.LIBRARY_TILE.interactiveChildren = true;
        this.editor.gui.state.setAnimation(2, 'showTileSheets', false);
    };
    hideTileLibs(){
        this.LIBRARY_TILE._dataName = null;
        this.LIBRARY_TILE.renderable = false;
        this.LIBRARY_TILE.interactiveChildren = false;
        this.editor.gui.state.setAnimation(2, 'hideTileSheets', false);
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
            cache[cage.dataObj._textureName] = new PIXI.Point(x,y); //REGISTER
            cage._boundsRect.pad(pad+2,pad+1);
        };
        return cache;
    };

    //#region [rgba(10, 60, 70, 0.15)]
    // ┌------------------------------------------------------------------------------┐
    // EVENTS INTERACTION LISTENERS
    // └------------------------------------------------------------------------------┘
    // start or close the path mode
    toggle_drawPathMode(ee) {
        this._pathMode = !this._pathMode;
        //SHOW PATH
        if(this._pathMode){
            $camera.reset();
            this.hideTileLibs();
            this.editor.gui.state.setAnimation(3, 'pathMode', false);
            this.LIBRARY_BASE.renderable = false;
            this.LIBRARY_BASE.interactiveChildren = false;
            ee.slot.color.set(1,1,0.1,1); // (r, g, b, a)
            ee.scale.set(1.5,-1.5);
            $objs.LIST.forEach(dataObj => {
                const isCase = dataObj.b.dataType === "case";
                dataObj.attache.interactive = isCase;
                dataObj.attache.alpha = isCase?1:0.1;
            });
        }else{
            this.LIBRARY_BASE.renderable = true;
            this.LIBRARY_BASE.interactiveChildren = true;
            this.editor.gui.state.addEmptyAnimation(3,0.2); //(trackIndex, mixDuration, delay)
            ee.slot.color.set(1,1,1,1); // (r, g, b, a)
            ee.scale.set(1.25,-1.25);
        };
        this.refreshPath();
    };

    refreshPath() {
        $objs.LIST.forEach(dataObj => {
            const isCase = dataObj.b.dataType === "case";
            // clear reset grafic path
            if(isCase){
                //dataObj.attache.Debug.path.forEach(p => { dataObj.attache.removeChild(p) }); // remove path grafics
                dataObj.attache.Debug.path.removeChildren();
                dataObj.attache.Debug.path.graficConection = [];
                dataObj.attache.Debug.path.texts = [];
            };
            if(isCase && this._pathMode){
                Object.keys(dataObj.attache.pathConnexion).forEach(id => { // connextion id to sprite ID
                    const dataObj_c = $objs.LIST[id]; // dataobj conected
                    let point = new PIXI.Point(0,0);
                    const xy   = $camera.toLocal(dataObj.attache, $stage.scene, void 0, void 0, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);//dataObj  .sprite.toGlobal(point)
                    const xy_c = $camera.toLocal(dataObj_c.attache, $stage.scene, void 0, void 0, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ); //dataObj_c.sprite.toGlobal(point)
                    const dX = (xy_c.x-xy.x)*$camera._zoom;
                    const dY = (xy_c.y-xy.y)*$camera._zoom;
                    const path = new PIXI.Graphics();
                    path.lineStyle(4, 0x4286f4, 1);
                    path.moveTo(0,0).lineTo(dX, dY).endFill();
                    const scaleXY = new PIXI.Point(~~1/dataObj.attache.scale.x,~~1/dataObj.attache.scale.y);
                    path.scale.copy(scaleXY);
                    dataObj.attache.addChild(path);
                    dataObj.attache.Debug.path.graficConection.push(path);
                    dataObj.attache.Debug.path.addChild(path);
                });
            }
        });
    };

    // lorsque MouseHold, on ajoute les casesIn dans un buffer, lorsque mouseHold release, on Compute le buffer
    checkPathMode(cage) {
        const buffer = this._pathBuffer;
        // si pas deja dans buffer: ajouter les connextion
        if(!buffer.contains(cage)){
            buffer.push(cage);
            // create debug number
            const txt = new PIXI.Text(buffer.length,{fontSize:42,fill:0xff0000,strokeThickness:8,stroke:0x000000});
            txt.pivot.y = txt.height;txt.alpha = 0;
            TweenMax.to(txt.pivot, 0.6, {y:txt.height+cage.Debug.bg.height, ease: Back.easeOut.config(3) });
            TweenMax.to(txt, 1, {alpha:1, ease: Back.easeOut.config(2.5) });
            cage.Debug.path.texts.push(txt);
            cage.Debug.path.addChild(txt);
        }else{

        };
    };

    // finalise compute path draw in buffers
    computeDrawPathBuffers() {
        const buffer = this._pathBuffer;
        let preview,current,next;
        for (let i=0, l=buffer.length; i<l; i++) {
            const preview = buffer[i-1];
            const current = buffer[i  ];
            const next    = buffer[i+1];
            const preview_id = preview && preview.dataObj.register._sID;
            const current_id = current && current.dataObj.register._sID;
            const next_id    = next    && next   .dataObj.register._sID;
            //TODO: FIXME: compute distance via global position for Math.hypot
            if(preview){
                current.pathConnexion[String(preview_id)] = Math.hypot(preview.x-current.x, preview.y-current.y);
            };
            if(next){
                current.pathConnexion[String(next_id)] = Math.hypot(next.x-current.x, next.y-current.y);
            };
        };
        console.log0('PathsBuffers: ', buffer);
        this._pathBuffer = [];
        this.refreshPath();
    };
    //#endregion
    
    remove_toMap(cage) { // add new sprite to map
        cage.register && (cage.register = null);
        $stage.scene.removeChild(cage);
    };
    add_toMap(fromCage) { // add new sprite to map
        const dataObj = fromCage.dataObj.clone();
        // hack dataObj 
        dataObj.p.parentGroup = this._displayGroupID;
        const cage = $objs.newContainer_dataObj(dataObj);
        cage.position.set($camera.mouseToMapX3D,$camera.mouseToMapY3D);
        this.create_Debug(cage);
        $stage.scene.addChild(cage);
        cage.interactive = true;
        cage.on('pointerover' , this.pIN_tile  , this);
        cage.on('pointerout'  , this.pOUT_tile , this);
        cage.on('pointerdown' , this.pDW_tile  , this);
        cage.on('pointerup'   , this.pUP_tile  , this);
        cage.on('mouseupoutside'  , this.pUPOUT_tile , this);
        return cage;
    };

    add_toMouse(cage,ignor){ // attache to mouse update
        if(this.remove_toMouse(this.inMouse) && ignor){ return };
        this.setObjsInteractive(false);
        this.enlargeHitZone(cage);
        this.hideTileLibs();
        this.hideEditor();
        this.inMouse = cage;
        //force current sprite inMouse interactivity
        cage.interactive = true;
    };
    remove_toMouse(cage){ // detach from mouse
        if(!cage){return false}
        const wasIn = this.inMouse === cage;
        this.enlargeHitZone(cage,'remove');
        this.inMouse = false;
        cage.Debug.hitZone.tint = 0x000000;
        this.setObjsInteractive(true);
        return wasIn;
    };

    enlargeHitZone(cage,remove){
        // disable other interactive obj map
        const LB = cage.getLocalBounds();
        cage.Debug.hitZone.clear();
        cage.Debug.hitZone.lineStyle(2, 0xff0000, 1).drawRect(LB.x, LB.y, LB.width, LB.height);
        if(remove){
            cage.hitArea = null;
        }else{
            LB.pad(1920,1080);
            cage.hitArea = LB;
        }
    };

    setObjsInteractive(value){
        $objs.LIST.forEach(dataObj => {
            dataObj.attache.interactive = value;
        });
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
            if( this.inMouse && this.inMouse.proj){
                this.inMouse.affines(PIXI.projection.AFFINE.AXIS_X);
            };
        });
        //Game_Player.prototype.updateScroll = function(){}//disable scoll character in editor mode
        editorTiker.start();
    };

    update(e=$mouse.interaction.mouse.originalEvent){
        //this.preview && this.preview.position.set($mouse.x,900);
        if(this.mouseHold && this.mouseHold !== true ){ // isBoolean for pathMode
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
            // check si a inLine, et si la line existe plus , just breaker le follow
            if(this.inMouse.inLine && !this.debugLines.contains(this.inMouse.inLine)){
                delete this.inMouse.inLine;
            }
            const x = $camera.mouseToMapX3D;
            const y = this.inMouse.inLine? this.inMouse.inLine.y : $camera.mouseToMapY3D;
            //Math.hypot(preview.x-current.x, preview.y-current.y)
            this.inMouse.position.set(x,y);
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

    //updateValue: refresh les values
    disableFastModes(updateValue){
        const cage = this.FASTMODES.target;
        updateValue && cage.setDataValues();
        cage.Debug.piv.position.copy(cage.pivot); // update debug
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
                this.FASTMODES.infoTarget.text = `x:${cage.pivot._x.toFixed(2)} \ny:${cage.pivot._y.toFixed(2)}`;
            break;
            case "y": // position from pivot
                cage.position.set(this.FASTMODES.zero.position.x-diff.x, this.FASTMODES.zero.position.y-diff.y);
                cage.pivot.set((this.FASTMODES.zero.pivot.x-diff.x)/cage.scale._x, (this.FASTMODES.zero.pivot.y-diff.y)/cage.scale._y);
                cage.Debug.piv.position.copy(cage.pivot);
                this.FASTMODES.infoTarget.text = `x:${cage.pivot._x.toFixed(2)} \ny:${cage.pivot._y.toFixed(2)}`;
            break;
            case "w": // skew mode
                cage.skew.set(this.FASTMODES.zero.skew.x-(diff.x/400), this.FASTMODES.zero.skew.y-(diff.y/400));
                this.FASTMODES.infoTarget.text = `x:${cage.skew._x.toFixed(2)} \ny:${cage.skew._y.toFixed(2)}`;
            break;
            case "s": // Scale mode
                cage.scale.set(this.FASTMODES.zero.scale.x-(diff.x/200), this.FASTMODES.zero.scale.y-(diff.y/200));
                this.FASTMODES.infoTarget.text = `x:${cage.scale._x.toFixed(2)} \ny:${cage.scale._y.toFixed(2)}`;
            break;
            case "r": // Rotation mode
                cage.rotation = this.FASTMODES.zero.rotation-(diff.x/100);
                this.FASTMODES.infoTarget.text = `r:${cage.rotation.toFixed(3)} \ndeg°:${(cage.rotation*180/Math.PI).toFixed(2)}`;
            break;
            case "u": // Rotation textures
                cage.d.rotation = this.FASTMODES.zero.rotation-(diff.x/100);
                cage.n.rotation = this.FASTMODES.zero.rotation-(diff.x/100);
                this.FASTMODES.infoTarget.text = `r:${cage.d.rotation.toFixed(3)} \ndeg°:${(cage.d.rotation*180/Math.PI).toFixed(2)}`;
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
        document.onwheel = null;
        document.addEventListener('keydown', (e) => {
            // key for FASTMODES
            if(this.FASTMODES.renderable){
                if(e.key === e.key.toUpperCase()){ throw console.error('ERREUR LES CAPITAL SON ACTIVER!')}
                if(["p","y","w","s","r","u"].contains(e.key)){
                    this.FASTMODES._mode = e.key;
                    this.activeFastModes(this.FASTMODES.target);
                }
            }else if(!e.target.type && !e.code.contains('Numpad')){ // si pas focus dans un input, autoriser number
                this.changeDisplayGroup(+e.key)
            }
        });

        document.addEventListener('wheel',(e) => {
            // autorize zoom just quand sourit dans canvas
            if (e.path.contains($app.renderer.view)) {
                const hitTest = $mouse.interaction.hitTest($mouse.pointer.position);
                // Dispatch scroll event
                if (hitTest) { 
                    hitTest._events.mousewheel && hitTest.emit('mousewheel',e,hitTest) || $camera.onMouseWheel.call($camera,e);
                }else{
                    $camera.onMouseWheel.call($camera,e);
                }
            };

        });

        document.addEventListener('mousedown',(event)=>{
            this._pathMode && this.startMouseHold(true); // only for path mode , allow click on scene
        });

        document.addEventListener('mouseup',(event)=>{
            // disable fastmode si hold click left et click right
            this.startMouseHold(false);
            if(this.FASTMODES.renderable){
                this.disableFastModes(false); //e.data.button===0 || event.button===2
            };
            if(this._pathMode){
                this.computeDrawPathBuffers()
            };
        });


    };
    

//#region [rgba(100, 5, 0,0.2)]
// ┌------------------------------------------------------------------------------┐
// SAVE COMPUTE JSON
// └------------------------------------------------------------------------------┘
    show_saveSetup() {
        this.open_dataInspector($stage);
        $stage.interactiveChildren = false; // disable stage interactive
        iziToast.info( this.izit_saveSetup() );
        const myAccordion = new Accordion(document.getElementById("accordion"), { multiple: true });
        this.startDataIntepretor() // create the data Interpretor listener for inputs and buttons
    };

    startSaveDataToJson() { //  from: dataIntepretor save 
        this.close_dataInspector();
        $displayGroup._layer_diffuseGroup._filters = [this.filters.BlurFilter];
        TweenMax.to(this.filters.BlurFilter, 1.2, {
            blur:0, ease: Power2.easeOut, delay:0.5,
            onComplete: (e) => { $displayGroup._layer_diffuseGroup._filters = null, this.filters.BlurFilter = 10;}, 
        });
        this.create_JSON();
        iziToast.warning( $PME.savedComplette() );
    };

    create_JSON() {
        const dataValues = $stage.getDataValues();
        let _scene = { // scene setup
            ambientLight:{},
            PointLight_mouse:{},
            DirectionalLight:{},
        };
        const _lights      = dataValues.total_dataType.light; // get all lights objets
        const _objs        = $objs.get_list;
        const _background  = $stage.scene.background.dataObj ; // scene bg
        const _sheets      = dataValues.total_sheets ; // all cheets used in this scene for load dataBases tuexture
        const SYSTEM = {memoryUsage:dataValues.memoryUsage,timeElasped:PIXI.ticker.shared.lastTime / 1000, data: new Date().toDateString()};
        const json = { SYSTEM, _lights , _background, _sheets, _objs, };
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

//#endregion
};//END 