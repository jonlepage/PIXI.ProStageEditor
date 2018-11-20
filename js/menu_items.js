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
class _menu_items extends PIXI.Container {
    constructor() {
        super();
        this.sortList = ["id", "name", "recent", "weigth", "quantity", "value", "rarity"]; // Liste des sort
        this._currentSort = 0; // Le sort Actif
        this.sortBox = null; // ref to sortBox
        this.filtersSlots = []; // Liste des filters et pinGems
        this.filterTintList = Object.values($items.types).map(obj => obj.tint); // Liste des tints pour les filters et pinGems
        this._currentFilter = false; // Le filtre Actif False:='all'
        this.slots = []; // sortable buffer for items slots
        this.sortIndexBuffer = [...Array($items.totalGameItems).keys()]; // buffer pour les id slots a sortir
        this.position.set(1050, 680);
        this.parentGroup = $displayGroup.group[4];
        this.renderable = false;
        this.initialize();
    };
//#region [rgba(255, 255, 255, 0.07)]
    // add basic proprety
    initialize() {
        this.setupSprites();
        this.setupTweens();
        this.setupInteractions();
    };

    setupSprites() {
        const dataBase = $Loader.Data2.menueItems;
        // url("data2/Hubs/menueItems/SOURCE/images/menueItemFrame.png"); 
        //contour frame du menue.
        const frames = new PIXI.Container();
        const frames_d = new PIXI.Sprite(dataBase.textures.menueItemFrame);
        const frames_n = new PIXI.Sprite(dataBase.textures_n.menueItemFrame_n);
        frames_d.parentGroup = PIXI.lights.diffuseGroup;
        frames_n.parentGroup = PIXI.lights.normalGroup;
        frames.addChild(frames_d, frames_n);

        //MASK Master Container D,N for all masked elements
        let w = frames_d.width,
            h = frames_d.height;
        const masked_d = new PIXI.Container(); // difuse menu mask limit 
        const masked_n = new PIXI.Container(); // normal menu mask limit
        const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
        masked_d.parentGroup = PIXI.lights.diffuseGroup;
        masked_n.parentGroup = PIXI.lights.normalGroup;
        mask.width = w - 42;
        mask.height = h - 45;
        
        mask.position.set(15, 20);
        masked_d.mask = mask;
        masked_n.mask = mask;

        //Backgrouds.
        //url("data2/Hubs/menueItems/SOURCE/images/bgMaster.png"); 
        const bg1_d = new PIXI.Sprite(dataBase.textures.bgMaster);
        const bg1_n = new PIXI.Sprite(dataBase.textures_n.bgMaster_n);
        //url("data2/Hubs/menueItems/SOURCE/images/bgDiag.png");
        const bg2_d = new PIXI.Sprite(dataBase.textures.bgDiag);
        const bg2_n = new PIXI.Sprite(dataBase.textures_n.bgDiag_n);
        bg2_d.alpha = 0.2;
        bg2_n.alpha = 0.8;
        masked_d.addChild(bg1_d, bg2_d);
        masked_n.addChild(bg1_n, bg2_n);
        this.backgrounds = {
            bg1: {
                d: bg1_d,
                n: bg1_n
            },
            bg2: {
                d: bg2_d,
                n: bg2_n
            },
        };

        //filters pinGems. note: not in mask
        const filterList = Object.keys($items.types);

        function setPivotCenter(d, n) {
            d && d.pivot.set(d.width / 2, d.height / 2);
            n && n.pivot.set(d.width / 2, d.height / 2)
        };
        for (let i = 0, x = 100, y = 55, l = filterList.length; i < l; i++, y += 48) {
            const type = filterList[i];
            const cage = new PIXI.Container();
            //url("data2/Hubs/menueItems/SOURCE/images/filters_frame.png");
            const fFrame_d = new PIXI.Sprite(dataBase.textures.filters_frame);
            const fFrame_n = new PIXI.Sprite(dataBase.textures_n.filters_frame_n);
            setPivotCenter(fFrame_d, fFrame_n);
            fFrame_d.parentGroup = PIXI.lights.diffuseGroup;
            fFrame_n.parentGroup = PIXI.lights.normalGroup;

            // Colored Gem inside frame
            //url("data2/Hubs/menueItems/SOURCE/images/filters_button.png"); 
            const fGem_d = new PIXI.Sprite(dataBase.textures.filters_button);
            const fGem_n = new PIXI.Sprite(dataBase.textures_n.filters_button_n);
            setPivotCenter(fGem_d, fGem_n);
            fGem_d.parentGroup = PIXI.lights.diffuseGroup;
            fGem_n.parentGroup = PIXI.lights.normalGroup;
            fGem_d.tint = $items.types[type].tint;

            // gem text gem txt quantity
            const fText = new PIXI.Text(type.toUpperCase(), {
                fontSize: 18,
                fill: 0xffffff,
                strokeThickness: 4,
                stroke: 0x000000,
                fontFamily: "ArchitectsDaughter",
                fontWeight: "bold"
            });
            setPivotCenter(fText);
            const fQTY = new PIXI.Text('*' + $items.pinGemsPossed[type], {
                fontSize: 18,
                fill: 0xffffff,
                strokeThickness: 4,
                stroke: 0x000000,
                fontFamily: "ArchitectsDaughter",
                fontWeight: "bold"
            });
            setPivotCenter(fQTY);
            fQTY.position.set(fFrame_d.pivot.x, 0)

            cage.addChild(fFrame_d, fFrame_n, fGem_d, fGem_n, fText, fQTY);
            cage.position.set(x, y);
            //references
            this.filtersSlots[i] = cage;
            cage.fFrame = {
                d: fFrame_d,
                n: fFrame_n
            };
            cage.fGem = {
                d: fGem_d,
                n: fGem_n
            };
            cage.fText = fText;
            cage.fQTY = fQTY;
            cage.fType = type;
        };

        //sorters sortBox, not in mask
        //url("data2/Hubs/menueItems/SOURCE/images/buttonFilterBy.png");
        const sortCage = new PIXI.Container();
        const sort_d = new PIXI.Sprite(dataBase.textures.buttonFilterBy);
        const sort_n = new PIXI.Sprite(dataBase.textures_n.buttonFilterBy_n);
        sort_d.parentGroup = PIXI.lights.diffuseGroup;
        sort_n.parentGroup = PIXI.lights.normalGroup;
        setPivotCenter(sort_d, sort_n);
        // sort text
        const sortTxt = new PIXI.Text(`Sort By: ${this.sortList[0].toUpperCase()}`, {
            fontSize: 18,
            fill: 0xffffff,
            strokeThickness: 2,
            stroke: 0x000000,
            fontFamily: "ArchitectsDaughter",
            fontWeight: "bold"
        });
        setPivotCenter(sortTxt);
        sortCage.addChild(sort_d, sort_n, sortTxt);
        sortCage.position.set(800, 20);
        sortCage.sortTxt = sortTxt;
        this.sortBox = sortCage;

        //slots and items
        for (let i = 0, l = $items.totalGameItems; i < l; i++) {
            // items frames containers
            //url("data2/Hubs/menueItems/SOURCE/images/itemsFrame.png");

            const itemsFrame_d = new PIXI.Sprite(dataBase.textures.itemsFrame);
            const itemsFrame_n = new PIXI.Sprite(dataBase.textures_n.itemsFrame_n);
            setPivotCenter(itemsFrame_d, itemsFrame_n);

            // items buffers
            //url("data2/Objets/gameItems/gameItems.png");
            const dataBase_items = $Loader.Data2.gameItems;
            const items_d = new PIXI.Sprite(dataBase_items.textures[i]);
            const items_n = new PIXI.Sprite(dataBase_items.textures_n[i + 'n']);
            setPivotCenter(items_d, items_n);

            // FX for background text
            //url("data2/Hubs/menueItems/SOURCE/images/bgTxtFocus.png");
            const txtFx_d = new PIXI.Sprite(dataBase.textures.bgTxtFocus);
            const txtFx_n = new PIXI.Sprite(dataBase.textures_n.bgTxtFocus_n);
            txtFx_d.blendMode = 1;
            txtFx_n.blendMode = 2;
            txtFx_d.alpha = 0.3;
            txtFx_d.pivot.set(40);
            txtFx_n.pivot.set(40);

            // add text item informations TODO: 
            const itemTxt = new PIXI.Text(`${$items.list[i]._name}\n *:6(2)\n [12]`, //TODO:
                {
                    fontSize: 16,
                    fill: 0x000000,
                    strokeThickness: 2,
                    stroke: 0xffffff,
                    fontFamily: "ArchitectsDaughter",
                    letterSpacing: -1,
                    fontWeight: "bold",
                    lineHeight: 20
                });
            itemTxt.pivot.set(-40, 35);
            // create reference controler
            this.slots[i] = {
                itemsFrame: {
                    d: itemsFrame_d,
                    n: itemsFrame_n
                },
                items: {
                    d: items_d,
                    n: items_n
                },
                txtFx: {
                    d: txtFx_d,
                    n: txtFx_n
                },
                itemTxt: itemTxt,
            };
            Object.defineProperties(this.slots[i], {
                "setRenderable": { // hide from filters
                    set: function (b) {
                        for (const key in this) {
                            const ref = this[key];
                            ref.d ? (ref.d.renderable = b, ref.n.renderable = b) : ref.renderable = b;
                        };
                        this.renderStatus = b;
                    },
                    enumerable: false,
                },
                // cache information
                _id: {value: i},
                renderStatus: {value: true, writable: true},
                name: {value: $items.getNames(i)},
                type: {value: $items.getTypes(i)},
            });
            masked_d.addChild(txtFx_d, itemsFrame_d, items_d, itemTxt);
            masked_n.addChild(txtFx_n, itemsFrame_n, items_n);
        };

        this.addChild(mask, masked_d, masked_n, frames, ...this.filtersSlots, sortCage);
        this.pivot.set(frames.width / 2, frames.height / 2);
    };
//#endregion

/*#region [rgba(0, 200, 0, 0.04)]
┌------------------------------------------------------------------------------┐
TWEENS EASINGS DISPLACEMENTS mix with spine2D core
https://greensock.com/docs/Core/Animation
└------------------------------------------------------------------------------┘
*/
    // setup and cache all thning need for easing tweens
    setupTweens() {
        this.tweens = {
            Elastic1: Elastic.easeOut.config(0.5, 1),
            Elastic2: Elastic.easeInOut.config(0.5, 1),
        };
    };

