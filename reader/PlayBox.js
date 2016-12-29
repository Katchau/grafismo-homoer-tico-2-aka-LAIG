/* Construtor da Pokebola*/
function PlayBox(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.rectangle = new MyRectangle(scene,0,0,11,11);

    this.blackMat = new CGFappearance(this.scene);
    this.blackMat.setAmbient(0.2,0.2,0.2,1);
    this.blackMat.setDiffuse(0,0,0,0);
    this.blackMat.setSpecular(1,1,1,1);
    this.blackMat.setShininess(10);

    this.timer = new MyTimer(this.scene);
    this.scene.timer = this.timer;

    this.garbage_can = [];
    this.garbage_anim = [];

    this.scene.playbox = this;

    // this.texture = new CGFtexture(this.scene, "scenes//textures//pokebottom.png");
    // this.texture2 = new CGFtexture(this.scene, "scenes//textures//pokefront.png");
}


PlayBox.prototype = Object.create(CGFobject.prototype);
PlayBox.prototype.constructor = PlayBox;

PlayBox.prototype.pushGarbage = function(garbage){
   for(var i = 0; i < this.garbage_can.length; i++){
       if(this.garbage_can[i].length > 9 && (i+1) == this.garbage_can.length){
           this.garbage_can[i+1] = [];
           this.garbage_can[i+1].push(garbage);
           return;
       }
       else if(this.garbage_can[i].length > 0 && this.garbage_can[i].length < 10){
           this.garbage_can[i].push(garbage);
           return;
       }
   }
   this.garbage_can[0] = [];
   this.garbage_can[0].push(garbage);
};

/* Inicializa as caracteristicas do Torus */
PlayBox.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.translate(11,0,22);
    this.scene.scale(2,2,2);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0,22);
    this.scene.scale(1,2,2);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,13.2,22.2);
    this.scene.scale(2.2,2.2,1);
    this.timer.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(11,0,0);
    this.scene.scale(1,2,2);
    this.scene.rotate(Math.PI,0,1,0);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(2,2,2);
    this.scene.rotate(-Math.PI/2,0,1,0);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,22,22);
    this.scene.scale(1,2,2);
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    for(var i = 0;i < this.garbage_can.length; i++){
        for(var j = 0; j < this.garbage_can[i].length; j++){
            if(this.scene.cage != null){
                this.scene.pushMatrix();
                this.scene.translate(j+1,23,20.5-i);
                if(this.garbage_can[i][j] =='x') this.scene.cage.piece1.apply();
                else this.scene.cage.piece2.apply();
                this.scene.cage.piece.display();
                this.scene.popMatrix();
            }
        }
    }

};
