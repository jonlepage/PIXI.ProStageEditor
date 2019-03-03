// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘
// prepare les grafics huds pour combats, quand start, ajoute a la camera et scene car ya des affines
class _huds_combats extends PIXI.Container{
    constructor() {
        super();
        /** combatSlots,combatIcons,combatBox*/
        this.sprites = {};
        /** list des modes */
        this.combatMode = ['attack','defense','move','run','magic'];
        this._mode = null; // quand choisi un mode
    };
    set mode(mode){ this._mode = mode ; this.refreshDisplaySetup() };
    /** return array list des container dispo */
    get list_c(){ return Object.values(this.sprites) };
    /** return le container des slots items pour combat */
    get combatSlots() {return this.sprites.cs};
    /** return le container des icons pour selectionner le mode combat */
    get combatIcons() {return this.sprites.ci};
    /** return le container qui affiche et calcul les info lors selection d'une cible */
    get combatBox() {return this.sprites.cb};

    initialize(){
        this.initialize_combatSlots(); // creer les slots sosu le player
        this.initialize_combatIcons(); // creer les icons de choix de combat pour les players 
        this.initialize_damageBox(); // preparle la boite indicatrice de damage
    };

    initialize_combatSlots(){
        // combats items slots
        const cs =  new PIXI.projection.Container2d(); //TODO: container 2D ? car affine ?
        cs.proj._affine = 2; // test 3,4 ?
        const x = [-70,0,70];
        const y = [0,40,0];
        for (let i=0; i<3; i++) {
            const csC = new PIXI.Container();
            const cs_d = csC.d = new PIXI.Sprite($Loader.Data2.hud_combats.textures.hudS_itemSlots);
            //const cs_n = csC.n = new PIXI.Sprite($Loader.Data2.hud_combats.textures_n.hudS_itemSlots_n);
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
            cs.addChild(csC);
            
        };
        cs.renderable = false;
        this.sprites.cs = cs;
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
            cci.addChild(iconMode);
            x+=iconMode.width+4;
        };
        const bounds = cci.getBounds();
        cci.pivot.set((bounds.width+bounds.x)/2,bounds.height+bounds.y+$player.s.height);
        this.sprites.ci = cci;
        cci.renderable = false;
    };

    initialize_damageBox(){
        const ccB = new PIXI.projection.Container2d(); // combat container BOX
        ccB.proj._affine = 2; // test 3,4 ?
        ccB.parentGroup = $displayGroup.group[2];
        // black box black background __________
        const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        bg._filters = [$systems.filtersList.OutlineFilterx4white];
        bg.tint = 0x000000;
        bg.alpha = 0.92;
       // title container _____________________
       const cct = new PIXI.Container(); // combat container title
       const iconMode = this._mode? new PIXI.Sprite($Loader.Data2.hud_combats.textures[`cbi_${this._mode}`]) : new PIXI.Sprite();
        iconMode.anchor.set(0.5);
       const ttxt = new PIXI.Text('Attack',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:24,strokeThickness:4});//title text
       ttxt.anchor.set(0,0.5);
       ttxt.x = 40;
       // powerOrb
       const powerOrbs = new PIXI.Container();
       const pt = $systems.powerType;// TODO: quand le joueur jour son tour, asigner dans $system le powerType pour acceder
       for (let i=0, l=pt.length; i<l; i++) {
           const slot = sslots[i];
           if(slot.item){  }
       };
       cct.addChild(iconMode,ttxt,powerOrbs);
       cct.child = {iconMode,ttxt,powerOrbs};
       // dammage container ____________________
       const ccd = new PIXI.Container(); // combat container dammage
       const icons = [];
       const dtext = new PIXI.Text('Dammage',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:24,strokeThickness:4});//damage text
       for (let i=0,x=0,y=dtext.height, l=[0,2,3,6,7].length; i<l; i++) {
           //TODO: asigner les objets et verifier si elle inflige aussi des states.
           const icon = new PIXI.Sprite(PIXI.Texture.WHITE);
           icon.width = 60; // TODO: DELETE ME FOR DEBUG
           icon.height = 60; // TODO: DELETE ME FOR DEBUG
           icon.position.set(x,y);
           x+=60+4;
           icons.push(icon);
       };
       ccd.addChild(dtext,...icons);
       ccd.child = {dtext,icons};
        // passive status container ____________________
        const ccs = new PIXI.Container(); // combat container status
        ccs.statusIcon = [];
        const stext = new PIXI.Text('Passive Status',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:24,strokeThickness:4});//damage text
        for (let i=0,x=0,y=stext.height, l=[0,2,3,6,7].length; i<l; i++) {
            //TODO: asigner les objets et verifier si elle inflige aussi des states.
            const statusIcon = new PIXI.Sprite(PIXI.Texture.WHITE);
            statusIcon.width = 60; // TODO: DELETE ME FOR DEBUG
            statusIcon.height = 60; // TODO: DELETE ME FOR DEBUG
            statusIcon.position.set(x,y);
            x+=60+4;
            ccs.statusIcon.push(statusIcon);
        };
        ccs.addChild(stext,...ccs.statusIcon);
        // math result ____________________
        const ccr = new PIXI.Container(); // combat container result
        const splitLineTop = new PIXI.Sprite($Loader.Data2.hud_combats.textures.cb_mathLine);
        splitLineTop.anchor.set(0.5);
        const resultTxt = new PIXI.Text('(180 <=> 486)',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:24,strokeThickness:4});//damage text
            resultTxt.anchor.set(0.5);
            resultTxt.y = resultTxt.height/2;
        const splitLineBot = new PIXI.Sprite($Loader.Data2.hud_combats.textures.cb_mathLine);
        splitLineBot.anchor.set(0.5);
        splitLineBot.y = resultTxt.height;
        ccr.addChild(splitLineTop,resultTxt,splitLineBot);

        //end
        ccB.addChild(bg,cct,ccd,ccs,ccr);
        ccd.position.y = 40;
        ccs.position.y = 150;
        ccr.position.y = ccs.position.y+ccs.height+40;
        ccr.position.x =(ccB.width/3);
        
        ccB.child = {cct,ccd,ccr,ccs,bg};
        this.sprites.cb = ccB;
        // temp enlarge la black box a container
        bg.width = ccB.width;
        bg.height = ccB.height;
        ccB.pivot.set(ccB.width,ccB.height); // selon la directin du player
        ccB.scale.set(0.8);
        ccB.renderable = false;
    };

    //#region [rgba(40, 0, 0, 0.2)]
    // ┌------------------------------------------------------------------------------┐
    // EVENTS INTERACTION LISTENERS
    // └------------------------------------------------------------------------------┘
    setInteractive() {
        //combatIcons
        const cci = this.combatIcons;
        cci.children.forEach(cIcon => { // each sprite icon
            cIcon.interactive = true;
            cIcon.on('pointerover' , this.pIN_cIcon  ,this);
            cIcon.on('pointerout'  , this.pOUT_cIcon ,this);
            cIcon.on('pointerup'   , this.pUP_cIcon  ,this);
        });
    };

    pIN_cIcon(e){
        const ee = e.currentTarget;
        TweenMax.to(ee.scale, 0.3, {x:1,y:1, ease: Power4.easeOut });
        TweenMax.to(ee.parent.scale, 1, {x:1.1,y:1.05, ease: Elastic.easeOut.config(0.8, 0.75) });
        ee._filters = [$systems.filtersList.OutlineFilterx4white];
    };
    
    pOUT_cIcon(e){
        const ee = e.currentTarget;
        TweenMax.to(ee.scale, 0.3, {x:ee.scale.zero.x,y:ee.scale.zero.y, ease: Power4.easeOut });
        TweenMax.to(ee.parent.scale, 1, {x:1,y:1, ease: Power4.easeOut });
        ee._filters = null;
    };
    
    pUP_cIcon(e){
        const ee = e.currentTarget;
        ee._filters = [$systems.filtersList.OutlineFilterx8Green];
        this.mode = ee._mode;
        
    };
    //#endregion 

    /**combat start, setup */
    start(){
        const containers = this.list_c;
       $stage.scene.addChild(...containers);
       containers.forEach(c => {
           c.position.set($player.s.x,$player.s.y);
           c.renderable = true;
       });
       this.setInteractive(); // build interactive
       this.refreshDisplaySetup();
      //  $huds.combats.setupToScene(); // add child and setup to current scene.
    };

    // rafres les element affiche selon la configuration
    refreshDisplaySetup(){
        if(this._mode === this.combatMode[0]){ // attack mode
            this.show_combatSlots();
            $camera.moveToTarget($player,8);
            if($combats.selectedMonster){this.show_combatBox($combats.selectedMonster)}
        }else{
            this.hide_combatBox();
            this.hide_combatSlots();
            $camera.moveToTarget($player,7);
        }
    };


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
    }

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
        cb.alpha = 0;
        this.refreshCombatBox();
        cb.position.set(target.x,target.y);
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
    refreshCombatBox(){
        const cb = this.combatBox;
        // title container
        const cct = cb.child.cct;
        cct.child.iconMode._texture = $Loader.Data2.hud_combats.textures[`cbi_${this._mode}`];
        // dammage container
        const ccd = cb.child.ccd;
        const items = this.combatSlots._items || []; // tous les item id
        for (let i=0,x=0,l=items.length; i<l; i++) {
            //TODO: asigner les objets et verifier si elle inflige aussi des states.
            const icon = new PIXI.Sprite(PIXI.Texture.WHITE);
            icon.width = 60; // TODO: DELETE ME FOR DEBUG
            icon.height = 60; // TODO: DELETE ME FOR DEBUG
            icon.position.set(x,y);
            x+=60+4;
            icons.push(icon);
        };
        ccd.addChild(dtext,...icons);
    };
    


    
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