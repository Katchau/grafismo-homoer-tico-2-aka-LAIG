/* Construtor da Pokebola*/
function PokeBall(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.semiBall = new MySemiCircle(scene,20,20);
    this.trigger = new MyCylinder(scene,1,1,0.1,10,1);
    //this.semiBall = new MySemiCircle(scene,5,5);
    //this.trigger = new MyCylinder(scene,1,1,0.1,4,1);

    this.whiteMat = new CGFappearance(this.scene);
    this.whiteMat.setAmbient(0.2,0.2,0.2,1);
    this.whiteMat.setDiffuse(1,1,1,1);
    this.whiteMat.setSpecular(1,1,1,1);
    this.whiteMat.setShininess(10);

    this.blackMat = new CGFappearance(this.scene);
    this.blackMat.setAmbient(0.2,0.2,0.2,1);
    this.blackMat.setDiffuse(0,0,0,0);
    this.blackMat.setSpecular(1,1,1,1);
    this.blackMat.setShininess(10);

    this.texture = new CGFtexture(this.scene, "scenes//textures//pokebottom.png");
    this.texture2 = new CGFtexture(this.scene, "scenes//textures//pokefront.png");
}


PokeBall.prototype = Object.create(CGFobject.prototype);
PokeBall.prototype.constructor = PokeBall;



/* Inicializa as caracteristicas do Torus */
PokeBall.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.translate(0,0,0.1);
    this.scene.scale(0.5,0.5,0.5);
    this.texture.bind(0);
    this.semiBall.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.48,0,0.05);
    this.scene.scale(0.2,0.2,0.2);
    this.scene.rotate(Math.PI/2,0,0,1);
    this.scene.rotate(Math.PI/2,1,0,0);
    this.texture.unbind(0);
    this.blackMat.apply();
    this.trigger.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.5,0,0.05);
    this.scene.scale(0.1,0.1,0.1);
    this.scene.rotate(Math.PI/2,0,0,1);
    this.scene.rotate(Math.PI/2,1,0,0);
    this.whiteMat.setTexture(null);
    this.whiteMat.apply();
    this.trigger.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.5,0.5,0.5);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.whiteMat.setTexture(this.texture);
    this.whiteMat.apply();
    this.semiBall.display();
    this.scene.popMatrix();

};
