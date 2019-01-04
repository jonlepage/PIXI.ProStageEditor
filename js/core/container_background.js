
/*:
// PLUGIN □────────────────────────────────□CONTAINER BACKGROUND MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** @memberof Container_Base */
class Container_Background extends Container_Base {
    // note: les bg peut etre decouper en arrays[[1,2,3],[1,2,3]] pour textures packer, et textureName pourrai etre diferent version , season !?
    constructor(dataBase, dataValues) {
        super();
        dataValues = dataValues || this.getDataValues(dataBase);
        this.createBases(dataBase,dataValues);
        this.asignValues(dataValues, true);

    };
    // getters for ContainerTiles

    createBases (dataBase, dataValues) {
        // TODO: les bg pourrai etre parfoi decouper en arrays dans textures packer
        const td = dataBase && dataBase.textures  [dataBase.name     ] || PIXI.Texture.EMPTY; // ref texture:diffuse
        const tn = dataBase && dataBase.textures_n[dataBase.name+'_n'] || PIXI.Texture.EMPTY; // ref texture:normal
        const d = new PIXI.Sprite(td);
        const n = new PIXI.Sprite(tn);
        this.Sprites = {d,n};
        this.addChild(d,n);
    };
    
    // the DataValues will used for make saveGame or dataEditor manager
    getDataValues (dataBase) {
        const def = !!dataBase;
        // parent data value
        const p = {
            type        : def? dataBase .type : this .type         , // locked
            dataName    : def? dataBase .name : this .dataName     , // locked
            name        : def? "map name information" : this .name , // asigner un nom pour la carte, permet afficher titre
            description : def? dataBase .root : this .description  , // un description aide memoire
            parentGroup : 0                                        , // BG alway group 0
        };
        return { p };
    };
    
    clearBackground () {
        this.removeChild(this.d,this.n);
        PIXI.utils.clearTextureCache();
    };
};

//END CLASS
    
    