/*:
// PLUGIN □────────────────────────────────□OBJS SPRITES , ANIMATIONS, SPINES, EVENTS ...□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Manage ,create game objs and events for Scene stage
* V.1.0
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘

*/
// ┌-----------------------------------------------------------------------------┐
// GLOBALFROM $objs CLASS: dataObj_case HERITAGE:dataObj_base
//└------------------------------------------------------------------------------┘
class dataObj_case extends dataObj_base{
    constructor(dataValues,dataBase,textureName) {
        super(dataValues,dataBase,textureName);
        /**@description la couleur type selon les reference couleur des gemDices. Use setter .colorType */
        this._colorType = null;
        this._actionType = null;
        this._visited = false; // indique si la case actionType a deja eter executer ?
    };

    set caseColor(color){ };
    get caseColor(){ };
    set caseType (type ){ };
    get caseType (){ };
    
    // extend create sprite from Container_Tile
    createBases(){
        const dataBase = this.dataBase; // getter
        //color
        const cd = new PIXI.Sprite(dataBase.textures.cColor);
        const cn = new PIXI.Sprite(dataBase.textures_n.cColor_n);
            cd.parentGroup = PIXI.lights.diffuseGroup;
            cn.parentGroup = PIXI.lights.normalGroup;
            cd.anchor.set(0.5,1.2);
            cn.anchor.set(0.5,1.2);
        // type
        const td = new PIXI.Sprite( PIXI.Texture.EMPTY ); //$Loader.Data2.caseEvents.textures.caseEvent_hide);
        const tn = new PIXI.Sprite( PIXI.Texture.EMPTY ) // $Loader.Data2.caseEvents.textures_n.caseEvent_hide_n);
            td.parentGroup = PIXI.lights.diffuseGroup;
            tn.parentGroup = PIXI.lights.normalGroup;
            td.anchor.set(0.5,1.2);
            tn.anchor.set(0.5,1.2);
        return {cd,cn,td,tn};
    };

    getDataValuesFrom (cage) {
        const dataValues = super.getDataValuesFrom(cage); // get default dataValues
        Object.assign(dataValues.p, this.getParentValues_case (cage) )
        return dataValues;
    };  
    
    // les data du parentContainer pour les dataObj_case  .p
    getParentValues_case(cage){
        return {
            caseColor        :cage? cage.caseColor        : false , // couleur case
            caseType         :cage? cage.caseType         : null  , // type event associer (bounty)
            randomStartColor :cage? cage.randomStartColor : false , // bootGame allow random value based on planet and dificulty
            randomTurnColors :cage? cage.randomTurnColors : false , // allow random color per turn
            randomStartType  :cage? cage.randomStartType  : false , // bootGame allow random value based on planet and dificulty
            randomTurnType   :cage? cage.randomTurnType   : false , // allow random type per turn
        };
    };

    initialize(mapColorInfluencer,mapActionInfluencer,totalCases,dificulty){
        this.init_baseColor(mapColorInfluencer,totalCases,dificulty);
        this.init_baseAction(mapActionInfluencer,totalCases,dificulty);
    }

    // ini cases color from data:
    init_baseColor(mapColorInfluencer,totalCases,dificulty){
        // couleur asigner selon l'editeur,saveGame, ou generer de facon aleatoir selon les facteur mapInfluenceData
        const dataValues = this.dataValues;
        let color = dataValues.p.defaultColor || null ; // || TODO: check dans la save game? saveGameData.mapID.case.color....?? 
        // si aucune couleur asigner par editeur ou save game, generer selon le facteur de la map et player luck, selon la class de depart
        if(!color){
            const tmc = totalCases; // total map case
            const tgc = $objs.colorsSystem.length; // total games colors
            for (const colorKey in mapColorInfluencer) {
                const seed = mapColorInfluencer[colorKey];
                const ran = ~~(Math.random()*100);
                if(seed.min>-1 && seed.count<seed.min){
                    seed.count++;
                    return this.colorType = colorKey;
                }else
                if(seed.max>-1 && seed.count<seed.max){
                    seed.count++;
                    return this.colorType = colorKey
                }else
                if(seed.count!==seed.max && ran<seed.rate){
                    seed.count++;
                    return this.colorType = colorKey
                }
            };
            
            mapColorInfluencer['white'].count++;
            return this.colorType = 'white';
        };
    };

    init_baseAction(mapActionInfluencer,totalCases,dificulty){
        // couleur asigner selon l'editeur,saveGame, ou generer de facon aleatoir selon les facteur mapInfluenceData
        const dataValues = this.dataValues;
        let action = dataValues.p.defaultCaseEventType || null ; // || TODO: check dans la save game? saveGameData.mapID.case.color....?? 
        if(!action){

            for (const actionKey in mapActionInfluencer) {
                const seed = mapActionInfluencer[actionKey];
                const ran = ~~(Math.random()*100);
                if(seed.min>-1 && seed.count<seed.min){
                    seed.count++;
                    return this.actionType = actionKey;
                }else
                if(seed.max>-1 && seed.count<seed.max){
                    seed.count++;
                    return this.actionType = actionKey;
                }else
                if(seed.count!==seed.max && ran<seed.rate){
                    seed.count++;
                    return this.actionType = actionKey;
                }
            };
            
            mapActionInfluencer['caseEvent_gold'].count++;
            return this.actionType = 'caseEvent_gold';
        };
    };

