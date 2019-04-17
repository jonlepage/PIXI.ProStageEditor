//#region [rgba(20, 40, 0, 0.3)]
// ┌------------------------------------------------------------------------------┐
// _stateBase
// └------------------------------------------------------------------------------┘

class _stateBase { // extends PIXI.Container
    constructor(source,target,contextName,base,textureName){
        /**Nom et raison du context constructeur du state */
        this.contextName = contextName;
        /** Liste des context enfant associer */
        this.childContext = [];
         /**List des context parent associer */
        this.parentContext = [];
        /** source des infligers */
        this.source = source;
        /** cible des infligers */
        this.target = target;
        /** le timeOut mouseHover au survole d'une states */
        this._timeOut = null; // manage timeout hover
        /** List des context associer descriptions pour hover*/
        this.contextsDescriptions = [];
        this.addContext_descriptions(contextName);
        this.createSprites(textureName);
        this.attacheContext(base);
        this.setupInteractive();
    };
    /** la description de base du state Nom+Description */
    get descBase(){return `[#B24387]${$txt._[`N_STATE${this.constructor.name}`]}[#]:${$txt._[`D_STATE${this.constructor.name}`]}`};
    get p(){return this.sprites.p}
    get d(){return this.sprites.d}
    get n(){return this.sprites.n}

    /** */
    initialize(){

    };

    /** creation du container du states */
    createSprites(textureName){
        const dataBase = $Loader.Data2.states;
        const p = new PIXI.Container();
        const d = new PIXI.Sprite(dataBase.textures   [textureName] );
        const n = new PIXI.Sprite(dataBase.textures_n [textureName+'_n'] );
        p.parentGroup = $displayGroup.group[4];
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup ;
        p.addChild(d,n);
        this.sprites = {p,d,n};
        // FIXME: normaliser le size dans photoshop
        this.width  = 32;
        this.height = 32;
    };

    /** setup des interaction */
    setupInteractive(destroy){
        const p = this.p;
        p.interactive = true;
        p.on("pointerover" ,this._pIN_state  ,this);
        p.on("mouseout"    ,this._pOUT_state ,this);
    }

    //TODO: RENDUICI Alternet entre description general et description context {base:influ:infli}
    _pIN_state(e){
        $mouse.pointer.removeChild(this.tipsBox);
        this._timeOut = setTimeout(() => {
            const txt = $txt.area(this.getContext_desciptions(), null, {wordWrapWidth:500});
            const graphicInfoBox = new PIXI.Graphics();
            graphicInfoBox.beginFill(0x000000,0.8).drawRect(0, 0, txt.width, txt.height).endFill();
            graphicInfoBox.alpha = 0;
            graphicInfoBox.scale.x = 0;
            this.tipsBox = graphicInfoBox;
            graphicInfoBox.addChild(txt);
            $mouse.pointer.addChild(graphicInfoBox);
            TweenMax.to(graphicInfoBox, 0.2, { alpha:1 , ease: Power4 .easeOut});
            TweenMax.to(graphicInfoBox.scale, 0.35, { x:1 , ease: Elastic.easeOut.config(1, 0.5) });
        },600);
    };

    _pOUT_state(e){
        clearTimeout(this._timeOut);
        $mouse.pointer.removeChild(this.tipsBox)
    };

    /** link le base au context d'appellation */
    attacheContext(base){
        if(base){
            if( Array.isArray(base) ){
                base.forEach( b => { b.childContext.push(this) });
            }else{ base.childContext.push(this) };
            this.parentContext = base;
        };
    };

    /** renvoi la descriptions du states et ces context si nessesaire */
    getContext_desciptions(){
        return this.descBase;
    };

    addContext_descriptions(contextName){
        /*const desc = $txt._[contextName]
        .replace('[$S.ATK]', this.source.atk)
        .replace('[$T.DEF]', this.target.def)
        .replace('[$S.CCR]', this.source.ccr)
        .replace('[$T.EVA]', this.target.eva);
        this.contextsDescriptions.push(desc);*/
    };

};
// endregion

//#region [rgba(200, 0, 160, 0.05)]
// ┌------------------------------------------------------------------------------┐
// _stateBase
// └------------------------------------------------------------------------------┘
/**@description state attack: inglige une value selon la source atk*/
class _stateAttack extends _stateBase{  // data2/System/states/SOURCE/images/sIcon_atk.png
    constructor(source,target,contextName,base){
        super(source,target,contextName,base,'sIcon_atk');
        
    };

    /** check si rempli des custom condition pour infliger ou influer */
    static getContextsFrom(source,target) {
        //if(source.isStun || source.isSleep || source.isOutRange || source.isConfuse){return false};
        return new this(source,target,'CONTEXT_baseAtk');
    };




