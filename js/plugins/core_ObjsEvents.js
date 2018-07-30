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
        this.list_noEvents = [];
        this.list_events = [];
        this.list_cases = [];

    };
};
$Objs = new _objs();
console.log1('$Objs: ', $Objs);

//$Objs.createFromList();  
_objs.prototype.createFromList = function(LIST) {
    for (let i=0, l=LIST.length; i<l; i++) {
        const e = LIST[i];
        const Data_Values = e.Data_Values;
        const Data = $Loader.Data2[e.Data.name];
        const textureName = e.textureName;
        // from type
        switch (Data.type) {
            case "tileSheet":
                this.list_master[i] = this.create_fromTileSheet(Data,Data_Values,textureName);
            break;
        };
    };
};

 _objs.prototype.create_fromTileSheet = function(Data, Data_Values, textureName){
     console.log('Data_Values: ', Data_Values);
    const cage = new PIXI.Container();
    const sprite_d = new PIXI.Sprite(Data.textures[textureName]);
    const sprite_n = new PIXI.Sprite(Data.textures_n[textureName+"_n"]);
    // asign group display
    sprite_d.parentGroup = PIXI.lights.diffuseGroup;
    sprite_n.parentGroup = PIXI.lights.normalGroup;
    //parenting
    cage.addChild(sprite_d, sprite_n);
    cage.parentGroup = $displayGroup.group[1]; //TODO: add to json addAttr_default
    //cage.zIndex = mMY; //TODO: add to json addAttr_default
    // reference
    sprite_d.name = textureName;
    sprite_n.name = textureName+"_n";
    cage.Sprites = {d:sprite_d, n:sprite_n, sheetName:Data.name, groupTexureName:textureName, groupType:Data.type};
    cage.Type = Data.type;
    // proprety attributs
    this.addAttr_default(cage, Data_Values);
    cage.getBounds(cage); //TODO: BOUND MAP
    return cage;
};

// add general attributs
_objs.prototype.addAttr_default = function(cage, Data_Values){
    for (const key in Data_Values) {
        const value = Data_Values[key];
        switch (key) {
            case "scale":case "skew":case "pivot":case "position":
                cage[key].set(...value);
            break;
            case "alpha":case "rotation":case "groupID":
                cage[key] = !isFinite(value) && value || +value;
            break;
            case "anchor":
                cage.Sprites.d[key].set(...value);
                cage.Sprites.n[key].set(...value);
            break;
            case "blendMode":
                cage.Sprites.n[key] = +value;
            break;
            case "tint":
                cage.Sprites.d[key] = +value;
            break;
            case "zIndex":
                cage.zIndex = +value;
            break;
        };
    };
};
