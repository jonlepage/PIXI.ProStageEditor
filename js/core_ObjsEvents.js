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
                if(dataValues.p.groupID === 'case'){
                    cage.localCaseID = this.list_cases.length;
                    this.list_cases.push(cage);
                    const cageColor = new PIXI.Sprite(dataBase.textures.cColor);
                    cageColor.parentGroup = PIXI.lights.diffuseGroup;
                    cageColor.position.y = cage.pivot.y+25;
                    cageColor.pivot.set(cageColor.width/2,cageColor.height/2);
                    cageColor.tint = 0x3dce08 //red:0xf20202;
                    const cageColor_n = new PIXI.Sprite(dataBase.textures_n.cColor_n);
                    cageColor_n.parentGroup = PIXI.lights.normalGroup;
                    cageColor_n.position.y = cage.pivot.y+25;
                    cageColor_n.pivot.set(cageColor.width/2,cageColor.height/2);
                    cage.addChild(cageColor,cageColor_n);
                    cageColor_n.blendMode = 2;
                    //TODO: creer un system de couleur relatif au gemDice par couleur. Les couleur autorise certain case pour le path finding.
                    // DELETE ME, TEST DEBUGAGE
                    cage.caseColor = dataValues.p.textureName === 'white'? false : dataValues.p.textureName;
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
    computePathTo (target) {
        const playerCase = $player.inCase;
        const pathInterval = []; //
        const patternFromInterval = []; // store path id pattern
        const nodes = {};
        const autorisedColors = $huds.displacement.diceColors;
        Object.keys(this.list_cases).forEach(k => { // k: local id
            const c = this.list_cases[k];
            //TODO: creer un system de couleur relatif au gemDice par couleur. Les couleur autorise certain case pour le path finding.
            // DELETE ME, TEST DEBUGAGE
            nodes[k] = c.pathConnexion;
            /*if(autorisedColors.contains(c.caseColor)){
                nodes[k] = c.pathConnexion;
            };*/
            
        });
        const pattern = this.findShortestPath(nodes, this.list_cases.indexOf(playerCase), this.list_cases.indexOf(target)) || [];
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



    extractKeys(obj) {
		return Object.keys(obj);
	};

	sorter(a, b) {
		return parseFloat (a) - parseFloat (b);
    };

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

    findShortestPath(map, s,e) {
        const nodes = [s,e];
        let start = nodes.shift(),
            path = [],
		    end,
		    predecessors,
		    shortest;
		while (nodes.length) {
			end = nodes.shift();
			predecessors = this.findPaths(map, start, end);
			if (predecessors) {
				shortest = this.extractShortest(predecessors, end);
				if (nodes.length) {
					path.push.apply(path, shortest.slice(0, -1));
				} else {
					return path.concat(shortest);
				}
			} else {
				return null;
			}
			start = end;
		}
    }

	findPaths(map, start, end) {
        const costs = {}, predecessors = {};
        let open = {'0': [start]}, keys;
		costs[start] = 0;
		while (open) {
			if(!(keys = this.extractKeys(open)).length) break;
			keys.sort(this.sorter);
			let key = keys[0],
			    bucket = open[key],
			    node = bucket.shift(),
			    currentCost = parseFloat(key),
			    adjacentNodes = map[node] || {};
			if (!bucket.length) delete open[key];
			for (const vertex in adjacentNodes) {
                let cost = adjacentNodes[vertex],
                    totalCost = cost + currentCost,
                    vertexCost = costs[vertex];
                if ((vertexCost === void 0) || (vertexCost > totalCost)) {
                    costs[vertex] = totalCost;
                    this.addToOpen(totalCost, vertex, open);
                    predecessors[vertex] = node;
                };
			};
		};
        if (costs[end] === void 0) { return null; } 
        else { return predecessors; };
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
        //FIXME:  create a l'avance tous les id possible , un json ?
        !this.executedCaseFromMapID[1] ? this.executedCaseFromMapID[1] = [] : void 0;
        const localCaseID = inCase.localCaseID;
        const mapID = 1;
        const executedCases = this.executedCaseFromMapID[mapID];
        const isAlrealyExecuted = executedCases.contains(localCaseID);
        if(isAlrealyExecuted){
            // do nothing, the case are alrealy executed
        }else{
            // execute the case bonus
            executedCases.push(localCaseID);
            console.log('executedCases: ', executedCases);
        };
       
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