//classe responsavel por simular um grafo
//Esta e' composta por 2 arrays. Um que tem os indices dos vertices, que serve para obter a posicao de uma componente no array de vertices
//o outro array contem todos os vertices da cena.
function MyGraph() {
	CGFscene.call(this);

	this.vertexIDs = [];
	this.vertexSet = [];
}

MyGraph.prototype = Object.create(CGFscene.prototype);
MyGraph.prototype.constructor = MyGraph;

//Esta funcao serve para percorrer todos os vertices/componentes da cena, e vai adicionar/criar referencias dos nós a vértices
//que estejam num escalão mais elevado no grafo.
//caso exista alguma componente que nao seja diretamente ou indiretamente nó do vértice "raiz", este vai ficar fora do grafo, nao podendo ser acedido
MyGraph.prototype.addEdges = function(){
	for(var i = 0;i< this.vertexSet.length; i++){
		var childs = this.vertexSet[i].component.children_comp;
		for(var j = 0; j < childs.length; j++){
			var indice = this.vertexIDs.indexOf(childs[j]);
			if(indice == -1){
				console.log("No'" + childs[j] + "nao existe, ou enganou-se no nome!");
				return -1;
			}
			this.vertexSet[i].derivates.push(this.vertexSet[indice]);
		}
	}
}

//inicializa uma dada primitiva, de um vertice
MyGraph.prototype.getPrimitives = function (vertex,primitive, info) {
    var prim;
    switch(info){
        case "rect":
            prim = new MyRectangle(this.scene, primitive[1], primitive[2], primitive[3], primitive[4]);
            break;
        case "tri":
            prim = new MyTriangle(this.scene, primitive[1], primitive[2], primitive[3], primitive[4], primitive[5], primitive[6], primitive[7], primitive[8], primitive[9]);
            break;
        case "cyl":
            prim = new MyCylinder(this.scene, primitive[1], primitive[2], primitive[3], primitive[4], primitive[5]);
            break;
        case "sph":
            prim = new MySphere(this.scene, primitive[1], primitive[2], primitive[3]);
            break;
        case "don":
            prim = new MyTorus(this.scene, primitive[1], primitive[2], primitive[3], primitive[4]);
            break;
        case "pla":
          	prim = new MyPlane(this.scene, primitive[1], primitive[2], primitive[3], primitive[4]);
            break;
        case "pat":
            prim = new MyPatch(this.scene, primitive[1], primitive[2], primitive[3], primitive[4], primitive[5]);
            break;
        case "car":
            prim = new MyVehicle(this.scene,primitive[1]);
            break;
        case "chess":
            prim = new ChessBoard(this.scene, primitive[1], primitive[2], primitive[3], primitive[4], primitive[5], primitive[6], primitive[7], primitive[8]);
            break;
        case "board":
            prim = new CageBoard(this.scene, primitive[1], primitive[2]);
            this.scene.cage = prim;
            break;
    }
    vertex.component.primitivess.push(prim);
}

//funcao responsavel por invocar a inicializacao das primitivas de um vertice/componente
MyGraph.prototype.initiatePrimitives = function (vertex) {
    if(vertex.component.animations.length != 0){
        this.scene.anim_component.push(vertex.component);
    }
    for(var i = 0; i < vertex.primitives.length; i++){
        this.getPrimitives(vertex,vertex.primitives[i],vertex.primitive_types[i]);
    }
    for(var i = 0; i < vertex.derivates.length; i++){
        this.initiatePrimitives(vertex.derivates[i]);
    }
}

//funcao que vai correr 1 vez em profundidade o grafo, para inicializar as primitivas de todos os vertices.
MyGraph.prototype.pesquisa_profundidade = function(vertexID, scene){
	var indice = this.vertexIDs.indexOf(vertexID);
	if(indice == -1){
		console.log("Nao encontrou a componente com indice" + vertexID);
		return -1;
	}
    this.scene = scene;
	for(var i = 0; i< this.vertexSet.length; i++)
	    this.vertexSet[i].visited = false;

    this.initiatePrimitives(this.vertexSet[indice]);

}
