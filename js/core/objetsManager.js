/*:
// PLUGIN □────────────────────────────────□OBJS SPRITES , ANIMATIONS, SPINES, EVENTS ...□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Manage ,create game objs and events for Scene stage
* V.1.0
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Permet de constuire des objets specifiques selon leur type.
Classer egalement par categorie d'interaction. ex: tree,plant,door
Gestionnaire de construiction global des sprites du jeux
Voir le Stages
*/
// penser a faire un local et global ID
// ┌-----------------------------------------------------------------------------┐
// GLOBAL $objs CLASS: _objs
//└------------------------------------------------------------------------------┘
class _objs{
    constructor() {
        // game case types possibility data2\Divers\caseEvents\caseEvents.png
        this._caseTypes = {
            actions:[ // allowed random computing
                'caseEvent_gold', //data2\Divers\caseEvents\SOURCE\images\caseEvent_gold.png
                'caseEvent_teleport', //data2\Divers\caseEvents\SOURCE\images\caseEvent_teleport.png
                'caseEvent_map', //data2\Divers\caseEvents\SOURCE\images\caseEvent_map.png
                'caseEvent_timeTravel', //data2\Divers\caseEvents\SOURCE\images\caseEvent_timeTravel.png
                'caseEvent_buffers', //data2\Divers\caseEvents\SOURCE\images\caseEvent_buffers.png
                'caseEvent_miniGames', //data2\Divers\caseEvents\SOURCE\images\caseEvent_miniGames.png
                'caseEvent_monsters', //data2\Divers\caseEvents\SOURCE\images\caseEvent_monsters.png
            ],
            perma:[ // case logique, random not allowed
                'caseEvent_quests', //data2\Divers\caseEvents\SOURCE\images\caseEvent_quests.png
                'caseEvent_exitV', //data2\Divers\caseEvents\SOURCE\images\caseEvent_exitV.png
                'caseEvent_exitH', //data2\Divers\caseEvents\SOURCE\images\caseEvent_exitH.png
                'caseEvent_door', //data2\Divers\caseEvents\SOURCE\images\caseEvent_door.png
            ]
        };
        // game case colors possibility
        this._caseColors = [
            'red'   , //:0xff0000, #ff0000
            'green' , //:0x00ff3c, #00ff3c
            'blue'  , //:0x003cff, #003cff
            'pink'  , //:0xf600ff, #f600ff
            'purple', //:0x452d95, #452d95
            'yellow', //:0xfcff00, #fcff00
            'black' , //:0x000000, #000000
            'white' , //:0xffffff, #ffffff
        ];
        this._dataFromMaps = []; // maps scenes data
        this._dataFromScenes = []; // special scenes data

        this.statisticFromMaps = [];
        this.bufferPathFX = []; // store FX for case hover ?!
        // les objets par scene reste statics, et ne peuve etre suprimer
        this.list_master = []; // Full Objs Lists
        this.list_cases  = []; // store only case
        this.executedCaseFromMapID = []; // see executeCaseFrom
        //this.list_noEvents = [];
        //this.list_events = [];
        //this.list_cases = [];
        this.pathBuffer = null; // buffer path to move 
    };
  

    /** Prepare les datas pour tous les cases random procedural events, */
    initialize(){
        const dataScenes = $Loader.DataScenes;
        Object.keys(dataScenes).forEach(ds => {
            if(ds.contains('Scene_Map')){  // if scenes map data ?
                const id = +ds.split('Scene_Map')[1];
                const objs = dataScenes[ds]._objs;
                this._dataFromMaps[id] = {
                    objs,
                    _cases:[],
                };
                // duplicate new case data
                const dataFromMap = this._dataFromMaps[id];
                for (let i=0, l=objs.length; i<l; i++) {
                    const obj = objs[i];
                    switch (obj.p.groupID) {
                        case 'case':
                            dataFromMap._cases.push({
                                gID:i,
                                lID:dataFromMap._cases.length,
                                data:obj,
                                lID:dataFromMap._cases.length,
                                visited:false,
                                reveal:true
                            });
                            break;
                        default:
                            break;
                    }
                };
            }else{ // if special scenes data
                const objs = dataScenes[ds]._objs;
                this._dataFromScenes[ds] = {
                    objs,
                };
            }
        });
        this.computeNewRandomGame();
    };

