/* Construtor da esfera */
 function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;
	this.radius = radius;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

/* Inicializa as caracteristicas da esfera */
 MySphere.prototype.initBuffers = function() {
 	this.vertices = [];
	this.indices = [];
	this.normals = [];
  this.texCoords = [];


	var fi = Math.PI / this.stacks;
	var teta = (2 * Math.PI) / this.slices;
	var rect = Math.PI ;

	for(var i = 0; i < this.stacks; i++)
	{
		for(var j = 0; j < this.slices; j++)
		{
			var x = this.radius * Math.sin(rect - fi * i) * Math.cos(teta * j);
			var y = this.radius * Math.sin(rect - fi * i) * Math.sin(teta * j);
			var z = this.radius * Math.cos(rect - fi * i);

			this.vertices.push(x, y, z);
			this.normals.push(x, y, z);
      this.texCoords.push(1 - (i / this.stacks), 1 -(j / this.slices));
		}
	}


	var count = this.stacks * this.slices;


	var top = count;
	this.vertices.push(0,0,this.radius);
	this.normals.push(0,0,1);
  this.texCoords.push(0, 0);

	for(var i = 0; i < this.stacks; i++)
	{
		this.vertices.push(this.radius * Math.sin(rect - fi * i), 0, this.radius * Math.cos(rect - fi * i));
    this.texCoords.push(1 - (i / this.stacks), 0);
	}


	for(var i = 0; i < this.stacks - 1; i++)
	{
		for(var j = 0; j < this.slices - 1; j++)
		{
			this.indices.push(i * this.slices + j);
			this.indices.push(i * this.slices + j + 1);
			this.indices.push((i+1) * this.slices + j);
			this.indices.push((i+1) * this.slices + j);
			this.indices.push(i * this.slices + j + 1);
			this.indices.push((i+1) * this.slices + j+1);
		}
		this.indices.push((i + 1) * this.slices - 1);
		this.indices.push(i * this.slices);
		this.indices.push((i + 2) * this.slices - 1);
		this.indices.push((i + 2) * this.slices - 1);
		this.indices.push(i * this.slices);
		this.indices.push((i + 1) * this.slices);
	}

	var x = (this.stacks - 1) * this.slices;
	for(x; x < this.slices * this.stacks; x++)
	{
		this.indices.push(x, x + 1, top );
	}
	this.indices.push(this.stacks  * this.slices - 1, (this.stacks - 1) * this.slices, top);



 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
