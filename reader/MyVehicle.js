/*
 Construtor para a primitiva Vehicle
 Esta vai receber como 2º argumento uma lista de pontos de controlo, a serem transformados em patches.
 Estas representam partes do veículo
 */
function MyVehicle(scene, patches) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.top_car = null;
    this.body_car = null;
    this.eyes_car = null;
    this.wheel = new MyTorus(this.scene,0.0,1,10,10);
    this.texture1 = new CGFtexture(this.scene,"scenes//textures//katchau2.png");
    this.texture2 = new CGFtexture(this.scene,"scenes//textures//eyes.jpg");
    this.texture3 = new CGFtexture(this.scene,"scenes//textures//top.jpg");
    this.texture4 = new CGFtexture(this.scene,"scenes//textures//wheel.png")
    //this.weed = every_day;
    for(var i = 0; i < patches.length; i++){
        if(patches[i][0] == "car1")
            this.body_car = new MyPatch(scene,patches[i][1],patches[i][2],patches[i][3],patches[i][4],patches[i][5]);
        if(patches[i][0] == "car2")
            this.top_car = new MyPatch(scene,patches[i][1],patches[i][2],patches[i][3],patches[i][4],patches[i][5]);
        if(patches[i][0] == "car3")
            this.eyes_car = new MyPatch(scene,patches[i][1],patches[i][2],patches[i][3],patches[i][4],patches[i][5]);

    }
}

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

/*
 Função de display da primitiva complexa Vehicle
 */
MyVehicle.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.texture1.bind(0);
    this.body_car.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0.8,-1);
    this.scene.scale(0.75,0.75,0.50);
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.texture3.bind(0);
    this.top_car.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.18,-0.1,0.1);
    this.scene.rotate(-Math.PI/24, 1, 0, 0);
    this.scene.scale(0.7,0.71,0.50);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.texture2.bind(0);
    this.eyes_car.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(1.3,-0.1,0.85);
    this.scene.scale(0.5,0.5,0.5);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.texture4.bind(0);
    this.wheel.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-1.3,-0.1,0.85);
    this.scene.scale(0.5,0.5,0.5);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.wheel.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(1.3,-0.1,-3.5);
    this.scene.scale(0.5,0.5,0.5);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.wheel.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-1.3,-0.1,-3.5);
    this.scene.scale(0.5,0.5,0.5);
    this.scene.rotate(Math.PI/2,0,1,0);
    this.wheel.display();
    this.scene.popMatrix();
};
