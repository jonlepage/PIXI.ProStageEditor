
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
    constructor(dataObj, dataBase, textureName) {
        super();
        dataObj = dataObj || new dataObj_base( this.getDataValues(dataBase, textureName) );
        this.DataLink = dataObj;
        this.createBases(dataObj);
        this.asignDataValues(dataObj.dataValues, true);
        this.addChild(this.d,this.n);

    };
    // getters for ContainerTiles

    createBases (dataObj) {
        // TODO: les bg pourrai etre parfoi decouper en arrays dans textures packer
        const dataBase = dataObj.dataBase; // getter
        const tex_d = dataBase ? dataBase.textures  [dataBase.name     ] : PIXI.Texture.EMPTY; // ref texture:diffuse
        const tex_n = dataBase ? dataBase.textures_n[dataBase.name+'_n'] : PIXI.Texture.EMPTY; // ref texture:normal
        const d = new PIXI.Sprite(tex_d);
        const n = new PIXI.Sprite(tex_n);
        this.Sprites = {d,n};
    };
    
    asignDataValues(dataValues){
        this.asignValues(dataValues.p);
    };

    clearBackground () {
        this.removeChild(this.d,this.n);
        PIXI.utils.clearTextureCache();
    };
};

//END CLASS
    
    