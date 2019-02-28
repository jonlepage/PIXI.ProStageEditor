// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘
// prepare les grafics huds pour combats, quand start, ajoute a la camera et scene car ya des affines
class _huds_combats extends PIXI.Container{
    constructor() {
        super();
        this.sprites = {};
    };

    initialize(){
        // combats items slots
        const cs =  new PIXI.projection.Container2d(); //TODO: container 2D ? car affine ?
        cs.proj._affine = 2; // test 3,4 ?
        const x = [-100,0,100];
        const y = [0,40,0];
        for (let i=0; i<3; i++) {
            const csC = new PIXI.Container(); //TODO: container 2D ? car affine ?
            const cs_d = csC.d = new PIXI.Sprite($Loader.Data2.hud_displacement.textures.hudS_itemSlots);
            const cs_n = csC.n = new PIXI.Sprite($Loader.Data2.hud_displacement.textures_n.hudS_itemSlots_n);
            csC.scale.set(0.6);
            cs_d.anchor.set(0.5);
            cs_n.anchor.set(0.5);
            csC.parentGroup = $displayGroup.group[2];
            cs_d.parentGroup = PIXI.lights.diffuseGroup;
            cs_n.parentGroup = PIXI.lights.normalGroup;
            csC.slots = {cs_d,cs_n};
            csC.addChild(cs_d,cs_n);
            cs.addChild(csC);
            csC.position.set(x[i],y[i]);
        };
         // dmgBox
        const lineBox = {pos:null,neg:null};
        const lineData = []; // contien

        const dmgBoxC = new PIXI.projection.Container2d();
        dmgBoxC.proj._affine = 2; // test 3,4 ?
        dmgBoxC.parentGroup = $displayGroup.group[2];
        // black box black background
        const blackBG = new PIXI.Sprite(PIXI.Texture.WHITE);
        blackBG._filters = [$systems.filtersList.OutlineFilterx4white];
        blackBG.tint = 0x000000;
        blackBG.alpha = 0.92;
        blackBG.width = 400; blackBG.height = 400;//FIXME: AT END
        dmgBoxC.addChild(blackBG);
        // title texts 
       
        const resultTxt = new PIXI.Text('( 18<=>279 )'  ,{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:32,strokeThickness:10});
        const statusTxt = new PIXI.Text('passive status',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:24,strokeThickness:4});
        resultTxt.position.set(100,50); //FIXME: dynamic a la fin
        statusTxt.y = 100;
       // dmgBoxC.addChild(passiveDmgTxt,resultTxt,statusTxt);

