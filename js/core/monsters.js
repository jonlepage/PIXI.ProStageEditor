// ┌-----------------------------------------------------------------------------┐
// GLOBAL $monstersData: _monstersData
// manage data when creat new monster
//└------------------------------------------------------------------------------┘
class _monstersData {
    constructor() {
        this.id = [];
        this.id[1] = { //data2\Characteres\monster\m1\m1.png
            _name:"divinom",
            _type:"plante",
            _desc:"Lorem ipsum dolor sit amet, consecconsectetur",
            _level : 1    ,
            _hp    : 100  ,//data2\Hubs\stats\SOURCE\images\hp_icon.png
            _mp    : 100  ,//data2\Hubs\stats\SOURCE\images\mp_icon.png
            _atk   : 3    ,//data2\Hubs\stats\SOURCE\images\atk_icon.png
            _def   : 2    ,//data2\Hubs\stats\SOURCE\images\def_icon.png
            _sta   : 3    ,//data2\Hubs\stats\SOURCE\images\sta_icon.png
            _lck   : 3    ,//data2\Hubs\stats\SOURCE\images\lck_icon.png
            _int   : 3    ,//data2\Hubs\stats\SOURCE\images\int_icon.png
            _orbSensibility   : ['red'],
        }
    };
};
$monstersData = new _monstersData();
console.log1('$monstersData: ', $monstersData);


// ┌------------------------------------------------------------------------------┐
// GLOBAL $monsters: _monsters
// create new monster battler
//└------------------------------------------------------------------------------┘
class _monsters {
    constructor(id,lv,bID) {
        this.database = $Loader.Data2['m'+id];
        this._id = id; // monster data id
        this._lv = lv; // monster level
        this._bID = bID; // battle id order
        this.stats = $monstersData.id[id];
        this.sprite = null;
        this.initialize();
    };
    get x( ){ return this.sprite.x     };
    get y( ){ return this.sprite.y     };
    set x(x){ return this.sprite.x = x };
    set y(y){ return this.sprite.y = y };
    set z(z){ return this.sprite.zIndex = z };
    get w( ){ return this.sprite.width     };
    get h( ){ return this.sprite.height     };
    get isReverse( ){ return this.sprite.scale._x<0     };

    initialize() {
        const cage = new PIXI.ContainerSpine(this.database); // (database,skin)
        cage.d.stateData.defaultMix = 0.1;
        cage.d.state.setAnimation(0, "apear", false).timeScale = (Math.random()*0.6)+0.6;
        cage.d.state.addAnimation(0, "idle", true);
        cage.parentGroup = $displayGroup.group[1];
        this.sprite = cage;
        cage.scale.set(0.2,0.2);
        // player layers hackAttachmentGroups set spine.n
        cage.asignParentGroups();
        this.setInteractive(true,true);
    };

    setInteractive(value,addOn) {
        this.sprite.interactive = value;
        if(addOn){
            this.sprite.hitArea = this.sprite.getLocalBounds(); // empeche interaction avec mesh presision
            this.sprite.on('pointerover' , this.pointer_inMonster ,this);
            this.sprite.on('pointerout'  , this.pointer_outMonster,this);
            this.sprite.on('pointerdown'   , this.pointer_dwMonster ,this);
            this.sprite.on('pointerup'   , this.pointer_upMonster ,this);
        }
    };

    pointer_inMonster (e) {
        const c = e.currentTarget;
        const f = new PIXI.filters.OutlineFilter (4, 0xff0000, 5);
        c.n[0].forEach(spineSprite => {
            spineSprite._filters = [f];
        });
        this.moveArrowTo(c);
        this.moveMathBox(c);
        this.needReversePlayer(c);
        $combats.cmtID = this._bID;
    };
  
    pointer_outMonster(e) {
        const c = e.currentTarget;
        c.n[0].forEach(spineSprite => {
            spineSprite._filters = null;
        });
        const cage_dsb = $huds.combats.sprites.cage_dsb;
        cage_dsb.renderable = false;
    };
    
