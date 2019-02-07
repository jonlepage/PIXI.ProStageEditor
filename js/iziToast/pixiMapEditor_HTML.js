
// create new content for tbody tr
// example:  p.position, d.position n.position
function new_HTML_content_options(target,description,opt,opt2){
    const id = description.hashCode();
    return /*html*/ `
        <tr>
            <td ${opt2.colspan? 'colspan='+opt2.colspan : ''}>
                <div class="input-group input-group-xs}">
                    <div class="input-group-prepend">
                        <div class="input-group-text" >
                            <p>${description}:&nbsp</p>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="form-check-inline funkyradio">
                    <div class="funkyradio funkyradio-warning">
                        <input type="checkbox" name="checkbox" id=o${id}>
                        <label for=o${id}>&nbsp;</label>
                    </div>
                </div>
            </td>
        </tr>
    `
};
function newInputType_text(value,description,opt,opt2){
    value = Array.isArray(value)? value.length : value;
    let isSmall   = opt2.small  ? "smallz" : ""     ;
    let isLargeX  = opt2.largeX ? "largeX" : ""     ;
    let isLargeY  = opt2.largeY ? "largeY" : ""     ;
    let isDisable = opt2.disable && `disabled` || ``;
    let jscolor = opt.contains('jscolor') && "jscolor" || "";
    return /*html*/ `
        <input 
        value = ${value} 
        class=" ${jscolor} form-control ${isSmall} ${isLargeX} ${isLargeY}"
        type="text" 
        id=${description}
        autocomplete="on"
        ${opt.contains('lock') && 'disabled = true'}
        >
    `
};
function newInputType_textarea(target,description,opt,opt2){
    let isSmall = opt.small? "smallz" : "" ;
    let isLargeX = opt.largeX? "largeX" : "" ;
    let isLargeY = opt.largeY? "largeY" : "" ;
    return /*html*/ `
        <textarea 
        rows="5" 
        class="form-control ${isSmall} ${isLargeX} ${isLargeY}"
        type="textarea"
        id=${description}
        ${opt.contains('lock') && 'disabled = true'}
        > </textarea>
        `
};
function newInputType_number(target,description,opt,opt2){
    let min  = opt2.hasOwnProperty("min" ) && `min=${ opt2.min }` || ``;
    let max  = opt2.hasOwnProperty("max" ) && `max=${ opt2.max }` || ``;
    let step = opt2.hasOwnProperty("step") && `step=${opt2.step}` || ``;
    let contents = '';
    if(target.length>1){ // si attributs x,y
        ['x','y'].forEach(tag => {
            contents = contents + createInput(tag);
        });
        contents = contents+`<input class="lockXY" type="checkbox" id=${description+'.'+".lockXY"} checked>🔒`
    }else{
        contents = createInput();
    };
    function createInput(tag=''){
        const tagId = tag && '.'+tag || '';
        const label = tagId && `<label for=${description+tagId} class="labelXY">${tagId}:</label>` || '';
        
        return/*html*/`
            ${label}
            <input 
                class="form-control"
                type="number" 
                id=${description+tagId}
                ${opt.contains('lock') && 'disabled = true'}
                ${min} ${max} ${step}
            >`
        };
    return contents;
};
function newInputType_slider(target,description,opt,opt2){
    let isSmall = opt.small? "smallz" : "" ;
    let isLargeX = opt.largeX? "largeX" : "" ;
    let isLargeY = opt.largeY? "largeY" : "" ;
    let isDisable = opt.disable && `disabled` || ``;
    let heaven = opt.contains('heaven');
    if(heaven){ // return heaven slider
        return /*html*/`
        <div class="form-control ${description.contains('setDark')&&'dark'||''}"> <!--diffuse rvb setDark -->
            <b>dr:</b> <input id=${description}.0 value=0 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=0 data-slider-id="RC" data-slider-handle="triangle" type="text" class="sliders span2"/><br>
            <b>dg:</b> <input id=${description}.1 value=0 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=0 data-slider-id="GC" data-slider-handle="triangle" type="text" class="sliders span2"/><br>
            <b>db:</b> <input id=${description}.2 value=0 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=0 data-slider-id="BC" data-slider-handle="triangle" type="text" class="sliders span2"/>
        </div>`
    }else{ // return classic slider
        return /*html*/ `
        <div class="form-control"> <!--falloff -->
            <p class="specialMessage">GL_CONSTANT_ATTENUATION </p>
            <div><b >kc :</b> <input id=${description}.0 type="text" class="sliders span2"></div>
            <p class="specialMessage">GL_LINEAR_ATTENUATION </p>
            <div><b >kl :</b> <input id=${description}.1 type="text" class="sliders span2"></div>
            <p class="specialMessage">GL_QUADRATIC_ATTENUATION </p>
            <div><b >kq :</b> <input id=${description}.2 type="text" class="sliders span2"></div>
        </div>
        `;
    }
};
function newInputType_select(target,description,opt,opt2){
    let isSmall = opt.small? "smallz" : "" ;
    let isLargeX = opt.largeX? "largeX" : "" ;
    let isLargeY = opt.largeY? "largeY" : "" ;
    let isDisable = opt.disable && `disabled` || ``;
    const options = opt.map((o)=>{ return /*html*/`<option class=${o} value=${o}>${o}</option>` });
    return /*html*/ `
        <select class="selectRadius" id=${description} >
            ${options.join().replace(',','')}
        </select>
    `;
};
function newInputType_select_BG(target,description,opt,opt2){
    const options = opt.map((o)=>{ return /*html*/`<option value=${o.name}>${o.name}</option>` });
    return /*html*/ `
        <select class="selectRadius" id=${description} >
            ${options.join().replace(',','')}
        </select>
    `;
};

