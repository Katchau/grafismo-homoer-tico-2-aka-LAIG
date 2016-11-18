function MyVehicle(scene, patches) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.patches = patches;
}

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.display = function(){
  for(var i = 0; i < this.patches.length; i++)
    this.patches[i].display();
};
