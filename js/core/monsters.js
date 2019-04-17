// ┌-----------------------------------------------------------------------------┐
// GLOBAL $dataMonsters: _dataMonsters
// manage data when creat new monster or load csv
//└------------------------------------------------------------------------------┘

/** data randomizer helper, permet d'obtenir des comportement aleatoir baser une base */
class _dataMonsters {
    /**return formula state from level*/
    static formula_ST(evo,st) {
        return evo[st].b*(1+(this._lv-1) * db.evo.hp.r) + (db.evo.hp.f*(this._lv-1))
    };

    constructor() {
        // base for monster
        this.data = [
            { //data2\Characteres\monster\m0\m0.png
                _id: 0,
                evo: {}, //! from initialise
                master: {chance:2,rate:20}, // ! A 2%chance detre master, Les Master augment tous de 20%
                type: { // chance heritage typeOrbs 
                    'green': 100,
                    'red': 40,
                    'red': 40,
                },// TODO: Do it with excel dataManager see loader
                
                capacity: { // les capaciter possible en heritage  TODO: fair une class dataCapacity
                    'headTackle': { r: 90, lv: 4 }, // rate 90% heriter headTackle si >lv 4
                },
                items: { // les items possible en heritage
                    1: { r: 20, q: 3 }, // rate 20% chance d'ehriter quantity items x3
                    32: { r: 40, q: 1 }, // 40% chance d'ehriter quantity items x1
                },
                gemImunity:{ // imunity gem id [min,max], reduit de % le resulta du dice
                    1:[5 ,10], //data2\Objets\gameItems\SOURCE\images\1.png
                    2:[30,40], //data2\Objets\gameItems\SOURCE\images\2.png
                },
                statesImunity:{ // chande detre imuniser contre des states
                    'poison':80, //data2/System/states/SOURCE/images/st_poison.png
                },
                feeding:{// aime entre 10 et 25%, ces le % d'apresiation. les chance de manger la nouriture au debut turn. Influ egalement par la faim
                    112: [10 ,25], //data2\Objets\gameItems\SOURCE\png\112.png
                }
            },
        ];
    };

    /** initialize data from boot when excel CSV ready, appliquer sur tous les monster*/
    initialize(){
        const DATA = $Loader.CSV.dataBase_monster.data;
        for (let i=0, l=this.data.length; i<l; i++) {
            const e = this.data[i];
            const evo = DATA[i+1]; // evolution base:rate:flat
            let ii = 1;
            e.evo = {// base:rate:flat from intialize CSV
                hp  : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_hp.png
                mp  : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_mp.png
                hg  : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_hg.png
                hy  : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_hy.png
                atk : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_atk.png
                def : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_def.png
                sta : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_sta.png
                lck : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_lck.png
                int : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_int.png
                exp : { b: evo[ii++ ], r: evo[ii++ ], f: evo[ii++] }, //data2\Icons\statsIcons\SOURCE\images\sIcon_exp.png
            }
        };
    };

    /**generation dune data list de monstre asigner a une case 
     * @argument mapInfluence passer des stats d'influence pour generer les data attache a la case monster
    */
    static getRanDataMonsterList(mapInfluence) {
        const monstersData = []; // a attachera une case, strigniflyable
        if (!mapInfluence) { //TODO:
            const mIdList = [0, 0, 0, 0]; // monster list by id allowed
            const mNb = ~~(Math.random() * 3) + 1; // nombre de monstre max
            for (let i = 0, l = mNb; i < l; i++) {
                const id = mIdList[~~(Math.random() * mIdList.length)];
                const lv = Math.randomFrom(1,4);//TODO:
                monstersData.push({ id, lv, master:false });  //TODO: MASTER: monstre speciaux plus fort
            };
        }
        return monstersData;
    };

};
/** DATABASE DES MONSTRES */
const $dataMonsters = new _dataMonsters();

// ┌------------------------------------------------------------------------------┐
// GLOBAL $monsters: _monsters
// create new monster battler
//└------------------------------------------------------------------------------┘
class _monsters extends _battler{
    constructor(id,level,dataBase) {
        super();
        /** id du dataBase connecter */
        this._id = id;
        this.child = null;
        /** store la case du monstre */
        this.inCase = null;
        this.initialize(level,dataBase);
    };
    get database() { return $Loader.Data2['m' + this._id] };
    get dataLink() { return $dataMonsters.data[this._id] };
    get name() { return this.dataLink._name };

    get force () { return this.type[0] };
    get faible() { return this.type[1] };
    get p(){ return this.child.p }
    get s(){ return this.child.s }