    show(duration) {
        this.renderable = true;
        this.visible = true;
        this.sortById();
    };

    hide(duration) {
        this.renderable = false;
        this.visible = false;
    };
    //#endregion

    /*#region [rgba(0, 0, 0, 0.4)]
┌------------------------------------------------------------------------------┐
INTERACTIONs EVENTS LISTENERS
pointerIN, pointerOUT, pointerUP
└------------------------------------------------------------------------------┘
*/
    setupInteractions() {
        this.filtersSlots.forEach(filterGem => {
            filterGem.interactive = true;
            filterGem.on('pointerover', this.IN_filterGem, this);
            filterGem.on('pointerout', this.OUT_filterGem, this);
            filterGem.on('pointerup', this.UP_filterGem, this);
        });
        this.slots.forEach(slot => {
            slot.itemsFrame.d.interactive = true;
            slot.itemsFrame.d.on('pointerover', this.IN_itemSlot, slot);
            slot.itemsFrame.d.on('pointerout', this.OUT_itemSlot, slot);
            slot.itemsFrame.d.on('pointerup', this.UP_itemSlot, slot);
        });
        this.sortBox.interactive = true;
        this.sortBox.on('pointerover', this.IN_sortBox, this);
        this.sortBox.on('pointerout', this.OUT_sortBox, this);
        this.sortBox.on('pointerup', this.UP_sortBox, this);
    };

    IN_itemSlot(e) {
        this.itemsFrame.d.displayOrder = 9999999;
        const itemsFrame = this.itemsFrame;
        const items = this.items;
        const itemTxt = this.itemTxt;
        const txtFx = this.txtFx;
        itemsFrame.d.blendMode = 1;
        itemsFrame.n.blendMode = 1;

        const rot = 0.15;
        itemsFrame.d.rotation = -rot;
        itemsFrame.n.rotation = rot;
        TweenLite.killTweensOf(itemsFrame.d);
        TweenLite.killTweensOf(itemsFrame.n);
        TweenMax.to(itemsFrame.d, 2, {
            rotation: rot,
            ease: Power1.easeInOut,
            repeat: -1,
            yoyoEase: true
        });
        TweenMax.to(itemsFrame.n, 2, {
            rotation: -rot,
            ease: Power1.easeInOut,
            repeat: -1,
            yoyoEase: true
        });
        TweenLite.to(itemsFrame.d.scale, 0.8, {
            x: 1.5,
            y: 1.5,
            ease: Expo.easeOut
        });
        TweenLite.to(itemsFrame.n.scale, 0.8, {
            x: 1.1,
            y: 1.1,
            ease: Expo.easeOut
        });
        TweenLite.to([items.d.scale, items.n.scale], 0.8, {
            x: 1.2,
            y: 1.2,
            ease: Expo.easeOut
        });
        TweenLite.to(itemTxt.scale, 2, {
            x: 1.2,
            y: 1.2,
            ease: Expo.easeOut
        });
    };

    OUT_itemSlot(e) {
        const itemsFrame = this.itemsFrame;
        const items = this.items;
        const itemTxt = this.itemTxt;
        const txtFx = this.txtFx;
        itemsFrame.d.blendMode = 0;
        itemsFrame.n.blendMode = 0;

        TweenLite.to([itemsFrame.d, itemsFrame.n], 0.9, {
            rotation: 0,
            ease: Expo.easeOut
        });
        TweenLite.to(itemsFrame.d.scale, 0.8, {
            x: 1,
            y: 1,
            ease: Expo.easeOut
        });
        TweenLite.to(itemsFrame.n.scale, 0.8, {
            x: 1,
            y: 1,
            ease: Expo.easeOut
        });
        TweenLite.to([items.d.scale, items.n.scale], 0.8, {
            x: 1,
            y: 1,
            ease: Expo.easeOut
        });
        TweenLite.to(itemTxt.scale, 1, {
            x: 1,
            y: 1,
            ease: Expo.easeOut
        });
    };

    UP_itemSlot(e) {
        $mouse.holdingItem = this._id; // setter
        const newItem = $mouse.holdingItem;
        newItem.scale.set(0.1);
        newItem.rotation = (Math.PI/2)+Math.random();
        TweenLite.to(newItem.scale, 2, {
            x: 1,
            y: 1,
            ease: Elastic.easeOut.config(1.2, 0.4)
        });
        TweenLite.to(newItem, 3, { 
            rotation: 0,
            ease: Elastic.easeOut.config(1.2, 0.4)
        });
    };

    IN_sortBox(e) {
        const sortBox = e.currentTarget;
        TweenLite.to(sortBox.scale, 1, {
            x: 1,
            y: 1,
            ease: this.tweens.Elastic1
        });
    };
    OUT_sortBox(e) {
        const sortBox = e.currentTarget;
        TweenLite.to(sortBox.scale, 1, {
            x: 0.9,
            y: 0.9,
            ease: this.tweens.Elastic1
        });
    };

