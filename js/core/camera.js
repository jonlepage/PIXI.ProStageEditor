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
        this.position.set(this._screenW/2,this._screenH/2); // center camera
        this._sceneW = 0; // scene width
        this._sceneH = 0; // scene height
        this._zoom = 1; //target zoom for scale, not the current zoom scale
        /**@description far point to affine projections, est pinner a (0.5,0) mais permet detre piner a un objet */
        this.far = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.far.factor = 0.5;
       // this.far.renderable = false;
         /**@description default for far point factor */
        this._fpF = 0; // far factor
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
        this._target = null; // atache a target for the camera 
        /**@description preset setup for camera */
        this.cameraSetup = [
            {_fpX:0,_fpY:0,_fpF:0,_zoom:1}, // default setup
            {_fpX:520.00,_fpY:-320.00,_fpF:0.40,_zoom:0.2},
            {_fpX:520.00,_fpY:-320.00,_fpF:0.40,_zoom:1},
            {_fpX:440.00,_fpY:-1290.00,_fpF:0.55,_zoom:5.00},
            {_fpX:1010.00,_fpY:-2810.00,_fpF:0.55,_zoom:7.50},
            {_fpX:-4260.00,_fpY:-5020.00,_fpF:0.85,_zoom:1.85}
        ];
    };

    set lockCamX(value) { isNaN(value)? this._fpXLock = value && this._fpX || false : this._fpXLock = value }; // $camera.far.toLocal($camera.scene)
    set lockCamY(value) { isNaN(value)? this._fpYLock = value && this._fpY || false : this._fpYLock = value };

    get camToMapX() { return this.pivot._x + (this._sceneW/2)}; // $camera.toLocal($player.spine,$camera,{x:0,y:0})
    get camToMapY() { return this.pivot._y + this._sceneH};
    get camToMapX3D() { return this.camToMapX-(this._sceneW/2*this._fpF) }; // $camera.toLocal($player.spine,$camera,{x:0,y:0})
    get camToMapY3D() { return this.camToMapY-(this._sceneH*this._fpF) }; 
    get distFYSY(){ return (this.sp.y-this.far.y)}


    
    /** initialise the from scene
     * @param {boolean} projected - Need and compute projection for the scene?
     */
    initialize(projected) {
        const scene = this.scene = $stage.scene;
        this._projected = !!projected;
        this._sceneW = scene.background? scene.background.d.width  : this._screenW;
        this._sceneH = scene.background? scene.background.d.height : this._screenH;
        this.addChild(scene);

        if(projected){
            scene.convertSubtreeTo2d();
            $stage.addChild(this.far);
            this.far.position.set(this._screenW/2,0);
            scene.pivot.set(this._sceneW/2,this._sceneH);
        }else{
            this.removeChild(this.far);
        }
    };
    /**@description update from updateMain in sceneManager */
    update(){
        if(this._projected && this.scene){
            this.updateProjection();
            this.debug();
        }

    };

    updateProjection(){
        const far = this.far;
        const _fpX = this._fpX; // custom +-x
        const _fpY = this._fpY; // custom +-y
        const _fpF = this._fpF; // custom +-factor
        const _zoom = this._zoom; // custom +-factor
        far.x = ((this._screenW/2)-(this.pivot._x*_zoom))+_fpX;
        far.y = (-(this.pivot._y*_zoom))+_fpY;
        far.factor = _fpF;
        this.scale.set(_zoom);

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
                }
            };
        };
    };

    /**@description userfull to find a target with futur camera projection setting */
    applyCameraSetup(setup){
        const props = Object.keys(setup);
        const before = {};
        for (let i=0, l=props.length; i<l; i++) {
            const name = props[i];
            before[name] = this[name];
            this[name] = setup[name];
        };
        this.updateProjection();
        return before;
    }


    //$camera.moveToTarget(null,f)
    moveToTarget(target,setup) { // camera objet setup {x,y,z,focal{x,y}
        target = target? target.spine || target : this._target; // allow pass global $var obj, or default player
        setup = Number.isInteger(setup)? this.cameraSetup[setup] : setup || this.cameraSetup[0]; // pass setup id? or create new one
        if(target){
            //if setup for camera, need to preApply setting for good [toLocal(target)]
            const before = setup? this.applyCameraSetup(setup) : null;
            const to = this.toLocal(target, $stage.scene, void 0, void 0, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
            before && this.applyCameraSetup(before);
            TweenLite.to(this.pivot, 2, {
                x:to.x, y:to.y, 
                ease: Power4.easeOut,
                onComplete: () => {},
            });
        }
        // apply setup camera
        Object.entries(setup).forEach(prop => {
            TweenLite.to(this, 2, {
                [prop[0]]:prop[1],
                ease: Power4.easeOut,
            });
        });


    };

    setZoom(value,speed=1,ease) {
        TweenLite.to(this.scale, 2, {
            x:value, y:value, 
            ease: Elastic.easeOut.config(0.4, 0.4),
        });
       // this.moveToTarget();
    };

    onMouseWheel(e){
        //TODO: isoler le zoom dans un pixi points pour precalculer le resulta final
        // ajouter un condition si mode debug
        const value = e.deltaY>0 && -0.1 || 0.1;
        //if(this._zoom+value>2.5 || this._zoom+value<1 ){return};
        this._zoom+=value;
        //this.setZoom(this._zoom,3);  //ratio,speed,ease
    };
    
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
                    debugLine.beginFill(0x000000, 0.6).lineStyle(2).drawRect(0,0,220,500).endFill(); // debug data square
                    debugFarPoint.lineStyle(2,0x000000).moveTo(this._screenW/2,this._screenH/2).lineTo(this.far.x, this.far.y).endFill(); // Vertical line
                };
            }
              
            this.redrawDebugScreen = redraw(debugLine,debugFarPoint); // create closure for redraw
            this.redrawDebugScreen();

            $stage.addChildAt(debugLine,6);
            $stage.addChildAt(debugFarPoint,7);
            this.far.anchor.set(0.5);
            this.far.alpha = 0.8;
            this.far.tint = 0x00787c;
            this.far.width = 72, this.far.height = 72;
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
                fpX.text = `fpX:${~~this.far.x} : (${~~(this.far.x-this._fpX)})`;
                fpY.text = `fpY:${~~this.far.y} : (${~~(this._fpY)})`;
                fpf.text = 'fpf:'+this._fpF.toFixed(3)+'';
               
                debugFarPoint.clear().lineStyle(3,0x000000).moveTo(this._screenW/2,this._screenH/2).lineTo(this.far.x, this.far.y);
                
            });
        };
       
    };
};
let $camera = new _camera();
console.log1('$camera.', $camera);

document.onwheel = $camera.onMouseWheel.bind($camera); //TODO:
//document.onmousemove = $camera.onMouseCheckBorderCamera.bind($camera); //TODO: