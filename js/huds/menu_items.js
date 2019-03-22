/*:
// PLUGIN □──────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/


/*
┌------------------------------------------------------------------------------┐
  GLOBAL $huds.menuItems CLASS: _menu_items
  menu pour la gestion et l'attribution des pinGems et des items.
└------------------------------------------------------------------------------┘

// ┌------------------------------------------------------------------------------┐
// Menu Items
// hubsMenue affiche les items et manage le pinBar
// └------------------------------------------------------------------------------┘
pinGems => See Microsoft OneNote.
all      : permet de mettre pinner n'importquel type de items
diceGem  : oubligatoire d 'en agarder un , permet de pinner les diceGem pour naviger dans le jeux
food     : la nourriture permet d'etre mixer a des diceGem pour revigorer la faim, la soif. En combat , elle peut deconcentrer ou empoisoner un monstre
plant    : les plante sont surtout medicinal, elle augment, diminnue et soigne des etas
mineral  : les mineral sont utile pour fabriquer des dices ou augmenter le LV des Tools. Peut egalement service a de la constructions
alchemie : utiliser pour fabriquer des items, booster, keys magic. Peut egalement fabriquer des nouvelle magie
builder  : materieux permetant de fabriquer , des ponts, routes, arme, ... update des batiments..
tools    : outils pour les interaction et les action dans l'environements, certain outils seron limiter par leur nombre
keys     : objet collection unique permetant la progressio ndu storyboard.
*/
//TODO: rendu ici , refaire le sorter et l'integrations des items, stoker a lavance tous les items
class _menu_items extends PIXI.Container {
    constructor() {
        super();
        /** Indicateur active */
        this._isActive = false;
        /** liste des possibiliter pour sort item afficher */
        this.sortList = ["id", "name", "recent", "weigth", "quantity", "value", "rarity","dammage"]; // Liste des sort
        /** Le sort actuel, index de .sortList*/
        this._currentSort = 0;
        /** filtre active pour les items, affiche seulement les items tagger  */
        this._currentFilter = false;
        /** le buffer des slots lorsque show, filtrer par possed a l'ouvertur du menue*/
        this.slotsBuffer = [];

        this.sortBox = null; // ref to sortBox
        this.filtersSlots = []; // Liste des filters et pinGems
       // this.filterTintList = Object.values($items.types).map(obj => obj.tint); // Liste des tints pour les filters et pinGems
        
        this.sortIndexBuffer = [...Array($items.totalGameItems).keys()]; // buffer pour les id slots a sortir
        this.position.set(260, 390);
       
    };
    get slots(){return this.child.cItems.children};
    get filters(){return this.child.cFilters.children};

//#region [rgba(255, 255, 255, 0.07)]
    // add basic proprety
    initialize() {
        this.initialize_sprites();
        this.initialize_Interactions();
    };

