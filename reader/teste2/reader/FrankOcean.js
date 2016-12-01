/*
    Construtor para a primitiva FrankOcean
*/
function FrankOcean(scene) {
    CGFobject.call(this, scene);
	
	this.appearance = new CGFappearance(scene);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);
	
    this.scene = scene;
    this.textureref1 = "scenes//textures//a2.jpg";
    this.texture1 = new CGFtexture(this.scene, this.textureref1);
	this.textureref2 = "scenes//textures//a3.jpg";
    this.texture2 = new CGFtexture(this.scene, this.textureref2);
	this.appearance.setTexture(this.texture2);

    this.shader = new CGFshader(this.scene.gl, "shaders/oce.vert", "shaders/oce.frag");
    this.plane = new MyPlane(this.scene, 1, 1, 10, 10);
    this.shader.setUniformsValues({ uSample2: 1, uSample3: 1});
}

FrankOcean.prototype = Object.create(CGFobject.prototype);
FrankOcean.prototype.constructor = FrankOcean;

/*
  Função de display da primitiva complexa FrankOcean
*/
FrankOcean.prototype.display = function(){
    this.appearance.apply();
	this.scene.setActiveShader(this.shader);
	
	this.scene.pushMatrix();
    this.texture1.bind(1);
    this.scene.rotate(Math.PI/2,-1,0,0);
    this.plane.display();
    this.scene.popMatrix();
	
    this.scene.setActiveShader(this.scene.defaultShader);
}
