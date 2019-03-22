
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
class _combats{
    constructor() {
        /** le combat est oficielment commencer?  */
        this._started = false;
        this._active = false; // in combat mode indicator
        this.monsters = []; // store current reference of monster
        this.tikers = null; // the combat ticker update ?
        this.turnTimeMax = 0; // temp max limit par tour base sur stamina
        /**indique et memorise le monstre ou target selectionner */
        this._selectedTarget = null;
        this.currentTurnChara = null; // lorsque turnTimeMax asign un turn a un joueur
        this.modes = ['attack','defense','magic']; // mode qui existe en combat
        /** le active mode selectionner */
        this._mode = null; // le cobat mode current 
        /** Environement sprites buffers: les elements afficher et cacher */
        this.environement = {hides:[],shows:[],cases:[]};
    };
    
    // initialise combat, creer monstre et huds
    intitialize(dataMonsterList){
        dataMonsterList = dataMonsterList || _dataMonsters.getRanDataMonsterList(); 
        $systems.inCombat = true; // setter
        $stage.interactiveChildren = true;
        this.intitialize_monsters(dataMonsterList);
        this.intitialize_environement(); // prepare l'environement de combat
        this.debug();
    };
    //TODO: RENDU ICI , regarder les tiks qui renderer et alpha trop to, ce qui creer un flicks
    /** generate and setup monster */
    intitialize_monsters(dataMonsterList){
        for (let i=0, l=dataMonsterList.length; i<l; i++) {
            const baseData = dataMonsterList[i];
            const monster = new _monsters(baseData.mID, baseData.lv);
            this.monsters.push(monster);
            $camera.scene.addChild(this.monsters[i].p);
        };
    };

