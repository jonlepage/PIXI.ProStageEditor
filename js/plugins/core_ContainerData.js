
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

PIXI.ContainerData = (function () {
    class ContainerData extends PIXI.Container {
        constructor() {
            super();
            this.Sprites = {};
            // others custom proprety for game obj
        };
        get d() { return this.Sprites.d }; // return diffuse sprites
        get n() { return this.Sprites.n }; // return normals sprites //TODO: spine normal are arrays

    };
    
    ContainerData.prototype.createJson = function(sprite_d, tex_n) {
        
    };

    ContainerData.prototype.asignJson = function(frame) {

    };


//END
return ContainerData;
})();

