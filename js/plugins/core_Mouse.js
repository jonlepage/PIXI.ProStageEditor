/*:
// PLUGIN □────────────────────────────────□MOUSE INTERACTIVITY□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc MOUSE ENGINE
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
Controle tous ce qui est associer a la sourits, interaction avec player et camera engine
Initialise avantr le loader , seulement pendant la sceneBOOT
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $mouse CLASS: _mouse
//└------------------------------------------------------------------------------┘

//Graphics._renderer.plugins.interaction
//document.getElementById("GameCanvas").style.cursor = "none";

class _mouse extends PIXI.Container {
    constructor() {
      super();
      this.spine = null;
      this.screenX = 1920;
      this.screenY = 1080;
      this.interaction = null;//Graphics._renderer.plugins.interaction;

    };
  
  };

//$mouse.sprite
$mouse = new _mouse();
console.log1('$mouse. ', $mouse);

//┌-----------------------------------------------------------------------------┐
// INITIALISE ONCE METHOD
// initialise mouse setup
//└-----------------------------------------------------------------------------┘
//$mouse.initialize()
_mouse.prototype.initialize = function() {
    this.interaction = Graphics._renderer.plugins.interaction;

    document.getElementById("GameCanvas").style.cursor = "none";
    this.interaction.cursorStyles.default = "none";
    this.interaction.cursorStyles.pointer = "none"

    this.create_Sprites();
};


//create the sprite spine mouse and default animations
_mouse.prototype.create_Sprites = function() {
    const mouse = new PIXI.spine.Spine($Loader.Data2.gloves.spineData);

    mouse.skeleton.setSkinByName("point");
    mouse.state.setAnimation(0, 'idle', true);
    mouse.pivot.set(5,5);

    // global listener
    this.hitArea = []; // prevent sprite mouse interaction
    this.interactive = true;
    this.on('mousemove', function(event) {
        this.position.set(event.data.global.x, event.data.global.y);
    });
    // reference
    this.addChild(mouse);
    this.spine = mouse;
 };

//┌-----------------------------------------------------------------------------┐
// MOUSE LISTENER METHOD
// 
//└-----------------------------------------------------------------------------┘

//┌-----------------------------------------------------------------------------┐
// HACK RMMV GRAFIC LISTENER
// because removed video canvas, and f4 screen scale
//└-----------------------------------------------------------------------------┘

Graphics._setupEventHandlers = function() {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    document.addEventListener('keydown', this._onKeyDown.bind(this)); // F4
    //document.addEventListener('keydown', this._onTouchEnd.bind(this));
   // document.addEventListener('mousedown', this._onTouchEnd.bind(this));
   // document.addEventListener('touchend', this._onTouchEnd.bind(this));
};