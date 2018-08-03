  //#region [rgba(200, 10, 10,0.5)]
//#endregion
function html_DataEditor2(CAGE) {
    console.log7('CAGE: ', CAGE);

return message = /*html*/ `
<div class="container" id="dataIntepretor">
<h6>
    <font color="#d2bc97">CUSTOM OBJ SESSION PROPRETY EDITOR</font>
    <small class="text-muted"><kbd>Json</kbd></small>
</h6>

    <div class="form-check-inline funkyradio">
        <div class="funkyradio-success">
            <input type="checkbox" name="checkbox" id="checkbox3" checked/>
            <label for="checkbox3">mouse mode</label>
        </div>
        <div class="funkyradio-success">
            <input type="checkbox" name="checkbox" id="checkbox33"/>
            <label for="checkbox33">pixi haven</label>
        </div>
        <div class="funkyradio-success">
            <input type="checkbox" name="checkbox" id="reelZoom"/>
            <label for="reelZoom">reelZoom</label>
        </div>
        <div class="funkyradio-success">
            <input type="checkbox" name="checkbox" id="checkbox3333"/>
            <label for="checkbox3333">light</label>
        </div>
    </div>     

    <table class="table table-hover table-dark table-sm">
        <thead style="background-color: #393939" >
            <tr>
                <th scope="col">#</th>
                <th scope="col">def</th>
                <th scope="col">custom</th>
            </tr>
        </thead>
        <tbody>
            <tr><!--eventID-->
                <td>
                    <div class="funkyradio funkyradio-danger">
                        <input type="checkbox" name="checkbox" id="_eventID"/>
                        <label for="_eventID" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>null</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">eventID:</small>
                            </div>
                        </div>
                        <input type="text" autocomplete="on" placeholder="myID1A" class="form-control" id="eventID">
                    </div>
                </td>
            </tr>
            <tr><!--scale-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_scale"/>
                        <label for="_scale" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[1,1]</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">Scale:&nbsp</small><input type="checkbox" id="scale_lock"><small class="text-muted">&#x1f512;</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=50 class="form-control" id="scale" id2=0>
                        <input type="number" step=0.01 value=0 class="form-control" id="scale" id2=1>
                    </div>
                </td>
            </tr>
            <tr><!--skew-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_skew"/>
                        <label for="_skew" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[0,0]</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">skew:&nbsp</small><input type="checkbox" id="skew_lock"><small class="text-muted">&#x1f512;</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 class="form-control" id="skew" id2=0>
                        <input type="number" step=0.01 value=0 class="form-control" id="skew" id2=1>
                    </div>
                </td>
            </tr>
            <tr><!--pivot-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_pivot"/>
                        <label for="_pivot" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[0,0]</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">pivot:&nbsp</small><input type="checkbox" id="pivot_lock"><small class="text-muted">&#x1f512;</small>
                            </div>
                        </div>
                        <input type="number" step=1 value=0 class="form-control" id="pivot" id2=0>
                        <input type="number" step=1 value=0 class="form-control" id="pivot" id2=1>
                    </div>
                </td>
            </tr>
            <tr><!--anchor-->
                <td>
                    <div class="funkyradio funkyradio-danger">
                        <input type="checkbox" name="checkbox" id="_anchor"/>
                        <label for="_anchor" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[0,0]</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">anchor:&nbsp</small><input type="checkbox" id="anchor_lock"><small class="text-muted">&#x1f512;</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 class="form-control" id="anchor" id2=0>
                        <input type="number" step=0.01 value=0 class="form-control" id="anchor" id2=1>
                    </div>
                </td>
            </tr>
            <tr><!--rotation-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_rotation"/>
                        <label for="_rotation" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>0</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">rotation:deg°:</small><input type="checkbox" id="deg_mode"><small class="text-muted"></small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 class="form-control" id="rotation">
                    </div>
                </td>
            </tr>
            <tr><!--alpha-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_alpha"/>
                        <label for="_alpha" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>1</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">alpha:</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 min=0 max=1 class="form-control" id="alpha">
                    </div>
                </td>
            </tr>
            <tr><!--blendMode-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_blendMode"/>
                        <label for="_blendMode" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>0</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">blendMode:</small>
                            </div>
                        </div>
                        <input type="number" step=1 value=0 min=0 max=3 class="form-control" id="blendMode">
                    </div>
                </td>
            </tr>
            <tr><!--tint-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_tint"/>
                        <label for="_tint" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>0xffffff</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">tint:HVS:</small><input type="checkbox" id="tint_mode"><small class="text-muted"></small>
                            </div>
                        </div>
                        <input style="z-index:9999999;" value="ffffff" class="jscolor form-control" id="tint">
                    </div>
                </td>
            </tr>
            <tr><!--Layers Options autoDisplayGroup-->
                <td><div class="custom-control custom-checkbox form-inline">
                    <input type="checkbox" class="custom-control-input input-xs" id="_autoDisplayGroup">
                    <label class="custom-control-label" for="_autoDisplayGroup"></label>
                </div></td>
                <td colspan="2">autoDisplayGroup: <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="AD0">
                    <label class="form-check-label" for="AD0" style="padding-right: 10px;">:0</label>
                    <input class="form-check-input" type="checkbox" id="AD1">
                    <label class="form-check-label" for="AD1" style="padding-right: 10px;">:1</label>
                    <input class="form-check-input" type="checkbox" id="AD2">
                    <label class="form-check-label" for="AD2" style="padding-right: 10px;">:2</label>
                    <input class="form-check-input" type="checkbox" id="AD3">
                    <label class="form-check-label" for="AD3" style="padding-right: 10px;">:3</label>
                    <input class="form-check-input" type="checkbox" id="AD4">
                    <label class="form-check-label" for="AD4" style="padding-right: 10px;">:4</label>
                    <input class="form-check-input" type="checkbox" id="AD5">
                    <label class="form-check-label" for="AD5" style="padding-right: 10px;">:5</label>
                    <input class="form-check-input" type="checkbox" id="AD6">
                    <label class="form-check-label" for="AD6" style="padding-right: 10px;">:6</label>
                </div></td>
            </tr>
            ${CAGE.type==='spineSheets' && appendSpineData(CAGE)||''}
        </tbody>
    </table>
    <button id="applyAll" type="button" class="btn btn-outline-warning btn-sm">ApplyToAll</button>
    <button id="reset" type="button" class="btn btn-outline-light btn-sm">Reset Cache Session</button>
    <button id="randomize" type="button" class="btn btn-outline-secondary btn-sm">Randomize</button>
    <br><br>
    <button id="apply" type="button" class="btn btn-outline-success btn-sm col-md-6">Apply</button>
    <button id="cancel" type="button" class="btn btn-outline-danger btn-sm col-md-4">Cancel</button>
</div>`//end
};