    // create new random game with options dificulty , generate random
    computeNewRandomGame(dificulty,randomFactor,bonus) {
        // randomize case events TODO: add more math logic to percent % global game dificulty
        this._dataFromMaps.forEach(map => {
            map._cases.forEach(c => {
                c._caseColor = c.data.p.defaultColor || this._caseColors[7]//~~(Math.random()*this._caseColors.length)];
                c._caseType = c.data.p.defaultCaseEventType || this._caseTypes.actions[~~(Math.random()*this._caseTypes.actions.length)];
            });
        });
    };

    // map1 start
    createObjsFrom(className) {
        // reset TODO: add destroy events conextion listener for memory leak
        this.list_master = [];
        this.list_cases  = [];
        const mapID = +className.split('Scene_Map')[1];
        const dataObjs = mapID? this._dataFromMaps[mapID].objs : this._dataFromScenes[className].objs;
        if(dataObjs){// generation des sprites avec une base avant les data procedural random
            this.setup_masters(dataObjs);
            mapID && this.setup_cases(mapID); // apply random newGame data
        };
    };

    // setup master base for all sprites objs
    setup_masters(dataObjs){
        for (let i=0, l=dataObjs.length; i<l; i++) {
            const dataValues = dataObjs[i];
            const dataName = dataValues.p.dataName;
            const textureName = dataValues.p.textureName;
            const dataBase = $Loader.Data2[dataName];
            let cage;
            switch (dataBase.type) {
                case "animationSheet":
                cage = new PIXI.ContainerAnimations(dataBase, textureName, dataValues);break;
                case "spineSheet":
                cage = new PIXI.ContainerSpine(dataBase, textureName, dataValues);break;
                case "tileSheet":
                cage = new PIXI.ContainerTiles(dataBase, textureName, dataValues);break;
                default:
                throw console.error(`FATAL error in json, check the {'type'}!`)
            };
            cage.id = i;
            this.list_master[i] = cage;
            if(dataName==="cases"){this.list_cases.push(cage)};
        };
    };

    // setuping case for master TODO: rendu ici, aligner les sprite type setCaseEventType, les textures, et creer 7un swap pour les cases explorers pas le joueur
    setup_cases(mapID){
        const dataCases = this._dataFromMaps[mapID]._cases;
        // IF IS A CASE EVENT?
        for (let i=0, l=dataCases.length; i<l; i++) {
            const dataCase = dataCases[i];
            const gID = dataCase.gID; // global id
            const cage = this.list_master[gID];
            cage.setCaseColorType(dataCase._caseColor);
            cage.setCaseEventType(dataCase._caseType);
            cage.dataCase = dataCase;
            cage.interactive = true; //TODO: METTRE DANS UN SETUP INTERACTIVE TRUE:FALSE
            cage.on('pointerover' , this.pointer_inEventCase ,this);
            cage.on('pointerout'  , this.pointer_outEventCase,this);
            cage.on('pointerup'   , this.pointer_upEventCase ,this);
        };
        //TODO: Faire un sprite pour les door, et tous les portes pourront etre interactive
        /*if(dataValues.p.textureName === 'doorf2cc'){
            cage.interactive = true;
            cage.on('pointerover', $objs.pointer_inEventDoor , cage);
            cage.on('pointerout' , $objs.pointer_outEventDoor, cage);
            cage.on('pointerup'  , $objs.pointer_upEventDoor , cage);
        }*/
    };


    pointer_inEventCase (e) {
        const c = e.currentTarget;
        if(!c.conditionInteractive || c.conditionInteractive()){
            c.pointerIn = true;
            c.alpha = 1;
            $huds.displacement._stamina && this.computePathTo(c); // si on a stamina, on peut ce deplacer
        };
    };
    
    pointer_outEventCase(e) {
        const c = e.currentTarget;
        if(c.pointerIn){
            c.pointerIn = false;
            c.alpha = 1;
            // clearn pattern cases
            if(this.pathBuffer){
                this.pathBuffer = null;
                for (let i = this.list_cases.length; i--;) {
                    this.list_cases[i].d.tint = 0xffffff;
                    this.list_cases[i].d._filters = [];
                 };
            };
        }

    };
    
