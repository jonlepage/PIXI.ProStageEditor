
/*:
// PLUGIN □────────────────────────────────□ MESSAGE CORE ENGINE □───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc manage message interaction and animation, text database are in core_text.js
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $text CLASS: _messages
//└------------------------------------------------------------------------------┘
class _messages{
    constructor() {
        // les texts data son separer par des id, considerer comme des events
        this.data = null;

        this._currentBubleID = 0; // progresse between bubblesTxt and pages
        this.bufferDestoys = []; // quand on terminer, stoker ici le bubbles pour sa fermeture et son destroy, permet a une autre apparaitre simultanement
    };

    intitialize(id){
        if(!$texts[id]){throw console.error(`show id text event id: ${id} not exist !!!`)};
        this.data = $texts[id] || null;
        this._currentBubleID = 0;
        return this.show(this._currentBubleID);
    };

    // show new events messages with $texts id events
    show(id) {
        if(!this.data){ return this.intitialize(id) }; // initialise bubbles messages managers
        const bubbletxt = new _bubbleTxt(this.data[id],id);



        

  
/*
       
    */

    /*
        // position to target camera
        // normalise global bone camera position
        const globalMessageXY = cageMessage.getGlobalPosition(); // global wihout zoom
        const globalCameraBoneXY = new PIXI.Point( globalMessageXY.x+cameraBoneXY.x, globalMessageXY.y+cameraBoneXY.y );
        const ids = this.lists.length;
        this.lists.push(
            {
                id,
                globalMessageXY,
                globalCameraBoneXY,
                cageTxt,
                cageMessage,
                cameraBoneXY,
                maxW,
                maxH,
            }
        );
        if(Number.isFinite(tX)){
            this.moveTo(id,tX,tY);
        }else{
            const xx = globalMessageXY.x+cameraBoneXY.x;
            const yy = globalMessageXY.y-cameraBoneXY.y;
            cameraBoneXY.x=0
            cameraBoneXY.y=0
            this.moveTo(id,xx,yy);
        };
        //INTERACTIONS
        cageMessage.id = id;
        cageMessage.interactive = true;
        cageMessage.on('pointerover', this.pointerIN_messageBox , this);
        cageMessage.on('pointerout' , this.pointerOUT_messageBox, this);
        cageMessage.on('pointerdown', this.pointerDW_messageBox , this);
        cageMessage.on('pointerup'  , this.pointerUP_messageBox , this);

        const state = $player.spine.d.state;
            state.addAnimation(3, "talk1", false);
            state.addEmptyAnimation(3,0.2); //(trackIndex, mixDuration, delay)
*/
    };


    resizeMessageFrom(cageMessage,cageTxt){
        // RESIZE from text limit height and width
        const size = this.data[this._currentPage].pagesSize;
        
        const controlerH = cageMessage.d.skeleton.findBone('txtControl_height2');
        const hh = new PIXI.Point(controlerH.x,controlerH.y);
        controlerH.x =  -size.h//*zoomFactor); // weird but y become x in spinePlugin

        const controlerW = cageMessage.d.skeleton.findBone('txtControl_width_low');
        const ww = new PIXI.Point(controlerW.x,controlerW.y);
        if(size.w>this._minTextWitdh){ controlerW.x = -this._minTextWitdh+(size.w*0.4) }; // weird but y become x in spinePlugin
        return {controlerH,controlerW,hh,ww};
    };

    moveTo(messageID,tX,tY){
        if(this.lists[messageID]){
            const data = this.lists[messageID];
            TweenMax.to(data.cameraBoneXY, 1, {
                x: isFinite(tX)? tX-data.globalMessageXY.x : data.cameraBoneXY.x,
                y: isFinite(tY)?-tY+data.globalMessageXY.y : data.cameraBoneXY.y,
                ease: Elastic.easeOut.config(0.9, 0.4),
            });
            TweenMax.to(data.cageTxt, 2, {
                x: isFinite(tX)? tX-data.globalMessageXY.x+70 : data.cageTxt.x,
                y: isFinite(tY)? tY-data.globalMessageXY.y-30 : data.cageTxt.y,
                ease: Elastic.easeOut.config(1, 0.6),
    
            });
        };
    };



    debug(cageMessage,cage,bounds,spriteTxt){
        const g = new PIXI.Graphics();
        g.beginFill( 0x000000, 0.2 );
        g.lineStyle( 2, 0xff0000, 1 );
        g.drawRect( 0, 0, bounds.width, bounds.height );
        g.position.set(bounds.x,-bounds.y);
        const txtG = new PIXI.Text(`[w:${~~bounds.width} : h:${~~bounds.height}]`,{fill: "#ff0000",fontSize: 16, stroke: 0x000000, strokeThickness: 4});
        txtG.pivot.set(0,txtG.height+30);
        g.addChild(txtG);
        cageMessage.addChildAt(g,1);
        // debug texts box 
        spriteTxt.forEach(st => {
            const data = st.data;
            const g = new PIXI.Graphics();
                g.beginFill( 0x000000, 0.5 );
                g.lineStyle( 2, data.metric.style._fill, 1 );
                g.drawRect( 0, 0, data.metric.width, data.metric.height );
                const txtG = new PIXI.Text(`[w:${~~data.metric.width} : h:${~~data.metric.height}]`,{fill: "#ff0000",fontSize: 14, stroke: 0x000000, strokeThickness: 2});
                txtG.pivot.set(0,txtG.height);
                g.addChild(txtG);
                st.addChild(g);
        });
    };

    pointerIN_messageBox(e) {
        const cageMessage = e.currentTarget;
        cageMessage._filters = [new PIXI.filters.OutlineFilter(4, 0x000000, 1)]; // TODO:  make a filters managers cache
    };
    pointerOUT_messageBox(e) {
        const cageMessage = e.currentTarget;
        cageMessage._filters = null;
    };
    pointerDW_messageBox(e) {
        const cageMessage = e.currentTarget;
        TweenMax.to(cageMessage.scale, 1, {
            x:1.12,y:1.12,
            ease: Power1.easeOut,
        });
    };
    pointerUP_messageBox(e) {
        const cageMessage = e.currentTarget;
        TweenMax.to(cageMessage.scale, 0.5, {
            x:1,y:1,
            ease: Elastic.easeOut.config(1, 0.4),
        });
        this.createSpritesFromPagesData()
    };

};
$message = new _messages();
console.log1('$message', $message);

/** Class bubble thats show a text sprites from events text target */
class _bubbleTxt{
    constructor(data,id) {
        this._id = id;
        this.data = data;
        this.target = this.getTarget(data._targetEvent);
        this._pageIndex = 0;
        this.targetXY   = null; // fitting position for target
        this.messagesXY = null; // fitting position for messages texts
        this._minTextWitdh = 500; //the bone from spine are not at 0, need substract for auto-size
        this._zoomFactor = 0.4; // the text metric are compute without zoom factor, so we want scale for get biutifull text in zoom
        this.intialize();
        this.setupInteractive();
        this.setupEasing();
    };

    intialize(){
        // message box spine
        const spine = new PIXI.ContainerSpine($Loader.Data2.messageBox); // (database,skin)
        const controlerXY = spine.d.skeleton.findBone('cameraXY'             ); // the bone for control and fit the bubble position
        const controlerH  = spine.d.skeleton.findBone('txtControl_height2'   );
        const controlerW  = spine.d.skeleton.findBone('txtControl_width_low' );
        const messages = new PIXI.Container();
        this.setupSpine      (spine);
        this.createSpritesTxt(messages);
        this.setupControlers (controlerXY);
        this.setupSize       (controlerH,controlerW);
        spine.position.copy(this.targetXY);
        messages.position.copy(this.messagesXY);
        spine.addChild(messages);
        $stage.scene.addChild(spine);
        this.createMotionsBlurFrom(messages);
        // reference
        this.sprites = {spine,messages};
        // player interaction TODO:
        const state = $player.spine.d.state;
        state.addAnimation(3, "talk1", false);
        state.addEmptyAnimation(3,0.2); //(trackIndex, mixDuration, delay)
    };

    setupSpine(spine){
        spine.d.stateData.defaultMix = 0.2;
        spine.d.state.timeScale = 0.1;
        const entry = spine.d.state.setAnimation(0, "show", false);
        entry.timeScale = 10;
        spine.d.state.addAnimation(0, "idle", true);
        // TODO: create method getPositionForBubbleTxt
     
        spine.parentGroup = $displayGroup.group[4];
        spine.alpha = 0.9;
    };

    getTarget(_targetEvent){
        switch (_targetEvent) {
            case 'p1': return $player ;break;
            case 'p2': return $player ;break; //TODO:
            default: return $Objs._masterList[_targetEvent]; break; //TODO:
        };
    };

    createSpritesTxt(messages){
        messages.children.length && messages.removeChildren();
        messages.spritesTxt = [];
        const dataPage = this.data.pagesData[this._pageIndex];
        for (let i=0, l=dataPage.length; i<l; i++) {
            const data = dataPage[i];
            const txt = new PIXI.Text(data._txt, $texts.styles[data._styleID]);
            txt.position.set(data._x, data._y);
            messages.spritesTxt[i] = txt;
        };
        messages.addChild(...messages.spritesTxt);
        messages.parentGroup = $displayGroup.group[4];
        messages.pivot.y = this.data.pagesSize.h[this._pageIndex];
        messages.scale.set(0.4);
    };

