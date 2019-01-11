// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘
class _huds_combats{
    constructor() {
        this.dataBase = $Loader.Data2.hud_combats;
        this.sprites = {};
        this.intitialize();
        this.setInteractive(true,true);
    };

    intitialize(){
        // combats shadow slot
        const cshadow = new PIXI.Sprite(this.dataBase.textures.combat_shadowSlots); //data2\Hubs\combats\SOURCE\images\combat_shadowSlots.png
        cshadow.anchor.set(0.5,0.5);
        cshadow.parentGroup = $displayGroup.group[1];
        this.sprites.csha = cshadow;

        // combats items slots
        this.sprites.cs = [];
        const pivMatrix = [[-cshadow.width/2,0],[0,-cshadow.height/2],[cshadow.width/2,0]]
        for (let i=0; i<3; i++) {
            const cslots = new combat_slots(this.dataBase.textures.combat_itemSlot); //data2\Hubs\combats\SOURCE\images\combat_itemSlot.png
            cslots.pivot.xx = pivMatrix[i][0];
            cslots.pivot.yy = pivMatrix[i][1];
            this.sprites.cs[i] = cslots;
        };

        // combats arrow
        const carw = new PIXI.Sprite(this.dataBase.textures.combat_arrow); //data2\Hubs\combats\SOURCE\images\combat_shadowSlots.png
        carw.anchor.set(0.5,1);
        carw.scale.set(0.4);
        carw.parentGroup = $displayGroup.group[1];
        this.sprites.carw = carw;

                
        // left black rectangle for show combats magic
        const lRec = new PIXI.Sprite(PIXI.Texture.WHITE); // 10x10 size
        lRec.tint = 0x000000;
        lRec.alpha = 0.75;
        lRec.width = 270;
        lRec.height = $app.renderer.height;
        //lRec.parentGroup = $displayGroup.group[0];
        this.sprites.lRec = lRec;

       // this.createMathDmgBox();
        
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