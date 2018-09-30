


  //#region [rgba(220,20, 210,0.2)]
//#endregion
function html_izit_sceneSetup(bgList, stage) {
    console.log('stage: ', stage);
    console.log('bgList: ', bgList);

    let _bgList = `<option value=false selected>false</option>`; // 
    for (let i=0, l=bgList.length; i<l; i++) {
        if(stage.Background && stage.Background.name === bgList[i]){
            _bgList+=`<option value=${bgList[i]} selected>${bgList[i]}</option>`;
        }else{
            _bgList+=`<option value=${bgList[i]}>${bgList[i]}</option>`;
        }
        
    };


    const message = /*html*/ `
        <div class="container" id="dataIntepretor">
        <h6>
            <font color="#d2bc97">SETUP SCENE OPTIONS</font>
            <small class="text-muted"><kbd>[json]</kbd></small>
        </h6>


        <table class="table table-hover table-dark table-sm">
        <thead style="background-color: #393939" >
            <tr>
                <th scope="col">#</th>
                <th scope="col">def</th>
                <th scope="col"><font color="#c17d2e">Add more backgrounds: </font>&nbsp;&nbsp;  ../data2/BG/ </th>
            </tr>
        </thead>
            <tbody>
                <tr><!--BG LIST AVAIBLE-->
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input id="_Background" type="checkbox" name="checkbox"/>
                            <label for="_Background" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td id="Background_def">"false"</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Background:</small>
                                </div>
                            </div>
                            <select class="selectRadius" id="Background">${_bgList}</select>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table> 
        <button id="apply" type="button" class="btn btn-outline-success btn-sm col-md-6">Apply</button>
        <button id="cancel" type="button" class="btn btn-outline-danger btn-sm col-md-4">Cancel</button>
        <br><td colspan="3"><font color="#c17d2e">**Warning: Background for sceneMap are define in RMMV!"</font></td>
        </div>
    `;
////////////////////////////////////////END
    return message;
};

// create a new Tabs, Options
function new_HTML_table_options(contents){
    let c = ``;
    contents.forEach(e => { c = c+e });

    return /*html*/ `
    <table class="table table-hover table-dark table-sm">
        <thead style="background-color: #393939" >
            <tr>
                <th scope="col">Options</th>
                <th scope="col">value</th>
            </tr>
        </thead>
            <tbody>${c}</tbody>
        </table>
    `
};

// create new content for tbody tr
// example:  p.position, d.position n.position
function new_HTML_content_options(description,options){
    return /*html*/ `
        <tr>
            <td>
                <div class="input-group input-group-xs ${options.break? "parentBreak":''} ${options.smallz? "smallz":''}">
                    <div class="input-group-prepend">
                        <div class="input-group-text ${options.trClass && options.trClass}" >
                            <p>${description}:&nbsp</p>
                        </div>
                    </div>
                </div>
            </td>
            <td ${options.trClass && 'class='+options.trClass}>
                <div class="form-check-inline funkyradio">
                    <div class="funkyradio funkyradio-warning">
                        <input type="checkbox" name="checkbox" id="check_haven"/>
                        <label for="check_haven">&nbsp;</label>
                    </div>
                </div>
            </td>
        </tr>
    `
};

// create a new Tabs, type propreties [parent,diffuse,normal]
function new_HTML_table(contents,id){
    id? id = `id=${id}` : ``;
    let bodys = [];
    let i = 0;
    let colorClass = ["green","blue","red","pink","green"];
    contents.forEach(c => {
        let color = colorClass[i]? colorClass[i++] : colorClass[i=0];
        bodys.push(`<tbody ${id} class="${color}">${c.join("")}</tbody>`); // TODO: ADD BODY CLASS color
    });
    bodys = bodys.join("");
    return /*html*/ `
    <table class="table table-hover table-dark table-sm">
        <thead style="background-color: #393939" >
            <tr>
                <th scope="col">propreties</th>
                <th scope="col">value</th>
                <th scope="col">select</th>
            </tr>
        </thead>${bodys}</table>
    `
};

