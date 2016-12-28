/* Construtor do Torus */
function MyTorus(scene, inner, outer, slices, loops) {
    CGFobject.call(this, scene);

    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.stacks = loops;

    this.angle = 0;
    //this.tempo_dec = 0;

    this.scene.rings.push(this);
    this.torus = new MyTorus2(scene,inner,outer,slices,loops);
};


MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

MyTorus.prototype.updateAnimation = function(tempovar){
    //this.tempo_dec += tempovar;
    this.angle += tempovar * Math.PI*3/2;
};


/* Inicializa as caracteristicas do Torus */
MyTorus.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.rotate(this.angle, 0, 1, 0);
    this.torus.display();
    this.scene.popMatrix();
};