//append html data for spine dataEditor
function appendSpineData(CAGE){
    const objSprite = CAGE.objSprite;
    console.log('objSprite: ', objSprite);
    let animationsList =``;
    objSprite.spineData.animations.forEach(ani => {
       animationsList+=`<option>${ani.name}</option>`;
    });
    let skinList = ``;
    objSprite.spineData.skins.forEach(skin => {
       skinList+=`<option>${skin.name}</option>`;
    });

    return /*html*/`
    <td colspan="3"><font color="#d2bc97">Spines proprety attributs</font></td>
    <tr><!--defaultSkin-->
        <td>
            <div class="funkyradio funkyradio-danger">
                <input type="checkbox" name="checkbox" id="_defaultSkin"/>
                <label for="_defaultSkin" style="text-indent:0px;margin-right:0px;">.</label>
            </div>
        </td>
        <td>"default"</td>
        <td>
            <div class="input-group input-group-xs">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                    <small class="text-muted">defaultSkin:</small>
                    </div>
                </div>
                <select class="selectRadius" id="defaultSkin">${skinList}</select>
            </div>
        </td>
    </tr>
    <tr><!--defaultAni-->
        <td>
            <div class="funkyradio funkyradio-success">
                <input type="checkbox" name="checkbox" id="_defaultAni"/>
                <label for="_defaultAni" style="text-indent:0px;margin-right:0px;">.</label>
            </div>
        </td>
        <td>"idle"</td>
        <td>
            <div class="input-group input-group-xs">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                    <small class="text-muted">defaultAni:</small>
                    </div>
                </div>
                <select class="selectRadius" id="defaultAni">${animationsList}</select>
            </div>
        </td>
    </tr>
    <tr><!--startTime-->
        <td>
            <div class="funkyradio funkyradio-success">
                <input type="checkbox" name="checkbox" id="_startTime"/>
                <label for="_startTime" style="text-indent:0px;margin-right:0px;">.</label>
            </div>
        </td>
        <td>"random"</td>
        <td>
            <div class="input-group input-group-xs">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                    <small class="text-muted">startTime:</small>
                    </div>
                </div>
                <select class="selectRadius" id="startTime">
                    <option value="default">default</option>
                    <option value="random" selected>random</option>
                </select>
            </div>
        </td>
    </tr>
    <tr><!--timeScale-->
        <td>
            <div class="funkyradio funkyradio-success">
                <input type="checkbox" name="checkbox" id="_timeScale"/>
                <label for="_timeScale" style="text-indent:0px;margin-right:0px;">.</label>
            </div>
        </td>
        <td>1</td>
        <td>
            <div class="input-group input-group-xs">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                    <small class="text-muted">timeScale:</small>
                    </div>
                </div>
                <input type="number" step=0.01 value=1 min=0.01 class="form-control" id="timeScale">
            </div>
        </td>
    </tr>
   `
   };
  //#region [rgba(200, 10, 10,0.5)]
