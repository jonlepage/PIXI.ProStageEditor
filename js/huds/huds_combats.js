// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘
class _huds_combats{
    constructor() {
        this.dataBase = $Loader.Data2.hud_combats;
        this.sprites = {};
        this.intitialize();
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
            const cslots = new PIXI.Sprite(this.dataBase.textures.combat_itemSlot); //data2\Hubs\combats\SOURCE\images\combat_itemSlot.png
            cslots.anchor.set(0.5,0.5);
            cslots.scale.set(0.5,0.5);
            cslots.pivot.set(pivMatrix[i][0],pivMatrix[i][1]);
            cslots.parentGroup = $displayGroup.group[3];
            this.sprites.cs[i] = cslots;
        };

        // combats arrow
        const carw = new PIXI.Sprite(this.dataBase.textures.combat_arrow); //data2\Hubs\combats\SOURCE\images\combat_shadowSlots.png
        carw.anchor.set(0.5,1);
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
     
    }

};

