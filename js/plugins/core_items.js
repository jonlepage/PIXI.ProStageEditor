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
┌□COLORIMETRIX□─────────────────────────────────────-HexReference-─────────────────────────────────────────────────────────────────────────┐
  #d8a757, #f46e42, #f4eb41, #b241f4, #f44197, #f4415e, #b71f37, #b71e1e, #b7af1d, #f28a0c, #aed0f9, #dd2b01, #eb0e4b, #c37665, #a74313, #c5e264, 
  #cc9b99, #c85109, #fedcb4, #a36506, #a0ff0c, #a000d0, #a00000, #ADB6BE, #B24387 ,#BBC15D ,#FA8965 ,#F3EE1E ,#CC301D
└──────────────────────────────────────────────────────□□□□□□□□□───────────────────────────────────────────────────────────────────────────┘
*/
class _items{
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
        this.totalGameItems = 0;
        this.itemsPossed = []; // player items possed
        // TODO: DELETE ME, give start items
        this.itemsPossed[0] = 25;
        this.itemsPossed[1] = 122;
        this.itemsPossed[3] = 0;
        this.itemsPossed[4] = 0;
        this.itemsPossed[5] = 1;
        this.itemsPossed[6] = 54;
        this.itemsPossed[20] = 9;

        this.pinGemsPossed = {
            all     :0,
            diceGem :1,
            food    :1,
            plant   :10,
            mineral :0,
            alchemie:0,
            builder :0,
            tools   :99,
            keys    :999,
        }
        this.pinSlotPossed = 4;
    };
    // getters,setters
    get id() { return this.list };

};

$items = new _items();
console.log1('$items', $items);

// initialise items and builds //TODO: verifier si la memoire ce vide , les parentGroup pourrait empecher le garbage collector
_items.prototype.createItemsSpriteByID = function(id) {
    const cage = new PIXI.Container();
    const d = new PIXI.Sprite($Loader.Data2.gameItems.textures[id]);
    const n = new PIXI.Sprite($Loader.Data2.gameItems.textures[id+'_n']);
    d.parentGroup = PIXI.lights.diffuseGroup;
    n.parentGroup = PIXI.lights.normalGroup;
    cage.parentGroup = $displayGroup.group[4];
    cage.addChild(d,n);
    return {cage,d,n};
};

// initialise items and builds
_items.prototype.initialize = function() {
    this.totalGameItems = Object.keys($Loader.Data2.gameItems.textures).length;
    var $GameString = {itemsId:[[`blabla1`,`blabla2`,`blabla3`,`blabla4`]]}; //TODO: fair un core game strings , utiliser des regex au lieux de arrays?
    function addBase(id,name,type){
        return {
            _id: id, // identification arrays
            _name: name,
            _type: type,
            _textureName:`i${id}`,
            description:$GameString.itemsId[id],
            rateFound: { //stastitiques indiquer au joueur drop sur monstre et planet ex: monster1:"5:14"35% (sur x rencontre, trouver x fois)
                monster:{},
                planet:{},
            },
        };
    };
    function addValues(value,weight,rarety){
        return {
            _value: value,
            _weight: weight,
            _rarety: rarety,
        };
    };
    function addRate(dropRate){
        return {
            dropRate: dropRate, // %percent drop , les calculer si les monstre peuvre droper un items
        };
    };
    function addDiceData(diceFactor){
        return {
            diceFactor: diceFactor, // %percent drop , les calculer si les monstre peuvre droper un items
        };
    };
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
   // note: localisation translate: les noms seront appeller grace a la DB $local.items(id).name
    this.list = [
        // url("data2/Objets/gameItems/SOURCE/images/0.png");
        {
            ...addBase(0,'topaze DiceGem','diceGem'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
        // url("data2/Objets/gameItems/SOURCE/images/1.png");
        {
            ...addBase(1,'zircon DiceGem','diceGem'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
        // url("data2/Objets/gameItems/SOURCE/images/2.png");
        {
            ...addBase(2,'ambre DiceGem','diceGem'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
        // url("data2/Objets/gameItems/SOURCE/images/3.png");
        {
            ...addBase(3,'marquiz DiceGem','diceGem'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
        // url("data2/Objets/gameItems/SOURCE/images/4.png");
        {
            ...addBase(4,'marquiz DiceGem','diceGem'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
        // url("data2/Objets/gameItems/SOURCE/images/5.png");
        {
            ...addBase(5,'Grenat DiceGem','diceGem'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
        // url("data2/Objets/gameItems/SOURCE/images/6.png");
        {
            ...addBase(6,'sugilite, DiceGem','diceGem'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
        // url("data2/Objets/gameItems/SOURCE/images/7.png");
        {
            ...addBase(7,'citrine DiceGem','diceGem'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
    ];
    //FIXME:DELETTEME : comble les vides, patientant la DB complette  
    for (let i=0, l=this.totalGameItems; i<l; i++) {
        if(this.list[i]){ continue; };
        const types = Object.keys(this.types);
        types.shift();
        this.list.push( {
            ...addBase(i,'TODO'+(l-i),types[~~(Math.random()*types.length)]),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        })
    };
};

_items.prototype.getNames = function(id) {
    if(isFinite(id)){
        return this.list[id]._name;
    }else{
        return this.list.map(obj => obj._name);
    };
};
_items.prototype.getTypes = function(id) {
    if(isFinite(id)){
        return this.list[id]._type;
    }else{
        return this.list.map(obj => obj._type);
    };
};