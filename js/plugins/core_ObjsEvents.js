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
        //this.list_cases = [];
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
            case "animationSheet":
                this.list_master[i] = this.create_fromAnimationSheet(Data,Data_Values,textureName);
            break;
            case "spineSheet":
                this.list_master[i] = this.create_fromSpineSheet(Data,Data_Values,textureName);
            break;
        };
    };
};

_objs.prototype.create_fromSpineSheet = function(Data, Data_Values, textureName){
    const cage = new PIXI.Container();

    const spine = new PIXI.spine.Spine(Data.spineData);
    spine.skeleton.setSkinByName(textureName)//();
    spine.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
    spine.skeleton.setSlotsToSetupPose();
    sprite_d = spine;

   // asign group display
   sprite_d.parentGroup = PIXI.lights.diffuseGroup;
   //sprite_n.parentGroup = PIXI.lights.normalGroup; TODO: ASK IVAN
   //parenting
   cage.addChild(sprite_d);
   cage.parentGroup = $displayGroup.group[1]; //TODO: add to json addAttr_default
   //cage.zIndex = mMY; //TODO: add to json addAttr_default
   // reference
   sprite_d.name = textureName;
    cage.Sprites = {d:sprite_d, n:null};
   
   cage.Type = Data.type;
   cage.name = Data.name;
   cage.TexName = textureName || false;

   // proprety attributs
   this.addAttr_default(cage, Data_Values);
   cage.getBounds(cage); //TODO: BOUND MAP
   return cage;
};

_objs.prototype.create_fromAnimationSheet = function(Data, Data_Values, textureName){
   const cage = new PIXI.ContainerAnimations();
        cage.Sprites = {d:null, n:null}; // need befor because 'addNormal' useIt
   const sprite_d = new PIXI.extras.AnimatedSprite(Data.textures[textureName]);
        cage.Sprites.d = sprite_d;
   const sprite_n = cage.addNormal(Data.textures_n[textureName]);
        cage.Sprites.n = sprite_n; // FIXME: voir constructeur
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
   
   cage.Type = Data.type;
   cage.name = Data.name;
   cage.TexName = textureName || false;

   // proprety attributs
   this.addAttr_default(cage, Data_Values);
   cage.getBounds(cage); //TODO: BOUND MAP
   return cage;
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
    cage.Sprites = {d:sprite_d, n:sprite_n};
    cage.Type = Data.type;
    cage.name = Data.name;
    cage.TexName = textureName || false;

    // proprety attributs
    this.addAttr_default(cage, Data_Values);
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
                if(Number.isFinite(value[0])){
                    cage.Sprites.d[key].set(...value);
                    cage.Sprites.n[key].set(...value);
                };
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