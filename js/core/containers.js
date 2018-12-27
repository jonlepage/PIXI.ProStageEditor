
/*:
// PLUGIN □────────────────────────────────□CONTAINER DATA MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc manager pixi container datas
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Remplacer la class Container par container Data , qui aura pour effet de pourvoir gerer des method specials
Comme obtenir de facon general les propreties pour les json
La class containerData est atribuer a tous les obj sprites du jeux pour difuse et normal
*/


/*#region [rgba(0, 255, 0,0.03)]
// ┌------------------------------------------------------------------------------┐
// CageContainer:=>
Fourni les methodes de base qui peuvent etre ecraser pas les supers de :
    ContainerTiles      : 2 sprites Difuse ,Normal
    ContainerAnimations : 1 extras .AnimatedSprite et 1 sprites Diffuse Normal
    ContainerSpines     : 1 PIXI .spine .Spine et 1 arrays Diffuse Normal
// └------------------------------------------------------------------------------┘
*/
/** @memberof PIXI.Container */
PIXI.CageContainer = (function () {
    class CageContainer extends PIXI.Container {
        constructor(dataBase) {
            super();
            this.Sprites = {};
            // if have parameter dataBase, its a "thumbs" from editor or maybe others future
            dataBase && this.createBases(dataBase);
        };
        // getters for CageContainer default
        get d() { return this.Sprites.d };
        get n() { return this.Sprites.n };
    };

    CageContainer.prototype.createBases = function(dataBase) {
        // if no dataValues, it a type "thumbs" from editor
        const d = new PIXI.Sprite(dataBase.baseTextures[0]); // thumbs [0], and previews will take all arrays [...]
        this.Sprites = {d};
        this.addChild(d);
        this.dataName = dataBase.name; // asign thumbs dataName
        return;
    };

    // dispatch values asigment
    CageContainer.prototype.asignValues = function(dataValues, storeValues=true) {
        this.computeValue(dataValues.p);
        dataValues.d && this.computeValue.call(this.Sprites.d, dataValues.d);
        dataValues.n && this.computeValue.call(this.Sprites.n, dataValues.n);
        // can set false, if need keep temp old values for HTML dataEditor
        if(storeValues){ this.dataValues = dataValues };
    };

    CageContainer.prototype.computeValue = function(data) {
        for (const key in data) {
            const value = data[key];
            switch (key) {
                case "position":case "scale":case "skew":case "pivot":case "anchor":
                    this[key] && this[key].set(...value);
                    break;
                case "setDark": case "setLight":
                    if(this.color){ // convertToHeaven(); based on boolean editor, or take look on pluginName ?
                        this.color[key](...value);
                    };
                    break;
                case "parentGroup": // if have parentGroup, also asign diffuseGroup,normalGroup
                //TODO: NE PAS ASIGNER NORMAL POUR CERTAIN CA , COMME POUR EDITOR tilelibs
                    if(value !== void 0){
                        this.parentGroup = $displayGroup.group[value];
                        this.asignParentGroups();
                    };
                    break;
                case "zIndex":
                    this.zIndex = +data.position[1];
                    break;
                case "defaultColor": // for cases, change color
                    this.defaultColor = value;
                    this.setCaseColorType(value);
                    break;
                case "defaultCaseEventType": // for cases, change color
                    this.defaultCaseEventType = value;
                    this.setCaseEventType(value);
                    break;
                    
                default:
                    this[key] = value;
                break;
            };
        };
    };

    //auto add default parentGroup for 'tileSheet', 'animationSheet'
    CageContainer.prototype.asignParentGroups = function() {
        this.d.parentGroup = PIXI.lights.diffuseGroup;
        this.n.parentGroup = PIXI.lights.normalGroup;
    };

    // the DataValues will used for make saveGame or dataEditor manager
    CageContainer.prototype.getDataValues = function(dataBase, textureName) {
        const def = !!dataBase;
        const isSpine      = def? (dataBase.type     === "spineSheet"     ) : (this.type     === "spineSheet"     );
        const isAnimations = def? (dataBase.type     === "animationSheet" ) : (this.type     === "animationSheet" );
        const isCase       = def? (dataBase.dataName === "cases"          ) : (this.dataName === "cases"          );
        // parent data value
        const p = {
            type       : def? dataBase    .type                                 : this .type       , // locked
            textureName: def? textureName                                       : this .textureName, // locked
            dataName   : def? dataBase    .name                                 : this .dataName   , // locked
            groupID    : def? dataBase    .dirArray[dataBase.dirArray.length-1] : this .groupID    , // asigner un groupe dapartenance ex: flags
            name       : def? dataBase    .name                                 : this .name       , // asigner un nom unique
            description: def? dataBase    .root                                 : this .description, // un description aide memoire
            // observable point
            position : def? [0,0] : [this.position .x, this.position .y],
            scale    : def? [1,1] : [this.scale    .x, this.scale    .y],
            skew     : def? [0,0] : [this.skew     .x, this.skew     .y],
            pivot    : def? [0,0] : [this.pivot    .x, this.pivot    .y],
            // transform
            rotation : def? 0 : this.rotation ,
            alpha    : def? 1 : this.alpha    ,
            // other
            autoGroups    : def? new Array(7).fill(false) : this.autoGroups                              , // permet de changer automatiquement de layers selon player
            zIndex        : def? 0                        : this.zIndex                                  , // locked
            parentGroup   : def? void 0                   : this.parentGroup   && this.parentGroup.zIndex, //  for editor, need to manual set parentGroup on addMouse
            pathConnexion : def? {}                       : this.pathConnexion || {}                     , // store path connect by id
            
            // animations
            ...isAnimations && {
                totalFrames    :def? dataBase.textures[textureName].length : this.totalFrames    , // locked
                animationSpeed :def? 1                                     : this.animationSpeed ,
                loop           :def? false                                  : this.loop           ,
            },
            // animations
            ...isCase && {
                defaultColor          :def? false : this.defaultColor          ,
                allowRandomStartColor :def? false : this.allowRandomStartColor ,
                allowRandomTurnColors :def? false : this.allowRandomTurnColors , 
                defaultCaseEventType :def? false : this.defaultCaseEventType , 
            },
        };
        
        let dn = function(){ // Diffuse Normal data value 
            if(this.constructor.name === 'Array'){return void 0};
           return {
                // observable point
                position :  def            ? [0   ,0] : [this.position .x, this.position .y],
                scale    :  def            ? [1   ,1] : [this.scale    .x, this.scale    .y],
                skew     :  def            ? [0   ,0] : [this.skew     .x, this.skew     .y],
                pivot    :  def            ? [0   ,0] : [this.pivot    .x, this.pivot    .y],
                anchor   : (def || isSpine)? [0.5 ,1] : [this.anchor   .x, this.anchor   .y],
                // transform
                rotation  : def? 0        : this.rotation  ,
                alpha     : def? 1        : this.alpha     ,
                blendMode : def? 0        : this.blendMode ,
                tint      : def? 0xffffff : this.tint      ,
                // other
                ...this.color && {
                    setDark  : def? [0,0,0] : PIXI.utils.hex2rgb(this.color.darkRgba ).reverse(),
                    setLight : def? [1,1,1] : PIXI.utils.hex2rgb(this.color.lightRgba).reverse(),
                },
            };
        };
        // TODO: on peut faire une method temp pour verifier l'integrity entre getDataDefault et getDataValues, pour heviter les oublies
        return { p, d:{...dn.call( def?null:this.d )}, n:{...dn.call( def?null:this.n )} };
    };

    CageContainer.prototype.createJson = function() {

    };

    CageContainer.prototype.asignJson = function(dataValues) {

    };


//END
return CageContainer;
})();
//#endregion

