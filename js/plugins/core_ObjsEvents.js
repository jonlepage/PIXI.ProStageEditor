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

_objs.prototype.create_list_cases = function() {
    this.list_cases = this.getCases();
    this.list_cases.forEach(c => {
        c.interactive = true;
        c.on('pointerover', this.pointer_overIN, this);
        c.on('pointerout', this.pointer_overOUT, this);
        
    });
};




// TODO:  need buffers cache
_objs.prototype.newHitFX = function(e) {
    const textureName = "casesHitsG";
    const dataBase = $Loader.Data2.caseFXhit1;
    const dataValues = PIXI.CageContainer.prototype.getDataValues(dataBase, textureName);
    dataValues.p.parentGroup = 1;
    var fx = new PIXI.ContainerAnimations(dataBase, textureName,dataValues);
     fx.parentGroup = $displayGroup.group[0];
     fx.position.set(this.x,this.y+120);
     fx.scale.set(0.8,0.8)
    this.parent.addChild(fx);
};

_objs.prototype.pointer_overIN = function(e) {
    e.currentTarget.alpha = 1;
    console.log('this.list_cases.indexOf(e.currentTarget): ', this.list_cases.indexOf(e.currentTarget));
    this.newHitFX.call(e.currentTarget);
    this.computePathTo(e.currentTarget);
};

_objs.prototype.pointer_overOUT = function(e) {
    e.currentTarget.alpha = 0.7;
};

//TODO: RENDU ICI , ADD DRAW MODE PATH CONNEXTIONS in editors
// calcule le chemin vers un target
_objs.prototype.computePathTo = function(target) {
    const playerCase = this.list_cases[0]; //FIXME: faire une method player pour obtenir la case sur laquelle il est 
    console.log('target: ', target);
    const pathInterval = []; //
    const patternFromInterval = []; // store path id pattern

    testPath.push( setInterval(function(){ 
        alert("Hello") 
    }, 100) );


};


/*
var tree = [ // ex fake pixi node display objs
    {id: 0, pathConnexion:[1]},
    {id: 1, pathConnexion:[0,2]},
    {id: 2, pathConnexion:[1,3,4]},
    {id: 3, pathConnexion:[2,4]},
    {id: 4, pathConnexion:[2,5]},
    {id: 5, pathConnexion:[4,6]},
    {id: 6, pathConnexion:[5]},
    {id: 7, pathConnexion:[]},
    {id: 8, pathConnexion:[]},
    {id: 9, pathConnexion:[]}
    ];

function dfs() {

};

*/
// Depth First Search algo, return path matix
_objs.prototype.dfs = function(tree, from=0, id) {
    const stack   = [];
    const pattern = [];
    stack.push(tree[from]);
    while (stack.length !== 0) {
        for (let i = 0; i < stack.length; i++) {
            let node = stack.pop();
            if (node.id === id) {
                 // pattern succed draw and found node target, so return the path matrix
                 pattern.push(node.id);
                return pattern;
            };
            node.pathConnexion.forEach(nextID => {
                if(!pattern.contains(nextID)){
                    !pattern.contains(node.id) && pattern.push(node.id); // valid pattern
                    stack.push(tree[nextID]);
                }
            });
        };
    };
    return null
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