/*:
// PLUGIN □──────────────────────────────□ITEMS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/

/*
┌------------------------------------------------------------------------------┐
  GLOBAL $items CLASS: _items
  Controle les items du jeux
└------------------------------------------------------------------------------┘
*/
class _items{
    constructor() {
        
    };
    // getters,setters
    get items() { return this };

};

$items = new _items();
console.log1('$items', $items);

// initialise all huds and menues from Scene_Boot.prototype.initialize
_items.prototype.initialize = function() {
    // creates all hubs [displacements,stats,]
    this.hudsList.displacements = new _huds_displacement();
    this.hudsList.pinBar = new _huds_pinBar();
    this.hudsList.stats = new _huds_stats();
    this.menuList.menuItems = new _menu_items();
};
