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
    this.jump = false;
    this.jump_position = undefined;

    this.tempo_dec = 0;
    this.animation = null;
    this.animation_start = false;

    this.resetBoard();
    this.createMats();
}

CageBoard.prototype = Object.create(CGFobject.prototype);
CageBoard.prototype.constructor = CageBoard;

CageBoard.prototype.resetBoard = function () {
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
};

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
    this.yellMat = new CGFappearance(this.scene);
    this.yellMat.setEmission(1,1,0,1);
    this.yellMat.setAmbient(0.2,0.2,0.2,1);
    this.yellMat.setDiffuse(1,1,0,1);
    this.yellMat.setSpecular(1,1,1,1);
    this.yellMat.setShininess(10);
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

CageBoard.prototype.updateBoard = function(){
    if(this.jump){
        if(!this.outOfBound(this.jump_position)){
            this.board[this.jump_position.x-1][this.jump_position.y-1] = this.board[this.test1.x][this.test1.y];
        }
        this.board[this.test1.x][this.test1.y] = 'v';
        this.board[this.pos2.x][this.pos2.y] = 'v';
    }
    else{
        this.board[this.pos2.x][this.pos2.y] = this.board[this.pos1.x][this.pos1.y];
        this.board[this.pos1.x][this.pos1.y] = 'v';
    }
};

CageBoard.prototype.updateScore = function () {
    var player = this.scene.client;
    var playerN = (player.player == 'x') ? 1 : 0;
    this.scene.healthBars[playerN].changeSize();
};

CageBoard.prototype.makeJump = function () {
    var player = this.scene.client;
    var answer = player.playerJump(this.next.x+1,this.next.y+1,this.dest.x+1,this.dest.y+1);
    this.test1 = this.next.clone();
    if(answer instanceof Point){
        this.jump_position = answer.clone();
        this.jump = true;
        var newPoint = new Point(answer.x-1,answer.y-1);
        this.pos2 = this.dest.clone();
        this.resetAnimation(this.test1,newPoint);
        this.updateScore();
        if(player.canReJump(answer.x,answer.y)) {
            this.next = new Point(answer.x-1,answer.y-1);
            return "again";
        }
        //push board
        player.endTurn();
        return true;
    }
    else return false;
};

CageBoard.prototype.checkPlay = function () {
    var player = this.scene.client;
    if(player.gameOver)return false;
    if(player.availablePlay()){
        this.next = this.select.clone();
        var answer = this.makeJump();
        if(answer === true)return true;
        else if(answer == "again") return "again";
        else if(player.makeMovement(this.select.x+1,this.select.y+1,this.dest.x+1,this.dest.y+1)) {
            this.jump = false;
            this.pos1 = this.select.clone();
            this.pos2 = this.dest.clone();
            this.resetAnimation(this.select,this.dest);
            //push board
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

CageBoard.prototype.resetAnimation = function(point1, point2){
    this.animation = new gameAnimation(69,point1.x,point1.y,point2.x,point2.y);
    this.animation_start = true;
    this.tempo_dec = 0;
};

CageBoard.prototype.animationUpdate = function(tempovar){
    if(this.animation_start){
        this.tempo_dec += tempovar;
        if(!this.animation.updateAnimation(this.tempo_dec,tempovar)){
            this.animation_start = false;
            this.updateBoard();
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


            if(this.board[i][j] == 'x' || this.board[i][j] == 'o') {
                this.scene.pushMatrix();
                if(this.animation != null && this.animation_start && this.animation.initialPoint.x == i && this.animation.initialPoint.y == j){
                    this.scene.translate(this.animation.z_atual, this.animation.y_atual, this.animation.x_atual);
                }
                this.scene.translate(j, 0.2, i);
                this.scene.rotate(Math.PI / 2, 1, 0, 0);
                this.scene.registerForPick(piece, this.piece);

                if (this.board[i][j] == 'x') this.redMat.apply();
                else if (this.board[i][j] == 'o') this.greenMat.apply();

                if(this.select != undefined){
                    if(i == this.select.x && this.select.y == j){
                        this.yellMat.apply();
                    }
                }
                this.piece.display();

                this.scene.popMatrix();
            }
            piece++;
        }
    }

        this.scene.clearPickRegistration();
};
