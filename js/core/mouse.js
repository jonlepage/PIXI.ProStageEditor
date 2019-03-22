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
class _mouse {
    constructor() {
        this.pointer      = null; // store spine sprite pointer
        this.pointerLight = null; // PointLight
        this.mouseTrails  = null; // mouseTrail FX container
        this.interaction = null; // reference to plugin global interaction Graphics._renderer.plugins.interaction;
        this._isEnable = false; // disable enable mouse;
        this._holdItemID = null; // item id du item en main
        this.holdItem = null; // item Container reference

        this.follower = new PIXI.Point(0,0); // easing helper
        this._ease = 0.36; // easing value
        this.onCase = null;
    };
    get s(){return this.pointer};
    get l(){return this.pointerLight};
    get t(){return this.mouseTrails};
    get item(){return this.mouseTrails};
    get isHoldItem(){return Number.isFinite(this._holdItemID) };

    get x(){ return this.interaction.mouse.global.x }
    get y(){ return this.interaction.mouse.global.y }


    //$mouse.initialize()
    initialize() {
        //setup the interaction manager
        this.interaction = $app.renderer.plugins.interaction;
        this.interaction.interactionFrequency = 10;
        this.interaction.cursorStyles.default = "none";
        this.interaction.cursorStyles.pointer = "none";
        this.interaction.setCursorMode('none');
        this.interaction.mouse.global.x = 100; // avoid start corner camera
        this.interaction.mouse.global.y = 100;

        this.setupSprites();
        this.setupInteraction();
        this.setupTrailsFX();
        this.debug();//FIXME: DELETE ME

        $stage.CAGE_MOUSE.addChild( this.mouseTrails, this.pointer );
        this._isEnable = true; // active mouse
    };

    // create spine sprite pointer
    setupSprites(){
        const pointer = new PIXI.spine.Spine($Loader.Data2.gloves.spineData);
        pointer.stateData.defaultMix = 0.1;
        pointer.state.setAnimation(0, 'point', true);
       // pointer.pivot.set(5,5);
        this.pointer = pointer;
        // create light pointer for mouse
        const pointerLight = $stage.LIGHTS.PointLight_mouse;
        pointerLight.lightHeight = 0.02;
        pointerLight.brightness = 0.8;
        pointer.addChild(pointerLight);
        this.pointerLight = pointerLight;
    };

    setupInteraction(){// TODO: GLOBAL INTERACTION.. voir si on en a besoin
        // GLOBAL INTERACTIONS ?
        this.interaction.on('pointerover' , this.pIN_global  ,this);
        this.interaction.on('pointerout'  , this.pOUT_global ,this);
        this.interaction.on('pointerup'   , this.pUP_global  ,this);
    };

    // initialise une trainner FX pour la souris
    setupTrailsFX(){
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
    };

    pIN_global(e){

    };
    pOUT_global(e){

    };
    pUP_global(e){
        const isClickL = e.data.button === 0; // clickLeft <==
        const isClickR = e.data.button === 2; // clickRight ==>
        const isClickM = e.data.button === 1; // clickMiddle =|=
        if(isClickR && this.isHoldItem){ return this.setItemId(null) }; // remove item in mouse
        if(isClickR && $systems.status._inCombat){ return $combats.pUP_global(e) }; // si en combat et mode selectionner.

    };

    // update spine mouse display only
    update(){
        // const mouseTick = new PIXI.ticker.Ticker().add((delta) => {});// mettre dans listener si les tiks freeze trop ?
        if(this._isEnable){
            let tx = this.x, ty = this.y; // target XY
            const ease = this.onCase && 0.25 || this._ease;
            if(this.onCase){ // $mouse.onCase = true; // hack case helper
                const globalXY = this.onCase.getGlobalPosition()
                const movementX = (this.x - globalXY.x )/1.5; // 100 are the position of target
                const movementY = (this.y - globalXY.y )/1.5;
                tx = globalXY.x + movementX; // 100 will be center of your target
                ty = globalXY.y + movementY;
            };
            this.follower.x += (tx - this.pointer.x) * ease;
            this.follower.y += (ty - this.pointer.y) * ease;
            this.pointer.position.copy(this.follower);
        };
    };

    setItemId(id){
        // purge si avai deja un item en main
        const itemSlot = this.s.skeleton.findSlot('item');// for store or remove item
        if(this.isHoldItem){
            this._holdItemID = null;
            itemSlot.currentSprite.removeChildren();
        };
        // si id valid, hack spriteSlot de spine pour asigne la texture item
        if(Number.isFinite(id)){
            const newItem = $items.list[id].createSprites(true);
            this._holdItemID = id;
            this.s.state.setAnimation(0, 'take', false);
            this.s.state.addAnimation(0, 'take_idle', true);
            newItem.scale.set(0.1);
            newItem.rotation = (Math.PI/2)+Math.random();
            TweenLite.to(newItem.scale, 2, { x: 1,y: 1,ease: Elastic.easeOut.config(1.2, 0.4)});
            TweenLite.to(newItem, 1.5, { rotation: 0,ease: Elastic.easeOut.config(1.2, 0.4) });
            itemSlot.currentSprite.addChild(newItem);
            this.holdItem = newItem;
        }else{
            this.s.state.setAnimation(0, 'point', true);
        }
    };

    //add a mouse position debugger
    debug() {
        const coor = new PIXI.Text("",{fontSize:17,fill:0x000000,strokeThickness:4,stroke:0xffffff});
        const global = new PIXI.Text("",{fontSize:17,fill:0xff0000,strokeThickness:4,stroke:0xffffff});
        coor.y = -10;
        coor.x = 10;
        this.pointer.addChild(coor,global); 
        setInterval(() => {
            coor.text = `x:${~~this.x}, y:${~~this.y}`;
        }, 50);
    };
};// end class

let $mouse = new _mouse();
console.log1('$mouse. ', $mouse);


 _mouse.prototype.mouseMove = function(e) {
    this.mPos.x = this.interaction.mouse.global.x;
    this.mPos.y = this.interaction.mouse.global.y;
 };

