function CageBoard(scene, x, y) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.x = x;
    this.y = y;

    this.plane = new CGFplane(this.scene, 1, 1, 10, 10);
    this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.2, 10, 10);
}

CageBoard.prototype = Object.create(CGFobject.prototype);
CageBoard.prototype.constructor = CageBoard;

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

            if(this.scene.board[i][j] == 'x'){

              this.scene.pushMatrix();
              this.scene.translate(j, 0.2, i);
              this.scene.rotate(Math.PI/2, 1, 0, 0);
              this.scene.registerForPick(piece, this.piece);

              this.scene.materials[2].apply();

              this.piece.display();

              this.scene.popMatrix();
            } else if(this.scene.board[i][j] == 'o'){
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
