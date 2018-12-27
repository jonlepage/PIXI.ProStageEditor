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
        /**@description far point to affine projections, est pinner a (0.5,0) mais permet detre piner a un objet */
        this.far = new PIXI.Sprite(PIXI.Texture.WHITE);
       // this.far.renderable = false;
         /**@description default for far point factor */
        this._fpf = 0; // far factor
        this._fpX = 0; // x focus 2d projection (debug with arrow)
        this._fpY = 0; // y focus 2d projection (debug with arrow)
        this._fpXLock = true;
        this._fpYLock = true;
        this.lfp = new PIXI.Point(this._screenW/2,this._screenH/2); // far point locked on top screen, laisse come ca pas defaut, utilise _fpX,_fpY
        /**@description screen position, les coordonnées XY centrer du view-port (ecrant) */
        this.sp = new PIXI.Point(this._screenW/2,this._screenH/2);
        /**@description target point, les coordonnées XY du target */
        this.tp = new PIXI.Point();

        this.scene = null; // scene asigneded when camera initialised
        this.target = null;
    };
    set lockCamX(value) { isNaN(value)? this._fpXLock = value && this._fpX || false : this._fpXLock = value }; // $camera.far.toLocal($camera.scene)
    set lockCamY(value) { isNaN(value)? this._fpYLock = value && this._fpY || false : this._fpYLock = value };

    get camToMapX() { return this.pivot._x + (this._sceneW/2)}; // $camera.toLocal($player.spine,$camera,{x:0,y:0})
    get camToMapY() { return this.pivot._y + this._sceneH};
    get camToMapX3D() { return this.camToMapX-(this._sceneW/2*this._fpf) }; // $camera.toLocal($player.spine,$camera,{x:0,y:0})
    get camToMapY3D() { return this.camToMapY-(this._sceneH*this._fpf) }; 
    get distFYSY(){ return (this.sp.y-this.far.y)}
    get plocal(){
        const point = $camera.parent.toLocal($player.spine,$camera.scene);
        //point.x/=this._zoom//-=this.x//-(this.pivot._x);
        //point.y/=this._zoom//-=this.y//-(this.pivot._y);
        point.x-=(this.x-this.pivot._x);
        point.y-=(this.y-this.pivot._y);
        return point;
    };

    initialize(projected) {
        const scene = this.scene = $stage.scene;
        //scene.convertSubtreeTo2d(); //TODO: prepare les scene deja en 2d
        this.addChild(scene);
        scene.convertSubtreeTo2d();
        this._sceneW = scene.background? scene.background.d.width :  this._screenW;
        this._sceneH = scene.background? scene.background.d.height : this._screenH;
        scene.pivot.set(this._sceneW/2,this._sceneH);
        this.position.set(this._screenW/2,this._screenH/2);

        const far = this.far;
        far.factor = this._fpf; // facteur pour la projection global de la map sur les axe x et y
        far.position.set(this._screenW/2,-this._sceneH);
        far.position.__x = far.position._x;
        far.position.__y = far.position._y;
        $stage.addChild(far);
        
        // Listen for animate update
        if(!this._tickerProjection){
            $app.ticker.add((delta) => { 
                this.updateProjection();
                this.debug();//TODO: REMOVE ME
            });
        };
        
    };

    updateProjection(){
        const far = this.far;
        let pos = this.toLocal(far.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
        pos.y = -pos.y;
        pos.x = -pos.x;
        this.proj.setAxisY(pos, -far.factor);
        const objList =  $objs.list_master;
        for (let i=0, l= objList.length; i<l; i++) {
            const cage = objList[i];
            if(cage.constructor.name === "ContainerSpine"){
                cage.d.proj.affine = PIXI.projection.AFFINE.AXIS_X;
            }else{
                if(!cage.isCase){ // TODO: add affine method in container car special pour les case
                    cage.d.proj.affine = PIXI.projection.AFFINE.AXIS_X;
                    cage.n.proj.affine = PIXI.projection.AFFINE.AXIS_X;
                };
            };
        };
    };

    /** use only for precompute between ticks for get easing camera coord */
    preComputeProjWith(factor){
        //const fp = {x:x,y:y}
        let pos = this.toLocal(this.far.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
        pos.y = -pos.y;
        pos.x = -pos.x;
        this.proj.setAxisY(pos, -factor);
    };

    updateFarPointFromTarget(fpX,fpY,fpf){
        this.far.x = this.sp.x-(this.pivot._x*this._zoom)+(fpX||this._fpX);
        this.far.y = -((this.pivot._y+this._sceneH)*this._zoom)+this.sp.y+(fpY||this._fpY)+((this._sceneH*this._zoom)*(fpf||this.far.factor));
    };

    setTarget(obj = $player.spine) { // add target to camera, default player
        this.target = obj;
    };

    //$camera.moveToTarget(null,f)
    moveToTarget(obj,factor=0,fx=0,fy=0) { // camera objet setup {x,y,z,focal{x,y}
    // ont doit precalcul toLocal en 2 step, avec le camera setup actuel, et un autre apres avoir redefenir le camera setup.
       // this.moveProgress = true; // stop update // TODO: Ajouter le update du bas , dans les master
       // backup
        const origin_piv = this.pivot.clone();
        const origin_far = {x:this.far.x, y:this.far.y, f:this.far.factor};
        //this.far.factor = factor;
        this.preComputeProjWith(factor);
        let toPivot = this.plocal; // go to local target ? player
        this.pivot.copy(toPivot);
        // step 2 refactor with fx and fy
        //this.far.x = this.lfp.x-(this.pivot._x*this._zoom)+this._fpX,
        //this.far.y = -((this.pivot._y+this._sceneH)*this._zoom)+this.lfp.y+this._fpY+((this._sceneH*this._zoom)*factor),
        //this.preComputeProjWith();
        //toPivot = this.plocal;
        //this.pivot.copy(toPivot);
        this.far.factor = factor;
        this.far.x = this.lfp.x-(this.pivot._x*this._zoom)+this._fpX

        return;
        // step1: find position to player
   
       
        // step2: find position to far and factor for fit to player
        // step:2 create new point for easing
        const toFar = { //TODO: a precompute preComputeProjWith
            x:this.lfp.x-(this.pivot._x*this._zoom)+this._fpX,
            y:-((this.pivot._y+this._sceneH)*this._zoom)+this.lfp.y+this._fpY+((this._sceneH*this._zoom)*this._fpf),
            f:this.far.factor
        };
        const _toPivot = this.pivot.clone();
        // step: reset to default coor and setup for easing
        this.pivot.copy(origin_piv);
        this.preComputeProjWith(origin_far.f);

        TweenLite.to(this.pivot, 2, {
            x:_toPivot.x, y:_toPivot.y, 
            ease: Elastic.easeOut.config(0.4, 0.4),
            onComplete: () => {},
        });
        TweenLite.to(this.far, 2, {
            x:toFar.x, 
            y:toFar.y, 
            ease: Elastic.easeOut.config(0.4, 0.4),
        });
        TweenLite.to(this.far, 2, {
            factor:factor,
            ease:  Elastic.easeOut.config(0.4, 0.4),
        });
        

    };


    moveTo(x,y){ // target {x,y,z,focal{x,y}}
        this.moveProgress = true;
        const toX = -(this._sceneW/2)+x;
        const toY = -this._sceneH+y;
        const focalX = (toX*this._fpf);
        const focalY = (toY*this._fpf);
        this.pivot.set( toX-focalX, toY-focalY );
        this.far.x = this.sp.x-(this.pivot._x*this._zoom)+this._fpX;
        this.far.y = -((this.pivot._y+this._sceneH)*this._zoom)+this.sp.y+this._fpY+((this._sceneH*this._zoom)*this._fpf);
        console.log('this.far.y: ', this.far.y);
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
        this.scale.set(value);
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
                    debugLine.beginFill(0x000000, 0.6).lineStyle(2).drawRect(0,0,220,420).endFill(); // debug data square
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
           
            const [x,y,px,py,zoom,sceneW,sceneH,camToMapX,camToMapY,camToMapX3D,camToMapY3D,fpX,fpY,fpf,plocal] = Array.from({length:15},()=>(new PIXI.Text('',{fill: "white",fontSize: 20})));
            const v = [x,y,px,py,zoom,sceneW,sceneH,camToMapX,camToMapY,camToMapX3D,camToMapY3D,fpX,fpY,fpf,plocal];
            let _margeY = 34, _lastY = 0;
            v.forEach(vv => {
                vv.y = _lastY;
                _lastY+=_margeY;
            });
            $stage.addChild(...v);
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
                camToMapX3D.text = 'camToMapX3D:'+~~this.camToMapX3D;
                camToMapY3D.text = 'camToMapY3D:'+~~this.camToMapY3D;
                fpX.text = `fpX:${~~this.far.x} : (${~~(this.far.x-this.far.position.__x)})`;
                fpY.text = `fpY:${~~this.far.y} : (${~~(this.distFYSY)})`;
                fpf.text = 'fpf:'+this._fpf.toFixed(3)+'';
                plocal.text = `plocal: [x:${~~this.plocal.x} : y:${~~this.plocal.y}]`;

                //TODO: ADD ME TO $app core
                //const m =  $mouse;
                //const sW = this._screenW-4, sH = this._screenH-4;
                //let acc = void 0;
                //acc = (m.x<4)?sX-=ac:(m.x>sW)?sX+=ac:acc;
                //acc = (m.y<4)?sY-=ac:(m.y>sH)?sY+=ac:acc;
                //acc? ac+=0.4 : ac = 2;
                //this.pivot.x+=(sX-this.pivot._x)/ss;
                //this.pivot.y+=(sY-this.pivot._y)/ss;
                //if(!this._fpXLock) {
                //    this.far.lockX? this._fpX = (this.far.lockX-this.pivot.x) && delete this.far.lockX : void 0; // update lock from last lock
                //    this.far.x = (this._screenW/2)+this._fpX;
                //}else{
                //    !this.far.lockX? this.far.lockX = this.pivot.x : void 0;
                //    this.far.x = this.sp.x-(this.pivot._x*this._zoom)+this._fpX;
                //}
                //if(this._fpYLock) {
                //    this.far.y = -((this.pivot._y+this._sceneH)*this._zoom)+this.sp.y+this._fpY+((this._sceneH*this._zoom)*this._fpf);
                //} else {
                //    
                //};
                //this.far.factor = this._fpf;

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