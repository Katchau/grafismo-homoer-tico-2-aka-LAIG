/* Construtor da Pokebola*/
function PlayBox(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.rectangle = new MyRectangle(scene,0,0,11,11);
    this.botao = new MyRectangle(scene,0,0,8,2);


    this.menut = new CGFtexture(this.scene, "scenes//textures//menubackground.png");
    this.multiPlayer = new CGFtexture(this.scene, "scenes//textures//multiplayer.png");
    this.singlePlayer = new CGFtexture(this.scene, "scenes//textures//singleplayer.png");
    this.god = new CGFtexture(this.scene, "scenes//textures//hard.png");
    this.izi = new CGFtexture(this.scene, "scenes//textures//easy.png");

    this.blackMat = new CGFappearance(this.scene);
    this.blackMat.setAmbient(0.2,0.2,0.2,1);
    this.blackMat.setDiffuse(0,0,0,0);
    this.blackMat.setSpecular(1,1,1,1);
    this.blackMat.setShininess(10);
    this.whiteMat = new CGFappearance(this.scene);
    this.whiteMat.setAmbient(0.2,0.2,0.2,1);
    this.whiteMat.setDiffuse(1,1,1,1);
    this.whiteMat.setSpecular(1,1,1,1);
    this.whiteMat.setShininess(10);


    this.timer = new MyTimer(this.scene);
    this.scene.timer = this.timer;

    this.garbage_can = [];

    this.scene.playbox = this;

    // this.texture = new CGFtexture(this.scene, "scenes//textures//pokebottom.png");
    // this.texture2 = new CGFtexture(this.scene, "scenes//textures//pokefront.png");
}


PlayBox.prototype = Object.create(CGFobject.prototype);
PlayBox.prototype.constructor = PlayBox;

PlayBox.prototype.pushGarbage = function(garbage){
   for(var i = 0; i < this.garbage_can.length; i++){
       if(this.garbage_can[i].length > 9 && (i+1) == this.garbage_can.length){
           this.garbage_can[i+1] = [];
           this.garbage_can[i+1].push(garbage);
           return;
       }
       else if(this.garbage_can[i].length > 0 && this.garbage_can[i].length < 10){
           this.garbage_can[i].push(garbage);
           return;
       }
   }
   this.garbage_can[0] = [];
   this.garbage_can[0].push(garbage);
};

PlayBox.prototype.checkClicks = function(){
    var ret = false;
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj) {
                    var customId = this.scene.pickResults[i][1];
                    ret = customId;
                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
            return ret;
        }
    }
};

/* Inicializa as caracteristicas do Torus */
PlayBox.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.translate(11,0,22);
    this.scene.scale(2,2,2);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.whiteMat.setTexture(this.menut);
    this.whiteMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0,22);
    this.scene.scale(1,2,2);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,13.2,22.2);
    this.scene.scale(2.2,2.2,1);
    this.timer.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(11,0,0);
    this.scene.scale(1,2,2);
    this.scene.rotate(Math.PI,0,1,0);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(2,2,2);
    this.scene.rotate(-Math.PI/2,0,1,0);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.registerForPick(691,this.botao);
    this.scene.translate(11.1,12,20);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.whiteMat.setTexture(this.multiPlayer);
    this.whiteMat.apply();
    this.botao.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.registerForPick(693,this.botao);
    this.scene.translate(11.1,6,20);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.whiteMat.setTexture(this.izi);
    this.whiteMat.apply();
    this.botao.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.registerForPick(692,this.botao);
    this.scene.translate(11.1,12,10);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.whiteMat.setTexture(this.singlePlayer);
    this.whiteMat.apply();
    this.botao.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.registerForPick(694,this.botao);
    this.scene.translate(11.1,6,10);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.whiteMat.setTexture(this.god);
    this.whiteMat.apply();
    this.botao.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,22,22);
    this.scene.scale(1,2,2);
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.blackMat.apply();
    this.rectangle.display();
    this.scene.popMatrix();

    for(var i = 0;i < this.garbage_can.length; i++){
        for(var j = 0; j < this.garbage_can[i].length; j++){
            if(this.scene.cage != null){
                this.scene.pushMatrix();
                this.scene.translate(j+1,23,20.5-i);
                if(this.garbage_can[i][j] =='x') this.scene.cage.piece1.apply();
                else this.scene.cage.piece2.apply();
                this.scene.cage.piece.display();
                this.scene.popMatrix();
            }
        }
    }
    this.scene.clearPickRegistration();
};
