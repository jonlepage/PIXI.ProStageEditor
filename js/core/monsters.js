// ┌-----------------------------------------------------------------------------┐
// GLOBAL $monstersData: _monstersData
// manage data when creat new monster
//└------------------------------------------------------------------------------┘
class _monstersData {
    constructor() {
        this.id = [];
        this.id[1] = { //data2\Characteres\monster\m1\m1.png
            _name:"divinom",
            _type:"plante",
            _desc:"Lorem ipsum dolor sit amet, consecconsectetur",
            _level : 1    ,
            _hp    : 100  ,//data2\Hubs\stats\SOURCE\images\hp_icon.png
            _mp    : 100  ,//data2\Hubs\stats\SOURCE\images\mp_icon.png
            _atk   : 3    ,//data2\Hubs\stats\SOURCE\images\atk_icon.png
            _def   : 2    ,//data2\Hubs\stats\SOURCE\images\def_icon.png
            _sta   : 3    ,//data2\Hubs\stats\SOURCE\images\sta_icon.png
            _lck   : 3    ,//data2\Hubs\stats\SOURCE\images\lck_icon.png
            _int   : 3    ,//data2\Hubs\stats\SOURCE\images\int_icon.png
            _orbSensibility   : ['red'],
        }
    };
};
$monstersData = new _monstersData();
console.log1('$monstersData: ', $monstersData);


// ┌------------------------------------------------------------------------------┐
// GLOBAL $monsters: _monsters
// create new monster battler
//└------------------------------------------------------------------------------┘
class _monsters {
    constructor(id,lv) {
        this.database = $Loader.Data2['m'+id];
        this._id = id;
        this._lv = lv;
        this.stats = $monstersData.id[id];
        this.sprite = null;
        this.initialize();
    };
    get x( ){ return this.sprite.x     };
    get y( ){ return this.sprite.y     };
    set x(x){ return this.sprite.x = x };
    set y(y){ return this.sprite.y = y };
    set z(z){ return this.sprite.zIndex = z };

    initialize() {
        const cage = new PIXI.ContainerSpine(this.database); // (database,skin)
        cage.d.state.setAnimation(0, "apear", false);
        cage.d.state.addAnimation(0, "idle", true);
        cage.parentGroup = $displayGroup.group[1];
        this.sprite = cage;
        cage.scale.set(0.2,0.2)
    };
};


