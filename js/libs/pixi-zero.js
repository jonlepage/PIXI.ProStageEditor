

PIXI.ObservablePoint.prototype.zeroSet = function (x, y, z) {
    this.zero = this.zero || new PIXI.Point();
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

PIXI.ObservablePoint.prototype.zeroApply = function (continuity) {
    !this.zero && this.zeroSet();
    continuity = continuity? this.clone() : this.zero;
    this.copy(this.zero);
    this.zero.copy(continuity);
    return this;
};

PIXI.ObservablePoint.prototype.zeroDiff = function (abs) {
    !this.zero && this.zeroSet();
    let x = this.zero && this.zero.x || this._x;
    let y = this.zero && this.zero.y || this._y;
    x = abs? Math.abs(this._x-x):this._x-x;
    y = abs? Math.abs(this._y-y):this._y-y;
    return new PIXI.Point(x,y);
};