    initialize_sprites() {
        const dataBase = $Loader.Data2.menueItems;
        
        //! contour frame du menue.
        const cframe = new PIXI.Container(); //data2\Hubs\menueItems\SOURCE\images\menueItemFrame.png
        cframe.d = new PIXI.Sprite(dataBase.textures.menueItemFrame);
        cframe.n = new PIXI.Sprite(dataBase.textures_n.menueItemFrame_n);
        cframe.d.parentGroup = PIXI.lights.diffuseGroup;
        cframe.n.parentGroup = PIXI.lights.normalGroup;
        cframe.addChild(cframe.d, cframe.n);

        //! container Background
        //data2\Hubs\menueItems\SOURCE\images\bgDiag.png
        const bg = new PIXI.Container();
        bg.d1 = new PIXI.Sprite(dataBase.textures.bgDiag);
        bg.n1 = new PIXI.Sprite(dataBase.textures_n.bgDiag_n);
        bg.d1.parentGroup = PIXI.lights.diffuseGroup;
        bg.n1.parentGroup = PIXI.lights.normalGroup;
        //data2\Hubs\menueItems\SOURCE\images\bgMaster.png
        bg.d2 = new PIXI.Sprite(dataBase.textures.bgMaster);
        bg.d2.parentGroup = PIXI.lights.diffuseGroup;
        bg.d2.position.x = 30;
        bg.d2.scale.x = 1.2;
        bg.addChild(bg.d1,bg.n1,bg.d2);

        //! container Filters et pinColor
        const cFilters = new PIXI.Container();
        Object.keys($items.types).forEach(ftype => { // pour chaque filter type creer un button filter
            const c = new PIXI.Container(); //data2\Hubs\menueItems\SOURCE\images\filters_frame.png
            const d1 = c.d1 = new PIXI.Sprite(dataBase.textures.filters_frame);
            const n1 = c.n1 = new PIXI.Sprite(dataBase.textures_n.filters_frame_n);
            d1.parentGroup = PIXI.lights.diffuseGroup;
            n1.parentGroup = PIXI.lights.normalGroup;
            d1.anchor.set(0.5);
            n1.anchor.set(0.5);
            //data2\Hubs\menueItems\SOURCE\images\filters_button.png
            const d2 = c.d2 = new PIXI.Sprite(dataBase.textures.filters_button);
            const n2 = c.n2 = new PIXI.Sprite(dataBase.textures_n.filters_button_n);
            d2.parentGroup = PIXI.lights.diffuseGroup;
            n2.parentGroup = PIXI.lights.normalGroup;
            d2.anchor.set(0.5);
            n2.anchor.set(0.5);
            d2.tint = $items.types[ftype].tint;
            // text indique le nombre de pinColor
            const style = { fontSize: 18,fill: 0xffffff,strokeThickness: 4,stroke: 0x000000,fontFamily: "ArchitectsDaughter",fontWeight: "bold" };
            const txt_filterName  = c.txt_filterName  = new PIXI.Text(ftype.toUpperCase(),style);
            const txt_pinColorQty = c.txt_pinColorQty = new PIXI.Text('*' + $items.pinColorPossed[ftype],style);
            txt_filterName.anchor.set(0.5);
            txt_pinColorQty.position.set(137/2,-25);
            c.ftype = ftype;
            c.addChild(d1,n1,d2,n2,txt_filterName,txt_pinColorQty);
            cFilters.addChild(c);
        });
        cFilters.position.set(100,50)

        //! sort container
        const cSorter = new PIXI.Container();//data2\Hubs\menueItems\SOURCE\images\buttonFilterBy.png
        cSorter.d = new PIXI.Sprite(dataBase.textures.buttonFilterBy);
        cSorter.n = new PIXI.Sprite(dataBase.textures_n.buttonFilterBy_n);
        cSorter.d.parentGroup = PIXI.lights.diffuseGroup;
        cSorter.n.parentGroup = PIXI.lights.normalGroup;
        cSorter.d.anchor.set(0.5);
        cSorter.n.anchor.set(0.5);
        const style = { fontSize: 16,fill: 0xffffff,strokeThickness: 8,stroke: 0x000000,fontFamily: "ArchitectsDaughter",fontWeight: "bold" };
        cSorter.txt = new PIXI.Text(`Sort By: ${this.sortList[0].toUpperCase()}`,style);
        cSorter.txt.anchor.set(0.5);
        cSorter.addChild(cSorter.d,cSorter.n,cSorter.txt);
        cSorter.position.set(750,10);

        //! container items and  items
        const cItems = new PIXI.Container(); // container qui contiens les frames items
        for (let i = 0, minX=240, minY=70, l = $items.list.length; i < l; i++) { // minX,minY: ces le start line par default
            const iframe = new PIXI.Container();
            iframe.renderable = false;
            iframe._id = i;
            //data2\Hubs\menueItems\SOURCE\images\itemsFrame.png
            iframe.d1 = new PIXI.Sprite(dataBase.textures.itemsFrame);
            iframe.n1 = new PIXI.Sprite(dataBase.textures_n.itemsFrame_n);
            iframe.d1.parentGroup = PIXI.lights.diffuseGroup;
            iframe.n1.parentGroup = PIXI.lights.normalGroup;
            iframe.d1.anchor.set(0.5);
            iframe.n1.anchor.set(0.5);
            //data2\Hubs\menueItems\SOURCE\images\bgTxtFocus.png
            iframe.d2 = new PIXI.Sprite(dataBase.textures.bgTxtFocus);
            iframe.d2.parentGroup = PIXI.lights.diffuseGroup;
            iframe.d2.anchor.set(0,0.5);
            iframe.d2.alpha = 0.5;
             //data2\Objets\gameItems\gameItems.png
            const item = iframe.item = $items.list[i].createSprites(true);
            const style = { fontSize: 16,fill: 0xffffff,strokeThickness: 8,stroke: 0x000000,fontFamily: "ArchitectsDaughter",fontWeight: "bold" };
            iframe.txt = new PIXI.Text(`${item.dataLink.name}\n *${item.dataLink.qty}`, style);
            iframe.txt.position.set(40,-40);
            iframe.position.set(minX,minY);
            iframe.addChild(iframe.d1,iframe.n1,iframe.d2,iframe.txt,item); //FIXME: CREER UN SPRITE ITEMS? voir createSprites
            cItems.addChild(iframe);
        };
        cItems.position.set(10,10);

        // !mask items , les mask doivent etre asigner a chaque sprite parentGroup , mais mauvais performance
        const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
        mask.width  = cframe.width-10-10;
        mask.height = cframe.height-10-10;
        mask.position.set(10,10);
        mask.alpha = 1; //DEBUG HELPER
        bg.d1.mask = mask;
        bg.n1.mask = mask;
        bg.d2.mask = mask;
        cItems.mask = mask;
        this.addChild(mask);
        this.addChild(bg,cItems,cframe,cFilters,cSorter);
        this.child = {bg,cItems,cFilters,cframe,cSorter};
    };
//#endregion

/*#region [rgba(0, 200, 0, 0.04)]
┌------------------------------------------------------------------------------┐
TWEENS EASINGS DISPLACEMENTS mix with spine2D core
https://greensock.com/docs/Core/Animation
└------------------------------------------------------------------------------┘
*/