        // header icon
        let xx = 0; // X traking when go =>
        const header = new PIXI.Container();
            // logo
            const atkLogo = new PIXI.Sprite($Loader.Data2.combatIcons.textures.atack_logo);
            atkLogo.anchor.set(0.5);
            // title name
            const titleName = new PIXI.Text('ATTACK',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:24,strokeThickness:4});
            titleName.anchor.y = 0.5;
            //small orbsType: les indicateur d'influence du type d'attaque ou magie
            const orbTypes = [];
            [0,1,2].forEach((id)=>{ //TODO:
                const orbType = new PIXI.Sprite($Loader.Data2.combatIcons.textures['combatOrbTyp_'+id]);
                orbType.anchor.set(0.5);
                orbTypes.push(orbType)
                
            });
        header.addChild(atkLogo,titleName,...orbTypes);
       
        // compute fake formula FIXME: remove and add in method
        // creer les icon dans system ? avec textId deswcriptor
        const slotsItemID = [4,6,7];
        const sL = 10; // space Lateral _
        const sV = 10; // space Vertical |
        // body passive dammage
        const bodyPassiveDmg = new PIXI.Container(); // passive damage container
            const bodyPassiveDmg_txt    = new PIXI.Text('Passive damage',{fill:"white",fontFamily:"ArchitectsDaughter",fontSize:24,strokeThickness:4});
            // slots x3 +1 base
            const fakeSlotItem = [1,2,4]; // TODO:
            const dmgSlots = [];
            const atkSlot = new PIXI.Sprite($Loader.Data2.statsIcons_d23.textures.sIcon_atk);// data2/Icons/statsIcons/SOURCE/images/sIcon_atk.png
                atkSlot.position.y = 40; //TODO: metre dans les icons ?
                dmgSlots.push(atkSlot);
            for (let i=0, l=fakeSlotItem.length; i<l; i++) {
                const iID = fakeSlotItem[i];
                const slot = new PIXI.Sprite($Loader.Data2.gameItems.textures[iID]); // data2/Objets/gameItems/SOURCE/images/3.png
                slot.position.x = slot.width*(i+1);
                slot.position.y = 40
                dmgSlots.push(slot);
            };
        bodyPassiveDmg.addChild(bodyPassiveDmg_txt,...dmgSlots);
        bodyPassiveDmg.y = 80
        //end
        dmgBoxC.addChild(header,bodyPassiveDmg);
        this.sprites = {header,bodyPassiveDmg};
            
        setTimeout(function(){  //TODO: DELET ME , DEBUG 
            $stage.scene.addChild(cs,dmgBoxC);
            cs.x = $player.s.x;
            cs.y = $player.s.y;
            dmgBoxC.pivot.set(0,dmgBoxC.height);
           dmgBoxC.x = $player.s.x+$player.s.width;
           dmgBoxC.y = $player.s.y;
           dmgBoxC.scale.set(0.6);
        }, 1500);
    };
    

    // mathBox thats show statistic dmg
    createMathDmgBox(){
        const pp = new PIXI.Point($player.x,$player.y);

        function computePositionFrom(from){
            const tmp = +pp.y;
            pp.y-=40;
            return tmp;
        }
        
        // text total
        const txtt = new PIXI.Text('200',{fill: 0xffffff});
        txtt.anchor.set(0,1);
        txtt.position.y = computePositionFrom();
        // line splitter //data2\Hubs\combats\SOURCE\images\split_line.png
        const ls = new PIXI.Sprite(this.dataBase.textures.split_line);
        ls.anchor.set(0,1);
        ls.position.y = computePositionFrom();
        
        // base atk math
        const bam = {icon:null,txt:null};
        const bamIcon = new PIXI.Sprite($Loader.Data2.hudStats.textures.atk_icon); //TODO: creer spritesheet pour icons algo
        bamIcon.anchor.set(0,1);
        bamIcon.position.y = computePositionFrom();
        // math
        const bamTxt = new PIXI.Text('(15-(def))*(crt*lck)',{fill: 0xffffff,fontSize: 18});
        bamTxt.anchor.set(0,1);
        bamTxt.position.x = 40;
        bamTxt.position.y = bamIcon.position.y;

         // slots math item
        const smi = []
        for (let i=0; i<3; i++) {
            // slots math item icon
            const smiIcon = new PIXI.Sprite($Loader.Data2.hudStats.textures.atk_icon); //TODO: creer spritesheet pour icons algo
            smiIcon.anchor.set(0,1);
            smiIcon.position.y = computePositionFrom();
            // math
            const smiTxt = new PIXI.Text('R50-gRes%',{fill: 0xffffff,fontSize: 18});
            smiTxt.anchor.set(0,1);
            smiTxt.position.x = 40;
            smiTxt.position.y = smiIcon.position.y;
            smi.push(smiIcon,smiTxt);
        };
            
        // dmg statistique box (black)
        const cage_dsb = new PIXI.Container();
        const dsb = new PIXI.Sprite(PIXI.Texture.WHITE); // 10x10 size
        cage_dsb.addChild(dsb,txtt,ls ,bamIcon,bamTxt,...smi);
        dsb.alpha = 0.7;
        dsb.tint = 0x000000;
        dsb.width = cage_dsb.width;
        dsb.height = cage_dsb.height;
        dsb.anchor.set(0,1);

        //end dmg box
        this.sprites.cage_dsb = cage_dsb;
        cage_dsb.parentGroup = $displayGroup.group[3];
        cage_dsb.renderable = false;
    };


    setInteractive(value,runSetup) {
        // combat slots
        this.sprites.cs.forEach(cs => {
            cs.setInteractive(value,runSetup)
        });
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

    show_combatSlots(){
        for (let i=0, l=this.sprites.cs.length; i<l; i++) {
            this.sprites.cs[i].show();
        };
    }

    hide_combatSlots(){
        for (let i=0, l=this.sprites.cs.length; i<l; i++) {
            this.sprites.cs[i].hide();
        };
    };
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
    
    setInteractive(value,runSetup) {
        runSetup && this.setupInteractions();
        this.interactive = value;
    };

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