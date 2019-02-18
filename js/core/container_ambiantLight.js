/*:
// PLUGIN □────────────────────────────────□CONTAINER AMBIANT LIGHT MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** @memberof  PIXI.lights.AmbientLight */
class Container_AmbientLight extends PIXI.lights.AmbientLight {
    constructor(dataObj ,brightness, color) { //TODO: verifier que on peut changer brightness et color dans asignValues sans constructor
        super(0xFFFFFF,0.8);
        this.dataObj = dataObj;
        this.asignDataObjValues();

    };

    // dispatch values asigment
    asignDataObjValues(dataObj = this.dataObj) {
        //Container_Base.prototype.asignValues.call(this,dataObj.p);
       // this.asignValues(dataObj.l);
    };

    getDataValues () {
        return this.dataObj.dataValues = this.dataObj.getDataValuesFrom(this);
    };

   asignValues (data) {
       data && Object.keys(data).forEach(key => {
            const value = data[key];
            switch (key) {
                case "indices":
                    this[key].set(value);
                break;
                default:
                    this[key] = value;
                break;
            };
        });
    };


};//END CLASS
    
    