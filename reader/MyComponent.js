/* Construtor da componente

	A componente contem a informacao das transformacoes, dos materiais, das texturas e das primitivas associadas a cada objeto*/
function MyComponent() {
	CGFscene.call(this);

	this.id = "";

	this.transformation_ref = "";
	this.matrix = null;
	this.matrix_b = null;
    this.origin = null;

	this.translates = [];
	this.rotates = [];
	this.scales = [];

	this.materials = [];
	this.texture = "";
	this.animations = [];
    this.curr_anim = 0;

	this.primitivess = [];
	this.children_comp = [];
	this.children_prim = [];

    this.tempo_dec = 0;
}

MyComponent.prototype = Object.create(CGFscene.prototype);
MyComponent.prototype.constructor = MyComponent;

MyComponent.prototype.update = function(tempovar){
    this.tempo_dec += tempovar;
    if(this.animations.length != 0){
        if(this.curr_anim < this.animations.length){
            var i = this.curr_anim;
            var anime = this.animations[i];
            if(anime instanceof LinearAnimation){
                for(var j =0; j< anime.cPoints.length;j++){
                    if(anime.times[j] > this.tempo_dec && anime.next_anim[j]){
                        anime.translate.x += anime.walk_d[j][0] * tempovar;
                        anime.translate.y += anime.walk_d[j][1] * tempovar;
                        anime.translate.z += anime.walk_d[j][2] * tempovar;
                    }
                    else if(anime.times[j] <= this.tempo_dec){
                        anime.next_anim[j+1]= true;
                        if(j+1 != anime.cPoints.length)anime.rotate = anime.angles[j+1];
                        else{
                            this.curr_anim++;
                            this.tempo_dec = 0;
                            if(this.curr_anim < this.animations.length)
                                if(this.animations[i+1] instanceof LinearAnimation)this.animations[i+1].translate = anime.translate;
                        }
                    }
                }
            }
            else if(anime instanceof CircularAnimation){
                if(anime.time > this.tempo_dec){
                    anime.ang_ant = anime.angle_temp;
                    anime.angle_temp += (anime.angle_per_it) * tempovar;
                }
                else {
					this.curr_anim++;
                    this.tempo_dec = 0;
                    if(this.curr_anim < this.animations.length)
                        if(this.animations[i+1] instanceof LinearAnimation)
                            this.animations[i+1].translate = new Point(anime.final_point.x-this.origin.x, anime.final_point.y-this.origin.y, anime.final_point.z-this.origin.z);
				}
            }

        }
    }
}