function createOptsCalss(opts){
    opts.break? opts.break = "parentBreak" : void 0;
    opts.sm ? opts.sm = "smallz" : void 0;
};

function newInputType(target,id,type,opt,index){
    let isSmall = opt.small? "smallz" : "" ;
    let isLargeX = opt.largeX? "largeX" : "" ;
    let isLargeY = opt.largeY? "largeY" : "" ;
    let isDisable = opt.disable && `disabled` || ``;
    let min = opt.hasOwnProperty("min") && `min=${opt.min}` || ``;
    let max = opt.hasOwnProperty("max") && `max=${opt.max}` || ``;
    let step = opt.hasOwnProperty("step") && `step=${opt.step}` || ``;
    return /*html*/ `
        <input 
        class="form-control ${isSmall} ${isLargeX} ${isLargeY}"
        type=${type} 
        id=${target+'_'+id}  
        index=${index} 
        target=${target} 
        ${step} 
        ${min} 
        ${max} 
        ${isDisable}
        >
    `
};

function newInputTypeSelect(target,id,type,opt,index){
    // TODO: rendre dinamycs
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

// create new content for tbody tr 2D Alway number type
// example:  p.position, d.position n.position
function new_HTML_content2D(targets,id,type,opts,end){
    let result = [];
    targets.forEach(target => {
        let description = `${target}.${id}`;
        let x = newInputType(target,id,type,opts,0);
        let y = newInputType(target,id,type,opts,1);
        let padLeft = targets.contains("p")&&["d","n"].contains(target)? `style="padding-left: 14px;"` : void 0;
        let lockDN = target === "n"? `<input class="lockDN" type="checkbox" id=${id+"_lockDN"} checked>` : ``;
        result.push(
            /*html*/ `
            <tr>
            <td ${padLeft}>
                <div class="input-group-text"> <p>${description}:</p> </div>
            </td>
            <td>
                <label for=${target+'_'+id} class="labelXY">x:</label>${x}
                <label for=${target+'_'+id} class="labelXY">y:</label>${y}
                ${lockDN}
            </td>
            <td ${opts.color?('class='+opts.color):void 0}>
                <input class="saveCheck" type="checkbox" id=${target+'_'+id+"_select"}>
            </td>
            </tr>
            `
        );
    });
    return result;
};

// create new content for tbody tr 2D Alway number type
// example:  p.position, d.position n.position
function new_HTML_content1D(targets,id,type,opts,end){
    let result = [];
    targets.forEach(target => {
        let description = `${target}.${id}`;
        let i;
        let lockDN = (target === "n")? `<input class="lockDN" type="checkbox" id=${id+"_lockDN"} checked>` : ``;
        if(opts.jscolor){i = newInputTypeColor(target,id,type,opts);}
        else if(type === "select"){i = newInputTypeSelect(target,id,type,opts);}
        else if(type === "textArea"){i = newInputTypeTextareat(target,id,type,opts);}
        else{ i = newInputType(target,id,type,opts,0) };
        result.push(
            /*html*/ `
            <tr>
            <td>
                <div class="input-group-text"> <p>${description}:</p> </div>
            </td>
            <td>
                ${i}
                ${lockDN}
            </td>
            <td ${opts.color?('class='+opts.color):void 0}>
                <input class="saveCheck" type="checkbox" id=${target+'_'+id+"_select"}>
            </td>
            </tr>
            `
        );
    });
    return result;
};

// create new content for tbody tr 2D Alway number type
// example:  p.position, d.position n.position
function new_HTML_contentMessage(description,caseID){
    let checkBox = caseID? `<td>Enable: <input class="saveCheck" type="checkbox" id=${caseID}></td>` : void 0;
    return [/*html*/ `
        <tr>
            ${checkBox}
            <th colspan="3" style="max-width: 360px;">
                <div > <p class="specialMessage">${description}:</p> </div>
            </th>
        </tr>
    `];
};

// create new content for tbody tr colors pickers
function new_HTML_contentColorHeaven(targets){
    let result = [];
    targets.forEach(target => {
        let description = `${target}:chanel`;
        let darkID = [`${target}dr`,`${target}dg`,`${target}db`];
        let lightID = [`${target}lr`,`${target}lg`,`${target}lb`];
        result.push(
            /*html*/ `
            <tr>
            <td>
                <div class="input-group-text"> <p>${description}:</p> </div>
            </td>
            <td>
                <div class="form-control dark"> <!--diffuse rvb setDark -->
                    <b>dr:</b> <input id=${darkID[0]} value=0 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=0 data-slider-id="RC" data-slider-handle="triangle" type="text" class="span2"/><br>
                    <b>dg:</b> <input id=${darkID[1]} value=0 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=0 data-slider-id="GC" data-slider-handle="triangle" type="text" class="span2"/><br>
                    <b>db:</b> <input id=${darkID[2]} value=0 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=0 data-slider-id="BC" data-slider-handle="triangle" type="text" class="span2"/>
                </div>
                <div class="form-control"> <!--diffuse rvb setLight -->
                    <b>lr:</b> <input id=${lightID[0]} value=1 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=1 data-slider-id="RC" data-slider-handle="triangle" type="text" class="span2"/><br>
                    <b>lg:</b> <input id=${lightID[1]} value=1 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=1 data-slider-id="GC" data-slider-handle="triangle" type="text" class="span2"/><br>
                    <b>lb:</b> <input id=${lightID[2]} value=1 data-slider-min=0 data-slider-max=1 data-slider-step=0.01 data-slider-value=1 data-slider-id="BC" data-slider-handle="triangle" type="text" class="span2"/>
                </div>
            </td>
            <td>
                <input class="saveCheck" type="checkbox" id=${target+"heaven_select"}>
            </td>
            </tr>
            `
        );
    });
    return result;
};

// create new content for tbody tr colors pickers
function new_HTML_contentSlidersFalloff(targets){
    return [/*html*/ `
        <tr>
            <td>
                <div class="input-group-text"> <p>fallOff:</p> </div>
            </td>
            <td>
                <div class="form-control dark"> <!--light fallOff Slider -->
                <p>[Kc: Constante, Kl: Linéaire Kq: Quadratique]</p>
                    <b>Kc:</b> <input id="Kc" type="text" data-slider-handle="square" class="span2"/><br>
                    <b>Kl:</b> <input id="Kl" type="text" data-slider-handle="square" class="span2"/><br>
                    <b>Kq:</b> <input id="Kq" type="text" data-slider-handle="square" class="span2"/><br>
                </div>
            </td>
            <td>
                <input class="saveCheck" type="checkbox" id=fallOff_select>
            </td>
        </tr>
    `];
};


function HTML_DATA_UI(){
    // if is a sprite obj
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
                    ${ new_HTML_table_options([
                        // rotation
                        new_HTML_content_options("Lock: normal value to Diffuse",{}),
                        new_HTML_content_options("Lock: Y to X value",{}),
                        new_HTML_content_options("Disable not avaible data",{}),
                        new_HTML_content_options("Allow Camera mouse in inspecor",{}),
                        new_HTML_content_options("Allow mouse sprite interaction in inspector",{}),
                        new_HTML_content_options("Colors mode for jsColors HSV / HVS",{}),
                    ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Attributs Asigments </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["p"],"type","text",{largeX:true,disable:true}), // locked
                        new_HTML_content1D(["p"],"textureName","text",{largeX:true,disable:true}), // locked
                        new_HTML_content1D(["p"],"dataName","text",{largeX:true,disable:true}),// locked
                        new_HTML_content1D(["p"],"groupID","text",{largeX:true}),
                        new_HTML_content1D(["p"],"name","text",{largeX:true}),
                        new_HTML_content1D(["p"],"description","textArea",{largeX:true,largeY:true}),// description
                    ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>ObservablePoint Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content2D(["p","d","n"],"position","number",{step:1}),// position
                        new_HTML_content2D(["p","d","n"],"pivot","number",{step:1}),// pivot
                        new_HTML_content2D(["p","d","n"],"scale","number",{step:0.05,small:true}),// scale
                        new_HTML_content2D(["p","d","n"],"skew","number",{step:0.05,small:true}),// skew
                        new_HTML_content2D(["d","n"],"anchor","number",{step:0.01,min:0,max:1,small:true}),// anchor
                    ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Transforms Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["p","d","n"],"rotation","number",{step:0.01,small:true}),// rotation
                        new_HTML_content1D(["p","d","n"],"alpha","number",{step:0.01,min:0,max:1,small:true}),// alpha
                        new_HTML_content1D(["d","n"],"blendMode","number",{step:1,min:0,max:3,small:true}),// blendMode
                    ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Colors Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["d","n"],"tint","text",{jscolor:"jscolor"}),// tint
                    ])}
                    ${ new_HTML_table([
                        new_HTML_contentMessage("PIXI.HEAVEN chanel coloration.","enableHeaven"),
                        new_HTML_contentColorHeaven(["d","n"]),// heaven color
                    ],"HeavenSliders")}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>SpriteSheets Animations </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["p"],"totalFrames","text",{step:0.1,small:true,disable:true}),// animations
                        new_HTML_content1D(["p"],"animationSpeed","number",{step:0.1,small:true}),// animations
                        new_HTML_content1D(["p"],"loop","select",{option:["true","false"]}),//loop
                    ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Spine Skeletons Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">

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

