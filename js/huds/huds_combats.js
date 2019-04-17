// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘
/*
┌□COLORIMETRIX□─────────────────────────────────────-HexReference-─────────────────────────────────────────────────────────────────────────┐
  #d8a757, #f46e42, #f4eb41, #b241f4, #f44197, #f4415e, #b71f37, #b71e1e, #b7af1d, #f28a0c, #aed0f9, #dd2b01, #eb0e4b, #c37665, #a74313, #c5e264, 
  #cc9b99, #c85109, #fedcb4, #a36506, #a0ff0c, #a000d0, #a00000, #ADB6BE, #B24387 ,#BBC15D ,#FA8965 ,#F3EE1E ,#CC301D
└──────────────────────────────────────────────────────□□□□□□□□□───────────────────────────────────────────────────────────────────────────┘
*/
// prepare les grafics huds pour combats, quand start, ajoute a la camera et scene car ya des affines
class _huds_combats extends PIXI.Container{
    constructor() {
        super();
        /** list ref des container pour add a la scene et au stage lorsque combat start combatSlots,combatIcons,combatBox*/
        this.childList = {
            ccs:null,//initialize_combatSlots
            cci:null,//initialize_combatIcons
            ccb:null,//initialize_combatBox,
            ccim:null,// infoBox side pour infomation monstre
            /** les container a mettre dans scene lors de setupCombatHuds */
            get scene(){return [this.ccs,this.cci,this.ccb]},
            /** les container a mettre dans stage ou camera */
            get stage(){return [this.ccim]},
        };
        this.renderable = false;
        this.interactiveChildren = false;
    };
    /** returns list of combat mode in $combat */
    get combatMode(){ return $combats.combatMode };
    /** return array list des container dispo */
    get list_c(){ return Object.values(this.childs) };
    /** return le container des slots items pour combat */
    get combatSlots() {return this.childList.ccs};
    /** return le container des icons pour selectionner le mode combat */
    get combatIcons() {return this.childList.cci};
    /** return le container qui affiche et calcul les info lors selection d'une cible */
    get combatBox() {return this.childList.ccb};
    /** return monster info box slider */
    get monsterInfoBox() {return this.childList.ccim};
    /** return la derniere cible survoller par la sourit */
    get targetSelected(){
       return $combats._selectedTarget;
    };
    /** return list des slots qui contiennent des items */
    get slotsItems(){
        return this.combatSlots.children.filter(c => c._status ); // $huds.combats.slotsItems.map(i=>i.item._id)
    };
    /** return a map of items ID in slots */
    get getSlotItemsID(){
        return this.slotsItems.map(i=>i.item._id);
    };

    initialize(){
        this.initialize_combatSlots(); // creer les slots sosu le player
        this.initialize_combatIcons(); // creer les icons de choix de combat pour les players 
        this.initialize_combatBox(); // preparle la boite indicatrice de damage
        this.initialize_monsterInfoBox(); // ces le menu info des monstre
        this.initialize_Interactive();
    };

    initialize_combatSlots(){
        // combats items slots
        const ccs =  new PIXI.projection.Container2d(); // combat container slot
        ccs.proj._affine = 2; // test 3,4 ?
        const x = [-70,0,70];
        const y = [0,70,0];
        for (let i=0; i<3; i++) {
            const csC = new PIXI.Container();
            const cs_d = csC.d = new PIXI.Sprite($Loader.Data2.hud_combats.textures.hudS_itemSlots);
            //const cs_n = csC.n = new PIXI.Sprite($Loader.Data2.hud_combats.textures_n.hudS_itemSlots_n);
            csC.setItemId = (id)=>{
                if(csC.item){
                  csC.removeChild(csC.item);
                  csC.item = null;
                  csC._iID = null;
                  csC._status = false;
                };
                if(Number.isFinite(id)){
                  const newItem = $items.list[id].createSprites(true);
                  csC.item = newItem;
                  csC._iID = id;
                  csC.addChild(newItem);
                  csC.setItemStatus(true);
                };
            };
            csC.setItemStatus = (value)=>{
                csC._status = value;
                TweenLite.to(csC.item.d, 0.2, { alpha:value?1:0, ease: Power4.easeOut } );
                TweenLite.to(csC.item.n, 0.2, { alpha:value?0.8:0.4, ease: Power4.easeOut } );
                csC.item.n.blendMode = value?0:1;
            };
            csC.scale.set(0.6);
            csC.position.set(x[i],y[i]);
            csC.scale.zeroSet();
            csC.position.zeroSet();
            cs_d.anchor.set(0.5);
            //cs_n.anchor.set(0.5);
            csC.parentGroup = $displayGroup.group[2];
            cs_d.parentGroup = PIXI.lights.diffuseGroup;
            //cs_n.parentGroup = PIXI.lights.normalGroup;
            csC._slotID = i;
            csC.slots = {cs_d};
            csC.addChild(cs_d);
            ccs.addChild(csC);
        };
        this.childList.ccs = ccs;
    };

