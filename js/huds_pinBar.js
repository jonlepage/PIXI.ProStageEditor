/*:
// PLUGIN □──────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/
/*
┌------------------------------------------------------------------------------┐
  GLOBAL $huds.pinBar CLASS: _huds_pinBar
  hubs pour pinners les items d'interactions
└------------------------------------------------------------------------------┘
*/
class _huds_pinBar extends PIXI.Container {
  constructor() {
      super();
      this._startingPinBar = 11; // le player debut avec ce nombre de pinBar MAX 11
      this._barMode = 0; // le mode d'affiche du pinBar
      this.slots = []; // store slots pinners for interactions
      this.masterBar = null; //masterBar ref
      this.rotator = null; // rotator ref 
      this.position.set(1830, 1050);
      this.parentGroup = $displayGroup.group[4];
      this.initialize();

  };
  // getters,setters
  get d() { return this.Sprites.d };
  get n() { return this.Sprites.n };

  //#region [rgba(255, 255, 255, 0.07)]
  // add basic proprety
  initialize() {
    this.setupSprites();
    this.setupTweens();
    this.setupInteractions();
    this.setPinSlotsAvaible(); // render only player start value slots avaible
  };

  // create pinBar hud
  setupSprites() {
      const dataBase = $Loader.Data2.hudsPinBar;
      // url("data2/Hubs/pinBar/SOURCE/images/pinBar.png"); 
      const masterBar = new PIXI.Container();
      const masterBar_d = new PIXI.Sprite(dataBase.textures.pinBar);
      const masterBar_n = new PIXI.Sprite(dataBase.textures_n.pinBar_n);
        masterBar_d.parentGroup = PIXI.lights.diffuseGroup;
        masterBar_n.parentGroup = PIXI.lights.normalGroup;
        masterBar.addChild(masterBar_d, masterBar_n);
        masterBar.pivot.set(masterBar_d.width - 10, (masterBar_d.height / 2) + 8);
      this.masterBar = masterBar;

      // url("data2/Hubs/pinBar/SOURCE/images/rotator.png"); 
      const rotator = new PIXI.Container();
      const rotator_d = new PIXI.Sprite(dataBase.textures.rotator);
      const rotator_n = new PIXI.Sprite(dataBase.textures_n.rotator_n);
        rotator_d.parentGroup = PIXI.lights.diffuseGroup;
        rotator_n.parentGroup = PIXI.lights.normalGroup;
        rotator.addChild(rotator_d, rotator_n);
        rotator.pivot.set(rotator_d.width / 2, rotator_d.height / 2);
        rotator.position.set(-12, 0);
      this.rotator = rotator;

      for (let i = 0, x = 87, y = 27, mx = 133, l = 11; i < l; i++, x += mx) {
        // bg Gem pinner  // url("data2/Hubs/pinBar/SOURCE/images/pinner.png");
        const pinner = new PIXI.Container();
        const pinner_d = new PIXI.Sprite(dataBase.textures.pinner);
        const pinner_n = new PIXI.Sprite(dataBase.textures_n.pinner_n);
          pinner_d.parentGroup = PIXI.lights.diffuseGroup;
          pinner_n.parentGroup = PIXI.lights.normalGroup;
          pinner.pivot.set(pinner_d.width / 2, pinner_d.height - 8);
          pinner.position.set(x, y);
          pinner._id = i;
          pinner.addChild(pinner_d, pinner_n);
        // Gem // url("data2/Hubs/pinBar/SOURCE/images/pinGemL.png");
        const pinGem = new PIXI.Container();
        const pinGem_d = new PIXI.Sprite(dataBase.textures.pinGemL);
        const pinGem_n = new PIXI.Sprite(dataBase.textures_n.pinGemL_n);
          pinGem_d.parentGroup = PIXI.lights.diffuseGroup;
          pinGem_n.parentGroup = PIXI.lights.normalGroup;
          pinGem.pivot.set(pinGem_d.width / 2, pinGem_d.height / 2);
          pinGem.scale.set(0.4, 1)
          pinGem.position.set(25, 50);
          pinGem.d = pinGem_d;
          pinGem.n = pinGem_n;
          pinGem._id = i;
          pinGem.addChild(pinGem_d, pinGem_n);
          pinner.addChild(pinGem);

        // item empty container // url("data2/Hubs/pinBar/SOURCE/images/pinItem.png");
        const pinItem = new PIXI.Container();
          pinItem.position.set(25, 50);
          pinner.addChild(pinItem);
          
          this.slots[i] = {
              pinner,
              pinGem,
              pinItem
          };
          Object.defineProperties(this.slots[i], {
            "type": { // change pinGem type and color
                set: function (newType) { // TODO: rend possible null, pour mode hardcore
                    this.pinGem.d.tint = $items.types[newType].tint;
                    this._currentType = newType;
                },
                get: function () {
                    return this._currentType;
                },
            },
            "item": { // add item to slots
                set: function (id) {
                    if(this.currentItem){
                      this.pinItem.removeChild(this.currentItem);
                    };
                    if(Number.isFinite(id)){
                      const newItem = $items.createItemsSpriteByID(id);
                      this.currentItem = newItem;
                      this.pinItem.addChild(newItem);
                    }else{
                      this.currentItem = null;
                    };
                },
                get: function () {
                    return this.currentItem;
                },
            },
            // cache information
            _id         : {value: i   },
            _currentType: {value: null, writable: true},
            currentItem : {value: null, writable: true},
        });
        this.slots[i].type = 'diceGem'; // setter default
        masterBar.addChild(pinner);
        this.addChild(rotator, masterBar);
    };

  };
  