function newInputType_checkbox(target,description,opt,opt2){
    let isSmall   = opt.small  ? "smallz" : ""     ;
    let isLargeX  = opt.largeX ? "largeX" : ""     ;
    let isLargeY  = opt.largeY ? "largeY" : ""     ;
    let isDisable = opt.disable && `disabled` || ``;
    const options = opt.map((o)=>{ return /*html*/`<option class=${o} value=${o}>${o}</option>` });
    return /*html*/ `
        <div class="form-check-inline funkyradio">
            <div class="funkyradio funkyradio-warning">
                <input type="checkbox" name="checkbox" id=${description}>
                <label for=${description}>&nbsp;</label>
            </div>
        </div>
    `;
};

function newInputTypeSelect(target,id,type,opt,index){
    // TODO: rendre dinamycs
    if(!Array.isArray(opt.option[0])){
        // if not array, no value passed, so map value with default
        opt.option = opt.option.map(value => [value,value]);
    }
    let options=``;
    opt.option.forEach(o => { options+=`<option value=${o[1]}>${o[0]}</option>` });
    return /*html*/ `
        <select class="selectRadius" id=${target+'_'+id} target=${target} >
            ${options}
        </select>
    `;
};
function newInputTypeTextareat(target,id,type,opt,index){
    let isSmall = opt.small? "smallz" : "" ;
    let isLargeX = opt.largeX? "largeX" : "" ;
    let isLargeY = opt.largeY? "largeY" : "" ;
    return /*html*/ `
        <textarea 
        rows="5" 
        class="form-control ${isSmall} ${isLargeX} ${isLargeY}"
        type=${type} 
        step=${opt.step} 
        id=${target+'_'+id}  
        index=${index} 
        target=${target} 
        > </textarea>
        `
};

