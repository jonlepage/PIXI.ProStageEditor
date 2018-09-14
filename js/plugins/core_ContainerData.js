
/*:
// PLUGIN □────────────────────────────────□CONTAINER DATA MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc manager pixi container datas
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Remplacer la class Container par container Data , qui aura pour effet de pourvoir gerer des method specials
Comme obtenir de facon general les propreties pour les json
La class containerData est atribuer a tous les obj sprites du jeux pour difuse et normal
*/

PIXI.CageContainer = (function () {
    class CageContainer extends PIXI.Container {
        constructor(dataBase, dataValues) {
            super();
            this.createBases(dataBase, dataValues);
            dataValues && this.asignValues(dataValues);
        };
        get d() { return this.Sprites.d }; // return diffuse sprites
        get n() { return this.Sprites.n }; // return normals sprites //TODO: spine normal are arrays

    };

    CageContainer.prototype.createBases = function(dataBase, dataValues) {
        this.dataName = dataBase.name;
        this.textureName = dataBase.textureName;
        this.Type = dataValues && dataBase.type || "thumbs"; // if no dataValues arg? its a thumbs

        if(this.Type === "tileSheet"){
            const sprite_d = new PIXI.Sprite(dataBase.textures[dataValues.textureName]); // take first tex for thumbs, preview will take all array
            const sprite_n = new PIXI.Sprite(dataBase.textures_n[dataValues.textureName+"_n"]); // allow swap texture hover tile
            this.Sprites = {d:sprite_d, n:sprite_n};
            this.addChild(sprite_d, sprite_n);
        }else
        if(this.Type === "animationSheet"){
            const sprite_d = new PIXI.extras.AnimatedSprite(this.Data.textures[this.TexName]);
            const sprite_n = this.addNormal(sprite_d, this.Data.textures_n[this.TexName]);
            this.Sprites = {d:sprite_d, n:sprite_n};
            this.addChild(sprite_d,sprite_n);
            this.play(0);
        }else
        if(this.Type === "spineSheet"){
            const spine = new PIXI.spine.Spine(this.Data.spineData);
            const spine_n = spine.convertToNormal();
            
            spine.skeleton.setSkinByName(this.TexName);
            spine.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
            spine.skeleton.setSlotsToSetupPose();
            this.Sprites = {d:spine, n:sprite_n};
            this.addChild(spine,spine_n);
        }else
        if(this.Type === "thumbs"){
            const sprite_thumbs = new PIXI.Sprite(dataBase.baseTextures[0]); // thumbs [0], and previews will take all arrays [...]
            this.Sprites = {d:sprite_thumbs};
            this.addChild(this.Sprites.d);
        };
        

    };

    CageContainer.prototype.asignValues = function(dataValues) {
        for (const key in dataValues) {
            const value = dataValues[key];
            switch (key) {
                case "position":case "scale":case "skew":case "pivot":
                    this[key].set(...value);
                    break;
                case "anchor":
                    this.d.anchor.set(...value);
                    this.n.anchor.set(...value);
                break;
                case "blendMode":case "tint":
                this.d[key] = value.d;
                this.n[key] = value.n;
                case "setDark": case "setLight":
                    if(this.d.color){ // convertToHeaven(); based on boolean editor, or take look on pluginName ?
                        this.d.color[key](...value.d);
                        this.n.color[key](...value.n);
                    };
                break;
                case "parentGroup": // if have parentGroup, also asign diffuseGroup,normalGroup
                    this.parentGroup = $displayGroup.group[value];
                    this.d? this.d.parentGroup = PIXI.lights.diffuseGroup : void 0;
                    this.Type!=="spineSheet"? this.n.parentGroup = PIXI.lights.normalGroup : void 0;
                break;
                default: // "textureName", "groupID", "name"
                    this[key] = value;
                break;
            };
        };
        this.DataValues = dataValues;
    };


    CageContainer.prototype.createJson = function() {

    };

    CageContainer.prototype.asignJson = function(dataValues) {

    };


//END
return CageContainer;
})();

