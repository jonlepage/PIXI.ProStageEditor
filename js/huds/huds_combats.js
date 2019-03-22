// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘
// prepare les grafics huds pour combats, quand start, ajoute a la camera et scene car ya des affines
class _huds_combats extends PIXI.Container{
    constructor() {
        super();
        /** list ref des container pour add a la scene et au stage lorsque combat start combatSlots,combatIcons,combatBox*/
        this.childList = {
            ccs:null,//initialize_combatSlots
            cci:null,//initialize_combatIcons
            BOX:null,//initialize_combatBox
            /** les container a mettre dans scene */
            get scene(){return [this.ccs,this.cci,this.BOX]},
            /** les container a mettre dans stage ou camera */
            get stage(){return []},
        };
        /** list des modes */
        this.combatMode = ['attack','defense','move','run','magic'];
        this._mode = null; // quand choisi un mode
    };
    set mode(mode){ this._mode = mode ; this.refreshDisplaySetup() };
    /** return array list des container dispo */
    get list_c(){ return Object.values(this.childs) };
    /** return le container des slots items pour combat */
    get combatSlots() {return this.childList.ccs};
    /** return le container des icons pour selectionner le mode combat */
    get combatIcons() {return this.childList.cci};
    /** return le container qui affiche et calcul les info lors selection d'une cible */
    get combatBox() {return this.childList.BOX};
    /** return la derniere cible survoller par la sourit */
    get targetSelected(){
       return $combats.selectedMonster;
    }
    get slotsItems(){
        return this.combatSlots.children.filter(c => Number.isFinite(c._iID));
    };