    // les icon pour selectioner le mode combat
    initialize_combatIcons(){
        const combatMode = this.combatMode;
        const cci =  new PIXI.projection.Container2d(); //container combat icon
        cci.parentGroup = $displayGroup.group[2];
        cci.icons = {};
        cci.proj._affine = 2; // test 3,4 ?
        for (let i=0,x=0, l=combatMode.length; i<l; i++) {
            const imode = combatMode[i];
            const iconMode = cci.icons[imode] = new PIXI.Sprite($Loader.Data2.hud_combats.textures[`cbi_${imode}`]);
            iconMode._mode = imode;
            iconMode.x = x;
            iconMode.anchor.set(0.5);
            iconMode.scale.set(0.8);
            iconMode.scale.zeroSet();
            iconMode.position.zeroSet();
            cci.addChild(iconMode);
            x+=iconMode.width+4;
        };
        const bounds = cci.getBounds();
        cci.pivot.set((bounds.width+bounds.x)/2, $player.p.height);
        this.childList.cci = cci;
    };

    initialize_combatBox(){
        const ccb = new PIXI.projection.Container2d(); // combat container BOX
            ccb.proj._affine = 2; // test 3,4 ?
            ccb.parentGroup = $displayGroup.group[2];
         //! BACKGROUND_____________________
        const background = new PIXI.Sprite(PIXI.Texture.WHITE);
            background.parentGroup = PIXI.lights.diffuseGroup
            background.tint = 0x000000;
            background.alpha = 0.8;
         //! BASE CONTAINER_____________________
        const base = new PIXI.Container();
            base.icons = new PIXI.Container();
            base.txt = $txt.area('BASE');
            base.icons.y = base.txt.height;
            base.icons.scale.set(0.6);
        base.addChild(base.txt,base.icons);
        //! INFLIGER CONTAINER_____________________
        const infliger = new PIXI.Container(); // combat container dammage
            infliger.icons = new PIXI.Container();
            infliger.txt = $txt.area('Infliger');
            infliger.icons.y = infliger.txt.height;
            infliger.icons.scale.set(0.6);
        infliger.addChild(infliger.txt,infliger.icons);
        //! INFLUER CONTAINER_____________________
        const influer = new PIXI.Container(); // combat container dammage
            influer.icons = new PIXI.Container();
            influer.txt = $txt.area('Influer');
            influer.icons.y = influer.txt.height;
            influer.icons.scale.set(0.6);
        influer.addChild(influer.txt,influer.icons);
       //! RESULTE CONTAINER_____________________
       const result = new PIXI.Container(); // combat container result
            result.line1 = new PIXI.Sprite($Loader.Data2.hud_combats.textures.cb_mathLine);
            result.line2 = new PIXI.Sprite($Loader.Data2.hud_combats.textures.cb_mathLine);
            result.line1.anchor.set(0.5);
            result.line2.anchor.set(0.5);
            result.txt = $txt.area('(180 <=> 486)');
        result.addChild( result.line1, result.line2, result.txt);
        //end
        ccb.addChild(background,base,infliger,influer,result);
        ccb.child = {background,base,infliger,influer,result};
        this.childList.ccb = ccb;
    };

