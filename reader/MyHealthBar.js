/* Construtor do retangulo */
function MyHealthBar(scene, x1, y1, x2, y2) {
	CGFobject.call(this, scene);

	this.pieces = 50;
	this.long = x2;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.minS = 0;
	this.maxS = 1;
	this.minT = 0;
	this.maxT = 1;

	this.initBuffers();
}

MyHealthBar.prototype = Object.create(CGFobject.prototype);
MyHealthBar.prototype.constructor=MyHealthBar;

/* Inicializa as caracteristicas do retangulo */
MyHealthBar.prototype.initBuffers = function() {
	this.vertices = [
            this.x1, this.y1, 0,
            this.x2, this.y1, 0,
            this.x1, this.y2, 0,
            this.x2, this.y2, 0
			];

	this.indices = [
            0, 1, 2,
			3, 2, 1
        ];

	this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
	];

    this.texCoords = [
        this.minS, this.maxT,
        this.maxS, this.maxT,
        this.minS, this.minT,
        this.maxS, this.minT,
    ];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}

MyHealthBar.prototype.changeSize = function (){
		this.pieces--;
		this.x2 = (this.pieces)/50 * this.long;
		this.initBuffers();//?
}
