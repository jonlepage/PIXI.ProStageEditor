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
function _camera() {
    this.screenX = 1600;
    this.screenY = 900;
    this.width = null; // current  map width
    this.height = null; // current  map height

    this.position = null; // the map pivot
    this.zoom  = null; // the map scale Zoom
    this.target = null; // player or event or point XY
    this.targetH = null; // target height
    this.tweenP = null; // tween position
    this.tweenZ = null; // tween Zoom
    this.targetFocus = 0; // when pass the mouse hover target , re-focus the gamera to target
    this._tmpZoom = 1; // store the targeted zoom 
    this._userZoom = 0; // when user use wheell for custom zoom
    this.x = function(){
        return this.position._x
    }
    this.y = function(){
        return this.position._y
    }
};

$camera = new _camera();
console.log1('$camera.', $camera);


_camera.prototype.initialise = function(map,target) {
    this.position = map.pivot;
    this.zoom = map.scale;
    this.width = map.width;
    this.height = map.height;
    
    this.tweenP = new TweenLite(this.position, 0, {
        x:0, y:0,
        ease:Power4.easeOut,
    });
    this.tweenZ = new TweenLite(this.zoom, 1, {
        x:1, y:1,
        ease:Power4.easeOut,
    });
    target && this.setTarget(target);
    $camera.debug()
};

// set a target to camera
_camera.prototype.setTarget = function(obj) {
    this.target = obj.position(); // player or event or point XY
    this.targetH = obj.height()/2 || 0; // need size of target because anchor are objsprite 0.5,1
    this.moveToTarget(0);
};

// $camera.moveToTarget();
_camera.prototype.moveToTarget = function(speed,ease) {
    this.tweenP.vars.x = this.target.x-((this.screenX/2)/this._tmpZoom);
    this.tweenP.vars.y = this.target.y-((this.screenY/2)/this._tmpZoom);
    speed && (this.tweenP._duration = speed);
    this.tweenP.invalidate();
    this.tweenP.play(0);
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
_camera.prototype.onMouseWheel = function(value){
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
