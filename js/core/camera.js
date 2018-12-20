/*:
// PLUGIN □────────────────────────────────□CAMERA CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc create player and setup for whole game
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
// TODO: TODO: CHECK POUR CAMERA 2.5D
/*updateSkew()
{
    this._cx = Math.cos(this._rotation + this.skew._y);
    this._sx = Math.sin(this._rotation + this.skew._y);
    this._cy = -Math.sin(this._rotation - this.skew._x); // cos, added PI/2
    this._sy = Math.cos(this._rotation - this.skew._x); // sin, added PI/2
    this._localID ++;
}*/
// ┌-----------------------------------------------------------------------------┐
// GLOBAL $camera CLASS: _camera
//└------------------------------------------------------------------------------┘
/**@description camera view-port and culling */
class _camera{
    constructor() {
        this.screenX = $app.screen.width; // 1920
        this.screenY = $app.screen.height; // 1080;
        this._position = null;
        this._pivot = {};
        this._width = null;
        this._height = null;
        this._scale = null;
        this.tweenPosition = null;
        this.tweenScale = null;
        this.currentTarget = new PIXI.Point(0,0);
        this.zoom = 1;
        this.boundsCamera = 0; // limite de la camera
    };
    get x() { return this._pivot._x - this.screenX/2 };
    get y() { return this._pivot._y - (this.screenY/2) };
    set x(x) { this._pivot.x = x-this.screenX/2 }; // call ease
    set y(y) { this._pivot.y = y - (this.screenY/2) }; // call ease
    get tX() { return this.currentTarget.x - (this.screenX/2)/this.zoom }; // target x
    get tY() { return this.currentTarget.y - (this.screenY/2)/this.zoom };

    attachToCurrentScene() {
        const scene = $stage.scene;
        this._position = scene.position;
        this._pivot    = scene.pivot   ;
        this._scale    = scene.scale   ;
        this._width    = scene.width   ;
        this._height   = scene.height  ;
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
    };

    setTarget(obj, speed) { // $camera.setTarget([x,y],speed);
        Array.isArray(obj)? obj = new PIXI.Point(obj[0],obj[1]) : void 0;
        this.currentTarget = obj; // player or event or point XY
        this.moveToTarget(speed || 0);
    };

    moveToTarget(speed) {
        this.tweenPosition.vars.x = this.tX;
        this.tweenPosition.vars.y = this.tY;
        speed? this.tweenPosition._duration = speed : void 0;
        this.tweenPosition.invalidate(); // TODO: deep study source of this
        this.tweenPosition.play(0);
    };

    moveFromTarget(x,y,speed,ease) {
        const tX = this.target.x-((this.screenX/2)/this._tmpZoom);
        const tY = this.target.y-((this.screenY/2)/this._tmpZoom);
        isFinite(x) && (this.tweenP.vars.x = tX+x);
        isFinite(y) && (this.tweenP.vars.y = tY+y);
        speed && (this.tweenP._duration = speed);
        this.tweenP.invalidate();
        this.tweenP.play(0);
    };

    setZoom(value,speed=1,ease) {
        this.tweenScale.vars.x=value;
        this.tweenScale.vars.y=value;
        this.tweenScale._duration = speed;
        this.tweenScale.invalidate();
        this.tweenScale.play(0);
    };

    onMouseMove(x,y){
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

    onMouseWheel(e){
        //TODO: isoler le zoom dans un pixi points pour precalculer le resulta final
        const value = e.deltaY>0 && -0.1 || 0.1;
        if(this.zoom+value>2.5 || this.zoom+value<1 ){return};
        this.zoom+=value;
        this.setZoom(this.zoom,3);  //ratio,speed,ease
        this.moveToTarget(3);
        //si ya une messageBox event active ?, ajuster le bones camera des bubbles 
        if($messages.data){
            $messages.fitMessageToCamera(this.tX,this.tY,this.zoom);
        };
        
    };

    onMouseCheckBorderCamera(e){
        e.screenY
        const x = $app.renderer.plugins.interaction.mouse.global.x;
        let xx = 0;
        xx = ((this.screenX/2)-x)/50000;
        $stage.scene.skew.x = xx;
        $Objs.list_master.forEach(obj => {
            obj.skew.x = xx*-1;
        });
        
    };
    
    debug() {
        const debugLine = new PIXI.Graphics();
        debugLine.lineStyle(4, 0xffffff, 1);
        debugLine.moveTo(this.screenX/2,0).lineTo(this.screenX/2, this.screenY).endFill();
        debugLine.moveTo(0,this.screenY/2).lineTo(this.screenX, this.screenY/2).endFill();
        SceneManager._scene.addChild(debugLine);
    };
};
let $camera = new _camera();
console.log1('$camera.', $camera);

document.onwheel = $camera.onMouseWheel.bind($camera); //TODO:
//document.onmousemove = $camera.onMouseCheckBorderCamera.bind($camera); //TODO: