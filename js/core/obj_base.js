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
    get a() { return this.dataValues.a };
    get s() { return this.dataValues.s };
    get sprite() { return (this._sceneName===$objs._sceneName)? $objs.spritesFromScene[this._spriteID] : null };// link cage display objet container when asigned

    initialize(){
       // getDataValues (dataBase, textureName) { TODO:
    }

    
    // the DataValues will used for make saveGame or dataEditor manager
    // use parent build build value from parent sprite container, or default
    //TODO: RENDU ICI , a,s sont creer pour les thumps ???
    getDataValuesFrom (cage) {
        const dataValues = {
            b:this.getDataBaseValues        (cage),
            p:this.getParentContainerValues (cage),
            d:this.getSpriteValues          (cage&&cage.d),
            n:this.getSpriteValues          (cage&&cage.n),
        };
        // si ces un spriteAnimations ?
        if(dataValues.b.type === "animationSheet"){
            dataValues.a = this.getAnimationsValues(cage);
        }
        if(dataValues.b.type === "spineSheet"){
            dataValues.s = this.getSpineValues(cage);
        }
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
        const isAnimations = !!this.dataBase.animations && this.dataBase;
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
            autoGroups  : cage                  ? cage.autoGroups         : new Array(7).fill(false) , // permet de changer automatiquement de layers selon player
            zIndex      : cage                  ? cage.zIndex             : 0                        , // locked
            parentGroup : cage&&cage.parentGroup? cage.parentGroup.zIndex : null                     , //  for editor, need to manual set parentGroup on addMouse
            zHeight     : cage                  ? cage.zHeight             : 0                        , // ajust height layers from sort pivot+ zHeight
            // conditionInteractive TODO:
        };
    };
    
    getSpriteValues(sprite, dataBase,textureName){ // .d .n
        if(sprite instanceof Array){return {}}; // si spine, this.d,n sont des array, rien faire pour le moment TODO:
        return {
            // observable point
            position : sprite ? [sprite.position ._x,sprite.position ._y] :[0  ,0],
            scale    : sprite ? [sprite.scale    ._x,sprite.scale    ._y] :[1  ,1],
            skew     : sprite ? [sprite.skew     ._x,sprite.skew     ._y] :[0  ,0],
            pivot    : sprite ? [sprite.pivot    ._x,sprite.pivot    ._y] :[0  ,0],
            anchor   : sprite ? [sprite.anchor   ._x,sprite.anchor   ._y] :this._textureName && [0.5,1] || [0,0],
            // transform
            rotation  : sprite ?   sprite.rotation  :0        ,
            alpha     : sprite ?   sprite.alpha     :1        ,
            blendMode : sprite ?   sprite.blendMode :0        ,
            tint      : sprite ?   sprite.tint      :0xffffff ,
            color     : sprite ? !!sprite.color     :false    ,
            setDark  : sprite && sprite.color? PIXI.utils.hex2rgb(sprite.color.darkRgba ).reverse() : [0,0,0],
            setLight : sprite && sprite.color? PIXI.utils.hex2rgb(sprite.color.lightRgba).reverse() : [1,1,1],
        };
    };

    // les datas pour les spriteAnimations
    getAnimationsValues(cage){ 
        return {
            //totalFrames    :cage? cage.totalFrames    : this._textureName?this.dataBase.animations[this._textureName].length:Infinity, // locked
            animationSpeed :cage? cage.animationSpeed : 1     ,
            loop           :cage? cage.loop           : true ,
            autoPlay       :cage? cage.autoPlay       : true  ,
        };
    };

    // les datas pour les spriteAnimations
    getSpineValues(cage){
        return {
            //totalFrames    :cage? cage.totalFrames    : this._textureName?this.dataBase.animations[this._textureName].length:Infinity, // locked
            defaultAnimation :cage? cage.s.state.getCurrent(0).animation.name : 'idle',
            timeScale        :cage? cage.s.state.tracks[ 0 ].timeScale : 1 ,
            startTime        :cage? cage.s.startTime : 0 ,
            defaultMix       :cage? cage.s.stateData.defaultMix : 0.2 ,
        };
    };

    //updatebefor: update le dataValue aver le sprite connecter avant de stringify
    clone(updatebefor){
        const dataValues = JSON.parse(JSON.stringify(this.dataValues));
        return new this.constructor(dataValues);
    };

   
}