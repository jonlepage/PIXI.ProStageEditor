
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
    constructor(dataObj) {
        super(dataObj);
        //this.createBases(dataObj);
        //this.asignDataValues(dataObj.dataValues, true);
        //this.addChild(this.d,this.n);
    };
    // getters for ContainerTiles

    createBases (dataObj = this.dataObj) {
        // TODO: les bg pourrai etre parfoi decouper en arrays dans textures packer
        const textureName = dataObj.b.dataName;
        const td = textureName? dataObj.dataBase.textures   [textureName     ] : PIXI.Texture.WHITE;
        const tn = textureName? dataObj.dataBase.textures_n [textureName+'_n'] : PIXI.Texture.WHITE;
        const d = new PIXI.projection.Sprite2d(td);
        const n = new PIXI.projection.Sprite2d(tn);
        this.Sprites = {d,n};
        this.addChild(d,n);
    };

    asignDataObjValues(dataObj = this.dataObj) {
        if(!dataObj.b.dataName){
            this.n.scale.set($app.screen.width/10, $app.screen.height/10); // si pas de texture? ces un background vide, que on ajust a lecrant
        }
        this.d.anchor.set(0.5,1);
        this.n.anchor.set(0.5,1);
        this.parentGroup = $displayGroup.group[0];
        this.d.parentGroup = PIXI.lights.diffuseGroup;
        this.n.parentGroup = PIXI.lights.normalGroup;
 
    
       //this.pivot.set(this.width/2,this.height);
       //this.position.set(this._sceneW/2,this._sceneH);
    };

    affines (value) {
        this.affine = 0;
    };
};

//END CLASS
    
    