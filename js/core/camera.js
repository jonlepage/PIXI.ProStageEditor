/*:
// PLUGIN □────────────────────────────────□CAMERA CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc camera 2.5D engine with pixi-projection, all camera events store here
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
class _camera extends PIXI.projection.Container2d{
    constructor() {
        /**@description camera viewport contain all the scene */
        super()
        this._screenW = $app.screen.width; // 1920
        this._screenH = $app.screen.height; // 1080;
        this._sceneW = 0; // scene width
        this._sceneH = 0; // scene height
        this._zoom = 1;
        /**@description far point to affine projections 2.5d */
        this.far = new PIXI.Sprite(PIXI.Texture.WHITE);
       // this.far.renderable = false;
         /**@description default for far point factor */
        this._fpf = 0.6;
        this._fpX = 0; // x focus 2d projection (debug with arrow)
        this._fpY = 0; // y focus 2d projection (debug with arrow)
        this._fpXLock = false;
        this._fpYLock = true;
        /**@description screen point, les coordonnées XY centrer du view-port (ecrant) */
        this.sp = new PIXI.Point(this._screenW/2,this._screenH/2);
        /**@description target point, les coordonnées XY du target */
        this.tp = new PIXI.Point();

        this.scene = null; // scene asigneded when camera initialised
        this.target = null;
    };
    set lockCamX(value) { isNaN(value)? this._fpXLock = value && this._fpX || false : this._fpXLock = value }; // $camera.far.toLocal($camera.scene)
    set lockCamY(value) { isNaN(value)? this._fpYLock = value && this._fpY || false : this._fpYLock = value };
    
    get camToMapX() { return this.pivot._x + (this._sceneW/2)};
    get camToMapY() { return this.pivot._y + this._sceneH};
    //get position(){this.scene.toLocal(this.sp)}
    //get x() { return this._pivot._x - this.screenX/2 };
    //get y() { return this._pivot._y - (this.screenY/2) };
    //set x(x) { this._pivot.x = x-this.screenX/2 }; // call ease
    //set y(y) { this._pivot.y = y - (this.screenY/2) }; // call ease
    //get tX() { return this.currentTarget.x - (this.screenX/2)/this.zoom }; // target x
    //get tY() { return this.currentTarget.y - (this.screenY/2)/this.zoom };

    initialize(projected) {
        const scene = this.scene = $stage.scene;
        //scene.convertSubtreeTo2d(); //TODO: prepare les scene deja en 2d
        this.addChild(scene);
        scene.convertSubtreeTo2d();
        this._sceneW = scene.background? scene.background.d.width :  this._screenW;
        this._sceneH = scene.background? scene.background.d.height : this._screenH;
        scene.pivot.set(this._sceneW/2,this._sceneH);
        this.position.set(this._screenW/2,this._screenH/2);

        const fp = this.far;
        fp.factor = this._fpf; // facteur pour la projection global de la map sur les axe x et y
        fp.position.set(this._screenW/2,-this._sceneH);
        fp.position.__x = fp.position._x;
        fp.position.__y = fp.position._y;
        $stage.addChild(fp);
     
        // Listen for animate update
        if(!this._tickerProjection){
            $app.ticker.add((delta) => {
                let pos = this.toLocal(fp.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
                pos.y = -pos.y;
                pos.x = -pos.x;
                this.proj.setAxisY(pos, -fp.factor);
                $objs.list_master.forEach(cage => { // TODO: add affine method in container car special pour les case
                    if(cage.constructor.name === "ContainerSpine"){
                        cage.d.proj.affine = PIXI.projection.AFFINE.AXIS_X;
                    }else{
                        if(!cage.isCase){// TODO: add affine method in container car special pour les case
                            cage.d.proj.affine = PIXI.projection.AFFINE.AXIS_X;
                            cage.n.proj.affine = PIXI.projection.AFFINE.AXIS_X;
                        }
                    };
                    });
                });
        };
        this.debug();
    };

    setTarget(obj = $player.spine) { // add target to camera, default player
        this.target = obj;
        
    };

    moveToTarget(obj) {
        this.moveProgress = true; // stop update // TODO: Ajouter le update du bas , dans les master 
        if(obj){ this.target = obj.spine? obj.spine : obj}; // allow pass a $global val
        if(!this.target){this.target = $player.spine};
        const pos = this.target.getGlobalPosition();
        const toPos = new PIXI.Point( $camera.pivot._x-pos.x, $camera.pivot._y+pos.y );
        TweenLite.to(this.pivot, 1, { 
            x:toPos.x, y:toPos.y, 
            ease: Power3.easeOut,
            onComplete: () => {this.moveProgress = false},
        });
    };

   /* moveFromTarget(x,y,speed,ease) {
        const tX = this.target.x-((this.screenX/2)/this._tmpZoom);
        const tY = this.target.y-((this.screenY/2)/this._tmpZoom);
        isFinite(x) && (this.tweenP.vars.x = tX+x);
        isFinite(y) && (this.tweenP.vars.y = tY+y);
        speed && (this.tweenP._duration = speed);
        this.tweenP.invalidate();
        this.tweenP.play(0);
    };*/

    setZoom(value,speed=1,ease) {
        this.scene.parent.scale.set(value);
    };

    /*onMouseMove(x,y){
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
    };*/

    onMouseWheel(e){
        //TODO: isoler le zoom dans un pixi points pour precalculer le resulta final
        const value = e.deltaY>0 && -0.05 || 0.05;
        //if(this._zoom+value>2.5 || this._zoom+value<1 ){return};
        this._zoom+=value;
        this.setZoom(this._zoom,3);  //ratio,speed,ease
        //this.moveToTarget(3);
        //si ya une messageBox event active ?, ajuster le bones camera des bubbles 
        /*if($messages.data){
            $messages.fitMessageToCamera(this.tX,this.tY,this.zoom);
        };*/
        
    };

    /*onMouseCheckBorderCamera(e){
        e.screenY
        const x = $app.renderer.plugins.interaction.mouse.global.x;
        let xx = 0;
        xx = ((this.screenX/2)-x)/50000;
        $stage.scene.skew.x = xx;
        $Objs.list_master.forEach(obj => {
            obj.skew.x = xx*-1;
        });
        
    };*/
    
    /**@description debug camera for test pixi-projections, also need move ticker and update to $app update */
    debug() {
        if(!this._debug){
            this._debug = true;
            let debugLine = new PIXI.Graphics();
            let debugFarPoint = new PIXI.Graphics();// far point factor line
            const redraw = (debugLine,debugFarPoint) => {
                return (lockX=$camera._fpXLock,lockY=$camera._fpYLock) => {
                    debugLine.lineStyle(4, 0xffffff, 1);
                    debugLine.lineStyle(6,lockY?0xff0000:0xffffff,0.6).moveTo(this._screenW/2,0).lineTo(this._screenW/2, this._screenH).endFill(); // Vertical line Y
                    debugLine.lineStyle(6,lockX?0xff0000:0xffffff,0.6).moveTo(0,this._screenH/2).lineTo(this._screenW, this._screenH/2).endFill();
                    debugLine.beginFill(0x000000, 0.6).lineStyle(2).drawRect(0,0,220,335).endFill(); // debug data square
                    debugFarPoint.lineStyle(2,0x000000).moveTo(this._screenW/2,this._screenH/2).lineTo(this.far.x, this.far.y).endFill(); // Vertical line
                };
            }
              
            this.redrawDebugScreen = redraw(debugLine,debugFarPoint); // create closure for redraw
            this.redrawDebugScreen();

            $stage.addChildAt(debugLine,6);
            $stage.addChildAt(debugFarPoint,7);
            this.far.anchor.set(0.5);
            this.far.alpha = 0.5;
            this.far.tint = 0xff0000;
            this.far.width = 64, this.far.height = 64;
            // add once screen debug
        
            const [x,y,px,py,zoom,sceneW,sceneH,camToMapX,camToMapY,fpX,fpY,fpf] = Array.from({length:12},()=>(new PIXI.Text('',{fill: "white",fontSize: 20})));
            y   .x = 85;
            px  .y = 34; py  .y = 34;
            py  .x = 85;
            zoom.y = 68;
            sceneW.y = 102;
            sceneH.y = 136;
            camToMapX.y = 170
            camToMapY.y = 204
            fpX.y = 238;
            fpY.y = 272;
            fpf.y = 306;
            $stage.addChild(x,y,px,py,zoom ,sceneW, sceneH, camToMapX, camToMapY, fpX, fpY,fpf);
            let [sX,sY,_sx,_sy,ss,ac] = [0,0,0,0,15,1]; // scroll power and scroll speed
            $app.ticker.add((delta) => {
                if(this.moveProgress){return}; // avoid update when camera set to new pivot point
                x.text = 'x:'+~~this.x;
                y.text = 'y:'+~~this.y;
                px.text = 'px:'+~~this.pivot.x;
                py.text = 'py:'+~~this.pivot.y;
                zoom.text = 'zoom:'+this._zoom.toFixed(3);
                sceneW.text = 'sceneW:'+this._sceneW;
                sceneH.text = 'sceneH:'+this._sceneH;
                camToMapX.text = 'camToMapX:'+~~this.camToMapX;
                camToMapY.text = 'camToMapY:'+~~this.camToMapY;
                fpX.text = `fpX:${~~this.far.x} : (${~~(this.far.x-this.far.position.__x)})`;
                fpY.text = `fpY:${~~this.far.y} : (${~~(this.far.y-this.far.position.__y)})`;
                fpf.text = 'fpf:'+this._fpf.toFixed(3)+'';

                //TODO: ADD ME TO $app core
                const m =  $mouse;
                const sW = this._screenW-4, sH = this._screenH-4;
                let acc = void 0;
                acc = (m.x<4)?sX-=ac:(m.x>sW)?sX+=ac:acc;
                acc = (m.y<4)?sY-=ac:(m.y>sH)?sY+=ac:acc;
                acc? ac+=0.4 : ac = 2;
                this.pivot.x+=(sX-this.pivot._x)/ss;
                this.pivot.y+=(sY-this.pivot._y)/ss;
                if(!this._fpXLock){
                    this.far.lockX? this._fpX = (this.far.lockX-this.pivot.x) && delete this.far.lockX : void 0; // update lock from last lock
                    this.far.x = (this._screenW/2)+this._fpX;
                }else{
                    //!this.far.lockX? this.far.lockX = this.pivot.x : void 0;
                    //this.far.x = (this._screenW/2)+this._fpX+(this.far.lockX-this.pivot.x);
                }
                if(this._fpYLock){
                    this.far.y = -this._sceneH-this.pivot.y+(this._screenH/2)+this._fpY;

                }else{
                    
                }
                
                this.far.factor = this._fpf;
                // line for far point and target lock
                debugFarPoint.clear().lineStyle(3,0x000000).moveTo(this._screenW/2,this._screenH/2).lineTo(this.far.x, this.far.y);
                
            });
        };
       
    };
};
let $camera = new _camera();
console.log1('$camera.', $camera);

document.onwheel = $camera.onMouseWheel.bind($camera); //TODO:
//document.onmousemove = $camera.onMouseCheckBorderCamera.bind($camera); //TODO: