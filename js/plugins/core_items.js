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
        
    };
    // getters,setters
    get id() { return this.list };

};

$items = new _items();
console.log1('$items', $items);



// initialise items and builds
_items.prototype.initialize = function() {
    var $GameString = {itemsId:[[`blabla1`,`blabla2`,`blabla3`,`blabla4`]]}; //TODO: fair un core game strings , utiliser des regex au lieux de arrays?
    function addBase(id,name,type){
        return {
            _id: id, // identification arrays
            _name: name,
            _type: name,
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
    this.list = [
        // items 0 
        {   
            ...addBase(0,'gearing','tool'),
            ...addValues(50,2,100),
            ...addRate(100),
            ...addDiceData([1,4]),
        },
    ]
};


