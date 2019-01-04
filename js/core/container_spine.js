
/*:
// PLUGIN □────────────────────────────────□CONTAINER SPINE2D MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** @memberof Container_Base */
class Container_Spine extends Container_Base {
    constructor(dataBase, textureName, dataValues) {
        super();
        dataValues = dataValues || this.getDataValues(dataBase, textureName);
        this.createBases(dataBase, dataValues);
        this.asignValues(dataValues, true);
    };
    // getters for ContainerSpine

    //TODO: hackAttachmentGroups parent crash et verifier le sprite dans spine ! 
    createBases (dataBase, dataValues) {
        const sd = dataBase.spineData; // ref spineData
        const d = new PIXI.projection.Spine2d(sd) //new PIXI.spine.Spine(sd);
        d.proj.affine = 2;
        const n = d.hackAttachmentGroups("_n",null,null); // (nameSuffix, group)
        dataValues.p.textureName && d.skeleton.setSkinByName(dataValues.p.textureName); //FIXME: player have no skin for now
        d.state.setAnimation(0, "idle", true); // alway use idle base animations or 1er..
        d.skeleton.setSlotsToSetupPose();
        this.Sprites = {d,n};
        this.addChild(d);
    };

    // dispatch values asigment for spine
    asignValues (dataValues, storeValues=true) {
        this.computeValue(dataValues.p);
        this.computeValue.call(this.Sprites.d, dataValues.d);
        // can set false, if need keep temp old values for HTML dataEditor
        if(storeValues){ this.dataValues = dataValues };
    };

    asignParentGroups () {
        this.Sprites.n = this.d.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)
    };

    affines (value) {
        this.d.proj.affine = value;
    };
};

//END CLASS
    
    