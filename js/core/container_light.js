/*:
// PLUGIN □────────────────────────────────□CONTAINER DIRECTIONAL LIGHT MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
/** @memberof  PIXI.lights.PointLight */
class Container_light extends Container_Base {
    constructor(dataObj) {
        super(dataObj);
    };
    get l() { return this.Sprites.l || false };

    createBases () {
        const dataObj = this.dataObj;
        const dataBase = dataObj.dataBase;
        const textureName = dataObj.textureName;
        const td = dataObj.dataBase.textures   [textureName.d ];
        const tn = dataObj.dataBase.textures_n [textureName.n ];
        const d = new PIXI.Sprite(td) //new PIXI.projection.Sprite2d(td);
        const n = new PIXI.Sprite(tn)//new PIXI.projection.Sprite2d(tn);
        // create one point light
        const l = new PIXI.lights.PointLight();
        
        this.addChild(d,n,l);
        this.Sprites = {d,n,l};
    };


};//END CLASS
    
    