    get x() { return this.child.x };
    get y() { return this.child.y };
    set x(x) { return this.child.x = x };
    set y(y) { return this.child.y = y };
    set z(z) { return this.child.zIndex = z };
    get w() { return this.child.width };
    get h() { return this.child.height };


    /** initialise a monster */
    initialize(level,dataBase) {
        this.initialize_battler(level, dataBase.evo)
        this.initialize_data();
        this.initialize_sprites();
        this.initialize_interactive();
        this.initialize_statesTxtIcons();
    };

    /** create random data for monser*/
    initialize_data() {
        const db = this.dataLink;
        const ran = (Math.random()*100); // valeur aleatoir sur 100
        const lv = this._lv;
        this.type = [];
        Object.entries(db.type).forEach((e)=>{
            ran < e[1] && this.type.push(e);
        });
        // capacity
        this.capacity = ['attack','defense'];
        for (const key in db.capacity) {
            (this._lv>= db.capacity[key].lv) && (ran < db.capacity[key].r) && this.capacity.push(key);
        }
        //gemImunity
        this.gemImunity = {};
        for (const key in db.gemImunity) {
            this.gemImunity[key] = Math.randomFrom(...db.gemImunity[key]);
        }
        //statesImunity
        this.statesImunity = [];
        for (const key in db.statesImunity) {
            ran < db.statesImunity[key] && this.statesImunity.push(key);
        }
        // feeding
        this.feeding = {};
        for (const key in db.feeding) {
            this.feeding[key] = Math.randomFrom(...db.feeding[key]);
        }
    };

    /** initialise monster grafics from dataBase */
    initialize_sprites() {
        const dataBase = this.database;
        const cage = $objs.newContainer_dataBase(dataBase, 'idle', true) // (database,skin)
        cage.parentGroup = $displayGroup.group[1];
        cage.proj._affine = 2;
        cage.s.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)

        this.child = cage;
        cage.parentClass = this;
        // FIXME: remove pour setup dans combat + camera control event
        const spine = cage.s;
        spine.stateData.defaultMix = 0.1;
        spine.state.setAnimation(0, "apear", false).timeScale = (Math.random() * 0.6) + 0.6;
        spine.state.addAnimation(0, "idle", true);
        spine.scale.set(0.2);
    };

    /** initialise monster interactivity */
    initialize_interactive() {
        // player layers hackAttachmentGroups set spine.n
        // interactiviy
        const cage = this.p;
        cage.hitArea = cage.getLocalBounds(); // empeche interaction avec mesh presision
        cage.on('pointerover', this.pointer_inMonster, this);
        cage.on('pointerout', this.pointer_outMonster, this);
        cage.on('pointerdown', this.pointer_dwMonster, this);
        cage.on('pointerup', this.pointer_upMonster, this);
    };

    /** Initialise l'emplacement des states icons */
    initialize_statesTxtIcons(){
        this.statesTxt = $txt.area();
        this.statesTxt.pivot.y = this.p.height;
        this.statesTxt.pivot.zeroApply();
        this.statesTxt.alpha = 0;
        this.statesTxt.scale.set(0.8);
        this.p.addChild(this.statesTxt);
    };

//#region [rgba(40, 0, 0, 0.2)]
    // ┌------------------------------------------------------------------------------┐
    // EVENTS INTERACTION LISTENERS
    // └------------------------------------------------------------------------------┘
    pointer_inMonster(e) {
        const c = e.currentTarget;
        const f = $systems.filtersList.OutlineFilterx4white; //new PIXI.filters.OutlineFilter(4, 0xff0000, 5);
        c.slots_d.forEach(spineSprite => { spineSprite._filters = [f] });
        //this.moveArrowTo(c);
        //this.moveMathBox(c);
        this.needReversePlayer(c);
        // si mode attack, affiche les states base
        if($combats._mode === $combats.combatMode[0]){
            this.showStatesHover();
        }
    };

    pointer_outMonster(e) {
        const c = e.currentTarget || e;
        if(c.parentClass !== $combats._selectedTarget ){
            c.slots_d.forEach(spineSprite => {
                spineSprite._filters = null;
            });
        }
        this.hideStateHover();
    };

    pointer_dwMonster(e) {
        const c = e.currentTarget;
        const clickLeft_ = e.data.button === 0;
        const _clickRight = e.data.button === 2;
        const click_Middle = e.data.button === 1;
        if (clickLeft_) {
            if ($combats._selectedTarget !== this) {
                return $combats.setSelectTarget(this); // asign la selection du monstre general
            };
            $combats.startFocusAttack();

        } else
        if (_clickRight) {
            $camera.moveToTarget(this.sprite, 3);

        }
    };

    pointer_upMonster(e) {
        const c = e.currentTarget;
        if (this.tweenHoldClick) {
            if (!this.startHit) { // cancel
                this.tweenHoldClick.reverse();
                $player.spine.d.state.setEmptyAnimation(3, 0.2);
                const carw = $huds.combats.sprites.carw; // arrow TODO:
                carw.tint = 0xffffff;
            } else {
                this.hideStateHover();
            }
        }
    };
