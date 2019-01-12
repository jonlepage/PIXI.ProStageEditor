/*:
// PLUGIN □────────────────────────────────□PIXI MAP EDITOR□─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc EDITOR GUI for create map with object sprine JSON (texture packer, spine)
* V.2.0
* License:© M.I.T
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
*/


document.addEventListener('keydown', (e)=>{
    !window.$PME&&e.key === "F1"? $PME = new _PME() : console.error('error Editor alrealy start'); // global ↑↑↑
    console.log2('$PME.', $PME);
});
// ┌-----------------------------------------------------------------------------┐
// GLOBAL $PME CLASS: _PME for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
class _PME{
    constructor() {
        console.log1('__________________initializeEditor:__________________ ');
        this._version = 'v2.0';
        this.editor = {spine:null,buttons:[]};

        this.initialize(event); // loader
    };

    initialize(e){
        this.prepareScene()
        this.load_Js();
    };

    prepareScene(){
        $huds.displacement.hide();
        $huds.pinBar.hide();
        $huds.pinBar.hide();
    }

    load_Js(){
        const javascript = [
            "js/iziToast/iziToast.js",
            "js/iziToast/pixiMapEditor_HTML.js",
            "js/iziToast/pixiMapEditor_TOAST.js",
            "js/jscolor/bootstrap-slider.js",
            "js/jscolor/jscolor.js",
            "js/acordeon/mn-accordion.js", // acordeon collapser
        ];
        const css = [
            'js/iziToast/iziToast.css',
            "js/iziToast/bootstrap.min.css",
            "js/jscolor/bootstrap-slider.css",
            "editor/customEditorCSS.css",
            "js/acordeon/mn-accordion.css",
        ];
        const onComplette = () => this.loadEditor();
        const head = document.getElementsByTagName('head')[0];
        let total = javascript.length + css.length;
        for (let i = 0, l = css.length; i < l; i++) {
            let link = document.createElement('link');
            link.onload = function() {
                total--;
                !total && onComplette();
              };
           // link.async = false;
            //tmp = link.cloneNode(true);
            link.href = css[i];
            link.rel = 'stylesheet';
            head.appendChild(link);
        }
        for (let i = 0, l = javascript.length; i < l; i++) {
            let script = document.createElement('script');
            script.onload = function() {
                total--;
                !total && onComplette();
              };
            script.async = false;
            script._url = javascript[i];
            script.src = javascript[i];
            script.href = javascript[i];
            document.body.appendChild(script);
        }
    }

    load_Editor(){
        iziToast.warning( this.izit_loading1($stage) );
        const loader = new PIXI.loaders.Loader();
        loader.add('editorGui', `editor/pixiMapEditor1.json`).load();
        loader.onProgress.add((loader, res) => {
            if (res.extension === "png") { this.editor[res.name] = res.texture};
            if (res.spineData) { this.editor[res.name] = res.spineData};
        });
        loader.onComplete.add(() => {  });
    }
};