//#endregion

   function html_lightEditor_p() {
    return message = /*html*/ `
    <div class="container" id="dataIntepretor">
    <h6>
        <font color="#d2bc97">CUSTOM LIGHT EDITOR POINTER</font>
        <small class="text-muted"><kbd>Json</kbd></small>
    </h6>
    
        <div class="form-check-inline funkyradio">
            <div class="funkyradio-success">
                <input type="checkbox" name="checkbox" id="checkbox3" checked/>
                <label for="checkbox3">mouse mode</label>
            </div>
            <div class="funkyradio-success">
                <input type="checkbox" name="checkbox" id="reelZoom"/>
                <label for="reelZoom">reelZoom</label>
            </div>
        </div>     
    
        <table class="table table-hover table-dark table-sm">
            <thead style="background-color: #393939" >
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">def</th>
                    <th scope="col">custom</th>
                </tr>
            </thead>
            <tbody>
                <tr><!--eventID-->
                    <td>
                        <div class="funkyradio funkyradio-danger">
                            <input type="checkbox" name="checkbox" id="_eventID"/>
                            <label for="_eventID" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>null</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">eventID:</small>
                                </div>
                            </div>
                            <input type="text" autocomplete="on" placeholder="myID1A" class="form-control" id="eventID">
                        </div>
                    </td>
                </tr>
                <tr><!--blendMode-->
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_blendMode"/>
                            <label for="_blendMode" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>1</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">blendMode:</small>
                                </div>
                            </div>
                            <input type="number" step=1 value=1 min=0 max=3 class="form-control" id="blendMode">
                        </div>
                    </td>
                </tr>
                <tr><!--lightHeight-->
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_lightHeight"/>
                            <label for="_lightHeight" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>0.075</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">lightHeight:</small>
                                </div>
                            </div>
                            <input type="number" step=0.001 value=0.075 min=0.001 max=1 class="form-control" id="lightHeight">
                        </div>
                    </td>
                </tr>
                <tr><!--brightness-->
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_brightness"/>
                            <label for="_brightness" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>1</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">brightness:</small>
                                </div>
                            </div>
                            <input type="number" step=0.1 value=1 min=0.1 class="form-control" id="brightness">
                        </div>
                    </td>
                </tr>
                <tr><!--radius-->
                    <td>
                        <div class="funkyradio funkyradio-danger">
                            <input type="checkbox" name="checkbox" id="_radius"/>
                            <label for="_radius" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>Infinity</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">radius:</small>
                                </div>
                            </div>
                            <input type="number" step=0.01 value=0 min=0 class="form-control" id="radius">
                        </div>
                    </td>
                </tr>
                <tr><!--drawMode-->
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_drawMode"/>
                            <label for="_drawMode" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>TRIANGLES</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <small class="text-muted">drawMode:</small>
                                </div>
                            </div>
                            <select class="selectRadius" id="drawMode">
                                <option value=1>LINES</option>
                                <option value=2>LINE_LOOP</option>
                                <option value=3>LINE_STRIP</option>
                                <option value=0>POINTS</option>
                                <option value=4 selected>TRIANGLES</option>
                                <option value=6>TRIANGLE_FAN</option>
                                <option value=5>TRIANGLE_STRIP</option>
                            </select>
                        </div>
                    </td>
                </tr>
                <tr><!--color-->
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_color"/>
                            <label for="_color" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>0xffffff</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">color:HVS:</small><input type="checkbox" id="tint_mode"><small class="text-muted"></small>
                                </div>
                            </div>
                            <input style="z-index:9999999;" value="ffffff" class="jscolor form-control" id="color">
                        </div>
                    </td>
                </tr>
                <tr><!--falloff -->
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="_falloff"/>
                            <label for="_falloff" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>[0.75,3,20]</td>
                    <td id="_setDark-BoxDisplay" style="display: block;">
                        <font color="#d2bc97">falloff attenuation coefficients controler</font><br><br>
                        <div class="form-control">
                            <b>kc</b> <input value=0.75 data-slider-min=0.01 data-slider-max=2 data-slider-step=0.01 data-slider-value=0.75 data-slider-id="RC" id="kc" data-slider-handle="triangle" type="text" class="span2"  /><br>
                            <b>kl</b> <input value=3 data-slider-min=0.01 data-slider-max=20 data-slider-step=0.01 data-slider-value=3 data-slider-id="GC" id="kl" data-slider-handle="triangle" type="text" class="span2"/><br>
                            <b>kq</b> <input value=20 data-slider-min=0.01 data-slider-max=50 data-slider-step=0.01 data-slider-value=20 data-slider-id="BC" id="kq" data-slider-handle="triangle" type="text" class="span2"/>
                        </div> 
                    </td>
                </tr>
            </tbody>
        </table>
        <button id="reset" type="button" class="btn btn-outline-light btn-sm">Reset Cache Session</button>
        <button id="randomize" type="button" class="btn btn-outline-secondary btn-sm">Randomize</button>
        <button id="apply" type="button" class="btn btn-outline-success btn-sm">Apply</button>
        <button id="cancel" type="button" class="btn btn-outline-danger btn-sm">Cancel</button>
    </div>`//end
   };
  //#region [rgba(200, 10, 10,0.5)]
