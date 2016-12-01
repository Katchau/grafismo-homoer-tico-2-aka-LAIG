
//classe responsavel por simular um vertice do grafo.
//cada vertice corresponde a uma componente do dsx, contendo informacao diversa deste
//Dentro desta pode-se obter referências dos nós do vértice, que correspondem a componentes mais simples
//bem como pode conter primitivas, caso seja uma componente mais simples.
function MyVertex() {
	CGFscene.call(this);
	this.component = null;
	this.derivates = [];
	this.visited = false;
	this.primitives = [];
	this.primitive_types = [];
	this.needs_recalc = false;
}

MyVertex.prototype = Object.create(CGFscene.prototype);
MyVertex.prototype.constructor = MyVertex;