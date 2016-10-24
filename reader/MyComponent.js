/* Construtor da componente

	A componente contem a informacao das transformacoes, dos materiais, das texturas e das primitivas associadas a cada objeto*/
function MyComponent() {
	CGFscene.call(this);

	this.id = "";

	this.transformation_ref = "";
	this.matrix = null;
	this.matrix_b = null;

	this.translates = [];
	this.rotates = [];
	this.scales = [];

	this.materials = [];
	this.texture = "";

	this.children_comp = [];
	this.children_prim = [];
}

MyComponent.prototype = Object.create(CGFscene.prototype);
MyComponent.prototype.constructor = MyComponent;
