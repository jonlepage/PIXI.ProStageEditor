
/*:
PLUGIN □───────────────────────□-{ ECC: EASY CONSOLE.LOG COLOR LIBS FOR RMMV }-□──────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc Easy Coloration Console.log for easy debug if you brain love color.
* V.2.1
* License:© M.I.T
□──────────────────────────────────────────────────□□────────────────────────────────────────────────────────────□
*/
// USE THE KEY Ctrl+Shift+l with visual studio code, + number
// https://marketplace.visualstudio.com/items?itemName=whtouche.vscode-js-console-utils

//↓↓↓□-▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇-□-Game_CharacterBase_MOVE-□-▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇-□↓↓↓//
(function(){
    function hexColors() { return ('#' + Math.floor(Math.random() * 16777215).toString(16) || '#'+ffffff) }; // for return a random hex color
    var TC = { // TEXT COLOR PREDEFINED
        "red": "font-weight: bold; color: #EC5f67;",
        "orange": "font-weight: bold; color: #F99157;",
        "yellow": "font-weight: bold; color: #FAC863;",
        "green": "font-weight: bold; color: #42843b;",
        "teal": "font-weight: bold; color: #5FB3B3;",
        "blue": "font-weight: bold; color: #8aa9fc;",
        "purple": "font-weight: bold; color: #C594C5;",
        "brown": "font-weight: bold; color: #AB7967;",
        "white": "font-weight: bold; color: #ffffff;"
    }
    var BC = { // BACKGROUND COLOR PREDEFINED
        "green": "background: linear-gradient(#263820, #395128);",
        "black": "background: linear-gradient(#4f4f4f, #3d3d3d);",
        "orange": "background: linear-gradient(#FAC863, #F99157);",
    };
    var bS = [ // BOX STYLE PREDEFINED
        [ // box style 0
            , 'border: 1px solid #4286f4'
            , 'padding: 1px 2px 0px 0px;' //top,right,bottom,left 
            , 'line-height: 20px'
            , 'display: block'
            , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
            , 'box-shadow: 0 2px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
            , 'font-weight: bold'
        ].join(';'),
        [ // box style 1
            , 'border: 1px solid #99C794'
            , 'padding: 1px 2px 0px 1px;' //top,right,bottom,left 
            , 'line-height: 20px'
            , 'display: block'
            , 'text-shadow: 0 2px 0 rgba(50, 100, 50, 0.3)'
            , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
        ].join(';'),
        [ // box style 2
            , 'border: 1px solid #EC5f67'
            , 'padding: 1px 2px 0px 1px;' //top,right,bottom,left 
            , 'line-height: 20px'
            , 'display: block'
            , 'box-shadow: 0 2px 0 rgba(255, 200, 255, 0.8) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
            , 'font-weight: bold'
        ].join(';'),
        [ // box style 3
            , 'border-radius: 4px'
            , 'border: 1px solid #FAC863'
            , 'padding: 2px 3px 3px 3px;' //top,right,bottom,left 
            , 'line-height: 20px'
            , 'display: block'
            , 'box-shadow: 0 2px 0 rgba(0, 0, 0, 0.8) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
            , 'font-weight: bold'
        ].join(';'),
    ];
   
    console.log0 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c0 █►', TC.red+BC.black+bS[0]);
    }();
    console.log1 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c1 █►', TC.purple+BC.black+bS[1]);
    }();
    console.log2 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c2 █►', TC.yellow+BC.black+bS[2]);
    }();
    console.log3 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c3 █►', TC.green+BC.black+bS[3]);
    }();
    console.log4 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c4 █►', bS[0]);
    }();
    console.log5 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c5 █►', bS[1]);
    }();
    console.log6 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c6 █►', bS[2]);
    }();
    console.log7 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c7 █►', bS[3]);
    }();
    console.log8 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c8 █►', TC.red);
    }();
    console.log9 = function() {
        return Function.prototype.bind.call(console.log, console,  '%c9 █►', TC.green);
    }();
    
    console.groupCollapsed('%cCONSOLE COLORATRIX LIST',TC.orange+bS[2]);
    console.log0('console.log0', window);
    console.log1('console.log1', window);
    console.log2('console.log2', window);
    console.log3('console.log3', window);
    console.log4('console.log4', window);
    console.log5('console.log5', window);
    console.log6('console.log6', window);
    console.log7('console.log7', window);
    console.log8('console.log8', window);
    console.log9('console.log9', window);
    console.groupEnd();
   
})();
