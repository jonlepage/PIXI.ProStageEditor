
/*:
// PLUGIN □────────────────────────────────□ SYSTEM CORE ENGINE □───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc manage all game systems informations
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $systems CLASS: _systems
//└------------------------------------------------------------------------------┘
/** @description tous les flags et data generaux pour le jeux*/
class _systems{
    constructor() {
        /**@description list des status global*/
        this.status = {
            _inCombat : false,
            _holdItem : false,
        };
        /**@description list des global switch, variable*/
        this.var = [];
        /**@description list des class disponible du jeux*/
        this.classType = {
            /**@description list des dataType pour $objs*/
            datas : {
                case   : dataObj_case    ,
                door   : dataObj_door    ,
                chara  : dataObj_chara   ,
                tree   : dataObj_tree    ,
                mapItem: dataObj_mapItem ,
                Light  : dataObj_light   ,
                base   : dataObj_base    ,
            },
            /**@description list des containerType pour $objs*/
            containers : {
                animationSheet   :Container_Animation        ,
                spineSheet       :Container_Spine            ,
                tileSheet        :Container_Tile             ,
                PointLight       :Container_PointLight       ,
                AmbientLight     :Container_AmbientLight     ,
                DirectionalLight :Container_DirectionalLight ,
                background       :Container_Background       ,
                light            :Container_light            ,
                base             :Container_Base             ,
            }
        }
        /**@description list des type de case dans le jeux*/
        this.caseTypes  = {
            actions:[ // allowed random computing
                'caseEvent_gold', //data2\Divers\caseEvents\SOURCE\images\caseEvent_gold.png
                'caseEvent_teleport', //data2\Divers\caseEvents\SOURCE\images\caseEvent_teleport.png
                'caseEvent_map', //data2\Divers\caseEvents\SOURCE\images\caseEvent_map.png
                'caseEvent_timeTravel', //data2\Divers\caseEvents\SOURCE\images\caseEvent_timeTravel.png
                'caseEvent_buffers', //data2\Divers\caseEvents\SOURCE\images\caseEvent_buffers.png
                'caseEvent_miniGames', //data2\Divers\caseEvents\SOURCE\images\caseEvent_miniGames.png
                'caseEvent_monsters', //data2\Divers\caseEvents\SOURCE\images\caseEvent_monsters.png
            ],
            perma:[ // case logique, random not allowed
                'caseEvent_quests', //data2\Divers\caseEvents\SOURCE\images\caseEvent_quests.png
                'caseEvent_exitV', //data2\Divers\caseEvents\SOURCE\images\caseEvent_exitV.png
                'caseEvent_exitH', //data2\Divers\caseEvents\SOURCE\images\caseEvent_exitH.png
                'caseEvent_door', //data2\Divers\caseEvents\SOURCE\images\caseEvent_door.png
            ],
            get list() { return this.actions.concat(this.perma) },
        };
        /**@description list des couleur possible pour les cases dans jeux*/
        this.colorsSystem = [
            'white'  , //:0xffffff, #ffffff
            'red'    , //:0xff0000, #ff0000
            'green'  , //:0x00ff3c, #00ff3c
            'blue'   , //:0x003cff, #003cff
            'pink'   , //:0xf600ff, #f600ff
            'purple' , //:0x452d95, #452d95
            'yellow' , //:0xfcff00, #fcff00
            'black'  , //:0x000000, #000000
        ];

        /**@description list des filters preConfigurer*/
        this.filtersList = {
            noiseGame             : new PIXI.filters.NoiseFilter     (0.1, 1         ),
            OutlineFilterx8Green  : new PIXI.filters.OutlineFilter   (4, 0x16b50e, 1),
            OutlineFilterx4white : new PIXI.filters.OutlineFilter   (4, 0xffffff, 1),
            OutlineFilterx8Red    : new PIXI.filters.OutlineFilter   (4, 0xdb3d2b, 1),
            OutlineFilterx8Yellow : new PIXI.filters.OutlineFilter   (20, 0xd6d022, 1),
            OutlineFilterx8Pink   : new PIXI.filters.OutlineFilter   (20, 0xc722d6, 1),
            TiltShiftFilterBlur   : new PIXI.filters.TiltShiftFilter (               )
        }

        /**@description influence math attribuer a chaque map 'scene' generer par new game*/
        this.mapsInfluence = {
            Scene_Map1:{
                caseColors: {
                    'red'    :{rate:10,min:0,max: 4 ,count:0} , //#ff0000
                    'green'  :{rate:5 ,min:0,max:-1 ,count:0} , //#00ff3c
                    'blue'   :{rate:10,min:0,max: 10,count:0} , //#003cff
                    'pink'   :{rate:20,min:0,max:-1 ,count:0} , //#f600ff
                    'purple' :{rate:10,min:0,max: 4 ,count:0} , //#452d95
                    'yellow' :{rate:10,min:0,max: 10,count:0} , //#fcff00
                    'black'  :{rate:10,min:0,max:-1 ,count:0} , //#000000
                    'white'  :{rate:75,min:0,max: 0 ,count:0} , //#ffffff
                },
                mapActionInfluencer: { // separer par planet id
                    'caseEvent_gold'       :{rate:85 ,min: 10,max:  40 ,count:0} ,
                    'caseEvent_teleport'   :{rate:5  ,min: 1 ,max:- 1  ,count:0} ,
                    'caseEvent_map'        :{rate:5  ,min: 1 ,max: -1  ,count:0} ,
                    'caseEvent_timeTravel' :{rate:10 ,min:-1 ,max:  5  ,count:0} ,
                    'caseEvent_buffers'    :{rate:15 ,min:-1 ,max:  10 ,count:0} ,
                    'caseEvent_miniGames'  :{rate:10 ,min:-1 ,max:  10 ,count:0} ,
                    'caseEvent_monsters'   :{rate:40 ,min:-1 ,max:- 1  ,count:0} , 
                }
            }

        };


        /**@description store active path when mouse hover computePathTo*/
        this.activePath = null;
    };

    /**@description indique si on est dans une phase de combats */
    get inCombat() { return this.status._inCombat };
    set inCombat(value) { this.status._inCombat = value };
    /**@description indique si un objet est tenu par la sourit */
    get holdItem() { return this.status._holdItem };
    set holdItem(value) { this.status._holdItem = value };
    /**@description renvoi le state powerOrbType attribuer pour le tour */
    get powerType() { return this.status._powerType || [] }; //TODO: quand joue un tours , calculer les slots gemDice pour asigner power type
    set powerType(value) {  };


    intitialize(){

    };

    /**@description get a CLASS in classType datas*/
    getClassDataObjs(type){
        return this.classType.datas[type] || this.classType.datas.base;
    };

   /**@description get a CLASS in classType containers*/
    getClassContainers(type){
        return this.classType.containers[type] || this.classType.containers.base;
    };


};
let $systems = new _systems();
console.log1('$systems', $systems);