/*#region [rgba(0, 0, 90, 0.06)]
// ┌------------------------------------------------------------------------------┐
// ContainerTiles
// └------------------------------------------------------------------------------┘
*/
PIXI.ContainerTiles = (function () {
    class ContainerTiles extends PIXI.CageContainer {
        constructor(dataBase, textureName, dataValues) {
            super();
            dataValues = dataValues || this.getDataValues(dataBase, textureName);
            this.createBases(dataBase, dataValues);
            this.asignValues(dataValues, true);
        };
        // getters for ContainerTiles
    };
    
    ContainerTiles.prototype.createBases = function(dataBase, dataValues) {
        const td = dataBase.textures   [dataValues.p.textureName     ]; // ref texture:diffuse
        const tn = dataBase.textures_n [dataValues.p.textureName+'_n']; // ref texture:normal
        const d = new PIXI.Sprite(td)//new PIXI.projection.Sprite2d(td);
        const n = new PIXI.Sprite(tn)//new PIXI.projection.Sprite2d(tn);
        this.Sprites = {d,n};
        this.addChild(d,n);
        // Si cases, elle ont des sprites special dissosier par couleur tint et caseEventType.
        //system de couleur relatif au gemDice par couleur. Les couleur autorise certain case pour le path finding.
        if(dataValues.p.dataName === 'cases'){
            //cage color 
            this.isCase = true;
            const ccd = new PIXI.projection.Sprite2d(dataBase.textures.cColor);
                ccd.parentGroup = PIXI.lights.diffuseGroup;
                ccd.pivot.set((ccd.width/2)+2,ccd.height+20);
            const ccn = new PIXI.projection.Sprite2d(dataBase.textures_n.cColor_n);
                ccn.parentGroup = PIXI.lights.normalGroup;
                ccn.pivot.copy(ccd.pivot)
            this.Sprites.ccd = ccd;
            this.Sprites.ccn = ccn;
            this.addChild(ccd,ccn);
            // cage type
            const ctd = new PIXI.projection.Sprite2d( $Loader.Data2.caseEvents.textures.caseEvent_hide);
                ctd.parentGroup = PIXI.lights.diffuseGroup;
                ctd.pivot.set((ctd.width/2),ctd.height);
                ctd.position.set(0,-40);
            const ctn = new PIXI.projection.Sprite2d( $Loader.Data2.caseEvents.textures_n.caseEvent_hide_n);
                ctn.parentGroup = PIXI.lights.normalGroup;
                ctn.pivot   .copy(ctd.pivot   );
                ctn.position.copy(ctd.position);
            this.Sprites.ctd = ctd;
            this.Sprites.ctn = ctn;
            this.addChild(ctd,ctd);
            [ccd,ccn].forEach(c => { c.renderable = false }); //FIXME: TEMP HIDE for camera 2d test
        };
    };

    
    ContainerTiles.prototype.setCaseColorType = function(color){
        // see : $huds.displacement.diceColors same group for gemDice
        // and $objs._colorType
        // file:///C:\Users\jonle\Documents\Games\anft_1.6.1\js\core_items.js#L131
        this.colorType = color;
        let colorHex; // redraw color case
        switch (color) {
            case 'red'   : colorHex=0xff0000 ; break;
            case 'green' : colorHex=0x00ff3c ; break;
            case 'blue'  : colorHex=0x003cff ;break;
            case 'pink'  : colorHex=0xf600ff ;break;
            case 'purple': colorHex=0x452d95 ; break;
            case 'yellow': colorHex=0xfcff00 ; break;
            case 'black' : colorHex=0x000000 ; break;
            default      : colorHex=0xffffff ;
        }
        this.Sprites.ccd.tint = colorHex;
    };

    // change set the events type, swap textures
    ContainerTiles.prototype.setCaseEventType = function(type){
        type = type || 'caseEvent_hide';
        const td = $Loader.Data2.caseEvents.textures[type];
        const tn = $Loader.Data2.caseEvents.textures_n[type+'_n'];
        this.caseEventType = type;
        this.Sprites.ctd.texture = td;
        this.Sprites.ctn.texture = tn;
    };

    
//END
return ContainerTiles;
})();
//#endregion

