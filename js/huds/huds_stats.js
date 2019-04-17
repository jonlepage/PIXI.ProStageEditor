/*:
// PLUGIN □──────────────────────────────□HUBS CORE ENGINE□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/
/*#region [rgba(255, 255, 255, 0.1)]
┌------------------------------------------------------------------------------┐
  GLOBAL $huds.stats CLASS: _huds_stats
  huds qui affiche les states general sur player1 et 2
└------------------------------------------------------------------------------┘
*/
class _huds_stats extends PIXI.Container {
  constructor() {
      super();
      this._timerOut = null;
      this.bars = null;
      //[hp:heath point], [mp:magic point], [hg:hunger], [hy:hydratation], [miw:max items weight], [mic:max item capacity]
      this._statsLarge = ['hp','mp','hg','hy','miw','mic'];
      //[atk:attack], [def:defense], [sta:stamina], [lck:luck], [exp:exploration], [int:intelligence]
      this._statsSmall = ['atk','def','sta','lck','exp','int'];
      this._states = ['hp','mp','hg','hy','miw','mic','atk','def','sta','lck','expl','int']
  };
  // getters,setters
  get d() { return this.Sprites.d };
  get n() { return this.Sprites.n };

  initialize() {
    this.position.set($camera._screenH/2.5, 55);
    this.position.zeroSet();
    this.setupSprites();
    this.addInteractive();
  };
  
  setupSprites() {
    const dataBase = $Loader.Data2.hudStats;
    const dataBaseIcons = $Loader.Data2.states;
    const bars = {};
    const colors = [0xff0000,0x3f89ff,0x55ff3f,0x3ff5ff]
    // creer les bars pour chaque stats
    for (let i=0, l=this._states.length,y=200, x=0; i<l; i++) {
        const isLarge = i<4;
        const stateName = this._states[i];
        const barC = new PIXI.Container();
        const tbar_d = isLarge? dataBase.textures  .hud_stat_bar_large   : dataBase.textures  .hud_stat_bar_small   ;
        const tbar_n = isLarge? dataBase.textures_n.hud_stat_bar_large_n : dataBase.textures_n.hud_stat_bar_small_n ;
        const barS_d = new PIXI.Sprite(tbar_d);
        const barS_n = new PIXI.Sprite(tbar_n);
        barS_d.anchor.x = 0.1;
        barS_n.anchor.x = 0.1;
        barS_d.parentGroup = PIXI.lights.diffuseGroup;
        barS_n.parentGroup = PIXI.lights.normalGroup ;
        barC.pivot.y = barS_d.height/2;
        barS_d.pivot.y = barS_d.height/2;
        barS_n.pivot.y = barS_d.height/2;
        barC.addChild(barS_d,barS_n);
        // creer la bar couleur
        if(isLarge){ 
          const colorBar = new PIXI.Sprite(dataBase.textures.hud_stat_ColorBarValue); // la bar de couleur indicatrice
          colorBar.pivot.y = colorBar.height/2;
          colorBar.x = 47;
          colorBar.parentGroup = PIXI.lights.diffuseGroup;
          colorBar.tint = colors[i];
          barC.colorBar = colorBar;
          barC.addChild(colorBar);
        };
        // creer icons
        const iconC = new PIXI.Container();
        const icon_d = new PIXI.Sprite( dataBaseIcons.textures   [`sIcon_${stateName}`  ] );
        const icon_n = new PIXI.Sprite( dataBaseIcons.textures_n [`sIcon_${stateName}_n`] );
        icon_d.anchor.set(0.5);
        icon_n.anchor.set(0.5);
        iconC.parentGroup = $displayGroup.group[5];
        icon_d.parentGroup = PIXI.lights.diffuseGroup;
        icon_n.parentGroup = PIXI.lights.normalGroup ;
        icon_d.zIndex = 9999999;
        iconC.zIndex = 9999999;
        iconC.scale.set(0.7);
        iconC.scale.zeroSet();
        iconC.addChild(icon_d,icon_n);
        barC.addChild(iconC);
        // text stats
        const style = new PIXI.TextStyle({ fontSize: 22, fill: "white",strokeThickness: 8,fontFamily: "ArchitectsDaughter" });
        const stext = new PIXI.Text(isLarge&&`${$player[stateName]}/${$player['m'+stateName]}`||$player[stateName], style);
        stext.anchor.set(0.5);
        stext.x = isLarge?125 : 85;
        barC.addChild(stext);
        // math next bar
        bars[stateName] = barC;
        barC.icon = iconC;
        barC.x = isLarge?x:x+20;
        barC.y = 50*(i%2);
        x+=barC.width*(i%2);
      
    };
    this.addChild(...Object.values(bars));
    this.bars = bars;
  };

  renderabled(a,b,c) {
    console.log('a,b,c: ', a,b,c);
    this.renderabled = false;
  };

  show(duration) {
    clearTimeout(this._timerOut);
    TweenLite.to(this.position, 0.4, { x:this.position.zero.x,y:this.position.zero.y ,ease: Power4.easeOut, });
    !this._showed && Object.values(this.bars).forEach(bar => {
      TweenMax.to(bar, 0.1, { rotation:-0.12 ,ease: Power4.easeOut });
      TweenMax.to(bar, 0.1+(Math.random()+Math.random()), { rotation:0 ,delay:0.1,ease: Elastic.easeOut.config(1, 0.4) });
    });
    this._showed = true;
  };

  hide(duration) {
    this._timerOut = setTimeout(()=>{
      this._showed = false;
      TweenLite.to(this.position, 0.2, { x:this.position.zero.x,y:-60 ,ease: Back.easeIn.config(1.7), });
     }, 1000);
  };

  move(x,y) { // custome move from 
    TweenLite.to(this.position, 0.4, { x:0,y:0 ,ease: Power4.easeOut, });
  };

  moveIcons(x,y,duration) {
    const t = this.tweens.position_statesIcons;
    // t.vars.x = x;
    t.vars.y = y;
    t._duration = duration*1.2;
    t.invalidate();
    t.play(0);
  };

  addInteractive(value) {
    this.interactive = true;
    Object.values(this.bars).forEach(bar => {
      bar.interactive = true;
      bar.on('pointerover' , this.pIN_bar  ,this);
      bar.on('pointerout'  , this.pOUT_bar ,this);
      bar.on('pointerup'   , this.pUP_bar  ,this);
    });
  };

  pIN_bar(e) {
    const ee = e.currentTarget;
    this.show();
    clearTimeout(this._timerOut);
    TweenLite.to(ee.icon.scale, 1.5, { x:1,y:1 ,ease: Elastic.easeOut.config(1, 0.6), });
    Object.values(this.bars).forEach(bar => {
      if(bar!==ee){
        TweenLite.to(bar.scale, 0.4, { x:0.8,y:0.8 ,ease: Power4.easeOut, });
        TweenLite.to(bar, 0.4, { alpha:0.5 ,ease: Power4.easeOut, });
      };
    });
    // previen hide hud et affiche info sur la bar stat

  };

  pOUT_bar(e) {
    const ee = e.currentTarget;
    TweenLite.to(ee.icon.scale, 0.4, { x:ee.icon.scale.zero.x,y:ee.icon.scale.zero.y ,ease: Elastic.easeOut.config(1, 0.3), });
    Object.values(this.bars).forEach(bar => {
      TweenLite.to(bar.scale, 0.6, { x:1,y:1 ,ease: Power4.easeOut, });
      TweenLite.to(bar, 0.4, { alpha:1 ,ease: Power4.easeOut, });
    });
    this.hide();
  };

  pUP_bar(e) {
  
  };
};
