/*:
// PLUGIN □────────────────────────────────□CONTAINER DIRECTIONAL LIGHT MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** @memberof  PIXI.lights.DirectionalLight */
class Container_DirectionalLight extends PIXI.lights.DirectionalLight {
    constructor(dataObj ,brightness, color) {
        super(0xffffff, 1, $mouse.follower);
        this.dataObj = dataObj;
    };
    // getters for ContainerDirectionalLight
    
    
// get dataValue of AmbientLight
    getDataValues (def) {
        const AmbientLight_Data = {
            // base
            shaderName      : def? "directionalLightShader" : this.shaderName     , //lock ?
            blendMode       : def? 1                    : this.blendMode      ,
            alpha           : def? 1                    : this.alpha          ,
            // light
            drawMode        : def? 4                    : this.drawMode       ,
            lightHeight     : def? 0.075                : this.lightHeight    ,
            brightness      : def? 1                    : this.brightness     ,
            falloff         : def? [0.75,3,20]          : this.falloff        ,
            color           : def? 16777215             : this.color          ,
            // other
            //useViewportQuad : def? true                 : this.useViewportQuad,
            //indices         : def? [0,1,2,0,2,3]        : this.indices        ,
            //displayOrder    : def? 8                    : this.displayOrder   ,
        };
        return AmbientLight_Data;
    };

    // dispatch values asigment for spine
    asignValues (dataValues, storeValues=true) {
        this.computeValue(dataValues);
        if(storeValues){ this.dataValues = dataValues };
    };

    computeValue (data) {
        for (const key in data) {
            const value = data[key];
            this[key] = value;
        };
    };

};//END CLASS
    
    