//#endregion
function html_saveEditor() {
    return message = /*html*/ `
    <div class="container" id="dataIntepretor">
    <h6>
        <font color="#d2bc97">SAVE MAP EXPORT</font>
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
                <tr><!--Rendering parralaxe for RMMV?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Rendering parralaxe for RMMV?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="r_paraRmmv" checked>
                            <label for="r_paraRmmv" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering Layers For PhotoShops?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Rendering Layers For PhotoShops?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="r_layerPSD"/>
                            <label for="r_layerPSD" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering Events and Players Sprites?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Rendering Events and Players Sprites?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="r_event"/>
                            <label for="r_event" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering grafics debugging?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Rendering grafics debugging?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="r_grafics"/>
                            <label for="r_grafics" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering Light shadders?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Rendering Light shadders?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="r_light"/>
                            <label for="r_light" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering layers Normals?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Rendering layers Normals?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="r_normal"/>
                            <label for="r_normal" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--Rendering with current Animations times?-->
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Rendering with current Animations times?:</small>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input type="checkbox" name="checkbox" id="r_currentTime"/>
                            <label for="r_currentTime" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                </tr>
                <tr><!--eventID-->
                    <td colspan="2">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="">data file name:</small>
                                </div>
                            </div>
                            <input type="text" autocomplete="on" placeholder="Map001_sprites.json" class="form-control" id="fileName">
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
  
        
    <table class="table table-hover table-dark table-sm">
        <thead class="thead-dark">
            <tr>
                <th scope="col">Information</th>
                <th scope="col">Value</th>
            </tr>
        </thead>
        <tbody id="information">
            <tr>
                <td>VERSION:</td>
                <td class="text-success">Editor: ${Imported["pixiMapEditor"]}</td>
            <tr>
            <tr>
                <td>savePath:</td>
                <td class="text-success">/data/Map00${$gameMap._mapId}_sprites.json</td>
            <tr>
            <tr>
                <td>totalSpines:</td>
                <td class="text-success">${ SceneManager._scene._spriteset._tilemap.children.length}</td>
            <tr>
            <tr>
                <td>totalTiles:</td>
                <td class="text-danger"> not avaible ...</td>
            <tr>
            <tr>
                <td>totalLight:</td>
                <td class="text-danger"> not avaible ...</td>
            <tr>
            <tr>
                <td>totalSheets:</td>
                <td class="text-danger"> not avaible ... </td>
            <tr>
            <tr>
                <td>totalMesh:</td>
                <td class="text-danger"> not avaible ... </td>
            <tr>
            <tr>
                <td>totalSpritesObj:</td>
                <td class="text-danger"> not avaible ... </td>
            <tr>
        </tbody>
    </table>  
        <button id="export" type="button" class="btn btn-outline-success col-md-6">Export</button>
        <button id="cancel" type="button" class="btn btn-outline-danger col-md-4">Cancel</button><br>
        <td colspan="3"><font color="#c17d2e">**Be shure you alway have a backup for your json!**</font></td>
    </div>`//end
   };

























   


  //#region [rgba(0,140, 10,0.2)]
