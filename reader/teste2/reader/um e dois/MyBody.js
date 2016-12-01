/* Construtor da parte lateral do cilindro */
function MyBody(scene, base, topo, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.topo = topo;
    this.base = base;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
    this.ang = Math.PI * 2 / this.slices;
    this.diference = (this.topo - this.base) / this.stacks;

    this.initBuffers();
}

MyBody.prototype = Object.create(CGFobject.prototype);
MyBody.prototype.constructor = MyBody;

/* Inicializa as caracteristicas do body do cilindro */
MyBody.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var increase = 2 * Math.PI / this.slices;
    var up = this.slices;
    var down = 0;

    var i = 0;


    for (var j = 0; j <= this.stacks; j++) {
        for (var i = 0; i <= this.slices; i++) {
            var actualDegree = i * 2 * Math.PI / this.slices;
            var x = Math.cos(actualDegree)* (this.base + j * this.diference) ;
            var y = Math.sin(actualDegree)* (this.base + j * this.diference) ;
            var z = j * this.height / this.stacks;

            this.vertices.push(x);
            this.vertices.push(y);
            this.vertices.push(z);

            this.texCoords.push(1 - i/this.slices, 1 - j/this.stacks);

            this.normals.push(x);
            this.normals.push(y);
            this.normals.push(0);


        }
    }

    for (var j = 0; j < this.stacks; j++) {
        for (var i = 0; i < this.slices; i++) {
              var p0 = (j * (this.slices + 1)) + i;
              var p1 = p0 + 1;
              var p2 = ((j+1) * (this.slices + 1)) + i;
              var p3 = p2 + 1;

              this.indices.push(p0, p1, p2);
              this.indices.push(p2, p1, p3);
        }
      }

    //console.log("num: " + num)

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
