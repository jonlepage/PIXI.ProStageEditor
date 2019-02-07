/*:
// PLUGIN □────────────────────────────────□OBJS LIGHT SHADDER ...□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc les light obj ne provienne pas de spritesheet et sont isoler des objet base, ce sont des objet
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
class dataObj_light{
    constructor(dataValues,type) {
        // dataValues: from json or new from [dataBase,textureName]
        this._id = null; // when linked to a sprite? {spriteID,sceneID,dataObjID}
        this._spriteID = null;
        this._sceneName = $stage.scene && $stage.scene.name || "stage";
        
        this._type = type || dataValues.b.type;
        this.dataValues = dataValues || this.getDataValuesFrom(false);
    };
    set register(register) {Object.assign(this,register)}; // register id from existed saved data json
    get register() { return {_id:this._id, _spriteID:this._spriteID,_sceneName:this._sceneName } };
    get dataBase() { return $Loader.Data2[ this._dataBase ] };
    get b() { return this.dataValues.b };
    get p() { return this.dataValues.p };
    get l() { return this.dataValues.l };

    get sprite() { return (this._sceneName===$objs._sceneName)? $objs.spritesFromScene[this._spriteID] : null };// link cage display objet container when asigned

    initialize(){
       // getDataValues (dataBase, textureName) { TODO:
    };

    getDataValuesFrom (cage) {
        const dataValues = {
            b:this.getDataBaseValues        (cage),
            p:this.getParentContainerValues (cage),
            l:this.getLightValue            (cage),
        };
        return dataValues;
    };

    // les light non pas de dataValue officel
    getDataBaseValues(cage){
        return {
            classType  : 'light', //les class type pour les data objet type: cases, house, door, mapItemp, charactere
            type       : this._type     , // locked: les type the container , tile,,animation,spine,light..., si pas textureName, aucun class type
            groupID    : 'light'  , // asigner un groupe dapartenance ex: flags
           // name       : dataBase    .name     , // asigner un nom unique
           // description: dataBase    .root     , // un description aide memoire
           // normals    : dataBase    .normal   , // flags setter getter normal parentGroup 
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
        };
    };
    


    // les datas pour les spriteAnimations
    getLightValue(cage){ 
        return {
           // shaderName      : cage? this.shaderName      : "directionalLightShader" , //lock ?
            displayOrder    : cage? cage.displayOrder    : 0        ,
            drawMode        : cage? cage.drawMode        : 4        ,
            blendMode       : cage? cage.blendMode       : 1        ,
            radius          : cage? cage.radius          : Infinity ,
            lightHeight     : cage? cage.lightHeight     : 0.075    ,
            brightness      : cage? cage.brightness      : 1        ,
            color           : cage? cage.color           : 16777215 ,
            useViewportQuad : cage? cage.useViewportQuad : true     ,
            indices         : cage? cage.indices         : [0       ,1,2,0,2,3] ,
            falloff         : cage? cage.falloff         : [0.75    ,3,20],
        };
    };

    //updatebefor: update le dataValue aver le sprite connecter avant de stringify
    clone(updatebefor){
        const dataValues = JSON.parse(JSON.stringify(this.dataValues));
        return new this.constructor(dataValues);
    };

   
}