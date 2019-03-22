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
                _name: "Salviarum Divinurum", //? link les text id au debut, ensuite pendant boot initialise, on remplace id par text
                _desc: "日陰に生息する多年生の植物の種, 日陰に生息する多年 日陰に生息する多年生の植物の種 生の植物の種",
                type: { // chance heritage typeOrbs 
                    master: 20, // ! les monstre master augment de 20% les chance de force, et reduit de 20% les chance de faible
                    force: {
                        'green': 100,
                        'red': 40,
                        'red': 40,
                    },
                    faible: {
                        'blue': 50,
                    }
                },// TODO: Do it with excel dataManager see loader
                evo: { // base:rate:flat
                    hp : { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_hp.png
                    mp : { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_mp.png
                    hg : { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_hg.png
                    hy : { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_hy.png
                    atk: { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_atk.png
                    def: { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_def.png
                    sta: { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_sta.png
                    lck: { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_lck.png
                    int: { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_int.png
                    exp: { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_exp.png
                    mic: { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_mic.png // ? max item possible monster
                    miw: { b: 10, r: 1, f: 1 }, //data2\Icons\statsIcons\SOURCE\images\sIcon_miw.png // ? max wieght du monster
                },// store base,rate,flat states per level from initializeFromData
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

    /**generation dune data list de monstre asigner a une case 
     * @argument mapInfluence passer des stats d'influence pour generer les data attache a la case monster
    */
    static getRanDataMonsterList(mapInfluence) {
        const monstersData = []; // a attachera une case, strigniflyable
        if (!mapInfluence) {
            const mIdList = [0, 0, 0, 0]; // monster list by id allowed
            const mNb = ~~(Math.random() * 3) + 1; // nombre de monstre max
            for (let i = 0, l = mNb; i < l; i++) {
                const mID = mIdList[~~(Math.random() * mIdList.length)];
                const lv = ~~(Math.random() * 1) + 1; // TODO: max level algo
                monstersData.push({ mID, lv });
            };
        }
        return monstersData;
    };

    /**@description generate a random data monsters for map */
    generateDataForMap(id, lv) {
        const data = this.id[id];
        const hp = data.evo.hp;
        const states = {
            hp: hp.base * (1 + (lv - 1) * hp.rate) + (hp.flat * (lv - 1)),
        };
        return { id, lv, states };
    };



};

const $dataMonsters = new _dataMonsters();

// ┌------------------------------------------------------------------------------┐
// GLOBAL $monsters: _monsters
// create new monster battler
//└------------------------------------------------------------------------------┘
class _monsters {
    constructor(id, lv) {
        this._id = id; // monster data id
        this._lv = lv; // monster level
        this.child = null;
        /** store la case du monstre */
        this.inCase = null;
        this._battleturnSta = 0;
        this.initialize();
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
    get isReverse() { return this.s.scale._x < 0 };

    initialize() {
        this.initialize_data();
        this.initialize_sprites();
        this.initialize_interactive();
    };

    /** create random data for monser*/
    initialize_data() {
        const db = this.dataLink;
        const ran = (Math.random()*100); // valeur aleatoir sur 100
        const lv = this._lv;
        const compute = (ev)=>{return ev.b*(1+(lv-1)*ev.r) + (ev.f*(lv-1))};
        this.st = {
            mhp : compute(db.evo.hp ), //data2\Icons\statsIcons\SOURCE\images\sIcon_hp.png
            hp  : compute(db.evo.hp ), //data2\Icons\statsIcons\SOURCE\images\sIcon_hp.png
            mmp : compute(db.evo.mp ), //data2\Icons\statsIcons\SOURCE\images\sIcon_mp.png
            mp  : compute(db.evo.mp ), //data2\Icons\statsIcons\SOURCE\images\sIcon_mp.png
            hg  : compute(db.evo.hg ), //data2\Icons\statsIcons\SOURCE\images\sIcon_hg.png
            hy  : compute(db.evo.hy ), //data2\Icons\statsIcons\SOURCE\images\sIcon_hy.png
            atk : compute(db.evo.atk), //data2\Icons\statsIcons\SOURCE\images\sIcon_atk.png
            def : compute(db.evo.def), //data2\Icons\statsIcons\SOURCE\images\sIcon_def.png
            sta : compute(db.evo.sta), //data2\Icons\statsIcons\SOURCE\images\sIcon_sta.png
            lck : compute(db.evo.lck), //data2\Icons\statsIcons\SOURCE\images\sIcon_lck.png
            int : compute(db.evo.int), //data2\Icons\statsIcons\SOURCE\images\sIcon_int.png
            exp : compute(db.evo.exp), //data2\Icons\statsIcons\SOURCE\images\sIcon_exp.png
            mic : compute(db.evo.mic), //data2\Icons\statsIcons\SOURCE\images\sIcon_mic.png // ? max item possible monster
            miw : compute(db.evo.miw), //data2\Icons\statsIcons\SOURCE\images\sIcon_miw.png // ? max wieght du monster
        };
        this.type = [[],[]];
        Object.entries(db.type.force).forEach((e)=>{
            ran < e[1] && this.type[0].push(e[0]);
        });
        Object.entries(db.type.faible).forEach((e)=>{
            ran < e[1] && this.type[1].push(e[0]);
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
        cage.scale.set(0.2, 0.2);
        cage.parentGroup = $displayGroup.group[1];
        cage.proj._affine = 2;
        cage.s.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)

        this.child = cage;
        // FIXME: remove pour setup dans combat + camera control event
        const spine = cage.s;
        spine.stateData.defaultMix = 0.1;
        spine.state.setAnimation(0, "apear", false).timeScale = (Math.random() * 0.6) + 0.6;
        spine.state.addAnimation(0, "idle", true);
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

    pointer_inMonster(e) {
        const c = e.currentTarget;
        const f = $systems.filtersList.OutlineFilterx4white; //new PIXI.filters.OutlineFilter(4, 0xff0000, 5);
        c.slots_d.forEach(spineSprite => { spineSprite._filters = [f] });
        //this.moveArrowTo(c);
        //this.moveMathBox(c);
        this.needReversePlayer(c);
    };

    pointer_outMonster(e) {
        const c = e.currentTarget;
        c.slots_d.forEach(spineSprite => {
            spineSprite._filters = null;
        });
    };

    pointer_dwMonster(e) {
        const c = e.currentTarget;
        const clickLeft_ = e.data.button === 0;
        const _clickRight = e.data.button === 2;
        const click_Middle = e.data.button === 1;
        if (clickLeft_) {
            if ($combats._selectedMonster !== this) {
                return $combats.selectedMonster(this); // asign la selection du monstre general
            };
            return; //TODO: RENDU ICI
            $player.s.state.setAnimation(3, "preparAtk", false);
            this.tweenHoldClick && this.tweenHoldClick.kill();
            //$huds.combats.sprites.carw.position.y = c.y - (c.height);
            const cHitLow = Math.random(); //critical green hit, start to be green after 1+chl
            const cHitEnd = 1 * 0.5; // % duration green hit
            const carw = $huds.combats.sprites.carw; // arrow
            this.tweenHoldClick = TweenMax.to(carw.position, 2 + cHitLow + cHitEnd, {
                y: c.y - (c.height - 40),
                ease: Expo.easeOut,
                onComplete: () => {
                    TweenMax.to($huds.combats.sprites.carw.position, 1, { y: c.y - c.height, ease: Elastic.easeOut.config(1.2, 0.1) });
                    //this.StartRoll();
                },
                onUpdate: () => {
                    const t = this.tweenHoldClick._time;
                    if (t > 1) { this.startHit = true; }
                    if (this.startHit) {
                        t > (1 + cHitLow) && t < (1 + cHitLow + cHitEnd) ? carw.tint = 0x00ff00 : carw.tint = 0xff0000;
                    }

                }
            });
        } else
        if (_clickRight) {
            $camera.moveToTarget(this.sprite, 3);

        }
    };

    pointer_upMonster(e) {
        const c = e.currentTarget;
        if (this.tweenHoldClick) {
            if (!this.startHit) {
                this.tweenHoldClick.reverse();
                $player.spine.d.state.setEmptyAnimation(3, 0.2);
                const carw = $huds.combats.sprites.carw; // arrow
                carw.tint = 0xffffff;
            } else {
                const carw = $huds.combats.sprites.carw; // arrow
                this.tweenHoldClick.kill();
                const doubleHit = carw.tint === 0x00ff00; // green

                $player.spine.d.state.setAnimation(3, "atk1", false);
                doubleHit && $player.spine.d.state.addAnimation(3, "atk2", false);
                $player.spine.d.state.addAnimation(3, "backAfterAtk", false);
                $player.spine.d.state.addEmptyAnimation(3, 1);

                //TODO: // RENDU ICI , creer des events spines pour des animations coerente, refactoriser players js et les listener ?
                $player.p.zIndex = c.y + 1;
                TweenMax.to($player, 0.8, {
                    x: c.x - this.w / 1.5,
                    y: c.y,
                    ease: Expo.easeOut,
                    onComplete: () => {
                        carw.tint = 0xffffff;

                    },
                });
            }
        }
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
};


