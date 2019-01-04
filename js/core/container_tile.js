
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
    constructor(dataObj, dataBase, textureName) {
        super();
        if(dataObj){
            this.DataLink = dataObj;
            this.createBases(dataObj);
            this.asignValues(dataValues, true);
        };
    };

    createBases (dataObj) {
        const dataBase = dataObj.dataBase; // getter
        const tex_d = dataBase.textures   [dataObj.dataValues.p.textureName     ]; // ref texture:diffuse
        const tex_n = dataBase.textures_n [dataObj.dataValues.p.textureName+'_n']; // ref texture:normal
        const d = new PIXI.Sprite(tex_d);//new PIXI.projection.Sprite2d(td);
        const n = new PIXI.Sprite(tex_n);//new PIXI.projection.Sprite2d(tn);
        this.Sprites = {d,n};
        this.addChild(d,n);
        // Certain tile son special comem les CASES, qui contienne plusieur sprites
        (dataObj.dataValues.p.classType === 'case') && createBases_case(dataBase);
    };

    // if case: create special base for case
    createBases_case(dataBase){
        //cage color 
        const ccd = new PIXI.projection.Sprite2d(dataBase.textures.cColor);
            ccd.parentGroup = PIXI.lights.diffuseGroup;
            ccd.pivot.set((ccd.width/2)+2,ccd.height+20);
        const ccn = new PIXI.projection.Sprite2d(dataBase.textures_n.cColor_n);
            ccn.parentGroup = PIXI.lights.normalGroup;
            ccn.pivot.copy(ccd.pivot)
        this.Sprites.ccd = ccd;
        this.Sprites.ccn = ccn;
        this.addChild(ccd,ccn);
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
        this.addChild(ctd,ctd);
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

    affines (value) {
        this.d.proj.affine = value;
        this.n.proj.affine = value;
    };

};//END CLASS
    
    