function newInputTypeColor(target,id,type,opt){
    let isSmall = opt.small? "smallz" : "" ;
    let isLargeX = opt.largeX? "largeX" : "" ;
    let isLargeY = opt.largeY? "largeY" : "" ;
    return /*html*/ `
        <input 
        class="jscolor form-control ${isSmall} ${isLargeX} ${isLargeY}"  
        step=${opt.step} 
        id=${target+'_'+id} 
        target=${target} 
        style="z-index:9999999;"
        >
    `
};
function new_HTML_content(dataObj,id,type,opts,opt2){
    let contents = "";
    ['b','p','d','n','a','s','l'].forEach(target => {
        if(dataObj[target] && dataObj[target].hasOwnProperty(id)){
            const description = `${target}.${id}`;
            let contentValues;
            switch (type) {
                case 'text'     : contentValues = newInputType_text     (dataObj[target][id],description,opts,opt2); break;
                case 'textarea' : contentValues = newInputType_textarea (dataObj[target][id],description,opts,opt2); break;
                case 'number'   : contentValues = newInputType_number   (dataObj[target][id],description,opts,opt2); break;
                case 'slider'   : contentValues = newInputType_slider   (dataObj[target][id],description,opts,opt2); break;
                case 'select'   : contentValues = newInputType_select   (dataObj[target][id],description,opts,opt2); break;
                case 'checkbox' : contentValues = newInputType_checkbox (dataObj[target][id],description,opts,opt2); break;
                default:throw console.error(type+'not Existe'); break;
            };
            contents = contents+ /*html*/ `
            <tr>
                <td ${opt2.color&&('class='+opt2.color)}>
                    <div class="input-group-text"> <p>${description}:</p> </div>
                </td>
                <td ${opt2.color&&('class='+opt2.color)} >
                    ${contentValues}
                </td>
                <td ${opt2.color&&('class='+opt2.color)}>
                    <input class="saveCheck" type="checkbox" id="checkCopyValues">
                </td>
            </tr>
            `;
        }
    });
    return contents;
};
function new_HTML_Empty_content(id,type,opts,opt2){
    let contentValues;
    switch (type) {
        case 'select'   : contentValues = newInputType_select_BG   (id,id,opts,opt2); break;
        default:throw console.error(type+'not Existe'); break;
    };
    return  /*html*/ `
    <tr>
        <td ${opt2.color&&('class='+opt2.color)}>
            <div class="input-group-text"> <p>${id}:</p> </div>
        </td>
        <td ${opt2.color&&('class='+opt2.color)} >
            ${contentValues}
        </td>
    </tr>
    `;
};

// for savesetup memory list
function new_HTML_content_Table(id, dataValues ,dataValues_old ){
    const target = dataValues[id];
    let contents = ``;
   Object.keys(target).forEach(subID => {
        const value = +target[subID];
        const oldValue = +target[subID];
        const description = `${id}.${subID}`;
        const diff = ~~((+oldValue)-(+value));
        const indice = diff>0 && `<font color=#587a3d>+${diff}</font>`||diff<0 && `<font color=#bc2020>-${diff}</font>` || '';
        contents = contents+ /*html*/ `
        <tr>
            <td>
                <div class="input-group-text"> <p>${subID}:</p> </div>
            </td>
            <td>
                ${ newInputType_text(value,description,['lock'],{small:true}) } ${id==='memoryUsage'?'MB':'' } ${indice}
            </td>
            <td>
                ${ newInputType_text(oldValue,description,['lock'],{small:true}) } ${id==='memoryUsage'?'MB':'' } ${indice}
            </td>
        </tr>
        `;
    });
return contents;
   
};


