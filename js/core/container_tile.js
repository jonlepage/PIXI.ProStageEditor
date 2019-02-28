
/*:
// PLUGIN □──────────────────────────────□ CONTAINER TILESPRITE MANAGER □───────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
// (dataValues) ou passer (dataBase,textureName)
// (dataValues): from Json editor,  (dataBase,textureName): new empty sprite from etitor
*/

/** @memberof Container_Base */
class Container_Tile extends Container_Base {
    constructor(dataObj) {
        super(dataObj); // dataObj_base selon dirArray TODO: refaire le system de random
    };

    createBases () {
        const dataObj = this.dataObj;
        const dataBase = dataObj.dataBase;
        const textureName = dataObj.textureName;
        const td = dataObj.dataBase.textures   [textureName.d ];
        const tn = dataObj.dataBase.textures_n [textureName.n ];
        const d = new PIXI.Sprite(td) //new PIXI.projection.Sprite2d(td);
        const n = new PIXI.Sprite(tn)//new PIXI.projection.Sprite2d(tn);
        this.addChild(d,n);
        this.Sprites = {d,n};
        // certain type objet on des sprites special et config special, verifier dans les method du dataObj
        //dataObj.on_createBases && dataObj.on_createBases(this); //TODO: CASES
        dataObj.on_createBases && dataObj.on_createBases(this,dataBase);
    };

    // extend special Base sprites type: cases
    createBases_case(dataObj){
        //TODO: VERIFIER SI ON PEUT METTRE DANS  this.Sprites.d plutot
        this._isCase = true; // help fast flags for affine projection
        const dataBase = dataObj.dataBase; // getter
        //cage color 
        const ccd = new PIXI.projection.Sprite2d(dataBase.textures.cColor);
            ccd.parentGroup = PIXI.lights.diffuseGroup;
            ccd.pivot.set((ccd.width/2)+2,ccd.height+20);
        const ccn = new PIXI.projection.Sprite2d(dataBase.textures_n.cColor_n);
            ccn.parentGroup = PIXI.lights.normalGroup;
            ccn.pivot.copy(ccd.pivot)
        this.Sprites.ccd = ccd;
        this.Sprites.ccn = ccn;
        this.addChild(ccd,ccn); //TODO:
        // cage type
        const ctd = new PIXI.projection.Sprite2d( $Loader.Data2.caseEvents.textures.caseEvent_hide);
            ctd.parentGroup = PIXI.lights.diffuseGroup;
            ctd.pivot.set((ctd.width/2),ctd.height);
            ctd.position.set(0,-40);
        const ctn = new PIXI.projection.Sprite2d( $Loader.Data2.caseEvents.textures_n.caseEvent_hide_n);
            ctn.parentGroup = PIXI.lights.normalGroup;
            ctn.pivot   .copy(ctd.pivot   );
            ctn.position.copy(ctd.position);
        this.Sprites.ctd = ctd;
        this.Sprites.ctn = ctn;
        this.addChild(ctd,ctd); // TODO:
        [ccd,ccn].forEach(c => { c.renderable = false }); //FIXME: TEMP HIDE for camera 2d test
    }

    setCaseColorType (color){
        // see : $huds.displacement.diceColors same group for gemDice
        // and $objs._colorType
        // file:///C:\Users\jonle\Documents\Games\anft_1.6.1\js\core_items.js#L131
        this.colorType = color;
        let colorHex; // redraw color case
        switch (color) {
            case 'red'   : colorHex=0xff0000 ; break;
            case 'green' : colorHex=0x00ff3c ; break;
            case 'blue'  : colorHex=0x003cff ;break;
            case 'pink'  : colorHex=0xf600ff ;break;
            case 'purple': colorHex=0x452d95 ; break;
            case 'yellow': colorHex=0xfcff00 ; break;
            case 'black' : colorHex=0x000000 ; break;
            default      : colorHex=0xffffff ;
        }
        this.Sprites.ccd.tint = colorHex;
    };

    // change set the events type, swap textures
    setCaseEventType (type){
        type = type || 'caseEvent_hide';
        const td = $Loader.Data2.caseEvents.textures[type];
        const tn = $Loader.Data2.caseEvents.textures_n[type+'_n'];
        this.caseEventType = type;
        this.Sprites.ctd.texture = td;
        this.Sprites.ctn.texture = tn;
 
    };


};//END CLASS
    
    