  //#endregion
  /*#region [rgba(0, 200, 0, 0.04)]
  ┌------------------------------------------------------------------------------┐
  TWEENS EASINGS DISPLACEMENTS mix with spine2D core
  https://greensock.com/docs/Core/Animation
  └------------------------------------------------------------------------------┘
  */
  // setup and cache all thning need for easing tweens
  setupTweens() {
      TweenLite.to(this.rotator, 90, {
          rotation: Math.PI * 2,
          ease: Power0.easeNone,
          repeat: -1
      });
      // pendulum
      let pinners_swing = 0.04;
      this.slots.forEach(obj => {
          obj.pinner.rotation = pinners_swing;
          const ani = TweenMax.to(obj.pinner, 8, {
              rotation: -pinners_swing,
              ease: Power2.easeInOut,
              repeat: -1,
              yoyoEase: true,
          });
          ani.seek(~~(Math.random(8) * 8));
      });
      let bar_swing = 0.005;
      this.masterBar.rotation = bar_swing;
      TweenMax.to(this.masterBar, 6, {
          rotation: -bar_swing,
          ease: Power1.easeInOut,
          repeat: -1,
          yoyoEase: true,
      });
  };

  show(duration) {
      // rotator masterBar swing
      const masterBar = new TimelineLite()
          .to(this.masterBar, 0.4, {
              rotation: -0.005,
              ease: Back.easeOut.config(1.2)
          })
          .to(this.masterBar, 6, {
              rotation: 0.005,
              ease: Power1.easeInOut,
              repeat: -1,
              yoyoEase: true
          });
      let pinners_swing = 0.04;
      this.slots.forEach(obj => {
          obj.pinner.rotation = pinners_swing;
          const ani = TweenMax.to(obj.pinner, 8, {
              rotation: -pinners_swing,
              ease: Power2.easeInOut,
              repeat: -1,
              yoyoEase: true,
          });
          ani.seek(~~(Math.random(8) * 8));
      });
  };
  hide(duration) {
      // rotator swing
      const rotator = new TimelineLite()
          .to(this.rotator, 0.3, {
              rotation: -this.rotator.rotation * 10,
              ease: Power2.easeIn
          })
          .to(this.rotator, 0.4, {
              rotation: 0,
              ease: Power2.easeOut
          })
          .to(this.rotator, 90, {
              rotation: Math.PI * 2,
              ease: Power0.easeNone,
              repeat: -1
          });
      // rotator masterBar swing
      TweenLite.killTweensOf(this.masterBar);
      TweenLite.to(this.masterBar, 0.5, {
          rotation: -Math.PI / 2,
          ease: Back.easeIn.config(1.2),
      });
  };
  // make the huds in sleep mode, all pinGem will lateral
  sleepingMode(duration) {
      // rotator swing
      const rotator = new TimelineLite()
          .to(this.rotator, 0.7, {
              rotation: -this.rotator.rotation * 10,
              ease: Power2.easeInOut
          })
          .to(this.rotator, 90, {
              rotation: Math.PI * 2,
              ease: Power0.easeNone,
              repeat: -1
          });
      // rotator masterBar swing
      const masterBar = new TimelineLite()
          .to(this.masterBar, 0.2, {
              rotation: 0.02,
              ease: Power4.easeIn
          })
          .to(this.masterBar, 0.7, {
              rotation: -0.005,
              ease: Back.easeOut.config(1.7)
          })
          .to(this.masterBar, 6, {
              rotation: 0.005,
              ease: Power1.easeInOut,
              repeat: -1,
              yoyoEase: true
          });
      // pinGems
      this.slots.forEach(obj => {
          const masterBar = new TimelineLite()
              .to(obj.pinner, 1, {
                  rotation: -Math.PI / 2,
                  ease: Bounce.easeOut
              })
      });
  };
  scalePinGem(pinGem, large) {

  };
  scaleRotator(rotator, large) {
      if (large) {
          TweenLite.to(rotator.scale, 0.8, {
              x: 1.05,
              y: -1.05,
              ease: Back.easeOut.config(4)
          });
      } else {
          TweenLite.to(rotator.scale, 0.5, {
              x: 1,
              y: -1,
              ease: Back.easeOut.config(4)
          });
      };
  };
  //#endregion
  /*#region [rgba(0, 0, 0, 0.4)]
  ┌------------------------------------------------------------------------------┐
  INTERACTIONs EVENTS LISTENERS
  pointerIN, pointerOUT, pointerUP
  └------------------------------------------------------------------------------┘
  */
  setupInteractions() {
      // rotator: controle la rotation showHide du hud
      this.rotator.interactive = true;
      this.rotator.on('pointerover', this.IN_rotator, this);
      this.rotator.on('pointerout', this.OUT_rotator, this);
      this.rotator.on('pointerup', this.UP_rotator, this);
      // pinGem
      this.slots.forEach(slot => {
          slot.pinGem.interactive = true;
          slot.pinGem.on('pointerover', this.IN_pinGem, slot);
          slot.pinGem.on('pointerout', this.OUT_pinGem, slot);
          slot.pinGem.on('pointerup', this.UP_pinGem, this);
      });
  };
  IN_pinGem(e) {
      this.pinGem.d._filters = [new PIXI.filters.OutlineFilter(2, 0x000000, 1)]; // TODO:  make a filters managers cache
      if($mouse.holdingItem){
        TweenLite.to(this.pinGem.scale, 0.3, {
          x: 1,
          ease: Back.easeOut.config(4)
        });
      }

  };
  OUT_pinGem(e) {
      this.pinGem.d._filters = null;
      if(!this.item && this.pinGem.scale._x>0.4){
        TweenLite.to(this.pinGem.scale, 0.4, {
            x: 0.4,
            ease: Elastic.easeOut.config(1.2, 0.8),
        });
      };

  };
  // TODO: faire un sytem global event manager et interaction dans mouse
  UP_pinGem(e) {
      const pinGem = e.currentTarget;
      const slot = this.slots[pinGem._id];

      if (e.data.button === 0) { // clickLeft_ <==
        if ($mouse.holdingItem && $huds.menuItems.renderable) { // si item dans mouse et mode menu
            const itemMouseGXY = $mouse.holdingItem.getGlobalPosition(); // get global XY from item in mouse
            slot.item = $mouse.holdingItem._id; //setter
            $mouse.holdingItem = null; //setter
            const slotItemGXY = slot.item.getGlobalPosition();
            const xy = new PIXI.Point(itemMouseGXY.x-slotItemGXY.x, itemMouseGXY.y-slotItemGXY.y);
            slot.item.position.copy(xy);
            TweenLite.to(slot.item.position, 1, {
                x: 0, ease: Elastic.easeOut.config(1.2, 0.8),
            });
            TweenLite.to(slot.item.position, 0.6, {
                y: 0, ease: Bounce.easeOut,
            });
          }else
          if(slot.item){ // si rien dans mouse et items dans le slot 
            $mouse.holdingItem = slot.item._id;
          }
      } else
      if (e.data.button === 2) { // _clickRight ==>
        if(!$huds.menuItems.renderable){ // si menu est desactive, Activer menuItem
           // $Objs.disableInteractive(); TODO:
            return $huds.menuItems.show();
        };
        if($huds.menuItems.renderable){// si menu est activer, desactiver menuItem
           // $Objs.activeInteractive(); TODO:
            return $huds.menuItems.hide();
        };
      } else
      if (e.data.button === 1) { // click_Middle =>|<=
      }
  };



  IN_rotator(e) {
      const rotator = e.currentTarget;
      rotator._filters = [new PIXI.filters.OutlineFilter(2, 0x000000, 1)]; // TODO:  make a filters managers cache
      this.scaleRotator(rotator, true);
  };
  OUT_rotator(e) {
      const rotator = e.currentTarget;
      rotator._filters = null;
      this.scaleRotator(rotator, false);
  };
  // TODO: faire un sytem global event manager et interaction dans mouse
  UP_rotator(e) {
      const rotator = e.currentTarget;
      switch (this._barMode++) {
      case 0:
          this.sleepingMode();
          break;
      case 1:
          this.hide();
          break;
      case 2:
          this._barMode = 0;
          this.show();
          break;
      }
  };
  //#endregion
  // rendering player posseded pinSlots 
  setPinSlotsAvaible() {
      const posseded = $items.pinSlotPossed;
      const slots = this.slots;
      for (let i = 0, l = slots.length; i < l; i++) {
          const pinSlot = slots[i].pinner.renderable = i < posseded;
      };
  };

};