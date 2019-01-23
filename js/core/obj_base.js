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
        this.id = null; // when linked to a sprite? {spriteID,sceneID,dataObjID}
        this.dataValues = dataValues || this.getDataValuesFrom(null,dataBase,textureName); // obtenir tous les datas key de base, default ou selon le Cage Container assigner
    };
    get dataBase() { return $Loader.Data2[this.dataValues.b.dataName] };
    get b() { return this.dataValues.b };
    get p() { return this.dataValues.p };
    get d() { return this.dataValues.d };
    get n() { return this.dataValues.n };
    get parentContainer() { return $objs.spritesFromScene[this.id.localID] };// link cage display objet container when asigned

    initialize(){
       // getDataValues (dataBase, textureName) { TODO:
    }

    
    // the DataValues will used for make saveGame or dataEditor manager
    getDataValuesFrom (link,dataBase,textureName) {
        link = link || this.link
        const dataValues = {
            b:this.getDataBaseValues(dataBase,textureName),
            p:this.getParentContainerValues(link),
            d:this.getSpriteValues         (link&&this.link.d),
            n:this.getSpriteValues         (link&&this.link.n),
        };
        return dataValues;
    };

    // get important dataValue from de base
    getDataBaseValues(dataBase,textureName){
        return {
            classType  : dataBase    .classType, // TODO: les class type pour les data objet type: cases, house, door, mapItemp, charactere
            type       : dataBase    .type     , // locked: les type the container , tile,,animation,spine,light...
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
            parentGroup   : cage? cage.parentGroup.zIndex  : null                        , //  for editor, need to manual set parentGroup on addMouse
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
            anchor   : sprite ? [sprite.anchor   ._x,sprite.anchor   ._y] :[0.5,1],
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