/*#region [rgba(90, 0, 90, 0.06)]
// ┌------------------------------------------------------------------------------┐
// ContainerAnimations
// └------------------------------------------------------------------------------┘
*/
PIXI.ContainerAnimations = (function () {
    class ContainerAnimations extends PIXI.CageContainer {
        constructor(dataBase, textureName, dataValues) {
            super();
            dataValues = dataValues || this.getDataValues(dataBase, textureName);
            this.createBases(dataBase, dataValues);
            this.asignValues(dataValues, true);
        };
        // getters for ContainerAnimations
        get animationSpeed() { return this.d.animationSpeed };
        set animationSpeed(value) { this.d.animationSpeed = value };
        get loop() { return this.d.loop };
        set loop(value) { this.d.loop = value };
        get playing() { return this.d.playing };
        set playing(value) { this.d.playing = value };
        get currentFrame() { return this.d? this.d.currentFrame : 0; };
        set currentFrame(value) { this.d.currentFrame = value };
        get totalFrames() { return this.d.totalFrames };
        set totalFrames(value) { return this.d.totalFrames };

    };
    
    // create,build basic textures need for ContainerAnimations
    ContainerAnimations.prototype.createBases = function(dataBase, dataValues) {
        const td = dataBase.textures  [dataValues.p.textureName]; // ref texture:diffuse
        const tn = dataBase.textures_n [dataValues.p.textureName]; // ref texture:normal
        const d = new PIXI.extras.AnimatedSprite(td);
        const n = new PIXI.Sprite(tn[0]);
        this.Sprites = {d,n};
        this.addChild(d,n);
        this.normalWithTextures(tn);
        this.play(0);
    };

    // hack updateTexture for allow normals and diffuse with closure
    ContainerAnimations.prototype.normalWithTextures = function(textures) {
        const _t = textures;
        const _n = this.n;
        this.d.updateTexture = function updateTexture() {
            this._texture = this._textures[this.currentFrame];// update diffuse textures
            this.cachedTint = 0xFFFFFF;
            this._textureID = -1;

            _n._texture = _t[this.currentFrame];// update normal textures
            _n._textureID = -1;
            
            if (this.onFrameChange) {
                this.onFrameChange(this.currentFrame);
            };
        };
    };

    ContainerAnimations.prototype.play = function(frame) {
       if(Number.isFinite(frame)){
            this.Sprites.d.gotoAndPlay(~~frame);
       }else{
            this.Sprites.d.play();
       };
    };

//END
return ContainerAnimations;
})();
//#endregion


