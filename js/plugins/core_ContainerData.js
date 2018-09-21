
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
            dataValues && this.asignValues(dataValues, true);
        };
        get d() { return this.Sprites.d }; // return diffuse sprites
        get n() { return this.Sprites.n }; // return normals sprites //TODO: spine normal are arrays
    };

    CageContainer.prototype.createBases = function(dataBase, dataValues) {
        // if no dataValues, it a type "thumbs" from editor
        if(!dataValues){
            this.dataName = dataBase.name; // asign thumbs dataName
            const sprite_thumbs = new PIXI.Sprite(dataBase.baseTextures[0]); // thumbs [0], and previews will take all arrays [...]
            this.Sprites = {d:sprite_thumbs};
            this.addChild(this.Sprites.d);
        }else
        if(dataValues.p.type === "tileSheet"){
            const sprite_d = new PIXI.Sprite(dataBase.textures[dataValues.p.textureName[0]]); // take first tex for thumbs, preview will take all array
            const sprite_n = new PIXI.Sprite(dataBase.textures_n[dataValues.p.textureName[1]]); // allow swap texture hover tile
            this.Sprites = {d:sprite_d, n:sprite_n};
            this.addChild(sprite_d, sprite_n);
        }else
        if(dataValues.type === "animationSheet"){
            const sprite_d = new PIXI.extras.AnimatedSprite(this.Data.textures[this.TexName]);
            const sprite_n = this.addNormal(sprite_d, this.Data.textures_n[this.TexName]);
            this.Sprites = {d:sprite_d, n:sprite_n};
            this.addChild(sprite_d,sprite_n);
            this.play(0);
        }else
        if(dataValues.type === "spineSheet"){
            const spine = new PIXI.spine.Spine(this.Data.spineData);
            const spine_n = spine.convertToNormal();
            
            spine.skeleton.setSkinByName(this.TexName);
            spine.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
            spine.skeleton.setSlotsToSetupPose();
            this.Sprites = {d:spine, n:sprite_n};
            this.addChild(spine,spine_n);
        };
    };

    CageContainer.prototype.asignValues = function(dataValues, storeValues) {
        console.log('dataValues: ', dataValues);
        // asign parent cage keys
        computeValue(this, dataValues.p);
        computeValue(this.Sprites.d, dataValues.d);
        computeValue(this.Sprites.n, dataValues.n);
        function computeValue(that, data){
            for (const key in data) {
                const value = data[key];
                switch (key) {
                    case "position":case "scale":case "skew":case "pivot":case "anchor":
                        that[key].set(...value);
                        break;
                    case "setDark": case "setLight":
                        if(that.color){ // convertToHeaven(); based on boolean editor, or take look on pluginName ?
                            that.color[key](...value);
                        };
                        break;
                    case "parentGroup": // if have parentGroup, also asign diffuseGroup,normalGroup
                    //TODO: NE PAS ASIGNER NORMAL POUR CERTAIN CA , COMME POUR EDITOR tilelibs
                        that.parentGroup = $displayGroup.group[value];
                        that.d.parentGroup = PIXI.lights.diffuseGroup;
                        !Array.isArray(that.n.parentGroup)? that.n.parentGroup = PIXI.lights.normalGroup : void 0;
                        break;
                    default:
                        that[key] = value;
                        break;
                };
            };
        };
        if(storeValues){ // can set false, if need keep temp old value for html data editor
            this.DataValues = dataValues;
        };
    };


    CageContainer.prototype.createJson = function() {

    };

    CageContainer.prototype.asignJson = function(dataValues) {

    };


//END
return CageContainer;
})();