    setInteractive(value,addOn){
        const c = this.parentContainer;
        c.interactive = value;
        if(addOn){
            c.on('pointerover' , this.pointer_In  ,this);
            c.on('pointerout'  , this.pointer_Out ,this);
            c.on('pointerup'   , this.pointer_Up  ,this);
        }
    };


    pointer_In (e) {
        const c = e.currentTarget;
        if(!c.conditionInteractive || c.conditionInteractive()){
            c.pointerIn = true;
            c.alpha = 1;
            $huds.displacement._stamina && this.computePathTo(c); // si on a stamina, on peut ce deplacer
        };
    };
    
    pointer_Out(e) {
        const c = e.currentTarget;
        if(c.pointerIn){
            c.pointerIn = false;
            c.alpha = 1;
            // clearn pattern cases
            if(this.pathBuffer){
                const cages = $objs.cases; // getter
                for (let i = this.pathBuffer.length; i--;) {
                    const id = this.pathBuffer[i];
                    cages[id].d.tint = 0xffffff;
                    cages[id].d._filters = [];
                 };
                 this.pathBuffer = null;
            };
        };
    };
    
    pointer_Up(e) {
        const c = e.currentTarget;
        if(c.pointerIn && this.pathBuffer){
            // start move path
            $objs.setInteractive(false);
            $player.initialisePath(this.pathBuffer);
        };
    };


    // calcule le chemin vers un target
    computePathTo(target) {
        const playerCase = $player.inCase;
        // map all path connextion , only if allowed by conditionInteractive of the case
        const cages = $objs.cases; // getter
        const globalPathConnextions = cages.map((c) => {
            if(!c.conditionInteractive || c.conditionInteractive()){return c.pathConnexion};
        }); // nodeConnextions
        const startCaseID = $player.inCase.DataLink.id.arrayID;
        const endCaseID = target.DataLink.id.arrayID;
        const pattern = this.findShortestPath(globalPathConnextions, startCaseID, endCaseID) || [];
        //const pattern = this.dfs(this.list_cases, 0, );

        const allowed = $huds.displacement._stamina;
        const greenFilter = new PIXI.filters.OutlineFilter (6, 0x1c6600, 1);
        const redFilter = new PIXI.filters.OutlineFilter (8, 0x660000, 1);
        for (let i = pattern.length; i--;) {
            const id = pattern[i];
            if(i>allowed){
                //this.list_cases[id].d.tint = 0xa03d21;
                cages[id].d._filters = [redFilter]
            }else{
                //this.list_cases[id].d.tint = 0x42f465;
                cages[id].d._filters = [greenFilter]
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


    // creer un FX sur la case
    playFX_landing(){
        const textureName = "casesHitsG";
        const dataBase = $Loader.Data2.caseFXhit1;
        var fx = new Container_Animation(null,dataBase,'casesHitsG');
        // hack FIXME:
            fx.parentGroup = $displayGroup.group[1];
           fx.position.copy(this.parentContainer.position);
           fx.pivot.y = -145;
           //fx.zIndex = fx.y-1;
            fx.scale.set(0.8,0.8)
        this.parentContainer.parent.addChild(fx);
        fx.d.onComplete = ()=>{
            fx.parent.removeChild(fx);
        }
        fx.loop = false;
        fx.play(0);
    };

    // TRY execute _actionType de la case, appelle normalement pas la $player
    executeCaseType(){
        if(this._visited){
            // malus , retour sur case visited
        }else{
            this._visited = true;
            this.executeCaseEventTypeFrom();
        }
    };

    // execution de levent type
    executeCaseEventTypeFrom(){
        //TODO: fair un eventCase Managers
        $player.spine.s.state.addAnimation(3, "visiteCase", false);
        const ctd = this.parentContainer.Sprites.ctd;
        const ctn = this.parentContainer.Sprites.ctn;
        ctd.parentGroup = $displayGroup.group[4];
        TweenLite.to(ctd.position, 1.2, { y:ctd.y-300, ease: Expo.easeOut });
        TweenLite.to(ctd.scale, 1.4, { x:2,y:2, delay:0.3,ease: Elastic.easeOut.config(1, 0.3),onComplete:()=>executeEvent() });
        function executeEvent(){
            // set to taked
            ctd.renderable = false;
            ctn.renderable = false;
            $player.spine.s.state.addEmptyAnimation(3,0.4);
            /*if(inCase.caseEventType === "caseEvent_gold"){
                console.log('recive gold:', ~~(Math.random(100)*100));
            }
            if(inCase.caseEventType === "caseEvent_monsters"){
                console.log('start Combats', 'monster ???');
                $combats.intitialize(inCase.dataCase);
            }*/
        };
    };

      

};//END CLASS

