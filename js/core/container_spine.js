
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
        this.spriteSlots = []; // spine stock les spriteSlots diffuse normal par array, voir:hackAttachmentGroups
    };
    // getters for ContainerSpine TODO: faire pareille que Container_Animation pour les getters
    get s() { return this.Sprites.s || false };
    get slots_d() { return this.spriteSlots[0] || false }; // return list des spriteSlots Diffuse
    get slots_n() { return this.spriteSlots[1] || false }; // return list des spriteSlots Normal


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
    createBases () {
        const dataBase = this.dataObj.dataBase; // getter
        const s = new PIXI.projection.Spine2d(dataBase.spineData); //new PIXI.spine.Spine(sd);
        this.spriteSlots = s.hackAttachmentGroups("_n",null,null); // (nameSuffix, group)
        this.Sprites = {s};
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


};

//END CLASS
    
    