    /** prepare le infoBox noire gauche et droite pour le mode info sur battler */
    initialize_monsterInfoBox(){
        const ccim =  new PIXI.Container(); // combat container slot
        const texture = $app.renderer.generateTexture(new PIXI.Graphics().drawRect(0, 0, 1920/3, 1080))
        const bBoxL = ccim.bBoxL = new PIXI.Sprite(texture);
            bBoxL._width = bBoxL.width;
            bBoxL.alpha = 0.8;
            bBoxL.tint = 0x000000;
            ccim.addChild(bBoxL);
        const bBoxR = ccim.bBoxR = new PIXI.Sprite(texture);
            bBoxR._width = bBoxL.bBoxR;
            bBoxR.pivot.x = bBoxR.width;
            bBoxR.position.x = 1920;
            bBoxR.alpha = 0.8;
            bBoxR.tint = 0x000000;
            ccim.addChild(bBoxR);
        //! info in bBoxL
        const bBoxL_name          = $txt.area();
        const bBoxL_type          = $txt.area();
        const bBoxL_states        = $txt.area();
        const bBoxL_stategie      = $txt.area().options({wordWrapWidth:bBoxL._width-40});
        const bBoxL_itemsImunity  = $txt.area().options({wordWrapWidth:bBoxL._width-40});;
        const bBoxL_statusImunity = $txt.area().options({wordWrapWidth:bBoxL._width-40});;
        const bBoxL_alimentations = $txt.area().options({wordWrapWidth:bBoxL._width-40});;
        bBoxL.addChild(bBoxL_name,bBoxL_type,bBoxL_states,bBoxL_stategie,bBoxL_itemsImunity,bBoxL_statusImunity,bBoxL_alimentations);
        bBoxL.child = {bBoxL_name,bBoxL_type,bBoxL_states,bBoxL_stategie,bBoxL_itemsImunity,bBoxL_statusImunity,bBoxL_alimentations};

        //! info in bBoxR
        const bBoxR_title = $txt.area().options({wordWrapWidth:bBoxL._width-40});
        const bBoxR_magicsLists = new PIXI.Container();
        for (let i=0,y=0, l=6; i<l; i++) {
            const magicsBox = new PIXI.Sprite($app.renderer.generateTexture(new PIXI.Graphics().beginFill(0xffffff).drawRect(0, 0, 575, 145)));
            bBoxR_magicsLists.addChild(magicsBox);
            magicsBox.position.set(10,y);
            y+=magicsBox.height+10;
        };
        bBoxR.addChild(bBoxR_title,bBoxR_magicsLists);
        bBoxR.child = {bBoxR_title,bBoxR_magicsLists};

        //#positionning all child 
        for (let i=0,x=40,y=20, l=bBoxR.children.length; i<l; i++) {
            const el = bBoxR.children[i];
            el.h2 && (el.h2.y = el.h1.y+el.h1.height);
            el.h3 && (el.h3.y = el.h2.y+el.h2.height);
            el.position.set(x,y);
            y+=el.height;
        };
       
        this.childList.ccim = ccim; //!end
        this.addChild(ccim);
    };

    //#region [rgba(40, 0, 0, 0.2)]
    // ┌------------------------------------------------------------------------------┐
    // EVENTS INTERACTION LISTENERS
    // └------------------------------------------------------------------------------┘
    initialize_Interactive() {
        //combatIcons
        this.combatIcons.interactiveChildren = false;
        this.combatIcons.children.forEach(cIcon => {
            cIcon.interactive = true;
            cIcon.on('pointerover' , this.pIN_cIcon  ,this);
            cIcon.on('pointerout'  , this.pOUT_cIcon ,this);
            cIcon.on('pointerup'   , this.pUP_cIcon  ,this);
        });
        // combat slots items
        this.combatSlots.interactiveChildren = false;
        this.combatSlots.children.forEach(slot => {
            slot.interactive = true;
            slot.on('pointerover', this.pIN_slots , this);
            slot.on('pointerout' , this.pOUT_slots, this);
            slot.on('pointerup'  , this.pUP_slots , this);
        });
    };

