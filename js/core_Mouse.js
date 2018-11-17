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
class _mouse {
    constructor() {
        this.name = "mouseContainer";
        this.pointer = null; // store spine sprite pointer
        this.pointerLight = null; // PointLight
        this.mouseTrails = null; // mouseTrail FX container

        this._screenX = 1920;
        this._screenY = 1080;
        this.interaction = null; // reference to plugin global interaction Graphics._renderer.plugins.interaction;

        this.follower = new PIXI.Point(0,0);
        this.ease = 0.35; // easing value
        this.onCase = null;
        Object.defineProperty(this, 'currentHoldingItem', { value: null,writable: true });
    };
    get x(){ return this.interaction.mouse.global.x }
    get y(){ return this.interaction.mouse.global.y }
    set holdingItem(id){ // add item to mouse
        if(this.currentHoldingItem){ 
            this.pointer.removeChild(this.currentHoldingItem);
        };
        if(Number.isFinite(id)){
            const newItem = $items.createItemsSpriteByID(id);
            this.currentHoldingItem = newItem;
            this.pointer.addChild(newItem);
        }else{
            this.currentHoldingItem = null;
        }
    }
    get holdingItem(){ return this.currentHoldingItem };



    //$mouse.initialize()
    initialize() {
        this.interaction = $app.renderer.plugins.interaction;
        this.interaction.interactionFrequency = 10;
        this.interaction.cursorStyles.default = "none";
        this.interaction.cursorStyles.pointer = "none";
        this.interaction.setCursorMode('none');
        $mouse.interaction.on( 'pointerup', function(e) {  // TODO: GLOBAL INTERACTION
            console.log('pointerup: GLOBAL holdingItem:null');
            if(e.data.button === 2 && this.holdingItem){
                this.holdingItem = null;
            }
        }, $mouse ); // global
        //this.addChild(this.light);

        // create spine sprite pointer
        const pointer = new PIXI.spine.Spine($Loader.Data2.gloves.spineData);
        pointer.skeleton.setSkinByName("point");
        pointer.state.setAnimation(0, 'idle', true);
        pointer.pivot.set(5,5);
        //pointer.parentGroup = $displayGroup.group[4]; 
        this.pointer = pointer;
        

        // create light pointer for mouse
        const pointerLight = new PIXI.lights.PointLight(0xffffff,1);
        this.pointerLight = pointerLight;
        this.pointer.addChild(pointerLight)


        //easing mouse tikers
        // Tikers for easing the mouse
        const target = new PIXI.Point(0,0);
        const mouseTick = new PIXI.ticker.Ticker().add((delta) => {
            var target = {x: this.x , y: this.y };
            var ease = this.onCase && 0.2 || this.ease;
            if(this.onCase){ // $mouse.onCase = true;
                var globalXY = this.onCase.getGlobalPosition()
                var movementX = 0, movementY = 0;
                    movementX = (this.x - globalXY.x )/1.5; // 100 are the position of target
                    movementY = (this.y - globalXY.y )/1.5;
                target.x = globalXY.x + movementX; // 100 will be center of your target
                target.y = globalXY.y + movementY;
            };

            this.follower.x += (target.x - this.pointer.x) * ease;
            this.follower.y += (target.y - this.pointer.y) * ease;

            this.pointer.position.copy(this.follower)
            
        });
        //Game_Player.prototype.updateScroll = function(){}//disable scoll character in editor mode
        mouseTick.start();
        this.initializeTrailFX();
        $stage.CAGE_MOUSE.addChild( this.mouseTrails, this.pointer );
    };

    // initialise une trainner FX pour la souris
    initializeTrailFX(){
        let trailTexture = PIXI.Texture.fromImage('editor/trail.png')
        let historyX = []; var historyY = [];
        let historySize = 30;//historySize determines how long the trail will be.
        let ropeSize = 200; //ropeSize determines how smooth the trail will be.
        let points = [];
        //Create history array.
        for( var i = 0; i < historySize; i++){
            historyX.push(0); historyY.push(0);
        }
        //Create rope points.
        for(var i = 0; i < ropeSize; i++){points.push(new PIXI.Point(0,0))};
        //Create the rope
        let rope = new PIXI.mesh.Rope(trailTexture, points);
        rope._filters = [ new PIXI.filters.BlurFilter (4, 2)];
        //rope.filterArea = new PIXI.Rectangle(0,0,500,500);//TODO:
        rope.alpha = 0.6;
        this.mouseTrails = rope;
        
        const trailTiker = PIXI.ticker.shared.add((delta) => {
            historyX.pop();
            historyX.unshift(this.follower.x);
            historyY.pop();
            historyY.unshift(this.follower.y);
            for(let i = 0; i < ropeSize; i++){
                let p = points[i];
                let ix = cubicInterpolation( historyX, i / ropeSize * historySize);
                let iy = cubicInterpolation( historyY, i / ropeSize * historySize);
                p.x = ix; p.y = iy;
            }
        });
        function clipInput(k, arr){
            if (k < 0){k = 0;}
            if (k > arr.length - 1){  k = arr.length - 1;}
            return arr[k];
        };
        function getTangent(k, factor, array){return factor * (clipInput(k + 1, array) - clipInput(k - 1,array)) / 2;}
        function cubicInterpolation(array, t, tangentFactor){
            if (tangentFactor == null) tangentFactor = 1;
            var k = Math.floor(t);
            var m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
            var p = [clipInput(k,array), clipInput(k+1,array)];
            t -= k;
            var t2 = t * t;
            var t3 = t * t2;
            return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + ( -2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
        };
    }


};// end class

//$mouse.sprite
$mouse = new _mouse();
console.log1('$mouse. ', $mouse);




 _mouse.prototype.mouseMove = function(e) {

     this.mPos.x = this.interaction.mouse.global.x;
     this.mPos.y = this.interaction.mouse.global.y;

 }