    UP_sortBox(e) {
        const sortBox = e.currentTarget;
        this.nextSortValue(e.data.button && -1 || 1);
        TweenLite.to(sortBox.scale, 0.1, {
            x: 1.15,
            y: 1.05,
            ease: Power4.easeOut
        });
        TweenLite.to(sortBox.scale, 0.4, {
            x: 1,
            y: 1,
            ease: Power4.easeOut,
            delay: 0.1
        });

        sortBox.sortTxt.text = `Sort By: ${this.sortList[this._currentSort].toUpperCase()}`;
        sortBox.sortTxt.pivot.x = sortBox.sortTxt.width / 2;
        if (this._currentSort === 0) {
            this.sortById();
        } else {
            this.sortByName();
        }
    };

    IN_filterGem(e) {
        const pinGem = e.currentTarget;
        const fFrame = pinGem.fFrame;
        const fGem = pinGem.fGem;
        const fText = pinGem.fText;
        const fQTY = pinGem.fQTY;

        fFrame.d.blendMode = 1;
        fFrame.n.blendMode = 2;
        fFrame._filters = [new PIXI.filters.OutlineFilter(2, 0x000000, 1)]; // TODO:  make a filters managers cache
        TweenLite.to(fFrame.d.scale, 0.5, {
            x: 1.2,
            y: 1.2,
            ease: Expo.easeOut
        });
        TweenLite.to(fFrame.n.position, 0.2, {
            x: 85,
            ease: Expo.easeOut
        });
        TweenLite.to([fGem.d.scale, fGem.n.scale], 0.6, {
            x: 1.2,
            y: 1.15,
            ease: Expo.easeInOut
        });
        TweenLite.to(fText.scale, 3, {
            x: 1.2,
            y: 1.2,
            ease: Expo.easeOut
        });
        TweenLite.to(fQTY.position, 0.5, {
            x: fFrame.d.pivot.x + 40,
            ease: Expo.easeOut
        });
        TweenLite.to(fQTY.scale, 0.5, {
            x: 1.2,
            y: 1.2,
            ease: Expo.easeOut
        });
    };

    OUT_filterGem(e) {
        const pinGem = e.currentTarget;
        const fFrame = pinGem.fFrame;
        const fGem = pinGem.fGem;
        const fText = pinGem.fText;
        const fQTY = pinGem.fQTY;

        fFrame.d.blendMode = 0;
        fFrame._filters = [new PIXI.filters.OutlineFilter(2, 0x000000, 1)]; // TODO:  make a filters managers cache
        TweenLite.to(fFrame.d.scale, 1, {
            x: 1,
            y: 1,
            ease: Expo.easeOut
        });
        TweenLite.to(fFrame.n.position, 1, {
            x: 0,
            ease: Expo.easeOut
        });
        TweenLite.to([fGem.d.scale, fGem.n.scale], 0.5, {
            x: 1,
            y: 1,
            ease: Expo.easeOut
        });
        TweenLite.to(fText.scale, 1, {
            x: 1,
            y: 1,
            ease: Expo.easeOut
        });
        TweenLite.to(fQTY.position, 0.5, {
            x: fFrame.d.pivot.x,
            ease: Expo.easeOut
        });
        TweenLite.to(fQTY.scale, 0.5, {
            x: 1,
            y: 1,
            ease: Expo.easeOut
        });
    };

    // filtrer les items selon le pinGem choisi "all" == no filter
    UP_filterGem(e) {
        const filterGem = e.currentTarget;
        if (e.data.button === 0) { // clickLeft_ <==
            const newFilter = filterGem.fType !== "all" && filterGem.fType || false;
            this._currentFilter = newFilter;
            this.refreshItemsGrid();
        } else
        if (e.data.button === 2) { // _clickRight ==>
            // prendre le pinGem pour le palcer dans un slot
        } else
        if (e.data.button === 1) { // click_Middle =>|<=

        }
    };
    //#endregion