    //!combatIcons________
    pIN_cIcon(e){
        const ee = e.currentTarget;
        if(!this._mode){
            TweenMax.to(ee.scale, 0.3, {x:1,y:1, ease: Power4.easeOut });
            TweenMax.to(ee.parent.scale, 1, {x:1.1,y:1.05, ease: Elastic.easeOut.config(0.8, 0.75) });
            ee._filters = [$systems.filtersList.OutlineFilterx4white];
        };
    };
    
    pOUT_cIcon(e){
        const ee = e.currentTarget;
        if(!this._mode){
            TweenMax.to(ee.scale, 0.3, {x:ee.scale.zero.x,y:ee.scale.zero.y, ease: Power4.easeOut });
            TweenMax.to(ee.parent.scale, 1, {x:1,y:1, ease: Power4.easeOut });
            ee._filters = null;
        };
    };
    
    pUP_cIcon(e){
        const ee = e.currentTarget;
        if(!this._mode){
            ee._filters = null;
            $combats.setCombatModeTo(ee._mode);
           
        };
    };

    //!combatSlots________
    pIN_slots(e){
        const ee = e.currentTarget;;
        ee.d._filters = [$systems.filtersList.OutlineFilterx4white];
    };
    
    pOUT_slots(e){
        const ee = e.currentTarget;
        ee.d._filters = null;
    };
    pUP_slots(e){
        const ee = e.currentTarget;
        if(e.data.button === 0){
            //# ajous d'un items pour la source slots, ensuite update les slots selon le player item
            // remove si click
            const source = $combats.currentBattlerTurn; //TODO: voir _battler class player
            if($mouse.isHoldItem){
                const added = source.addItemToCombatSlot($mouse._holdItemID,ee._slotID, $combats._mode);
                if (added) { // si item dans mouse et mode menu
                    const toXY = ee.toLocal($mouse.holdItem,$mouse.holdItem);
                    ee.item && ee.setItemId(null);
                    ee.setItemId($mouse._holdItemID);
                    $mouse.setItemId(null);
                    TweenLite.from(ee.scale, 0.3, { x:'+=0.2', y:'+=0.2', ease: Elastic.easeOut.config(1, 0.3) });
                    TweenLite.from(ee.item, 1, {x: toXY.x, ease: Elastic.easeOut.config(1.2, 0.8)});
                    TweenLite.from(ee.item, 0.6, {y: toXY.y, ease: Bounce.easeOut });
                };
            }else{
                ee.item && ee.setItemStatus(!ee._status); // active desactive l'utilisations
            };
            // recalcule la dmgBox si cible un target ?
            if($combats._selectedTarget){
                this.setupCombatBoxFrom($combats.currentBattlerTurn,$combats._selectedTarget,$combats._mode);
        };  
        };
    };
    //#endregion 

    /** Registre et converti les items dans le buffer food et clear les slots items vers la sceneMap 
     * @returns items
    */
    addItemSlotToRegisterMap(source){
        const items = [];
        this.slotsItems.forEach(slot => { // add to map
            const item = slot.item;
            item.convertSubtreeTo2d();
            item.proj._affine = 5;
            item.parentGroup = $displayGroup.group[1];
            item.position.set(source.p.x,source.p.y);
            item.zIndex = item.position._y+1;
            items.push(item);
            slot.setItemId(null);
        });
        $combats.foodItemMap.push(...items); // global items buffer des itemfood
        $stage.scene.addChild(...items);
        return items;
    };

    /** Setup et zero position des huds container selon le turn du batler. */
    setupHudsToBattler(target){
        if(target){
            const cci = this.combatIcons;
            const ccs =  this.combatSlots;
            cci.position.copy(target.p.position);
            ccs.position.copy(target.p.position);
            cci.position.zeroSet();
            ccs.position.zeroSet();
            this.show_combatIcons();
            this.show_combatSlots();
        }else{
            this.hide_combatIcons();
            this.hide_combatSlots();
        }

    };

