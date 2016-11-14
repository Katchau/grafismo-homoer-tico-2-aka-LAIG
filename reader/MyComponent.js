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
    this.tempo_dec = 0;
}

MyComponent.prototype = Object.create(CGFscene.prototype);
MyComponent.prototype.constructor = MyComponent;

MyComponent.prototype.update = function(currTime){
    if(this.animations.length != 0){
        this.tempovar = (currTime - this.tempo)/1000;
        if(this.tempo == 0){
            this.tempovar = 0;
        }
        this.tempo = currTime;
        this.tempo_dec += this.tempovar;
        for(var i = 0; i < this.animations.length; i++){
            var anime = this.animations[i];

            if(anime instanceof LinearAnimation){
                for(var j =0; j< anime.cPoints.length;j++){
                    if(anime.times[j] > this.tempo_dec && anime.next_anim[j]){
                        anime.translate.x += anime.walk_d[j][0] * this.tempovar;
                        anime.translate.y += anime.walk_d[j][1] * this.tempovar;
                        anime.translate.z += anime.walk_d[j][2] * this.tempovar;
                        console.log(anime.translate);
                    }
                    else if(anime.times[j] <= this.tempo_dec) anime.next_anim[j+1]= true;
                }
            }
        }

    }
}