//#endregion
function html_mapSetupEditor(listBG) {
    let _listBG = `<option value=false>false</option>`; // 
    for (let i=0, l=listBG.length; i<l; i++) {
        _listBG+=`<option value=${listBG[i]}>${listBG[i]}</option>`;
    };
    return message = /*html*/ `
    <div class="container" id="dataIntepretor">
    <h6>
        <font color="#d2bc97">BASIC SETUP SCENE</font>
        <small class="text-muted"><kbd>Json</kbd></small>
    </h6>
    
      <table class="table table-hover table-dark table-sm">
        <thead style="background-color: #393939" >
            <tr>
                <th scope="col">#</th>
                <th scope="col">def</th>
                <th scope="col">custom</th>
            </tr>
        </thead>
            <tbody>
                <tr><!--BG LIST AVAIBLE-->
                    <td>
                        <div class="funkyradio funkyradio-success">
                            <input id="_BackGround" type="checkbox" name="checkbox"/>
                            <label for="_BackGround" style="text-indent:0px;margin-right:0px;">.</label>
                        </div>
                    </td>
                    <td>"false"</td>
                    <td>
                        <div class="input-group input-group-xs">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                <small class="text-muted">Background:</small>
                                </div>
                            </div>
                            <select class="selectRadius" id="BackGround">${_listBG}</select>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="table table-hover table-dark table-sm">
        <thead style="background-color: #393939" >
            <tr>
                <th scope="col">#</th>
                <th scope="col">def</th>
                <th scope="col">custom</th>
            </tr>
        </thead>
        <tbody>
            <td colspan="3"><font color="#d2bc97">Custom Scene Global Light</font></td>
            <tr><!--blendMode-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_blendMode"/>
                        <label for="_blendMode" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>1</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">blendMode:</small>
                            </div>
                        </div>
                        <input type="number" step=1 value=1 min=0 max=3 class="form-control" id="blendMode">
                    </div>
                </td>
            </tr>
            <tr><!--lightHeight-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_lightHeight"/>
                        <label for="_lightHeight" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>0.075</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">lightHeight:</small>
                            </div>
                        </div>
                        <input type="number" step=0.001 value=0.075 min=0.001 max=1 class="form-control" id="lightHeight">
                    </div>
                </td>
            </tr>
            <tr><!--brightness-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_brightness"/>
                        <label for="_brightness" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>1</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">brightness:</small>
                            </div>
                        </div>
                        <input type="number" step=0.1 value=1 min=0.1 class="form-control" id="brightness">
                    </div>
                </td>
            </tr>
            <tr><!--radius-->
                <td>
                    <div class="funkyradio funkyradio-danger">
                        <input type="checkbox" name="checkbox" id="_radius"/>
                        <label for="_radius" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>Infinity</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">radius:</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 min=0 class="form-control" id="radius">
                    </div>
                </td>
            </tr>
            <tr><!--drawMode-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_drawMode"/>
                        <label for="_drawMode" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>TRIANGLES</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <small class="text-muted">drawMode:</small>
                            </div>
                        </div>
                        <select class="selectRadius" id="drawMode">
                            <option value=1>LINES</option>
                            <option value=2>LINE_LOOP</option>
                            <option value=3>LINE_STRIP</option>
                            <option value=0>POINTS</option>
                            <option value=4 selected>TRIANGLES</option>
                            <option value=6>TRIANGLE_FAN</option>
                            <option value=5>TRIANGLE_STRIP</option>
                        </select>
                    </div>
                </td>
            </tr>
            <tr><!--color-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_color"/>
                        <label for="_color" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>0xffffff</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">color:HVS:</small><input type="checkbox" id="tint_mode"><small class="text-muted"></small>
                            </div>
                        </div>
                        <input style="z-index:9999999;" value="ffffff" class="jscolor form-control" id="color">
                    </div>
                </td>
            </tr>
            <tr><!--falloff -->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_falloff"/>
                        <label for="_falloff" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[0.75,3,20]</td>
                <td id="_setDark-BoxDisplay" style="display: block;">
                    <font color="#d2bc97">falloff attenuation coefficients controler</font><br><br>
                    <div class="form-control">
                        <b>kc</b> <input value=0.75 data-slider-min=0.01 data-slider-max=2 data-slider-step=0.01 data-slider-value=0.75 
                        data-slider-id="RC" id="kc" data-slider-handle="triangle" type="text" class="span2"  /><br>

                        <b>kl</b> <input value=3 data-slider-min=0.01 data-slider-max=20 data-slider-step=0.01 data-slider-value=3
                        data-slider-id="GC" id="kl" data-slider-handle="triangle" type="text" class="span2"/><br>

                        <b>kq</b> <input value=20 data-slider-min=0.01 data-slider-max=50 data-slider-step=0.01 data-slider-value=20
                        data-slider-id="BC" id="kq" data-slider-handle="triangle" type="text" class="span2"/>

                    </div> 
                </td>
            </tr>
        </tbody>
    </table>
        
        <button id="apply" type="button" class="btn btn-outline-success col-md-6">Apply</button>
        <button id="cancel" type="button" class="btn btn-outline-danger col-md-4">Cancel</button><br>
        <td colspan="3"><font color="#c17d2e">**This will change the "currentScene".json**</font></td>
    </div>`//end
   };





  //#region [rgba(200, 10, 10,0.5)]
