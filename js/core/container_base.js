
/*:
// PLUGIN □────────────────────────────────□CONTAINER BASE MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** @memberof PIXI.Container */
class Container_Base extends PIXI.Container {
    constructor(dataBase) {
        super();
        this.Sprites = {};
        // if have parameter dataBase, its a "thumbs" from editor or maybe others future
        dataBase && this.createBases(dataBase);
    };
    // getters for CageContainer default
    get d() { return this.Sprites.d };
    get n() { return this.Sprites.n };

    createBases (dataBase) {
        // if no dataValues, it a type "thumbs" from editor
        const d = new PIXI.Sprite(dataBase.baseTextures[0]); // thumbs [0], and previews will take all arrays [...]
        this.Sprites = {d};
        this.addChild(d);
        this.dataName = dataBase.name; // asign thumbs dataName
        return;
    };

    // dispatch values asigment
    asignDataValues(dataValues) {
        this.asignValues(dataValues.p);
        dataValues.d && this.asignValues.call(this.Sprites.d, dataValues.d);
        dataValues.n && this.asignValues.call(this.Sprites.n, dataValues.n);
        // can set false, if need keep temp old values for HTML dataEditor
       // if(storeValues){ this.dataValues = dataValues };
    };

    asignValues (data) {
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
    asignParentGroups () {
        this.d.parentGroup = PIXI.lights.diffuseGroup;
        this.n.parentGroup = PIXI.lights.normalGroup;
    };

    // the DataValues will used for make saveGame or dataEditor manager
    // si pass dataBase, obtenir des valeur par default, sinon obtenir par rapport a la confi du sprites
    getDataValues (dataBase, textureName) {
        const dataValues = {
            p:this.getParentContainerValues(dataBase,textureName),
            d:this.getSpriteValues.call(this.d, dataBase,textureName),
            n:this.getSpriteValues.call(this.n, dataBase,textureName),
        };
        this.getDataValues_spine && this.getDataValues_spine(dataValues);
        return dataValues;
    };


    
    getParentContainerValues(dataBase,textureName){ // .p
        const def = !!dataBase;
        return {
            classType  : def? dataBase    .dirArray[dataBase.dirArray.length-2] : this .classType    , // TODO: les class type pour les data objet type: cases, house, door, mapItemp, charactere 
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
            parentGroup   : def? 0                        : this.parentGroup   && this.parentGroup.zIndex, //  for editor, need to manual set parentGroup on addMouse
            pathConnexion : def? {}                       : this.pathConnexion || {}                     , // store path connect by id
            
            // animations TODO: ajouter dans les data obj 
            /*...isAnimations && {
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
            },*/
        };
    };
    
    getSpriteValues(dataBase,textureName){ // .d .n
        const def = !!dataBase;
        return {
            // observable point
            position : def ? [0   ,0] : [this.position .x, this.position .y],
            scale    : def ? [1   ,1] : [this.scale    .x, this.scale    .y],
            skew     : def ? [0   ,0] : [this.skew     .x, this.skew     .y],
            pivot    : def ? [0   ,0] : [this.pivot    .x, this.pivot    .y],
            anchor   : def ? [0.5 ,1] : [this.anchor   .x, this.anchor   .y],
            // transform
            rotation  : def? 0        : this.rotation  ,
            alpha     : def? 1        : this.alpha     ,
            blendMode : def? 0        : this.blendMode ,
            tint      : def? 0xffffff : this.tint      ,
            // other TODO:  heaven
            /*...this.color && {
                setDark  : def? [0,0,0] : PIXI.utils.hex2rgb(this.color.darkRgba ).reverse(),
                setLight : def? [1,1,1] : PIXI.utils.hex2rgb(this.color.lightRgba).reverse(),
            },*/
        };
    };

    createJson () {

    };

    asignJson (dataValues) {

    };

    // default background not affined
    affines (value) {
        this.d.proj.affine = 0;
        this.n.proj.affine = 0;
    };

};//END CLASS