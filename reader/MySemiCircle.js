/**
 * MySemiCircle
 * @constructor
 */
function MySemiCircle(scene, slices, stacks) {
	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;
	this.ang = Math.PI * 2 / this.slices;
	this.initBuffers();
};

MySemiCircle.prototype = Object.create(CGFobject.prototype);
MySemiCircle.prototype.constructor = MySemiCircle;

MySemiCircle.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	
	var i;
	var j;
	var tamanhovetor = 0;
	var azimute = (Math.PI/2)/this.stacks;
	
	for(j=0;j<this.stacks;j+=1)
	{
		var cenas = this.slices;
		for (i = 0; i <= this.slices; i++) {
		this.vertices.push(Math.sin(azimute*j)*Math.cos(this.ang * i),Math.sin(azimute*j)*Math.sin(this.ang * i), -Math.cos(azimute*j));
		this.vertices.push(Math.sin(azimute*(j+1))*Math.cos(this.ang * i),Math.sin(azimute*(j+1))*Math.sin(this.ang * i), -Math.cos(azimute*(j+1)));
		this.texCoords.push(cenas/this.slices,j/this.stacks);
		this.texCoords.push(cenas/this.slices,(j+1)/this.stacks);
		cenas--;
	}
	for (i = 0; i < this.slices*2 ; i += 2) {
		this.indices.push(i + 1 + tamanhovetor, i+ tamanhovetor, i + tamanhovetor + 2);
		this.indices.push(i + tamanhovetor + 2, i + 3 + tamanhovetor, i + 1 + tamanhovetor);
	} 
	//this.indices.push(i + tamanhovetor+ 1, i + tamanhovetor, tamanhovetor);
	//this.indices.push(tamanhovetor, tamanhovetor+1, i + tamanhovetor + 1);
	
	tamanhovetor += this.slices*2+2;
	
	for(i = 0;i<=this.slices;i++)
	{
		this.normals.push(Math.sin(azimute*j)*Math.cos(this.ang * i),Math.sin(azimute*j)*Math.sin(this.ang * i), -Math.cos(azimute*j));
		this.normals.push(Math.sin(azimute*(j+1))*Math.cos(this.ang * i),Math.sin(azimute*(j+1))*Math.sin(this.ang * i), -Math.cos(azimute*(j+1)));
	}
	
	}
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};