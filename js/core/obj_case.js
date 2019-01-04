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
    constructor(dataValues,localID,globalID,arrayID) {
        super(dataValues,localID,globalID,arrayID);
        /**@description la couleur type selon les reference couleur des gemDices. Use setter .colorType */
        this._colorType = null;
        this._actionType = null;
    };

    set colorType(color){ this._colorType = color };
    set actionType(action){ this._actionType = action };
    
    
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




}

