/*:
// PLUGIN □────────────────────────────────□OBJS SPRITES , ANIMATIONS, SPINES, EVENTS ...□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Manage ,create game objs and events for Scene stage
* V.1.0
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Permet de constuire des objets specifiques selon leur type.
Classer egalement par categorie d'interaction. ex: tree,plant,door
Gestionnaire de construiction global des sprites du jeux
Voir le Stages
*/
// penser a faire un local et global ID
// ┌-----------------------------------------------------------------------------┐
// GLOBAL $objs CLASS: _objs
//└------------------------------------------------------------------------------┘
class dataObj_base{
    constructor(dataValues,dataBase,textureName) {
        // dataValues: from json or new from [dataBase,textureName]
        this._id = null; // when linked to a sprite? {spriteID,sceneID,dataObjID}
        this._spriteID = null;
        this._sceneName = $stage.scene.constructor.name;
        this._dataBase = dataValues? dataValues.b.dataName : dataBase.name;
        this._textureName = dataValues? dataValues.b.textureName : textureName;
        this.dataValues = dataValues || this.getDataValuesFrom(false);
    };
    set register(reg) {this._id = reg._id,this._spriteID = reg._spriteID,this._sceneName = reg._sceneName}; // register id from existed saved data json
    get dataBase() { return $Loader.Data2[ this._dataBase ] };
    get b() { return this.dataValues.b };
    get p() { return this.dataValues.p };
    get d() { return this.dataValues.d };
    get n() { return this.dataValues.n };
    get sprite() { return (this._sceneName===$objs._sceneName)? $objs.spritesFromScene[this._spriteID] : null };// link cage display objet container when asigned

    initialize(){
       // getDataValues (dataBase, textureName) { TODO:
    }

    
    // the DataValues will used for make saveGame or dataEditor manager
    // use parent build build value from parent sprite container, or default
    getDataValuesFrom (cage) {
        const dataValues = {
            b:this.getDataBaseValues        (cage),
            p:this.getParentContainerValues (cage),
            d:this.getSpriteValues          (cage&&cage.d),
            n:this.getSpriteValues          (cage&&cage.n),
        };
        return dataValues;
    };

    // get important dataValue from de base
    getDataBaseValues(cage){
        const dataBase = this.dataBase; // getters
        const textureName = this._textureName || null;
        return {
            classType  : dataBase    .classType, // TODO: les class type pour les data objet type: cases, house, door, mapItemp, charactere
            type       : textureName && dataBase    .type     , // locked: les type the container , tile,,animation,spine,light..., si pas textureName, aucun class type
            textureName: textureName           , // locked
            dataName   : dataBase    .name     , // locked
            groupID    : dataBase    .groupID  , // asigner un groupe dapartenance ex: flags
            name       : dataBase    .name     , // asigner un nom unique
            description: dataBase    .root     , // un description aide memoire
            normals    : dataBase    .normal   , // flags setter getter normal parentGroup 
        };
    };

    // les datas Du container parent CAGE
    getParentContainerValues(cage){ // .p
        return {
            // observable point
            position : cage? [cage.position._x,cage.position ._y ] : [0,0] ,
            scale    : cage? [cage.scale   ._x,cage.scale    ._y ] : [1,1] ,
            skew     : cage? [cage.skew    ._x,cage.skew     ._y ] : [0,0] ,
            pivot    : cage? [cage.pivot   ._x,cage.pivot    ._y ] : [0,0] ,
            // transform
            rotation : cage? cage.rotation : 0 ,
            alpha    : cage? cage.alpha    : 1 ,
            // other
            autoGroups    : cage? cage.autoGroups          : new Array(7).fill(false) , // permet de changer automatiquement de layers selon player
            zIndex        : cage? cage.zIndex              : 0                        , // locked
            parentGroup   : cage&&cage.parentGroup? cage.parentGroup.zIndex  : null                        , //  for editor, need to manual set parentGroup on addMouse
            //pathConnexion : cage? cage.pathConnexion     : {}                       , // store path connect by id
            // conditionInteractive TODO:


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
    
    getSpriteValues(sprite, dataBase,textureName){ // .d .n
        return {
            // observable point
            position : sprite ? [sprite.position ._x,sprite.position ._y] :[0  ,0],
            scale    : sprite ? [sprite.scale    ._x,sprite.scale    ._y] :[1  ,1],
            skew     : sprite ? [sprite.skew     ._x,sprite.skew     ._y] :[0  ,0],
            pivot    : sprite ? [sprite.pivot    ._x,sprite.pivot    ._y] :[0  ,0],
            anchor   : sprite ? [sprite.anchor   ._x,sprite.anchor   ._y] :this._textureName && [0.5,1] || [0,0],
            // transform
            rotation  : sprite ? sprite.rotation  :0        ,
            alpha     : sprite ? sprite.alpha     :1        ,
            blendMode : sprite ? sprite.blendMode :0        ,
            tint      : sprite ? sprite.tint      :0xffffff ,
            // other TODO:  heaven
            /*...this.color && {
                setDark  : def? [0,0,0] : PIXI.utils.hex2rgb(this.color.darkRgba ).reverse(),
                setLight : def? [1,1,1] : PIXI.utils.hex2rgb(this.color.lightRgba).reverse(),
            },*/
        };
    };

    //updatebefor: update le dataValue aver le sprite connecter avant de stringify
    clone(updatebefor){
        const dataValues = JSON.parse(JSON.stringify(this.dataValues));
        return new this.constructor(dataValues);
    };

   
}