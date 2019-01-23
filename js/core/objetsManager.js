/*:
// PLUGIN □────────────────────────────────□OBJS SPRITES , ANIMATIONS, SPINES, EVENTS ...□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Manage ,create game objs and events for Scene stage
* V.1.0
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Permet de constuire des objets specifiques selon leur type.
Classer egalement par categorie d'interaction. ex: tree,plant,door
Gestionnaire de construiction global des sprites du jeux
Voir le Stages
*/
// penser a faire un local et global ID
// ┌-----------------------------------------------------------------------------┐
// GLOBAL $objs CLASS: _objs
//└------------------------------------------------------------------------------┘
class _objs{
    constructor() {
        this._sceneName = null; // nom de la scene actuelement rendu
        this.spritesFromScene = []; // contien les sprites container par scene
        this.dataObjsFromScenes = {}; // contients les datas pour les sprites par scene, EVOLUTIF
        this.pathBuffer = null; // buffer path to move 
        this.classLink = { // voir les folders window , selon leur parent 
            'case': dataObj_case,
            'door': dataObj_door,
            'chara': dataObj_chara,
            'tree': dataObj_tree,
            'mapItem': dataObj_mapItem,
            'base': dataObj_base, // basic, rien special, les aurte class herite des base
        };
        // avaible type of container class link
        this.classContainer = {
         'animationSheet':Container_Animation,
         'spineSheet'    :Container_Spine    ,
         'tileSheet'     :Container_Tile     ,
        }
        // game case types possibility data2\Divers\caseEvents\caseEvents.png
        this.actionsCasesSystem  = {
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
        // game system colors possibility
        this.colorsSystem = [
            'red'   , //:0xff0000, #ff0000
            'green' , //:0x00ff3c, #00ff3c
            'blue'  , //:0x003cff, #003cff
            'pink'  , //:0xf600ff, #f600ff
            'purple', //:0x452d95, #452d95
            'yellow', //:0xfcff00, #fcff00
            'black' , //:0x000000, #000000
            'white' , //:0xffffff, #ffffff
        ];
    };
    /**@description get sprites case list from dataObjsFromScenes id */
    get cases () { return Array.from(this.dataObjsFromScenes[this._sceneName]._casesID , id => this.spritesFromScene[id]) };
    get doors () { return Array.from(this.dataObjsFromScenes[this._sceneName]._doorsID , id => this.spritesFromScene[id]) };
    get charas() { return Array.from(this.dataObjsFromScenes[this._sceneName]._charasID, id => this.spritesFromScene[id]) };
    get trees () { return Array.from(this.dataObjsFromScenes[this._sceneName]._treesID , id => this.spritesFromScene[id]) };
    get items () { return Array.from(this.dataObjsFromScenes[this._sceneName]._itemsID , id => this.spritesFromScene[id]) };
    get decors() { return Array.from(this.dataObjsFromScenes[this._sceneName]._decors  , id => this.spritesFromScene[id]) };
  

    /** Prepare les datas pour tous les cases random procedural events, */
    initialize(){
        const dataScenes = $Loader.DataScenes;
        // initialise pour chaque scene, les data de base
        let globalID = 0; // le GLOBAL game ID, utile pour l'editeur ?
        Object.keys(dataScenes).forEach(sceneName => {
            const savedData = dataScenes[sceneName]._objs;
            if(savedData){
                // linker, batching, each obj from id
                this.dataObjsFromScenes[sceneName] = {
                    objs:[], // local id map objets
                    _casesID:[],
                    _doorsID:[],
                    _charasID:[],
                    _treesID:[],
                    _itemsID:[],
                    _decors:[],
                    get cases () { return Array.from(this._casesID , id => this.objs[id]) },
                    get doors () { return Array.from(this._doorsID , id => this.objs[id]) },
                    get charas() { return Array.from(this._charasID, id => this.objs[id]) },
                    get trees () { return Array.from(this._treesID , id => this.objs[id]) },
                    get items () { return Array.from(this._itemsID , id => this.objs[id]) },
                    get decors() { return Array.from(this._decors  , id => this.objs[id]) },
                    
                };
                // creet un baseData avec les saved
                for (let i=0, l=savedData.length; i<l; i++) {
                    const data = savedData[i];
                    const classType = data.p.classType || "base"; //TODO:  refactgoriser l'editeur permet d'asigner ou generate auto les class type
                    const classLink = this.classLink[classType] || dataObj_base;
                    const targetArray = this.dataObjsFromScenes[sceneName][`_${classType}sID`];
                    const arrayID = targetArray? targetArray.length : void 0; // used for retrace dataObjsFromScenes._???ID index
                    const dataObj = new classLink(dataValues,i,globalID,arrayID);//TODO: TRANSFERER getDataValues (dataBase, textureName) {
                    targetArray && targetArray.push(i);
                    this.dataObjsFromScenes[sceneName].objs.push(dataObj);
                };
                globalID++;
            };
        });
        
    };

    // create new random game with options dificulty , generate random
    computeNewRandomGame(dificulty) {
        // randomize case events TODO: add more math logic to percent % global game dificulty
        
        Object.keys(this.dataObjsFromScenes).forEach(sceneName => {
            const sceneData = this.dataObjsFromScenes[sceneName];
            const cases = sceneData.cases; // getter cases lists
            if(cases.length){
                // TODO: Stocker ici les valeur qui influenceront la generations des objs et case par map
                //TODO: goodValue:1 : facteur de valorisation dynamics selon le nombre de gemDice de la meme couleur posseder et la luck du joueur ?
                const mapColorInfluencer = { // separer par planet id
                    'red'   :{rate:10,min:0,max:4,count:0} , //:0xff0000, #ff0000
                    'green' :{rate:5,min:0,max:-1,count:0} , //:0x00ff3c, #00ff3c
                    'blue'  :{rate:10,min:0,max:10,count:0} , //:0x003cff, #003cff
                    'pink'  :{rate:20,min:0,max:-1,count:0} , //:0xf600ff, #f600ff
                    'purple':{rate:10,min:0,max:4,count:0} , //:0x452d95, #452d95
                    'yellow':{rate:10,min:0,max:10,count:0} , //:0xfcff00, #fcff00
                    'black' :{rate:10,min:0,max:-1,count:0} , //:0x000000, #000000
                    'white' :{rate:75,min:0,max:0,count:0} , //:0xffffff, #ffffff
                };
                const mapActionInfluencer = { // separer par planet id
                    'caseEvent_gold'       :{rate:85,min:10,max: 40 ,count:0} ,
                    'caseEvent_teleport'   :{rate:5 ,min:1,max:-1 ,count:0} ,
                    'caseEvent_map'        :{rate:5,min:1,max: -1,count:0} ,
                    'caseEvent_timeTravel' :{rate:10,min:-1,max:5 ,count:0} ,
                    'caseEvent_buffers'    :{rate:15,min:-1,max: 10 ,count:0} ,
                    'caseEvent_miniGames'  :{rate:10,min:-1,max: 10,count:0} ,
                    'caseEvent_monsters'   :{rate:40,min:-1,max:-1 ,count:0} , 
                };
                function knuthfisheryates2(arr) {
                    var temp, j, i = arr.length;
                    while (--i) {
                        j = ~~(Math.random() * (i + 1));
                        temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                    }
                    return arr;
                };
                function range(start, end) {
                    if(start === end) return [start];
                    return [start, ...range(start + 1, end)];
                };
                const ranIndex = knuthfisheryates2(range(0,cases.length-1)); // map id range with random seed
                for (let i=0, l=ranIndex.length; i<l; i++) {
                    const id = ranIndex[i];
                    cases[id].initialize(mapColorInfluencer,mapActionInfluencer,l,dificulty);
                };
            };
        });
    };

    
    // map1 start
    createSpritesObjsFrom(sceneName) {
        this._sceneName = sceneName;
        const dataObjs = this.dataObjsFromScenes[sceneName].objs;
        for (let i=0, l=dataObjs.length; i<l; i++) {
            const dataObj = dataObjs[i];
            let cage;
            switch (dataObj.dataValues.p.type) {
                case "animationSheet" : cage = new Container_Animation (dataObj);break;
                case "spineSheet"     : cage = new Container_Spine     (dataObj);break;
                case "tileSheet"      : cage = new Container_Tile      (dataObj);break;
                default: throw console.error(`FATAL error in json, check the {'type'}!`)
            };
            cage.id = i;
            this.spritesFromScene[i] = cage;
        };
        this.setInteractive(true,true);
    };

    // selon les type de data , ajouter les interactiviters GLOBAL
    setInteractive(value,addOn) {
        // cases
        for (let i=0, l=this.spritesFromScene.length; i<l; i++) {
            if ( this.spritesFromScene[i].DataLink.setInteractive ){
                this.spritesFromScene[i].DataLink.setInteractive(value,addOn);
            }
        };
    };

    // dataValues or from new empty [dataBase,textureName]
    newDataObjsFrom(dataValues,dataBase,textureName){
        const classType = dataValues? dataValues.b.classType : dataBase.classType;
        const dataClassType = this.classLink[classType] || dataObj_base;
        return new dataClassType(dataValues,dataBase,textureName);
    };

    // dataValues or from new empty [dataBase,textureName]
    newContainerFrom(dataObj){
        const containerClassType = this.classContainer[dataObj.b.type];
        return new containerClassType (dataObj)
    };

    // get a new sprite ID reference from local current scene
    //TODO: POUR LEDITEUR, il faut un verificateur index , scan tous les sprites a nouveau et reindexer les id des dataObjets
    getNewLocalSpriteID(){
        const id = this.spritesFromScene.length;
        return id;
    };


    
    

    getDirXFromId (id1,id2) {
        if (Number.isFinite(id1) && Number.isFinite(id2) ){
            const c1 = this.cases[id1].x;
            const c2 = this.cases[id2].x;
            return c1<c2 && 6 || c2<c1 && 4 || false;
        };
        return false;
    };



    destroy(obj, destroy) { // can be obj or string
        if(typeof obj === "object" ){
            const index = this.list_master.indexOf(obj);
            if(index>-1){
                this.list_master.splice(index, 1);
                obj.parent.removeChild(obj);
                destroy ? obj.destroy() : void 0;
            }
            return index;
        };
    };

    pointer_inEventDoor(){
        console.log('pointer_inEventDoor: ');
        const greenFilter = new PIXI.filters.OutlineFilter (6, 0xffffff, 1);
        this.d._filters = [greenFilter];

    }
    pointer_outEventDoor(){
        console.log('pointer_outEventDoor: ');
        this.d._filters = null;
    }
    pointer_upEventDoor(){
        if(this.skew.y<0){
            TweenLite.to(this.skew, 1, { ease: Power1.easeOut, y: 0 });
            TweenLite.to(this.scale, 1, { ease: Power1.easeOut, x: 0.9 });
            //TODO: DELEME, TEST MESSAGE BOX
            $messages.intitialize('pancart_p1m1_01'); // shew messages events
        }else{
            TweenLite.to(this.skew, 3, { ease: Elastic.easeOut.config(1, 0.3), y: -0.8 }) ;
            TweenLite.to(this.scale, 0.5, { ease: Power1.easeOut, x: 1.2 });
        };
    };

    // get from obj unique name
    getCase_FromName(name){
        for (let i=0, l=this.cases.length; i<l; i++) {
            if( this.cases[i].name === name){ return this.cases[i] };
        };
        throw console.error('the case name not existe',name);
    };




    //TODO: deleteMe, test performance cacher quelque sprites a la camera
    testHideOnlySpriteInCamera(value){
        for (let i=0, l=this.list_master.length-20; i<l; i++) {
            this.list_master[i].renderable = false;
        };
    }

};// END CLASS
$objs = new _objs();
console.log1('$objs: ', $objs);