    initialize(){
        this.initialize_combatSlots(); // creer les slots sosu le player
        this.initialize_combatIcons(); // creer les icons de choix de combat pour les players 
        this.initialize_combatBox(); // preparle la boite indicatrice de damage
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
                };
                if(Number.isFinite(id)){
                  const newItem = $items.list[id].createSprites(true);
                  csC.item = newItem;
                  csC.addChild(newItem);
                  csC._iID = id;
                  csC.item = newItem;
                };
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
            csC.slots = {cs_d};
            csC.addChild(cs_d);
            ccs.addChild(csC);
        };
        this.childList.ccs = ccs;
    };

    // les icon pour selectioner le mode combat
    initialize_combatIcons(){
        const cci =  new PIXI.projection.Container2d(); //container combat icon
        cci.parentGroup = $displayGroup.group[2];
        cci.icons = {};
        cci.proj._affine = 2; // test 3,4 ?
        for (let i=0,x=0, l=this.combatMode.length; i<l; i++) {
            const imode = this.combatMode[i];
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
        const BOX = new PIXI.projection.Container2d(); // combat container BOX
            BOX.proj._affine = 2; // test 3,4 ?
            BOX.parentGroup = $displayGroup.group[2];
        // black box black background __________
        const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            bg.parentGroup = PIXI.lights.diffuseGroup
            bg.width = 100, bg.height=100;
            bg.tint = 0x000000;
            bg.alpha = 0.8;
       //! TITLE CONTAINER_____________________
       const title = new PIXI.Container();
        title.logo = new PIXI.Sprite(PIXI.Texture.WHITE);
        title.titleTxt = new PIXI.Text('Attack',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:18,strokeThickness:4});// data2/Hubs/combats/SOURCE/images/cbi_attack.png
        title.titleTxt.x = 40;
        title.logo.anchor.set(0.5);
        title.titleTxt.anchor.y = 0.5;
        title.addChild(title.logo,title.titleTxt);
        //! TITLE RIGHT ORBS CONTAINER_____________________
       const titleOrbs = new PIXI.Container();
         //! INFLIGEUR CONTAINER_____________________
       const infliger = new PIXI.Container(); // combat container dammage
        infliger.txt = new PIXI.Text('Infliger',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:18,strokeThickness:4});//damage text
        infliger.txt.anchor.y = 1;
        infliger.list = [];
        infliger.addChild(infliger.txt);
       //! INFLUEUR CONTAINER_____________________
       const influer = new PIXI.Container(); // combat container dammage
        influer.txt = new PIXI.Text('Influer',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:18,strokeThickness:4});//damage text
        influer.txt.anchor.y = 1;
        infliger.list = [];
        influer.addChild(influer.txt);
       //! RESULTE CONTAINER_____________________
       const resulter = new PIXI.Container(); // combat container result
        resulter.line1 = new PIXI.Sprite($Loader.Data2.hud_combats.textures.cb_mathLine);
        resulter.line2 = new PIXI.Sprite($Loader.Data2.hud_combats.textures.cb_mathLine);
        resulter.txt = new PIXI.Text('(180 <=> 486)',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:24,strokeThickness:4});
        resulter.addChild( resulter.line1, resulter.line2, resulter.txt);
        //# RESULTE CONTAINER_____________________
        //end
        BOX.addChild(bg,title,titleOrbs,infliger,influer,resulter);
        BOX.C = {bg,title,titleOrbs,infliger,influer,resulter};
        this.childList.BOX = BOX;
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
            this.setCombatModeTo(ee._mode);
           
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
            if ($mouse.isHoldItem) { // si item dans mouse et mode menu
                ee.setItemId($mouse._holdItemID);
                $mouse.setItemId(null);
                ee.scale.set(1);
                TweenLite.to(ee.scale, 0.2, { x: ee.scale.zero.x, y: ee.scale.zero.y, ease: Power4.easeOut });
                // recalcule la dmgBox si cible un target ?
                if($combats._selectedTarget){
                    this.show_combatBox($combats._selectedTarget)
                };
                
            };
        };
    };
    //#endregion 

    /** Initialize et position les huds sur un target du nouveau tour */
    setupToTargetTurn(target){
        // position les hud sur le target turn
        const cci = this.combatIcons;
        cci.interactiveChildren = true;
        cci.position.copy(target.p.position);
        const ccs =  this.combatSlots;
        ccs.interactiveChildren = true;
        ccs.position.copy(target.p.position);
    };

    /** redefenie le mode combat du current player et applique transitions */
    setCombatModeTo(mode){
        this._mode = mode;
        // position combat icon selon le mode
        this.combatIcons.children.forEach(cIcon => {
            if(cIcon._mode === mode){ // focus
               // $player.s.scale.set();
                const toXY = this.combatIcons.pivot; // parent pivot
                cIcon.scale.set(0.5);
                TweenLite.to(cIcon.position, 0.4, { x:toXY.x, y:toXY.y, ease:  Back.easeOut.config(1.7) });
                TweenLite.to(cIcon.scale, 0.5, { x:1, y:1, ease:  Back.easeInOut.config(1.7) });
                TweenLite.to(cIcon, 0.5, { alpha:0.5, ease: Power4.easeOut });
            }else if(mode){ // hide et si mode
                TweenLite.to(cIcon.pivot, 0.3, { y:48, ease: Power4.easeOut });
                TweenLite.to(cIcon, 0.3, { alpha:0, ease: Power4.easeOut });
            }else{ // cancel mode null , back to zero
                TweenLite.to(cIcon.pivot, 1, { y:0, ease: Power4.easeOut });
                TweenLite.to(cIcon, 1, { alpha:1, ease: Power4.easeOut });
                TweenLite.to(cIcon.scale, 1, { x:cIcon.scale.zero.x, y:cIcon.scale.zero.y, ease: Power4.easeOut });
                TweenLite.to(cIcon.position, 1, { x:cIcon.position.zero.x, y:cIcon.position.zero.y, ease: Power4.easeOut });
            };
        });
        if(mode===this.combatMode[0] || mode===this.combatMode[1]){ //si mode attack ou defense? affiche les slots 
            this.show_combatSlots();
        }else{// si null 
            this.hide_combatSlots();
        };
        $combats.setCombatModeTo(mode);
        
    }

    show_combatSlots(){
        const cs = this.combatSlots;
        for (let i=0, l=cs.children.length; i<l; i++) {
            const s = cs.children[i];
            TweenLite.to(s, 0.6, {
                alpha: 0.9, ease: Power4.easeOut,
            });
            TweenLite.to(s.scale, 0.4, {
                x:s.scale.zero.x,y:s.scale.zero.y, ease: Power4.easeOut,
            });
            TweenLite.to(s.position, 1, {
                x:s.position.zero.x,y:s.position.zero.y, ease: Elastic.easeOut.config(1, 0.3),
            });
           // TweenLite.to(slot, 0.6, {
           //     rotation: 0, // green
           //     ease: Power4.easeOut,
           // });
        };
    };

    hide_combatSlots(){
        const cs = this.combatSlots;
        for (let i=0, l=cs.children.length; i<l; i++) {
            const s = cs.children[i];
            if(s.item){return}; // do nothing if have item
            TweenLite.to(s, 0.4, {
                alpha: 0.2, ease: Power4.easeOut,
            });
            TweenLite.to(s.scale, 0.3, {
                x:0,y:0, ease: Back.easeIn.config(2),
            });
            TweenLite.to(s.position, 0.2, {
                x:0,y:0, ease: Back.easeIn.config(2),
            });
   
        };
    };

    show_combatBox(target){
        const cb = this.combatBox;
        this.setupCombatBox(target);
        if(target.isReverse){
            cb.position.set(target.x-cb.width-(target.p.width/2),target.y-cb.height);            
        }else{
            cb.position.set(target.x+target.p.width/2,target.y-cb.height);
        }
        
        TweenLite.to(cb, 0.2, {
            alpha:1, ease:Power4.easeOut,
        });
    };

    hide_combatBox(){
        const cb = this.combatBox;
        TweenLite.to(cb, 0.2, {
            alpha:0, ease:Power4.easeOut,
        });
    }

    // recalcule les element grafic dans la BOX
    setupCombatBox(target){
        const BOX = this.combatBox;
        const source = $player; //? le personnage tour
        const mode = this._mode; //? Le mode choisis
        
        const infliger = $states.getInfligersFrom(source, target, this.slotsItems, mode);
        const influer  = $states.getInfluerFrom  (source, target, infliger);
        
        

        console.log('infliger: ', infliger);
        console.log('influer: ', influer);
        //! infliger container
        BOX.C.infliger.list = infliger;
        for (let i=0, x=0, l=infliger.length; i<l; i++) {
            const ico = infliger[i];
            ico.position.set(x,0);
            BOX.C.infliger.addChild(ico);
            x+=48;
        };
        //! infliger container
        BOX.C.influer.list = influer;
        for (let i=0, x=0, l=influer.length; i<l; i++) {
            const ico = influer[i];
            ico.position.set(x,0);
            BOX.C.influer.addChild(ico);
            x+=48;
        };
        //! Resulta
        const values = this.evalResultDMG(infliger,influer);
        BOX.C.resulter.txt.text = `( ${values[0]} <=> ${values[1]} )`;
        // logo title
        BOX.C.title.logo.texture = $Loader.Data2.hud_combats.textures[`cbi_${mode}`]; // swap texture mode
        
        // posisionning
        let yy = 0;
        BOX.C.title.y = yy;
            yy+=BOX.C.title.height;
        BOX.C.infliger.y = yy;
            yy+=BOX.C.infliger.height;
        BOX.C.influer.y = yy;
            yy+=BOX.C.influer.height;
        BOX.C.resulter.y = yy;
        BOX.C.bg.width  = 1, BOX.C.bg.width  = BOX.width ;
        BOX.C.bg.height = 1, BOX.C.bg.height = BOX.height;

        console.log('target: ', target.p.scale);
        console.log('target: ', target.s.scale);
        
        
        
        


    };

    /**return une valeur minimal de dammage */
    evalResultDMG(infliger,influer){
        // TODO: verifier si ont doi proceder ainsi, tester en real time
        let valueMin = 0;
        let valueMax = 0;
        infliger.forEach(state => {
            valueMin+=state.computeValue(valueMin,true,true,false); // value,useContext,min,max
            valueMax+=state.computeValue(valueMax,true,false,true);
        });
        return [valueMin,valueMax];
    }

    
    // when combat start, call this for add sprites to scenes
    setupToScene(){
        const cshadow = this.sprites.csha;
        $stage.scene.addChild(this.sprites.csha);
        cshadow.position.set($player.x,$player.y);

        const slots = this.sprites.cs;
        $stage.scene.addChild(...slots);
        slots.forEach(s => { s.position.set(cshadow.x,cshadow.y) });

        const carw = this.sprites.carw;
        carw.position.set($player.x,$player.y-200);
        $stage.scene.addChild(carw);

        const lRec = this.sprites.lRec;
        $stage.CAGE_GUI.addChild(lRec);

        const cage_dsb = this.sprites.cage_dsb;
        $stage.scene.addChild(cage_dsb);
        cage_dsb.position.set($player.x,$player.y-$player.spine.height);
        
    }


};

