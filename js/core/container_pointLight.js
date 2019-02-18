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
        super(0xFFFFFF, 1, Infinity);
        this.parentGroup = PIXI.lights.lightGroup
        this.dataObj = dataObj;
        this.convertTo2d();
       // dataValues = dataValues || this.getDataValues(true);
       // this.asignValues(dataValues, true);
    };
    // getters for ContainerDirectionalLight
    // dispatch values asigment
    asignDataObjValues(dataObj = this.dataObj) {
        Container_Base.prototype.asignValues.call(this,dataObj.p);
        this.asignValues(dataObj.l);
    };

    getDataValues () {
        return this.dataObj.dataValues = this.dataObj.getDataValuesFrom(this);
    };

    asignDataObjValues(dataObj = this.dataObj) {
        Container_Base.prototype.asignValues.call(this,dataObj.p);
        this.asignValues(dataObj.l);
    };

    asignValues (data) {
        data && Object.keys(data).forEach(key => {
             const value = data[key];
             switch (key) {
                case "radius":
                    this.radius = value===0?Infinity:value;
                 break;
                 case "indices":
                     this[key].set(value);
                 break;
                 default:
                     this[key] = value;
                 break;
             };
         });
     };

    affines (value) {
      this.proj.affine = value;
    };

};//END CLASS
    
    