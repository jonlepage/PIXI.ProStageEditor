/*:
// PLUGIN □────────────────────────────────□ SPRITE LIBRARY LOADER FOR SPINE && TEXTUREPACKER □─────────────────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc preLoad all library altas for game
* V.1.0
* License:© M.I.T
*VERY IMPORTANT NOTE: Export from texturePacker with trimmed Name (remove extention.png for use tile normal)
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
var Imported = Imported || {};
Imported['JSONlibraryLoader'] = {version:1.0};
// ┌------------------------------------------------------------------------------┐
// GLOBAL $SLL CLASS: _SLL for SPRITE LIBRARY LOADER
//└------------------------------------------------------------------------------┘
class _SLL{
    constructor() {
        this.libsLoaded = false;
        this.libraryPath = 'SSA'; // FOLDER PATH WHERE STORED ALL JSON LIBRARY
        this.category = []; // store Category name found from scannerNwJS (all objects can have a general category for easy sort)
        this.pathLibsJson = {}; // result from nwJS libs folders scanner path formated for pixiJS
        this.resource = {}; //Store sheets and spine ressources
    };
  };


// ┌------------------------------------------------------------------------------┐
// nwJS library path scanner (find all JSON need for pixiLoader)
//└-------------------------------------------------------------------------------┘
_SLL.prototype.load_nwJSFolderLibs = function() {
     // List all files and folders in a directory with Node.js
     let libs;
     var walkSync = function(dir, list) {
        var path = path || require('path');
        var fs = fs || require('fs'), files = fs.readdirSync(dir), list = list || [];
        !libs && (libs = files);
        files.forEach(function(file) { // create instance for eatch folder
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                list = walkSync(path.join(dir, file), list);
            }
            else {
                list.push([path.join(dir, file),path.parse(file)]) 
            };
        });
        return list;
    };
    const list = walkSync("SSA");
    this.category = libs;
    let result = {};
    list.forEach(file => {
        if(file[0].indexOf('.json')>-1){
            const name = file[1].name;
            let cat = null;
            libs.forEach(libName => {
                if(file[0].indexOf(libName)>-1){
                    cat = libName;
                }
            });
            result[ file[1].name] = {
                path:file[0].replace(/\\/g, "/"),
                cat:cat,
                name:name
            };
        };
    });
    this.pathLibsJson = result;
    this.startLibraryLoader();
};


// ┌------------------------------------------------------------------------------┐
// PIXI LOADER for ressources
//└-------------------------------------------------------------------------------┘
// TODO: find a way to load a .json that also have reference to normal.png in same .json COPY frame/crop/orig to textures..
// for now , diffuse and normal need load in separate json (name.json,name_n.json)***
_SLL.prototype.startLibraryLoader = function() {
    const loader_libs = new PIXI.loaders.Loader();
    //const re = /Characteres|Rocks|Trees|Buildings|Grass|FurnitureINT|FurnitureEXT|Cliffs|Objets|Divers/i; // TODO: SEE this.category = getDirectories for make dynamic cat
    for (const name in this.pathLibsJson) {
        loader_libs.add(name, this.pathLibsJson[name].path);
    };
    loader_libs.load();

    loader_libs.onProgress.add((loader, res) => { // store all ressource reference in $SLL.resource
        if(res.extension === "json"){
            const name = res.name;
            const source =  $SLL.pathLibsJson[name];
            const meta = res.data.meta || res.data.skeleton;
            const resource = {
                name:name,
                sheetName:name,
                cat:source.cat,
                path:source.path,
                type:res.spritesheet && 'tileSheets' || res.spineData && 'spineSheets',
                data:res.data,
                normal:meta.normal,
                case:meta.case || false,
                //ress:res, // for debug uncommentMe
            };
            res.spineData && (resource.spineData = res.spineData);
            res.spritesheet && (resource.spritesheet = res.spritesheet)
            $SLL.resource[name] = resource;
        };
    });
    loader_libs.onComplete.add(() => { 
        $player.initialize();
        $SLL.libsLoaded = true 
    }); // called once when the queued resources all load.
};

// ┌------------------------------------------------------------------------------┐
// END START INITIALISE PLUGIN METHOD
//└------------------------------------------------------------------------------┘
const $SLL = new _SLL(); //global
$SLL.load_nwJSFolderLibs();
console.log1('$SLL: ', $SLL);