//#region [rgba(50,250, 0,0.3)]
//#endregion
function HTML_DATA_UI(cage){
    const dataObj = cage.dataObj;
    const bcolor = { // background color
        list:["green","blue","red","pink"],
        _id:4,
        get next(){
            this._id = this._id+1>this.list.length-1? 0 : this._id+1;
            return this.current;
        },
        get current(){
            return this.list[this._id];
        }
    }

    // if is a sprite obj
    const defaultCaseEventType = [[false,false],...Object.keys($Loader.Data2.caseEvents.textures).map(n=>{return [n,n]})]
    const message1 = /*html*/ `
    <div class="container" id="dataIntepretor">
        <h6>
            <font color="#d2bc97">CUSTOM INSPECTOR DATA</font>
            <small class="text-muted"><kbd>Json</kbd></small>
        </h6>
        <div class="mn-accordion scrollable" id="accordion"><!--__NEW Accordions__-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Inspecor Options</h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">Descriptions</th>
                                <th scope="col">Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            <td><p class="specialMessage">Select Global inspector options</p></td>
                            ${ new_HTML_content_options(dataObj,"<font color=#d2bc97>Lock:</font> Diffuse and Normals Values"      ,[],{}) }
                            ${ new_HTML_content_options(dataObj,"<font color=#d2bc97>Lock:</font> Scale,Skew from Y to X value"    ,[],{}) }
                            ${ new_HTML_content_options(dataObj,"<font color=#ce2121>Disable:</font> Camera Controler"             ,[],{}) }
                            ${ new_HTML_content_options(dataObj,"<font color=#397c33>Enable:</font> Enable Hight precision factor" ,[],{}) }
                            ${ new_HTML_content_options(dataObj,"<font color=#397c33>Enable:</font> Grafics Debugger"              ,[],{}) }
                            ${ new_HTML_content_options(dataObj,"<font color=#397c33>Enable:</font> jsColors HSV / HVS"            ,[],{}) }
                            ${ new_HTML_content_options(dataObj,"<font color=#397c33>Enable:</font> Large x2 Inspector"            ,[],{}) }
                        </tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Base Data Attributs</h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ new_HTML_content(dataObj,"classType"  ,"text",['lock'],{}) }
                            ${ new_HTML_content(dataObj,"type"       ,"text",['lock'],{}) }
                            ${ new_HTML_content(dataObj,"textureName","text",['lock'],{}) }
                            ${ new_HTML_content(dataObj,"dataName"   ,"text",['lock'],{}) }
                            ${ new_HTML_content(dataObj,"groupID"    ,"text",['lock'],{}) }
                            ${ new_HTML_content(dataObj,"normals"    ,"text",['lock'],{}) }
                            ${ new_HTML_content(dataObj,"name"       ,"text",['lock'],{}) }
                            ${ new_HTML_content(dataObj,"description","textarea",[],{}) }
                        </tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>ObservablePoint Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        <tbody>${ new_HTML_content(dataObj,"position" ,"number",[],{step:1   , color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"pivot"    ,"number",[],{step:1   , color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"scale"    ,"number",[],{step:0.01, color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"skew"     ,"number",[],{step:0.01, color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"anchor"   ,"number",[],{step:0.01, color:bcolor.next }) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Transforms Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        <tbody>${ new_HTML_content(dataObj,"rotation"  ,"number",[],{step:0.1 ,             color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"alpha"     ,"number",[],{step:0.1 ,min:0,max:1, color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"blendMode" ,"number",[],{step:1   ,min:0,max:3, color:bcolor.next }) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Projections Layers 3D</h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        <tbody>${ new_HTML_content(dataObj,"parentGroup" ,"number",[],{step:1 , min:0, max:6,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"zIndex"      ,"number",[],{step:1 ,              color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"zHeight"      ,"number",[],{step:1 ,              color:bcolor.next }) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Colors Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        <tbody>${ new_HTML_content(dataObj,"tint"  ,"text",['jscolor'],{step:0.1 , color:bcolor.next }) }</tbody>
                        <td colspan="3"><p class="specialMessage">"<font color=#d2bc97>Enable:</font> PIXI-HEAVEN for diffuses and normals"</p></td>
                        <tbody>${ new_HTML_content(dataObj,"color"    ,"checkbox" ,[        ],{}) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"setDark"  ,"slider"   ,['heaven'],{}) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"setLight" ,"slider"   ,['heaven'],{}) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3 ${!(dataObj.l)&&'class=disabled'||'class=specialType'}>Light Shadder Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        <tbody>${ new_HTML_content(dataObj,"displayOrder"  ,"number",[],{step:1 , min:0,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"drawMode"  ,"number",[],{step:1 , min:0,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"radius"  ,"number",[],{step:0.002 , min:0,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"blendMode"  ,"number",[],{step:1 , min:0,max:3,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"lightHeight"  ,"number",[],{step:0.001 , min:0,max:3,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"brightness"  ,"number",[],{step:0.01 , min:0,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"color"  ,"text",['jscolor'],{ color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"useViewportQuad"  ,"select",[true,false],{ color:bcolor.next }) }</tbody>
                        ${ new_HTML_content(dataObj,"indices"  ,"text",['lock'],{}) } 
                        <tbody>${ new_HTML_content(dataObj,"falloff"  ,"slider"   ,[],{}) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3 ${!(dataObj instanceof dataObj_case)&&'class=disabled'||'class=specialType'}>Cases Inspector</h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        ${ new_HTML_content(dataObj,"pathConnexion"  ,"text",['lock'],{}) }
                        <tbody>${ new_HTML_content(dataObj,"caseColor" ,"select",$objs.colorsSystem           , { color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"caseType"  ,"select",$objs.actionsCasesSystem.list, { color:bcolor.current }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"randomStartColor" ,"select",[false,true],{ color:bcolor.next    }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"randomTurnColors" ,"select",[false,true],{ color:bcolor.current }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"randomStartType"  ,"select",[false,true],{ color:bcolor.next    }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"randomTurnType"   ,"select",[false,true],{ color:bcolor.current }) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3 ${!(dataObj.a)&&'class=disabled'||'class=specialType'}>SpriteSheets Animations </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        <tbody>${ new_HTML_content(dataObj,"animationSpeed" ,"number",[],{step:0.05,min:0.01,max:30, color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"loop" ,"select",[false,true],{ color:bcolor.next    }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"autoPlay" ,"select",[false,true],{ color:bcolor.next    }) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3 ${!(dataObj.s)&&'class=disabled'||'class=specialType'}>Spine Skeletons Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                                <th scope="col">select</th>
                            </tr>
                        </thead>
                        <tbody>${ new_HTML_content(dataObj,"defaultAnimation" ,"select",dataObj.s&&cage.s.spineData.animations.map((a)=>a.name),{ color:bcolor.next}) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"timeScale"  ,"number",[],{step:0.05 , min:0.05,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"startTime"  ,"number",[],{step:1    , min:0   ,color:bcolor.next }) }</tbody>
                        <tbody>${ new_HTML_content(dataObj,"defaultMix" ,"number",[],{step:0.1  , min:0   ,color:bcolor.next }) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Events Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">

                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Audio API Manager </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">

                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Display Groups </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">

                </div>
            </div><!--accordion item END-->
        </div><!--__Accordions END__-->
        <div class="container buttons"> 
            <button id="reset" type="button" class="btn btn-outline-warning btn-sm">Reset</button>
            <button id="copy" type="button" class="btn btn-outline-light btn-sm">Copy Properties</button>
            <br><br>
            <button id="apply" type="button" class="btn btn-outline-success btn-sm col-md-6">Apply</button>
            <button id="cancel" type="button" class="btn btn-outline-danger btn-sm col-md-4">Cancel</button>
            <br><td colspan="3"><font color="#c17d2e">**use the mouse on obj for fast setup!"</font></td>
        </div>

    </div> `;//END message1
    return message1;
};