    /** positione les CombatIcons selon un mode */
    set_combatIconsMode(mode){
        const cci = this.combatIcons;
        cci.interactiveChildren = !mode;
        cci.children.forEach(icon => {
            const selected = icon._mode === mode;
            const pX = selected? cci.pivot.x : icon.position.zero.x;
            const pY = selected? cci.pivot.y : icon.position.zero.y-(mode&&20||0);
            const sX = selected? 1 : mode && 0.6 || icon.scale.zero.x;
            const sY = selected? 1 : mode && 0.6 || icon.scale.zero.y;
            const alpha = selected? 1 : mode && 0.2 || 1;
            TweenLite.to(icon      , mode&&0.4||0.2, { x:pX,y:pY,alpha:alpha,ease: Back.easeOut.config(1.7) });
            TweenLite.to(icon.scale, mode&&0.4||0.2, { x:sX,y:sY,            ease: Back.easeOut.config(1.7) });
        });
    };

    
    show_combatIcons(){
        const cci = this.combatIcons;
        cci.interactiveChildren = true;
        TweenLite.fromTo(cci, 0.3, 
            { y:cci.position.zero.y-60, alpha:0, ease: Power4.easeOut },
            { y:cci.position.zero.y, alpha:1, ease: Power4.easeOut },
        );
    };

    /** cache et unInteractive les combat ICONS */
    hide_combatIcons(){
        const cci = this.combatIcons;
        cci.interactiveChildren = false;
        TweenLite.to(cci, 0.2, { y:'-=60', alpha:0, ease: Power4.easeOut } );
    };

    /** affiche et rend interactive les combat SLOTS sur le current battler */
    show_combatSlots(){
        //TODO: map les mode attack,defense avec leur propre memoire items
        const ccs = this.combatSlots;
        TweenLite.to(ccs, 0.2, { alpha:1, y:ccs.position.zero.y, ease: Power4.easeOut });
        TweenLite.to(ccs.children.map((s)=>s.scale   ), 0.4, { x:(i,s)=>s.zero.x, y:(i,s)=>s.zero.y, ease: Power4.easeOut });
        TweenLite.to(ccs.children.map((s)=>s.position), 0.4, { x:(i,s)=>s.zero.x, y:(i,s)=>s.zero.y, ease: Power4.easeOut });
    };

        /** hide anmimating slots */
    hide_combatSlots(){
        const ccs = this.combatSlots;
        TweenLite.to(ccs, 0.6, { alpha:0, ease: Power4.easeOut });
        TweenLite.to(ccs.children.map((s)=>s.scale   ), 0.4, { x:0, y:0, ease: Power4.easeOut });
        TweenLite.to(ccs.children.map((s)=>s.position), 0.4, { x:0, y:0, ease: Power4.easeOut });
    };

     /** position et transform les slots selon les mode */
    set_combatSlotsMode(mode){ //TODO: tous les mode on des slots qui influence l'actions
        if(mode){
            //TODO: transforme slots selon mode
            this.combatSlots.interactiveChildren = true;
            this.show_combatSlots();
        }else{
            this.combatSlots.interactiveChildren = false;
            this.hide_combatSlots();
        }
    }

    /** Animations et placement des huds selon le mode de combat actif */
    setupFromMode(mode){
        this.set_combatIconsMode(mode);
        this.set_combatSlotsMode(mode);
    }

    /** fusionning slots when hold click on target attack */
    fusion_combatSlots(){
        const cs = this.combatSlots;
        const cci = this.combatIcons;
        TweenLite.to(cs, 2, { alpha:0.5, y:'+=100', ease: Power4.easeOut });
        TweenLite.to(cci, 0.2, { alpha:0, ease: Power4.easeOut });
        for (let i=0, l=cs.children.length; i<l; i++) {
            const s = cs.children[i];
            TweenLite.to(s.position, 2, { x:0,y:0, ease: SlowMo.ease.config(0.9, 0.7, false) });
            TweenLite.to(s.scale, 2, { x:'+=0.2',y:'+=0.2', ease: Power4.easeOut });
            // TweenLite.to(slot, 0.6, {
            //     rotation: 0, // green
            //     ease: Power4.easeOut,
            // });
        };
    };
    
