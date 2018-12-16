// ┌------------------------------------------------------------------------------┐
// GLOBAL $monsters: _monsters
//└------------------------------------------------------------------------------┘
class _monsters {
    constructor() {
        this.id = [];
    };

    initialize() {
        this.id[1] = {
            _name:"divinom",
            dataBase:$Loader.Data2.m1
        }
    };

    
};

$monsters = new _monsters();
console.log1('$monsters: ', $monsters);
