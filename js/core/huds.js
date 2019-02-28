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
        this.stats = new _huds_stats();
        this.stamina = new _huds_displacement();
        this.pinBar = new _huds_pinBar();
        this.menuItems = new _menu_items();
        this.combats = new _huds_combats();
        
    };
    // getters,setters
    get list_u() { return {stats:this.stats} }; // return only UI
    get list_m() { return {} }; // return only MENU
    // initialise all huds and menues from Scene_Boot.prototype.initialize

    initialize () {
        Object.values(this).forEach(hud => {
            hud.initialize();
            $stage.addChild( hud );
            hud.parentGroup =  $displayGroup.group[4];
        });
        // initialize all avaible huds class
       // if(typeof _huds_displacement === "function"){ this.hudsList.displacements = new _huds_displacement () };
       // if(typeof _huds_pinBar       === "function"){ this.hudsList.pinBar        = new _huds_pinBar       () };
       // if(typeof _huds_stats        === "function"){ this.hudsList.stats         = new _huds_stats        () };
       // if(typeof _huds_combats      === "function"){ this.combats                = new _huds_combats      () };
       // if(typeof _menu_items        === "function"){ this.menuList.menuItems     = new _menu_items        () };
       // for (const key in this.hudsList) { $stage.CAGE_GUI.addChild( this.hudsList[key] ) };
       // for (const key in this.menuList) { $stage.CAGE_GUI.addChild( this.menuList[key] ) };
    };


    setInteractive(value){
        this.displacement.setInteractive(value);
        this.pinBar.setInteractive(value);
        this.stats.setInteractive(value);
    }
};

let $huds = new _huds();
console.log1('$huds', $huds);



