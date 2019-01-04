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
    constructor(dataValues,localID,globalID,arrayID) {
        this.dataValues = dataValues;
        this.id = {localID,globalID,arrayID};
        this.cage = null;
    };

    get dataBase() { return $Loader.Data2[this.dataValues.p.dataName] }

    initialize(){
    
    }

    /**@description initialise the sprite texture */
    initializeSprites(dataValues){
        dataValues = dataValues || this.dataBase.dataValues;
        let cage;
        switch (dataBase.type) {
            case "animationSheet":
            cage = new PIXI.ContainerAnimations(dataBase, textureName, dataValues);break;
            case "spineSheet":
            cage = new PIXI.ContainerSpine(dataBase, textureName, dataValues);break;
            case "tileSheet":
            cage = new PIXI.ContainerTiles(dataBase, textureName, dataValues);break;
            default:
            throw console.error(`FATAL error in json, check the {'type'}!`)
        };
        this.cage = cage;
    }
  

}