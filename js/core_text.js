
/*:
// PLUGIN □────────────────────────────────□ TEXTS DATABASE LOCALISATION □───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc text from localisations in game
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $text CLASS: _texts
//└------------------------------------------------------------------------------┘
class _texts{
    constructor(localisation='frCA') {
        this.zoomFactor = ~~1/2.5; // 2.5 is max zoom, 1 is default , factor:0.4
        this._maxW = 1650;
        this._maxL = 1; // custom game setup for readability
        this._localisations = localisation;
        switch (localisation) {
            case 'frCA': this._localID = 2; break;
            case 'enUS': this._localID = 3; break;
            case 'ar'  : this._localID = 4; break;
            case 'jp'  : this._localID = 5; break;
            case 'ru'  : this._localID = 6; break;
            case 'sp'  : this._localID = 7; break;
            default:this._localID = 2;
        };
        // all style for games
        this.styles = [ // styles by id, (0: default)
            new PIXI.TextStyle({//id:0
                fontFamily: "ArchitectsDaughter", 
                fontSize: 48, lineJoin: "bevel", miterLimit: 0, padding: 4, stroke: "white", strokeThickness: 10 
            }),
            new PIXI.TextStyle({//id:1
                fill: "#de8447", fontFamily: "ArchitectsDaughter", 
                fontSize: 70, lineJoin: "bevel", miterLimit: 0, padding: 4, stroke: "white", strokeThickness: 10 
            }),
        ];
    };

    /** inject data parse from loader */
    initializeFromData(scv){
        //TODO: TROUVER POURQUOI LES FONTS NE CHARGE PAS AU DEBUT, DONC SIZE MAUVAIS JUSQAU TIKERS ?
        let id = null;
        for (let i=1, l=scv.data.length; i<l; i++) {
            const d = scv.data[i];
            id = d[0] || id;
            !this[id] ? this[id] = [] : void 0;
            const txt = d[this._localID];
            if(txt){
                const data = this.computeText(txt); // preCompute page and line data for text
                this[id].push({_targetEvent:d[1], _originalTxt:txt, pagesData:data.pagesData, pagesSize:{w:data._currentPageWidth,h:data._currentPageHeight} });
            };
        };
    };


    computeText(txt){
        const newData = (_txt,_styleID) => {return {_txt,_styleID}};
        const re = /(`(s)(\d+)`)(.*?)`s`/;
        //STEP:1 INITIALISE MATCHING STYLES && ICONS TAG ↓↓↓ ////
        const matchData = [];
        let match;
        while ((match = re.exec(txt)) !== null) {
            (match.index) && matchData.push( newData(txt.slice(0, +match.index), 0) ); // add nul data befor the match
            switch (match[2]) { //TODO: here all future tags, icons, custom break line ... 
                case 's': matchData.push( newData(match[4],+match[3]) ); break;
            }
            txt = txt.slice(match.index + match[0].length); // slice current icons txt
        };
        txt.length && matchData.push( newData(txt,0) );
        return this.computeBounds(matchData,newData);
    };

    computeBounds(matchData,newData){
        // compute metric maxW,maxH and compute for lines splits
        const pagesData = [[]]; // page:data
        const linesMaxHeight = [[]]; // compute max height for each lines
        let tX = 0; // tracking X
        let tY = 0; // tracking Y
        let lh = 10; // lineHeight for each line
        let _currentPageWidth = []; // store width for each page
        let _currentPageHeight = []; // store width for each page
        for (let i=0, l=0, p=0; i<matchData.length; i++) {
            let dt = matchData[i];
            let mt = PIXI.TextMetrics.measureText(dt._txt, this.styles[dt._styleID]);
            let needSplit = false;
            if(tX+mt.width > this._maxW){
                let _tX = 0; // track child X
                const _re = /\S+.|\./g;
                let match;
                while (!needSplit && (match = _re.exec(dt._txt)) !== null) { // coninuer jusqua tomber sur le match qui ne fit plus 
                    mt = PIXI.TextMetrics.measureText(match[0], this.styles[dt._styleID]);
                    if(tX+_tX+mt.width<this._maxW){
                        _tX+=mt.width;
                     }else{
                        needSplit = true;
                     };
                };
                matchData.splice(i+1, 0,  newData( dt._txt.slice(match.index), dt._styleID) );
                dt._txt = dt._txt.slice(0,match.index); // reformat current text data
                mt = PIXI.TextMetrics.measureText(dt._txt, this.styles[dt._styleID]);
            };
            // reference data text
            dt.metric = mt;
            dt._x = tX;
            dt._y = tY;
            dt._lineIndex = l;
            pagesData[p].push(dt);
            _currentPageWidth [p] = Math.max(_currentPageWidth [p]||0, tX+mt.width  );
            _currentPageHeight[p] = Math.max(_currentPageHeight[p]||0, tY+mt.height );
            linesMaxHeight[p][l] = _currentPageHeight[p];
            if(needSplit){ // need new line
                tX = 0;
                if(++l>=this._maxL){// new page
                    l = 0, tY = 0;
                    pagesData[++p] = [];
                    linesMaxHeight[p] = [];
                }else{ tY+=(+mt.height+lh); }; // new line
            }else{
                tX += mt.width;
            }
        };
        for (let p=0, l=linesMaxHeight.length; p<l; p++) {
            linesMaxHeight[p] = Math.max(...linesMaxHeight[p]);
        };
            
        return {pagesData,_currentPageWidth,_currentPageHeight,linesMaxHeight};
    };



};
$texts = new _texts();
console.log1('$texts', $texts);