//endRegion
    /**Initialise l'IA sequensiel pour le turn du monstre. Effectut diferent step desisionelle */
    startBattleIA(){
        //Step1: creation des multi-tread pour l'IA
        //?step2: verifi les distances des item food, verifi si il doi manger quelque chose ?
        //?step3: verifi les distances et evalue si dois ce raproche ou seloinger selon sa desc ?
        //?step4: verifi la meilleur action disponible selon ces states, son inteligence permet de mieux fair ces choix ?
        const action_eatFood = (()=>{
            $combats.foodItemMap.forEach(item => {
               // condition et math...
                return item;
            });
        })();
        const action_move = false; // store un endroit pour ce deplacer
        const action_atk = $combats.combatMode[0]; // store un mode action; 'attack'
        const action_target = $player; // store la cible la plus logique selon le setup
        setTimeout(()=>{
            const action = {type:'attack',source:this,target:$player,items:null}; // on creer un objet actions qui stock des para
            $combats.actionsTimeLine = [];
            $combats.actionsTimeLine.push(action); // will .shift() from combat update
         }, 300);


    };

    moveArrowTo(target) {
        TweenMax.to($huds.combats.sprites.carw.position, 0.4, {
            x: target.x, y: target.y - target.height,
            ease: Expo.easeOut,
        });
    };

    moveMathBox(target) {
        const cage_dsb = $huds.combats.sprites.cage_dsb;
        cage_dsb.renderable = true;
        const pw = ($player.spine.width / 2);
        const rX = + (target.x > $player.x) && cage_dsb.width * 2 || -cage_dsb.width;
        TweenMax.to($huds.combats.sprites.cage_dsb.position, 1, {
            x: $player.x - rX, y: $player.y,
            ease: Elastic.easeOut.config(0.8, 0.4),
        });
    }

    // on utilise "reversX_withoutEvent" car l'ani revers de base appelle un events $player._dirX qui fuck tout
    needReversePlayer(target) {
        const needR = ($player._dirX === 6 && target.x < $player.x) || ($player._dirX === 4 && target.x > $player.x);
        if (needR) {
            $player.reversX();
            $player.spine.d.state.setAnimation(3, "reversX_withoutEvent", false);
            $player.spine.d.state.addEmptyAnimation(3, 0.2);
        }
    };

    playHit() {
        const ran = Math.random() > 0.5 && 1 || 0;
        this.sprite.d.state.setAnimation(1, `hit${ran}`, false);
        this.sprite.d.state.addEmptyAnimation(1, 1);
    }

    /** affiche les states base au dessu du monstre */
    showStatesHover(){
        const statesTxt =`[IsIcon_hp]${this.hp}/${this.mhp}`
        this.statesTxt.computeTag(statesTxt);
        this.statesTxt.pivot.x = this.statesTxt.width/2;
        this.statesTxt._filters = [$systems.filtersList.OutlineFilterx4Black];
        const zero = this.statesTxt.pivot.zero;
        TweenLite.to(this.statesTxt.pivot, 0.4, { y:zero.y+this.statesTxt.height, ease: Expo.easeOut });
        TweenLite.to(this.statesTxt, 0.4, { alpha:1, ease: Expo.easeOut });
       
    }
    /** cache les state important au dessu du monstre */
    hideStateHover(){
        this.statesTxt._filters = null;
        const zero = this.statesTxt.pivot.zero;
        TweenLite.to(this.statesTxt.pivot, 0.2, { y:zero.y, ease: Expo.easeOut });
        TweenLite.to(this.statesTxt, 0.2, { alpha:0, ease: Expo.easeOut });
    }

        /** initialise a monster */
        initialize(level,dataBase) {
            this.initialize_battler(level, dataBase.evo)
            this.initialize_data();
            this.initialize_sprites();
            this.initialize_interactive();
            this.initialize_statesTxtIcons();
        };
    
};


