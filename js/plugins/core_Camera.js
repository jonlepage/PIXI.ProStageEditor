/*:
// PLUGIN □────────────────────────────────□CAMERA CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc create player and setup for whole game
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $camera CLASS: _camera
//└------------------------------------------------------------------------------┘
class _camera{
    constructor() {
        this.screenX = SceneManager._screenWidth; // 1920
        this.screenY = SceneManager._screenHeight // 1080;
        this._position = null;
        this._pivot = null;
        this._width = null;
        this._height = null;
        this._scale = null;
        this.tweenPosition = null;
        this.tweenScale = null;
        this.currentTarget = new PIXI.Point(0,0);
    };
    get x() { return this._pivot._x - this.screenX/2 };
    get y() { return this._pivot._y - (this.screenY/2) };
    set x(x) { this._pivot.x = x-this.screenX/2 }; // call ease
    set y(y) { this._pivot.y = y - (this.screenY/2) }; // call ease

    get tX() { return this.currentTarget.x - (this.screenX/2) };
    get tY() { return this.currentTarget.y - (this.screenY/2) };

};

$camera = new _camera();
console.log1('$camera.', $camera);

_camera.prototype.initialise = function(map, target) {
    this._position = map.position;
    this._pivot = map.pivot;
    this._scale = map.scale;
    this._width = map.width;
    this._height = map.height;
    // initialise position without delay
    this.tweenPosition = new TweenLite(this._pivot, 0, {
        x:this.x,
        y:this.y,
        ease:Power4.easeOut,
    });
    this.tweenScale = new TweenLite(this._scale, 0, {
        x:this._scale.x,
        y:this._scale.y,
        ease:Power4.easeOut,
    });
    target && this.setTarget(target);
    //$camera.debug()
};

// add target to camera, pixi point or display obj
_camera.prototype.setTarget = function(obj, speed) { // $camera.setTarget([x,y],speed);
    Array.isArray(obj)? obj = new PIXI.Point(obj[0],obj[1]) : void 0;
    this.currentTarget = obj; // player or event or point XY
    this.moveToTarget(speed || 0);
};

// performe move the camera
_camera.prototype.moveToTarget = function(speed) {
    this.tweenPosition.vars.x = this.tX;
    this.tweenPosition.vars.y = this.tY;
    speed? this.tweenPosition._duration = speed : void 0;

    this.tweenPosition.invalidate(); // TODO: deep study source of this
    this.tweenPosition.play(0);
};

// $camera.moveFromTarget(120,10,4); Move from target to new XY
_camera.prototype.moveFromTarget = function(x,y,speed,ease) {
    const tX = this.target.x-((this.screenX/2)/this._tmpZoom);
    const tY = this.target.y-((this.screenY/2)/this._tmpZoom);
    isFinite(x) && (this.tweenP.vars.x = tX+x);
    isFinite(y) && (this.tweenP.vars.y = tY+y);
    speed && (this.tweenP._duration = speed);
    this.tweenP.invalidate();
    this.tweenP.play(0);
};

// $camera.setZoom(2,4); Zoom screen based on pivot camera

_camera.prototype.setZoom = function(ratio,speed,ease) {
    ratio = ratio || 1;
    ratio+= this._userZoom;
    this._tmpZoom = ratio;
    this.tweenZ.vars.x = ratio;
    this.tweenZ.vars.y = ratio;
    speed && (this.tweenZ._duration = speed);
    this.tweenZ.invalidate();
    this.tweenZ.play(0);
};


//  when mouse was move check camera interaction
_camera.prototype.onMouseMove = function(x,y){
    const ra = $player._zoneLimit; // player data allowed for zone limit
    const raX = x>this.screenX && ra || x<0 && -ra || NaN;
    const raY = y>this.screenY && ra || y<0 && -ra || NaN;

    // player actived the limit
    if(raX || raY){
        this.targetFocus = 0; 
        $camera.moveFromTarget(raX,raY,4)

    }else{ // refocus camera to target
        const rX = (x/$camera.zoom.x)+$camera.position.x ;
 
        const inX = $player.position().x- $player._width/2;

        const outX = $player.position().x + $player._width/2;
    
        const inY = $player.position().y- $player._height;
        const outY = $player.position().y
       
        if(rX>inX && rX<outX){

            this.targetFocus+=1;

            if( this.targetFocus>48){
                
                $camera.moveFromTarget(0,0,5)
            }
        }else{
            this.targetFocus = 0;
        }
       
   
       
    };
};


// when mouse whell interaction
// $camera.onMouseWeel();
document.addEventListener('wheel', onMouseWheel);
_camera.prototype.onMouseWheel = function(e){
    const limit = this._userZoom+value;
    if(limit>1 || limit<0){return}
    this._userZoom+=value;
    this.setZoom(null,3);  //ratio,speed,ease
    this.moveToTarget(3);
};


// $camera.debug(); // show debug help for camera
_camera.prototype.debug = function() {
    const debugLine = new PIXI.Graphics();
    debugLine.lineStyle(4, 0xffffff, 1);
    debugLine.moveTo(this.screenX/2,0).lineTo(this.screenX/2, this.screenY).endFill();
    debugLine.moveTo(0,this.screenY/2).lineTo(this.screenX, this.screenY/2).endFill();
    SceneManager._scene.addChild(debugLine);
};
