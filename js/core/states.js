
/**Le states manager permet de creer asigner distribruer les states */
//generate des sprites states


class _statesManager {
    constructor() {
        this.tipsBox = null; // asignaytion d'une tips box au survole d'icon
        this.contexts = {
            '_stateAttack':[
                //! defense

            ]
        }
    };

    /**Return un states base selon modes "attack,def,magic": _stateAttack, _stateDefense, _stateMagic */
    getBaseFromMode(source,target,mode){
        switch (mode) {
            case $combats.modes[0]: return new _stateAttack (source,target,mode) ; break;
            case $combats.modes[1]: return new _stateDefense(source,target,mode) ; break;
            case $combats.modes[2]: return new _stateMagic  (source,target,mode) ; break;
            default:break;
        }
    };

    /** scan tous les status et verifi si a besoin de passive */
    getInfligersFrom(source,target,slotsItems,mode){
        const base = this.getBaseFromMode(source,target,mode);
        const item = slotsItems.map((item)=> new _stateItem(source,target,mode,item._iID) )

        return [base,...item]; // renvoi la lister des infligeur
    };
    getInfluerFrom(source,target,infliger){
        let list = [];
        infliger.forEach(state => {
            state.createContext(source,target); // creer les context
            list.push(...state.linkedContext); // store les context linked
        });
        return list; // renvoi la liste des influeur
    };

    /** pass a data json state to convert */
    createFromJson(json){
        
    }
};

/**@description Les states son les status temporaire ou asigner en jeux qui contienne des methods 
 * On leur pass une value 'dmg','def' qui return ensuite une valeur moduler.
 * @class _statesManager
*/
const $states = new _statesManager();

//#region [rgba(20, 40, 0, 0.3)]
// ┌------------------------------------------------------------------------------┐
// _stateBase
// └------------------------------------------------------------------------------┘

class _stateBase extends PIXI.Container {
    constructor(source,target,originState){
        super();
        this.originState = originState;
        this.source = source;
        this.target = target;
        this._timeOut = null; // manage timeout hover
        this.setupInteractive();
       
    };
    get d(){this.sprites.d}
    get n(){this.sprites.n}

    createSprites(td,tn){
        const dataBase = $Loader.Data2.states;
        const d = new PIXI.Sprite(dataBase.textures   [td] );
        const n = new PIXI.Sprite(dataBase.textures_n [tn] );
        this.addChild(d,n);
        this.sprites = {d,n};
        // displayGroup
        //this.parentGroup = $displayGroup.group[4];
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup ;
        // FIXME: normaliser le size dans photoshop
        this.width  = 48;
        this.height = 48;
    };

    setupInteractive(){
        this.interactive = true;
        this.on("pointerover",this._pIN ,this);
        this.on("mouseout"   ,this._pOUT,this);
    }

    _pIN(e){
        $mouse.pointer.removeChild(this.tipsBox);
        this._timeOut = setTimeout(() => {
            const txt = new PIXI.Text(this._desc,{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:15,strokeThickness:4});
            const graphicInfoBox = new PIXI.Graphics();
            graphicInfoBox.beginFill(0x000000,0.7).drawRect(0, 0, txt.width, txt.height).endFill();
            graphicInfoBox.addChild(txt);
            graphicInfoBox.alpha = 0;
            graphicInfoBox.scale.x = 0;
            this.tipsBox = graphicInfoBox;
            $mouse.pointer.addChild(graphicInfoBox);
            TweenMax.to(graphicInfoBox, 0.2, { alpha:1 , ease: Power4 .easeOut});
            TweenMax.to(graphicInfoBox.scale, 0.35, { x:1 , ease: Elastic.easeOut.config(1, 0.5) });
        },600);
    };

    _pOUT(e){
        clearTimeout(this._timeOut);
        $mouse.pointer.removeChild(this.tipsBox)
    };

};
// endregion

/**@description state attack: inglige une value selon la source atk*/
class _stateAttack extends _stateBase{  // data2/System/states/SOURCE/images/sIcon_atk.png
    constructor(source,target,originState){
        super(source,target,originState);
        this.createSprites('sIcon_atk','sIcon_atk_n');
        /** list des context states lier au state origin */
        this.linkedContext = [];
        this._desc = `Inflige ${this.source.st.atk} physic a la cible.` //FIXME: lier SCV
    };
    
    /**Evalue si le context est nessesaire selon source,target ou origin , puit etablie les connextions*/
    static evalContextFrom(source,target,originState) {
        const cond1 = source.st.atk>0;
        return cond1 && new this(source,target,originState) ;
    };


    /**creer les conext possible pour l'attak */
    createContext(source,target){
       let ctx = null;
       //! ajoute de defense
       (ctx = _stateDefense.evalContextFrom(source,target,this)) && this.linkedContext.push(ctx);
       //! peut etre moduler avec range
       //ctx = _state_range.evalContextFrom(this,source,target) && this.linkedContext.push(ctx);
    };

    /** compute et module une valeur selon le states, voir _desc pour customiser.
     * @description stateAttack ajoute atk de la source
     * @argument useContext utilise les context attacher
     * @argument min remplace les random ou % par minimum possible selon context
     * @argument max remplace les random ou % par maximum possible selon context
     */
    computeValue(value,useContext,min,max){
        value+=this.source.st.atk;
        useContext && this.linkedContext.forEach(ctx => { value=ctx.computeValue(...arguments) });
        return value>0&&value||0;
    };

};

