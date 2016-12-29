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

    // this.texture = new CGFtexture(this.scene, "scenes//textures//pokebottom.png");
    // this.texture2 = new CGFtexture(this.scene, "scenes//textures//pokefront.png");
}


PlayBox.prototype = Object.create(CGFobject.prototype);
PlayBox.prototype.constructor = PlayBox;



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
};
