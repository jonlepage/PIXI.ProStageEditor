// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘
/*
┌□COLORIMETRIX□─────────────────────────────────────-HexReference-─────────────────────────────────────────────────────────────────────────┐
  #d8a757, #f46e42, #f4eb41, #b241f4, #f44197, #f4415e, #b71f37, #b71e1e, #b7af1d, #f28a0c, #aed0f9, #dd2b01, #eb0e4b, #c37665, #a74313, #c5e264, 
  #cc9b99, #c85109, #fedcb4, #a36506, #a0ff0c, #a000d0, #a00000, #ADB6BE, #B24387 ,#BBC15D ,#FA8965 ,#F3EE1E ,#CC301D
└──────────────────────────────────────────────────────□□□□□□□□□───────────────────────────────────────────────────────────────────────────┘
*/
// prepare les grafics huds pour combats, quand start, ajoute a la camera et scene car ya des affines
class _huds_victory extends PIXI.Container{
    constructor() {
        super();
        /** list ref des children container*/
        this.child = {};
        //this.position.x = 1180;
        //this.position.y = 10;
    };
 
    initialize(){
        this.initialize_sprite();
        this.initialize_vic_monsterFrame();
        this.initialize_takeAllFilters();
        this.initialize_zero();
        this.initialize_interactive();
        this.renderable = false; //FIXME: DOI LAISSER UN FRAME POUR CACHE CORRECTEMENT DANS LA MEMOIRE GPU, STUDY A WAYS PIXI.PREPARE
    };

