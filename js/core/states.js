
/**Le states manager permet de creer asigner distribruer les states */
//generate des sprites states
class _statesManager {
    constructor() {
       this.ref = { // data ref pour chaque states
            poison:{ //data2/Objets/gameItems/SOURCE/images/2.png
                nameID:'st5afb_N' ,
                descID:{from:'dawfaw3425',active:'dafa3q32'}, //from: lorsque peut asigner, lorsque que actif
                texture:'st_poison',
            },
       };
       this.create = {
            get poison  (){ return new _stateSprite('poison' ) },
            get attack  (){ return new _stateSprite('attack' ) },
            get defense (){ return new _stateSprite('defense') },
       };
    };
 
};
const $states = new _statesManager();

/**Les states son les status temporaire ou asigner en jeux qui contienne des methods */
class _state {
    constructor(name,data){
        this._name = name;
        this._data = data;
    }
};