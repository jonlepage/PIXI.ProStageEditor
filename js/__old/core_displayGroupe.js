
// OldFilmFilter
//TODO: MAKE A FILTERS MANAGERS FOR THE GAME 
$Filters = {
    noiseGame: new PIXI.filters.NoiseFilter (0.02, 1),
    OutlineFilterx8Green: new PIXI.filters.OutlineFilter (20, 0x16b50e, 1),
    OutlineFilterx8Red: new PIXI.filters.OutlineFilter (20, 0xdb3d2b, 1),
    OutlineFilterx8Yellow: new PIXI.filters.OutlineFilter (20, 0xd6d022, 1),
    OutlineFilterx8Pink: new PIXI.filters.OutlineFilter (20, 0xc722d6, 1),
}

_DisplayGoup = function(){
    this._layer_diffuseGroup = new PIXI.display.Layer(PIXI.lights.diffuseGroup);
    this._layer_diffuseGroup.clearColor = [0,0,0,0];
    this._layer_normalGroup = new PIXI.display.Layer(PIXI.lights.normalGroup);
    this._layer_lightGroup = new PIXI.display.Layer(PIXI.lights.lightGroup);
    this._spriteBlack_d = new PIXI.Sprite(this._layer_diffuseGroup.getRenderTexture());
    this._spriteBlack_d.tint = 0;
    this._spriteBlack_d.name = "_spriteBlack_d";
    this.group = [ // le groupe dasignement pour les parentGroupe = 
        new PIXI.display.Group(0, false), // backgroud Map. BG tile elements will no update and no interaction
        //TODO: check with ivan for a solution optimised update only when need
        //https://github.com/pixijs/pixi-display/wiki#fast-container-sort
        new PIXI.display.Group(1, true), // map elements default player, chara and all basic sprite update z and interaction
        new PIXI.display.Group(2, true), // map elements 2er
        new PIXI.display.Group(3, false), // map elements 3er
        new PIXI.display.Group(4, false), //levelGui: GUI Elements over maps
        new PIXI.display.Group(5, false), //levelMenu: MENU Elements over maps
        new PIXI.display.Group(6, false), //levelTxt: txt bubble, or SFX over all
    ];
    this.layersGroup = []; // a ajouter a chaque stage map
    for (let i = 0, l = this.group.length; i < l; i++) {
        this.group[i].sortPriority = 1;
        const g = new PIXI.display.Layer(this.group[i]);
        this.layersGroup.push( g );
        g.name = 'group'+i;
    };

        // add filter map 
        this._layer_diffuseGroup._filters = [$Filters.noiseGame];

        this._layer_diffuseGroup.updateTransform = function updateTransform() {
            // update filters noise
            this._filters[0].seed = Math.random();
 
           

            this._boundsID++;
            this.transform.updateTransform(this.parent.transform);
            // TODO: check render flags, how to process stuff here
            this.worldAlpha = this.alpha * this.parent.worldAlpha;
            for (var i = 0, j = this.children.length; i < j; ++i) {
                var child = this.children[i];
                if (child.visible) {
                    child.updateTransform();
                }
            }
        };


};
$displayGroup = new _DisplayGoup(); // initialise basic for display groupe
console.log1('$displayGroup.', $displayGroup);