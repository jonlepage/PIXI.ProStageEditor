
/*:
// PLUGIN □────────────────────────────────□CONTAINER ANIMATIONS MANAGER□───────────────────────────────┐
* @author □ Jonathan Lepage (dimisterjon),(jonforum) 
* @module manage container and sprite from pixijs
* V.0.1
* License:© M.I.T
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
//TODO: RENDU ICI, 
/** @memberof Container_Base */
class Container_Animation extends Container_Base {
        constructor(dataObj, dataBase, animationName) {
            super();
            dataObj = dataObj || new dataObj_base( this.getDataValues(dataBase, animationName) );
            this.DataLink = dataObj;
            this.createBases(dataObj);
            this.asignDataValues(dataObj.dataValues);
            this.addChild(this.d,this.n);
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
    createBases (dataObj) {
        const textures_d = dataObj.dataBase.textures  [dataObj.dataValues.p.textureName]; // ref texture:diffuse
        const textures_n = dataObj.dataBase.textures_n [dataObj.dataValues.p.textureName]; // ref texture:normal
        const d = new PIXI.extras.AnimatedSprite(textures_d);
        const n = new PIXI.Sprite(textures_n[0]);
        this.Sprites = {d,n};
        this.batchWithNormals(n,textures_n);
 
    };

    // hack updateTexture for allow normals and diffuse with closure
    batchWithNormals (n,textures_n) {
        this.d.updateTexture = function updateTexture() {
            this._texture = this._textures[this.currentFrame];// update diffuse textures
            this.cachedTint = 0xFFFFFF;
            this._textureID = -1;
            n._texture = textures_n[this.currentFrame];// update normal textures
            n._textureID = -1;
            
            if (this.onFrameChange) {
                this.onFrameChange(this.currentFrame);
            };
        };
    };

    play (frame) {
       if(Number.isFinite(frame)){
            this.d.gotoAndPlay(~~frame);
       }else{
            this.d.play();
       };
    };

    affines (value) {
        this.d.proj.affine = value;
        this.n.proj.affine = value;
    };






};//END CLASS
    
    