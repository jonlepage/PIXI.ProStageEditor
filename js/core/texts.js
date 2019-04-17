
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
/** generer du text mais egalement des icons dinamic */
class _texts{
    constructor(localisation='frCA') {
        this.zoomFactor = ~~1/2.5; // 2.5 is max zoom, 1 is default , factor:0.4
        this._maxW = 1650;
        this._maxL = 3; // custom game setup for readability
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
                fill: "#d8d8d8",fontFamily: "ArchitectsDaughter", 
                fontSize: 16, lineJoin: "bevel", miterLimit: 0, padding: 2, stroke: "white", stroke:"#292929", strokeThickness: 4,
                lineHeight:-6
            }),
            new PIXI.TextStyle({//id:1
                fill: "#de8447", fontFamily: "ArchitectsDaughter", 
                fontSize: 70, lineJoin: "bevel", miterLimit: 0, padding: 4, stroke: "white", strokeThickness: 10 
            }),
            new PIXI.TextStyle({//id:2 [infoMonsterBox dans battle]
                fill: "#d8d8d8", fontFamily: "ArchitectsDaughter", 
                fontSize: 17, lineJoin: "bevel", miterLimit: 0, padding: 4, stroke: "white", strokeThickness: 5 , stroke:"#3c3c3c"
            }),
            new PIXI.TextStyle({ // id:3 Combat dammage HIT
                fill:"white", fontFamily: "ArchitectsDaughter", 
                fontSize:50,fontWeight:"bold",lineJoin:"round",miterLimit:20,strokeThickness:10
            }),
            new PIXI.TextStyle({ // id:4 combat victory log
                fill:"white", fontFamily: "ArchitectsDaughter", 
                fontSize:30,fontWeight:"bold",lineJoin:"round",miterLimit:20,strokeThickness:6
            }),
            new PIXI.TextStyle({ // id:5 combat victory log
                fill:"white", fontFamily: "ArchitectsDaughter", 
                fontSize:22,fontWeight:"bold",lineJoin:"round",miterLimit:20,strokeThickness:2
            }),
        ];
        /** List des String disponible pour le jeux par ID. !Voir EXCEL!*/
        this.strings = {};
    };
    /** List des String disponible pour le jeux par ID. !Voir EXCEL!*/
    get _(){return this.strings };

    /** initialise et compute les text et reference des json et CSV */
    initialize(){
        $Loader.CSV.dataString.forEach(dataName => {
            this.initialize_dataString($Loader.CSV[dataName].data);
        });
    };

    /** initialise les keyWord de reference selon la langue */
    initialize_dataString(CSV){
        const langueID = CSV[0].indexOf(this._localisations);  // array id selon la langue choisis
        for (let i=1, l=CSV.length; i<l; i++) {
            const ref = CSV[i][0];
            const key = CSV[i][langueID];
            if(!ref){ continue };
            if(this.strings[ref]){ throw console.error('COMFLIE DE ID REFERENCE STRING, ALREALY EXISTT',ref)}
            else{this.strings[ref] = key}
        };
    };

    /** initialise monster name and descriptions */
    initialize_dataString_monster(){
        const CSV = $Loader.CSV.dataString_monster.data;
        const ID = CSV[0].indexOf("id"); // trouve index des table ID
        const REF = CSV[0].indexOf("ref"); // trouve index des table REF
        const LINDEX = CSV[0].indexOf(this._localisations);  // array id selon la langue choisis
        for (let i=1, mID=1, l=CSV.length; i<l; i++) {
            const ref = CSV[i][REF];
            const key = CSV[i][LINDEX];
            mID = CSV[i][ID] || mID; // update le monster id : change le monster id lorsque nouvelle, continue si null
            switch (ref) {
                case '_mNames': this.monstersNames[mID] = key; break;
                case '_mDescs': this.monstersDescs[mID] = key; break;
            }
            
        };
    };
    computeText(txt){
        /**        for (let i=1, l=scv.data.length; i<l; i++) {
            const d = scv.data[i];
            id = d[0] || id;
            !this[id] ? this[id] = [] : void 0;
            const txt = d[this._localID];
            if(txt){
                const data = this.computeText(txt); // preCompute page and line data for text
                this[id].push({_targetEvent:d[1], _originalTxt:txt, pagesData:data.pagesData, pagesSize:{w:data._currentPageWidth,h:data._currentPageHeight} });
            };
        }; */
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

    /** creer un container text pret pour generer un text regex
     * @param string string text origin with tags
     * @param defaultStyle number
     * @param option object
     * @returns  _textsContainer*/
    area(string,defaultStyle,option){
        return new _textsContainer(string,defaultStyle,option);
    };

};

const $txt = new _texts();
console.log1('$txt', $txt);

/** container de text dynamic avec regex, icon et splitter et animations*/
class _textsContainer extends PIXI.Container{
    constructor(string,defaultStyle,option) {
        super();
        this._textOrigin = string;
        this._defaultStyle = defaultStyle || $txt.styles[0];
        this.option = option || {};
        /**matrice data des splits, identic au children */
        this._txtMatrix = [];
        /** max width par ligne */
        this.maxXperLine = [];
        /** max height */
        this.maxYperLine = [];
        this.computeTag();
    };