    // positionne les items et les sort
    refreshItemsGrid() {
        const x = 300,
            y = 110;
        const margeX = 240;
        const margeY = 100;
        console.log('this.slots.: ', this.slots);
        for (let i = 0, xx = x, yy = y, ii = 0, l = this.slots.length; i < l; i++) {
            
            const slot = this.slots[i];
            /*if(![1,5,6,8,7,12,24,56].contains(slot.id)){ //TODO: ajouter le system items pour players
                slot.renderables = false;
                continue;
            };*/
            if (this._currentFilter && this._currentFilter !== slot.type) {
                slot.setRenderable = false;
                continue;
            };
            !slot.renderStatus && (slot.setRenderable = true);
            const itemsFrame = slot.itemsFrame;
            const items = slot.items;
            const itemTxt = slot.itemTxt;
            const txtFx = slot.txtFx;
            TweenLite.to([itemsFrame.d.position, itemsFrame.n.position], 1 + Math.random(), {
                x: xx,
                y: yy,
                ease: Power4.easeOut
            });
            TweenLite.to([items.d.position, items.n.position], 1 + Math.random(), {
                x: xx,
                y: yy,
                ease: Power4.easeOut
            });
            TweenLite.to([txtFx.d.position, txtFx.n.position], 1 + Math.random(), {
                x: xx,
                y: yy,
                ease: Power4.easeOut
            });
            TweenLite.to(itemTxt.position, 1 + Math.random(), {
                x: xx,
                y: yy,
                ease: Power4.easeOut
            });
            ii++ === 4 ? (xx = x, yy += margeY, ii = 0) : xx += margeX;
        };
    };

    // positionner les items et les sort
    // $huds.menuItems.sortById()
    sortById() {
        this.slots.sort(function (a, b) {
            return a._id - b._id;
        });
        this.refreshItemsGrid();
    };
    // $huds.menuItems.sortByName()
    sortByName() {
        this.slots.sort(function (a, b) {
            return ('' + a.name).localeCompare(b.name)
        });
        this.refreshItemsGrid();
    };

    // change sorting value
    nextSortValue(value = 1) {
        const nextValue = this._currentSort + value;
        if (nextValue > this.sortList.length - 1) {
            this._currentSort = 0
        } else if (nextValue < 0) {
            this._currentSort = this.sortList.length - 1
        } else {
            this._currentSort += value
        };
    };

    // temp test , interaction mouse du menu
    makeInteractiveFX() {

        /*//TODO: DELETE ME 
        setInterval((function(){ 
            this.bgFX1.d.position.set(-($mouse.x/5)+100,($mouse.y/50));
            this.bgFX1.d.scale.x = 1+($mouse.x/10000);
            this.bgFX2.d.position.set((($mouse.x/100)-40)*-1,(($mouse.y/45)));
        }).bind(this), 20);
         //TODO: DELETE ME
        function testingwheel(e) {
            itemsFrames.forEach(item => {
                const yy = item.d.position.y+e.deltaY;
                const speed = ~~((Math.random() * 10) + 1)/100;
                TweenLite.to(item.d.position, 1+speed, {y:yy, ease:Power4.easeOut});
                TweenLite.to(item.n.position, 1+speed, {y:yy, ease:Power4.easeOut});
            });
            bgTxtFocus.forEach(item => {
                const yy = item.d.position.y+e.deltaY;
                TweenLite.to(item.d.position, 1.5, {y:yy, ease:Power4.easeOut});
                TweenLite.to(item.n.position, 1.2, {y:yy, ease:Power4.easeOut});
            });
        }
        document.addEventListener('wheel', testingwheel.bind(this));*/

    };

}; // END CLASS