    pointer_upEventCase(e) {
        const c = e.currentTarget;
        if(c.pointerIn && this.pathBuffer){
            $player.initialisePath(this.pathBuffer);
        };
    };


    // calcule le chemin vers un target
    computePathTo(target) {
        const playerCase = $player.inCase;
        const gloabalVariable_murMaisonDetruit = false; //TODO: DELETE ME
        // map all path connextion , only if allowed by conditionInteractive of the case
        const globalPathConnextions = this.list_cases.map((c) => {
            if(!c.conditionInteractive || c.conditionInteractive()){return c.pathConnexion};
        }); // nodeConnextions
        const startCaseID = $player.inCase.dataCase.lID;
        const endCaseID = target.dataCase.lID;
        const pattern = this.findShortestPath(globalPathConnextions, startCaseID, endCaseID) || [];
        //const pattern = this.dfs(this.list_cases, 0, );

        const allowed = $huds.displacement._stamina;
        const greenFilter = new PIXI.filters.OutlineFilter (6, 0x1c6600, 1);
        const redFilter = new PIXI.filters.OutlineFilter (8, 0x660000, 1);
        for (let i = pattern.length; i--;) {
            const id = pattern[i];
            if(i>allowed){
                //this.list_cases[id].d.tint = 0xa03d21;
                this.list_cases[id].d._filters = [redFilter]

            }else{
                //this.list_cases[id].d.tint = 0x42f465;
                this.list_cases[id].d._filters = [greenFilter]
            }
        };
        this.pathBuffer = pattern || null;
    };


    // parcour chemin invers a partir du IDcase end et trouver connext vers ID start
    extractShortest(predecessors, end) {
        const nodes = [];
        let u = end;
		while (u !== void 0) {
			nodes.push(u);
			u = predecessors[u];
		};
		nodes.reverse();
		return nodes;
	};

    addToOpen(cost, vertex, open) {
        const key = "" + cost;
        if (!open[key]) open[key] = [];
        open[key].push(+vertex);
    }

    findShortestPath(globalPathConnextions, startCaseID, endCaseID) {
        const nodes = [startCaseID,endCaseID];
        let startID      = nodes.shift();
        let path         = []           ;
        let endID        = null         ;
        let connectedIDList = null         ;
        let shortest     = null         ;
		while (nodes.length) { // force one pass
			endID = nodes.shift();
			connectedIDList = this.findPaths(globalPathConnextions, startID, endID); // 
			if (connectedIDList) {
				shortest = this.extractShortest(connectedIDList, endID);
				if (nodes.length) {
					path.push.apply(path, shortest.slice(0, -1));
				} else {
					return path.concat(shortest); // finish succeed
				}
			} else { return null }; // break
			startID = endID;
		}
    }

	findPaths(globalPathConnextions, startID, endID) {
        const costs = {};
        const connectedIDList = {};
        let open = {'0': [startID]}; // id:start
        let keys = null;
		costs[startID] = 0;
		while (open) {
			if(!(keys = Object.keys(open)).length) break;
			keys.sort((a,b)=>{return parseFloat (a) - parseFloat (b)});
            let key = keys[0];
            let bucket = open[key];
            let node = bucket.shift();
            let currentCost = parseFloat(key);
            let adjacentNodes = globalPathConnextions[node] || {};
			if (!bucket.length) delete open[key];
			for (const vertex in adjacentNodes) {
                let cost = adjacentNodes[vertex],
                    totalCost = cost + currentCost,
                    vertexCost = costs[vertex];
                if ((vertexCost === void 0) || (vertexCost > totalCost)) {
                    costs[vertex] = totalCost;
                    this.addToOpen(totalCost, vertex, open);
                    connectedIDList[vertex] = node;
                };
			};
		};
        if (costs[endID] === void 0) { return null; } 
        else { return connectedIDList; };
    };
    

    getDirXFromId (id1,id2) {
        if (Number.isFinite(id1) && Number.isFinite(id2) ){
            const c1 = this.list_cases[id1].x;
            const c2 = this.list_cases[id2].x;
            return c1<c2 && 6 || c2<c1 && 4 || false;
        };
        return false;
    };