    pointer_dwMonster(e) {
        const c = e.currentTarget;
        $player.spine.d.state.setAnimation(3, "preparAtk", false);
        this.tweenHoldClick && this.tweenHoldClick.kill();
        $huds.combats.sprites.carw.position.y = c.y-(c.height);
        const cHitLow = Math.random(); //critical green hit, start to be green after 1+chl
        const cHitEnd = 1*0.5; // % duration green hit
        const carw = $huds.combats.sprites.carw; // arrow
        this.tweenHoldClick = TweenMax.to(carw.position, 2+cHitLow+cHitEnd, {
            y:c.y-(c.height-40),
            ease: Expo.easeOut,
            onComplete: () => {
                TweenMax.to($huds.combats.sprites.carw.position, 1, {y:c.y-c.height, ease: Elastic.easeOut.config(1.2, 0.1) });
                //this.StartRoll();
            },
            onUpdate: () => {
                const t = this.tweenHoldClick._time;
                if(t>1){this.startHit = true;}
                if(this.startHit){
                    t>(1+cHitLow)&&t<(1+cHitLow+cHitEnd)? carw.tint = 0x00ff00 : carw.tint = 0xff0000;
                }

            }
        });
    };

    pointer_upMonster(e) {
        const c = e.currentTarget;
        if(this.tweenHoldClick){
            if(!this.startHit){
                this.tweenHoldClick.reverse();
                $player.spine.d.state.setEmptyAnimation(3,0.2);
                const carw = $huds.combats.sprites.carw; // arrow
                carw.tint = 0xffffff;
            }else{
                const carw = $huds.combats.sprites.carw; // arrow
                this.tweenHoldClick.kill();
                const doubleHit = carw.tint === 0x00ff00; // green
          
                $player.spine.d.state.setAnimation(3, "atk1", false);
                doubleHit && $player.spine.d.state.addAnimation(3, "atk2", false);
                $player.spine.d.state.addAnimation(3, "backAfterAtk", false);
                $player.spine.d.state.addEmptyAnimation(3,1);
                
                //TODO: // RENDU ICI , creer des events spines pour des animations coerente, refactoriser players js et les listener ?
                $player.spine.zIndex = c.y+1;
                TweenMax.to($player, 0.8, {
                    x:c.x-this.w/1.5,
                    y:c.y,
                    ease: Expo.easeOut,
                    onComplete: () => {
                        carw.tint = 0xffffff;

                    },
                });
            }
        }
    };

    moveArrowTo(target){
        TweenMax.to($huds.combats.sprites.carw.position, 0.4, {
            x:target.x, y:target.y-target.height,
            ease: Expo.easeOut,
        });
    };

    moveMathBox(target){
        const cage_dsb = $huds.combats.sprites.cage_dsb;
        cage_dsb.renderable = true;
        const pw = ($player.spine.width/2);
        const rX = + (target.x>$player.x) && cage_dsb.width*2 || -cage_dsb.width;
        TweenMax.to($huds.combats.sprites.cage_dsb.position, 1, {
            x:$player.x-rX, y:$player.y,
            ease: Elastic.easeOut.config(0.8, 0.4),
        });
    }

    // on utilise "reversX_withoutEvent" car l'ani revers de base appelle un events $player._dirX qui fuck tout
    needReversePlayer (target) {
        const needR = ($player._dirX === 6 && target.x<$player.x) || ($player._dirX === 4 && target.x>$player.x);
        if (needR) {
            $player.reversX();
            $player.spine.d.state.setAnimation(3, "reversX_withoutEvent", false);
            $player.spine.d.state.addEmptyAnimation(3,0.2);
        }
    };

    playHit(){
        const ran = Math.random()>0.5 && 1 || 0;
        this.sprite.d.state.setAnimation(1,`hit${ran}`, false);
        this.sprite.d.state.addEmptyAnimation(1,1);
    }
};