    /**creer les conext possible pour _stateAttack */
    /*createContext(baseA,baseB){
       let ctx = null;
       //! ajoute de defense
       (ctx = _stateDefense.evalContextFrom(this.source,this.target,this)) && this.linkedContext.push(ctx);
       //! peut etre moduler avec range
       //ctx = _state_range.evalContextFrom(this,source,target) && this.linkedContext.push(ctx);
    };*/
    //TODO: LA LUCK GENERER GENERE UN PAR MULTIPLE DE 10 UN POSSIBILITER REUSSIS
    /** //? _stateAttack valeur de souce.st.atk et a 90% chance critique + target.st.lck pour evade.
     * a 10% missing / s.luck * t.luck
     * @description stateAttack ajoute atk de la source
     * @param options.useContext utilise les context attacher
     * @param options.min remplace les random ou % par minimum possible selon context
     * @param options.max remplace les random ou % par maximum possible selon context
     */
    computeValue(tracker,options={}){
        // TODO, VOIR SI ON DOI INJETER OPTIONS DANS SOURCE ET TARGET POUR les st baser sur luck
        const s = this.source;
        const t = this.target;
        const result =  Math.max(0, s.atk-t.def);
        tracker.values.push(result);
        // this.contexts.forEach(ctx => { ctx.computeValue(...arguments) });
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
    computeValue(values,options={}){
        const s_crt = this.source.st.crt; // multiplicateur critique
        const s_lck = this.source.st.lck;
        const t_lck = this.target.st.lck;
        const t_miss = this.target.st.eva;
        if(options.min || options.max){
            values.update(options.min?s_atk:s_atk*0.2,this); // atk return 
        }else{
            const miss = !Math.ranLuckFrom(s_lck-t_lck/10,90); // 10% chance de miss * iteration de luck (target enleve la luck de source)
            const critik = !Math.ranLuckFrom(s_lck,5); // 10% chance de miss * iteration de luck
            let _value = miss? 0 : critik? s_atk+(s_atk*s_crt) : s_atk;
            values.update(s_atk,this);
        }
        options.useContext && this.linkedContext.forEach(ctx => { ctx.computeValue(...arguments) });


        const _value = this.target.st.def;
        values.update(_value,this);
        useContext && this.linkedContext.forEach(ctx => { ctx.computeValue(...arguments) });
        return this;
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
    constructor(source,target,contextName,base){
        super(source,target,contextName,base,contextName);
        this._id = contextName;
        this.contextName = contextName;
        this.contexts = [];
    };
    /** check si rempli des custom condition pour infliger ou influer */
    static getContextsFrom(source,target,items) {
        let context = [];
        items.forEach(id => {
            context.push(new this(source,target,id)); 
        });
        return context;
    };

    createSprites(itemID){ // hack create sprite
        const dataBase = $Loader.Data2.gameItems;
        const p = new PIXI.Container();
        const d = new PIXI.Sprite(dataBase.textures   [itemID] );
        const n = new PIXI.Sprite(dataBase.textures_n [itemID+'_n'] );
        p.addChild(d,n);
        // displayGroup
        p.parentGroup = $displayGroup.group[4];
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup ;
        this.sprites = {p,d,n};
        // FIXME: normaliser le size dans photoshop
        
        p.width  = 54;
        p.height = 54;
    };

    /** renvoi la descriptions du states et ces context si nessesaire POUR ITEMS */
    getContext_desciptions(){
        const it = $items.list[this._id];
        const txt = `${this.descBase}[N]${it.descBase}[N]`+
        `${$txt._.__boostDMG}: [#a0ff0c]${it.descDMG}[#][N]`+
        `${$txt._.__boostElements}: [#999999]${this._cType}[#]`
        return txt;
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
    computeValue(tracker,options={}){
        const s = this.source;
        const t = this.target;
        const it = $items.list[this._id];
       // this.contexts.forEach(ctx => { ctx.computeValue(...arguments) });
       const result =  options.min? it.minDMG : options.max? it.maxDMG : Math.max(0, it.dmg);
       tracker.values.push(result);
    };
};

//#endregion


/**@description state poison*/
class _statePoison extends _stateBase{  // data2/System/states/SOURCE/images/st_poison.png
    constructor(source,target,contextName,base){
        super(source,target,contextName,base,'st_poison');
    };


    /**verifi si un context de recette est valide */
    static checkRecipeFrom(baseA,items) {
        const strI = items.join(); // items string format for compare;
        if( ["7,7,7","8,8,8","9,9,9","10,10,10","11,11,11","12,12,12","13,13,13"].contains(strI)){
            return "CONTEXT_recipeGGG";
        }
    };
    /**check si rempli des custom condition pour infliger ou influer */
    static getContextsFrom(source,target,items,baseA,baseB) {
        let context = [];
        const recipe = _statePoison.checkRecipeFrom(baseA, items); // return une recette ?
        if(recipe){ // porte des gant poison
            context.push(new this(source,target,recipe,baseB) );
        }
        //todo si source porte des gan de poison
        //todo si source a 3 diceGem vert
        //todo si source a items inglige poisons
        //todo si source 3 powerObs vert et que target nest pas imuniser
        //todo si source a status toxic
        return context;
    };

    /**
     * a 10% missing / s.luck * t.luck
     * @description stateAttack ajoute atk de la source
     * @param options.useContext utilise les context attacher
     * @param options.min remplace les random ou % par minimum possible selon context
     * @param options.max remplace les random ou % par maximum possible selon context
     */
    computeValue(values,opt={}){
        if(this.contextName === "poisonGlove"){
            const s = this.st.s;
            const t = this.st.t;

            const eva = values.eva;
            const crt = values.ctr;
            let result = Math.ranLuckFrom(s.lck,30);
            this.result = result;
            values.update(result,this);
            this.contexts.forEach(ctx => { ctx.computeValue(...arguments) });
            return values;
        };
    };
};

/**@description state death*/
class _stateDeath extends PIXI.Container{  // data2/System/states/SOURCE/images/st_death.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $txt['idname'] || "Attaque";
        this._desc = $txt['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
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

        this._name = $txt['idname'] || "Attaque";
        this._desc = $txt['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
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

        this._name = $txt['idname'] || "Attaque";
        this._desc = $txt['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
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
    constructor(source,target,contextName){
        super(source,target,'sIcon_atk');
        this.contextName = contextName;
        this.contexts = [];
    };

    /**check si rempli des custom condition pour infliger ou influer */
    static getContextsFrom(stateMode,infligers) {
        let context = [];
        if(stateMode.poisonGlove || true){ // porte des gant poison
            context.push(new this(stateMode,infligers,'poisonGlove'));
        }
        if(infligers.checkRecipe_recipeX3GreenGem || true){ // porte des gant poison
            context.push(new this(stateMode,infligers,'recipeX3GreenGem'));
        }
        //todo si source porte des gan de poison
        //todo si source a 3 diceGem vert
        //todo si source a items inglige poisons
        //todo si source 3 powerObs vert et que target nest pas imuniser
        //todo si source a status toxic
        return context;
    };


    /**creer les conext possible pour _stateAttack */
    createContext(source,target){
       let ctx = null;
       //! ajoute de defense
       (ctx = _stateDefense.evalContextFrom(source,target,this)) && this.linkedContext.push(ctx);
       //! peut etre moduler avec range
       //ctx = _state_range.evalContextFrom(this,source,target) && this.linkedContext.push(ctx);
    };
    //TODO: LA LUCK GENERER GENERE UN PAR MULTIPLE DE 10 UN POSSIBILITER REUSSIS
    /** //? _stateAttack valeur de souce.st.atk et a 90% chance critique + target.st.lck pour evade.
     * a 10% missing / s.luck * t.luck
     * @description stateAttack ajoute atk de la source
     * @param options.useContext utilise les context attacher
     * @param options.min remplace les random ou % par minimum possible selon context
     * @param options.max remplace les random ou % par maximum possible selon context
     */
    computeValue(values,opt={}){
        if(this.contextName === "base"){
            const s = this.st.s;
            const t = this.st.t;

            const eva = Math.ranLuckFrom(t.lck,t.eva) && 0;  // chance evasion ennemie
            const crt = Math.ranLuckFrom(s.lck,s.ccrt) && s.crt; // ces un coup critique ?
            let result;
            if(opt.min){
                result = Math.max(0, s.atk-t.def);
            }else
            if(opt.max){
                result = Math.max(0, ((s.atk-t.def)*s.crt));
            }else{
                result = Math.max(0, ((s.atk-t.def)*crt)*eva);
            };
            values.eva = eva;
            values.crt = crt;
            values.update(result,this);
            this.result = result;
            this.contexts.forEach(ctx => { ctx.computeValue(...arguments) });
            return values;
        };
    };

};

/**@description state confuse*/
class _state_confuse extends PIXI.Container{  // data2/System/states/SOURCE/images/st_confuse.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $txt['idname'] || "Attaque";
        this._desc = $txt['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
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

        this._name = $txt['idname'] || "Attaque";
        this._desc = $txt['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
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
class _state_powerOrbType extends _stateBase{  // data2/System/states/SOURCE/images/st_powerOrbType.png
    constructor(source,target,contextName,base){
        super(source,target,contextName,base,'st_powerOrbType');
        
    };
    /** check si rempli des custom condition pour infliger ou influer */
    static getContextsFrom(source,target,items,baseA,baseB) {
        let context = [];
        if(source.containerRedSlotsInStamina && target.containRedSlotInOrbType || true){ // orb roudans dans displacement et target orb faibless
            context.push(new this(source,target,'CONTEXT_PowerOrbs+',baseA) );
        }
        
        return context;
    };
};

/**@description state powerOrbType*/
class _state_gemDiceDef extends PIXI.Container{  // data2/System/states/SOURCE/images/st_gemDiceDef.png
    constructor(source,target,mode,item){
        this.source = source;
        this.target = target;
        this.mode = mode;
        this.item = item;

        this._name = $txt['idname'] || "Attaque";
        this._desc = $txt['iddesc'] || "Indiquateur de dammage, inflige %n a la cible";
        this.child = this.createSprites();
    };
    /**Calcul des conditions pour verifier si besoin */
    static isNeed(source,target) {
        //todo si source item a un gemDice de meme type que target.gemDiceImunity
        return true;
    };
};