    newHitFX() { //TODO: FIXME:
        const textureName = "casesHitsG";
        const dataBase = $Loader.Data2.caseFXhit1;
        const dataValues = PIXI.CageContainer.prototype.getDataValues(dataBase, textureName);
        dataValues.p.parentGroup = 1;
        var fx = new PIXI.ContainerAnimations(dataBase, textureName,dataValues);
         fx.parentGroup = $displayGroup.group[1];
         fx.position.set(this.x,this.y);
         fx.pivot.y = -140;
         fx.zIndex = fx.y-1;
         fx.scale.set(0.8,0.8)
        this.parent.addChild(fx);
    };

    // try execute case not visited
    executeCaseFrom(inCase){
        if(inCase.dataCase.visited){
            // malus , retour sur case visited
        }else{
            inCase.dataCase.visited = true;
            this.executeCaseEventTypeFrom(inCase);
        }
    };

    executeCaseEventTypeFrom(inCase){
    //TODO: fair un eventCase Managers
    $player.spine.d.state.addAnimation(3, "visiteCase", false);
    inCase.Sprites.ctd.parentGroup = $displayGroup.group[4];
    TweenLite.to(inCase.Sprites.ctd.position, 1.2, { y:inCase.Sprites.ctd.y-300, ease: Expo.easeOut });
    TweenLite.to(inCase.Sprites.ctd.scale, 1.4, { x:2,y:2, delay:0.3,ease: Elastic.easeOut.config(1, 0.3),onComplete:()=>executeEvent() });
    function executeEvent(){
        // set to taked
        inCase.Sprites.ctd.renderable = false;
        inCase.Sprites.ctn.renderable = false;
        $player.spine.d.state.addEmptyAnimation(3,0.4);
        if(inCase.caseEventType === "caseEvent_gold"){
            console.log('recive gold:', ~~(Math.random(100)*100));
        }
        if(inCase.caseEventType === "caseEvent_monsters"){
            console.log('start Combats', 'monster ???');
            $combats.intitialize(inCase.dataCase);
        }

    }

    };

    destroy(obj, destroy) { // can be obj or string
        if(typeof obj === "object" ){
            const index = this.list_master.indexOf(obj);
            if(index>-1){
                this.list_master.splice(index, 1);
                obj.parent.removeChild(obj);
                destroy ? obj.destroy() : void 0;
            }
            return index;
        };
    };

    pointer_inEventDoor(){
        console.log('pointer_inEventDoor: ');
        const greenFilter = new PIXI.filters.OutlineFilter (6, 0xffffff, 1);
        this.d._filters = [greenFilter];

    }
    pointer_outEventDoor(){
        console.log('pointer_outEventDoor: ');
        this.d._filters = null;
    }
    pointer_upEventDoor(){
        if(this.skew.y<0){
            TweenLite.to(this.skew, 1, { ease: Power1.easeOut, y: 0 });
            TweenLite.to(this.scale, 1, { ease: Power1.easeOut, x: 0.9 });
            //TODO: DELEME, TEST MESSAGE BOX
            $messages.intitialize('pancart_p1m1_01'); // shew messages events
        }else{
            TweenLite.to(this.skew, 3, { ease: Elastic.easeOut.config(1, 0.3), y: -0.8 }) ;
            TweenLite.to(this.scale, 0.5, { ease: Power1.easeOut, x: 1.2 });
        };
    }

    // get from obj unique name
    getCase_FromName(name){
        for (let i=0, l=this.list_cases.length; i<l; i++) {
            if( this.list_cases[i].name === name){ return this.list_cases[i] };
        };
        throw console.error('the case name not existe',name);
    };


    setInteractive(value){
        for (let i=0, l=this.list_master.length; i<l; i++) {
            if(this.list_master[i]._eventsCount){ this.list_master[i].interactive = value }; 
        };
    };

    //TODO: deleteMe, test performance cacher quelque sprites a la camera
    testHideOnlySpriteInCamera(value){
        for (let i=0, l=this.list_master.length-20; i<l; i++) {
            this.list_master[i].renderable = false;
        };
    }

};// END CLASS
$objs = new _objs();
console.log1('$objs: ', $objs);