
// TOAST METHOD FOR EDITOR
// ┌------------------------------------------------------------------------------------------------┐
// iziToast Builder See=>pixiMapEditor_HTML.js   http://izitoast.marcelodolce.com/
//└------------------------------------------------------------------------------------------------┘

// open the tileEditor
_PME.prototype.tileSetupEditor = function(InMapObj){
    let message = HTML_DATA_UI(InMapObj);
    return{
        title: 'ADAD',
        message: message,
        id:'dataEditor',
        layout: 2,
        transitionIn: 'flipInX', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 10,
        maxWidth: false,
        theme: 'dark',
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(38, 38, 38, 0.99)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};

// open the tileEditor
_PME.prototype.izitGlobalLightEditor = function(scene){
    let message = HTML_LIGHT_UI(scene);
    return{
        title: 'GLOBAL LIGHT',
        message: message,
        id:'dataEditor',
        layout: 2,
        transitionIn: 'flipInX', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 10,
        maxWidth: false,
        theme: 'dark',
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(38, 38, 38, 0.99)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};

_PME.prototype.izit_loading1 = function() { // load all sprites dependency for editor gui only
    return{
        transitionOut: 'fadeOutUp',
        id:'izit_loading1',
        timeout:4600,
        theme: 'dark',
        icon: 'icon-person',
        title: 'PLEASE WAIT:',
        message: `Converting Engine for Editor:`,
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'rgb(0, 255, 184)',
        backgroundColor: '#3f3f3f',
        progressBarColor:'#f44242',
    };
};
    
    // open editor for setup the global scene light :light_Ambient and directionLight
_PME.prototype.izit_sceneGlobalLight = function() {
    let message = html_izit_sceneGlobalLight();
    return{
        title: 'Customize the generale ambiance for the current scene or map id \n',
        message: message,
        id:'dataEditor',
        layout: 2,
        transitionIn: 'flipInX', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 12,
        maxWidth: 500,
        theme: 'dark',
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(38, 38, 38, 0.9)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};

// open editor for setup the global scene light :light_Ambient and directionLight
_PME.prototype.izit_convertHeaven = function() {
    let message = html_izit_convertHeaven();
    return{
        message: message,
        id:'Heaven',
        layout: 1,
        transitionIn: 'bounceInLeft', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOutRight', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 10,
        maxWidth: 400,
        theme: 'dark',
        position: 'bottomRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(38, 38, 38, 0.9)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};

// open editor for setup the global scene , BG, id, filename
_PME.prototype.izit_sceneSetup = function() {
    const list = Object.keys(this.Data2);
    let result = list.filter(s =>  {
        if (this.Data2[s].BG) {return this.Data2[s]};
    });  
    let message = html_izit_sceneSetup(result, this.stage);
    return{
        title: 'Setup basic information for current scene \n',
        message: message,
        id:'dataEditor',
        layout: 2,
        transitionIn: 'flipInX', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 12,
        maxWidth: 500,
        theme: 'dark',
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(38, 38, 38, 0.9)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};

// open save interactions
_PME.prototype.izit_saveSetup = function() {
    let message = html_izit_saveSetup.call(this);
    return{
        title: 'Save and compute progress in json format \n',
        message: message,
        id:'dataEditor',
        layout: 2,
        transitionIn: 'fadeIn', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 12,
        maxWidth: 700,
        theme: 'dark',
        position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(50, 0, 0, 0.95)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};

_PME.prototype.izit_copyData = function(ClipboarData){
    console.log('ClipboarData: ', ClipboarData);
    return{
        transitionOut: 'fadeOutUp',
        id:'copyData',
        timeout:2600,
        layout: 2,
        zindex:999999,
        maxWidth: 250,
        theme: 'dark',
        icon: 'icon-person',
        title: 'COPY::',
        message: `${JSON.stringify(ClipboarData)}`,
        position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'rgb(0, 255, 184)',
        backgroundColor: '#3f3f3f',
        progressBarColor:'#f44242',
    };
};

_PME.prototype.izit_pasteCopyDataIn = function(OBJ,ClipboarData){
    return{
        transitionOut: 'fadeOutUp',
        id:'izit_pasteCopyDataIn',
        timeout:2200,
        layout: 2,
        zindex:999999,
        maxWidth: 250,
        theme: 'dark',
        title: `PASTE DATA TO::${OBJ.name}:`,
        message: `${JSON.stringify(ClipboarData)}`,
        position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBar: false,
        backgroundColor: '#0b5e11',
    };
};




_PME.prototype.savedComplette = function(){
    return{
        transitionOut: 'fadeOutUp',
        id:'izit_loading1',
        timeout:1000,
        theme: 'dark',
        icon: 'icon-person',
        title: 'SAVED JSON:',
        message: `COMPLETTE`,
        position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'rgb(0, 255, 184)',
        backgroundColor: '#3f3f3f',
        progressBarColor:'#f44242',
    };
};

_PME.prototype.removeSprite = function(InMapObj,index){
    return{
        transitionOut: 'fadeOutUp',
        id:'izit_loading1',
        layout: 2,
        timeout:2500,
        theme: 'dark',
        icon: 'icon-person',
        title: `DELETE: ${InMapObj.name}`,
        message: `Aat index: ${index}`,
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBar:false,
        backgroundColor: '#3f3f3f',
        titleSize: '11',
        messageSize: '10',
    };
};








const iziT = iziToast;
iziT.libs_loading = function(arg){
    return{
        transitionOut: 'fadeOutUp',
        id:'libs_loading',
        timeout:4600,
        theme: 'dark',
        icon: 'icon-person',
        title: 'LOADING LIBRARY',
        message: `'Please wait' perform scan in:${$SLL.libraryPath}`,
        position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'rgb(0, 255, 184)',
        backgroundColor: '#3f3f3f',
        progressBarColor:'#f44242',
    };
};
iziT.libs_loaded = function(arg){
    return{
        id:'libs_loaded',
        timeout:2500,
        theme: 'dark',
        title: 'LOADING COMPLETTE',
        message:  `Loaded Complet: with ${Object.keys($SLL.resource).length} elements loaded.`,
        position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'rgb(0, 255, 184)',
        backgroundColor: '#2d7c0d',
        transitionOut:'fadeOutUp',
        progressBar:false,
    };
};
iziT.helpBox = function(inObject,rightMode){
    let [title,message] = html_helpBox_slot(inObject);
    return{
        id:'helpBox',
        layout: 2,
        icon:'ico-info2',
        transitionIn: 'bounceInDown', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        iconColor: '#000',
        maxWidth: '350px',
        timeout:false,
        theme: 'dark',
        titleColor: '#000',
        title: title,
        messageColor: '#2a465b',
        message: message,
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(200, 200, 240, 0.9)',
        balloon: true,
        balloonPos: rightMode && 'right' || 'left',
        close: false,
        progressBar: false,
    };
};
iziT.infoBox = function(inObject){
    let [title,message] = html_infoBox_slot(inObject);
    return{
        id:'infoBox',
        layout: 2,
        transitionIn: 'bounceInDown', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        maxWidth: '500px',
        theme: 'dark',
        title: title,
        message: message,
        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(38, 38, 38, 0.99)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
    };
};
iziT.libs_saveProgress = function(arg){
    return{
        transitionOut: 'fadeOutUp',
        id:'saveProgress',
        timeout:5000,
        theme: 'dark',
        icon: 'icon-person',
        title: 'SAVE PROGRESS',
        message: `'Please wait' computing data`,
        position: 'topCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'rgb(0, 255, 50)',
        backgroundColor: '#f44242',
    };
};

iziT.dataEditor = function(inObject){
    let message = html_DataEditor2(inObject);
    return{
        title: '',
        message: message,
        id:'dataEditor',
        layout: 2,
        transitionIn: 'flipInX', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 14,
        maxWidth: false,
        theme: 'dark',
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(38, 38, 38, 0.99)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};
iziT.dataEditor_light = function(){
    let message = html_lightEditor_p();
    return{
        title: '',
        message: message,
        id:'dataEditor',
        layout: 2,
        transitionIn: 'flipInX', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 14,
        maxWidth: false,
        theme: 'dark',
        position: 'topLeft', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(38, 38, 38, 0.99)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};
iziT.dataEditor_save = function(){
    let message = html_saveEditor();
    return{
        title: '',
        message: message,
        id:'dataEditor',
        layout: 2,
        transitionIn: 'flipInX', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        transitionOut:	'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
        messageSize: 14,
        maxWidth: false,
        theme: 'dark',
        position: 'center', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        backgroundColor: 'rgba(42, 42, 42, 0.99)',
        close: false,
        progressBar: false,
        timeout:false,
        icon:false,
        drag: false,
    };
};
iziT.notifier_ADD = function(objSprite){
    let [title,message] = notifier_ADD(objSprite);
    return{
        theme: 'dark',
        layout: 2,
        id:'notifier_ADD',
        title: title,
        titleColor: '#000',
        message: message,
        backgroundColor: 'rgba(53, 53, 53, 0.95)',
        icon:'ico-add',
        iconColor: '#000000',
        position: 'topLeft',// bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        transitionIn: 'bounceInDown', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight or flipInX.
        maxWidth: '300',
        progressBarColor: '#009b14',
        titleSize: '11',
        messageSize: '10',
        timeout:2500,
    };
};

