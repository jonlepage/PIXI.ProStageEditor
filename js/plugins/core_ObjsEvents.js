/*:
// PLUGIN □────────────────────────────────□OBJS SPRITES , ANIMATIONS, SPINES, EVENTS ...□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Manage ,create game objs and events for Scene stage
* V.1.0
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Permet de constuire des objets specifiques selon leur type.
Classer egalement par categorie d'interaction. ex: tree,plant,door
Voir le Stages
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $Objs CLASS: _objs
//└------------------------------------------------------------------------------┘
class _objs{
    constructor() {
        this.list_master = []; // Full Objs Lists
        //this.list_noEvents = [];
        //this.list_events = [];
        this.list_cases = [];
    };
};
$Objs = new _objs();
console.log1('$Objs: ', $Objs);

//$Objs.initialize();
_objs.prototype.initialize = function(list) {
    this.list_master = [];
    this.list_cases = [];
    if(list){
        // TODO: RENDU ICI, PEUT ETRE fair un dispatch all in one [list_masterm, list_cases....]
        this.create_list_master(list); //create: list_master
        this.create_list_cases(list); //create: list_cases
    };
};

_objs.prototype.create_list_master = function(list) {
    for (let i=0, l=list.length; i<l; i++) {
        const dataValues = list[i];
        const textureName = dataValues.p.textureName;
        const dataBase = $Loader.Data2[dataValues.p.dataName];
        let cage;
        switch (dataValues.p.type) {
            case "animationSheet":
            cage =  new PIXI.ContainerAnimations(dataBase, textureName, dataValues);break;
            case "spineSheet":
            cage =  new PIXI.ContainerSpine(dataBase, textureName, dataValues);break;
            default:
            cage =  new PIXI.ContainerTiles(dataBase, textureName, dataValues);break;           
        }
        this.list_master.push(cage);
    };
};

_objs.prototype.create_list_master = function(list) {
    for (let i=0, l=list.length; i<l; i++) {
        const dataValues = list[i];
        const textureName = dataValues.p.textureName;
        const dataBase = $Loader.Data2[dataValues.p.dataName];
        let cage;
        switch (dataValues.p.type) {
            case "animationSheet":
            cage =  new PIXI.ContainerAnimations(dataBase, textureName, dataValues);break;
            case "spineSheet":
            cage =  new PIXI.ContainerSpine(dataBase, textureName, dataValues);break;
            default:
            cage =  new PIXI.ContainerTiles(dataBase, textureName, dataValues);break;           
        }
        this.list_master.push(cage);
    };
};


// add general attributs
_objs.prototype.addAttr_default = function(cage, Data_Values, d, n, Data, textureName){
   // asign group display
   cage.parentGroup = $displayGroup.group[Data_Values.parentGroup]; //TODO: add to json addAttr_default
   cage.zIndex = Data_Values.zIndex;
   
   d.parentGroup = PIXI.lights.diffuseGroup;
   n.parentGroup = PIXI.lights.normalGroup;
   // reference
   cage.Sprites = {d:d,n:n};
   cage.name = Data.name;
   cage.Type = Data.type;
   cage.TexName = textureName || false;
   d.name = textureName;
   n? n.name = textureName+"_n" : void 0;

   cage.addChild(d);
   n && cage.addChild(n);
};

_objs.prototype.getsByID = function(id) {
    const list = [];
    for (let i=0, l=this.list_master.length; i<l; i++) {
        this.list_master[i].groupID === id && list.push(this.list_master[i]);
    };
    return list;
};

_objs.prototype.getsByName = function(name) {
    for (let i=0, l=this.list_master.length; i<l; i++) {
        if(this.list_master[i].name === name){
            return this.list_master[i];
        } 
    };
    return null;
};

// get list from type : "spineSheet", "animationSheet", "tileSheet"
_objs.prototype.getsByType = function(type) {
    const list = [];
    for (let i=0, l=this.list_master.length; i<l; i++) {
        this.list_master[i].Type === type && list.push(this.list_master[i]);
    };
    return list;
};

// get all cases 
_objs.prototype.getCases = function() {
    const list = [];
    for (let i=0, l=this.list_master.length; i<l; i++) {
        this.list_master[i].groupID === "case" && list.push(this.list_master[i]);
    };
    return list;
};

// get list from type : "spineSheet", "animationSheet", "tileSheet"
_objs.prototype.getsSheetLists = function() {
    const list = [];
    for (let i=0, l=this.list_master.length; i<l; i++) {
        !list.contains( this.list_master[i].name ) && list.push(this.list_master[i].name);
    };
    return list;
};

// get list from type : "spineSheet", "animationSheet", "tileSheet"
_objs.prototype.destroy = function(obj, destroy) { // can be obj or string
    if(typeof obj === "object" ){
        const index = this.list_master.indexOf(obj);
        if(index>-1){
            this.list_master.splice(index, 1);
            obj.parent.removeChild(obj);
            destroy ? obj.destroy() : void 0;
            console.log('obj.destroy: ', obj.destroy);
        }
        return index;
    };
};