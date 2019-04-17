/*:
// PLUGIN □────────────────────────────────□ COMBAT CORE ENGINE □───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc manage combats
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘

class _combats {
    constructor() {
        /** le combat est oficielment commencer?  */
        this._started = false;
        this._active = false; // in combat mode indicator
        this.monsters = []; // store current reference of monster
        this._battlers = []; // store live battlers from update 
        /**indique et memorise le monstre ou target selectionner */
        this._selectedTarget = null;
        /** la source tu turn */
        this.currentBattlerTurn = null; //le tour du battler
        /** List des mode qui existe en combat */
        this.combatMode = ['attack','defense','move','run','magic'];
        /** le active mode selectionner */
        this._mode = null; // le cobat mode current 
        /** when hold click focus on target to attack*/
        this.holdAttackTween = null;
        /** Lors hold click sufisanement longtemp, autorise le sequeseur d'actions */
        this.readyToHit = false;
        /**Le combat est occuper a executer un action dans timeline */
        this._busy = false;
        /**List des actions en suspend, devien un array lorsque init */
        this.actionsTimeLine = null;
        /**List des items food sur la scene map */
        this.foodItemMap = [];
        /** Environement sprites buffers: les elements afficher et cacher */
        this.environement = {hides:[],shows:[],cases:[]};
        /** temp par tour de distribution au battler*/
        this._battleTurnTime = 0;
        /** Indicateur de victoire */
        this._victory = false;
    };

    // initialise combat, creer monstre et huds
    intitialize(dataMonsterList){
        $systems.inCombat = true; // setter
        $stage.interactiveChildren = true; // remet l'envirement interactive, mais setup individuelment
        this.intitialize_monsters(dataMonsterList);
        this.intitialize_environement(); // prepare l'environement de combat
        this.debug();
        
    };
    //TODO: RENDU ICI , regarder les tiks qui renderer et alpha trop to, ce qui creer un flicks
    /** generate and setup monster */
    intitialize_monsters(dataMonsterList){
        for (let i=0, l=dataMonsterList.length; i<l; i++) {
            const data = dataMonsterList[i];
            const dataBase = $dataMonsters.data[data.id];
            const monster = new _monsters(data.id,data.lv,dataBase);
            this.monsters.push(monster);
            $camera.scene.addChild(this.monsters[i].p);
        };
    };

    /** execute les methods preparatoire du combat lier a l'environement. */
    intitialize_environement(clear){
        this.setupVisibleHiding(clear);
        this.setupFilters      (clear);
        this.setupCases        (clear);
        this.setupMonsters     (clear);
        this.setupCombatHuds   (clear);
        this.setupInteractive  (clear);
        this.setupCombatTime   (clear);
        if(clear){
            this._started = false;
            this._active = false;
            this.monsters = []; // store current reference of monster
            this._battlers = []; // store live battlers from update 
            this._selectedTarget = null;
            this.currentBattlerTurn = null; //le tour du battler
            this._mode = null; // le cobat mode current 
            this.holdAttackTween = null;
            this.readyToHit = false;
            this._busy = false;
            this.actionsTimeLine = null;
            this.foodItemMap = [];
            this.environement = {hides:[],shows:[],cases:[]};
            this._battleTurnTime = 0;
            this._victory = false;
        };
    };

    /** Setup les interactives environement general */
    setupInteractive(clear){
        if(clear){ // retour des interactive des obj sur map
            $objs.list.forEach(e => {
                e.attache.interactive = e.attache._interactive;
                delete e.attache._interactive;
            });
            return;
        };
        $objs.list.forEach(e => {
            e.attache._interactive = e.attache.interactive; // cache delete after combat 
            e.attache.interactive = false;
        });
    }
    
    /** asigne un emplacement strategique dans l'environement au monstre */
    setupMonsters(clear){
        if(clear){
            this.monsters.forEach(monster => { monster.p.parent.removeChild(monster.p) });
            this.monsters = [];
            return;
        };
        const length = this.environement.cases.length;
        const ran = ~~(Math.random()*length);
        let usedCID = []; // used case id.
        $player.p.getBounds();
        this.monsters.forEach(monster => {
            const ranList = [...Array(length).keys() ].sort(()=>0.5-Math.random()); // creer une list index random 
            while (ranList.length) {
                const index = ranList.shift();
                const c = this.environement.cases[index]; // case 
                monster.p.position.copy(c.position);
                monster.p.zIndex = monster.p.y;
                monster.p.getBounds();
                if($player.inCase === c || usedCID.contains(c)){ continue };
                if($systems.hitCheck($player.p, monster.p)){ continue };
                //* succed, autorise la position du monste
                // check need reverse from player ?
                const rev = monster.p.needReverseFrom($player.p) && -1 || 1;
                monster.s.scale.x *=rev;
                monster.inCase = c;
                usedCID.push(c);
                ranList.length = 0; // break while
            };
        });
    };

    /** calcule et trouve les case potentiel en combat pouvant etre utiliser */
    setupCases(clear){
        this.environement.cases = [];
        if(clear){
            // TODO: Il yaura des case mode combat et mode jeux, rmeplace ici les case mode combat en original mode jeux .?
        }else{
            const pX = $player.p.x;
            const pY = $player.p.y;
            const inDistX = 1920/2*0.5;//0.6: the combat good zoom
            const inDistY = 1080/2*0.5;
            $player.p.getBounds();
            // map un array list avec les case potentiel pour afficher les ennemy
            const potentialCase = $objs.cases_s.filter(c => Math.abs(c.x-pX)<inDistX && Math.abs(c.y-pY)<inDistY );
            this.environement.cases = potentialCase;
        }
    };

    /** buffering des sprites objets que on garde visible ou cacher pour combate */
    setupVisibleHiding(clear){
        if(clear){
            TweenLite.to(this.environement.hides, 0.4, { alpha:1, ease: Expo.easeOut });//TODO: UTILIZER PIXI ZERO ? CAR les alpha pourrait etre custom ?
        }else{
            // FIXME: probleme lumiere alpha 0;
            $objs.list_s.forEach(c => {
                const isVisibleInCombat = c.dataObj.p.visibleInCombat || c.dataObj.b.dataType === "Grass"; // condition de visibility en combat
                isVisibleInCombat? this.environement.shows.push(c) : this.environement.hides.push(c);
            });
        }

    };

    /** ajoute filtre blur au background et certain elements */
    setupFilters(clear){
        if(clear){
            const KawaseBlurFilter_combatBG = $systems.filtersList.KawaseBlurFilter_combatBG;
            let clearFilter = ()=>{
                $stage.scene.background.d._filters = null;
                $stage.scene.background.n._filters = null;
            };
            TweenLite.to(KawaseBlurFilter_combatBG, 0.4, {  blur:0,quality:0, ease: Power3.easeOut, onComplete:clearFilter });
            return;
        };
        // filter blur fx for background
        const kBlur =  $systems.filtersList.KawaseBlurFilter_combatBG;
        $stage.scene.background.d._filters = [kBlur];
        $stage.scene.background.n._filters = [kBlur];
    };

    /** calcul les limite de tour base sur le stamina */
    setupCombatTime(clear){
        if(clear){
            PIXI.ticker.shared.remove(this.update);
        };
        this.update_battlers(); // update battlers buffer
        let battleTurnTime = 0;
        this._battlers.forEach(battler => { battleTurnTime+=battler.sta });
        battleTurnTime*= 100; // combat speed:
        this._battleTurnTime = battleTurnTime;
        this._battlers.forEach(battler => { battler.battleTime = battleTurnTime });// assign a tous les personage la limite
        PIXI.ticker.shared.add(this.update,this);
    };

    /** ajoute les huds a la sceneMap sur le player*/
    setupCombatHuds(clear){
        if(clear){
            return $huds.combats.clearFromScene();
        };
        $huds.combats.setupToScene(); // ajoute les bons parent et renderable
    };
    