    show(duration) {
        this._isActive = true;
        this.slotsBuffer = this.updateSlotsFinded();
        $stage.scene.interactiveChildren = false;
        $huds.stamina.setDisable(true); // temp disahble stamina hud

        this.setInteractive(true);
        this.renderable = true;
        this.visible = true;
        this.show_filters();
        this.sortById();
    };

    /** affiche les filters buttons animations */
    show_filters(){
        const filters = this.filters;
        const startX = 0, startY = 0;
        for (let i = 0, x = startX, y = startY, l = filters.length; i < l; i++) {
            const filter = filters[i];
            TweenLite.to(filter, 1 + Math.random(), {
                x: x,
                y: y,
                ease: Power4.easeOut
            });
            y+=filter.height;
        };
    };

    hide(duration) {
        $stage.scene.interactiveChildren = true;
        this._isActive = false;
        $huds.stamina.setDisable(false); // temp disahble stamina hud
        this.renderable = false;
        this.visible = false;
        this.setInteractive(false);
        //$objs.setInteractive(true); // disable objs map interactivity
        //$huds.displacement.setInteractive(true);
    };
    //#endregion

    /*#region [rgba(0, 0, 0, 0.4)]
┌------------------------------------------------------------------------------┐
INTERACTIONs EVENTS LISTENERS
pointerIN, pointerOUT, pointerUP
└------------------------------------------------------------------------------┘
*/  
    /** initialisation setup des element interactif */
    initialize_Interactions(destroy) {
        // slots
        this.slots.forEach( slot => {
            slot.on('pointerover' , this.pIN_iSlots ,this);
            slot.on('pointerout'  , this.pOUT_iSlots,this);
            slot.on('pointerup'   , this.pUP_iSlots ,this);
        });
        // filters
        this.child.cFilters.children.forEach(filter => {
           filter.on('pointerover' , this.pIN_filter  , this);
           filter.on('pointerout'  , this.pOUT_filter , this);
           filter.on('pointerup'   , this.pUP_filter  , this);
        });
        // sortBox
        this.child.cSorter.on('pointerover', this.pIN_sorter , this);
        this.child.cSorter.on('pointerout' , this.pOUT_sorter, this);
        this.child.cSorter.on('pointerup'  , this.pUP_sorter , this);
    };

    /** activation/desactivation des elements interactif */
    setInteractive(value) {
        // Slots items
        this.slotsBuffer.forEach(s => {
            s.interactive = value;
        });
        // Slots items
        this.child.cFilters.children.forEach(f => {
            f.interactive = value;
        });
        this.child.cSorter.interactive = true;
    };

    pIN_iSlots(e) {
        const ee = e.currentTarget;
        ee.d1.blendMode = 1;
        ee.n1.blendMode = 1;
        const rot = 0.15;
        ee.d1.rotation = -rot;
        ee.n1.rotation = rot;
        TweenMax.to(ee.d1, 2, {
            rotation: rot,
            ease: Power1.easeInOut,
            repeat: -1,
            yoyoEase: true
        });
        TweenMax.to(ee.n1, 2, {
            rotation: -rot,
            ease: Power1.easeInOut,
            repeat: -1,
            yoyoEase: true
        });
        TweenLite.to(ee.d1  .scale, 0.8, {x: 1.5,y: 1.5,ease: Expo.easeOut});
        TweenLite.to(ee.n1  .scale, 0.8, {x: 1.1,y: 1.1,ease: Expo.easeOut});
        TweenLite.to(ee.item.scale, 1.4, {x: 1.2,y: 1.2,ease: Expo.easeOut});
        TweenLite.to(ee.txt .scale, 1.2, {x: 1.2,y: 1.2,ease: Expo.easeOut});
    };

    pOUT_iSlots(e) {
        const ee = e.currentTarget;
        ee.d1.blendMode = 0;
        ee.n1.blendMode = 0;
        TweenLite.killTweensOf(ee.d1);
        TweenLite.killTweensOf(ee.n1);
        TweenLite.to([ee.d1,ee.n1], 0.2, {rotation: 0,ease: Expo.easeOut});
        TweenLite.to([ee.d1.scale,ee.n1.scale], 0.4, {x: 1,y: 1,ease: Elastic.easeOut.config(0.9, 0.75)  });
        TweenLite.to(ee.item.scale, 0.8, {x: 1,y: 1, ease: Elastic.easeOut.config(1, 0.75) });
        TweenLite.to(ee.txt .scale, 1  , {x: 1,y: 1, ease: Elastic.easeOut.config(1, 0.75) });
    };

    pUP_iSlots(e) {
        const ee = e.currentTarget;
        //$mouse.holdingItem = ee._id; // setter
        $mouse.setItemId(ee._id);
   
    };

    pIN_sorter(e) {
        const ee = e.currentTarget;
        TweenLite.to(ee.scale, 1, {x: 1,y: 1,ease: Elastic.easeOut.config(1, 0.75) });
    };
    pOUT_sorter(e) {
        const ee = e.currentTarget;
        TweenLite.to(ee.scale, 1, {x: 0.9,y: 0.9,ease: Elastic.easeOut.config(1, 0.75) });
    };

    pUP_sorter(e) {
        const ee = e.currentTarget;
        const value = (e.data.button === 0) && 1 || -1; // clickL +1 | clickR -1
        const length = this.sortList.length-1;
        const next = this._currentSort+value;
        (next>length)? this._currentSort = 0 : (next<0)? this._currentSort = length : this._currentSort+=value;

        TweenLite.to(ee.scale, 0.1, {x: 1.15,y: 1.05,ease: Power4.easeOut});
        TweenLite.to(ee.scale, 0.4, {x: 1,y: 1,ease: Power4.easeOut,delay: 0.1});
        // update sort text
        ee.txt.text = `Sort By: ${this.sortList[this._currentSort].toUpperCase()}`;
        switch (this.sortList[this._currentSort]) {
            case 'id'       : this.sortById();   break;
            case 'name'     : this.sortByName(); break;
            case 'recent'   :                    break;
            case 'weigth'   :  this.sortByWeigth(); break;
            case 'quantity' : this.sortByQTY();  break;
            case 'value'    : this.sortByValue(); break;
            case 'rarity'   :                    break;
            case 'dammage'   :this.sortByDMG();break;
        };
    };

    pIN_filter(e) {
        const ee = e.currentTarget;
        ee.d1.blendMode = 1;
        ee.n1.blendMode = 2;
        ee.n2.blendMode = 1;
        ee._filters = [new PIXI.filters.OutlineFilter(2, 0x000000, 1)]; // TODO:  make a filters managers cache
        TweenLite.to([ee.d1.scale], 0.3, {x: 1.1,y: 1.2,ease: Expo.easeOut});
        TweenLite.to([ee.d2.scale,ee.n2.scale], 0.3, {x: 1.1,y: 1.2,ease: Expo.easeOut});
        TweenLite.to(ee.d1.position, 0.4, {x: 80,ease: Expo.easeOut});
        TweenLite.to(ee.txt_filterName.scale, 1, {x: 1.2,y: 1.2,ease: Elastic.easeOut.config(1.2, 0.4) });
        TweenLite.to(ee.txt_pinColorQty.scale, 0.2, {x: 1.2,y: 1.2,ease: Expo.easeOut});
        TweenLite.to(ee.txt_pinColorQty, 0.2, {alpha: 1,ease: Expo.easeOut});
    };

