
/*:
// PLUGIN □────────────────────────────────□ MESSAGE CORE ENGINE □───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc manage message interaction and animation, text database are in core_text.js
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $messages CLASS: _messages
//└------------------------------------------------------------------------------┘
class _messages{
    constructor() {
        // les texts data son separer par des id, considerer comme des events
        this.data = null; // if data => isBusy
        this._bubbleID = -1; // progresse between bubblesTxt and pages
        this._eventLenght = 0;
        this.current = null; // current bubble showed
    };

    intitialize(textID){
        if(!$texts[textID]){throw console.error(`show id text event id: ${id} not exist !!!`)};
        this.data = $texts[textID];
        this._txtDataBaseID = textID;
        this._bubbleID = -1;
        this._eventLenght = this.data.length;
        this.nextBubble();
    };

    // show new events messages with $texts id events
    nextBubble() {
        const bID = ++this._bubbleID;
        if(bID<this._eventLenght){ // discution events inProgress
            this.current = new _bubbleTxt(bID, this.data[bID]);
        }else{ // discution events terminer, TODO: retour a la normal
            // ending messages events
            $camera.setTarget($player, 6);
            this.data = null;
            this._currentBubleID = 0;
            this.bufferDestoys = [];
        }
    };

    fitMessageToCamera(tX,tY,zoom){
        this.current.moveCameraBone(tX,tY,zoom);
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
$messages = new _messages();
console.log1('$messages', $messages);

//#region [rgba(1, 20, 40,0.2)]
/** Class bubble thats show a text sprites from events text target */
class _bubbleTxt{
    constructor(id, data) {
        this._id = id;
        this.data = data;
        this._pageIndex = -1;
        this._pageLenght = data.pagesData.length;
        this._margin_w = -100; // margin est la valeur zero minimal pour le text, car les position a 0 ne sont pas normaliser
        this._margin_h = -180;
        this._bsf = ~~1/0.4; // the spine bubble are scale at 0.4 need compute factor
        this.target = this.getTarget();
        this.intialize();
        this.setupInteractive(true);

    };

    getTarget(){
        switch (this.data._targetEvent) {
            case 'p1': return $player ;break;
            case 'p2': return $player2 ;break; //TODO:
            default: return $Objs._masterList[_targetEvent]; break; //TODO:
        };
    };

    remove_spritesMessage(){
        this.spine.removeChild(this.messages);
        this.messages = null;
    };

    intialize(){
        const spine = this.spine = new PIXI.ContainerSpine($Loader.Data2.messageBox); // (database,skin)
        this.controler_P = spine.d.skeleton.findBone('controler_P' ); // the bone for control and fit the bubble position
        this.controler_h = spine.d.skeleton.findBone('controler_h' );
        this.controler_w = spine.d.skeleton.findBone('controler_w' );
        this.targetP = new PIXI.Point(this.target.x-45, this.target.y-(this.target.spine.height/2.5)); //player or event TODO: add method getPositionForMessage
        this.messagesP = new PIXI.Point( this.targetP.x+70, -this.targetP.y-35 );
        spine.position.copy(this.targetP);
        spine.parentGroup = $displayGroup.group[4];
        spine.d.alpha = 0.9;
        $stage.scene.addChild(spine);
        // initialisation utilise un easing scale de base
        this.nextPage();
    };

    // prevent memoryLeak
    destroy(){
        this.spine.removeAllListeners();
        $stage.scene.removeChild(this.spine);
        delete this.spine;
        delete this.controler_P;
        delete this.controler_h;
        delete this.controler_w;

    }

    nextPage(){
        this._pageIndex++;
        if(this._pageIndex<this._pageLenght){
            this.create_spritesMessage();
            this.createMotionsBlurFrom();
           // bind initial distance for camera zoom
           this._bindDistX = this.spine.position.x+this.controler_w.worldX;
           this._bindDistY = this.spine.position.y+this.controler_h.worldY;
           this.controler_P.xx = this.controler_P.x; // backup ?
           this.controler_P.yy = this.controler_P.y;
           this.setupEasing(!this._pageIndex);
           this.setupCamera();
        }else{
            // plus de page, finish and destroy
            this.setupInteractive(false);
            $messages.nextBubble();
            TweenMax.to(this.spine, 3, {
                alpha: 0,
                ease:  Power4.easeOut,
                onComplete:()=>this.destroy(),
            });
            TweenMax.to(this.spine.scale, 2, {
                x:0.5,y:0.5,
                ease:  Power4.easeOut,
            });
        }
    };