//#region [rgba(40, 0, 0, 0.2)]
    // ┌------------------------------------------------------------------------------┐
    // EVENTS INTERACTION LISTENERS
    // └------------------------------------------------------------------------------┘
    /** event call from global mouse interaction out element */
    pUP_global(e){
        const isClickR = e.data.button === 2; // clickRight ==>
        const isClickL = e.data.button === 0; // clickLeft <==
        // si click droite et a un mode combat, disable mode
        // si pret pour attaker
        if(this.readyToHit){
            this.setupActionsFrom(this.currentBattlerTurn,this._selectedTarget,this._mode);
            $huds.combats.hide_combatSlots();
           // $huds.combats.setupToTargetTurn(null);
            return;
        }
        if(this.holdAttackTween && !this.readyToHit){
            this.clearFocusAttack();
            return;
        };
        if(isClickR){
            if(this._selectedTarget){ return this.setSelectTarget(null) }
            if(this._mode){ return this.setCombatModeTo(null) };
        }
        


    };
//#endregion

    // update from tikers battleTIKER, dispatch turn
    update(delta){
        if(this._started && !this.currentBattlerTurn){
            const nextTurn = this.checkTurn();
            nextTurn && this.startTurn(nextTurn);
        };
        if(!this._busy && this.actionsTimeLine){ // si des actions dans file attend? atack,def,attakitem, eating..?
            this._busy = true;
            const nextActions = this.actionsTimeLine.shift();
            if(nextActions){ // si plus d'action en suspend , passe a autre passe a autre chose.
                switch (nextActions.type) {
                    case this.combatMode[0]:
                        this.actionPlay_attack(nextActions);
                    break;
                    case this.combatMode[1]:
                        this.actionPlay_defense(nextActions)
                    break;
                }    
            }else{
                // fin du tour, plus d'action dans la list
                this.endTurn();
            }
        }

    };

    /** update _battlers buffer liste when need */
    update_battlers(){
        this._battlers = [$player,...this.monsters].filter(b => !b.isDeath );
    }

        
    /** dispatch les turn des battlers selon le sta et la valeur turnTimeMax */
    checkTurn(delta){
        for (let i=0, l=this._battlers.length; i<l; i++) {
            const battler = this._battlers[i];
            if(battler.battleTime<=0){ return battler };
        };
    };

    /**Start Combat and animations FX after timeout executeCaseEventTypeFrom */
    start(){
        this._started = true;
        TweenLite.fromTo($systems.filtersList.KawaseBlurFilter_combatBG, 3, {  blur:0,quality:0 },{  blur:8,quality:12, ease: Expo.easeOut });
        TweenLite.to(this.environement.hides, 2, { alpha:0, ease: Expo.easeOut });
        TweenLite.to(this.environement.cases, 2, { alpha:1, ease: Expo.easeOut });
    };

    /** demmare le tour d'une cible target */
    startTurn(target){
        this.currentBattlerTurn = target;
        this.setupToTargetTurn(target);
    };

    /** le tour du target est terminer */
    endTurn(target,timeout){
        //DELETEME 
        this.update_battlers();
        this.checkBattleEnd();
        this.currentBattlerTurn.battleTime = (this._battleTurnTime+this.currentBattlerTurn.battleTime+1); // reset timer turn for current target +1 permet eviter le double turn si /2
        this.currentBattlerTurn = null;
        this.setSelectTarget(null); // TODO: QUAND NULL CREER UN ANCRE a partir de la position
        this.actionsTimeLine = null;
        this.readyToHit = false;
        this._busy = false;
        if(this._victory){
            PIXI.ticker.shared.remove(this.update,this);
            this.setupVictory();
        };
    };

    /** verifi si le combat est terminer */
    checkBattleEnd(){
        this._victory = this._victory || this.monsters.every((m)=>m.isDeath);
    };

    /** initialise le turn dun battler */
    setupToTargetTurn(target){
        $huds.combats.setupHudsToBattler(target); //reset
      // $huds.combats.show_combatIcons();
      // $huds.combats.hide_combatSlots();
        this.setCombatModeTo(null);
        //!si turn monster, play setup battler IA
        if(target instanceof _monsters){
            target.startBattleIA();
        }else{
            //TODO: FIXME: pourrait empecher les messages box a choix reponse! les monstre peuvent faire des proposition parfoi pour influer le combats
            $stage.interactiveChildren = true;
            $mouse._busy = false; // prevent global mouse event
        };
    };

    /** defenir le mode comat selon un mode: tous ce que ne touche pas au combat huds */
    setCombatModeTo(mode){
        this._mode = mode; // defeni le mode combat
        $huds.combats.setupFromMode(mode);
        if(!mode){
            this.showCases(true);
            this.showMonsters(true);
            $camera.moveToTarget(this.currentBattlerTurn,7,5);
            return;
        };
        // update le combat si mode attack
        if (mode === this.combatMode[0]){ //! attack mode
            this.hideCases();
            this.showMonsters(true);
            $camera.moveToTarget(this.currentBattlerTurn,9,5);
        };
    };

    /** affiche les cases de combats et interactive */
    showMonsters(interactive=true){
        this.monsters.forEach((monster)=>{ 
            monster.p.interactive = interactive;
            monster.p.alpha = 1;
        });
    };

    /** cache les cases de combats et leur interactive */
    hideMonsters(interactive=true,value = 0.3){
        this.monsters.forEach((monster)=>{ 
            monster.p.interactive = interactive;
            monster.p.alpha = value;
        });
    };
    
    /** affiche les cases de combats et interactive */
    showCases(interactive=true){
        this.environement.cases.forEach((c)=>{
            c.interactive = interactive;
            TweenLite.to(c, 2, { alpha:1, ease: Expo.easeOut });
        });
    };

    /** cache les cases de combats et leur interactive */
    hideCases(value = 0.3){
        this.environement.cases.forEach((c)=>{
            c.interactive = false;
            TweenLite.to(c, 2, { alpha:value, ease: Expo.easeOut });
        });
    };

    /** selectionne et focus sur un target clicker */
    setSelectTarget(target){
        this._selectedTarget = target;
        if(target){
            $camera.moveToTarget(target,8,5);
            $player.setReversXFrom(target);
            !this._mode && $huds.combats.show_monsterInfoBox(target);
        }else{
            $camera.moveToTarget($player,9,5,Power4.easeOut);
            $huds.combats.hide_monsterInfoBox()
        };
        if(this._mode){// si un mode selectionner?
            $huds.combats.setupCombatBoxFrom(this.currentBattlerTurn,target,this._mode); // affiche la combat dammage box 
        }
       // les filter ennemy
       this.monsters.forEach(m => {
           if(m===target || !target){
               m.s.alpha = 1;
               !target && m.p.emit('pointerout',m.p); // enleve les filtres de selections blanc
           }else{
               m.s.alpha = 0.4;
           };
       });
    };

    /** creat une instance actions avec information pour le dispatcher dans update */
    create_actions(type,source,target,items){
        return {type,source,target,items};
    }

    /** creer des actions et setup selon source et target */
    setupActionsFrom(source,target,combatMode){
        //? maybe timeline pour structure l'animation ?
        $mouse._busy = true; // prevent global mouse event
        this.actionsTimeLine = []; // initialise le sequenseur d'actions
        let slots = $huds.combats.slotsItems;
        !slots.length && (slots = null);
        //TODO: voir si ont peut splitter le physic des atk slots
        const action = this.create_actions(combatMode, source, target, slots);
        this.actionsTimeLine.push(action);
    };


    /** Execute une Action de type attack avec ces configuration options */
    actionPlay_attack(action){
        const source = action.source;
        const target = action.target;
        const actionSetup = $states.getActionSetupFrom(source, target, action.type);
        const damages = this.computeDammage(source,target,actionSetup);
        const isCritic = damages.crt;
        const isFatal = target.hp-damages.total <= 0;

        const items = action.items && $huds.combats.addItemSlotToRegisterMap(action.source);
        const tCollide = ((target.p.width/2)+(source.p.width/2))*(source.p.x<target.p.x?-1:1); // collid restriction with reverse ?
        source.p.position.zeroApply();//zero position de retour
        //!Step:ANIMATION FOR ITEMS MODE
        const rev = source.isRevers && -1 || 1;
        const sXY = source.p.position.clone();// source XY
        const tXY = target.p.position.clone();// target XY
        const dX = source.p.x-target.p.x; // distance X from source et cible
        const dY = source.p.y-target.p.y; // distance Y from source et cible
        const tWH = target.p.getBounds(); // target width height (compute camera)
        const sWH = source.p.getBounds(); // source width height (compute camera)
        
        //const tl = new TimelineLite({paused:true,repeat:4});
        const speed = 1; //?TODO: need sync with spine2d need study?
        const ih = 75; // constante items height from size : help math performance
        const itPositions = items && items.map(it => it.position);
        const itScales    = items && items.map(it => it.scale   );
        /////////////////////////////////////////////////////////////////////////////
        function sourceBackAtk(){
            const tl = new TimelineMax();
            tl.call(() => { $camera.moveToTarget(source,8,5); },null,null,'#TargetHitItem') // TODO: AJOUTER UN SYSTEM TIMELINE POUR CAMERA AVEC += -=
            tl.call(() => {
                const entry = source.s.state.setAnimation(3, "atk0", false);
            } ,null,null)
            .to(source.p.position, 0.5, {x:`-=${120*rev}`, y:`-=${dY/2}`, ease: Expo.easeOut  } )
            return tl;
        };
        function itemFocus(){
            const tl = new TimelineMax()
            tl.to(itPositions, 0.5, {x:`+=${30*rev}`, y:(i,it)=>`-=${dY/2+(100+ih*i)}`, ease: Back.easeOut.config(1.4) },0)
            tl.to(itScales, 0.3, {x:1, y:1, ease: Back.easeOut.config(4) },0)
            .fromTo(items, 1, {rotation:Math.PI*2},{rotation:()=>Math.randomFrom(0,4,2), ease: Back.easeOut.config(1.4) },0)
            return tl;
        };
        function sourceAtk(){
            const tl = new TimelineMax();
            tl.call(() => {  $camera.moveToTarget(target,10,2.5,Power4.easeOut); },null,null)
            tl.to(source.p, 0.1, {x:target.p.x+tCollide, y:target.p.y, zIndex:target.p.y+1, ease: Power4.easeNone })
            tl.call(() => { target.s.state.setAnimation(3, "hit0", false) },null,null)
            tl.call(() => { isFatal && target.s.state.setAnimation(4, "death", false) },null,null)
            tl.to(source.p, 1, {x:`+=${30*rev}`, ease: Power2.easeOut })
            return tl;
        };

        function itemTrow(){
            const tl = new TimelineMax();
            tl.to(items, 0.2, {x:tXY.x ,y:tXY.y-tWH.height/2,zIndex:target.p.y+1, ease: Back.easeIn.config(1) },0 ) // projet vers target
            .to(itScales, 1, {x:'+=1' ,y:'+=1', ease: Elastic.easeOut.config(1, 0.3) },0.2)
            .to(items, 1, {rotation:()=>`+=${Math.randomFrom(1,15)}`, ease: Expo.easeOut },0.2 ) // when fall from ran rotation, hit with *-1
            .to(itPositions, 0.4, { y:tXY.y-tWH.height, ease: Expo.easeOut },0.3 ) 
            .to(itPositions, 0.4, {x:(i)=>`+=${((ih*i)+50)*rev}`, ease: Power4.easeOut },0.3 ) // imercy on hit ==>>
            return tl;
        };
        function itemFall(){
            const tl = new TimelineMax();
            tl.addLabel( '#hit', 0.4 ) // target Hit by items
            tl.addLabel( '#bounce', 0.7 ) // items start falling
            tl.to(itScales, 0.4, {x:1 ,y:1, ease: Expo.easeIn },0 )
            tl.to(itPositions, 0.4, {x:`+=${30*rev}`,y:tXY.y, ease: Expo.easeIn },0 )
            items.forEach(it => {
                const rr = Math.randomFrom(-4,10,2); // random rotation
                const rx = Math.randomFrom(4,10)*-rr // random X sol (dir from ran rot)
                const rt = Math.randomFrom(0,0.3,2); // ran time
                tl.to(it, 0.4, {rotation:()=>`+=${rr}`, ease: Expo.easeIn },0 ) // when fall from ran rotation, hit with *-1
                tl.to(it.position, 0.3, {x:(i)=>`+=${rx}`, y:'-=50', ease: Power2.easeOut },'#hit') // items hit gound and start fake Physic
                .to(items, 0.6+rt, {rotation:()=>`+=${rr*-1}`, ease: Power2.easeOut },'#hit' ) // when fall from ran rotation, hit with *-1
                tl.to(it.position, 0.4+rt, {y:target.p.y, ease: Bounce.easeOut },'#bounce' ) // Y
                .to(it.position, 0.6+rt, {x:`+=${rx/2}`,ease: Power2.easeOut },'#bounce' ) // X 
            });
            return tl;
        };

        function showDammage(){
            const tl = new TimelineMax();
            const txt = new PIXI.Text(damages.total,$txt.styles[3]);
            txt.anchor.set(0.5,1);
            txt.convertTo2d();
            txt.proj._affine = 5
            tl.call(() => {
                target.add_hp(-damages.total);
                txt.position.copy(tXY);
                $stage.scene.addChild(txt) 
            })
            tl.to(txt.position, 1, { x:`-=${65*rev}`, y:`-=${tWH.height}`, ease: Expo.easeOut },0);
            tl.fromTo(txt.scale, 1.2, { x:0,y:0},{ x:2,y:2, ease: Elastic.easeOut.config(1.2, 0.3) },0);
            tl.fromTo(txt, 1.2, { rotation:-4},{ rotation:0, ease: Elastic.easeOut.config(1.6, 0.6) },0);
            tl.to(txt, 0.8, {
                x:"+=40",
                y:"-=20",
                alpha:0, 
                ease: Expo.easeInOut,
                onComplete: () => {
                    txt.parent.removeChild(txt);
                },
            });
            return tl;
        };

        function ending(){
            const tl = new TimelineMax();
            tl.to(source.p, 1, {x:source.p.position.zero.x ,y:source.p.position.zero.y, zIndex:source.p.position.zero.y, ease: Power4.easeOut },0)
            .call(() => {
                source.s.state.setAnimation(3, "backAfterAtk", false); //FIXME: moteur spine plus simple pour animation baser sur $player
                source.s.state.addEmptyAnimation(3, 0.3 );
                target.s.state.addEmptyAnimation(3, 0.3)
            } ,null,null,0)
            .call(() => { $camera.moveToTarget(source.inCase,7,2.5); } ,null,null,0.1)
            return tl;
        };

        const master = new TimelineMax({paused: true})//.repeat(-1).repeatDelay(1);
        master.add( sourceBackAtk(),0);
        items && master.add( itemFocus(),0);
        master.add( sourceAtk(),0.4);
        items && master.add( itemTrow(),0.5); // shoud play at #atk +0.2 ?
        master.add( showDammage(),0.7);
        items && master.add( itemFall(),1.8); // shoud play after 'itemTrow' ?
        master.add( ending(),2.2); // ending
        master.call(() => { this._busy = false } ,null,null,4); //! end turn
        master.play();
    };

    /** start Hold click on target , and set when ready to create actions sequence */
    startFocusAttack(){
        $stage.interactiveChildren = false;
        $huds.combats.hide_combatBox();
        $player.s.state.setAnimation(3, "preparAtk", false);
        this.holdAttackTween && this.holdAttackTween.kill();
        //$huds.combats.sprites.carw.position.y = c.y - (c.height);
        const cHitLow = Math.random(); //critical green hit, start to be green after 1+chl
        const cHitEnd = 1 * 0.5; // % duration green hit
        const targetXY = $camera.getLocalTarget($player.p,{_zoom :2.8});
        // setup camera focusing when hold click target
        TweenLite.to($camera.pivot, 2, {
            x:targetXY.x, y:targetXY.y,
            ease: Power1.easeOut,
        });
        this.holdAttackTween = TweenLite.to($camera, 2, { 
            _zoom: 2.8, 
            ease: RoughEase.ease.config({ template:  Power1.easeOut, strength: 0.2, points: 50, taper: "in", randomize: false, clamp: true}),
            onComplete: () => {
                
            },
            onUpdate: () => {
                if (this.holdAttackTween._time > 1.5) { // si >1.5 active ready to attack lorsque release mouse
                    this.readyToHit = true;
                    //  t > (1 + cHitLow) && t < (1 + cHitLow + cHitEnd) ? carw.tint = 0x00ff00 : carw.tint = 0xff0000;
                };
            }
        });
        // huds slots fusion
        $huds.combats.fusion_combatSlots();
    };

    /** stop cancel focus attack target release hold */
    clearFocusAttack(){
        this.holdAttackTween && this.holdAttackTween.kill();
        this.holdAttackTween = null;
        $player.spine.s.state.setEmptyAnimation(3, 0.2);
        this.setSelectTarget(this._selectedTarget);
        $huds.combats.show_combatSlots();
        $huds.combats.show_combatIcons()
        
        $stage.interactiveChildren = true;
    };



    /**Eval et compute les infliger,influer pour return des valeur de combat */
    computeDammage(source,target,actionSetup,options={}){
        options.crt = source.isCriticalHit(target);
        options.eva = target.isEvade(source);
        // values tracker 
        const tracker = {
            values:[],
            get total(){return this.values.reduce((t,v)=>t+v)}
        }
        actionSetup.baseA.computeValue(tracker,options);
        actionSetup.baseB.forEach(baseB => { baseB.computeValue(tracker,options) });
        return tracker
        //booster
        //# le trackeur copy les st source, et module les valeur states pour ensuite fair un calcule effectif
       /* const values_base = {
            track_values:[], // track les valeur par interation des contexts
            track_context:[], // track les states contexts par interation des contexts
            base:0, // valeur final apret l'evaluations.
            miss:false, // invocateur miss
            crt:false, // invocateur critique 
            update(value,from){
                this.track_values.push(value);
                this.track_context.push(from);
                Number.isFinite(value) && (this.base+=value);
            }
        };
        infliger.base.forEach(state => {
            state.computeValue(values_base,st,options); // value,useContext,min,max
        });
        console.log('value_base: ', value_base);*/
    };
    /** Configure la victoire et les bonus */
    setupVictory(){
        $huds.stamina.hide();
        $huds.pinBar.hide();
        $player.s.state.setAnimation(3, "victory", true);
        $camera.moveToTarget($player,10,1)
        TweenLite.to($stage.scene.background.n, 2, { alpha:0.6, ease: Power4.easeOut });

        let monsters = this.monsters.filter(m=>m); // TODO: FILTRER LES MONSTRE EVADER
        let total_xp = monsters.map(m=>m._xp).reduce((t,n)=>t+n); 
        let total_po = monsters.map(m=>m._po).reduce((t,n)=>t+n);
        $huds.victory.show(total_xp,total_po,monsters);
    };

    /** Combat terminer, Reverse Initialisator */
    exitCombat(){
        $player.s.state.setEmptyAnimation(3, 1);
        TweenLite.to($stage.scene.background.n, 0.4, { alpha:1, ease: Power4.easeOut }); // back normal alpha or scene map
        $camera.moveToTarget($player,0,2,Power4.easeOut);
        $stage.scene.removeChild(...this.foodItemMap); // remove les foods comats
        this.intitialize_environement(true);
        //$huds.stamina.show();
        //$huds.pinBar.show();
    };

    /** remove me , debug combat mode */ //FIXME: delete me
    debug(){
        const debugChara = [$player,...this.monsters];
        const debugTxt = debugChara.forEach((c)=>{
            const playerTxtTime = new PIXI.Text(`${~~c._battleTime}/${this._battleTurnTime}`,{fill:"white",fontSize:32,strokeThickness:4});//title text
            c.p.addChild(playerTxtTime);
            c.debugCombatSpeed = playerTxtTime;
        })
        PIXI.ticker.shared.add((delta) => {
            debugChara.forEach(c => { c.debugCombatSpeed.text =  `${~~c._battleTime}/${this._battleTurnTime}` });
         },void 0, 	PIXI.UPDATE_PRIORITY.HIGH);

    }
};

let $combats = new _combats();
console.log1('$combats', $combats);