    pOUT_filter(e) {
        const ee = e.currentTarget;
        ee.d1.blendMode = 0;
        ee.n1.blendMode = 0;
        ee.n2.blendMode = 0;
        ee._filters = null;
        TweenLite.to([ee.d1.scale], 0.3, {x: 1,y: 1,ease: Expo.easeOut});
        TweenLite.to([ee.d2.scale,ee.n2.scale], 0.3, {x: 1,y: 1,ease: Expo.easeOut});
        TweenLite.to(ee.d1.position, 0.2, {x: 0,ease: Expo.easeOut});
        TweenLite.to(ee.txt_filterName.scale, 0.6, {x: 1,y: 1,ease: Elastic.easeOut.config(2, 0.95)});
        TweenLite.to(ee.txt_pinColorQty.scale, 0.2, {x: 1,y: 1,ease: Expo.easeOut});
        TweenLite.to(ee.txt_pinColorQty, 0.2, {alpha: 0.5,ease: Expo.easeOut});
    };

    // filtrer les items selon le pinGem choisi "all" == no filter
    pUP_filter(e) {
        const ee = e.currentTarget;
        if (e.data.button === 0) { // clickLeft_ <==
            this.setFilterTo(ee.ftype)
            this.refreshItemsGrid();
        } else
        if (e.data.button === 2) { // _clickRight ==>
            // prendre le pinGem pour le palcer dans un slot
        } else
        if (e.data.button === 1) { // click_Middle =>|<=

        }
    };
    //#endregion
    /** obtier les slots seulement deja trouver */
    updateSlotsFinded(){
        return this.slots.filter( (s,i)=> {
            if($items.itemPossed.hasOwnProperty(i)){
                return s.renderable = true
            }
        } ); 
    };

    /** defenie un nouveau filtre et applique sur le slotsBuffer */
    setFilterTo(filter){
        if(this._currentFilter === filter){return false};
        this._currentFilter = filter;
        this.slotsBuffer.forEach(slot => {
            const type = slot.item.dataLink._iType;
            (filter=== 'all' || type === filter) ? slot.renderable = true : slot.renderable = false;
        });
    }


    // positionne les items et les sort
    refreshItemsGrid() {
        const startX = 290, startY = 90;
        const margeX = 260;
        const margeY = 100;
        const slots = this.slotsBuffer;
        for (let i = 0, xx = startX, yy = startY, ii = 0, l = slots.length; i < l; i++) {
            const slot = slots[i];
            if(slot.renderable){ // renderable defeni par button filters
                TweenLite.to(slot, 1 + Math.random(), {x: xx,y: yy,ease: Power4.easeOut });
                ii++ === 4 ? (xx = startX, yy += margeY, ii = 0) : xx += margeX;
            };

        };
    };

    // positionner les items et les sort
    // $huds.menuItems.sortById()
    sortById() {
        this.slotsBuffer.sort(function (a, b) {
            return a._id - b._id;
        });
        this.refreshItemsGrid();
    };
    // $huds.menuItems.sortByName()
    sortByName() {
        this.slotsBuffer.sort(function (a, b) {
            return ('' + a.item.dataLink._idn).localeCompare(b.item.dataLink._idn)
        });
        this.refreshItemsGrid();
    };
    sortByQTY() {
        this.slotsBuffer.sort(function (a, b) {
            return b.item.dataLink.qty - a.item.dataLink.qty;
        });
        this.refreshItemsGrid();
    };
    /** sort selon leur valeur marchande */
    sortByValue() {
        this.slotsBuffer.sort(function (a, b) {
            return b.item.dataLink.value - a.item.dataLink.value;
        });
        this.refreshItemsGrid();
    };
    /** sort selon le poid des items */
    sortByWeigth() {
        this.slotsBuffer.sort(function (a, b) {
            return b.item.dataLink.weight - a.item.dataLink.weight;
        });
        this.refreshItemsGrid();
    };
    /** sort selon les dammage minimal de l'item */
    sortByDMG() {
        this.slotsBuffer.sort(function (a, b) {
            const aa = a.item.dataLink._dmg;
            const bb = b.item.dataLink._dmg;
            const minA = Array.isArray(aa) ? Math.min(...aa) : aa;
            const minB = Array.isArray(bb) ? Math.min(...bb) : bb;
            return minB - minA;
        });
        this.refreshItemsGrid();
    };

}; // END CLASS