/**@description state defenser: reduit une value selon le target asigner*/
class _stateDefense extends _stateBase{  // data2/System/states/SOURCE/images/sIcon_def.png
    constructor(source,target,originState){
        super(source,target,originState);
        this.createSprites('sIcon_def','sIcon_def_n');
        this.linkedContext = [];
        this._desc = `Les dammage phisic sont reduit de ${this.target.st.def} selon la defense de la cible.` //FIXME: lier SCV
    };

    /**Evalue si le context est nessesaire selon source ? et connect a l'origin */
    static evalContextFrom(source,target,originState) {
        const cond1 = target.st.def>0;
        return cond1 && new this(source,target,originState) ;
    };

    /**creer les conextions possible pour la states defense */
    createContext(source,target){
        let ctx = null;
        //! peut etre moduler avec le status
        //! peut etre module avec items 
    };

    /** compute et module une valeur selon le states, voir _desc pour customiser.
     * @description _stateDefense reduit une value de x , selon le target def
     * @argument useContext utilise les context attacher
     * @argument min remplace les random ou % par minimum possible selon context
     * @argument max remplace les random ou % par maximum possible selon context
     */
    computeValue(value,useContext,min,max){
        value-=this.target.st.def;
        useContext && this.linkedContext.forEach(ctx => { value=ctx.computeValue(...arguments) });
        return value;
    };
};

/**@description state magic*/
class _stateMagic {  // data2/System/states/SOURCE/images/sIcon_mp.png
    constructor(source,target,mode){
   
    };

    createSprites(){

    };


};

/**@description state item inflige des items au monstre*/
class _stateItem extends _stateBase {  // data2/Objets/gameItems/gameItems.png
    constructor(source,target,originState,itemID){
        super(source,target,originState);
        this._itemID = itemID;
        this.createSprites(itemID);
        this.linkedContext = [];
        this._desc = `Inflic dmg between ${$items.list[this._itemID].minDMG} and ${$items.list[this._itemID].maxDMG} from type ${$items.list[this._itemID]._cType} ` //FIXME: lier SCV
    };

    createSprites(itemID){ // hack create sprite
        const dataBase = $Loader.Data2.gameItems;
        const d = new PIXI.Sprite(dataBase.textures   [itemID] );
        const n = new PIXI.Sprite(dataBase.textures_n [itemID+'_n'] );
        this.addChild(d,n);
        this.sprites = {d,n};
        // displayGroup
        //this.parentGroup = $displayGroup.group[4];
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup ;
        // FIXME: normaliser le size dans photoshop
        this.width  = 48;
        this.height = 48;
    };

    /**Evalue si le context est nessesaire selon source ? et connect a l'origin */
    static evalContextFrom(source,target,originState) {
        const cond1 = true; // si source a x>quantity item
        return cond1 && new this(source,target,originState) ;
    };

    /**creer les conextions possible pour la states defense */
    createContext(source,target){
        let ctx = null;
        //! puisance orbic si target a une faible
        //! reduction de dammage si items est dans immunity
        //! peut etre module avec items 
    };

    /** compute une valeur selon le states */
    computeValue(value,useContext,min,max){
        min?value+=$items.list[this._itemID].minDMG : max?value+=$items.list[this._itemID].maxDMG : value+=$items.list[this._itemID].dmg;
        useContext && this.linkedContext.forEach(ctx => { value = ctx.computeValue(value,useContext) });
        return value;
    };
};

/**@description state poison*/
class _statePoison extends PIXI.Container{  // data2/System/states/SOURCE/images/st_poison.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo si source porte des gan de poison
        //todo si source a 3 diceGem vert
        //todo si source a items inglige poisons
        //todo si source 3 powerObs vert et que target nest pas imuniser
        //todo si source a status toxic
        return true;
    };
};

/**@description state death*/
class _stateDeath extends PIXI.Container{  // data2/System/states/SOURCE/images/st_death.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo si total minimum de l'attack source est > target hp
        //todo si item infliger mort
        return true;
    };
};

/**@description state stun*/
class _stateStun extends PIXI.Container{  // data2/System/states/SOURCE/images/st_stun.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo si porte des gants metaliser
        //todo recette de gemDice x3 gris ?
        //todo item inflige stun
        return true;
    };
};

/**@description state toxic*/
class _stateToxic extends PIXI.Container{  // data2/System/states/SOURCE/images/st_toxic.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo item inflige Toxic
        //todo recette 3x gemdice vert
        return true;
    };
};

/**@description state range*/
class _state_range extends PIXI.Container{  // data2/System/states/SOURCE/images/st_range.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo si distance entre source et target est superieur a target._rangeFactor
        return true;
    };
};

/**@description state confuse*/
class _state_confuse extends PIXI.Container{  // data2/System/states/SOURCE/images/st_confuse.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo si item influge confuse
        //todo si recette gemDice inflige confuse
        return true;
    };
};

/**@description state combo*/
class _state_combo extends PIXI.Container{  // data2/System/states/SOURCE/images/st_combo.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo si recette gemDice
        //todo si recette gemDice et source a option combo++ qui aurgment tous les recette de 10% ?...
        return true;
    };
};

/**@description state powerOrbType*/
class _state_powerOrbType extends PIXI.Container{  // data2/System/states/SOURCE/images/st_powerOrbType.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo les item contien gemdice de meme couleur que source orbPower 
        return true;
    };
};

/**@description state powerOrbType*/
class _state_gemDiceDef extends PIXI.Container{  // data2/System/states/SOURCE/images/st_gemDiceDef.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $texts['idname'] || "Attaque";
        this._desc = $texts['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo si source item a un gemDice de meme type que target.gemDiceImunity
        return true;
    };
};