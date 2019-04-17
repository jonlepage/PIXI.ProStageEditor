
/**Le states manager permet de creer asigner distribruer les states */
//generate des sprites states

class _statesManager {
    constructor() {
        this.tipsBox = null; // asignaytion d'une tips box au survole d'icon
       /** list des states de mode pour scan [_stateAttack,_stateDefense,_stateMagic,_stateItems] */
        this.list_actionState = {
           
        };
        /** Liste des states infligeur selon setup */
        this.statesList_infliger = [
            _statePoison
        ];
        /** Liste des states influeur selon setup */
        this.statesList_influer = [
            _state_powerOrbType
        ]
    };

    /**@returns _stateBase selon le mode */
    getBaseFromMode(mode){
        const cm = $combats.combatMode; // verification des list des mode combat dispo
        return (mode===cm[0]) && _stateAttack || (mode===cm[1]) || _stateDefense || (mode===cm[2]) && _stateMagic;
    };

    /** scan tous les status et verifi si a besoin de passive */
    getActionSetupFrom(source,target,mode){
        const items = source._battleSlotsItems && $huds.combats.getSlotItemsID || []; // monster non pas d'items
        const baseA = this.getBaseFromMode(mode).getContextsFrom(source,target); // attack,def,,magic
        const baseB = items && _stateItem.getContextsFrom(source,target,items) || []; // items
        // Extent actionA et ActionB de ces infliger potentiel, et les return en arrays
        const infligers = this.scanStatesInfligers(source,target,items,baseA,baseB);
        // les infliger peuvent etre des pre ou after, pre:applique avant, after: appliquer au resulta
        const influers = this.scanStatesInfluer(source,target,items,baseA,baseB,infligers);
        return {baseA,baseB,infligers,influers}; // renvoi la lister des infligeur
    };

    /** scan tous les states qui seront des infliger de base */
    scanStatesInfligers(source,target,items,baseA,baseB){
        let infligers = [];
        for (let i=0, l=this.statesList_infliger.length; i<l; i++) {
            const stateInfliger = this.statesList_infliger[i];
            infligers.push(...stateInfliger.getContextsFrom(...arguments));
        };
        return infligers;
    };
    /** scan tous les states qui seront des infliger de base */
    scanStatesInfluer(source,target,items,baseA,baseB){
        let influer = [];
        for (let i=0, l=this.statesList_influer.length; i<l; i++) {
            const stateInfluer = this.statesList_influer[i];
            influer.push(...stateInfluer.getContextsFrom(...arguments));
        };
        return influer;
    };
    /** attache des context suplementaire au infliger */
    extendSubContexts(){
        const list = $states.list_stateMode
        for (let i=0, l=list.length; i<l; i++) {
            const stateBase = list[i];
            stateBase.getContextsFrom(stateMode,infligers);
        };
    }
    /** influer list from infliger: affect le st associer*/
    getInfluerFrom(source,target,infligers){
        const influers = {
            base:[],
            items:[],
            global:[],
        };
        //TODO:
   //  //#base
   //  infliger.base.forEach(state => {
   //      state.createContext(source,target); // creer les contextlist.push(...state.linkedContext); // store les context linked
   //      influers.base.push(...state.linkedContext); //! helper visuel seulement en combat pour afficher icon
   //  });
   //  //#items
   //  infliger.items.forEach(state => {
   //      state.createContext(source,target); // creer les contextlist.push(...state.linkedContext); // store les context linked
   //      influers.base.push(...state.linkedContext); //! helper visuel seulement en combat pour afficher icon
   //  });
   //  //!global ?
   //  infliger.global.forEach(state => {

   //  });

        return influers; // renvoi la liste des influeur
    };

    /** pass a data json state to convert */
    createFromJson(json){
        
    }
};

/**@description Les states son les status temporaire ou asigner en jeux qui contienne des methods 
 * On leur pass une value 'dmg','def' qui return ensuite une valeur moduler.
 * @class _statesManager
*/
const $states = new _statesManager();