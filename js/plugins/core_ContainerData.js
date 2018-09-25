
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

PIXI.CageContainer = (function () {
    class CageContainer extends PIXI.Container {
        constructor(dataBase, dataValues) {
            super();
            // if have parameter dataBase, its a "thumbs" from editor or maybe others future
            if(dataBase){ 
                this.createBases(dataBase, dataValues);
                dataValues && this.asignValues(dataValues, true);
            };
        };
        // getters for CageContainer default
        get d() { return this.Sprites.d };
        get n() { return this.Sprites.n };
    };

    CageContainer.prototype.createBases = function(dataBase, dataValues) {
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
        this.computeValue.call(this.Sprites.d, dataValues.d);
        this.computeValue.call(this.Sprites.n, dataValues.n);
        // can set false, if need keep temp old values for HTML dataEditor
        if(storeValues){ this.DataValues = dataValues };
    };

    CageContainer.prototype.computeValue = function(data) {
        for (const key in data) {
            const value = data[key];
            switch (key) {
                case "position":case "scale":case "skew":case "pivot":case "anchor":
                    this[key].set(...value);
                    break;
                case "setDark": case "setLight":
                    if(this.color){ // convertToHeaven(); based on boolean editor, or take look on pluginName ?
                        this.color[key](...value);
                    };
                    break;
                case "parentGroup": // if have parentGroup, also asign diffuseGroup,normalGroup
                //TODO: NE PAS ASIGNER NORMAL POUR CERTAIN CA , COMME POUR EDITOR tilelibs
                    this.parentGroup = $displayGroup.group[value];
                    this.asignParentGroups();
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
    // TODO: mette tileContainer, ContainerAnimations, spineContainer .. corige spine avec les get n array
    // en sperarant les conainer on peut suprimer quelquemethod dans CageContainer.
    class ContainerTiles extends PIXI.CageContainer {
        constructor(dataBase, dataValues) {
            super();
            if(dataValues.p.type === "tileSheet"){
                this.createBases(dataBase, dataValues);
                this.asignValues(dataValues, true);
            }else{ 
                throw console.error("dataValues.p.type are not tileSheet, current Value are: ",dataValues.p.type) 
            };
        };
        // getters for ContainerTiles
    };
    
    ContainerTiles.prototype.createBases = function(dataBase, dataValues) {
        const td = dataBase.textures   [dataValues.p.textureName     ]; // ref texture:diffuse
        const tn = dataBase.textures_n [dataValues.p.textureName+'_n']; // ref texture:normal
        const d = new PIXI.Sprite(td);
        const n = new PIXI.Sprite(tn);
        this.Sprites = {d,n};
        this.addChild(d,n);
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
    // TODO: mette tileContainer, ContainerAnimations, spineContainer .. corige spine avec les get n array
    // en sperarant les conainer on peut suprimer quelquemethod dans CageContainer.
    class ContainerAnimations extends PIXI.CageContainer {
        constructor(dataBase, dataValues) {
            super();
            if(dataValues.p.type === "animationSheet"){
                this.createBases(dataBase, dataValues);
                this.asignValues(dataValues, true);
            }else{ 
                throw console.error("dataValues.p.type are not 'animationSheet', current Value are: ",dataValues.p.type) 
            };
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
        const tn = dataBase .textures_n[dataValues.p.textureName]; // ref texture:normal
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
    // TODO: mette tileContainer, ContainerAnimations, spineContainer .. corige spine avec les get n array
    // en sperarant les conainer on peut suprimer quelquemethod dans CageContainer.
    class ContainerSpine extends PIXI.CageContainer {
        constructor(dataBase, dataValues) {
            super();
            if(dataValues.p.type === "spineSheet"){
                this.createBases(dataBase, dataValues);
                this.asignValues(dataValues, true);
            }else{ 
                throw console.error("dataValues.p.type are not tileSheet, current Value are: ",dataValues.p.type) 
            };
        };
        // getters for ContainerSpine
    };
    
    ContainerSpine.prototype.createBases = function(dataBase, dataValues) {
        const sd = dataBase.spineData; // ref spineData
        const d = new PIXI.spine.Spine(sd);
        const n = d.hackAttachmentGroups("_n"); // (nameSuffix, group)
        /*
        spine.skeleton.setSkinByName(this.TexName);
        spine.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
        spine.skeleton.setSlotsToSetupPose();
        */
        this.Sprites = {d,n};
        this.addChild(d);
    };

    
//END
return ContainerSpine;
})();
//#endregion