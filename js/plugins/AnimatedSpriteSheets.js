


// HACK FOR TEXTURES NORMAL DIFFUSE
PIXI.extras.AnimatedSprite.prototype.normalWith = function (sprite_n, tex_n) {
    console.log('tex_n: ', tex_n);
    console.log('sprite_n: ', sprite_n);
    // asign normal to current animated sprite
    this._sprite_n = sprite_n;
    this._textures_n = tex_n;

    // hack the updateTexture with normal
    this.updateTexture = function updateTexture() {
        this._texture = this._textures[this.currentFrame]; // update diffuse textures
        this._textureID = -1;
        //this._texture._updateUvs();
        this.cachedTint = 0xFFFFFF;
        this._sprite_n._texture = this._textures_n[this.currentFrame]; // update normal textures
        this._sprite_n._textureID = -1;
        //this._sprite_n._texture._updateUvs();
        if (this.onFrameChange) {
            this.onFrameChange(this.currentFrame);
        }
    };

};

