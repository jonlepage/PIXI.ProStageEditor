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

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $Objs CLASS: _objs
//└------------------------------------------------------------------------------┘
class _objs{
    constructor() {
        this.list_master = []; // Full Objs Lists
        //this.list_noEvents = [];
        //this.list_events = [];
        this.list_cases = [];
        this.pathBuffer = null; // buffer path to move 
    };
};
$Objs = new _objs();
console.log1('$Objs: ', $Objs);

//$Objs.initialize();
_objs.prototype.initialize = function(list) {
    this.list_master = [];
    this.list_cases = [];
    if(list){
        // TODO: RENDU ICI, PEUT ETRE fair un dispatch all in one [list_masterm, list_cases....]
        this.create_list_master(list); //create: list_master
        this.create_list_cases(list); //create: list_cases
    };
};

_objs.prototype.create_list_master = function(list) {
    for (let i=0, l=list.length; i<l; i++) {
        const dataValues = list[i];
        const textureName = dataValues.p.textureName;
        const dataBase = $Loader.Data2[dataValues.p.dataName];
        let cage;
        switch (dataValues.p.type) {
            case "animationSheet":
            cage =  new PIXI.ContainerAnimations(dataBase, textureName, dataValues);break;
            case "spineSheet":
            cage =  new PIXI.ContainerSpine(dataBase, textureName, dataValues);break;
            default:
            cage =  new PIXI.ContainerTiles(dataBase, textureName, dataValues);break;           
        }
        this.list_master.push(cage);
    };
};

_objs.prototype.create_list_cases = function() {
    this.list_cases = this.getCases();
    this.list_cases.forEach(c => {
        c.interactive = true;
        c.on('pointerover', this.pointer_overIN, this);
        c.on('pointerout', this.pointer_overOUT, this);
        c.on('pointerup', this.pointer_UP, this);
        
    });
};


// TODO: $Objs.disableInteractive();
_objs.prototype.activeInteractive = function() {
    this.list_cases.forEach(c => {
        c.interactive = true;
    });
};


// TODO: $Objs.disableInteractive();
_objs.prototype.disableInteractive = function() {
    this.list_cases.forEach(c => {
        c.interactive = false;
    });
};




// TODO:  need buffers cache
_objs.prototype.newHitFX = function() {
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

_objs.prototype.pointer_overIN = function(e) {
    e.currentTarget.alpha = 1;
    this.newHitFX.call(e.currentTarget);
    $huds.displacement._stamina && this.computePathTo(e.currentTarget); // si on a stamina, on peut ce deplacer
};

_objs.prototype.pointer_overOUT = function(e) {
    e.currentTarget.alpha = 1;
    // clearn pattern cases
    if(this.pathBuffer){
        this.pathBuffer = null;
        for (let i = this.list_cases.length; i--;) {
            this.list_cases[i].d.tint = 0xffffff;
         };
    };

};

// TODO: faire un sytem global event manager et interaction dans mouse
_objs.prototype.pointer_UP = function(e) {
    if(this.pathBuffer){
        //TODO: MOVE PLAYER
        this.disableInteractive();
        $player.initialisePath(this.pathBuffer);
    }
};

//TODO: RENDU ICI , ADD DRAW MODE PATH CONNEXTIONS in editors
// calcule le chemin vers un target
_objs.prototype.computePathTo = function(target) {
    const playerCase = $player.inCase;
    const pathInterval = []; //
    const patternFromInterval = []; // store path id pattern
    const nodes = {};
    Object.keys(this.list_cases).forEach(k => {
        nodes[k] = this.list_cases[k].pathConnexion;
    });
    const pattern = findShortestPath(nodes, this.list_cases.indexOf(playerCase), this.list_cases.indexOf(target));
    //const pattern = this.dfs(this.list_cases, 0, );

    const allowed = $huds.displacement._stamina;
    for (let i = pattern.length; i--;) {
        const id = pattern[i];
        if(i>allowed){
            this.list_cases[id].d.tint = 0xa03d21;
        }else{
            this.list_cases[id].d.tint = 0x42f465;
        }
        
    };
    this.pathBuffer = pattern || null;
};

// TODO: reprend le system unique ID
// il doi pouvoir suprimer un obj, mais pouvoir en recreer un au meme id
// dc: distance connextion .js

// custom dijkstra algo
//   const pattern = findShortestPath(nodes, 0, this.list_cases.indexOf(target));
    function extractKeys(obj) {
		return Object.keys(obj);
	};

	function sorter(a, b) {
		return parseFloat (a) - parseFloat (b);
    };

    function extractShortest(predecessors, end) {
        const nodes = [];
        let u = end;
		while (u !== void 0) {
			nodes.push(u);
			u = predecessors[u];
		};
		nodes.reverse();
		return nodes;
	};

    function addToOpen(cost, vertex, open) {
        const key = "" + cost;
        if (!open[key]) open[key] = [];
        open[key].push(+vertex);
    }

    function findShortestPath(map, s,e) {
        const nodes = [s,e];
        let start = nodes.shift(),
            path = [],
		    end,
		    predecessors,
		    shortest;
		while (nodes.length) {
			end = nodes.shift();
			predecessors = findPaths(map, start, end);
			if (predecessors) {
				shortest = extractShortest(predecessors, end);
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

	function findPaths(map, start, end) {
        const costs = {}, predecessors = {};
        let open = {'0': [start]}, keys;
		costs[start] = 0;
		while (open) {
			if(!(keys = extractKeys(open)).length) break;
			keys.sort(sorter);
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
                    addToOpen(totalCost, vertex, open);
                    predecessors[vertex] = node;
                };
			};
		};
        if (costs[end] === void 0) { return null; } 
        else { return predecessors; };
	};
    
    

  // get dir from x1 => x2, can be factored by 10-dir
_objs.prototype.getDirXFromId = function(id1,id2) {
    if (Number.isFinite(id1) && Number.isFinite(id2) ){
        const c1 = this.list_cases[id1].x;
        const c2 = this.list_cases[id2].x;
        return c1<c2 && 6 || c2<c1 && 4 || false;
    };
    return false;
};
    // get dir from y1 => y2, can be factored by 10-dir
  _objs.prototype.getDirYFromId = function(id1,id2) {
    if(!id2 || this.list_cases[id1].y === this.list_cases[id2].y){
        return 0;
    };
    return this.list_cases[id1].y<this.list_cases[id2].y && 6 || 4;
};



// add general attributs
_objs.prototype.addAttr_default = function(cage, Data_Values, d, n, Data, textureName){
   // asign group display
   cage.parentGroup = $displayGroup.group[Data_Values.parentGroup]; //TODO: add to json addAttr_default
   cage.zIndex = Data_Values.zIndex;
   
   d.parentGroup = PIXI.lights.diffuseGroup;
   n.parentGroup = PIXI.lights.normalGroup;
   // reference
   cage.Sprites = {d:d,n:n};
   cage.name = Data.name;
   cage.Type = Data.type;
   cage.TexName = textureName || false;
   d.name = textureName;
   n? n.name = textureName+"_n" : void 0;

   cage.addChild(d);
   n && cage.addChild(n);
};

_objs.prototype.getsByID = function(id) {
    const list = [];
    for (let i=0, l=this.list_master.length; i<l; i++) {
        this.list_master[i].groupID === id && list.push(this.list_master[i]);
    };
    return list;
};

_objs.prototype.getsByName = function(name) {
    for (let i=0, l=this.list_master.length; i<l; i++) {
        if(this.list_master[i].name === name){
            return this.list_master[i];
        } 
    };
    return null;
};

// get list from type : "spineSheet", "animationSheet", "tileSheet"
_objs.prototype.getsByType = function(type) {
    const list = [];
    for (let i=0, l=this.list_master.length; i<l; i++) {
        this.list_master[i].Type === type && list.push(this.list_master[i]);
    };
    return list;
};

// get all cases 
_objs.prototype.getCases = function() {
    const list = [];
    for (let i=0, l=this.list_master.length; i<l; i++) {
        this.list_master[i].groupID === "case" && list.push(this.list_master[i]);
    };
    return list;
};

// get list from type : "spineSheet", "animationSheet", "tileSheet"
_objs.prototype.getsSheetLists = function() {
    const list = [];
    for (let i=0, l=this.list_master.length; i<l; i++) {
        !list.contains( this.list_master[i].name ) && list.push(this.list_master[i].name);
    };
    return list;
};

// get list from type : "spineSheet", "animationSheet", "tileSheet"
_objs.prototype.destroy = function(obj, destroy) { // can be obj or string
    if(typeof obj === "object" ){
        const index = this.list_master.indexOf(obj);
        if(index>-1){
            this.list_master.splice(index, 1);
            obj.parent.removeChild(obj);
            destroy ? obj.destroy() : void 0;
            console.log('obj.destroy: ', obj.destroy);
        }
        return index;
    };
};