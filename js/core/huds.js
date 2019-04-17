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
        this.victory = new _huds_victory();
        
    };
    // getters,setters
    get list_u() { return {stats:this.stats} }; // return only UI
    get list_m() { return {} }; // return only MENU
    // initialise all huds and menues from Scene_Boot.prototype.initialize

    initialize () {
        Object.values(this).forEach(hud => {
            hud.initialize();
            $stage.CAGE_GUI.addChild( hud );
        });
    };


    setInteractive(value){
        this.displacement.setInteractive(value);
        this.pinBar.setInteractive(value);
        this.stats.setInteractive(value);
    }

};

let $huds = new _huds();
console.log1('$huds', $huds);