/** @description class combats slot pour les items dans combat */
class combat_slots extends PIXI.Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(0.2);
        this.rotation = Math.PI/2;
        this.aplha = 0.2;
        this.parentGroup = $displayGroup.group[3];
        this._item = null;
    }
    /**@param Number itemID */ // add item to slot 
    set item(id){
        if(this._item){ this.removeChild(this._item) };
        if(Number.isFinite(id)){
            const item = this._item = $items.createItemsSpriteByID(id);
            item.parentGroup = $displayGroup.group[3];
            this.addChild(item);
        }else{
            this._item = null;
        };
    }
    get item(){ return this._item };
    
    setupInteractions() {
        this.on('pointerover' , this.pIN  , this);
        this.on('pointerout'  , this.pOUT , this);
        this.on('pointerup'   , this.pUP  , this);
    };

    pIN(e){
        const cs = e.currentTarget;
        cs.alpha = 1;
        cs.blendMode = 1;
        TweenLite.to(cs.scale, 0.6, {
            x:0.6,y:0.6, ease: Power4.easeOut,
        });
    };
    pOUT(e){
        const cs = e.currentTarget;
        cs.alpha = this.item && 1 || 0.9;
        cs.blendMode = 0;
        if(!this.item){
            TweenLite.to(cs.scale, 0.6, {
                x:0.5,y:0.5, ease: Power4.easeOut,
            });
        };
    };
    pUP(e){
        if($mouse.holdingItem){
            this.item = $mouse.holdingItem._id;
        }else{
            this.item = null;
        }
    };

    show(){
        this.interactive = true;
        TweenLite.to(this, 0.6, {
            alpha: 0.9, ease: Power4.easeOut,
        });
        TweenLite.to(this.scale, 0.4, {
            x:0.5,y:0.5, ease: Power4.easeOut,
        });
        TweenLite.to(this.pivot, 0.6, {
            x:this.pivot.xx,y:this.pivot.yy, ease: Elastic.easeOut.config(1, 0.3),
        });
        TweenLite.to(this, 0.6, {
            rotation: 0, // green
            ease: Power4.easeOut,
        });
    };

    hide(){
        if(this.item){return}; // do nothing if have item
        this.interactive = false;
        TweenLite.to(this, 0.4, {
            alpha: 0.2, ease: Power4.easeOut,
        });
        TweenLite.to(this.scale, 0.3, {
            x:0.2,y:0.2, ease: Back.easeIn.config(2),
        });
        TweenLite.to(this.pivot, 0.3, {
            x:0,y:0, ease: Back.easeIn.config(2),
        });
        TweenLite.to(this, 0.6, {
            rotation: this.pivot.xx>0&&Math.PI/2||this.pivot.xx<0&&-Math.PI/2||0, // green
            ease: Power4.easeOut,
        });
    }
}