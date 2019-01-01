/*:
// PLUGIN □────────────────────────────────□CREATE CAHRACTERE PLAYER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc create player and setup for whole game
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
dans les class, . pour les objects, function deep (non Json), _ pour les props array bool,
*/

// ┌------------------------------------------------------------------------------┐
// GLOBAL $SLL $player: _player for player1
//└------------------------------------------------------------------------------┘
class _player {
    constructor(dataBase, textureName, dataValues) {
        this.inCase = null; //store the current player case ?
        this.spine;
        this._planetID = null; // player current planet id
        this._dirX = 6;
        this.radius = null; // radius player range interactions
        this._scaleXY = 0.45; // default player scale, also help compute reverse
        //[hp:heath point], [mp:magic point], [hg:hunger], [hy:hydratation], [miw:max items weight], [mic:max item capacity]
        //[atk:attack], [def:defense], [sta:stamina], [lck:luck], [exp:exploration], [int:intelligence]
        this.states = {
            _level : 1    ,
            _hp    : 100  ,//data2\Hubs\stats\SOURCE\images\hp_icon.png
            _mp    : 100  ,//data2\Hubs\stats\SOURCE\images\mp_icon.png
            _hg    : 100  ,//data2\Hubs\stats\SOURCE\images\hg_icon.png
            _hy    : 100  ,//data2\Hubs\stats\SOURCE\images\hy_icon.png
            _atk   : 0    ,//data2\Hubs\stats\SOURCE\images\atk_icon.png
            _def   : 0    ,//data2\Hubs\stats\SOURCE\images\def_icon.png
            _sta   : 0    ,//data2\Hubs\stats\SOURCE\images\sta_icon.png
            _lck   : 0    ,//data2\Hubs\stats\SOURCE\images\lck_icon.png
            _exp   : 0    ,//data2\Hubs\stats\SOURCE\images\exp_icon.png
            _int   : 0    ,//data2\Hubs\stats\SOURCE\images\int_icon.png
            _mic   : 0    ,//data2\Hubs\stats\SOURCE\images\mic_icon.png
            _miw   : 0    ,//data2\Hubs\stats\SOURCE\images\miw_icon.png
            _orb   : 'red',
            _bp   : 10, // bonus point
        };
    };
    get x(){ return this.spine.x }
    get y(){ return this.spine.y }
    set x(x){ return this.spine.x = x }
    set y(y){ return this.spine.y = y }

    initialize() {
        this.setupSprites();
        this.setupListeners();
        //this.setupTweens();
        //this.setupInteractions();
    };

    setupSprites() {
        const database = $Loader.Data2.heroe1_rendered;
        const cage = new PIXI.ContainerSpine(database); // (database,skin)
        const spine = cage.d;//FIXME: RENDU ICI, add getter .d.n or change spine by Cage ? 
        spine.stateData.defaultMix = 0.2;
        spine.state.setAnimation(0, "idle", true);
        spine.state.setAnimation(1, "hair_idle", true);
        setInterval(function(){ //TODO: wink eyes, use spine events random
            const allowWink = Math.random() >= 0.5;
            allowWink && spine.state.setAnimation(2, 'wink1', false); 
        }, 1250);
        // player transform
        cage.scale.set(0.45,0.45);

        // player layers hackAttachmentGroups set spine.n
        cage.asignParentGroups();
        cage.parentGroup = $displayGroup.group[1];
        cage.zIndex = 0;

        spine.skeleton.setSlotsToSetupPose();
        // radius range 
        //const dataBase = $Loader.Data2.playerRadius;
        // local reference
        this.spine = cage;
    };

    setupListeners() {
        const checkEvent = (entry, event) => {
            switch (event.data.name) {
                case 'startMove':
                    this.moveToNextCaseID(entry);
                    break;
                case 'nextMove':
                    this.updateNextPath(true,entry);
                    break;
                case 'reversX':
                    this.reversX();
                    break;
                case 'endingHit': // combat commence le retour verse la case principal
                  this.moveBackToCase();
                    break;
                case 'hit': // combat commence le retour verse la case principal
                $combats.hitTo(null);
                    break;
            
                default:
                    break;
            }
        };
    
        this.spine.d.state.addListener({
            event: checkEvent,
        });
    };
    initialisePath(pathBuffer) {
        this._isMoving = true;
        this.pathBuffer = pathBuffer;
        this._currentPath = 0;
        this._startCaseID = pathBuffer[this._currentPath];
        this._currentCaseID = pathBuffer[this._currentPath];
        this._nextCaseID = pathBuffer[this._currentPath+1];
        if(Number.isFinite(this._nextCaseID)){
            this.updateNextPath(false); // checkCaseEvents: false car on start
        }else{
            // a click sur la case du player donc pas de move!
        }
    };

    updateNextPath(checkCaseEvents) {
        this.inCase = $objs.list_cases[this._nextCaseID];
        this._currentCaseID = this.pathBuffer[this._currentPath];
        this._nextCaseID = this.pathBuffer[++this._currentPath];
        checkCaseEvents && this.checkCaseEvents(false);
         //si on peut bouger, add next animation
        if (this.canMove()){
            this.addAnimationMove();
        }else{
            // peut pas bouger
            this.addAnimationMove(true);
            this._isMoving = false;
            this.checkCaseEvents(true);
            // si plus stamina
            if($huds.displacement._stamina === 0){
                $huds.displacement.clearRoll(); //FIXME: efface le 0 trop rapidement
            }

        };
    };

