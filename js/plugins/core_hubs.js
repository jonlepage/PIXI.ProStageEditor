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
class _huds{
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
        // creates all hubs [displacements,stats,]
        this.hudsList.displacements = new _huds_displacement();
        this.hudsList.pinBar        = new _huds_pinBar      ();
        this.hudsList.stats         = new _huds_stats       ();
        this.menuList.menuItems     = new _menu_items       ();
    };

    // get avaible huds and menues return array for addchilds
    getHubsList () {
        const list = [];
        this.displacement && list.push(this.displacement);
        this.pinBar       && list.push(this.pinBar      );
        this.stats        && list.push(this.stats       );
        this.menuItems    && list.push(this.menuItems   );
        return list;
    };


};

$huds = new _huds();
console.log1('$huds', $huds);