    initialize_sprite(){
        const Data2_hudsCombatVictory = $Loader.Data2.hudsCombatVictory;
        const vic_filterBG = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_filterBG.png
        let vic_filterBG_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_filterBG );
        let vic_filterBG_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_filterBG_n );
        vic_filterBG_d.parentGroup = PIXI.lights.diffuseGroup;
        vic_filterBG_n.parentGroup = PIXI.lights.normalGroup;
        vic_filterBG.position.set(-140,145);
        vic_filterBG.addChild(vic_filterBG_d,vic_filterBG_n);
        const vic_filtersTaker_buttons = new PIXI.Container();//data2\Hubs\menueItems\SOURCE\images\filters_frame.png
        vic_filtersTaker_buttons.position.set(-60,200);
        const vic_filterLframe = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_filterLframe.png
        let vic_filterLframe_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_filterLframe );
        let vic_filterLframe_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_filterLframe_n );
        vic_filterLframe_d.parentGroup = PIXI.lights.diffuseGroup;
        vic_filterLframe_n.parentGroup = PIXI.lights.normalGroup;
        vic_filterLframe.position.set(-140,145);
        vic_filterLframe.pivot.set(10,12);
        vic_filterLframe.addChild(vic_filterLframe_d,vic_filterLframe_n);
        const vic_mainBG = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_mainBG.png
        let vic_mainBG_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_mainBG );
        let vic_mainBG_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_mainBG_n );
        vic_mainBG_d.parentGroup = PIXI.lights.diffuseGroup;
        vic_mainBG_n.parentGroup = PIXI.lights.normalGroup;
        vic_mainBG.addChild(vic_mainBG_d,vic_mainBG_n);
        const vic_monsterSplitFrame = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_monsterSplitFrame.png
        let vic_monsterSplitFrame_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_monsterSplitFrame );
        let vic_monsterSplitFrame_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_monsterSplitFrame_n );
        vic_monsterSplitFrame_d.parentGroup = PIXI.lights.diffuseGroup;
        vic_monsterSplitFrame_n.parentGroup = PIXI.lights.normalGroup;
        vic_monsterSplitFrame.position.set(5,220);
        vic_monsterSplitFrame.addChild(vic_monsterSplitFrame_d,vic_monsterSplitFrame_n);
        const vic_mainFrame = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_mainFrame.png
        let vic_mainFrame_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_mainFrame );
        let vic_mainFrame_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_mainFrame_n );
        vic_mainFrame_d.parentGroup = PIXI.lights.diffuseGroup;
        vic_mainFrame_n.parentGroup = PIXI.lights.normalGroup;
        vic_mainFrame.pivot.set(10,12);
        vic_mainFrame.addChild(vic_mainFrame_d,vic_mainFrame_n);
        const vic_monsterFrame = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_monsterFrame.png
        vic_monsterFrame.position.set(90,80);
        const vic_slider = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_slider.png
        let vic_slider_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_slider );
        let vic_slider_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_slider_n );
        vic_slider_d.parentGroup = PIXI.lights.diffuseGroup;
        vic_slider_n.parentGroup = PIXI.lights.normalGroup;
        vic_slider.position.set(665,270);
        vic_slider.addChild(vic_slider_d,vic_slider_n);
        const vic_confirm = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_confirm.png
        let vic_confirm_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_confirm );
        let vic_confirm_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_confirm_n );
        vic_confirm_d.parentGroup = PIXI.lights.diffuseGroup;
        vic_confirm_n.parentGroup = PIXI.lights.normalGroup;
        vic_confirm_d.anchor.set(0.5)
        vic_confirm_n.anchor.set(0.5)
        vic_confirm.position.set(500,960);
        vic_confirm.addChild(vic_confirm_d,vic_confirm_n);
        const vic_reset = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_reset.png
        let vic_reset_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_reset );
        let vic_reset_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_reset_n );
        vic_reset_d.parentGroup = PIXI.lights.diffuseGroup;
        vic_reset_n.parentGroup = PIXI.lights.normalGroup;
        vic_reset_d.anchor.set(0.5)
        vic_reset_n.anchor.set(0.5)
        vic_reset.position.set(650,950);
        vic_reset.addChild(vic_reset_d,vic_reset_n);
        //# text
        const reward_txt = new PIXI.Text(`${$txt._._REWARD.toUpperCase()}`,$txt.styles[3]);
        reward_txt.anchor.set(0.5);
        reward_txt.position.set(380,45);
        const info_txt_capacity = $txt.area(`[IsIcon_mic]${$txt._._CAPACITY}:[#a0ff0c]${999}/${999}[#]`,$txt.styles[5]);
        info_txt_capacity.position.set(50,790);
        info_txt_capacity.alpha = 0.5;
        const info_txt_weight = $txt.area(`[IsIcon_miw]${$txt._._WEIGHT}:[#a0ff0c]${999}/${999}[#]`,$txt.styles[5]);
        info_txt_weight.position.set(50,790+info_txt_capacity.height);
        info_txt_weight.alpha = 0.5;

        const rewardBox = new PIXI.Container(); // store le gui reward
        const battleLogBox = new PIXI.Container(); // store les log
        this.childs = {rewardBox,battleLogBox};
        this.addChild(rewardBox,battleLogBox);
        rewardBox.childs = {vic_filterBG,vic_filtersTaker_buttons,vic_filterLframe,vic_mainBG,vic_monsterSplitFrame,vic_mainFrame,vic_monsterFrame,vic_slider,vic_confirm,vic_reset,reward_txt,info_txt_capacity,info_txt_weight};
        rewardBox.addChild (vic_filterBG,vic_filtersTaker_buttons,vic_filterLframe,vic_mainBG,vic_monsterSplitFrame,vic_mainFrame,vic_monsterFrame,vic_slider,vic_confirm,vic_reset,reward_txt,info_txt_capacity,info_txt_weight);
        rewardBox.position.set(1180,10);
        battleLogBox.position.set(2,2);
    };


    /**  */
    initialize_vic_monsterFrame(){
        // max 6 monsters frames in game
        const Data2_hudsCombatVictory = $Loader.Data2.hudsCombatVictory;
        const cage = this.childs.rewardBox.childs.vic_monsterFrame;
        for (let i=0,marge=5, l=6; i<l; i++) {
            const vic_monsterFrame = new PIXI.Container();// data2/Hubs/victory/SOURCE/images/vic_monsterFrame.png
            let vic_monsterFrame_d = new PIXI.Sprite( Data2_hudsCombatVictory.textures  .vic_monsterFrame );
            let vic_monsterFrame_n = new PIXI.Sprite( Data2_hudsCombatVictory.textures_n.vic_monsterFrame_n );
            vic_monsterFrame_d.parentGroup = PIXI.lights.diffuseGroup;
            vic_monsterFrame_n.parentGroup = PIXI.lights.normalGroup;
            vic_monsterFrame_d.anchor.set(0.5,0);
            vic_monsterFrame_n.anchor.set(0.5,0);
            vic_monsterFrame.position.x = (vic_monsterFrame_d.width+marge)*i;
            vic_monsterFrame.addChild(vic_monsterFrame_d,vic_monsterFrame_n);
            cage.addChild(vic_monsterFrame);
        };
    };

    /** Creer les filtres takerAll (Lclick:filter:RclickTakeAll)  */
    initialize_takeAllFilters(){
        const vic_filtersTaker_buttons = this.childs.rewardBox.childs.vic_filtersTaker_buttons;
        const Data2_menueItems = $Loader.Data2.menueItems;
        let yy = 0, margeY = 20;
        Object.keys($items.types).forEach(type => {
            const filters_frame = new PIXI.Container(); //data2\Hubs\menueItems\SOURCE\images\filters_frame.png
            let filters_frame_d = new PIXI.Sprite(Data2_menueItems.textures.filters_frame);
            let filters_frame_n = new PIXI.Sprite(Data2_menueItems.textures_n.filters_frame_n);
                filters_frame_d.parentGroup = PIXI.lights.diffuseGroup;
                filters_frame_n.parentGroup = PIXI.lights.normalGroup;
                filters_frame_d.anchor.set(0.5);
                filters_frame_n.anchor.set(0.5);
                filters_frame.position.set(0,yy);
            //data2\Hubs\menueItems\SOURCE\images\filters_button.png
            let filters_button_d = new PIXI.Sprite(Data2_menueItems.textures.filters_button);
            let filters_button_n = new PIXI.Sprite(Data2_menueItems.textures_n.filters_button_n);
                filters_button_d.parentGroup = PIXI.lights.diffuseGroup;
                filters_button_n.parentGroup = PIXI.lights.normalGroup;
                filters_button_d.anchor.set(0.5);
                filters_button_n.anchor.set(0.5);
                filters_button_d.tint = $items.types[type].tint;
            const filters_txt = new PIXI.Text(`${$txt._["_TYPE_"+type]}`,$txt.styles[0]);
                filters_txt.anchor.set(0.5);
                filters_frame.addChild(filters_frame_d,filters_frame_n,filters_button_d,filters_button_n,filters_txt);
            
            vic_filtersTaker_buttons.addChild(filters_frame);
            yy+=filters_frame_d.height+margeY;
        });
    };

    /** asigne Zero, prend la position actuel comme final */
    initialize_zero(){
        this.position.zeroSet();
        this.children.forEach((c)=>c.position.zeroSet())
    };


    /** affiche */
    show(total_xp,total_po,monsters){
        //BUILD MONSTER ICONS XP,GOLD RESULTER
        this.renderable = true;
        const battleLogBox = this.childs.battleLogBox; // container
        //#create txt
        const victoryTxt = new PIXI.Text($txt._._VICTORY, $txt.styles[3]);
        const totalTxt =  $txt.area(`[#a0ff0c]${$txt._._TOTALXP}: ${total_xp}[#] [N30][#f4eb41]${$txt._._TOTALGOLD}: ${total_po}[#]`, $txt.styles[4]);
        //# pour chaque monstre creer un log
        const mLog = [];
        let yy = victoryTxt.height; // start y
        monsters.forEach((m) => {
            const Data2_iconsMonsters = $Loader.Data2.iconsMonsters;
            const mIcon = new PIXI.Container();
            let mIcon_d = new PIXI.Sprite( Data2_iconsMonsters.textures  [`mIcon_${m._id}`  ] );
            let mIcon_n = new PIXI.Sprite( Data2_iconsMonsters.textures_n[`mIcon_${m._id}_n`] );
                mIcon_d.parentGroup = PIXI.lights.diffuseGroup;
                mIcon_n.parentGroup = PIXI.lights.normalGroup;
            mIcon.addChild(mIcon_d,mIcon_n);
            const mTexts = new PIXI.Container();
                let name = $txt.area(`${$txt._.N_MONSTER0}: ${$txt._._LEVEL}:[#b241f4]${m._lv}[#] [#a0ff0c]${m.master?$txt._._MASTER:''}[#]`, $txt.styles[5])
                let xp = $txt.area(`[#a0ff0c]${$txt._._GETXP  }:[#] ${m.xp}`, $txt.styles[5]);
                let po = $txt.area(`[#f4eb41]${$txt._._GETGOLD}:[#] ${m.po}`, $txt.styles[5]);
                xp.y = name.y + name.height;
                po.y = xp.y+xp.height;
            mTexts.addChild(name,xp,po);
            mIcon.addChild(mTexts);
            mIcon.position.set(4,yy);
            mTexts.position.set(mIcon_d.width-2,0)
            yy+=mIcon.height;
            mLog.push(mIcon);
        });
        totalTxt.position.y = yy; // move to end
        battleLogBox.addChild(victoryTxt,totalTxt,...mLog);
        
        //ANIMATION 
        let staggerMonstersLogs = ()=>{
            const tl = new TimelineMax();
            tl.staggerFrom(mLog, 0.2, {alpha:0},0.4,0);
            tl.staggerFrom(mLog.map(c=>c.scale), 0.2, {x:0,y:0,ease: Back.easeOut.config(1.4) },0.4,0);
            return tl;
        };
        let showRewardBox = ()=>{
            const vic_monsterFrame = this.childs.rewardBox.childs.vic_monsterFrame.children;
            const vic_slider = this.childs.rewardBox.childs.vic_slider;
            const vic_filterBG = this.childs.rewardBox.childs.vic_filterBG;
            const vic_filterLframe = this.childs.rewardBox.childs.vic_filterLframe;
            const vic_filtersTaker_buttons = this.childs.rewardBox.childs.vic_filtersTaker_buttons.children;
            const reward_txt = this.childs.rewardBox.childs.reward_txt;
            const vic_confirm = this.childs.rewardBox.childs.vic_confirm;
            const vic_reset = this.childs.rewardBox.childs.vic_reset;
            const tl = new TimelineMax();
            tl.from(this.childs.rewardBox.position, 1,{ y: -900, ease: Expo.easeOut },0);
            tl.from(reward_txt.scale, 1,{ x:0,y:0, ease: Elastic.easeOut.config(0.6, 0.3)});
            tl.fromTo([vic_slider,...vic_monsterFrame], 2,{ rotation: -1 },{ rotation: 0.012, ease: Elastic.easeOut.config(0.8, 0.4) },0);
            tl.to([vic_slider,...vic_monsterFrame], 2, { rotation: -0.012, ease: Power1.easeInOut, yoyo:true, repeat:-1 } );
            tl.from([vic_confirm,vic_reset], 0.6,{ x:'+=360', ease: Elastic.easeOut.config(0.6, 0.3)},1);
            tl.from([vic_filterBG,vic_filterLframe], 0.6,{ x:"+=400", ease: Power4.easeOut },0.5);
            tl.from(vic_filtersTaker_buttons, 0.2,{ x:200, ease: Expo.easeOut},1);
            tl.from(vic_filtersTaker_buttons, 0.6,{ y:300, ease: Expo.easeOut},1);
            return tl;
        };
        const master = new TimelineMax();//.repeat(-1).repeatDelay(1);
        master.call(() => {  TweenLite.to($camera.pivot, 2, { x:"+=120",y:"-=125", ease: Power4.easeOut }); },null,null,1 );//TODO: inclur dans camera  $camera.moveToTarget($player,10,1)
        master.add( staggerMonstersLogs(),2);
        master.add( showRewardBox() );
        master.call(() => { this.interactiveChildren = true },null,this,5 );
    };

    /**Hide and close the victory huds */
    hide(){
        TweenLite.to(this, 0.4,{ x:'+=910', ease: Back.easeIn.config(1.4), onComplete:()=>{
            this.renderable = false;
            this.interactiveChildren = false;
        },
        onCompleteScope: this });
    };

    /** initialise le setup des interactive pour victory huds */
    initialize_interactive(){
        this.interactiveChildren = false;
        const confirmButton = this.childs.rewardBox.childs.vic_confirm;
        confirmButton.interactive = true;
        confirmButton.on("mouseover", this.mouseover_confirmButton,this);
        confirmButton.on("mouseout" , this.mouseout_confirmButton ,this);
        confirmButton.on("mouseup"  , this.mouseup_confirmButton  ,this);
    };
    
    mouseover_confirmButton(e){
        const ee = e.currentTarget;
        TweenLite.to(ee.scale, 0.4,{ x:1.15,y:1.15, ease: Back.easeOut.config(2)});
        TweenMax.fromTo(ee, 1,{ rotation:-0.1},{ rotation:0.1,y:'+=0.1', ease: Power1.easeInOut, yoyo:true, repeat: -1});
    };

    mouseout_confirmButton(e){
        const ee = e.currentTarget;
        TweenMax.killTweensOf(ee);
        TweenLite.to(ee.scale, 0.3,{ x:1,y:1, ease: Expo.easeOut});
        TweenLite.to(ee, 0.3,{ rotation:0, ease: Expo.easeOut});
    };

    mouseup_confirmButton(e){
        const ee = e.currentTarget;
        const tl = new TimelineMax();
        tl.fromTo(ee.scale, 0.4, {x:'+=0.2',y:'+=0.2'},{x:1,y:1, ease: Expo.easeOut},0);
        tl.to(ee, 0.4, {rotation:0, ease: Expo.easeOut},0);
        tl.call(() => { this.hide(); },null,this,0.1)
        tl.call(() => { $combats.exitCombat(); },null,null,0.4)
        tl.call(() => { this.renderable },null,this,0.4)
        
    };
}