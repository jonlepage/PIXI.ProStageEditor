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
    constructor(data,localID,globalID,arrayID) {
        super(data,localID,globalID,arrayID);
        /**@description la couleur type selon les reference couleur des gemDices. Use setter .colorType */
        this._colorType = null;
        this._actionType = null;

       
    };

    set colorType(color){ this._colorType = color };
    
    
    initialize(mapInfluencer,totalCases,dificulty){
        this.init_baseColor(mapInfluencer,totalCases,dificulty);
    }

    // ini cases color from data:
    init_baseColor(mapInfluencer,totalCases,dificulty){
        // couleur asigner selon l'editeur,saveGame, ou generer de facon aleatoir selon les facteur mapInfluenceData
        const data = this.data;
        let color = data.p.defaultColor || null ; // || TODO: check dans la save game? saveGameData.mapID.case.color....?? 
        // si aucune couleur asigner par editeur ou save game, generer selon le facteur de la map et player luck, selon la class de depart
        if(!color){
            const tmc = totalCases; // total map case
            const tgc = $objs.colorsSystem.length; // total games colors
            for (const colorKey in mapInfluencer) {
                const seed = mapInfluencer[colorKey];
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
            
            mapInfluencer['white'].count++;
            return this.colorType = 'white';
        };
    };
}

