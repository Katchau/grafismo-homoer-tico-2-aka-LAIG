/* Construtor do circulo como tampa do cilindro */
function MyCircle(scene, radius, slices) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.slices = slices;

    this.initBuffers();
}

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

/* Inicializa as caracteristicas da tampa do cilindro */
MyCircle.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (var i = 0; i < this.slices; i++) {
        var actualDegree = i * 2 * Math.PI / this.slices;
        var x = Math.cos(actualDegree);
        var y = Math.sin(actualDegree);
        this.vertices.push(x * this.radius);
        this.vertices.push(y * this.radius);
        this.vertices.push(0);

        this.texCoords.push(0.5 + 0.5* x, 0.5 - 0.5*y);

        this.normals.push(0);
        this.normals.push(0);
        this.normals.push(1);


    }

    for (var i = 0; i < this.slices ; i++) {

        if (i < this.slices-1){
          this.indices.push(0);
          this.indices.push(i + 1);
          this.indices.push(i + 2);
        }
        else{
          this.indices.push(0);
          this.indices.push(i + 1);
          this.indices.push(1);
        }
    }

  	this.primitiveType=this.scene.gl.TRIANGLES;
  	this.initGLBuffers();
}
