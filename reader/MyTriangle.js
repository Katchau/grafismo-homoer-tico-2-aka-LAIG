/* Construtor do triangulo */
function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	CGFobject.call(this, scene);

	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.x3 = x3;
	this.y3 = y3;
	this.z3 = z3;
	this.maxS = 1;
	this.maxT = 1;
	this.initBuffers();
}

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;
/* Inicializa as caracteristicas do triangulo */
MyTriangle.prototype.initBuffers = function() {
	this.vertices = [
			this.x1, this.y1, this.z1,
			this.x2, this.y2, this.z2,
			this.x3, this.y3, this.z3
	];

	this.indices = [
			0, 1, 2
	];

	var nx = (this.y2 - this.y1) * (this.z3 - this.z1) - (this.z2 - this.z1) * (this.y3 - this.y1);
	var ny = (this.z2 - this.z1) * (this.x3 - this.x1) - (this.x2 - this.x1) * (this.z3 - this.z1);
	var nz = (this.x2 - this.x1) * (this.y3 - this.y1) - (this.y2 - this.y1) * (this.x3 - this.x1);

	this.normals = [
			nx, ny, nz,
			nx, ny, nz,
			nx, ny, nz
	];

	var a = Math.sqrt((this.x3-this.x2)*(this.x3-this.x2) + (this.y3-this.y2)*(this.y3-this.y2) + (this.z3-this.z2)*(this.z3-this.z2));
	var b = Math.sqrt((this.x1-this.x3)*(this.x1-this.x3) + (this.y1-this.y3)*(this.y1-this.y3) + (this.z1-this.z3)*(this.z1-this.z3));
	var c = Math.sqrt((this.x2-this.x1)*(this.x2-this.x1) + (this.y2-this.y1)*(this.y2-this.y1) + (this.z2-this.z1)*(this.z2-this.z1));

	var cosA = (-(a*a) + (b*b) + (c*c))/(2*b*c);
	var cosB= ((a*a) + (b*b) - (c*c))/(2*a*b);
	var cosC = ((a*a) - (b*b) + (c*c))/(2*a*c);

	var senC = 1 - (cosC*cosC);

    this.texCoords = [
        c - (a * cosC)*this.maxS, a * senC*this.maxT,
        0, 1*this.maxT,
        c*this.maxS, 0
    ];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}

/* Mediante a textura aplicada altera o 's' e o 't' das texCoords */
MyTriangle.prototype.changeTextCoords = function (maxS, maxT) {
	this.maxS = maxS;
	this.maxT = maxT;
    this.initBuffers();
}