    show_combatBox(target,source,mode){
        const ccb = this.combatBox;
        if(target.p.isReverse){
            ccb.position.set(target.x+target.p.width/2,target.y-ccb.height);
        }else{
            ccb.position.set(target.x-ccb.width-(target.p.width/2),target.y-ccb.height);      
        }
        TweenLite.to(ccb.child.result.line1.scale, 0.5, { x:1, ease:Power4.easeOut });
        TweenLite.to(ccb.child.result.line2.scale, 0.6, { x:1, ease:Power4.easeOut });
        TweenLite.to(ccb, 0.2, { alpha:1, ease:Power4.easeOut });
    };

    hide_combatBox(){
        const ccb = this.combatBox;
        TweenLite.to(ccb, 0.2, { alpha:0, ease:Power4.easeOut });
        this.clear_combatBoxFrom();
    };

    /** clear icons influer and ingliger */
    clear_combatBoxFrom(){
        const ccb = this.combatBox;
        ccb.child.base     .icons.removeChildren();
        ccb.child.infliger .icons.removeChildren();
        ccb.child.influer  .icons.removeChildren();
        ccb.child.background.width = 0;
        ccb.child.background.height = 0;
        ccb.child.result.txt.x = 0;
        ccb.child.result.line1.scale.x = 0;
        ccb.child.result.line2.scale.x = 0;
    };

    /**recalcule les element grafic dans la BOX selon le target */
    setupCombatBoxFrom(source,target,mode){ //TODO: RENDU ICI
        if(!target){ return this.hide_combatBox() };
        this.clear_combatBoxFrom();
        const ccb = this.combatBox;
        const actionSetup = $states.getActionSetupFrom(source, target, mode);
        const resultMin = $combats.computeDammage(source,target,actionSetup,{useContext:true,min:true});
        const resultMax = $combats.computeDammage(source,target,actionSetup,{useContext:true,max:true});
        //! BASES position
        const baseAB = [].concat(actionSetup.baseA,...actionSetup.baseB);
        for (let i=0, x=0, l=baseAB.length; i<l; i++) {
            const icon = baseAB[i].p;
            icon.position.set(x,0);
            x+=icon.width;
            ccb.child.base.icons.addChild(icon);
        };
        //! INFLIGER position
        const infligers = actionSetup.infligers;
        for (let i=0, x=0, l=infligers.length; i<l; i++) {
            const icon = infligers[i].p;
            icon.position.set(x,0);
            x+=icon.width;
            ccb.child.infliger.icons.addChild(icon);
        };
        //! INFLUER position
        const influers = actionSetup.influers;
        for (let i=0, x=0, l=influers.length; i<l; i++) {
            const icon = influers[i].p;
            icon.position.set(x,0);
            x+=icon.width;
            ccb.child.influer.icons.addChild(icon);
        };
        //! RESULTA
        const result = `( [#f49e42]${resultMin.total}[#] [#B24387]<=>[#] [#f49e42]${resultMax.total}[#] )`;
            ccb.child.result.txt.computeTag(result);
            ccb.child.result.txt.pivot.x = ccb.child.result.txt.width/2;
            ccb.child.result.line2.y = ccb.child.result.txt.height;
        //! POSITIONNING BOX
        for (let i=1, y=0, l=ccb.children.length; i<l; i++) {
            const c = ccb.children[i];
            c.position.y = y;
            y+=c.height;
        };
        const ccbW = ccb.width;
        const ccbH = ccb.height;
        ccb.child.background.width = ccbW;
        ccb.child.background.height = ccbH;
        ccb.child.result.txt.x = ccbW/2;
        ccb.child.result.line1.x = ccbW/2;
        ccb.child.result.line2.x = ccbW/2;
        

     this.show_combatBox(target,source,mode);
    };