    /** execute les methods preparatoire du combat lier a l'environement. */
    intitialize_environement(){
        this.setupVisibleHiding();
        this.setupFilters();
        this.setupCases();
        this.setupMonsters();
        this.setupTurnTimeLine();
        this.setupCombatHuds();
    };

    
    /** asigne un emplacement strategique dans l'environement au monstre */
    setupMonsters(){
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
                monster.p.x<$player.p.x? monster.s.scale.x = -1 : void 0;
                monster.inCase = c;
                usedCID.push(c);
                ranList.length = 0; // break while
            };
        });
    };

    /** calcule et trouve les case potentiel en combat */
    setupCases(){
        const pX = $player.p.x;
        const pY = $player.p.y;
        const inDistX = 1920/2*0.5;//0.6: the combat good zoom
        const inDistY = 1080/2*0.5;
        $player.p.getBounds();
        // map un array list avec les case potentiel pour afficher les ennemy
        const potentialCase = $objs.cases_s.filter(c => Math.abs(c.x-pX)<inDistX && Math.abs(c.y-pY)<inDistY );
        this.environement.cases = potentialCase;
  
    };

    /** buffering des sprites objets que on garde visible ou cacher pour combate */
    setupVisibleHiding(){
         // FIXME: probleme lumiere alpha 0;
        $objs.list_s.forEach(c => {
            c.dataObj.p.visibleInCombat || c.dataObj.b.dataType === "Grass"? this.environement.shows.push(c) : this.environement.hides.push(c);
        });
    };

    /** ajoute filtre blur au background et certain elements */
    setupFilters(){
        // filter blur fx for background
        const kBlur =  $systems.filtersList.KawaseBlurFilter_combatBG;
        $stage.scene.background.d._filters = [kBlur];
        $stage.scene.background.n._filters = [kBlur];
    };

    /** calcul les limite de tour base sur le stamina */
    setupTurnTimeLine(){
        this._turnTimeMax = 0;
        this.monsters.forEach(monster => {
            this._turnTimeMax+=monster.st.sta;
        });
        this._turnTimeMax+= $player.st.sta;
        // assign a tous les personage la limite
        this.monsters.forEach(monster => {
            monster._battleturnSta = this._turnTimeMax;
        });
        $player._battleturnSta = this._turnTimeMax;
        const combatTicksSpeed = 1000; // TODO: option combat speed 
        // creer un tikers qui defenir le tour des chara en combat;
        this.combatTimeLine = PIXI.ticker.shared.add((delta) => { this.update(delta) });
    };

    /** ajoute les huds a la sceneMap sur le player*/
    setupCombatHuds(){
        const sList = $huds.combats.childList.scene;
        $stage.scene.addChild(...sList);
        $huds.combats.initialize_Interactive();
    };
        
    // update from tikers combatTimeLine, dispatch turn
    update(delta){
        if(this._started){
            let nextTurn = this.checkTurn();
            if(nextTurn && !this.currentTurnChara){
                this.startTurn(nextTurn) 
            };
        }

    };

    /** dispatch les turn selon le sta et la valeur turnTimeMax */
    checkTurn(delta){
        if(this.currentTurnChara){return false}; // si un tour en en cour, stanby
        if($player._battleturnSta<=0){
            return $player;
        };
        for (let i=0, l=Object.keys(this.monsters).length; i<l; i++) {
            const monster = this.monsters[i];
            if(monster._battleturnSta<=0){
                return monster;
            };
        };
        // turn a person... donc on reduit les _battleturnSta avec les sta
        const combatSpeed = $systems.gameOptions._combatSpeed;
        $player._battleturnSta-=$player.st.sta/combatSpeed;
        this.monsters.forEach(monster => {
            monster._battleturnSta-= monster.st.sta/combatSpeed;
        });
    };

    /**Start Combat and animations FX after timeout executeCaseEventTypeFrom */
    start(){
        this._started = true;
        TweenLite.to($systems.filtersList.KawaseBlurFilter_combatBG, 3, {  blur:8, ease: Expo.easeOut });
        TweenLite.to(this.environement.hides, 2, { alpha:0, ease: Expo.easeOut });
        TweenLite.to(this.environement.cases, 2, { alpha:1, ease: Expo.easeOut });
    };

    /** demmare le tour d'une cible target */
    startTurn(target){
        this.currentTurnChara = target;
        $huds.combats.setupToTargetTurn(target);
        $huds.combats.setCombatModeTo(null);

        // si player 1 turn
        if(target === $player){

            
        };
        // si monster turn
        if(target !== $player){

        }
    };


    hitTo(monsterID){
        // si pas de monster id passer, ces un appelle depuit player events, on utilise le current monster target
        if(!monsterID){
            this.monsters[this.cmtID].playHit();
        }
    };

    /** defenir le mode comat selon un mode: tous ce que ne touche pas au combat huds */
    setCombatModeTo(mode){
        this._mode = mode; // defeni le mode combat 
        if (mode === this.modes[0]){ //! attack mode
            this.environement.cases.forEach((c)=>{ 
                c.interactive = false;
                TweenLite.to(c, 2, { alpha:0.3, ease: Expo.easeOut });
            });
            this.monsters.forEach((monster)=>{ monster.p.interactive = true; });
            $camera.moveToTarget($player,9,5);
        };
        if(!mode){
            $camera.moveToTarget($player,7,5);
            this._selectedTarget = null;
        }

    };

    selectedMonster(monster){
        this._selectedTarget = monster;
        $camera.moveToTarget(monster,8,5);
        $player.setReversXFrom(monster);
        $huds.combats.show_combatBox(monster);
    };

    /** event call from global mouse interaction */
    pUP_global(e){
        const isClickR = e.data.button === 2; // clickRight ==>
        // si click droite et a un mode combat, disable mode 
        if(isClickR && this._mode){
            $huds.combats.setCombatModeTo(null);
        }
    };

    /** remove me , debug combat mode */ //FIXME: delete me
    debug(){
        const debugChara = [$player,...this.monsters];
        const debugTxt = debugChara.forEach((c)=>{
            const playerTxtTime = new PIXI.Text(`${~~c._battleturnSta}/${this._turnTimeMax}`,{fill:"white",fontSize:32,strokeThickness:4});//title text
            playerTxtTime.pivot.y = c.s.height;
            c.p.addChild(playerTxtTime);
            c.debugCombatSpeed = playerTxtTime;
        })
        this.combatTimeLine = PIXI.ticker.shared.add((delta) => {
            debugChara.forEach(c => { c.debugCombatSpeed.text =  `${~~c._battleturnSta}/${this._turnTimeMax}` });
         },void 0, 	PIXI.UPDATE_PRIORITY.HIGH);

    }
};

let $combats = new _combats();
console.log1('$combats', $combats);