function HTML_LIGHT_UI(scene){ // html_izit_sceneGlobalLight
    // if is a sprite obj
    const message1 = /*html*/ `
    <div class="container" id="dataIntepretor">
        <h6>
            <font color="#d2bc97">CUSTOM INSPECTOR DATA</font>
            <small class="text-muted"><kbd>Json</kbd></small>
        </h6>
        <div class="mn-accordion scrollable" id="accordion"><!--__NEW Accordions__-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Transforms Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["p"],"shaderName","text",{largeX:true,disable:true}), // locked
                        new_HTML_content1D(["p"],"blendMode","number",{step:1,min:0,max:3,small:true}),
                        new_HTML_content1D(["p"],"alpha","number",{step:0.05,min:0,max:1,small:true}),
                        new_HTML_content1D(["p"],"drawMode","select",{option:[["LINES",1],["LINE_LOOP",2],["LINE_STRIP",3],["POINTS",4],["TRIANGLES",5],["TRIANGLE_FAN",6],["TRIANGLE_STRIP",7]]}),//loop
                        new_HTML_content1D(["p"],"lightHeight","number",{step:0.001,small:true}),
                        new_HTML_content1D(["p"],"brightness","number",{step:0.02,min:0,small:true}),
                    ])}
                    ${ new_HTML_table([
                        new_HTML_contentMessage("Control the rate at which light is gradually reduced as a function of the distance between a point in 3D space and the light source."),
                        new_HTML_contentSlidersFalloff(),// heaven color
                    ])}
                    ${ new_HTML_table([
                        new_HTML_content1D(["p"],"tint","text",{jscolor:"jscolor"}),// tint
                    ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Light Animations </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">

                </div>
            </div><!--accordion item END-->
        </div><!--END-->
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


function HTML_BG_UI(resultBG){ // html_izit_sceneGlobalLight
    // if is a sprite obj
    const message1 = /*html*/ `
    <div class="container" id="dataIntepretor">
        <h6>
            <font color="#d2bc97">CUSTOM INSPECTOR DATA</font>
            <small class="text-muted"><kbd>Json</kbd></small>
        </h6>
        <div class="mn-accordion scrollable" id="accordion"><!--__NEW Accordions__-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Attributs Asigments </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["p"],"type","text",{largeX:true,disable:true}), // locked
                        new_HTML_content1D(["p"],"dataName","select",{largeX:true,option:[[void 0]]}), // locked
                        new_HTML_content1D(["p"],"name","text",{largeX:true}), // locked
                        new_HTML_content1D(["p"],"description","textArea",{largeX:true,largeY:true}),// description
                   ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>ObservablePoint Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content2D(["d","n"],"position","number",{step:1}),// position
                        new_HTML_content2D(["d","n"],"pivot","number",{step:1}),// pivot
                        new_HTML_content2D(["d","n"],"scale","number",{step:0.05,small:true}),// scale
                        new_HTML_content2D(["d","n"],"skew","number",{step:0.05,small:true}),// skew
                    ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>Transforms Inspector </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["d","n"],"alpha","number",{step:0.01,min:0,max:1,small:true}),// alpha
                        new_HTML_content1D(["d","n"],"blendMode","number",{step:1,min:0,max:3,small:true}),// blendMode
                    ])}
                    ${ new_HTML_table([
                        new_HTML_content1D(["d","n"],"tint","text",{jscolor:"jscolor"}),// tint
                    ])}
                    ${ new_HTML_table([
                        new_HTML_contentMessage("PIXI.HEAVEN chanel coloration.","enableHeaven"),
                        new_HTML_contentColorHeaven(["d","n"]),// heaven color
                    ],"HeavenSliders")}
                </div>
            </div><!--accordion item END-->
        </div><!--END-->
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


  //#region [rgba(255,100, 0,0.8)]