    /** setup les information du monstre dans l'infoBox */
    setupMonsterInfoBox(monster){
        const id = monster._id;
        const bBoxL = this.monsterInfoBox.bBoxL;
        const bBoxR = this.monsterInfoBox.bBoxR;
        const margeX = 40;
       const bBoxL_name = `${$txt._._NAME}:[#f49e42]${$txt._[`N_MONSTER${id}`]}[#] ${$txt._._LEVEL}: [#f49e42]${monster.level}[#]`;
           bBoxL.child.bBoxL_name.computeTag(bBoxL_name);
       const bBoxL_type = `${$txt._._TYPE}: ${'[I0][I1][I2]'}`;
           bBoxL.child.bBoxL_type.computeTag(bBoxL_type);
       const bBoxL_states =
           `[IsIcon_hp]${monster.hp}/${monster.mhp} [IsIcon_hg]${monster.hg}/${monster.mhg} [IsIcon_atk]${monster.atk} [IsIcon_sta]${monster.sta} [IsIcon_lck]${monster.lck}[N40]`+
           `[IsIcon_mp]${monster.mp}/${monster.mmp} [IsIcon_hy]${monster.hy}/${monster.mhy} [IsIcon_def]${monster.def} [IsIcon_int]${monster.int} [IsIcon_mic]${monster.mic}`; //TODO: item posseder par monster
           bBoxL.child.bBoxL_states.computeTag(bBoxL_states);
        const bBoxL_stategie = `[#B24387]${$txt._._DESCS}[#][N]${$txt._[`D_MONSTER${id}`]}`;
            bBoxL.child.bBoxL_stategie.computeTag(bBoxL_stategie);
       const bBoxL_itemsImunity = `[#B24387]${$txt._._IMUNITY}[#][N]${$txt._.COMBAT_D_IMUNITY}`;
           bBoxL.child.bBoxL_itemsImunity.computeTag(bBoxL_itemsImunity);
       const bBoxL_alimentations = `[#B24387]${$txt._._ALIMENT}[#][N]${$txt._.COMBAT_D_ALIMENT}`;
           bBoxL.child.bBoxL_alimentations.computeTag(bBoxL_alimentations);

        const bBoxR_title = `[#B24387]${$txt._._CAPACITY}[#][N]${$txt._.COMBAT_D_CAPACITY}`
            bBoxR.child.bBoxR_title.computeTag(bBoxR_title);

        //#positionning all child 
        for (let i=0,x=margeX,y=20, l=bBoxL.children.length; i<l; i++) {
            const el = bBoxL.children[i];
            el.position.set(x,y);
            y+=el.height+4;
        };
        for (let i=0,x=margeX/2,y=20, l=bBoxR.children.length; i<l; i++) {
            const el = bBoxR.children[i];
            el.position.set(x,y);
            y+=el.height+4;
        };
    };

    /**Affiche info monster box si click sans _mode */
    show_monsterInfoBox(monster){
        this.setupMonsterInfoBox(monster);
        $stage.interactiveChildren = false;
        const ccim = this.monsterInfoBox;
        TweenLite.to(ccim, 0.2, { alpha:0.9, ease:Power3.easeOut });
        TweenLite.to(ccim.bBoxL.position, 0.3, { x:0, ease:Power3.easeOut });
        TweenLite.to(ccim.bBoxR.pivot, 0.3, { x:ccim.bBoxR.width, ease:Power3.easeOut });
    };

    /**cache info monster box si click sans _mode */
    hide_monsterInfoBox(speed=0.3){
        $stage.interactiveChildren = true;
        const ccim = this.monsterInfoBox;
        TweenLite.to(ccim, 0.2, { alpha:0, ease:Power3.easeOut });
        TweenLite.to(ccim.bBoxL.position, speed, { x:-ccim.bBoxL.width, ease:Power3.easeOut });
        TweenLite.to(ccim.bBoxR.pivot, speed, { x:0, ease:Power3.easeOut });
    };
    
    /** when combat start , call this for add sprites to scenes */
    setupToScene(){
        this.hide_monsterInfoBox(0);
        $stage.scene.addChild(...this.childList.scene);
        this.renderable = true;
        this.interactiveChildren = true;
   
    };

    /** when combat end , call this for remove sprites to scenes */
    clearFromScene(){
        $stage.scene.removeChild(...this.childList.scene);
        this.renderable = false;
        this.interactiveChildren = false;
    };
};