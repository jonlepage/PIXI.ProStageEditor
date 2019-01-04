
/*:
// PLUGIN □────────────────────────────────□CONTAINER ANIMATIONS MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/

/** @memberof Container_Base */
class Container_Animation extends Container_Base {
        constructor(dataBase, textureName, dataValues) {
            super();
            dataValues = dataValues || this.getDataValues(dataBase, textureName);
            this.createBases(dataBase, dataValues);
            this.asignValues(dataValues, true);
        };
        // getters for ContainerAnimations
        get animationSpeed() { return this.d.animationSpeed };
        set animationSpeed(value) { this.d.animationSpeed = value };
        get loop() { return this.d.loop };
        set loop(value) { this.d.loop = value };
        get playing() { return this.d.playing };
        set playing(value) { this.d.playing = value };
        get currentFrame() { return this.d? this.d.currentFrame : 0; };
        set currentFrame(value) { this.d.currentFrame = value };
        get totalFrames() { return this.d.totalFrames };
        set totalFrames(value) { return this.d.totalFrames };


 // create,build basic textures need for ContainerAnimations
    createBases (dataBase, dataValues) {
        const td = dataBase.textures  [dataValues.p.textureName]; // ref texture:diffuse
        const tn = dataBase.textures_n [dataValues.p.textureName]; // ref texture:normal
        const d = new PIXI.extras.AnimatedSprite(td);
        const n = new PIXI.Sprite(tn[0]);
        this.Sprites = {d,n};
        this.addChild(d,n);
        this.normalWithTextures(tn);
        this.play(0);
    };

    // hack updateTexture for allow normals and diffuse with closure
    normalWithTextures (textures) {
        const _t = textures;
        const _n = this.n;
        this.d.updateTexture = function updateTexture() {
            this._texture = this._textures[this.currentFrame];// update diffuse textures
            this.cachedTint = 0xFFFFFF;
            this._textureID = -1;

            _n._texture = _t[this.currentFrame];// update normal textures
            _n._textureID = -1;
            
            if (this.onFrameChange) {
                this.onFrameChange(this.currentFrame);
            };
        };
    };

    play (frame) {
       if(Number.isFinite(frame)){
            this.Sprites.d.gotoAndPlay(~~frame);
       }else{
            this.Sprites.d.play();
       };
    };

    affines (value) {
        this.d.proj.affine = value;
        this.n.proj.affine = value;
    };






};//END CLASS
    
    