/*#region [rgba(0, 0, 0, 0.1)]
// ┌------------------------------------------------------------------------------┐
// ContainerSpine
// └------------------------------------------------------------------------------┘
*/
PIXI.ContainerSpine = (function () {
    class ContainerSpine extends PIXI.CageContainer {
        constructor(dataBase, textureName, dataValues) {
            super();
            dataValues = dataValues || this.getDataValues(dataBase, textureName);
            this.createBases(dataBase, dataValues);
            this.asignValues(dataValues, true);
        };
        // getters for ContainerSpine
    };
    
    //TODO: hackAttachmentGroups parent crash et verifier le sprite dans spine ! 
    ContainerSpine.prototype.createBases = function(dataBase, dataValues) {
        const sd = dataBase.spineData; // ref spineData
        const d = new PIXI.projection.Spine2d(sd) //new PIXI.spine.Spine(sd);
        d.proj.affine = 2;
        const n = d.hackAttachmentGroups("_n",null,null); // (nameSuffix, group)
        dataValues.p.textureName && d.skeleton.setSkinByName(dataValues.p.textureName); //FIXME: player have no skin for now
        d.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
        d.skeleton.setSlotsToSetupPose();
        this.Sprites = {d,n};
        this.addChild(d);
    };

    // dispatch values asigment for spine
    ContainerSpine.prototype.asignValues = function(dataValues, storeValues=true) {
        this.computeValue(dataValues.p);
        this.computeValue.call(this.Sprites.d, dataValues.d);
        // can set false, if need keep temp old values for HTML dataEditor
        if(storeValues){ this.dataValues = dataValues };
    };
    
    ContainerSpine.prototype.asignParentGroups = function() {
        this.Sprites.n = this.d.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)
    };
    
//END
return ContainerSpine;
})();
//#endregion

/*#region [rgba(255, 255, 255, 0.04)]
// ┌------------------------------------------------------------------------------┐
// ContainerAmbientLight
// └------------------------------------------------------------------------------┘
*/
PIXI.ContainerAmbientLight = (function () {
    // TODO: mette tileContainer, ContainerAnimations, spineContainer .. corige spine avec les get n array
    // en sperarant les conainer on peut suprimer quelquemethod dans CageContainer.
    class ContainerAmbientLight extends PIXI.lights.AmbientLight {
        constructor(dataValues ,brightness, color) { //TODO: verifier que on peut changer brightness et color dans asignValues sans constructor
            super();
            dataValues = dataValues || this.getDataValues(true);
            this.asignValues(dataValues, true);
        };
        // getters for ContainerSpine
    };
    
    // get dataValue of AmbientLight
    ContainerAmbientLight.prototype.getDataValues = function(def) {
        const AmbientLight_Data = {
            // base
            shaderName      : def? "ambientLightShader" : this.shaderName     , //lock ?
            blendMode       : def? 1                    : this.blendMode      ,
            alpha           : def? 1                    : this.alpha          ,
            // light
            drawMode        : def? 4                    : this.drawMode       ,
            lightHeight     : def? 0.075                : this.lightHeight    ,
            brightness      : def? 1                    : this.brightness     ,
            falloff         : def? [0.75,3,20]          : this.falloff        ,
            color           : def? 16777215             : this.color          ,
            // other
            //useViewportQuad : def? true                 : this.useViewportQuad,
            //indices         : def? [0,1,2,0,2,3]        : this.indices        ,
            //displayOrder    : def? 8                    : this.displayOrder   ,
        };
        return AmbientLight_Data;
    };


    ContainerAmbientLight.prototype.asignValues = function(dataValues, storeValues=true) {
        this.computeValue(dataValues);
        if(storeValues){ this.dataValues = dataValues };
    };

    ContainerAmbientLight.prototype.computeValue = function(data) {
        for (const key in data) {
            const value = data[key];
            this[key] = value;
        };
    };
    
//END
return ContainerAmbientLight;
})();
//#endregion