    addAnimationMove(ending) {
        const state = this.spine.d.state;
        if(ending){
            state.addEmptyAnimation(3,0.2); //(trackIndex, mixDuration, delay)
        }else{
            state.timeScale = 1.2;
            const nextDirection =  $objs.getDirXFromId(this._currentCaseID, this._nextCaseID); // get dir base 10
            this.needReversX(nextDirection) && state.addAnimation(3, "reversX", false);
            state.addAnimation(3, "jump1", false);
        }

    };
    canMove() {
        return $huds.displacement._stamina && Number.isFinite(this._nextCaseID);
    };
    needReversX(nextDirection) {
        return nextDirection !== this._dirX;
    };
    reversX() {
        this._dirX = 10-this._dirX;
        const xx = this._dirX === 6 && this._scaleXY || this._scaleXY*-1;
        TweenLite.to(this.spine.scale, 0.7, { x:xx, ease: Power3.easeOut });
    };
    
    // easing update x,y to this._nextCaseID
    moveToNextCaseID(entry) { // from jump1...
        const toCase = $objs.list_cases[this._nextCaseID];
        // tween
        TweenLite.to(this.spine.position, 1, { x:toCase.x, y:toCase.y+20, ease: Power3.easeOut });
        // update setup
        this.spine.zIndex = toCase.y;
    };
    
    // when player jump to a case, do all stuff here, ending is the last_nextCaseID, or end stamina
    checkCaseEvents(ending) {
        $player2.moveToPlayer();
       // stamina, sfx,fx , check auto-break cases ....
        //play audio ...
        $camera.moveToTarget($player,0)//$camera.moveToTarget(6);
       $objs.newHitFX.call(this.inCase); // fx hit case
        if(ending){
            !this.stopFromBadColorCase && $objs.executeCaseFrom(this.inCase);
            this.stopFromBadColorCase = false; // reset
        } else {// if not endCase
            //check if autorised color in displacement huds
            if(this.inCase.colorType !== 'white' && !$huds.displacement.diceColors.contains(this.inCase.colorType)){
                $huds.displacement.setStamina(0);
                this.stopFromBadColorCase = true; // when stop from bad color case, dont allow recive bonus case eventType
            }else{
                $huds.displacement.addStamina(-1);
            }
        };
    };

    // le joueur a donner ces coup, il return a sa case initial (combat mode)
    moveBackToCase(entry){
        TweenMax.to($player, 1, {
            x:$player.inCase.x, y:$player.inCase.y,zIndex:$player.inCase.y,
            ease: Expo.easeOut,
        });
    }
};
/**@description class du joueur 1 */
let $player = new _player();
console.log1('$player: ', $player);


// ┌------------------------------------------------------------------------------┐
// GLOBAL $SLL $player2: _player2 for player2
//└------------------------------------------------------------------------------┘
class _player2 {
    constructor(dataBase, textureName, dataValues) {
        this.inCase = null; //store the current player case ?
        this.spine;
        this._planetID = null; // player current planet id
        this._dirX = 6; //player direction
        this.radius = null; // radius player range interactions
        this._scaleXY = 0.45; // default player scale, also help compute reverse

    };
    get x(){ return this.spine.x }
    get y(){ return this.spine.y }
    set x(x){ return this.spine.x = x }
    set y(y){ return this.spine.y = y }

    initialize() {
        this.setupSprites();
        //this.setupListeners();
        //this.setupTweens();
        //this.setupInteractions();
    };

    setupSprites() {
        const cage = new PIXI.ContainerSpine($Loader.Data2.heroe2);
        const spine = cage.d;//FIXME: RENDU ICI, add getter .d.n or change spine by Cage ? 
        spine.stateData.defaultMix = 0.2;
        spine.state.setAnimation(0, "idle", true);
        // player transform
        cage.scale.set(0.45,0.45);
        // player layers hackAttachmentGroups set spine.n
        //cage.asignParentGroups();
        cage.parentGroup = $displayGroup.group[2];
        cage.zIndex = 0;
        spine.skeleton.setSlotsToSetupPose();
        this.spine = cage;
    };

    moveToPlayer(){
        const needReverse = this.needReversX(10-$player._dirX);
        needReverse && this.reversX();
        const distXFromPDir = this._dirX===4?100:-100;
        TweenLite.to(this.spine.position, needReverse&&3||7, {
            x:$player.x+distXFromPDir,y:$player.y-200, 
            ease: Power3.easeOut,
        });
        this.spine.zIndex = $player.y;
    }

    needReversX(nextDirection) {
        return nextDirection !== this._dirX;
    };

    reversX() {
        this._dirX = 10-this._dirX;
        const xx = this._dirX === 6 && this._scaleXY || this._scaleXY*-1;
        TweenLite.to(this.spine.scale, 1, { x:xx, ease: Power3.easeOut });
    };

    


};


let $player2 = new _player2(); 
console.log1('$player2.', $player2);
