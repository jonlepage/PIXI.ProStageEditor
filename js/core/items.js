/*:
// PLUGIN □──────────────────────────────□ITEMS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/
/* {type}   
    all      : permet de mettre pinner n'importquel type de items
    diceGem  : oubligatoire d 'en agarder un , permet de pinner les diceGem pour naviger dans le jeux
    food     : la nourriture permet d'etre mixer a des diceGem pour revigorer la faim, la soif. En combat , elle peut deconcentrer ou empoisoner un monstre
    plant    : les plante sont surtout medicinal, elle augment, diminnue et soigne des etas
    mineral  : les mineral sont utile pour fabriquer des dices ou augmenter le LV des Tools. Peut egalement service a de la constructions
    alchemie : utiliser pour fabriquer des items, booster, keys magic. Peut egalement fabriquer des nouvelle magie
    builder  : materieux permetant de fabriquer , des ponts, routes, arme, ... update des batiments..
    tools    : outils pour les interaction et les action dans l'environements, certain outils seron limiter par leur nombre
    keys     : objet collection unique permetant la progressio ndu storyboard.
*/
/*
┌------------------------------------------------------------------------------┐
  GLOBAL $items CLASS: _items
  Controle les items du jeux
└------------------------------------------------------------------------------┘
┌□COLORIMETRIX□─────────────────────────────────────-HexReference-─────────────────────────────────────────────────────────────────────────┐
  #d8a757, #f46e42, #f4eb41, #b241f4, #f44197, #f4415e, #b71f37, #b71e1e, #b7af1d, #f28a0c, #aed0f9, #dd2b01, #eb0e4b, #c37665, #a74313, #c5e264, 
  #cc9b99, #c85109, #fedcb4, #a36506, #a0ff0c, #a000d0, #a00000, #ADB6BE, #B24387 ,#BBC15D ,#FA8965 ,#F3EE1E ,#CC301D
└──────────────────────────────────────────────────────□□□□□□□□□───────────────────────────────────────────────────────────────────────────┘
*/
/** class items manager */
class _items {
    constructor() {
        this.types = { // also used for menu filters
            all     :{tint:0xffffff},
            diceGem :{tint:0x425bd9},
            food    :{tint:0xc42626},
            plant   :{tint:0x40b312},
            mineral :{tint:0xb7b7b7},
            alchemie:{tint:0xbb42f3},
            builder :{tint:0x8a5034},
            tools   :{tint:0x464646},
            keys    :{tint:0x584615},
        };
        /** items trouver et posseder, register dinamic car les non trouve reste cacher */
        this.itemPossed = {0:4,1:0,2:0,12:0,13:0,14:0,15:99}; //TODO: debug only: ajouter quelque item deja decouvert
        /** le nombre de pin color posseder, les pinColor, il permette de colorer les pinSlot*/
        this.pinColorPossed = {
            all      :0,
            diceGem  :0,
            food     :0,
            plant    :0,
            mineral  :0,
            alchemie :0,
            builder  :0,
            tools    :0,
            keys     :0,
        };
        /** container list of items data class by id */
        this.list = [];
    };

    /** initialise the dataBase items */
    initialize(id){
        const data = $Loader.SCV.dataItems.data;
        const header = data[1]; // index du header ["_id", "_idn", "_iType", "_cType", "_value", "_weight", "_dmg", "note"]
        for (let i=2, l=data.length; i<l; i++) { this.list.push( new _item_base(...data[i])) };
    };


};

const $items = new _items();
console.log1('$items', $items);


class _item_base {
    constructor(_id, _idn, _iType, _cType, _value, _weight, _dmg, note) {
        this._id = _id;
        /** Nom utilise dans core seulment */
        this._idn = _idn;
        /** le type de item pour les filtres */
        this._iType = _iType;
        /** le type de couleur du item, pour les gem et leur force*/
        this._cType = _cType;
        /** la valeur de vente general $*/
        this._value = _value;
        /** le poid du items*/
        this._weight = _weight;
         /** les dammage du item si utiliser dans combat infliger*/
        this._dmg = Number.isFinite(_dmg)?_dmg : _dmg&&_dmg.split(',').map((n)=>+n)||0;
        /** store les sprite container diffuse et normal */
        this.child = {};
        this.initialize();
    };
    get p() {return this.child.c};
    get d() {return this.child.d};
    get n() {return this.child.n};
    /** obtien le dammage minimal de l'item */
    get minDMG() {return Array.isArray(this._dmg)? Math.min(...this._dmg) : this._dmg || 0 };
    /** obtien le dammage maximal de l'item */
    get maxDMG() {return Array.isArray(this._dmg)? Math.max(...this._dmg) : this._dmg || 0 };
    /** renvoi un dammage direct ou range selon _dmg */
    get dmg() {return Array.isArray(this._dmg)? Math.randomFrom(...this._dmg) : this._dmg || 0 };
    /** return text name from text Database localisation */
    get name() {return this._idn }; //TODO:
    /** objtien la quaniter posseder du items */
    get qty() {return $items.itemPossed[this._id] || 0 };
    /** obtien la valeur marchande du week-end ou de la planet */
    get value() {return this._value || 0 };
    /** obtien le poid de l'item */
    get weight() {return this._weight || 0 };
    /** verefy si le items a deja eter poseder et trouver */
    get finded() {return $items.itemPossed.hasOwnProperty(this._id); };


    initialize(){
        this.createSprites();
    };

    /** creer un sprite de base attacher en cache et attache au item pour menue */
    createSprites(clone){ // clone permet de creer un nouvelle item sprite en cache
        const c = new PIXI.Container();
        const d = c.d = new PIXI.Sprite($Loader.Data2.gameItems.textures[this._id]);
        const n = c.n = new PIXI.Sprite($Loader.Data2.gameItems.textures[this._id+'_n']);
        d.anchor.set(0.5),n.anchor.set(0.5);
        //c.parentGroup = $displayGroup.group[4];
        d.parentGroup = PIXI.lights.diffuseGroup;
        n.parentGroup = PIXI.lights.normalGroup;
        c._id = this._id, c.name = this._idn; // debug
        c.addChild(d,n);
        if(clone){
            c.dataLink = this; //? verifier si nessesaire ?
            return c;
        }else{
            this.child = {c,d,n}; // ref
        };
    };

};