/* Construtor do Torus */
function MyTorus(scene, inner, outer, slices, loops) {
    CGFobject.call(this, scene);

    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.stacks = loops;

    this.initBuffers();
};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

/* Inicializa as caracteristicas do Torus */
MyTorus.prototype.initBuffers = function() {

  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];

  var r = (this.outer - this.inner) / 2;
  var R = this.inner + r;

  for (var i = 0; i <= this.stacks; i++) {
      var u = i * 2 * Math.PI / this.stacks;

      for (var j = 0; j <= this.slices; j++) {
          var v = j * 2 * Math.PI / this.slices;

          var x = (R + (r * Math.cos(u))) * Math.cos(v);
          var y = (R + (r * Math.cos(u))) * Math.sin(v);
          var z = r * Math.sin(u);

          this.vertices.push(x, y, z);
          this.normals.push(x, y, z);
          this.texCoords.push(1 - (i / this.stacks), 1 -(j / this.slices));
      }
  }

  for (var k = 0; k < this.stacks; k++) {
      for (var w = 0; w < this.slices; w++) {
          this.indices.push((k * (this.slices + 1)) + w, ((k * (this.slices + 1)) + w) + this.slices + 2, ((k * (this.slices + 1)) + w) + this.slices + 1);
          this.indices.push((k * (this.slices + 1)) + w, ((k * (this.slices + 1)) + w) + 1, ((k * (this.slices + 1)) + w) + this.slices + 2);
      }
  }


      this.primitiveType = this.scene.gl.TRIANGLES;
      this.initGLBuffers();
};
