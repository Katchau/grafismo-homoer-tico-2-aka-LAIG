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
	this.animations = [];

	this.primitivess = [];
	this.children_comp = [];
	this.children_prim = [];

    this.tempo = 0;
}

MyComponent.prototype = Object.create(CGFscene.prototype);
MyComponent.prototype.constructor = MyComponent;

MyComponent.prototype.update = function(currTime){
    if(this.animations.length != 0){
        this.tempovar = currTime - this.tempo;
        if(this.tempo == 0){
            this.tempovar = 0;
        }
        this.tempo = currTime;

        for(var i = 0; i < this.animations.length; i++){
            var anime = this.animations[i];
            if(anime instanceof LinearAnimation){
                for(var j =0; j< anime.cPoints.length; j++){
                    var distance = this.tempo * anime.speed;
                    //todo falta acabar isto (falta calcular quanto é que tem de andar em cada interrupcao, e quando é q começa o proximo

                }
            }
        }

    }
}