//#region [rgba(70,70, 70,0.6)]
//#endregion
function HTML_BG_SCENE_UI(dataValues,bgList){
    const bcolor = { // background color
        list:["green","blue","red","pink"], _id:4,
        get next(){ this._id = this._id+1>this.list.length-1? 0 : this._id+1; return this.current },
        get current(){ return this.list[this._id];}
    };

    const message1 = /*html*/ `
    <div class="container" id="dataIntepretor">
        <h6>
            <font color="#d2bc97">CUSTOM INSPECTOR DATA</font>
            <small class="text-muted"><kbd>Json</kbd></small>
        </h6>
        <div class="mn-accordion scrollable" id="accordion"><!--__NEW Accordions__-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Scene Background</h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">propreties</th>
                                <th scope="col">value</th>
                            </tr>
                        </thead>
                        <tbody>${ new_HTML_Empty_content("background"  ,"select",bgList,{ color:bcolor.next }) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
            </div>
        <div class="container buttons"> 
            <button id="apply" type="button" class="btn btn-outline-success btn-sm col-md-6">Apply</button>
            <button id="cancel" type="button" class="btn btn-outline-danger btn-sm col-md-4">Cancel</button>
        </div>

    </div> `;//END message1
    return message1;
};


//#region [rgba(255,1, 0,0.3)]
//#endregion
function html_izit_saveSetup(dataValues){
    const fs = require('fs');
    const path = `data/${$stage.scene.name}_data.json`;
    const dataValues_old = fs.existsSync(path)? JSON.parse(fs.readFileSync(path, 'utf8')) : false;
    const message1 = /*html*/ `
    <div class="container" id="dataIntepretor">
        <h6>
            <font color="#d2bc97">SAVE STAGE DATAS/font>
            <small class="text-muted"><kbd>Json</kbd></small>
        </h6>
        <div class="mn-accordion scrollable" id="accordion"><!--__NEW Accordions__-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Inspecor Options</h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">Descriptions</th>
                                <th scope="col">Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            <td><p class="specialMessage">Save configuration</p></td>
                            ${ new_HTML_content_options(null,"<font color=#397c33>Enable:</font> Check hash32 Integrity versionning"            ,[],{}) }
                            ${ new_HTML_content_options(null,"<font color=#397c33>Enable:</font> Easy JSON readable"            ,[],{}) }
                            ${ new_HTML_content_options(null,"<font color=#397c33>Enable:</font> Reboot after save"            ,[],{}) }
                        </tbody>
                    </table>
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">Descriptions</th>
                                <th scope="col">current</th>
                                <th scope="col">oldValue</th>
                            </tr>
                        </thead>
                        <td><p class="specialMessage">Average memoryUsage</p></td>
                        <tbody>${ new_HTML_content_Table('memoryUsage', dataValues ,dataValues_old ) }</tbody>
                    </table>
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">Descriptions</th>
                                <th scope="col">current</th>
                                <th scope="col">oldValue</th>
                            </tr>
                        </thead>
                        <td><p class="specialMessage">Total By ObjData_ClassType</p></td>
                        <tbody>${ new_HTML_content_Table('totalByClass', dataValues ,dataValues_old ) }</tbody>
                    </table>
                    <table class="table table-hover table-dark table-sm">
                        <thead style="background-color: #393939" >
                            <tr>
                                <th scope="col">Descriptions</th>
                                <th scope="col">current</th>
                                <th scope="col">oldValue</th>
                            </tr>
                        </thead>
                        <td><p class="specialMessage">Total General</p></td>
                        <tbody>${ new_HTML_content_Table('totalBySheetsType', dataValues ,dataValues_old ) }</tbody>
                    </table>
                </div>
            </div><!--accordion item END-->
        </div><!--END-->
        <div class="container buttons">
            <button id="clearScene" type="button" class="btn btn-outline-light btn-sm">Clear Scene</button>
            <button id="copy" type="button" class="btn btn-outline-light btn-sm">Refresh Memory</button>
            <br><br>
            <button id="save" type="button" class="btn btn-outline-success btn-sm col-md-6">Save</button>
            <button id="close" type="button" class="btn btn-outline-danger btn-sm col-md-4">close</button>
            <br><td colspan="3"><font color="#c17d2e">**use [ctrl+S] for fast save without options"</font></td>
        </div>
    </div> `;//END message1
    return message1;
};