    create_spritesMessage(){
        this.messages && this.remove_spritesMessage();
        const messages = this.messages = new PIXI.Container();
        const dataPage = this.data.pagesData[this._pageIndex];
        messages.spritesTxt = [];
        for (let i=0, l=dataPage.length; i<l; i++) {
            const data = dataPage[i];
            const spriteTxt = messages.spritesTxt[i] = new PIXI.Text(data._txt, $texts.styles[data._styleID]);
            spriteTxt.position.set(data._x, data._y);
        };
        messages.addChild(...messages.spritesTxt);
        messages.parentGroup = $displayGroup.group[4];
       //messages.pivot.y = this.data.pagesSize.h[this._pageIndex];
        messages.scale.set(0.4);
        this.controler_w.x = this._margin_w-this.data.pagesSize.w[this._pageIndex];
        this.controler_h.y = this._margin_h+this.data.pagesSize.h[this._pageIndex];
        this.controler_w.update();
        this.controler_h.update();
        messages.position.set(this.controler_w.worldX,this.controler_h.worldY);
        messages.position.xx = messages.position.x;
        messages.position.yy = messages.position.y;
        this.spine.addChild(messages);
    };

    createMotionsBlurFrom(){
        const messages = this.messages;
        const cageTxt_rendered = new PIXI.Sprite( $app.renderer.generateTexture(messages) );
        cageTxt_rendered.alpha = 0.5;
        cageTxt_rendered.filterArea = cageTxt_rendered.getBounds(true).pad(40)
        cageTxt_rendered._filters = [ new PIXI.filters.MotionBlurFilter ([15,20], 80, 0)];
        messages.addChildAt(cageTxt_rendered,0);
        messages.spritesMotionBlur = cageTxt_rendered;
    };


    setupInteractive(value){
        const spine = this.spine;
        spine.interactive = value;
        spine.on('pointerover' , this.pointerIN_messages  , this);
        spine.on('pointerout'  , this.pointerOUT_messages , this);
        spine.on('pointerdown' , this.pointerDW_messages  , this);
        spine.on('pointerup'   , this.pointerUP_messages  , this);
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
    setupEasing(firstPage){
        const spine      = this .spine
        const messages   = this .messages
        const spritesTxt = messages.spritesTxt
        if(firstPage){
            spine.skew.y = -1;
            spine.scale.set(0);
            TweenMax.to(spine.skew, 0.5, {
                y: 0,
                ease:  Elastic.easeOut.config(1, 0.4),
            });
            
            TweenMax.to(spine.scale, 0.4, {
                x: 1,y: 1,
                ease: Back.easeOut.config(1.7),
                onComplete:()=>{
                    TweenMax.to(spine.scale, 6, {
                        x: 1.05,y: 1.05,
                        ease: Power1.easeInOut,
                        repeat: -1,
                        yoyoEase: true,
                    });
                }
            });
        };
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


    // move camera to new target
    setupCamera(){
        $camera.setTarget(this.target, 3);
    };
    


    // move camera bone for fit screen
    moveCameraBone(tX,tY,zoom){
        const diffX = (this._bindDistX-tX-100);
        const diffY = (this._bindDistY-tY-20);
        if(diffX<0){
          TweenMax.to(this.controler_P, 4.5, {
                x:this.controler_P.xx-(diffX*this._bsf),
                ease: Elastic.easeOut.config(0.9, 0.4),
            });
            TweenMax.to(this.messages.position, 3.5, {
                x:this.messages.position.xx-diffX,
                ease: Elastic.easeOut.config(0.9, 0.4),
            });
        };
        if(diffY<0){
            TweenMax.to(this.controler_P, 4.5, {
                  y:this.controler_P.yy+(diffY*this._bsf),
                  ease: Elastic.easeOut.config(0.9, 0.4),
              });
              TweenMax.to(this.messages.position, 3.5, {
                  y:this.messages.position.yy-diffY,
                  ease: Elastic.easeOut.config(0.9, 0.4),
              });
          };
        

        /*if(1){
            this.controler_P

        }*/
        //const cp = this.controler_P;
        //const xx = g.x+(cp.x*zoom);
        /*if($camera.zoom>=1.5){
            TweenMax.to(this.controlerXY, 0.5, {
                x:tX-1500,y:-tY+1000,
                ease: Power2.easeOut,
            });
            TweenMax.to(this.sprites.messages.position, 2, {
                x:this.controlerXY.x,
                y:-this.controlerXY.y,
                ease: Power2.easeOut,
            });
        };*/
    };
};

//#endregion