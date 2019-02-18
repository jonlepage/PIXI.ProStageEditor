
/*:
// PLUGIN □────────────────────────────────□CONTAINER BASE MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
//

/** @memberof PIXI.Container */
class Container_Base extends PIXI.projection.Container2d {
    constructor(dataObj) {
        super();
        this.dataObj = dataObj;
        this.Sprites = {};
        dataObj.isValid && this.initialize();
    };
    // getters
    //get dataObj() { return $objs.LIST_D[this.register._bufferID][this.register._dID] };
    get p() { return this };
    get d() { return this.Sprites.d || false };
    get n() { return this.Sprites.n || false };
    get register() { return this.dataObj.register || false };
    set register(value) { value? $objs.addToRegister(this)  : $objs.removeToRegister(this) }; // 0 ou 1

    initialize(){
        this.createBases();
        this.asignDataObjValues();
    };

    createBases() {
        const dataObj = this.dataObj;
        const dataBase = dataObj.dataBase;
        const textureName = dataObj.textureName;
        // si pas de textureName, utiliser baseTextures: thumbs
        if(!textureName){
            const d = new PIXI.Sprite(dataBase.baseTextures[0]); // thumbs [0]
            this.Sprites.d = d;
            this.addChild(d);
        }else{

        }
    };

    // dispatch values asigment
    asignDataObjValues(dataValues) {
        dataValues = dataValues || this.dataObj.dataValues;
        Object.keys(dataValues).forEach(key => {
            this.asignValues.call(this[key], dataValues[key],key);
        });
    };

    setDataValues (dataValues) {
        dataValues = dataValues || true;
        this.dataObj.setDataValues(dataValues,this);
    };

    getDataValues (fromCage) {
        fromCage = fromCage && this || false;
        return this.dataObj.dataValues = this.dataObj.getDataValues(this);
    };


    asignValues (data,k) {
        if(!this){return};
        data && Object.keys(data).forEach(key => {
            const value = data[key];
            switch (key) {
                case "position":case "scale":case "skew":case "pivot":case "anchor":
                    this[key].set(...value);
                break;
                case "setDark": case "setLight":
                    if(this.color){ this.color[key](...value) };
                break;
                case "parentGroup": // if parentGroup, also asign diffuseGroup,normalGroup to childs
                    if(Number.isFinite(value)){
                        this.parentGroup = $displayGroup.group[value];
                        this.asignChildParentGroups(this.dataObj.dataBase.isNormal);
                    };
                break;
                case "color":
                    value?this.convertToHeaven():this.destroyHeaven();
                break;
                case "zIndex":
                    this.zIndex = +data.position[1];
                break;
                case "defaultColor": // for cases, change color
                    this.defaultColor = value;
                    this.setCaseColorType(value);
                break;
                case "defaultCaseEventType": // for cases, change color
                    this.defaultCaseEventType = value;
                    this.setCaseEventType(value);
                break;
                //ANIMATIONS
                case "autoPlay": // for cases, change color
                    this.autoPlay = value;
                    this.autoPlay && this.play && this.play();
                break;
                //spine
                case "defaultAnimation": // for cases, change color
                    this.state.setAnimation(0, value, true);
                break;
                case "timeScale": // for cases, change color
                    this.state.tracks[0].timeScale = value;
                break;
                case "startTime": // update animation to specific time
                    this.startTime = value;
                    this.update(value);
                break;
                // light
                case "indices": // update animation to specific time
                    this[key].set(value);
                break;
                case "radius": // update animation to specific time
                    this[key] = value || Infinity;
                break;
                default:
                    this[key] = value;
                break;
            };
        });
    };


    //auto add default parentGroup for 'tileSheet', 'animationSheet'
    asignChildParentGroups (normal) {
        this.d.parentGroup = normal? PIXI.lights.diffuseGroup : null;
        this.n.parentGroup = normal? PIXI.lights.normalGroup : null;
    };

    // default background not affined
    affines (value) {
        this.proj.affine = this.dataObj.dataValues.p.affine;
    };

};//END CLASS