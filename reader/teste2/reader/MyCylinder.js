/* Construtor do cilindro */
function MyCylinder(scene, base, topo, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.topo = topo;
    this.base = base;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
    this.diference = (this.base - this.topo) / this.stacks;
    this.circleTop;
    this.circleBas;
    this.body;

    this.initBuffers();
}
MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

/* Inicializa as caracteristicas do cilindro */
MyCylinder.prototype.initBuffers = function() {
    this.circleTop = new MyCircle(this.scene, this.topo, this.slices);
    this.circleBas = new MyCircle(this.scene, this.base, this.slices);
    this.body = new MyBody(this.scene, this.base, this.topo, this.height, this.slices, this.stacks);
}

/* Faz o display das várias componentes do cilindro, nomeadamente body e tampas */
MyCylinder.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.translate(0,0,this.height);
    this.circleTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI,1,0,0);
    this.circleBas.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.body.display();
    this.scene.popMatrix();
}
