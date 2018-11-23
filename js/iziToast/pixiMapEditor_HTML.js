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

// create a new Tabs, Options
function new_HTML_table_Info(contents){
    let c = ``;
    contents.forEach(e => { c = c+e });

    return /*html*/ `
    <table class="table table-hover table-dark table-sm">
        <thead style="background-color: #393939" >
            <tr>
                <th scope="col">information</th>
                <th scope="col">currentValue</th>
                <th scope="col">oldValue</th>
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

// simple data information value show
function new_HTML_contentDataInfo(description,oldData,newData){
    return [/*html*/ `
        <tr>
            <td>
                <div class="input-group-text"> <p>${description}:</p> </div>
            </td>
            <td>
                <div class="input-group-text"> <p>${oldData}:</p> </div>
            </td>
            <td>
                <div class="input-group-text" id=${description}>${newData}</div>
            </td>
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
                <div class="accordion-heading"><h3>Cases Inspector</h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["p"],"defaultColor","select",{option:["false","red","green","blue","pink","purple","yellow","black"]}),//loop
                        new_HTML_content1D(["p"],"allowRandomStartColor","select",{option:["false","true"]}), // permet couleur hazard lorsque creer
                        new_HTML_content1D(["p"],"allowRandomTurnColors","select",{option:["false","true"]}), //permet changer couleur lorsque fin de tours
                        new_HTML_content1D(["p"],"defaultCaseEventType","select",{option:defaultCaseEventType}), //permet changer couleur lorsque fin de tours
                       //TODO: new_HTML_content1D(["p"],"conditionInteractive","select",{option:defaultCaseEventType}), //permet changer couleur lorsque fin de tours
                        //Repenjser ce system pourrit de html grrrrrrrrrrrrrrr
                    ])}
                </div>
            </div><!--accordion item END-->
            <div class="accordion-item"> <!--accordion item-->
                <div class="accordion-heading"><h3>SpriteSheets Animations </h3><div class="icon"><i class="arrow right"></i></div></div>
                <div class="accordion-content">
                    ${ new_HTML_table([
                        new_HTML_content1D(["p"],"totalFrames","text",{step:0.1,small:true,disable:true}),// animations
                        new_HTML_content1D(["p"],"animationSpeed","number",{step:0.1,small:true}),// animations
                        new_HTML_content1D(["p"],"loop","select",{option:[$Loader.Data2.cases.textures]}),//loop
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


function HTML_BG_UI(bgList){ // html_izit_sceneGlobalLight
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
                        new_HTML_content1D(["p"],"dataName","select",{largeX:true,option:bgList}), // locked
                        new_HTML_content1D(["p"],"name","text",{largeX:true}), // locked
                        new_HTML_content1D(["p"],"description","textArea",{largeX:true,largeY:true}),// description
                   ])}
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
function html_izit_saveSetup(stage){ // html_izit_sceneGlobalLight
    // get a copy of old file? if exist
    const fs = require('fs');
    const path = `data/${stage.constructor.name}_data.json`;
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
        const heapUsed_old  = oldSystem? oldSystem.heaps     : "...notAvaible!";
        const heapTotal_old = oldSystem? oldSystem.heapTotal : "...notAvaible!";
        const external_old  = oldSystem? oldSystem.external  : "...notAvaible!";
        const rss_old       = oldSystem? oldSystem.rss       : "...notAvaible!";

        return `
        <font color="#bb5179">heaps: </font><font color="#fff"> Used:</font> (<span id="heaps">${reel?memory.heapUsed:heapUsed_old}</span>) / <font color="#fff">Total:</font> <span id="heapTotal">${reel?memory.heapTotal:heapTotal_old}</span><br>
        <font color="#bb5179">external:</font><span id="external">${reel?memory.external:external_old}</span><br>
        <font color="#bb5179">rss:</font>  <span id="rss">${reel?memory.rss:rss_old}</span>
        `;
    };
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
                    ${ new_HTML_table_options([
                        // rotation
                        new_HTML_content_options("_renderParaForRMMV': Rendering parralaxe for RMMV?:"              ,{}),
                        new_HTML_content_options("_renderLayersPSD': Rendering Layers For PhotoShops?"              ,{}),
                        new_HTML_content_options("_renderEventsPlayers': Rendering Events and Players Sprites?"     ,{}),
                        new_HTML_content_options("_renderingLight': Rendering Light shadders?:"                     ,{}),
                        new_HTML_content_options("_renderAnimationsTime0: Reset Animations time to 0 befor render?:",{}),
                        new_HTML_content_options("_renderDebugsElements': Rendering grafics debugging?:"            ,{}),
                    ])}
                    ${ new_HTML_table_Info([
                        `<tr><td>MEMORY USAGES:</td>
                            <td class="text-success">${getMemorySize(true)}</td>
                            <td class="text-danger">${getMemorySize()}</td>
                        <tr>`,
                        new_HTML_contentDataInfo("versionEditor"   ,`${stage.version         }`,`${oldSystem?oldSystem.versionEditor   :">not avaible ..."}`),
                        new_HTML_contentDataInfo("SavePath"        ,`${stage.SavePath        }`,`${oldSystem?oldSystem.SavePath        :">not avaible ..."}`),
                        new_HTML_contentDataInfo("totalSpines"     ,`${stage.totalSpines     }`,`${oldSystem?oldSystem.totalSpines     :">not avaible ..."}`),
                        new_HTML_contentDataInfo("totalAnimations" ,`${stage.totalAnimations }`,`${oldSystem?oldSystem.totalAnimations :">not avaible ..."}`),
                        new_HTML_contentDataInfo("totalTileSprites",`${stage.totalTileSprites}`,`${oldSystem?oldSystem.totalTileSprites:">not avaible ..."}`),
                        new_HTML_contentDataInfo("totalLight"      ,`${stage.totalLight      }`,`${oldSystem?oldSystem.totalLight      :">not avaible ..."}`),
                        new_HTML_contentDataInfo("totalEvents"     ,`${stage.totalEvents     }`,`${oldSystem?oldSystem.totalEvents     :">not avaible ..."}`),
                        new_HTML_contentDataInfo("totalSheets"     ,`${stage.totalSheets     }`,`${oldSystem?oldSystem.totalSheets     :">not avaible ..."}`),
                    ])}
                </div>
            </div><!--accordion item END-->
        </div><!--END-->
        <div class="container buttons">
            <button id="copy" type="button" class="btn btn-outline-light btn-sm">Refresh Memory</button>
            <br><br>
            <button id="save" type="button" class="btn btn-outline-success btn-sm col-md-6">Save</button>
            <button id="close" type="button" class="btn btn-outline-danger btn-sm col-md-4">close</button>
            <br><td colspan="3"><font color="#c17d2e">**use [ctrl+S] for fast save without options"</font></td>
        </div>
    </div> `;//END message1
    return message1;
};