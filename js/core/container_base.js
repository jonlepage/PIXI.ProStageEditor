
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
class Container_Base extends PIXI.Container {
    // si pas de data objet , ce net pas un obj de l'editeur ,mais un obj special
    constructor(dataObj) {
        super();
        // FIXME: deplacer les dossiers window et reformater leur nom et structure
        //const classLink = dataBase && $objs.classLink[dataBase.dirArray[1]] || dataObj_base; // check si un dataObj existe, sinon utiliser un base
        //dataObj = new classLink(); // creer un dataObj Vierge sans dataValues
        //this.getDataValues(dataBase, textureName);
        dataObj = dataObj ;//|| new dataObj_base(this, dataValues); , verifier si instance dataOBj or {} json
        this.Sprites = {};
        this.dataObj = dataObj;
        
        this.createBases(dataObj);
        this.asignDataValues(dataObj);
        

        // if have parameter dataBase, its a "thumbs" from editor or maybe others future
        //dataBase && this.createBases(dataBase);
    };
    // getters for CageContainer default
    get d() { return this.Sprites.d };
    get n() { return this.Sprites.n };

    // si pas heritage super(), ces un background style
    createBases (dataObj) {
        const isDataObj = dataObj instanceof dataObj_base; //permet d'itentifier si on a passer dataBase ou un dataObj
        if(!isDataObj){
            const d = new PIXI.Sprite(dataObj.baseTextures[0]); // thumbs [0]
            this.Sprites = {d};
            this.addChild(d);
        };
    };

    // dispatch values asigment
    asignDataValues(dataObj) {
        if(dataObj instanceof dataObj_base){
            this.asignValues(dataObj.p,dataObj.b);
            this.asignValues.call(this.d, dataObj.d, dataObj.b);
            this.asignValues.call(this.n, dataObj.n, dataObj.b);
        };
    };

    asignValues (data,base) {
        Object.keys(data).forEach(key => {
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
                        this.asignChildParentGroups(base.normals);
                    };
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
                default:
                console.log('default Unknow key: ', key,' value: ',value);
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
        this.d.proj.affine = 0;
        this.n.proj.affine = 0;
    };

};//END CLASS