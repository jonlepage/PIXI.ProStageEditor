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
        this.LIST = []; // master list objets, see small list getter for get list in current scene
        this._sceneName = null; // nom de la scene actuelement rendu
        this.spritesFromScene = []; // contien les sprites container par scene
        this.dataObjsFromScenes = {}; // contients les datas pour les sprites par scene, EVOLUTIF
        this.pathBuffer = null; // buffer path to move 
        this.classDataObjs = { //tous les dataObj selon les type, voir les folders window , 
            case   : dataObj_case   ,
            door   : dataObj_door   ,
            chara  : dataObj_chara  ,
            tree   : dataObj_tree   ,
            mapItem: dataObj_mapItem,
            base   : dataObj_base   ,
        };
        // avaible type of container class link
        this.classContainers = {
            animationSheet :Container_Animation  ,
            spineSheet     :Container_Spine      ,
            tileSheet      :Container_Tile       ,
            PointLight     :Container_PointLight ,
            base           :Container_Base       ,
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
            'white'  , //:0xffffff, #ffffff
            'red'    , //:0xff0000, #ff0000
            'green'  , //:0x00ff3c, #00ff3c
            'blue'   , //:0x003cff, #003cff
            'pink'   , //:0xf600ff, #f600ff
            'purple' , //:0x452d95, #452d95
            'yellow' , //:0xfcff00, #fcff00
            'black'  , //:0x000000, #000000
        ];
    };
    /**@description get sprites case list from dataObjsFromScenes id */
    get list () { return this.LIST.filter( obj => { return obj && (obj._sceneName === $objs._sceneName) }) };
    get cases () { return Array.from(this.dataObjsFromScenes[this._sceneName]._casesID , id => this.spritesFromScene[id]) };
    get doors () { return Array.from(this.dataObjsFromScenes[this._sceneName]._doorsID , id => this.spritesFromScene[id]) };
    get charas() { return Array.from(this.dataObjsFromScenes[this._sceneName]._charasID, id => this.spritesFromScene[id]) };
    get trees () { return Array.from(this.dataObjsFromScenes[this._sceneName]._treesID , id => this.spritesFromScene[id]) };
    get items () { return Array.from(this.dataObjsFromScenes[this._sceneName]._itemsID , id => this.spritesFromScene[id]) };
    get decors() { return Array.from(this.dataObjsFromScenes[this._sceneName]._decors  , id => this.spritesFromScene[id]) };
    
    getClassDataObjs(type){
        return this.classDataObjs[type] || this.classDataObjs.base
    };
    getClassContainers(type){
        return this.classContainers[type] || this.classContainers.base
    };

    /** Prepare les datas pour tous les cases random procedural events, */
    initialize(){
        const dataScenes = $Loader.DataScenes;
        // initialise pour chaque scene, les data de base
        let globalID = 0; // le GLOBAL game ID, utile pour l'editeur ?
        Object.keys(dataScenes).forEach(sceneName => {
            // conversion des dataValues en dataObjs exploitable
            const dataSaved = dataScenes[sceneName]._objs || [];
            for (let i=0, l=dataSaved.length; i<l; i++) {
                const data = dataSaved[i];
                const id = data._id;
                if(this.LIST[id]){throw console.error('ID dataObjs exist deja!, check integrity for id: '+id)}; //FIXME: DEBUG
                const dataObj = this.newDataObjs_dataValues(data.dataValues);
                dataObj.register = data;
                this.LIST[id] = dataObj;
            
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
        const dataObjs = this.list;
        for (let i=0, l=dataObjs.length; i<l; i++) {
            const dataObj = dataObjs[i];
            const cage = this.newContainer_dataObj(dataObj);
            this.spritesFromScene[i] = cage;
        }
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
    newDataObjsFrom(dataValues,dataBase,textureName){//
        const classType = dataValues? dataValues.b.classType : dataBase.classType;
        const dataClassType = this.classDataObjs[classType] || dataObj_base;
        return new dataClassType(dataValues,dataBase,textureName);
    };

    // creer une nouveau dataObjs avec dataValues stringnifier
    newDataObjs_dataValues(dataValues,needRegister){
        const class_data = this.getClassDataObjs(dataValues.b.classType);
        return new class_data(dataValues);
    };

    // creer une nouveau dataObjs 
    newDataObjs_dataBase(dataBase,textureName){
        const class_data = this.getClassDataObjs(dataBase.classType);
        return new class_data(null,dataBase,textureName);
    };

    // create un nouveau type container , from dataBase [pour l'editeur ]
    newContainer_dataBase(dataBase,textureName,needRegister){
        const dataObj = this.newDataObjs_dataBase(dataBase,textureName);
        const class_container = this.getClassContainers(dataObj.b.type);
        return new class_container (dataObj);
    };

    // create new container type from existed dataObj
    newContainer_dataObj(dataObj,needRegister){
        const class_container = this.getClassContainers(dataObj.b.type);
        return new class_container (dataObj);
    };

    // create new container type from existed dataObj
    newContainer_dataValues(dataValues,needRegister){
        const dataObj = this.newDataObjs_dataValues(dataValues);
        const class_container = this.getClassContainers(dataObj.b.type);
        return new class_container (dataObj);
    };

    // les light ont besoin de creer un dataBase, qui n'est pas dans le loader
    newContainer_light(type){
        const dataObj = new dataObj_light(null,type);
        return new Container_PointLight(dataObj);
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