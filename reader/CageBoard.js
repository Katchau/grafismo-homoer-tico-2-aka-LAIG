function CageBoard(scene, x, y) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.plane = new CGFplane(this.scene, 1, 1, 10, 10);
    this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.2, 10, 10);
    this.dest = undefined;
    this.select = undefined;
    this.next = null;
    this.board = [
        ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o'],
        ['o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'],
        ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o'],
        ['o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'],
        ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o'],
        ['o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'],
        ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o'],
        ['o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'],
        ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o'],
        ['o', 'x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x']
    ];
    this.createMats();
}

CageBoard.prototype = Object.create(CGFobject.prototype);
CageBoard.prototype.constructor = CageBoard;

CageBoard.prototype.createMats = function (){
    this.redMat = new CGFappearance(this.scene);
    this.redMat.setAmbient(0.2,0.2,0.2,1);
    this.redMat.setDiffuse(1,0,0,1);
    this.redMat.setSpecular(1,1,1,1);
    this.redMat.setShininess(10);
    this.greenMat = new CGFappearance(this.scene);
    this.greenMat.setAmbient(0.2,0.2,0.2,1);
    this.greenMat.setDiffuse(0,0.32,0.13,1);
    this.greenMat.setSpecular(1,1,1,1);
    this.greenMat.setShininess(10);
    this.whiteMat = new CGFappearance(this.scene);
    this.whiteMat.setAmbient(0.2,0.2,0.2,1);
    this.whiteMat.setDiffuse(1,1,1,1);
    this.whiteMat.setSpecular(1,1,1,1);
    this.whiteMat.setShininess(10);
    this.blackMat = new CGFappearance(this.scene);
    this.blackMat.setAmbient(0.2,0.2,0.2,1);
    this.blackMat.setDiffuse(0,0,0,1);
    this.blackMat.setSpecular(1,1,1,1);
    this.blackMat.setShininess(10);
};


CageBoard.prototype.outOfBound = function (point) {
    return (point.x == 0 || point.x == 11 || point.y == 0 || point.y == 11);
};

CageBoard.prototype.makeJump = function () {
    var player = this.scene.client;
    var answer = player.playerJump(this.next.x+1,this.next.y+1,this.dest.x+1,this.dest.y+1);
    if(answer instanceof Point){
        if(!this.outOfBound(answer)){
            this.board[answer.x-1][answer.y-1] = this.board[this.next.x][this.next.y];
        }
        this.board[this.next.x][this.next.y] = 'v';
        this.board[this.dest.x][this.dest.y] = 'v';
        if(player.canReJump(answer.x,answer.y)) {
            this.next = new Point(answer.x-1,answer.y-1);
            return "again";
        }
        player.endTurn();
        return true;
    }
    else return false;
};

CageBoard.prototype.checkPlay = function () {
    var player = this.scene.client;
    if(player.gameOver)return false;
    if(player.availablePlay()){
        this.next = this.select;
        var answer = this.makeJump();
        if(answer === true)return true;
        else if(answer == "again") return "again";
        else if(player.makeMovement(this.select.x+1,this.select.y+1,this.dest.x+1,this.dest.y+1)) {
                this.board[this.dest.x][this.dest.y] = this.board[this.select.x][this.select.y];
                this.board[this.select.x][this.select.y] = 'v';
        }
        else return false;
    }
    player.endTurn();
    return true;
};

CageBoard.prototype.movement = function () {
    var ret = false;
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
                        ret = true;
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

            (i + j) % 2 == 0 ? this.whiteMat.apply() : this.blackMat.apply();

            this.plane.display();

            this.scene.popMatrix();

            if(this.board[i][j] == 'x'){

              this.scene.pushMatrix();
              this.scene.translate(j, 0.2, i);
              this.scene.rotate(Math.PI/2, 1, 0, 0);
              this.scene.registerForPick(piece, this.piece);

              this.redMat.apply();

              this.piece.display();

              this.scene.popMatrix();
            } else if(this.board[i][j] == 'o'){
              this.scene.pushMatrix();
              this.scene.translate(j, 0.2, i);
              this.scene.rotate(Math.PI/2, 1, 0, 0);
              this.scene.registerForPick(piece, this.piece);

              this.greenMat.apply();

              this.piece.display();

              this.scene.popMatrix();
            }
            piece++;
        }
    }

        this.scene.clearPickRegistration();
};
