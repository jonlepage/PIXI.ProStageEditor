/*:
// PLUGIN □──────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/

/*
┌------------------------------------------------------------------------------┐
  GLOBAL $huds CLASS: _huds
  Controls and manage all bases class hubs 
└------------------------------------------------------------------------------┘
*/
class _huds {
    constructor() {
        this.hudsList = {};
        this.menuList = {};
    };
    // getters,setters
    get displacement() { return this.hudsList.displacements };
    get pinBar      () { return this.hudsList.pinBar        };
    get stats       () { return this.hudsList.stats         };
    get menuItems   () { return this.menuList.menuItems     };
    // initialise all huds and menues from Scene_Boot.prototype.initialize
    initialize () {
        // initialize all avaible huds class
        if(typeof _huds_displacement === "function"){ this.hudsList.displacements = new _huds_displacement () };
        if(typeof _huds_pinBar        === "function"){ this.hudsList.pinBar        = new _huds_pinBar        () };
        if(typeof _huds_stats         === "function"){ this.hudsList.stats         = new _huds_stats         () };
        if(typeof _menu_items         === "function"){ this.menuList.menuItems         = new _menu_items         () };
        for (const key in this.hudsList) { $stage.CAGE_GUI.addChild( this.hudsList[key] ) };
        for (const key in this.menuList) { $stage.CAGE_GUI.addChild( this.menuList[key] ) };
    };
};

$huds = new _huds();
console.log1('$huds', $huds);



