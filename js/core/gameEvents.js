/*:
// PLUGIN □──────────────────────────────□CORE GAMEEVENTS□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** 
*
*/
/**
 * This is a description of the MyClass constructor function.
 * @class _gameEventss
 * @classdesc GLOBAL $items
 */
class _gameEvents {
    constructor() {
        this.getEventList = () => {return Object.getOwnPropertyNames(this.__proto__)};
    };

};


$gameEvents = new _gameEvents();
console.log1('$gameEvents', $gameEvents);


/**
 * This is a description of the MyClass constructor function.
 * @global $gameVariables
 * @class _gameVariables
 * @classdesc GLOBAL $gameVariables
 */
class _gameVariables {
    constructor() {
        /**Quand on detruit les block de mur droite de la maison, permet a la case detre interactive et aussi rentrer dans la grotte*/
        this._wallMaisonDroiteDetuits = false; 
    };

};


$gameVariables = new _gameVariables();
console.log1('$gameVariables', $gameVariables);
