/*:
// PLUGIN □────────────────────────────────□OBJS SPRITES , ANIMATIONS, SPINES, EVENTS ...□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Manage ,create game objs and events for Scene stage
* V.1.0
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Permet de constuire des objets specifiques selon leur type.
Voir le Stages
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $Objs CLASS: _objs
//└------------------------------------------------------------------------------┘
class _objs{
    constructor() {
        this.list = []; //lists of case in current map
        this.current = null; // player current case
        this.filter = 
        {
            OutlineFilter_case0: new PIXI.filters.OutlineFilter(12, 0x000000),
            ShockwaveFilter: new PIXI.filters.ShockwaveFilter()
        }
    };
};
$Objs = new _objs();
console.log1('$Objs: ', $Objs);
