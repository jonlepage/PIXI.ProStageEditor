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


function _mouse() {
    this.cursor = null;
    this.screenX = 1920;
    this.screenY = 1080;
    this.sprite = null; // mouse sprite
    this.x = 0;
    this.y = 0;
    this.speedX = 0.8; // speed X factor
    this.speedY = 0.75; // speed X factor
    // callback update for scene, SETUP FROM CURRENT SCENE
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
    this.create_Sprites();
    this.create_Listeners();
    //this.createMouseAPI();


};

//$mouse.createSprites();
//create the sprite spine mouse and default animations
_mouse.prototype.create_Sprites = function() {
    const mouse = new PIXI.spine.Spine($Loader.Data2.gloves.spineData);
    // setup
    mouse.skeleton.setSkinByName("point");
    mouse.state.setAnimation(0, 'idle', true);
    mouse.x = 400, mouse.y = 400;
    mouse.pivot.set(5,5);
    // parenting

    // reference
    this.cursor = mouse;
 };

_mouse.prototype.create_Listeners = function() {
     // mouse listener
    document.addEventListener('mousemove', this._mousemove.bind(this));
    document.addEventListener('mousedown', this._mousedown.bind(this));
    document.addEventListener('mouseup', this._mouseup.bind(this));
    document.addEventListener('wheel', this._wheel.bind(this));

    document.addEventListener('pointerlockerror', lockError, false);
    document.addEventListener('mozpointerlockerror', lockError, false);
    //document.addEventListener('webkitpointerlockerror', pointerLockChange, false);

    function lockError(e) {
    alert("Pointer lock failed"); 
    }
    // FIXME: F4 FULL SCREEN VOIR LA REQUETE FAITE PAR RMMV:   Graphics._switchFullScreen();
    //document.body.onresize = this.windowResized;
    //document.body.onblur = this.windowBlur;
    document.body.onfocus = this.windowFocus;
};  
_mouse.prototype.clear_Listerners = function() {
    // mouse listener
   document.removeEventListener('mousemove', this._mousemove);
   document.removeEventListener('mousedown', this._mousedown);
   document.removeEventListener('mouseup', this._mouseup);
   document.removeEventListener('wheel', this._wheel);
   document.body.onresize = null;
   document.body.onblur = null;
   document.body.onfocus = null;
};

this.windowFocus = function(){
    element.requestPointerLock = element.requestPointerLock ||
    element.mozRequestPointerLock ||
    element.webkitPointerLockElement;
    element.requestPointerLock(); // pointlocker API
};

//┌-----------------------------------------------------------------------------┐
// MOUSE LISTENER METHOD
// 
//└-----------------------------------------------------------------------------┘
// mouse move
_mouse.prototype._mousemove = function(event){
    // determine the direction BASE 10
    //this.x = Graphics.pageToCanvasX(event.movementX), this.y = Graphics.pageToCanvasY(event.movementY);
    this.x+=(event.movementX*this.speedX);
    this.y+=(event.movementY*this.speedY);
    // limit
    if (this.x>1920) {this.x = 1920};
    if (this.x<0) {this.x = 0};
    if (this.y>1080) {this.y = 1080};
    if (this.y<0) {this.y = 0};
    this.dirH = event.movementX>0 && 6 || event.movementX<0 && 4 || 0;
    this.dirV = event.movementY>0 && 2 || event.movementY<0 && 8 || 0;
    this.cursor.x = this.x, this.cursor.y = this.y;
    this.onMove();
   
};
_mouse.prototype.onMove = function(){

};


// mouse down
_mouse.prototype._mousedown = function(event){
    this.onDown();
    SceneManager._scene.onMouseDown && SceneManager._scene.onMouseDown(event);

};
_mouse.prototype.onDown = function(){

};


_mouse.prototype._mouseup = function(){
    SceneManager._scene.onMouseup && SceneManager._scene.onMouseup(event);
};

_mouse.prototype._wheel = function(){
    console.log('_wheel: ', '_wheel');

};



//┌-----------------------------------------------------------------------------┐
// MOUSE API
// controle mouse api  PointerLock
//└-----------------------------------------------------------------------------┘


_mouse.prototype.createMouseAPI = function(event){
    // setup compatibility pointer lock
    var element = document.body; // document.body.requestPointerLock()
    if (element.requestFullScreen) {
       // element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
        //element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
       // element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
      //  element.msRequestFullscreen();
    }

    element.requestPointerLock = element.requestPointerLock ||
    element.mozRequestPointerLock ||
    element.webkitPointerLockElement;
   // element.requestPointerLock(); // pointlocker API
};

_mouse.prototype.windowFocus = function(event){
    document.exitPointerLock();
    document.body.requestPointerLock(); // pointlocker API
};


//┌-----------------------------------------------------------------------------┐
// HACK RMMV GRAFIC LISTENER
// because removed video canvas, and f4 screen scale
//└-----------------------------------------------------------------------------┘

Graphics._setupEventHandlers = function() {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    //document.addEventListener('keydown', this._onTouchEnd.bind(this));
   // document.addEventListener('mousedown', this._onTouchEnd.bind(this));
   // document.addEventListener('touchend', this._onTouchEnd.bind(this));
};