
/*:
// PLUGIN □────────────────────────────────□ COMBAT CORE ENGINE □───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @plugindesc manage combats
* V.0.1a
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

// ┌-----------------------------------------------------------------------------┐
// GLOBAL $combats CLASS: _combats
//└------------------------------------------------------------------------------┘
class _combats{
    constructor() {
        this._active = false; // in combat mode indicator
    };

    intitialize(dataCase){
        //TODO: delete me, generer monster id, et nombre
        const monstersSetup = [
            {id:1,lv:1}
        ];
        TweenLite.to($objs.list_cases, 1, { alpha:0, ease: Expo.easeOut });
        $camera.zoom = 2;
        $camera.setZoom(2.5);
        $camera.moveToTarget(1);
        
        const m1 = new _monsters(1,1);
        $stage.scene.addChild(m1.sprite);
        const currentCase = $player.inCase;
        const m1_idCase = +Object.keys($player.inCase.pathConnexion)[0];
        const m1Case = $objs.list_cases[m1_idCase];
        m1.x = m1Case.x;
        m1.y = m1Case.y;
        m1.z = m1.y;
        $huds.combats.setupToScene(); // add child and setup to current scene.
    };




};
$combats = new _combats();
console.log1('$combats', $combats);
