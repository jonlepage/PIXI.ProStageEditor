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
        // buffersx2 [perma,dyna]
        this.LIST = []; // full Game objet index ID
        this.list = []; // scene temp ID
        this.list_s = []; // scene temp containers displayobjet ID

       
        this._sceneName = null; // nom de la scene actuelement rendu
    };
    /**@description getter list by filter */ // utiles pour editeur car la creation obj est plus dynamic
    get get_list () { return this.LIST.filter( obj => { return obj && (obj.register._sceneName === this._sceneName) }) };
    // /**@description GLOBAL LIST of objs CASE in game */
    // get CASES () { return this.LIST.filter( obj => { return obj instanceof dataObj_case })};
    // /**@description LOCAL list of objs case in scene */
    get CASES_d () { return this.LIST.filter( obj => { return obj instanceof dataObj_case })}; // global game
    get cases_d () { return this.list.filter( obj => { return obj instanceof dataObj_case })}; // local scene
    get cases_s () { return this.list_s.filter( obj => { return obj.dataObj instanceof dataObj_case })};  // local scene
    // get doors () { return Array.from(this.dataObjsFromScenes[this._sceneName]._doorsID , id => this.spritesFromScene[id]) };
    // get charas() { return Array.from(this.dataObjsFromScenes[this._sceneName]._charasID, id => this.spritesFromScene[id]) };
    // get trees () { return Array.from(this.dataObjsFromScenes[this._sceneName]._treesID , id => this.spritesFromScene[id]) };
    // get items () { return Array.from(this.dataObjsFromScenes[this._sceneName]._itemsID , id => this.spritesFromScene[id]) };
    // get decors() { return Array.from(this.dataObjsFromScenes[this._sceneName]._decors  , id => this.spritesFromScene[id]) };



    /** Prepare les datas pour tous les cases random procedural events, */
    initialize(){
        const dataScenes = $Loader.DataScenes;
        // initialise pour chaque scene, les data de base
        let globalID = 0; // le GLOBAL game ID, utile pour l'editeur ?
        Object.keys(dataScenes).forEach(sceneName => {
            // conversion des dataValues en dataObjs exploitable
            const dataSaved = dataScenes[sceneName]._objs || [];
            for (let i=0, l=dataSaved.length; i<l; i++) {
                const jdataObj = dataSaved[i];
                if(this.LIST[jdataObj.register._dID]){ throw console.error('ID dataObjs exist deja!, check integrity for id: '+id) }; //FIXME: DEBUG only
                const dataObj = this.newDataObjs_jsonData(jdataObj);
                this.LIST[jdataObj.register._dID] = dataObj;
            };
        });
        
    };

    // create new random game with options dificulty , generate random
    computeNewRandomGame(dificulty) {
        // randomize case events TODO: add more math logic to percent % global game dificulty
        // TODO: FIXME: A ajouter dans editeur , plutot fair un json pour le map Influence de base, qui sera random selon dificulter
        $systems.mapsInfluence.Scene_Map1._totalCase = this.CASES_d.length; //FIXME: par map

        const CLIST = this.CASES_d; // getter global case for all games
        //Fisher–Yates shuffle: permet de sortir random un array
            function knuthfisheryates2(arr) {
                let temp, j, i = arr.length;
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
            const ranIndex = knuthfisheryates2(range(0,CLIST.length-1)); // map id range with random seed
            for (let i=0, l=ranIndex.length; i<l; i++) {
                const id = ranIndex[i];
                CLIST[id].initialize();
            };
    };
    
    // map1 start
    createSpritesObjsFrom(sceneName) {
        this._sceneName = sceneName;
        this.list = this.get_list; // update by getter 
        const dataObjs = this.list;
        for (let i=0, l=dataObjs.length; i<l; i++) {
            const dataObj = dataObjs[i];
            const cage = this.newContainer_dataObj(dataObj);
            this.list_s[dataObj.register._sID] = cage;
            // interactive: quand on creer les sprite et registe, on creer ces interactive.
            dataObj.setupInteractive && dataObj.setupInteractive(true);
        }
    };

    // creer une nouveau dataObjs avec dataValues stringnifier
    newDataObjs_dataValues(dataValues){
        const classType = dataValues? dataValues.b.classType : 'base';
        const class_data = $systems.getClassDataObjs(classType);
        return new class_data(dataValues);
    };

    // creer une nouveau dataObjs 
    newDataObjs_dataBase(dataBase,textureName,dataValues){
        const class_data      = $systems.getClassDataObjs  (dataBase.dataType     );
        return new class_data(dataBase.name,textureName,dataValues); // les dataObj doivent etre dans un register
    };

    // creer un registre de base, permet de linker les buffers
    //TODO: creer un suivi hash32 pour verifier integrity? JSON.stringify(dataBase).hashCode()
    getNewRegister(){
        //registerType:[null:gc][1:LIST][2:TMP]
        return {
            _dID:this.LIST.findEmptyIndex(),
            _sID:this.list_s.findEmptyIndex(),
            _sceneName:$stage.scene.constructor.name,
        };
    };
    removeToRegister(cage){
        const reg = cage.register;
        delete this.LIST[reg._dID];
        delete this.list_s[reg._sID];
        cage.dataObj.register = null;
    };

    addToRegister(cage,bufferID){
        const reg = this.getNewRegister();
        if( this.LIST.contains(cage.dataObj) || this.list_s.contains(cage) ){
            throw console.error(`dataObj alrealy in buffer!: ${reg}`);//TODO: removeMe : debug only
        }else{
            this.LIST[reg._dID] = cage.dataObj;
            this.list_s[reg._sID] = cage;
        };
        cage.dataObj.register = reg;
    };

    // les light ont besoin de creer un dataBase, qui n'est pas dans le loader
    newDataObjs_jsonData(jdataObj){
        const class_data = $systems.getClassDataObjs(jdataObj.dataValues.b.dataType);
        return new class_data(jdataObj._dataBaseName, jdataObj._textureName, jdataObj.dataValues, jdataObj.register);
    };
    // create un nouveau type container , from dataBase [pour l'editeur ]
    //register: permet de stoker dans les registre permanent, sinon dans le registre dynamique
    newContainer_dataBase(dataBase,textureName,dataValues){
        const class_container = $systems.getClassContainers(dataBase.containerType);
        const class_data      = $systems.getClassDataObjs  (dataBase.dataType     );
        const dataObj = new class_data(dataBase.name,textureName,dataValues); // les dataObj doivent etre dans un register
        const cage = new class_container(dataObj);
        return cage;
    };

    newContainer_type(containerType,dataType){
        const class_container = $systems.getClassContainers(containerType);
        const class_data      = $systems.getClassDataObjs  (dataType);
        const dataObj = new class_data(null,null,true); // les dataObj doivent etre dans un register
        const cage = new class_container(dataObj);
        return cage;
    };

    // create new container type from existed dataObj
    newContainer_dataObj(dataObj){
        !(dataObj instanceof dataObj_base)?dataObj = this.newDataObjs_jsonData(dataObj) : void 0; // si provien du loader json
        const class_container = $systems.getClassContainers(dataObj.dataBase.containerType);
        const cage = new class_container(dataObj);
        return new class_container (dataObj);
    };

    // create new container type from existed dataObj
    newContainer_dataValues(dataValues){
        const dataObj = this.newDataObjs_dataValues(dataValues);
        const class_container = $systems.getClassContainers(dataObj.b.type);
        return new class_container (dataObj);
    };

    // les light ont besoin de creer un dataBase, qui n'est pas dans le loader
    newContainer_light(type){
        const class_container = $systems.classType.containers[type];
        if(class_container){
            const dataObj = new dataObj_light(null,type);
            return new class_container(dataObj);
        }else{ throw console.error('light type not exist!: ',type) };
    };

    
    
    //TODO: FIXME: REVOIR LES ID DU PATHFINDING LOCAL , dans editeur avant
    getDirXFromId (id1,id2) {
        if (Number.isFinite(id1) && Number.isFinite(id2) ){
            const c1 = this.LIST[id1].attache.x //this.cases[id1].x;
            const c2 = this.LIST[id2].attache.x //this.cases[id2].x;
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
            $messages.initialize('pancart_p1m1_01'); // shew messages events
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
const $objs = new _objs();
console.log1('$objs: ', $objs);