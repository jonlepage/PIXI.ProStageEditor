/*:
// PLUGIN □────────────────────────────────□CONTAINER DIRECTIONAL LIGHT MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** @memberof  PIXI.lights.PointLight */
class Container_PointLight extends PIXI.lights.PointLight {
    constructor(dataObj ,brightness, color) {
        super(0x00ff2a, 1);
        this.dataObj = dataObj;
        this.Sprites = {};
       // dataValues = dataValues || this.getDataValues(true);
       // this.asignValues(dataValues, true);
    };
    // getters for ContainerDirectionalLight
    
    getDataValues () {
        this.dataObj.dataValues = this.dataObj.getDataValuesFrom(this);
    };

    affines (value) {
        this.proj.affine = value;
    };

};//END CLASS
    
    