function MyVehicle(scene, patches) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.patches = [];
    for(var i = 0; i < patches.length; i++){
        this.patches.push(new MyPatch(scene,patches[i][1],patches[i][2],patches[i][3],patches[i][4],patches[i][5]));
    }
}

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.display = function(){
  for(var i = 0; i < this.patches.length; i++)
    this.patches[i].display();
};
