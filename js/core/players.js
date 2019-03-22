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
        Object.defineProperty(this, 'spine', { value: false, writable: true });
        this.inCase = null; //store the current player case ?
        this._nextTransferID = 0; // transfer case obj id 
        this.spine;
        this._planetID = null; // player current planet id
        this._dirX = 6;
        this.radius = null; // radius player range interactions
        this._scaleXY = 0.45; // default player scale, also help compute reverse
        this._name = "Crysentelle";
        this._battleturnSta = 0; // lorsque =< 0 , a droite de jouer en combat , baser sur le sta max de tous les monstres
        //[hp:heath point], [mp:magic point], [hg:hunger], [hy:hydratation], [miw:max items weight], [mic:max item capacity]
        //[atk:attack], [def:defense], [sta:stamina], [lck:luck], [exp:exploration], [int:intelligence]
        this.st = {
            level : 1    ,
            hp    : 100  ,//data2\Icons\statsIcons\SOURCE\images\sIcon_hp.png
            mp    : 100  ,//data2\Hubs\stats\SOURCE\images\mp_icon.png
            hg    : 100  ,//data2\Hubs\stats\SOURCE\images\hg_icon.png
            hy    : 100  ,//data2\Hubs\stats\SOURCE\images\hy_icon.png
            atk   : 2    ,//data2\Hubs\stats\SOURCE\images\atk_icon.png
            def   : 0    ,//data2\Hubs\stats\SOURCE\images\def_icon.png
            sta   : 12    ,//data2\Hubs\stats\SOURCE\images\sta_icon.png
            lck   : 0    ,//data2\Hubs\stats\SOURCE\images\lck_icon.png
            exp   : 0    ,//data2\Hubs\stats\SOURCE\images\exp_icon.png
            int   : 0    ,//data2\Hubs\stats\SOURCE\images\int_icon.png
            mic   : 0    ,//data2\Hubs\stats\SOURCE\images\mic_icon.png
            miw   : 0    ,//data2\Hubs\stats\SOURCE\images\miw_icon.png
            orb   : 'red',
            bp    : 10   , // bonus point
            // affectera le huds stats ?
            /**get current level */
           //get level(){return this._level},
           //get hp   (){return this._hp   },
           //get mp   (){return this._mp   },
           //get hg   (){return this._hg   },
           //get hy   (){return this._hy   },
           //get atk  (){return this._atk  },
           //get def  (){return this._def  },
           //get sta  (){return this._sta  },
           //get lck  (){return this._lck  },
           //get exp  (){return this._exp  },
           //get int  (){return this._int  },
           //get mic  (){return this._mic  },
           //get miw  (){return this._miw  },
           //get orb  (){return this._orb  },
           //get bp   (){return this._bp   },
        };
    };
    get s(){ return this.spine.s }
    get p(){ return this.spine.p }
    get d(){ return this.spine.d }
    get n(){ return this.spine.n }

    initialize() {
        this.setupSprites();
        this.setupListeners();
        //this.setupTweens();
        this.addInteractive();
    };

    addInteractive(value) {
        this.spine.interactive = true;
        this.spine.on('pointerover' , this.pIN_player  ,this);
        this.spine.on('pointerout'  , this.pOUT_player ,this);
        this.spine.on('pointerup'   , this.pUP_player  ,this);
    };

    pIN_player(e) {
        const ee = e.currentTarget;
        $huds.stats.show();
    };
    
    pOUT_player(e) {
        const ee = e.currentTarget;
        $huds.stats.hide();

    };
    
    pUP_player(e) {
    
    };
    
    setupSprites() {
        const database = $Loader.Data2.heroe1_rendered;
        const cage = $objs.newContainer_dataBase(database,'idle',true); // dataBase,textureName,dataValues //FIXME: enlever true

    
        // hack player
        const spine = cage.s;
        spine.stateData.defaultMix = 0.2;
        spine.state.setAnimation(0, "idle", true);
        spine.state.setAnimation(1, "hair_idle", true);
        setInterval(function(){ //TODO: wink eyes, use spine events random
            const allowWink = Math.random() >= 0.5;
            allowWink && spine.state.setAnimation(2, 'wink1', false); 
        }, 1250);
        // player transform
        cage.scale.set(0.45,0.45);
        cage.proj.affine = 2;
        cage.parentGroup = $displayGroup.group[1];
        spine.skeleton.setSlotsToSetupPose();
        this.spine = cage;
        spine.hackAttachmentGroups("_n", PIXI.lights.normalGroup, PIXI.lights.diffuseGroup); // (nameSuffix, group)
       //cage.setDataValues(); // FIXME: PAS de attach car pas register, trouver une solutions
       //cage.asignDataObjValues();
    };

    setupListeners() {
        const checkEvent = (entry, event) => {
          switch (event.data.name) {
              case 'startMove': // lorsque entame le saut, move si besoin
                  this.event_move();
                break;
             case 'nextMove': // lorsque atterie, regarder la suite
                    this.event_checkEventCase();
                    this.event_updateNextPath();
               break;
            case 'reversX':
                this.reversX();
            break;
            case 'hitCase':
                this.event_hitCase();
            break;
            // case 'endingHit': // combat commence le retour verse la case principal
            //   this.moveBackToCase();
            //   break;
            // case 'hit': // combat commence le retour verse la case principal
            // $combats.hitTo(null);
            //   break;
          
              default:
                  break;
          }
        };
    
        this.spine.s.state.addListener({
            event: checkEvent,
        });


    };

    //initialisation dun parcour via un click 
    initialisePath(pathBuffer) {
        this._isMoving = true;
        this._autoMove = true; 
        this.pathBuffer = pathBuffer;
        this._pathID = 0; // progression of path moving
        this.spine.s.state.timeScale = 1.2; //TODO: sycroniser avec les states du player
        this.moveToNextPath();
    };

    moveToNextPath() {
        const cList = $objs.cases_s;
        this.fromCase = cList[this.pathBuffer[this._pathID]];
        this.toCase = cList[this.pathBuffer[this._pathID+1]];
        this._dirX = this.toCase.x>this.fromCase.x ? 6 : 4;
        this.needReversX() &&  this.s.state.addAnimation(3, "reversX", false);
        this._pathID++;
        const ranJump = ['jump1','jump2','jump3'][~~(3*Math.random())];
        this.spine.s.state.addAnimation(3, ranJump, false);
    };

    event_move() {
        this.toCase && TweenLite.to(this.spine.position, 0.8, { x:this.toCase.x, y:this.toCase.y, ease: Power3.easeOut });
        this.toCase && TweenLite.to(this.spine, 0.4, { zIndex:this.toCase.y, ease: Power3.easeOut });
    };

    event_hitCase(){
        $huds.stamina.addStamina(-1);
        !this.toCase.scale.zero && this.toCase.scale.zeroSet(); // FIXME:  a mettre au debut
        TweenMax.to(this.toCase.scale, 0.35, {
            x:this.toCase.scale.zero.x+0.16, ease: Expo.easeOut, repeat: 1, yoyo: true, yoyoEase:Elastic.easeOut.config(1.5, 0.6),
        });
    };
    event_checkEventCase() {
        this.inCase = this.toCase;
        $player2.moveToPlayer();
        $camera.moveToTarget($player,6);
       // execute des action avant
       //this.checkCaseEvents(false);
       // aussi regarder si ya des sprite ou event entre, ex: gazon pour fair un wouisshh
    };

    event_updateNextPath() {
        if(this._autoMove){
            if(this.canMove()){
                this.moveToNextPath();
            }else{
                // peut pas bouger
                this.spine.s.state.addEmptyAnimation(3,0.2);
                this.inCase.dataObj.executeCaseType();
            };
        }

    };

    addAnimationMove(ending) {
        const state = this.spine.s.state;
        if(ending){
            state.addEmptyAnimation(3,0.2); //(trackIndex, mixDuration, delay)
        }else{
            state.timeScale = 1.2;
            const nextDirection =  $objs.getDirXFromId(this._currentCaseID, this._nextCaseID); // get dir base 10
            this.needReversX(nextDirection) && state.addAnimation(3, "reversX", false);
            state.addAnimation(3, "jump1", false);
        }

    };
    canMove() {//FIXME:
        return $huds.stamina._stamina &&  Number.isFinite(this.pathBuffer[this._pathID+1]);
    };
    needReversX() {
        return (this._dirX===4 && this.spine.scale.x>0) || (this._dirX===6 && this.spine.scale.x<0);
    };
    reversX() {
        const xx = this._dirX === 6 && this._scaleXY || this._scaleXY*-1;
        TweenLite.to(this.spine.scale, 0.7, { x:xx, ease: Power3.easeOut });
    };
    /** set and play reverse animation and easing is need from a target */
    setReversXFrom(target) {
        const value = target.p.x<this.p.x && 4 || 6;
        if(this._dirX !==value){
            this._dirX = value;
            this.reversX();
            this.s.state.setAnimation(3, 'reversX', false);
            this.s.state.addEmptyAnimation(3,0.4);
        };
    };
        
    // when player jump to a case, do all stuff here, ending is the last_nextCaseID, or end stamina
    checkCaseEvents(ending) {
        $player2.moveToPlayer();
       // stamina, sfx,fx , check auto-break cases ....
        //play audio ...
        //$camera.moveToTarget(6);
      // this.inCase.playFX_landing();
       //if(ending){
       //    !this.stopFromBadColorCase && this.inCase.DataLink.executeCaseType();
       //    this.stopFromBadColorCase = false; // reset
       //} else {// if not endCase
       //    //check if autorised color in displacement huds
       //    if(this.inCase.DataLink._colorType !== 'white' && !$huds.displacement.diceColors.contains(this.inCase.DataLink._colorType)){
       //        $huds.displacement.setStamina(0);
       //        this.stopFromBadColorCase = true; // when stop from bad color case, dont allow recive bonus case eventType
       //    }else{
       //        $huds.displacement.addStamina(-1);
       //    }
       //};
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
    get s(){ return this.spine.s }
    get p(){ return this.spine.p }
    get d(){ return this.spine.d }
    get n(){ return this.spine.n }
    
    get x(){ return this.spine.x }
    get y(){ return this.spine.y }
    set x(x){ return this.spine.x = x }
    set y(y){ return this.spine.y = y }

    initialize() {
        this.setupSprites();
        //this.setupListeners();
        //this.setupTweens();
        //this.addInteractive();
    };

    setupSprites() {
        const database = $Loader.Data2.heroe2;
        const cage = $objs.newContainer_dataBase(database,'idle',true); // dataBase,textureName,dataValues //FIXME: enlever true
        // hack sprite
        const spine = cage.s;
        spine.stateData.defaultMix = 0.2;
        spine.state.setAnimation(0, "idle", true);
        // player transform
        cage.scale.set(0.45,0.45);
        // player layers hackAttachmentGroups set spine.n
        //cage.asignParentGroups();
        cage.proj.affine = 2;
        cage.parentGroup = $displayGroup.group[2];
        cage.zIndex = 0;
        spine.skeleton.setSlotsToSetupPose();
        this.spine = cage;

        cage.setDataValues(); // set dataValue from sprite
    };

    moveToPlayer(){
        const needReverse = this.needReversX(10-$player._dirX);
        needReverse && this.reversX();
        const distXFromPDir = this._dirX===4?100:-100;
        TweenLite.to(this.spine.position, needReverse&&3||7, {
            x:$player.p.x+distXFromPDir,y:$player.p.y-200, 
            ease: Elastic.easeOut.config(1, 1),
        });
        const r = this.spine.rotation;
        TweenLite.to(this.spine, needReverse&&3||7, {
            rotation:r===0&&0.1||0, 
            ease: Elastic.easeOut.config(1, 1),
        });
        this.spine.zIndex = $player.s.y;
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
