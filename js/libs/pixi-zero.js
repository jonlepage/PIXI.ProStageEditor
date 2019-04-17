

/** set zero from source or arguments 
 * @argument x Objet defeni zero grace un objet PIXI.Point ou ObservablePoint
 * @argument x number x,y,z defeni via des valeur number
 * 
*/
PIXI.ObservablePoint.prototype.zeroSet = function (x, y, z) {
    this.zero = this.zero || new PIXI.Point(); // need point if not exist
    if(!arguments.length){
        this.zero.copy(this);
    }else
    if(isNaN(x)){
        this.zero.copy.copy(x);
    }else{
        this.zero.set(...arguments);
    };
    return this;
};

/** Applique les valeur store dans ZERO
 * @param continuity boolean Permet de rendre les valeur precedente en zero apret appliquer
 */
PIXI.ObservablePoint.prototype.zeroApply = function (continuity) {
    !this.zero && this.zeroSet();
    continuity = continuity? this.clone() : this.zero;
    this.copy(this.zero);
    this.zero.copy(continuity); // update value with old next value
    return this;
};

/** obtien la diference en zero et actuel */
PIXI.ObservablePoint.prototype.zeroDiff = function (abs) {
    !this.zero && this.zeroSet();
    let x = this.zero && this.zero.x || this._x;
    let y = this.zero && this.zero.y || this._y;
    x = abs? Math.abs(this._x-x):this._x-x;
    y = abs? Math.abs(this._y-y):this._y-y;
    return new PIXI.Point(x,y);
};