    /**
     * @param string si string, change le string original
     * calcule et genere un text regex from string */
    computeTag(string,defaultStyle){
        if(string||defaultStyle){this.clear(string,defaultStyle)};
        if(!this._textOrigin){return this};
        
        const styles = [this._defaultStyle];
        let _stylesIndex = 0;
        let txt = this._textOrigin;
        let re = /\[(#|S|N|I)(\w+|)\]/, match;
        while ((match = re.exec(txt)) !== null) {
            //!Si match index est >0 il ya du text avant le tag, ajout a la matrice
            (match.index > 0) && this._txtMatrix.push( {txt:txt.slice(0, match.index), style: styles[_stylesIndex]} ); // if text befor match
            switch (match[1]) { // type de tags trouver?
                case 'S': //#STYLE
                    if(match[2]){
                        styles.push($txt.styles[match[2]].clone());
                        _stylesIndex++;
                    }else{styles.pop();_stylesIndex--};
                break;
                case '#': //# HEX COLOR
                    if(match[2]){
                        styles.push(styles[_stylesIndex++].clone());
                        styles[_stylesIndex].fill = '#'+match[2]; //! change la couleur de currentStyle 
                    }else{styles.pop();_stylesIndex--};
                break;
                case 'N': //#NEW LINE
                    this._txtMatrix.push( {txt:null,style:styles[_stylesIndex], N:true, y:+match[2]||0})
                break;
                case 'I': //#ICON ID
                    this._txtMatrix.push( {txt:null,style:styles[_stylesIndex], I:true, id:match[2]})
                break;
                default: console.error('UNKNOW TAG ???',match,txt) ;break;
            }
            txt = txt.slice(match.index + match[0].length); // update text
        };
        this._txtMatrix.push( {txt:txt, style: styles[_stylesIndex] } )
        
        this.computeMetric();
        this.computeSprite();
        this.computePosition();
        return this;
    };

    /** calcul les matrice selon options */
    computeMetric(){
        const wrap = this.option.wordWrapWidth;
        let maxXperLine = [];
        let maxYperLine = [];
        if(!wrap){return this};
        for (let i=0,x=0,line=0, l=this._txtMatrix.length; i<l; i++) {
            const e = this._txtMatrix[i];
            if(e.N){x=0,line++; continue};
            let mt = PIXI.TextMetrics.measureText(e.txt, e.style);
         
            if(x+mt.width-wrap>0){ // depass le wordWrapWidth limit
                const splitedWords = e.txt.match(/\S+./g);
                const letterW = mt.width/e.txt.length;
                for (let _i=0, _w=0, _l=splitedWords.length; _i<_l; _i++) {
                    const word = splitedWords[_i];
                    const wordW = word.length*letterW;
                    if((x+_w+wordW-wrap)>0){ // splitedWords.splice(4)
                        const next = splitedWords.splice(_i);
                        e.txt = splitedWords.join(''); // update current
                        // ajoute a la matrice un saute ligne et l;e nouveau txt
                        this._txtMatrix.splice(i+1,0,
                            {txt:null, style:e.style, N:true, y:0 ,fromWrap:true},
                            {txt:next.join(''), style: e.style }
                        );
                        mt = PIXI.TextMetrics.measureText(e.txt, e.style); // update
                        l=this._txtMatrix.length;
                        break;
                    }else{_w+=wordW;}
                };
            }
            x+=mt.width;
            maxXperLine[line] = x;
            maxYperLine[line] = Math.max(maxYperLine[line]||0,mt.height);
        };
        this.maxXperLine = maxXperLine;
        this.maxYperLine = maxYperLine;
        return this;
    };

    /** lorsque les splits son fait, creation des sprites a partir des contexts */
    computeSprite(){
        this._txtMatrix.forEach(el => {
            if(el.N){
                const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
                sprite.data = el;
                sprite.tint = el.fromWrap && 0x249100 || 0x911500;
                this.addChild(sprite);
            }else
            if(el.I){
                //TODO: VOIR MEILLEUR MOYEN POUR ICON states,items et autres
                const sprite = isFinite(el.id) && new PIXI.Sprite($Loader.Data2.gameItems.textures[el.id]) || new PIXI.Sprite($Loader.Data2.states.textures[el.id]);
                sprite.scale.set(0.5);
                sprite.data = el;
                this.addChild(sprite);
            }
            else{
                const txt = new PIXI.Text(el.txt,el.style);
                txt.data = el;
                this.addChild(txt);
            }
        });
    };

    computePosition(){
        for (let i=0,x=0,y=0,line=0, l=this.children.length; i<l; i++) {
            const e = this.children[i];
            if(e.data.N){
                e.position.set(x,y);
                x=0;
                y+=(this.maxYperLine[line]||0)+e.data.style._lineHeight+e.data.y;
                continue;
            };
            e.position.set(x,y);
            x+=e.width;
        };
    };

    /** clear tous les sprite et text matrix */
    clear(string,defaultStyle){
        this.removeChildren();
        this._textOrigin = string || '';
        this._defaultStyle = defaultStyle || this._defaultStyle;
        this._txtMatrix = [];
    };

    options(option){
        this.option = option || {};
        return this;
    };

    motionFromTop(){
        this.children.forEach(el => {
            TweenLite.from(el.position, Math.randomFrom(0.2,0.6,2), { x:-20, ease:Power3.easeOut });
            TweenLite.from(el.position, Math.randomFrom(0.6,1.2,2), { y:'-=40', ease:Bounce.easeOut });
        });
        return this;
    };
    motionFromAlpha(){
        TweenLite.from(this, 1, { alpha:0, ease:Power3.easeOut });
        return this;
    };
};