/*#region [rgba(200, 200, 200, 0.04)]
// ┌------------------------------------------------------------------------------┐
// ContainerDirectionalLight
// └------------------------------------------------------------------------------┘
*/
PIXI.ContainerDirectionalLight = (function () {
    // TODO: mette tileContainer, ContainerAnimations, spineContainer .. corige spine avec les get n array
    // en sperarant les conainer on peut suprimer quelquemethod dans CageContainer.
    class ContainerDirectionalLight extends PIXI.lights.DirectionalLight {
        constructor(dataValues ,brightness, color) {
            super(0xffffff, 1, $mouse.follower);
            dataValues = dataValues || this.getDataValues(true);
            this.asignValues(dataValues, true);
        };
        // getters for ContainerDirectionalLight
    };
    
    // get dataValue of AmbientLight
    ContainerDirectionalLight.prototype.getDataValues = function(def) {
        const AmbientLight_Data = {
            // base
            shaderName      : def? "directionalLightShader" : this.shaderName     , //lock ?
            blendMode       : def? 1                    : this.blendMode      ,
            alpha           : def? 1                    : this.alpha          ,
            // light
            drawMode        : def? 4                    : this.drawMode       ,
            lightHeight     : def? 0.075                : this.lightHeight    ,
            brightness      : def? 1                    : this.brightness     ,
            falloff         : def? [0.75,3,20]          : this.falloff        ,
            color           : def? 16777215             : this.color          ,
            // other
            //useViewportQuad : def? true                 : this.useViewportQuad,
            //indices         : def? [0,1,2,0,2,3]        : this.indices        ,
            //displayOrder    : def? 8                    : this.displayOrder   ,
        };
        return AmbientLight_Data;
    };

    // dispatch values asigment for spine
    ContainerDirectionalLight.prototype.asignValues = function(dataValues, storeValues=true) {
        this.computeValue(dataValues);
        if(storeValues){ this.dataValues = dataValues };
    };

    ContainerDirectionalLight.prototype.computeValue = function(data) {
        for (const key in data) {
            const value = data[key];
            this[key] = value;
        };
    };
    
//END
return ContainerDirectionalLight;
})();
//#endregion

/*#region [rgba(0, 0, 90, 0.06)]
// ┌------------------------------------------------------------------------------┐
// ContainerBackground
// └------------------------------------------------------------------------------┘
instance de .CAGE_MAP , permet de gerer le bg, 
mais egalement quelque methode pour gestions objs childrend, camera, combat fx ..
*/
PIXI.ContainerBG = (function () {
    class ContainerBG extends PIXI.CageContainer {
        // note: les bg peut etre decouper en arrays[[1,2,3],[1,2,3]] pour textures packer, et textureName pourrai etre diferent version , season !?
        constructor(dataBase, dataValues) {
            super();
            dataValues = dataValues || this.getDataValues(dataBase);
            this.createBases(dataBase,dataValues);
            this.asignValues(dataValues, true);

        };
        // getters for ContainerTiles
    };
    
    ContainerBG.prototype.createBases = function(dataBase, dataValues) {
        // TODO: les bg pourrai etre parfoi decouper en arrays dans textures packer
        const td = dataBase && dataBase.textures  [dataBase.name     ] || PIXI.Texture.EMPTY; // ref texture:diffuse
        const tn = dataBase && dataBase.textures_n[dataBase.name+'_n'] || PIXI.Texture.EMPTY; // ref texture:normal
        const d = new PIXI.Sprite(td);
        const n = new PIXI.Sprite(tn);
        this.Sprites = {d,n};
        this.addChild(d,n);
    };

    // the DataValues will used for make saveGame or dataEditor manager
    ContainerBG.prototype.getDataValues = function(dataBase) {
        const def = !!dataBase;
        // parent data value
        const p = {
            type        : def? dataBase .type : this .type         , // locked
            dataName    : def? dataBase .name : this .dataName     , // locked
            name        : def? "map name information" : this .name , // asigner un nom pour la carte, permet afficher titre
            description : def? dataBase .root : this .description  , // un description aide memoire
            parentGroup : 0                                        , // BG alway group 0
        };
        return { p };
    };
    
    ContainerBG.prototype.clearBackground = function() {
        this.removeChild(this.d,this.n);
        PIXI.utils.clearTextureCache();
    };

//END
return ContainerBG;
})();
//#endregion

