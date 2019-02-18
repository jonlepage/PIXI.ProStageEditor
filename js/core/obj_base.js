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
    constructor(dataBaseName,textureName,dataValues,register) {
        //this.dataValues = dataValues || this.getDataValuesFrom(false);
        //Object.defineProperty(this, 'register', { value: register });
        // si Boolean, creer dataValues, si Objet asigner, ou false, 
        this._dataBaseName = dataBaseName ;
        this._textureName  = textureName  ;
        this.dataValues = {};
        this.register = register || null;
        dataValues && this.setDataValues(dataValues);
       //this._id = null; // when linked to a sprite? {spriteID,sceneID,dataObjID}
       //this._spriteID = null;
       //this._sceneName = $stage.scene.constructor.name;//FIXME: PLUTOT AJOUTER via  REGISTER

       
    };
    //set register(register) {Object.assign(this,register)}; // register id from existed saved data json
    //get register() { return {_id:this._id, _spriteID:this._spriteID,_sceneName:this._sceneName } };
    get dataBase() { return $Loader.Data2[ this._dataBaseName ] || false };
    get textureName() { return this._textureName && { d:this._textureName,n:this._textureName+'_n'} };
    get b() { return this.dataValues.b || false };
    get p() { return this.dataValues.p || false };
    get d() { return this.dataValues.d || false };
    get n() { return this.dataValues.n || false };
    get a() { return this.dataValues.a || false };
    get s() { return this.dataValues.s || false };
    get l() { return this.dataValues.l || false };
    
    // link cage display objet container when asigned, les data peuvent etre accesible partout, mes pas les sprites
    get attache() { return this.register? $objs.list_s[this.register._sID] : false };
    get isValid() {return !!this.dataValues.p }; // check if dataObj initialised with dataValue

    // set les dataValues ou creer par default ou selon le container connecter
    setDataValues(dataValues,fromCage) {
        this.dataValues = (dataValues === true) && this.getDataValues(fromCage) || Object.assign({},dataValues);
    };

    // the DataValues will used for make saveGame or dataEditor manager
    getDataValues(fromCage) {
        const dataBase = this.dataBase;
        const cage = fromCage? this.attache : false;
        //dataValues.b = this.getDataBaseValues(this.dataBase), //FIXME: inutile pour le moment dataBase est mintenant une class
        const b = this.getValues_base (dataBase);
        const p = this.getValues_parent (cage  );
        const d = this.getValues_child  (cage.d);
        const n = this.getValues_child  (cage.n);
        const a = dataBase.isAnimationSheet && this.getValues_animation(cage);
        const s = dataBase.isSpineSheet     && this.getValues_spine    (cage);
        //dataValues.l = dataBase.isLight && this.getValues_light(cage);
        //dataValues.t = dataBase.isTilesheets && this.getValues_tile(cage);
        return {b,p,d,n,a,s};
    };

    // offre des bases accesible, car pendant la creation objet, certaine dataBase sont pas accesible
    getValues_base(dataBase){
        return {
            containerType : dataBase .containerType ,
            dataType      : dataBase .dataType      ,
            multiPacks    : dataBase .isMultiPacks  ,
            description   : dataBase .root          ,
            normals       : dataBase .isNormal        ,
        };
    };

    // CONTAINER
    getValues_parent(cage){
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
            affine : cage? cage.proj.affine : PIXI.projection.AFFINE.AXIS_X, // 2
            // conditionInteractive TODO:
        };
    };
    
    // SPRITE
    getValues_child(sprite){
        if(sprite instanceof Array){return {}}; // si spine, this.d,n sont des array, rien faire pour le moment TODO:
        return {
            // observable point
            position : sprite ? [sprite.position ._x,sprite.position ._y] :[0  ,0],
            scale    : sprite ? [sprite.scale    ._x,sprite.scale    ._y] :[1  ,1],
            skew     : sprite ? [sprite.skew     ._x,sprite.skew     ._y] :[0  ,0],
            pivot    : sprite ? [sprite.pivot    ._x,sprite.pivot    ._y] :[0  ,0],
            anchor   : sprite ? [sprite.anchor   ._x,sprite.anchor   ._y] :[0.5,1],
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
    getValues_animation(cage){ 
        return {
            //totalFrames    :cage? cage.totalFrames    : this._textureName?this.dataBase.animations[this._textureName].length:Infinity, // locked
            animationSpeed :cage? cage.animationSpeed : 1     ,
            loop           :cage? cage.loop           : true ,
            autoPlay       :cage? cage.autoPlay       : true  ,
        };
    };

    // les datas pour les spriteAnimations
    getValues_spine(cage){
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
        const jsonValues = JSON.parse(JSON.stringify(this));
        return new this.constructor(jsonValues._dataBaseName,jsonValues._textureName,jsonValues.dataValues);
    };

   
}