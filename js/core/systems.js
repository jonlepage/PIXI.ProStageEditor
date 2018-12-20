
/*:
// PLUGIN □────────────────────────────────□ SYSTEM CORE ENGINE □───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc manage all game systems informations
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $systems CLASS: _systems
//└------------------------------------------------------------------------------┘
/** @description indicateur de status dans le jeux */
class _systems{
    constructor() {
        /**@description indique si on est dans une phase de combats */
        this._inCombat = false;
        /**@description indique si un objet est tenu par la sourit */
        this._holdItem = false;

    };



    intitialize(){

    };


};
let $systems = new _systems();
console.log1('$systems', $systems);
