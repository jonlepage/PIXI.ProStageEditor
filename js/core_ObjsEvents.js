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
// GLOBAL $Objs CLASS: _objs
//└------------------------------------------------------------------------------┘
class _objs{
    constructor() {
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

    createObjsFrom(className) {
        const dataObjs = $Loader.DataScenes[className]._objs;
        // clear objs
        this.list_master = [];
        this.list_cases  = [];
        if(dataObjs){
            for (let i=0, l=dataObjs.length; i<l; i++) { // (i) are local id
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
                    throw console.error(`fatal error in json, check the {'type'}!`)
                };
                this.list_master[i] = cage;
                //TODO: METTRE DANS PIXI.CageContainer CONTAINER DATA MANAGER
                if(dataValues.p.dataName === 'cases'){
                    cage.localCaseID = this.list_cases.length;
                    this.list_cases.push(cage);
                };
            };
        };
        this.setupTweens();
        this.setupInteractions();
    };

    setupTweens(){

    }

    setupInteractions(){
        this.list_cases.forEach(c => {
            c.on('pointerover', this.pointer_overIN, this);
            c.on('pointerout', this.pointer_overOUT, this);
            c.on('pointerup', this.pointer_UP, this);
        });
        this.setInteractive(true);
    };

    setInteractive(value) {
        this.list_cases.forEach(c => {
            c.interactive = value;
        });
    };

    pointer_overIN (e) {
        e.currentTarget.alpha = 1;
        $huds.displacement._stamina && this.computePathTo(e.currentTarget); // si on a stamina, on peut ce deplacer
    };
    
    pointer_overOUT(e) {
        e.currentTarget.alpha = 1;
        // clearn pattern cases
        if(this.pathBuffer){
            this.pathBuffer = null;
            for (let i = this.list_cases.length; i--;) {
                this.list_cases[i].d.tint = 0xffffff;
                this.list_cases[i].d._filters = [];
             };
        };
    
    };
    
    pointer_UP(e) {
        if(this.pathBuffer){
            //TODO: MOVE PLAYER
            this.setInteractive(false);
            $player.initialisePath(this.pathBuffer);
        }
    };

    //TODO: RENDU ICI , ADD DRAW MODE PATH CONNEXTIONS in editors
    // calcule le chemin vers un target
    computePathTo(target) {
        const playerCase = $player.inCase;
        const pathInterval = []; //
        const patternFromInterval = []; // store path id pattern
        //const nodes = {};
        const autorisedColors = $huds.displacement.diceColors;
        /*Object.keys(this.list_cases).forEach(k => { // k: local id
            const c = this.list_cases[k];
            //TODO: creer un system de couleur relatif au gemDice par couleur. Les couleur autorise certain case pour le path finding.
            // DELETE ME, TEST DEBUGAGE
            nodes[k] = c.pathConnexion;
            
        });*/
        const gloabalVariable_murMaisonDetruit = false;
        const globalEventStoryCheck_murMaisonDetruit = ()=>{return gloabalVariable_murMaisonDetruit}; // permetre d'assotion des events global qui check les variable
        $Objs.list_cases[8].visibleIfCondition = globalEventStoryCheck_murMaisonDetruit; // asign la condition events


        const globalPathConnextions = this.list_cases.map((c,id) => {
            // if $globalVariable.mur = true;
            if(!c.visibleIfCondition || c.visibleIfCondition() ){return c.pathConnexion}
            
        }); // nodeConnextions
        const startCaseID = $player.inCase.localCaseID;
        const endCaseID = target.localCaseID;
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

    executeCaseFrom(inCase){
        //FIXME:  create a l'avance tous les id possible , un json ? GLOBAL GAME
        const mapID = 1;
        !this.executedCaseFromMapID[mapID] ? this.executedCaseFromMapID[mapID] = [] : void 0; //TODO: create index mapScene1

        const localCaseID = inCase.localCaseID;
        if(!this.executedCaseFromMapID[mapID][localCaseID]){ // if caseEventType never executed befor?
            this.executedCaseFromMapID[mapID][localCaseID] = true;
            this.executeCaseEventTypeFrom(inCase);
        }else{

        }
       
    };

    executeCaseEventTypeFrom(inCase){
        //TODO: fair un eventCase Managers 
        if(inCase.caseEventType === "caseEvent_gold"){
            console.log('recive gold:', ~~(Math.random(100)*100));
        }
        // set to taked
        inCase.SpritesCageEventType.d.renderable = false;
        inCase.SpritesCageEventType.n.renderable = false;
        
       
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

};// END CLASS
$Objs = new _objs();
console.log1('$Objs: ', $Objs);