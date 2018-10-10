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
    list && this.createFromList(list);
};

_objs.prototype.createFromList = function(list) {
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

_objs.prototype.create_fromSpineSheet = function(dataBase, dataValues, textureName){
    const cage = new PIXI.CageContainer(dataBase, dataValues);
    return console.log('cage: ', cage);
    const sprite_d = new PIXI.spine.Spine(Data.spineData);
        sprite_d.skeleton.setSkinByName(textureName);
        sprite_d.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
        sprite_d.skeleton.setSlotsToSetupPose();
    const sprite_n = sprite_d.convertToNormal(); // allow swap texture hover tile

   this.addAttr_default(cage, Data_Values, sprite_d, null, Data, textureName); //TODO: sprite_n: LOOK A WAY TO WORK WIT HSPINE NORMAL AS SLOTS ARRAYS
   cage.getBounds(cage); //TODO: BOUND MAP
   
   return cage;
};

_objs.prototype.create_fromAnimationSheet = function(Data, Data_Values, textureName){
   const cage = new PIXI.ContainerAnimations();
   const sprite_d = new PIXI.extras.AnimatedSprite(Data.textures[textureName]);
   const sprite_n = cage.addNormal(sprite_d, Data.textures_n[textureName]);

   // proprety attributs
   this.addAttr_default(cage, Data_Values, sprite_d, sprite_n, Data, textureName);
   cage.getBounds(cage); //TODO: BOUND MAP
   cage.play(0);
   return cage;
};

 _objs.prototype.create_fromTileSheet = function(Data, Data_Values, textureName){
    const cage = new PIXI.Container();
    const sprite_d = new PIXI.Sprite(Data.textures[textureName]);
    const sprite_n = new PIXI.Sprite(Data.textures_n[textureName+"_n"]);
    // proprety attributs
    this.addAttr_default(cage, Data_Values, sprite_d, sprite_n, Data, textureName);
    return cage;
    
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
        this.list_master[i].name === "cases" && list.push(this.list_master[i]);
    };
    return this.list_cases = list;
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