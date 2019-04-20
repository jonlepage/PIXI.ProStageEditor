/*:
// PLUGIN □──────────────────────────────□AUDIO MANAGERS PIXI-SOUND□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* V.0.1a
* License:© M.I.T
└─────────────────────────────────────────────────────────────────────────────────────────┘
*/

/*
┌------------------------------------------------------------------------------┐
  GLOBAL $audio CLASS: _audio
  Controls Audios in game 
└------------------------------------------------------------------------------┘
*/
//FIXME: SoundLibrary OR PIXI.sound need find the name space to extends proto
// PIXI.utils.mixins(PIXI.sound,)
let $audio = PIXI.sound;

  $audio.initialize = function() {

    console.log(this);
  };

  /** mix 2 instance */
  $audio.mix = function(a,b) {
    console.log(this);
  };

  /** mix 2 instance */
  $audio.tween = function(instance,tween) {
    console.log(this);
  };


  /** Destroys all sounds from cache {keep perma}*/
  $audio.destroy = function(perma){
    this._sounds.forEach(s => { !s._perma && s.destroy() });
  };