//#endregion
function htlm_tileSetupEditor(InMapObj) {

return message = /*html*/ `
<div class="container" id="dataIntepretor">
<h6>
    <font color="#d2bc97">CUSTOM OBJ SESSION PROPRETY EDITOR</font>
    <small class="text-muted"><kbd>Json</kbd></small>
</h6>

    <div class="form-check-inline funkyradio">
        <div class="funkyradio-success">
            <input type="checkbox" name="checkbox" id="check_mouseMode" checked/>
            <label for="check_mouseMode">mouse mode</label>
        </div>
        <div class="funkyradio-success">
            <input type="checkbox" name="checkbox" id="check_haven"/>
            <label for="check_haven">pixi haven</label>
        </div>
    </div>     

    <table class="table table-hover table-dark table-sm">
        <thead style="background-color: #393939" >
            <tr>
                <th scope="col">#</th>
                <th scope="col">def</th>
                <th scope="col">custom</th>
            </tr>
        </thead>
        <tbody>
            <tr><!--groupID-->
                <td>
                    <div class="funkyradio funkyradio-danger">
                        <input type="checkbox" name="checkbox" id="_groupID"/>
                        <label for="_groupID" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>"undefined"</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">groupID:</small>
                            </div>
                        </div>
                        <input type="text" autocomplete="on" value:"default" class="form-control" id="groupID">
                    </div>
                </td>
            </tr>
            <tr><!--scale-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_scale"/>
                        <label for="_scale" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[1,1]</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">Scale:&nbsp</small><input type="checkbox" id="scale_lock"><small class="text-muted">&#x1f512;</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=50 class="form-control" id="scale" id2=0>
                        <input type="number" step=0.01 value=0 class="form-control" id="scale" id2=1>
                    </div>
                </td>
            </tr>
            <tr><!--skew-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_skew"/>
                        <label for="_skew" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[0,0]</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">skew:&nbsp</small><input type="checkbox" id="skew_lock"><small class="text-muted">&#x1f512;</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 class="form-control" id="skew" id2=0>
                        <input type="number" step=0.01 value=0 class="form-control" id="skew" id2=1>
                    </div>
                </td>
            </tr>
            <tr><!--pivot-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_pivot"/>
                        <label for="_pivot" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[0,0]</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">pivot:&nbsp</small><input type="checkbox" id="pivot_lock"><small class="text-muted">&#x1f512;</small>
                            </div>
                        </div>
                        <input type="number" step=1 value=0 class="form-control" id="pivot" id2=0>
                        <input type="number" step=1 value=0 class="form-control" id="pivot" id2=1>
                    </div>
                </td>
            </tr>
            <tr><!--anchor-->
                <td>
                    <div class="funkyradio funkyradio-danger">
                        <input type="checkbox" name="checkbox" id="_anchor"/>
                        <label for="_anchor" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>[0,0]</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">anchor:&nbsp</small><input type="checkbox" id="anchor_lock"><small class="text-muted">&#x1f512;</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 class="form-control" id="anchor" id2=0>
                        <input type="number" step=0.01 value=0 class="form-control" id="anchor" id2=1>
                    </div>
                </td>
            </tr>
            <tr><!--rotation-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_rotation"/>
                        <label for="_rotation" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>0</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">rotation:deg°:</small><input type="checkbox" id="deg_mode"><small class="text-muted"></small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 class="form-control" id="rotation">
                    </div>
                </td>
            </tr>
            <tr><!--alpha-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_alpha"/>
                        <label for="_alpha" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>1</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">alpha:</small>
                            </div>
                        </div>
                        <input type="number" step=0.01 value=0 min=0 max=1 class="form-control" id="alpha">
                    </div>
                </td>
            </tr>
            <tr><!--blendMode-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_blendMode"/>
                        <label for="_blendMode" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>0</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">blendMode:</small>
                            </div>
                        </div>
                        <input type="number" step=1 value=0 min=0 max=3 class="form-control" id="blendMode">
                    </div>
                </td>
            </tr>
            <tr><!--tint-->
                <td>
                    <div class="funkyradio funkyradio-success">
                        <input type="checkbox" name="checkbox" id="_tint"/>
                        <label for="_tint" style="text-indent:0px;margin-right:0px;">.</label>
                    </div>
                </td>
                <td>0xffffff</td>
                <td>
                    <div class="input-group input-group-xs">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                            <small class="text-muted">tint:HVS:</small><input type="checkbox" id="tint_mode"><small class="text-muted"></small>
                            </div>
                        </div>
                        <input style="z-index:9999999;" value="ffffff" class="jscolor form-control" id="tint">
                    </div>
                </td>
            </tr>
            <tr><!--Layers Options autoDisplayGroup-->
                <td><div class="custom-control custom-checkbox form-inline">
                    <input type="checkbox" class="custom-control-input input-xs" id="_autoDisplayGroup">
                    <label class="custom-control-label" for="_autoDisplayGroup"></label>
                </div></td>
                <td colspan="2">autoDisplayGroup: <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="AD0">
                    <label class="form-check-label" for="AD0" style="padding-right: 10px;">:0</label>
                    <input class="form-check-input" type="checkbox" id="AD1">
                    <label class="form-check-label" for="AD1" style="padding-right: 10px;">:1</label>
                    <input class="form-check-input" type="checkbox" id="AD2">
                    <label class="form-check-label" for="AD2" style="padding-right: 10px;">:2</label>
                    <input class="form-check-input" type="checkbox" id="AD3">
                    <label class="form-check-label" for="AD3" style="padding-right: 10px;">:3</label>
                    <input class="form-check-input" type="checkbox" id="AD4">
                    <label class="form-check-label" for="AD4" style="padding-right: 10px;">:4</label>
                    <input class="form-check-input" type="checkbox" id="AD5">
                    <label class="form-check-label" for="AD5" style="padding-right: 10px;">:5</label>
                    <input class="form-check-input" type="checkbox" id="AD6">
                    <label class="form-check-label" for="AD6" style="padding-right: 10px;">:6</label>
                </div></td>
            </tr>
        </tbody>
    </table>
    <button id="ApplyToAllGroup" type="button" class="btn btn-outline-warning btn-sm">Apply To All Group</button>
    <button id="reset" type="button" class="btn btn-outline-light btn-sm">Reset Default</button>
    <br><br>
    <button id="apply" type="button" class="btn btn-outline-success btn-sm col-md-6">Apply</button>
    <button id="cancel" type="button" class="btn btn-outline-danger btn-sm col-md-4">Cancel</button>
</div>`//end
};
