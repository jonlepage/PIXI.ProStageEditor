
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
    constructor(dataObj) {
        super(dataObj);
    };
    // getters for ContainerSpine TODO: faire pareille que Container_Animation pour les getters
    get s() { return this.Sprites.s };


    // add more data called from base getDataValues
    /*asignDataValues(dataValues){
        this.asignValues(dataValues.p);
        // TODO: permettre dans editeur de editer chaque spineSprite : utile pour arbre dinamy feuille ...
        this.Sprites.d.forEach(spineSprite => {
            //dataValues.d && this.asignValues.call(this.Sprites.d, dataValues.d);
        });
        this.Sprites.n.forEach(spineSprite => {
            //dataValues.n && this.asignValues.call(this.Sprites.n, dataValues.n);
        });
        
    };*/

    //TODO: hackAttachmentGroups parent crash et verifier le sprite dans spine ! 
    createBases (dataObj = this.dataObj) {
        const dataBase = dataObj.dataBase; // getter
        const s = new PIXI.projection.Spine2d(dataBase.spineData); //new PIXI.spine.Spine(sd);
        const [d,n] = s.hackAttachmentGroups("_n",null,null); // (nameSuffix, group)
        //s.state.setAnimation(0, dataObj.dataValues.p.defaultAnimation , true); // default animation 'idle' TODO:  add more in getDataValues_spine
        //s.skeleton.setSlotsToSetupPose();
        this.Sprites = {s,d,n};
        this.addChild(s);
        
    };

    // dispatch values asigment for spine
    asignDataValues_spine (dataObj) {
        this.computeValue(dataValues.p);
        this.computeValue.call(this.Sprites.d, dataValues.d);
        // can set false, if need keep temp old values for HTML dataEditor
        if(storeValues){ this.dataValues = dataValues };
    };

    //add default parentGroup 
    asignChildParentGroups (normal) {
        this.s.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)
    };

    affines (value) {
        this.proj.affine = value;
    };


};

//END CLASS
    
    