//#endregion
function html_izit_saveSetup() {
    // get a copy of old file? if exist
    console.log0('this: ', this);
    const fs = require('fs');
    const path = `data/${this.stage.constructor.name}_data.json`;
    const buffer = fs.existsSync(path)? JSON.parse(fs.readFileSync(path, 'utf8')) : false;
    const oldSystem = buffer.system || false;
    // help converting byte memory to readable size
    function bytesToSize(bytes) {
        if (bytes == 0) return 'n/a';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };
    function getMemorySize(reel){
        const memory = process.memoryUsage();
        for (const entry in memory) {
            const r = memory[entry];
            memory[entry] = bytesToSize( memory[entry] );
        }
        const heapUsed_old = oldSystem? oldSystem.heaps : "...notAvaible!";
        const heapTotal_old = oldSystem? oldSystem.heapTotal : "...notAvaible!";
        const external_old = oldSystem? oldSystem.external : "...notAvaible!";
        const rss_old = oldSystem? oldSystem.rss : "...notAvaible!";

        return `
        <font color="#bb5179">heaps: </font> <font color="#fff"> Used:</font> (<span id="heaps">${reel?memory.heapUsed:heapUsed_old}</span>) / <font color="#fff">Total:</font> <span id="heapTotal">${reel?memory.heapTotal:heapTotal_old}</span><br>
        <font color="#bb5179">external:</font> <span id="external">${reel?memory.external:external_old}</span><br>
        <font color="#bb5179">rss:</font>  <span id="rss">${reel?memory.rss:rss_old}</span>
        `;
    };
    return message = /*html*/ `
    <div class="container" id="dataIntepretor">
    <h6>
        <font color="#d2bc97">SAVE PROGRESS TO JSON</font>
        <small class="text-muted"><kbd>Json</kbd></small>
    </h6>
        <table class="table table-hover table-dark table-sm">
            <thead style="background-color: #393939" >
                <tr>
                    <th scope="col">options</th>
                    <th scope="col">#</th>
                </tr>
            </thead>
            <tbody>
                <td colspan="3"><font color="#d2bc97">Rendering options for rmmv editor parralaxe</font></td>
                <tr><!--Rendering parralaxe for RMMV?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">'_renderParaForRMMV': Rendering parralaxe for RMMV?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_renderParaForRMMV" checked>
                            <label for="_renderParaForRMMV" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering Layers For PhotoShops?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">'_renderLayersPSD': Rendering Layers For PhotoShops?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_renderLayersPSD"/>
                            <label for="_renderLayersPSD" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering Events and Players Sprites?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">'_renderEventsPlayers': Rendering Events and Players Sprites?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_renderEventsPlayers"/>
                            <label for="_renderEventsPlayers" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering grafics debugging?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">'_renderDebugsElements': Rendering grafics debugging?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_renderDebugsElements"/>
                            <label for="_renderDebugsElements" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering Light shadders?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">'_renderingLight': Rendering Light shadders?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_renderingLight"/>
                            <label for="_renderingLight" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering layers Normals?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">'_renderLayers_n': Rendering layers Normals?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_renderLayers_n"/>
                            <label for="_renderLayers_n" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering with current Animations times?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">"_renderAnimationsTime0": Reset Animations time to 0 befor render?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_renderAnimationsTime0"/>
                            <label for="_renderAnimationsTime0" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>

            </tbody>
        </table>

        <table class="table table-hover table-dark table-sm">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Information</th>
                    <th scope="col">Value Current</th>
                    <th scope="col">Value Old</th>
                </tr>
            </thead>
            <tbody id="information">
                <tr>
                    <td>MEMORY USAGES:</td>
                    <td class="text-success">${getMemorySize(true)}</td>
                    <td class="text-danger">${getMemorySize()}</td>
                <tr>
                <tr>
                    <td>versionEditor:</td>
                    <td class="text-success" id="versionEditor">${this.version}</td>
                    <td class="text-danger">${oldSystem?oldSystem.versionEditor:">not avaible ..."}</td>
                <tr>
                <tr>
                    <td>SavePath:</td>
                    <td class="text-success" id="SavePath">data/${this.stage.constructor.name}_data.json</td>
                    <td class="text-danger">${oldSystem?oldSystem.SavePath:">not avaible ..."}</td>
                <tr>
                <tr>
                    <td>Total Spines:</td>
                    <td class="text-success" id="totalSpines">${$Objs.getsByType("spineSheet").length}</td>
                    <td class="text-danger">${oldSystem?oldSystem.totalSpines:">not avaible ..."}</td>
                <tr>
                <tr>
                    <td>Total Animations:</td>
                    <td class="text-success" id="totalAnimations">${$Objs.getsByType("animationSheet").length}</td>
                    <td class="text-danger">${oldSystem?oldSystem.totalAnimations:">not avaible ..."}</td>
                <tr>
                <tr>
                    <td>Total TileSprites:</td>
                    <td class="text-success" id="totalTileSprites">${$Objs.getsByType("tileSheet").length}</td>
                    <td class="text-danger">${oldSystem?oldSystem.totalTileSprites:">not avaible ..."}</td>
                <tr>
                <tr>
                    <td>Total Light:</td>
                    <td class="text-success" id="totalLight">${$Objs.getsByType("light").length}</td>
                    <td class="text-danger">${oldSystem?oldSystem.totalLight:">not avaible ..."}</td>
                <tr>
                <tr>
                    <td>Total Events:</td>
                    <td class="text-success" id="totalEvents">${$Objs.getsByType("event").length}</td>
                    <td class="text-danger">${oldSystem?oldSystem.totalEvents:">not avaible ..."}</td>
                <tr>
                <tr>
                    <td>Total Sheets:</td>
                    <td class="text-success" id="totalSheets">${$Objs.getsSheetLists().length}</td>
                    <td class="text-danger">${oldSystem?oldSystem.totalSheets:">not avaible ..."}</td>
                <tr>
            </tbody>
        </table>
        <button id="save" type="button" class="btn btn-outline-success btn-sm col-md-6">Save</button>
        <button id="cancel" type="button" class="btn btn-outline-danger btn-sm col-md-4">Cancel</button>
        <br><td colspan="3"><font color="#c17d2e">**use [ctrl+S] for fast save without options"</font></td>
    </div>`//end
////////////////////////////////////////END
    return message;
};