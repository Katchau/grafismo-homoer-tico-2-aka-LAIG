function CageBoard(scene, x, y) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.plane = new CGFplane(this.scene, 1, 1, 10, 10);
    this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.2, 10, 10);
    this.dest = undefined;
    this.select = undefined;
    this.board = [
        ['v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v'],
        ['v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v'],
        ['v', 'v', 'x', 'v', 'v', 'v', 'v', 'v', 'v', 'v'],
        ['v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v'],
        ['v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v'],
        ['v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v'],
        ['v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v'],
        ['v', 'v', 'v', 'v', 'v', 'v', 'o', 'v', 'v', 'v'],
        ['v', 'v', 'v', 'x', 'v', 'v', 'v', 'v', 'v', 'v'],
        ['v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v']
    ];
}

CageBoard.prototype = Object.create(CGFobject.prototype);
CageBoard.prototype.constructor = CageBoard;

CageBoard.prototype.outOfBound = function (point) {
    if(point.x == 0 || point.x == 11 || point.y == 0 || point.y == 11) return true;
    return false;
};


CageBoard.prototype.checkPlay = function () {
    var player = this.scene.client;
    if(player.gameOver)return false;
    if(player.availablePlay()){
        var answer = player.jump(this.select.x+1,this.select.y+1,this.dest.x+1,this.dest.y+1);
        if(answer instanceof Point){
            if(this.outOfBound(answer)){
                this.board[answer.x-1][answer.y-1] = this.board[this.select.x][this.select.y];
            }
            this.board[this.select.x][this.select.y] = 'v';
            this.board[this.dest.x][this.dest.y] = 'v';
            //if(player.canReJump(answer.x,answer.y)) return "again";
        }
        else if(player.makeMovement(this.select.x+1,this.select.y+1,this.dest.x+1,this.dest.y+1)){
            this.board[this.dest.x][this.dest.y] = this.board[this.select.x][this.select.y];
            this.board[this.select.x][this.select.y] = 'v';
        }
        else return false;
    }
    player.endTurn();
    return true;
};

CageBoard.prototype.movement = function (hasJump) {
    var ret = null;
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj) {
                    var customId = this.scene.pickResults[i][1];

                    if (customId > 100 && this.select == undefined) {
                        var p1 = customId - 101;
                        var y1 = (p1 % 10);
                        var x1 = (p1 - y1) / 10;
                        this.select = new Point(x1, y1);
                    } else if (this.select != undefined) {
                        var p2 = (customId > 100) ? customId - 101 : customId - 1;
                        var y2 = (p2 % 10);
                        var x2 = (p2 - y2) / 10;
                        this.dest = new Point(x2, y2);
                        ret = this.checkPlay();
                        //else ret = makeJump();
                        this.select = undefined;
                        this.dest = undefined;
                    }

                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
            return ret;
        }
    }
};

CageBoard.prototype.display = function() {

    this.scene.translate(0.5, 0, 0.5);

    var indice = 1;
    var piece = 101;

    for (var i = 0; i < this.y; i++) {
        for (var j = 0; j < this.x; j++) {
            this.scene.pushMatrix();

            this.scene.translate(j, 0, i);
            this.scene.registerForPick(indice++, this.plane);

            this.scene.materials[(i + j) % 2].apply();

            this.plane.display();

            this.scene.popMatrix();

            if(this.board[i][j] == 'x'){

              this.scene.pushMatrix();
              this.scene.translate(j, 0.2, i);
              this.scene.rotate(Math.PI/2, 1, 0, 0);
              this.scene.registerForPick(piece, this.piece);

              this.scene.materials[2].apply();

              this.piece.display();

              this.scene.popMatrix();
            } else if(this.board[i][j] == 'o'){
              this.scene.pushMatrix();
              this.scene.translate(j, 0.2, i);
              this.scene.rotate(Math.PI/2, 1, 0, 0);
              this.scene.registerForPick(piece, this.piece);

              this.scene.materials[3].apply();

              this.piece.display();

              this.scene.popMatrix();
            }
            piece++;
        }
    }

        this.scene.clearPickRegistration();
};
