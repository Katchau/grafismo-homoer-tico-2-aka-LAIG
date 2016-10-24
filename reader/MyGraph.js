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


MyGraph.prototype.pesquisa_profundidade = function(vertexID){
	var indice = this.vertexIDs.indexOf(vertexID);
	if(indice == -1){
		console.log("Nao encontrou a componente com indice" + vertexID);
		return -1;
	}

	for(var i = 0; i< this.vertexSet.length; i++)
	    this.vertexSet[i].visited = false;
	
}