    createMotionsBlurFrom(messages){
        const cageTxt_rendered = new PIXI.Sprite( $app.renderer.generateTexture(messages) );
        cageTxt_rendered.alpha = 0.5;
        cageTxt_rendered.filterArea = cageTxt_rendered.getBounds(true).pad(40)
        cageTxt_rendered._filters = [ new PIXI.filters.MotionBlurFilter ([15,20], 80, 0)];
        messages.addChildAt(cageTxt_rendered,0);
        messages.spritesMotionBlur = cageTxt_rendered;
    };

    setupControlers(controlerXY){
        // text position helper
        this.targetXY = new PIXI.Point(this.target.x-45, this.target.y-(this.target.spine.height/2.5));
        this.messagesXY = new PIXI.Point( controlerXY.x+70, -controlerXY.y-35 );
        this.controlerXY = controlerXY;
    };

    setupSize(controlerH,controlerW){
        // resize messages box with bone controler
        const h = this.data.pagesSize.h[this._pageIndex];
        const w = this.data.pagesSize.w[this._pageIndex];
        controlerH.x =  (-h*0.4)-70;
        if(w>this._minTextWitdh){
            controlerW.x =  (w*0.4)-this._minTextWitdh; //*zoomFactor); // weird but y become x in spinePlugin
        };
        this.controlerH = controlerH;
        this.controlerW = controlerW;
    };


    setupInteractive(){
        const messages = this.sprites.spine;
        messages.interactive = true;
        messages.on('pointerover' , this.pointerIN_messages  , this);
        messages.on('pointerout'  , this.pointerOUT_messages , this);
        messages.on('pointerdown' , this.pointerDW_messages  , this);
        messages.on('pointerup'   , this.pointerUP_messages  , this);
    };
    
    pointerIN_messages(e) {
        const messages = e.currentTarget;
        messages._filters = [new PIXI.filters.OutlineFilter(4, 0x000000, 1)]; // TODO:  make a filters managers cache
    };
    pointerOUT_messages(e) {
        const messages = e.currentTarget;
        messages._filters = null;
    };
    pointerDW_messages(e) {
        const messages = e.currentTarget;
        TweenMax.to(messages.scale, 1, {
            x:1.12,y:1.12,
            ease: Power1.easeOut,
        });
    };
    pointerUP_messages(e) {
        const messages = e.currentTarget;
        TweenMax.to(messages.scale, 0.5, {
            x:1,y:1,
            ease: Elastic.easeOut.config(1, 0.4),
        });
        this.nextPage();
    };

    // basic loop easing
    setupEasing(){
        const spine      = this.sprites .spine
        const messages   = this.sprites .messages
        const spritesTxt = messages.spritesTxt
        TweenMax.to(spine.scale, 6, {
            x: 1.05,y: 1.05,
            ease: Power1.easeInOut,
            repeat: -1,
            yoyoEase: true
        });
        let delayAlpha = 0;
        let bevelFilter = new PIXI.filters.BevelFilter({thickness:1,lightColor:0x8a009d,lightAlpha:1,shadowAlpha:0}); // letter 3d
        spritesTxt.forEach(s => {
            s.alpha = 0;
            //s._filters = [bevelFilter]; //TODO:
            s.skew.x = 1;
            TweenMax.to(s.scale, 6+(Math.random()*2), {
                x: 0.95,y: 1+(Math.random()/10),
                ease: Power1.easeInOut,
                repeat: -1,
                yoyoEase: true,
                delay:Math.random()*5
            });
            TweenMax.to(s, 8+Math.random(), {
                rotation:0.01,
                ease: Power1.easeInOut,
                repeat: -1,
                yoyoEase: true,
                delay:Math.random()*5
            });
            TweenMax.to(s, 0.5, {
                alpha:1,
                ease: Power1.easeOut,
                delay:delayAlpha+=0.09
            });
            TweenMax.to(s.skew, 0.5, {
                x:0,
                ease: Power1.easeOut,
                delay:delayAlpha
            });
            let yy = s.position.y;
            s.position.y-=65;
            TweenMax.to(s.position, 0.6, {
                y:yy,
                ease: Bounce.easeOut,
                delay:delayAlpha+0.1
            });
        });
    };

    nextPage(){
        if(this.data.pagesData[++this._pageIndex]){
            this.createSpritesTxt(this.sprites.messages);
            //this.setupControlers(this.controlerXY);
            this.setupSize(this.controlerH,this.controlerW);
            this.sprites.messages.position.copy(this.messagesXY);
            this.setupEasing();
        }else{
            // add bubble to destroy buffer
        }
    }
}