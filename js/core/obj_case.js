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
    constructor(dataBaseName,textureName,dataValues,register) {
        super(dataBaseName,textureName,dataValues,register);
        /**@description la couleur type selon les reference couleur des gemDices. Use setter .colorType */
       // this._colorType = null;
       // this._actionType = null;
       // this._visited = false; // indique si la case actionType a deja eter executer ?
    };

    set caseColor(color){ this.setCaseColor(color) };
    get caseColor(){ return this.attache.caseColor };
    set caseType (type){ this.setCaseType(type) };
    get caseType (){ return this.attache.caseType };
    
    // extend on create base, special
    on_createBases(cage,dataBase){
        //color
        const cd = new PIXI.Sprite(dataBase.textures.cColor);
        const cn = new PIXI.Sprite(dataBase.textures_n.cColor_n);
        cd.alpha = 0.8;
        cn.alpha = 0.5;
            cd.parentGroup = PIXI.lights.diffuseGroup;
            cn.parentGroup = PIXI.lights.normalGroup;
            cd.anchor.set(0.5,1.2);
            cn.anchor.set(0.5,1.2);
        // type
        const td = new PIXI.Sprite( PIXI.Texture.EMPTY ); //$Loader.Data2.caseEvents.textures.caseEvent_hide);
        const tn = new PIXI.Sprite( PIXI.Texture.EMPTY );// $Loader.Data2.caseEvents.textures_n.caseEvent_hide_n);
        td.pivot.set(0,50);
        tn.pivot.set(0,47);
            td.parentGroup = PIXI.lights.diffuseGroup;
            tn.parentGroup = PIXI.lights.normalGroup;
            td.anchor.set(0.5,1.2);
            tn.anchor.set(0.5,1.2);

        cage.addChild(cd,cn,td,tn); //TODO: VERIFIER SI L'INDEX EST OK
        Object.assign(cage.Sprites,{cd,cn,td,tn});
    };

    getDataValues (fromCage) {
        const dataValues = super.getDataValues(fromCage); // get default dataValues
        Object.assign(dataValues.p, this.getParentValues_case (fromCage) )
        return dataValues;
    };  
    
    // les data du parentContainer pour les dataObj_case  .p
    getParentValues_case(fromCage){
        const cage = fromCage? this.attache : false;
        return {
            affine           : cage? cage.proj.affine : PIXI.projection.AFFINE.NONE , // hack Affine
            caseColor        : cage? cage.caseColor : false , // couleur case
            caseType         : cage? cage.caseType : null , // type event associer (bounty)
            randomStartColor : cage? cage.randomStartColor : false , // bootGame allow random value based on planet and dificulty
            randomTurnColors : cage? cage.randomTurnColors : false , // allow random color per turn
            randomStartType  : cage? cage.randomStartType : false , // bootGame allow random value based on planet and dificulty
            randomTurnType   : cage? cage.randomTurnType : false , // allow random type per turn
            pathConnexion    : cage? cage.pathConnexion : {} , // store path connect by id
        };
    };

    // initialise lorsque newGame, permet un random selon l'influen du system jeux et selon la map planet
    initialize(){
        const fromScene = this.register._sceneName; // check map name associed for this case data
        const dataInfluence = $systems.mapsInfluence[fromScene]; // get the dataInfluence from the map
        this.init_baseColor(dataInfluence);
        this.init_baseAction(dataInfluence);
    }

    // ini cases color from data:
    init_baseColor(dataInfluence){
        // couleur asigner selon l'editeur,saveGame, ou generer de facon aleatoir selon les facteur mapInfluenceData
        const defColor = this.p.caseColor;
        // si aucune couleur asigner par editeur ou save game, generer selon le facteur de la map et player luck, selon la class de depart
        if(!defColor){
            const tmc = dataInfluence._totalCase; // total map case
            const tgc = $systems.colorsSystem.length; // total games colors
            const color = $systems.colorsSystem[~~($systems.colorsSystem.length*Math.random())];
            this.p.caseColor = color;
        };
    };

    init_baseAction(mapActionInfluencer,totalCases,dificulty){
        // couleur asigner selon l'editeur,saveGame, ou generer de facon aleatoir selon les facteur mapInfluenceData
        const defType = this.p.caseType;
        if(!defType){
            /*for (const actionKey in mapActionInfluencer) {
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
            };*/
            
            const type = $systems.caseTypes.actions[~~($systems.caseTypes.actions.length*Math.random())];
            return this.p.caseType = type;
        };
    };

    destroyInteractive(){

    };

    setupInteractive (actived){
        const c = this.attache;
        if(c){
            c.on('pointerover' , this.pointer_In  ,this);
            c.on('pointerout'  , this.pointer_Out ,this);
            c.on('pointerup'   , this.pointer_Up  ,this);
            this.setInteractive(actived);
        };
    };

    setInteractive(actived){
        this.attache.interactive = !!actived;
    };

    // verify une list pour autoriser l'interactive ?
    checkConditionInteractive(){
        // si .. variable x est a ... si ...// if $huds.displacement._stamina && 
        return $huds.stamina._stamina > 0 && !$systems.inCombat;
    }

    pointer_In (e) {
        const c = e.currentTarget;
        $mouse.onCase = c;
        const f = $systems.filtersList.OutlineFilterx4white;
        c.d._filters = [f];
        c.pointerIn = true;
        c.alpha = 1;
        // build pathFinding
        if(this.checkConditionInteractive()){
            const spider = this.computePathTo(c); // si on un spider valide
            if(spider){
                const cList = $objs.cases_s; //TODO: FIXME: performance, mapper plutot avec des path local plutot que global
                $systems.activePath = spider.travel; // regist information in system
                for (let i=0, l=spider.travel.length; i<l; i++) {
                    const id = spider.travel[i];
                    const cage = cList[id];
                    // affiche les case possible selon stamina
                    if(i<=$huds.stamina._stamina){
                        TweenLite.to(cage, 0.4, { alpha:1, ease: Power4.easeOut } );
                        cage.d._filters = [$systems.filtersList.OutlineFilterx8Green];
                    }else{
                        TweenLite.to(cage, 0.4, { alpha:0.4, ease: Power4.easeOut } );
                        cage.d._filters = [$systems.filtersList.OutlineFilterx8Red];
                    }
                    
                };
                    
            }
        };
        TweenLite.to(c, 0.4, { alpha:1, ease: Power4.easeOut } );
    };
    
    pointer_Out(e) {
        const c = e.currentTarget;
        $mouse.onCase = null;
        const activePath = $systems.activePath;
        if(activePath){ // disable filter
            const cList = $objs.cases_s;
            for (let i=0, l=activePath.length; i<l; i++) {
                const cage = cList[activePath[i]];
                TweenLite.to(cage, 0.4, { alpha:1, ease: Power4.easeOut } );
                cage.d._filters = null;
            };
            $systems.activePath = null;
        }

        if(c.pointerIn){
            c.d._filters = null;
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
        if(c.pointerIn && $systems.activePath){
            // start move path
            $stage.interactiveChildren = false;
            $mouse.onCase = null; // disable le mouse case helper
            $systems.activePath.splice($huds.stamina._stamina+1); // remove les path selon stamina possible
            $player.initialisePath($systems.activePath);
        };
    };

    computePathTo(target){
        const cList = $objs.cases_s; // getter
        const startID = cList.indexOf($player.inCase.attache);
        const endID =  cList.indexOf(target);
        
        let nodeConextions = {}; // map all case with local conextion id
        for (let i=0, l=cList.length; i<l; i++) {
            const pathData = cList[i].pathConnexion;
            const id = cList.indexOf(cList[i]);
            nodeConextions[id] = pathData;
        };
        const visited = [startID]; // register des node visiter,
        const result = []; //final
        const spiders = [];
        let needClear = false; // optimisation, if a spider fail, need clear pass.
        spiders.push({
            id:spiders.length,
            preview:null,
            current:null,
            next:startID,
            travel:[], // indicateur parcouru
            parent:null,//heritage when node >3
            succeed:false,
            fail:false,
        });

        let succed = false;
        while (spiders.length && !succed) {
            // REMOVE FAIL SPIDERS
            if(needClear){
                needClear = false;
                spiders.forEach(s => { s.fail && spiders.remove(s) });
            };
            // COMPUTING NEXT SPIDER
            for (let i=0, l = spiders.length; i<l; i++) {
                const s = spiders[i];
                // update to next move
                s.preview = s.current;
                s.current = s.next;
                s.travel.push(s.next);
                s.next = null;
                if(s.current===endID){
                    s.succeed = true;
                    succed = s; // TODO: permetre multiple succed et comparer meilleur chemin
                }
                if(s.current===null){ s.fail = true; needClear = true};
                if( s.fail || s.succeed){ continue; };
                // prepare next
                const nextPath = Object.keys(nodeConextions[s.current]);
                // convert to number next pattern and remove visited;
                for (let i=0, l=nextPath.length; i<l; i++) { nextPath[i] = +nextPath[i]};
                // aussi longtemp que nextPath a plusieur node, les attribuer a d'aurte spider
                // repartition des next node,
                while (nextPath.length) {
                    const nextID = nextPath.pop();
                    if(!visited.contains(nextID)){
                        // si a deja recu son node, creer un nouvea spider
                        if(s.next === null){
                            s.next = nextID;
                        }else{
                            spiders.push({
                                id:spiders.length,
                                preview:null,
                                current:s.current,
                                next:nextID,
                                travel:[...s.travel],
                                parent:s.id,//heritage when node
                                succeed:false,
                                fail:false,
                            });
                            visited.push(nextID);
                        }
                        visited.push(nextID);
                    };
                };
            };
        };
       return succed;
    };

  /*
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
*/

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

    // defenir couleur number ou 'string'
    setCaseColor(color){
        const clist = $systems.colorsSystem;
        color = Number.isFinite(color) && clist[color] || color;
        if(clist.indexOf(color)<0){return console.error(`${color} n'existe pas dans $systems.colorsSystem`)}
        const c = this.attache;
        c.caseColor = color;
        // asign les couleur hex pour case seulement selon le color string
        let hexc;
        switch (color) {
            case 'white' : hexc=0xffffff; break;// #ffffff
            case 'red'   : hexc=0xff0000; break;// #ff0000
            case 'green' : hexc=0x00ff3c; break;// #00ff3c
            case 'blue'  : hexc=0x70a6ff; break;// #70a6ff
            case 'pink'  : hexc=0xf600ff; break;// #f600ff
            case 'purple': hexc=0x452d95; break;// #452d95
            case 'yellow': hexc=0xfcff00; break;// #fcff00
            case 'white' : hexc=0x000000; break;// #000000
            default:break;
        }
        hexc && (c.Sprites.cd.tint = hexc);
    };

    // defenir type number ou 'string'
    setCaseType(type){
        const tlist = $systems.caseTypes.list;
        type = Number.isFinite(type) && tlist[type] || type;
        if(tlist.indexOf(type)<0){return console.error(`${type} n'existe pas dans $systems.caseTypes`)}
        const c = this.attache;
        c.caseType = type;
        // swap textures TODO: player stats permetra de afficher les vrai icon ?
        c.Sprites.td._texture = $Loader.Data2.caseEvents.textures[type     ] ;
        c.Sprites.tn._texture = $Loader.Data2.caseEvents.textures_n[type+'_n'] ;
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
        //TODO: AUDIO SELON EVENTS
        $audio._sounds.laser_Rough_Up.play("sloteEvent_4");
        $audio._sounds.laser_Rough_Up.play("sloteEvent_4");
        TweenLite.to($stage.scene.audio.bgm, 3, { speed:0, ease: Expo.easeOut }); 

        //TODO: fair un eventCase Managers
        $player.spine.s.state.addAnimation(3, "visiteCase", false);
        const td = this.attache.Sprites.td;
        const tn = this.attache.Sprites.tn;
        td.parentGroup = $displayGroup.group[4];
        TweenLite.to(td.position, 2.5, { y:td.y-300, ease: Expo.easeOut, onComplete:()=>executeEvent() });
        TweenLite.to(td.scale, 1.4, { x:2,y:2, delay:0.3,ease: Elastic.easeOut.config(1, 0.3), });
        const dataMonsterList = _dataMonsters.getRanDataMonsterList(); //TODO: generer dans le boot.
        $combats.intitialize(dataMonsterList);
        const executeEvent = ()=>{
            // set to taked
            td.renderable = false;
            tn.renderable = false;
            $player.spine.s.state.addEmptyAnimation(3,0.4);
            $camera.moveToTarget($player,7,4);
            $combats.start();
          
            
            /*if(inCase.caseEventType === "caseEvent_gold"){
                console.log('recive gold:', ~~(Math.random(100)*100));
            }
            if(inCase.caseEventType === "caseEvent_monsters"){
                console.log('start Combats', 'monster ???');
                
            }*/
        };
    };

      

};//END CLASS

